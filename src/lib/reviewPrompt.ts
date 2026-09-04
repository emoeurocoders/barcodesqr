/**
 * When to ask for a review.
 *
 * The rule, as specified by the PM:
 *
 *   Eligible after paid account activation AND the first successful QR
 *   download. Display on the next Dashboard/member-page view FOLLOWING the
 *   download — never interrupting creation or the download itself. If
 *   dismissed, suppress for 21 days and show at most one more time. If
 *   submitted, suppress permanently.
 *
 * The reasoning behind the delay is worth keeping: asking straight after
 * payment reads as "I just gave you money, now you want a favour", while
 * asking after the download reads as "I got what I came for". So the download
 * only marks eligibility; the asking happens on the next member-page view.
 *
 * ── WHERE THIS IS NOT YET WIRED ──────────────────────────────────────────
 * Two signals do not exist in the product yet, and both are marked in the
 * code that will produce them:
 *
 *   1. PAID ACTIVATION — checkout does not complete a real payment yet. The
 *      gate takes `paid` from the server, which reads `user.plan !== "free"`,
 *      so it starts working the moment billing sets that column.
 *   2. SUCCESSFUL DOWNLOAD — step 3 of the creator, which owns the download
 *      buttons, is shelved. `markDownloaded()` is what the download handler
 *      must call; see the shelved block in CreateWizard.tsx.
 *
 * Until both land the modal never appears on its own, which is the correct
 * behaviour rather than a stub.
 *
 * ── WHERE THE STATE LIVES ────────────────────────────────────────────────
 * localStorage, for now. That is honest about what exists: the download is a
 * client-side event and there is no table to write it to. It has real limits —
 * per-device, so "never ask again" does not follow a user to their phone, and
 * clearing site data resets it.
 *
 * Move it to the user row when the download becomes a server event. The shape
 * below is deliberately small and serialisable so that migration is a change
 * of `load`/`save` and nothing else.
 */

const KEY = "bqr.review-prompt.v1";

/** Suppression window after a dismissal. */
const SUPPRESS_DAYS = 21;

/** One initial ask, then at most one more. */
const MAX_PROMPTS = 2;

const DAY = 24 * 60 * 60 * 1000;

export type ReviewPromptState = {
  /** When the first successful download happened. Unset means not eligible. */
  downloadedAt?: number;
  /** How many times the modal has been shown and dismissed. */
  dismissals: number;
  /** Epoch ms before which it must not be shown again. */
  suppressedUntil?: number;
  /** Set once feedback is submitted; the prompt never returns. */
  submittedAt?: number;
};

const EMPTY: ReviewPromptState = { dismissals: 0 };

export function load(): ReviewPromptState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const v = JSON.parse(raw) as ReviewPromptState;
    return typeof v?.dismissals === "number" ? v : EMPTY;
  } catch {
    // Corrupt or unavailable storage should never break the dashboard.
    return EMPTY;
  }
}

function save(state: ReviewPromptState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode, quota — the prompt simply asks again next time */
  }
}

/**
 * Should the modal open on this member-page view?
 *
 * `paid` comes from the server rather than storage, because entitlement is the
 * database's answer and a client flag would be trivially forgeable.
 */
export function shouldPrompt(
  state: ReviewPromptState,
  paid: boolean,
  now = Date.now(),
): boolean {
  if (!paid) return false;
  if (state.submittedAt) return false;
  if (!state.downloadedAt) return false;
  if (state.dismissals >= MAX_PROMPTS) return false;
  if (state.suppressedUntil && now < state.suppressedUntil) return false;
  return true;
}

/**
 * Record the first successful QR download.
 *
 * Call this from the download handler — NOT from the paywall. Later downloads
 * are ignored: the first one is the trigger, and re-arming on every download
 * would nag someone who downloads ten codes in a session.
 */
export function markDownloaded(now = Date.now()) {
  const state = load();
  if (state.downloadedAt) return;
  save({ ...state, downloadedAt: now });
}

/** "Maybe later" or the X: back off 21 days, and only one more attempt. */
export function markDismissed(now = Date.now()) {
  const state = load();
  save({
    ...state,
    dismissals: state.dismissals + 1,
    suppressedUntil: now + SUPPRESS_DAYS * DAY,
  });
}

/** Feedback submitted: never ask again on this device. */
export function markSubmitted(now = Date.now()) {
  save({ ...load(), submittedAt: now });
}
