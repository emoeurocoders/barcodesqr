"use client";

import { isValidEmail, isValidPhone, isValidUrl } from "../validate";
import { splitWhen } from "../encodeQr";
import { localTimeZone } from "@/lib/zoned";
import { Acc, Counter, FieldError, Fld, TrackingPill, textArea, textInput } from "./ui";
import { TextFld, Upload, schemaField, trimmed, urlHandlers, urlOk } from "./fields";
import type { Check, FormState, Values } from "./fields";
import { SocialAcc } from "./forms";

/**
 * Batch 6, the last of the mobile forms: create_mobile_event / _coupon /
 * _feedback / _business.html (Monday 5654259822), on the established pieces.
 */

const httpsOk = (v: string) => /^https:\/\//i.test(v) && urlOk(v);

/** Their end-time rule: a missing end date is the start's day, a missing end time 23:59. */
export function eventEndOk(values: Values) {
  const s = splitWhen(values.startsAt);
  const e = splitWhen(values.endsAt);
  if (!(e.date || e.time) || !s.date || !s.time) return true;
  const start = new Date(`${s.date}T${s.time}`).getTime();
  const end = new Date(`${e.date || s.date}T${e.time || "23:59"}`).getTime();
  return end > start;
}

/* ---- Validation ------------------------------------------------------------ */

export function checksForBatch6(type: string, values: Values): Check[] {
  switch (type) {
    case "event": {
      const s = splitWhen(values.startsAt);
      return [
        { id: "evTitle", msg: trimmed(values.eventTitle) ? null : "Please enter an event title." },
        { id: "evStD", msg: s.date ? null : "Please choose a start date." },
        { id: "evStT", msg: s.time ? null : "Please choose a start time." },
        { id: "evEnD", key: "endChk", msg: eventEndOk(values) ? null : "The end time must be after the start time." },
      ];
    }
    case "coupon":
      return [
        { id: "cpTitle", msg: trimmed(values.title) ? null : "Please enter an offer title." },
        { id: "cpDisc", msg: trimmed(values.discount) ? null : "Please enter your discount or offer." },
      ];
    case "feedback":
      return [{ id: "fbUrl", msg: httpsOk(trimmed(values.url)) ? null : "Please enter a valid link starting with https://." }];
    case "business": {
      const phone = trimmed(values.phone);
      const email = trimmed(values.email);
      const web = trimmed(values.website);
      const any = [phone, email, web === "https://" ? "" : web, trimmed(values.address)].some(Boolean);
      return [
        { id: "bzName", acc: "basic", msg: trimmed(values.title) ? null : "Please enter your business name." },
        { id: "bzPhone", acc: "contact", key: "bzGrp", msg: any ? null : "Please add at least one contact or destination method." },
        // Optional each, but checked when filled (their `data-opt`).
        { id: "bzPhone", acc: "contact", msg: !phone || isValidPhone(phone) ? null : "Please enter a valid phone number." },
        { id: "bzEmail", acc: "contact", msg: !email || isValidEmail(email) ? null : "Please enter a valid email address." },
        { id: "bzWeb", acc: "contact", msg: !web || web === "https://" || isValidUrl(web) ? null : "Please enter a valid website URL." },
      ];
    }
    default:
      return [];
  }
}

/* ---- Shared ---------------------------------------------------------------- */

/** Their `input[type=date|time]`: 1.5em type, 3.13em tall — smaller than a text input. */
const dateInput = (invalid: boolean) =>
  `mt-[7.3px] block h-[38.08px] w-full rounded-[5px] border bg-white px-[12.17px] text-[12.17px] leading-[normal] tracking-[0.12px] text-ink shadow-mc-input outline-none transition-[border-color] duration-150 ${
    invalid ? "border-mc-error" : "border-mc-input-line focus:border-primary"
  }`;

/** Their `.fsub`. */
function Sub({ children }: { children: React.ReactNode }) {
  return <p className="mt-[3.04px] text-[10.14px] leading-[12.17px] text-muted">{children}</p>;
}

