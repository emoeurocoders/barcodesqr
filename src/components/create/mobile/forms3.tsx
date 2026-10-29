"use client";

import { useDesktop } from "./pageMode";

import { useState } from "react";
import type { ReactNode } from "react";
import { parseStoredFile, parseMenuItems, serializeMenuItems } from "../storedValues";
import type { MenuItem } from "../storedValues";
import { useFileUpload } from "../useFileUpload";
import { hasSocialProfile, linkIssues, menuIssues } from "../validate";
import { parseLinks } from "../storedValues";
import { Acc, FieldError, Fld, Label, Slide, TrackingPill, outlineBtn, textArea, textInput } from "./ui";
import { TextAreaFld, TextFld, Upload, imageGlyph, schemaField, trashGlyph, trimmed, uploadGlyph } from "./fields";
import type { Check, FormState, Values } from "./fields";
import { LinkList, SocialPicker } from "./forms";

/**
 * Batch 3 of the mobile forms: create_mobile_social_media / _menu / _wifi /
 * _video.html (Monday 5642568390), on the batch-1 pieces.
 */

/** create_mobile_social_media.html's platform order. */
export const socialMediaOrder = [
  "instagram", "tiktok", "whatsapp", "youtube", "linkedin", "facebook", "x", "telegram",
  "reddit", "snapchat", "pinterest", "messenger", "line", "wechat", "viber",
];

/** create_desktop_social_media.html's order — eleven, then More, then the rest. */
export const socialMediaOrderDesktop = [
  "instagram", "tiktok", "whatsapp", "youtube", "facebook", "linkedin", "x", "snapchat",
  "pinterest", "telegram", "reddit", "messenger", "wechat", "line", "viber",
];

/* ---- Validation ------------------------------------------------------------ */

export function checksForBatch3(type: string, values: Values): Check[] {
  switch (type) {
    case "social": {
      // Custom links are optional here; only a malformed URL is a problem.
      const links = linkIssues(parseLinks(values.links ?? "")).rows;
      return [
        { id: "smHeadline", msg: trimmed(values.headline) ? null : "Please enter a headline." },
        { id: "smSocials", msg: hasSocialProfile(values) ? null : "Please add at least one social profile." },
        ...links.map((r, i): Check => ({
          id: `lnkUrl${i}`,
          acc: "links",
          msg: r.url === "invalid" ? "Please enter a valid link URL." : null,
        })),
      ];
    }
    case "menu": {
      const { rows, none } = menuIssues(values.items);
      const items = parseMenuItems(values.items);
      const allBlank = none && rows.every((r) => r.blank);
      return [
        { id: "mnTitle", msg: trimmed(values.title) ? null : "Please enter a title." },
        ...(items.length ? rows : [{ blank: true, name: undefined, price: undefined }]).flatMap(
          (r, i): Check[] => {
            const flag = allBlank && i === 0;
            return [
              { id: `mnName${i}`, acc: "items", msg: r.name || flag ? "Please enter an item name." : null },
              { id: `mnPrice${i}`, acc: "items", msg: r.price || flag ? "Please enter a price." : null },
            ];
          },
        ),
      ];
    }
    case "wifi":
      return [
        { id: "wfSsid", msg: trimmed(values.ssid) ? null : "Please enter your network name." },
        {
          id: "wfPass",
          // WPA keys are 8–63 characters; the 2026-10-29 file checks that
          // for every secured network ("wpa" rule), WEP included.
          msg:
            values.encryption === "nopass" || ((values.password ?? "").length >= 8 && (values.password ?? "").length <= 63)
              ? null
              : "Please enter the network password (8–63 characters).",
        },
      ];
    case "video":
      return [{ id: "vidUpl", msg: parseStoredFile(values.file) ? null : "Please upload a video." }];
    default:
      return [];
  }
}

/* ---- Shared ---------------------------------------------------------------- */

function Sub({ children }: { children: ReactNode }) {
  return <p className="mt-[3px] text-[10.14px] leading-[15.2px] text-muted">{children}</p>;
}

const ctlBtn =
  "flex h-[24.3px] w-[24.3px] items-center justify-center rounded-[6.5px] hover:bg-mc-well [&>svg]:block [&>svg]:h-[12.2px] [&>svg]:w-[12.2px]";

const docGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

const linkGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

/* ---- Social Media ---------------------------------------------------------- */

