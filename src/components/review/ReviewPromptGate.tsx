"use client";

import { useState, useSyncExternalStore } from "react";

import {
  load,
  markDismissed,
  markSubmitted,
  shouldPrompt,
} from "@/lib/reviewPrompt";
import { ReviewModal, type ReviewFeedback } from "./ReviewModal";

/**
 * Opens the review modal on a member page when the rules in
 * `lib/reviewPrompt.ts` say it is time.
 *
 * Mounted on the dashboard rather than in the creator, because the ask must
 * land on the view AFTER the download rather than on top of it.
 *
 * The decision reads localStorage, which the server cannot see, so it goes
 * through `useSyncExternalStore` — that is what it is for, and it keeps the
 * server's snapshot (`false`, render nothing) separate from the client's
 * without an effect that sets state on mount and re-renders twice.
 */

/** Storage does not change under us within a view; only this tab writes it. */
const subscribe = () => () => {};
const serverSnapshot = () => false;

export function ReviewPromptGate({ paid }: { paid: boolean }) {
  const eligible = useSyncExternalStore(
    subscribe,
    () => shouldPrompt(load(), paid),
    serverSnapshot,
  );
  const [closed, setClosed] = useState(false);

  if (!eligible || closed) return null;

  return (
    <ReviewModal
      onDismiss={() => {
        markDismissed();
        setClosed(true);
      }}
      onSubmit={(feedback: ReviewFeedback) => {
        markSubmitted();
        setClosed(true);
        // TODO(feedback-store): nothing receives this yet. When there is
        // somewhere to put it — a table, or the support inbox — POST it here,
        // and move `markSubmitted` to the success path so a failed send does
        // not silently lose the review AND suppress the prompt for good.
        console.info("review feedback", feedback);
      }}
    />
  );
}
