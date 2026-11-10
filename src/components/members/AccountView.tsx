"use client";

import { useRef, useState, useSyncExternalStore } from "react";

import { changePassword, deleteAccount, updatePreferences, updateProfile } from "@/app/actions/account";
import { countries } from "@/lib/countries";
import { Actions, Card, CardHead, Field, KeyValues, Link, Message, Note, PageTop, Row, Spinner, btn, inputCls, linkCls, selectCls, useForm } from "./ui";

/**
 * member_myaccount.html, connected (JB, Monday 5709834361). Tabs scroll to
 * their card, as the file's script does. What the backend cannot do yet is
 * said plainly rather than drawn as a button that does nothing (JB): 2FA and
 * email reports.
 */

export type AccountData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  timezone: string;
  hasPassword: boolean;
  passwordUpdatedAt: string | null;
  /** "changed" / "invalid" after an email-change link. */
  emailResult?: string;
};

type Result = { ok: true; note?: string } | { ok: false; error: string; fields?: Record<string, string> } | undefined;

const ico = {
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  gear: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
  warn: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  ),
  sliders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 4h-7" />
      <path d="M10 4H3" />
      <path d="M21 12h-9" />
      <path d="M8 12H3" />
      <path d="M21 20h-5" />
      <path d="M12 20H3" />
      <path d="M14 2v4" />
      <path d="M8 10v4" />
      <path d="M16 18v4" />
    </svg>
  ),
};

const noop = () => () => {};
const browserZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
};

/** Every zone the browser knows, the customer's own first. */
function zones(current: string) {
  let all: string[] = [];
  try {
    all = (Intl as unknown as { supportedValuesOf: (k: string) => string[] }).supportedValuesOf("timeZone");
  } catch {
    all = [];
  }
  return current && !all.includes(current) ? [current, ...all] : all;
}

/* ---- Profile --------------------------------------------------------------- */

function ProfileCard({ d }: { d: AccountData }) {
  const [state, run, busy] = useForm(updateProfile, undefined as Result);
  const f = state && !state.ok ? state.fields ?? {} : {};
  // Their script: any edit clears the last result line (until the next save).
  const [cleared, setCleared] = useState<Result>(undefined);
  const shown = !!state && cleared !== state;
  const touch = () => setCleared(state);

  return (
    <Card id="accProfile">
      <CardHead icon={ico.user} tone="teal" title="Profile Information" sub="Manage your personal and company details." />
      <form onSubmit={run} onInput={touch} className="mt-[18px]" noValidate>
        <Row>
          <Field id="accFirst" label="First name" error={f.firstName}>
            <input id="accFirst" name="firstName" defaultValue={d.firstName} autoComplete="given-name" required className={inputCls(f.firstName)} />
          </Field>
          <Field id="accLast" label="Last name" error={f.lastName}>
            <input id="accLast" name="lastName" defaultValue={d.lastName} autoComplete="family-name" required className={inputCls(f.lastName)} />
          </Field>
        </Row>
        <Row one>
          <Field id="accEmail" label="Email address" error={f.email}>
            <input id="accEmail" type="email" name="email" defaultValue={d.email} autoComplete="email" required className={inputCls(f.email)} />
          </Field>
        </Row>
        <Row one>
          <Field id="accPhone" label="Phone number" optional error={f.phone}>
            <input id="accPhone" type="tel" name="phone" defaultValue={d.phone} autoComplete="tel" className={inputCls(f.phone)} />
          </Field>
        </Row>
        <Row>
          <Field id="accCompany" label="Company name" optional>
            <input id="accCompany" name="company" defaultValue={d.company} autoComplete="organization" className={inputCls()} />
          </Field>
          <Field id="accCountry" label="Country" error={f.country}>
            <select id="accCountry" name="country" defaultValue={d.country} required className={selectCls(f.country)}>
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </Row>
        <Actions className="mt-[22px]">
          <button type="submit" disabled={busy} className={btn("primary")}>
            {busy && <Spinner />}
            Save Changes
          </button>
          {shown && state?.ok && <Message ok>{state.note ?? "Your profile has been updated."}</Message>}
          {shown && state && !state.ok && <Message ok={false}>{state.error === "Please check the highlighted fields." ? "We couldn't save your changes. Please try again." : state.error}</Message>}
        </Actions>
        {d.emailResult === "changed" && <Note>Your sign-in email has been changed.</Note>}
        {d.emailResult === "invalid" && <Note>That email-change link has expired or was already used. Change your email again to get a new one.</Note>}
      </form>
    </Card>
  );
}