function DateFld({
  s,
  id,
  label,
  type,
  value,
  onChange,
  required,
}: {
  s: FormState;
  id: string;
  label: string;
  type: "date" | "time";
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const err = s.errors[id];
  return (
    <Fld id={id} label={label} required={required} error={err} className="mt-[12.2px] min-w-0 flex-1">
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        aria-invalid={!!err}
        onChange={(e) => onChange(e.target.value)}
        className={dateInput(!!err)}
      />
    </Fld>
  );
}

/* ---- Event ----------------------------------------------------------------- */

/**
 * Date and time are separate controls here, but desktop keeps one
 * `datetime-local` per end, so both write `startsAt` / `endsAt` as
 * "date T time" — half-filled while only one is picked.
 */
export function EventForm({ s }: { s: FormState }) {
  const start = splitWhen(s.values.startsAt);
  const end = splitWhen(s.values.endsAt);
  const set = (k: "startsAt" | "endsAt", part: "date" | "time", v: string) =>
    s.update(k, (cur) => {
      const w = splitWhen(cur);
      const next = { ...w, [part]: v };
      return next.date || next.time ? `${next.date}T${next.time}` : "";
    });
  const tz = (s.values.timezone || localTimeZone()).replace(/_/g, " ");
  const descr = s.values.description ?? "";

  return (
    <>
      <TextFld s={s} id="evTitle" k="eventTitle" label="Event title" placeholder="e.g. Summer Networking Mixer" max={40} required counter />
      {/* Their `.rowCols`; the time's label is a blank, for alignment. */}
      <div className="flex gap-[9.73px]">
        <DateFld s={s} id="evStD" label="Starts at" type="date" value={start.date} onChange={(v) => set("startsAt", "date", v)} required />
        <DateFld s={s} id="evStT" label={" "} type="time" value={start.time} onChange={(v) => set("startsAt", "time", v)} />
      </div>
      <div className="flex flex-wrap gap-x-[9.73px]">
        <DateFld s={s} id="evEnD" label="Ends at" type="date" value={end.date} onChange={(v) => set("endsAt", "date", v)} />
        <DateFld s={s} id="evEnT" label={" "} type="time" value={end.time} onChange={(v) => set("endsAt", "time", v)} />
        {s.errors.endChk && (
          <div className="basis-full">
            <FieldError>{s.errors.endChk}</FieldError>
          </div>
        )}
      </div>
      <Sub>
        All times use <b className="font-bold">{tz || "your local time zone"}</b>.
      </Sub>
      <Fld id="evLoc" label="Address / Location" counter={<Sub>A street address or an online event link both work.</Sub>}>
        <input
          type="text"
          id="evLoc"
          name="evLoc"
          value={s.values.location ?? ""}
          placeholder="e.g. 123 Main St, New York, NY"
          onChange={(e) => s.set("location", e.target.value)}
          className={textInput(false)}
        />
      </Fld>
      <Fld id="evDesc" label="Description" counter={<Counter value={descr} max={200} />}>
        <textarea
          id="evDesc"
          name="evDesc"
          value={descr}
          placeholder="Add event details, agenda, or what to expect…"
          maxLength={200}
          onChange={(e) => s.set("description", e.target.value)}
          className={`${textArea(false)} resize-y`}
        />
      </Fld>
    </>
  );
}

/* ---- Coupon ---------------------------------------------------------------- */

export function CouponForm({ s }: { s: FormState }) {
  const terms = s.values.terms ?? "";
  return (
    <>
      <TrackingPill />
      <TextFld s={s} id="cpTitle" k="title" label="Offer title" placeholder="e.g. Weekend Special" max={40} required counter />
      <TextFld
        s={s}
        id="cpDisc"
        k="discount"
        label="Discount / Offer"
        placeholder="e.g. 20% OFF"
        max={30}
        required
        tip={{ label: "About the offer", text: "Any offer works: 20% OFF, $10 OFF, Free Dessert, Buy One Get One Free." }}
      />
      <TextFld
        s={s}
        id="cpCode"
        k="code"
        label="Coupon code (optional)"
        placeholder="e.g. SAVE20"
        max={20}
        tip={{ label: "About the code", text: "Shown with a Copy button on your coupon page. Leave empty for no code." }}
      />
      <Fld
        id="cpExp"
        label="Expiry date (optional)"
        tip={{ label: "About the expiry date", text: "After this date your coupon page shows the offer as expired." }}
      >
        <input
          type="date"
          id="cpExp"
          name="cpExp"
          value={s.values.expiry ?? ""}
          onChange={(e) => s.set("expiry", e.target.value)}
          className={dateInput(false)}
        />
      </Fld>
      <Acc
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
        }
        title="Terms & Conditions"
        desc="Add conditions for your offer (optional)"
        open={s.isOpen("terms")}
        onToggle={() => s.toggle("terms")}
      >
        <Fld id="cpTerms" label="Terms & Conditions" counter={<Counter value={terms} max={200} />}>
          <textarea
            id="cpTerms"
            name="cpTerms"
            value={terms}
            placeholder="e.g. One per customer. Cannot be combined with other offers."
            maxLength={200}
            onChange={(e) => s.set("terms", e.target.value)}
            className={`${textArea(false)} resize-y`}
          />
        </Fld>
      </Acc>
    </>
  );
}