export function SocialMediaForm({ s }: { s: FormState }) {
  const err = s.errors.smSocials;
  const desk = useDesktop();
  return (
    <>
      <TrackingPill />
      <TextFld s={s} id="smHeadline" k="headline" label="Headline" placeholder={desk ? "e.g. Olivia Bennett" : "e.g. Kaia Bennett"} max={40} required counter />
      {/* Their `.fld.socReq`. */}
      <div id="smSocials" tabIndex={-1} className="mt-[12.2px] outline-none">
        <div className="flex items-center">
          <Label required>Social media</Label>
        </div>
        <Sub>Select icons below to add your social channels.</Sub>
        <SocialPicker s={s} idPrefix="smSoc" order={desk ? socialMediaOrderDesktop : socialMediaOrder} tile={desk} />
        {err && <FieldError>{err}</FieldError>}
      </div>
      <Acc icon={docGlyph} title="Description" desc="Add a short bio (optional)" open={s.isOpen("desc")} onToggle={() => s.toggle("desc")}>
        <TextAreaFld s={s} id="smDesc" k="description" label="Description" placeholder="e.g. About me" max={200} />
      </Acc>
      <Acc icon={imageGlyph} title="Profile picture" desc="Add a profile photo (optional)" open={s.isOpen("photo")} onToggle={() => s.toggle("photo")}>
        <Upload
          type="social"
          field={schemaField("social", "photo")}
          value={s.values.photo ?? ""}
          onChange={(v) => s.set("photo", v)}
          what="your photo"
          round
        />
      </Acc>
      {/* Desktop parity (JB): desktop's Social Media takes custom links too.
          Unmocked — the Multi-Link rows, all optional. */}
      <Acc icon={linkGlyph} title="Your Links" desc="Add your custom links (optional)" open={s.isOpen("links")} onToggle={() => s.toggle("links")}>
        <LinkList s={s} type="social" optional />
      </Acc>
    </>
  );
}

/* ---- Menu ------------------------------------------------------------------ */

const emptyItem: MenuItem = { name: "", price: "", desc: "" };

/**
 * Their menu-item builder (`.lnkLst[data-lbl=Item]`): numbered rows of name,
 * price and an optional description, reorderable and removable. Stored in the
 * desktop line format — see `serializeMenuItems`.
 */