/* ---- Account actions (delete) ------------------------------------------------ */

function ActionsCard({ hasPassword }: { hasPassword: boolean }) {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");
  const [state, run, busy] = useForm(deleteAccount, undefined as Result);
  const opener = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLFormElement>(null);
  const f = state && !state.ok ? state.fields ?? {} : {};
  const toggle = (v: boolean) => {
    setOpen(v);
    setWord("");
    if (v) requestAnimationFrame(() => {
      panel.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      field.current?.focus();
    });
    else requestAnimationFrame(() => opener.current?.focus());
  };

  return (
    <Card>
      <CardHead icon={ico.gear} tone="purple" title="Account Actions" />
      <div className="mt-[16px] flex items-center border-t border-[#e2e6ec] pt-[18px] max-[576px]:flex-wrap">
        <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[12px] bg-[#fef2f2] text-[#dc2626] [&>svg]:h-[22px] [&>svg]:w-[22px]">{ico.trash}</div>
        <div className="min-w-0 flex-1 pr-[16px] pl-[14px] max-[576px]:pr-0">
          <h3 className="text-[15px] font-bold text-[#0e1311]">Delete account</h3>
          <p className="mt-[0.25em] text-[13px] leading-[1.45em] text-[#6b7280] max-[576px]:font-medium">
            Permanently delete your account and all associated QR codes, data, and settings. This action can&apos;t be undone.
          </p>
        </div>
        {/* First click only opens the panel; the panel's own form deletes. */}
        <button
          ref={opener}
          type="button"
          aria-expanded={open}
          aria-controls="accDelCnf"
          onClick={() => toggle(true)}
          className={`${btn("redOutline", "sm")} shrink-0 max-[576px]:mt-[14px] max-[576px]:flex-[1_0_100%] ${open ? "pointer-events-none opacity-45" : ""}`}
        >
          Delete Account
        </button>
      </div>
      {open && (
        <form
          ref={panel}
          id="accDelCnf"
          onSubmit={run}
          onKeyDown={(e) => e.key === "Escape" && toggle(false)}
          className="mt-[18px] rounded-[14px] border border-[#f5cdcd] bg-[#fef7f7] px-[20px] pt-[18px] pb-[20px] max-[576px]:px-[16px] max-[576px]:pt-[16px] max-[576px]:pb-[18px]"
        >
          <h4 className="flex items-center text-[15.5px] font-bold text-[#0e1311] [&>svg]:mr-[0.5em] [&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:shrink-0 [&>svg]:text-[#dc2626]">
            {ico.warn}
            Delete your account permanently?
          </h4>
          <ul className="mt-[10px] [&>li]:relative [&>li]:pl-[16px] [&>li]:text-[14px] [&>li]:leading-[1.5em] [&>li]:text-[#374151] [&>li+li]:mt-[6px] [&>li]:before:absolute [&>li]:before:top-[0.62em] [&>li]:before:left-[3px] [&>li]:before:h-[5px] [&>li]:before:w-[5px] [&>li]:before:rounded-full [&>li]:before:bg-[#9ca3af] [&>li]:before:content-[''] [&_b]:font-semibold [&_b]:text-[#0e1311]">
            <li>
              <b>Your QR codes are deleted.</b> Codes you have already printed or shared will stop working.
            </li>
            <li>
              <b>Your stored data is removed.</b> Scan statistics, templates and account settings can&apos;t be recovered.
            </li>
            <li>
              <b>This can&apos;t be undone.</b> If you only want to stop payments, cancel your plan in{" "}
              <Link href="/billing" className={linkCls}>
                Billing &amp; Subscription
              </Link>{" "}
              instead.
            </li>
          </ul>
          <div className="mt-[14px]">
            <label htmlFor="accDelWord" className="block text-[14px] font-semibold text-[#0e1311]">
              Type DELETE to confirm
            </label>
            <input
              ref={field}
              id="accDelWord"
              name="confirm"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className={`${inputCls(f.confirm)} max-w-[260px] max-[576px]:max-w-none`}
            />
            {f.confirm && <small className="mt-[6px] block text-[12.5px] font-medium text-[#dc2626]">{f.confirm}</small>}
          </div>
          {/* Unmocked: an account with a password proves it once more. */}
          {hasPassword && (
            <div className="mt-[14px]">
              <label htmlFor="accDelPwd" className="block text-[14px] font-semibold text-[#0e1311]">
                Your password
              </label>
              <input id="accDelPwd" type="password" name="password" autoComplete="current-password" className={`${inputCls(f.password)} max-w-[260px] max-[576px]:max-w-none`} />
              {f.password && <small className="mt-[6px] block text-[12.5px] font-medium text-[#dc2626]">{f.password}</small>}
            </div>
          )}
          <Actions className="mt-[16px]">
            <button type="button" onClick={() => toggle(false)} className={btn("grey")}>
              Keep My Account
            </button>
            <button type="submit" disabled={word.trim().toUpperCase() !== "DELETE" || busy} className={btn("red")}>
              {busy && <Spinner />}
              Permanently Delete Account
            </button>
          </Actions>
          {state && !state.ok && !f.confirm && !f.password && <div className="mt-[12px]"><Message ok={false}>{state.error}</Message></div>}
        </form>
      )}
    </Card>
  );
}

/* ---- Security --------------------------------------------------------------- */

function since(iso: string | null) {
  if (!iso) return null;
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return days <= 0 ? "Last updated today" : `Last updated ${days} day${days === 1 ? "" : "s"} ago`;
}

function SecurityCard({ d }: { d: AccountData }) {
  const [open, setOpen] = useState(false);
  const [state, run, busy] = useForm(async (prev: Result, form: FormData) => {
    const r = await changePassword(prev, form);
    if (r.ok) setOpen(false);
    return r;
  }, undefined as Result);
  const f = state && !state.ok ? state.fields ?? {} : {};
  const row = "flex items-center py-[11px] last:pb-0 [&+&]:border-t [&+&]:border-[#e2e6ec] max-[480px]:flex-wrap";
  const txt = "flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-[14px] gap-y-[2px] pr-[14px] max-[480px]:flex-[1_0_100%] max-[480px]:pr-0";
  return (
    <Card id="accSecurity">
      <CardHead icon={ico.shield} tone="teal" title="Security" />
      <ul className="mt-[12px]">
        <li className={row}>
          <div className={txt}>
            <p className="text-[15px] font-semibold text-[#0e1311]">Password</p>
            <p className="text-[13.5px] text-[#6b7280] max-[576px]:font-medium">
              {d.hasPassword || state?.ok ? since(state?.ok ? new Date().toISOString() : d.passwordUpdatedAt) ?? "Set" : "Not set — you sign in by email link or Google"}
            </p>
          </div>
          <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className={`${btn("outline", "sm")} shrink-0 max-[480px]:mt-[10px]`}>
            {d.hasPassword ? "Change Password" : "Set Password"}
          </button>
        </li>
        <li className={row}>
          <div className={txt}>
            <p className="text-[15px] font-semibold text-[#0e1311]">Two-factor authentication</p>
            {/* Not built (JB: say so rather than show a dead button). */}
            <p className="text-[13.5px] text-[#6b7280] max-[576px]:font-medium">Not available yet</p>
          </div>
        </li>
      </ul>
      {state?.ok && !open && <div className="mt-[14px]"><Message ok>{state.note}</Message></div>}
      {/* Unmocked: the file's button leads nowhere; the confirm-panel look. */}
      {open && (
        <form onSubmit={run} onKeyDown={(e) => e.key === "Escape" && setOpen(false)} className="mt-[18px] rounded-[14px] border border-[#dae0e8] bg-[#f8f9fb] px-[20px] pt-[18px] pb-[20px] max-[576px]:px-[16px]">
          <h4 className="text-[15.5px] font-bold text-[#0e1311]">{d.hasPassword ? "Change your password" : "Set a password"}</h4>
          {!d.hasPassword && <Note>You can then sign in with your email and this password, as well as by email link or Google.</Note>}
          {d.hasPassword && (
            <div className="mt-[14px]">
              <Field id="pwCur" label="Current password" error={f.current}>
                <input id="pwCur" type="password" name="current" autoComplete="current-password" className={inputCls(f.current)} />
              </Field>
            </div>
          )}
          <div className="mt-[14px]">
            <Field id="pwNew" label="New password" error={f.next}>
              <input id="pwNew" type="password" name="next" autoComplete="new-password" minLength={8} className={inputCls(f.next)} />
            </Field>
          </div>
          <div className="mt-[14px]">
            <Field id="pwConf" label="Confirm new password" error={f.confirm}>
              <input id="pwConf" type="password" name="confirm" autoComplete="new-password" className={inputCls(f.confirm)} />
            </Field>
          </div>
          <Actions className="mt-[16px]">
            <button type="button" onClick={() => setOpen(false)} className={btn("grey")}>
              Cancel
            </button>
            <button type="submit" disabled={busy} className={btn("primary")}>
              {busy && <Spinner />}
              {d.hasPassword ? "Change Password" : "Set Password"}
            </button>
          </Actions>
        </form>
      )}
    </Card>
  );
}

/* ---- Preferences ------------------------------------------------------------ */

function PreferencesCard({ d }: { d: AccountData }) {
  const [edit, setEdit] = useState(false);
  const [tz, setTz] = useState(d.timezone);
  const [state, run, busy] = useForm(async (prev: Result, form: FormData) => {
    const r = await updatePreferences(prev, form);
    if (r.ok) setEdit(false);
    return r;
  }, undefined as Result);
  const here = useSyncExternalStore(noop, browserZone, () => "");
  const shownZone = tz || (here ? `${here} (this device)` : "This device's time zone");
  return (
    <Card id="accPreferences">
      <CardHead icon={ico.sliders} title="Preferences" />
      {!edit ? (
        <>
          <KeyValues
            rows={[
              ["Language", "English"],
              ["Time zone", shownZone],
              // Scheduled Reports is not built (JB: only when it exists).
              ["Email reports", "Not available yet"],
            ]}
          />
          <Actions>
            <button type="button" onClick={() => setEdit(true)} className={btn("outline")}>
              Edit Preferences
            </button>
            {state?.ok && <Message ok>Your preferences have been saved.</Message>}
          </Actions>
        </>
      ) : (
        // Unmocked edit state: the rows become fields.
        <form onSubmit={run} className="mt-[16px]">
          <Row one>
            <Field id="prLang" label="Language">
              <select id="prLang" name="language" defaultValue="en" className={selectCls()}>
                <option value="en">English</option>
              </select>
            </Field>
          </Row>
          <Row one>
            <Field id="prTz" label="Time zone" error={state && !state.ok ? state.fields?.timezone : undefined}>
              <select id="prTz" name="timezone" value={tz} onChange={(e) => setTz(e.target.value)} className={selectCls()}>
                <option value="">{here ? `This device's time zone (${here})` : "This device's time zone"}</option>
                {zones(d.timezone).map((z) => (
                  <option key={z} value={z}>
                    {z.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </Field>
          </Row>
          <Note>Dates in My QR Codes are shown in this time zone.</Note>
          <Actions>
            <button
              type="button"
              onClick={() => {
                setTz(d.timezone);
                setEdit(false);
              }}
              className={btn("grey")}
            >
              Cancel
            </button>
            <button type="submit" disabled={busy} className={btn("primary")}>
              {busy && <Spinner />}
              Save Preferences
            </button>
          </Actions>
        </form>
      )}
    </Card>
  );
}

/* ---- Page ------------------------------------------------------------------ */

export function AccountView({ d }: { d: AccountData }) {
  return (
    <>
      <PageTop
        title="My Account"
        tabs={[
          { id: "accProfile", label: "Profile" },
          { id: "accSecurity", label: "Security" },
          { id: "accPreferences", label: "Preferences" },
        ]}
      />
      <div className="mt-[22px] grid grid-cols-[minmax(0,1.205fr)_minmax(0,1fr)] items-start gap-[20px] max-[1240px]:grid-cols-1 max-[1240px]:gap-[16px] max-[576px]:mt-[18px]">
        <div className="min-w-0">
          <ProfileCard d={d} />
          <ActionsCard hasPassword={d.hasPassword} />
        </div>
        <div className="min-w-0">
          <SecurityCard d={d} />
          <PreferencesCard d={d} />
        </div>
      </div>
    </>
  );
}