/* ---- Feedback -------------------------------------------------------------- */

export function FeedbackForm({ s }: { s: FormState }) {
  const v = s.values.url ?? "";
  const err = s.errors.fbUrl;
  return (
    <>
      <TrackingPill />
      <Fld
        id="fbUrl"
        label="Enter your feedback link"
        required
        error={err}
        tip={{ label: "About the feedback link", text: "Your survey, review, or form link. Scanners go straight there." }}
        counter={<Sub>Link to your survey or feedback form.</Sub>}
      >
        <input
          type="text"
          id="fbUrl"
          name="fbUrl"
          value={v}
          placeholder="https://"
          aria-invalid={!!err}
          className={textInput(!!err)}
          {...urlHandlers(v, (x) => s.set("url", x))}
        />
      </Fld>
    </>
  );
}

/* ---- Business Page --------------------------------------------------------- */

const accIcon = (children: React.ReactNode) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export function BusinessForm({ s }: { s: FormState }) {
  const descr = s.values.description ?? "";
  const grpErr = s.errors.bzGrp;
  return (
    <>
      <Acc
        icon={accIcon(<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />)}
        title="Basic information"
        desc="Name and description"
        open={s.isOpen("basic")}
        onToggle={() => s.toggle("basic")}
      >
        <TrackingPill className="mt-[11.4px]" />
        <TextFld s={s} id="bzName" k="title" label="Business name" placeholder="e.g. Harbor & Sage Co." max={40} required counter />
        <Fld id="bzDesc" label="Description" counter={<Counter value={descr} max={200} />}>
          <textarea
            id="bzDesc"
            name="bzDesc"
            value={descr}
            placeholder="e.g. Specialty coffee & all-day brunch in the heart of town."
            maxLength={200}
            onChange={(e) => s.set("description", e.target.value)}
            className={`${textArea(false)} resize-y`}
          />
        </Fld>
      </Acc>

      <Acc
        icon={accIcon(
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
        )}
        title="Contact details"
        desc="Phone, email, address and more"
        open={s.isOpen("contact")}
        onToggle={() => s.toggle("contact")}
      >
        {/* Their `.grpReq`: one of the four is enough. */}
        <div>
          <TextFld s={s} id="bzPhone" k="phone" label="Phone" placeholder="+1 555 014 2890" type="tel" />
          <TextFld s={s} id="bzEmail" k="email" label="Email" placeholder="hello@harborsage.com" type="email" />
          <TextFld s={s} id="bzWeb" k="website" label="Website" placeholder="https://harborsage.com" url />
          <TextFld s={s} id="bzAdr" k="address" label="Address / Directions" placeholder="123 Harbor St, Portside" max={80} />
          {grpErr && <FieldError>{grpErr}</FieldError>}
        </div>
      </Acc>

      <SocialAcc s={s} idPrefix="bzSoc" />

      <Acc
        icon={accIcon(
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </>,
        )}
        title="Business hours"
        desc="Set your opening hours (optional)"
        open={s.isOpen("hours")}
        onToggle={() => s.toggle("hours")}
      >
        <div className="flex gap-[9.73px]">
          <DateFld s={s} id="bzOpen" label="Opens at" type="time" value={s.values.opensAt ?? ""} onChange={(v) => s.set("opensAt", v)} />
          <DateFld s={s} id="bzClose" label="Closes at" type="time" value={s.values.closesAt ?? ""} onChange={(v) => s.set("closesAt", v)} />
        </div>
        <Sub>Visitors see an Open / Closed status based on their local time. Leave empty to hide it.</Sub>
      </Acc>

      <Acc
        icon={accIcon(
          <>
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </>,
        )}
        title="Cover image"
        desc="Upload a photo of your business (optional)"
        open={s.isOpen("cover")}
        onToggle={() => s.toggle("cover")}
      >
        <Upload
          type="business"
          field={schemaField("business", "cover")}
          value={s.values.cover ?? ""}
          onChange={(v) => s.set("cover", v)}
          what="your cover image"
        />
      </Acc>

      <Acc
        icon={accIcon(
          <>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </>,
        )}
        title="Logo"
        desc="Upload your business logo (optional)"
        open={s.isOpen("logo")}
        onToggle={() => s.toggle("logo")}
      >
        <Upload
          type="business"
          field={schemaField("business", "logo")}
          value={s.values.logo ?? ""}
          onChange={(v) => s.set("logo", v)}
          what="your logo"
          round
        />
      </Acc>
    </>
  );
}