function MenuItems({ s }: { s: FormState }) {
  const parsed = parseMenuItems(s.values.items);
  const rows = parsed.length ? parsed : [emptyItem];
  const write = (next: MenuItem[]) => s.set("items", serializeMenuItems(next));
  const update = (i: number, patch: Partial<MenuItem>) =>
    write(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const move = (i: number, by: number) => {
    const j = i + by;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    write(next);
  };

  return (
    <>
      {rows.map((row, i) => {
        const nameErr = s.errors[`mnName${i}`];
        const priceErr = s.errors[`mnPrice${i}`];
        return (
          <div key={i} className="mt-[11.4px] rounded-[9.7px] border border-mc-card-line bg-mc-row px-[9.7px] pt-[1.6px] pb-[12.2px]">
            <div className="mt-[9.7px] flex items-center justify-between">
              <span className="text-[11.76px] leading-[normal] font-bold text-ink">Item {i + 1}</span>
              {rows.length > 1 && (
                <span className="flex items-center gap-[2.4px] text-muted">
                  <a href="#" aria-label="Move item up" className={ctlBtn} onClick={(e) => { e.preventDefault(); move(i, -1); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>
                  </a>
                  <a href="#" aria-label="Move item down" className={ctlBtn} onClick={(e) => { e.preventDefault(); move(i, 1); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
                  </a>
                  <a href="#" aria-label="Remove item" className={`${ctlBtn} text-mc-error`} onClick={(e) => { e.preventDefault(); write(rows.filter((_, j) => j !== i)); }}>
                    {trashGlyph}
                  </a>
                </span>
              )}
            </div>
            {/* Their `.rowCols`: name beside a 36% price. */}
            <div className="flex gap-[9.7px]">
              <Fld id={`mnName${i}`} label="Item name" required error={nameErr} className="mt-[12.2px] min-w-0 flex-1">
                <input type="text" id={`mnName${i}`} value={row.name} placeholder="e.g. Cappuccino" maxLength={40} aria-invalid={!!nameErr} onChange={(e) => update(i, { name: e.target.value })} className={textInput(!!nameErr)} />
              </Fld>
              <Fld id={`mnPrice${i}`} label="Price" required error={priceErr} className="mt-[12.2px] w-[36%] shrink-0">
                <input type="text" id={`mnPrice${i}`} value={row.price} placeholder="$4.50" maxLength={12} aria-invalid={!!priceErr} onChange={(e) => update(i, { price: e.target.value })} className={textInput(!!priceErr)} />
              </Fld>
            </div>
            <Fld id={`mnDesc${i}`} label="Description">
              <textarea id={`mnDesc${i}`} value={row.desc} placeholder="Short description (optional)" maxLength={100} onChange={(e) => update(i, { desc: e.target.value })} className={`${textArea(false)} resize-y`} />
            </Fld>
          </div>
        );
      })}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          write([...rows, emptyItem]);
          requestAnimationFrame(() => document.getElementById(`mnName${rows.length}`)?.focus());
        }}
        className={`${outlineBtn} mt-[18.2px] flex h-[35.1px] w-full gap-[6.5px] [&>svg]:h-[14.3px] [&>svg]:w-[14.3px]`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
        Add Another Item
      </a>
    </>
  );
}

export function MenuForm({ s }: { s: FormState }) {
  return (
    <>
      <TrackingPill />
      <TextFld s={s} id="mnTitle" k="title" label="Title" placeholder="e.g. Bella Italia Menu" max={40} required counter />
      <Acc
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h.01" />
            <path d="M3 12h.01" />
            <path d="M3 18h.01" />
            <path d="M8 6h13" />
            <path d="M8 12h13" />
            <path d="M8 18h13" />
          </svg>
        }
        title="Menu Items"
        desc="Add dishes, prices and descriptions"
        open={s.isOpen("items")}
        onToggle={() => s.toggle("items")}
      >
        <MenuItems s={s} />
      </Acc>
      <Acc icon={imageGlyph} title="Cover image" desc="Upload a restaurant or food photo (optional)" open={s.isOpen("cover")} onToggle={() => s.toggle("cover")}>
        <Upload
          type="menu"
          field={schemaField("menu", "cover")}
          value={s.values.cover ?? ""}
          onChange={(v) => s.set("cover", v)}
          what="your cover image"
        />
      </Acc>
      <Acc
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
            <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
          </svg>
        }
        title="Category / Section"
        desc="Group items into a section (optional)"
        open={s.isOpen("category")}
        onToggle={() => s.toggle("category")}
      >
        <TextFld s={s} id="mnCat" k="category" label="Category / Section name" placeholder="e.g. Appetizers, Main Courses, Desserts" max={40} />
        <Sub>Shown as a section heading above your items. Leave empty for a single list.</Sub>
      </Acc>
      {/* Desktop parity (JB): desktop's menu has a description. Unmocked. */}
      <Acc icon={docGlyph} title="Description" desc="A line under your menu title (optional)" open={s.isOpen("desc")} onToggle={() => s.toggle("desc")}>
        <TextAreaFld s={s} id="mnDescription" k="description" label="Description" placeholder="e.g. Fresh, seasonal, and made to order." max={200} />
      </Acc>
    </>
  );
}

/* ---- WiFi ------------------------------------------------------------------ */

const eyeGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/**
 * No "Smart Tracking" pill: a WiFi code holds the network itself and is never
 * dynamic (JB: it must not claim tracking or editing).
 */
export function WifiForm({ s }: { s: FormState }) {
  const [show, setShow] = useState(false);
  const enc = s.values.encryption || "WPA";
  const passErr = s.errors.wfPass;
  return (
    <>
      <TextFld
        s={s}
        id="wfSsid"
        k="ssid"
        label="Network name (SSID)"
        placeholder="CozyCornerWiFi"
        max={32}
        required
        tip={{ label: "About your network name", text: "Your network name (SSID). Usually printed on the sticker on your router, along with the password and security type." }}
      />
      <Fld id="wfSec" label="Security type" tip={{ label: "About security types", text: "Most modern routers use WPA/WPA2. Pick that if unsure." }}>
        <select
          id="wfSec"
          value={enc}
          onChange={(e) => s.set("encryption", e.target.value)}
          className={`${textInput(false)} cursor-pointer appearance-none pr-[12.8px] pl-[13px]`}
        >
          <option value="WPA">WPA/WPA2 (recommended)</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None — open network</option>
        </select>
      </Fld>
      {/* Their `.fldPass`, slid away for an open network. */}
      <Slide open={enc !== "nopass"} duration="duration-[200ms]">
        <Fld
          id="wfPass"
          label="Network password"
          required
          error={passErr}
          tip={{ label: "About the password", text: "Scanners connect to your WiFi automatically using this password." }}
        >
          <span className="relative block">
            <input
              type={show ? "text" : "password"}
              id="wfPass"
              value={s.values.password ?? ""}
              placeholder="Cappuccino123"
              maxLength={63}
              autoComplete="off"
              aria-invalid={!!passErr}
              onChange={(e) => s.set("password", e.target.value)}
              className={`${textInput(!!passErr)} pr-[44.8px]`}
            />
            <a
              href="#"
              role="button"
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
              onClick={(e) => {
                e.preventDefault();
                setShow(!show);
              }}
              className="absolute top-0 right-0 flex h-[43.7px] w-[23.5px] items-center justify-center text-faint [&>svg]:block [&>svg]:h-[12.2px] [&>svg]:w-[12.2px]"
            >
              {eyeGlyph}
            </a>
          </span>
        </Fld>
      </Slide>
      {/* Their `.chkRow`. */}
      <label className="mt-[15.9px] flex cursor-pointer items-center gap-[9.1px] text-[11.36px] leading-[normal] font-medium text-body">
        <input
          type="checkbox"
          id="wfHidden"
          checked={s.values.hidden === "true"}
          onChange={(e) => s.set("hidden", String(e.target.checked))}
          className="m-0 h-[17.3px] w-[17.3px] shrink-0 accent-primary"
        />
        WiFi is hidden (not visible to others)
      </label>
    </>
  );
}

/* ---- Video ----------------------------------------------------------------- */

/** Their frame grab: a 96px square from 0.1s in, for the file card. */
function grabThumb(file: File): Promise<string | undefined> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.muted = true;
    v.preload = "metadata";
    v.src = url;
    const done = (r?: string) => {
      URL.revokeObjectURL(url);
      resolve(r);
    };
    v.addEventListener("loadeddata", () => {
      try {
        v.currentTime = 0.1;
      } catch {
        done();
      }
    });
    v.addEventListener("seeked", () => {
      try {
        const c = document.createElement("canvas");
        c.width = 96;
        c.height = 96;
        const side = Math.min(v.videoWidth, v.videoHeight);
        c.getContext("2d")!.drawImage(v, (v.videoWidth - side) / 2, (v.videoHeight - side) / 2, side, side, 0, 0, 96, 96);
        done(c.toDataURL("image/jpeg", 0.72));
      } catch {
        done();
      }
    });
    v.addEventListener("error", () => done());
    setTimeout(() => done(), 4000);
  });
}

export const sizeTxt = (b: number) =>
  b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;

export function VideoForm({ s }: { s: FormState }) {
  const { take, clear, error, progress, pending, stored } = useFileUpload({
    type: "video",
    field: schemaField("video", "file"),
    value: s.values.file ?? "",
    onChange: (v) => s.set("file", v),
    messages: { type: "Please choose a video file (MP4, MOV, AVI, etc.).", size: "That file is too large (max 50 MB)." },
  });
  const shown = pending ?? stored;
  const thumb = (stored as { thumb?: string } | null)?.thumb;
  const err = error ?? s.errors.vidUpl;

  return (
    <>
      <TrackingPill />
      <div>
        <label
          id="vidUpl"
          tabIndex={-1}
          className="relative mt-[12.2px] block cursor-pointer rounded-[9.7px] border-2 border-dashed border-mc-drop-line bg-mc-drop px-[11.4px] py-[16.2px] text-center outline-none [&>svg]:mx-auto [&>svg]:block [&>svg]:h-[21.1px] [&>svg]:w-[21.1px] [&>svg]:text-primary"
        >
          {uploadGlyph}
          <span className="mt-[7.9px] block text-[11.36px] leading-[normal] font-semibold text-body">
            <b className="font-black text-primary">{progress !== null ? `Uploading… ${progress}%` : "Upload your video"}</b>
          </span>
          <span className="mt-[3.4px] block text-[9.73px] leading-[normal] text-faint">
            Click to upload or drag &amp; drop · Max size: 50 MB · MP4, MOV, AVI, etc.
          </span>
          <input
            type="file"
            id="vidFile"
            accept="video/*,.mp4,.mov,.m4v,.avi,.webm"
            className="absolute top-0 left-0 h-px w-px border-0 opacity-0"
            onChange={async (e) => {
              const file = e.currentTarget.files?.[0];
              e.currentTarget.value = "";
              if (file) take(file, { thumb: await grabThumb(file) });
            }}
          />
        </label>
        {shown && (
          <div className="mt-[9.7px] flex items-center rounded-[9.7px] border border-mc-card-line bg-mc-tile px-[8.9px] py-[8.1px]">
            <span className="block h-[29.2px] w-[29.2px] shrink-0 overflow-hidden rounded-[7.3px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb ?? "/create/video.svg"} alt="" className="h-full w-full object-cover" />
            </span>
            <span className="min-w-0 flex-1 px-[7.3px]">
              <span className="block truncate text-[10.95px] leading-[normal] font-semibold text-ink">{shown.name}</span>
              <span className="mt-[1.5px] block text-[9.73px] leading-[normal] text-muted">{sizeTxt(shown.size)}</span>
            </span>
            <a
              href="#"
              aria-label="Remove file"
              onClick={(e) => {
                e.preventDefault();
                clear();
              }}
              className="flex h-[21.1px] w-[21.1px] shrink-0 items-center justify-center rounded-full border border-mc-acc-line bg-white text-prose [&>svg]:block [&>svg]:h-[9.7px] [&>svg]:w-[9.7px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </a>
          </div>
        )}
        {err && <FieldError>{err}</FieldError>}
      </div>
      <TextFld s={s} id="vidTitle" k="title" label="Title (optional)" placeholder="e.g. Happy Moments" max={40} counter />
    </>
  );
}
