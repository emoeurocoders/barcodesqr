"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { dialCodes } from "../fieldSchema";
import { parseStoredFile } from "../storedValues";
import type { StoredFile } from "../storedValues";
import { useFileUpload } from "../useFileUpload";
import { UploadError, uploadFile } from "../uploadFile";
import { matchesAccept } from "@/lib/uploads";
import { isValidUrl } from "../validate";
import {
  Counter,
  FieldError,
  Fld,
  Label,
  TrackingPill,
  textArea,
  textInput,
} from "./ui";
import {
  TextAreaFld,
  TextFld,
  mobileDialLabel,
  schemaField,
  trimmed,
  uploadGlyph,
  urlOk,
} from "./fields";
import type { Check, FormState, Values } from "./fields";

/**
 * Batch 2 of the mobile forms: create_mobile_app_link / _pdf / _image /
 * _whatsapp.html (Monday 5638161680). Built from the batch-1 pieces in
 * fields.tsx and ui.tsx; values go to the same keys desktop uses, except the
 * image gallery — see `ImageForm`.
 */

/* ---- Validation ------------------------------------------------------------ */

const optUrl = (v: string | undefined) => {
  const t = trimmed(v);
  return !t || t === "https://" || isValidUrl(t);
};

/** The digits of a WhatsApp number, as their `data-req="wap"` checks it. */
function waNumberOk(raw: string | undefined) {
  const v = trimmed(raw);
  const digits = v.replace(/\D/g, "");
  return digits.length >= 5 && digits.length <= 14 && !v.includes("+");
}

export function checksForBatch2(type: string, values: Values): Check[] {
  switch (type) {
    case "applink": {
      // Their `.grpReq`: at least one valid store link. Either one, if
      // filled, must be valid; so must the optional fallback.
      const anyStore = [values.iosUrl, values.androidUrl].some(
        (v) => trimmed(v) && urlOk(trimmed(v)),
      );
      return [
        {
          id: "alIos",
          msg: optUrl(values.iosUrl)
            ? null
            : "Please enter a valid App Store URL.",
        },
        {
          id: "alAndroid",
          msg: optUrl(values.androidUrl)
            ? null
            : "Please enter a valid Google Play URL.",
        },
        {
          id: "alIos",
          key: "alGroup",
          msg: anyStore ? null : "Please enter at least one valid store URL.",
        },
        {
          id: "alFall",
          msg: optUrl(values.fallbackUrl)
            ? null
            : "Please enter a valid fallback URL.",
        },
      ];
    }
    case "pdf":
      return [
        {
          id: "pdfUpl",
          msg: parseStoredFile(values.file)
            ? null
            : "Please upload a PDF document.",
        },
      ];
    case "image":
      return [
        {
          id: "imUpl",
          msg: galleryOf(values).length
            ? null
            : "Please upload at least one image.",
        },
      ];
    case "whatsapp":
      return [
        {
          id: "waNum",
          msg: waNumberOk(values.phone)
            ? null
            : "Please enter a valid mobile number (without the country code).",
        },
      ];
    default:
      return [];
  }
}

/* ---- Shared ---------------------------------------------------------------- */

const infoGlyph = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mt-[0.8px] block h-[14.6px] w-[14.6px] shrink-0 text-primary"
  >
    <g>
      <path
        d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 6H9.0075"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const closeGlyph = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

/** Their `.fsub`: small print under a field. */
function Sub({ children }: { children: ReactNode }) {
  return (
    <p className="mt-[3px] text-[10.14px] leading-[15.2px] text-muted">
      {children}
    </p>
  );
}

/** Their `.upl.blu`: the blue dashed drop box. */
function BlueDrop({
  id,
  children,
  input,
  disabled,
}: {
  id: string;
  children: ReactNode;
  input: ReactNode;
  disabled?: boolean;
}) {
  return (
    <label
      id={id}
      tabIndex={-1}
      className={`relative mt-[12.2px] block cursor-pointer rounded-[9.7px] border-2 border-dashed border-mc-drop-line bg-mc-drop px-[11.4px] py-[16.2px] text-center outline-none [&>svg]:mx-auto [&>svg]:block [&>svg]:h-[21.1px] [&>svg]:w-[21.1px] [&>svg]:text-primary ${
        disabled ? "pointer-events-none opacity-45" : ""
      }`}
    >
      {uploadGlyph}
      {children}
      {input}
    </label>
  );
}

const hiddenFile = "absolute top-0 left-0 h-px w-px border-0 opacity-0";

/** Their `crSizeTxt`. */
const sizeTxt = (b: number) =>
  b >= 1048576
    ? `${(b / 1048576).toFixed(1)} MB`
    : `${Math.max(1, Math.round(b / 1024))} KB`;

/* ---- App Link -------------------------------------------------------------- */

export function AppLinkForm({ s }: { s: FormState }) {
  const groupErr = s.errors.alGroup;
  return (
    <>
      <TrackingPill />
      {/* Their `.nte.blu`. */}
      <div className="mt-[8.9px] flex items-start rounded-[9.7px] border border-mc-note-line bg-mc-note px-[10.5px] py-[9.7px]">
        {infoGlyph}
        <p className="pl-[8.1px] text-[10.95px] leading-[16.97px] font-medium text-prose">
          <b className="font-semibold text-mc-note-ink">One QR code</b>{" "}
          automatically directs iPhone users to the App Store and Android users
          to Google Play.
        </p>
      </div>
      <div>
        <TextFld
          s={s}
          id="alIos"
          k="iosUrl"
          label="iOS App Store URL"
          placeholder="https://apps.apple.com/..."
          url
          tip={{
            label: "About the App Store link",
            text: "Where iPhone users are sent — your Apple App Store page.",
          }}
        />
        <TextFld
          s={s}
          id="alAndroid"
          k="androidUrl"
          label="Google Play URL"
          placeholder="https://play.google.com/..."
          url
          tip={{
            label: "About the Google Play link",
            text: "Where Android users are sent — your Google Play page.",
          }}
        />
        {groupErr && <FieldError>{groupErr}</FieldError>}
      </div>
      <TextFld
        s={s}
        id="alFall"
        k="fallbackUrl"
        label="Fallback URL (optional)"
        placeholder="https://"
        url
        tip={{
          label: "About the fallback link",
          text: "Where everyone else lands (desktop and other devices).",
        }}
      />
      <Sub>Users on unsupported devices (e.g. desktop) will be sent here.</Sub>
    </>
  );
}

/* ---- PDF ------------------------------------------------------------------- */

/** Their page count: `/Type /Page` entries in the file's text. */
async function countPages(file: File) {
  try {
    const m = (await file.text()).match(/\/Type\s*\/Page[^s]/g);
    return m?.length || 1;
  } catch {
    return 1;
  }
}

export function PdfForm({ s }: { s: FormState }) {
  const field = schemaField("pdf", "file");
  const { take, clear, error, progress, pending, stored } = useFileUpload({
    type: "pdf",
    field,
    value: s.values.file ?? "",
    onChange: (v) => s.set("file", v),
    // Their wording for the two refusals.
    messages: {
      type: "Please choose a PDF file.",
      size: "That file is too large (max 20 MB).",
    },
  });
  const shown = pending ?? stored;
  const err = error ?? s.errors.pdfUpl;

  return (
    <>
      <TrackingPill />
      <div>
        <BlueDrop
          id="pdfUpl"
          input={
            <input
              type="file"
              id="pdfFile"
              accept="application/pdf,.pdf"
              className={hiddenFile}
              onChange={async (e) => {
                const file = e.currentTarget.files?.[0];
                e.currentTarget.value = "";
                if (file) take(file, { pages: await countPages(file) });
              }}
            />
          }
        >
          <span className="mt-[7.9px] block text-[11.36px] leading-[normal] font-semibold text-body">
            <b className="font-black text-primary">
              {progress !== null
                ? `Uploading… ${progress}%`
                : "Upload your PDF"}
            </b>
          </span>
          <span className="mt-[3.4px] block text-[9.73px] leading-[normal] text-faint">
            Click to upload or drag &amp; drop · Max size: 20 MB · PDF only
          </span>
        </BlueDrop>
        {/* Their `.fileCrd`. Picking another file replaces this one. */}
        {shown && (
          <div className="mt-[9.7px] flex items-center rounded-[9.7px] border border-mc-card-line bg-mc-tile px-[8.9px] py-[8.1px]">
            <span className="block h-[29.2px] w-[29.2px] shrink-0 overflow-hidden rounded-[7.3px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/create/pdf.svg"
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
            <span className="min-w-0 flex-1 px-[7.3px]">
              <span className="block truncate text-[10.95px] leading-[normal] font-semibold text-ink">
                {shown.name}
              </span>
              <span className="mt-[1.5px] block text-[9.73px] leading-[normal] text-muted">
                {sizeTxt(shown.size)}
              </span>
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
              {closeGlyph}
            </a>
          </div>
        )}
        {err && <FieldError>{err}</FieldError>}
      </div>
      <TextFld
        s={s}
        id="pdfTitle"
        k="title"
        label="Title (optional)"
        placeholder="e.g. Product Brochure"
        max={40}
        counter
      />
      <TextAreaFld
        s={s}
        id="pdfDesc"
        k="description"
        label="Description (optional)"
        placeholder="e.g. Our latest products, features and specifications."
        max={200}
      />
    </>
  );
}

/* ---- Image gallery --------------------------------------------------------- */

/**
 * The gallery lives under `images` (a JSON list of stored files, up to 10).
 * Desktop's Image form holds one picture under `file`, so the first image is
 * mirrored there: the desktop form and preview keep working on the same
 * values, and showing the gallery there is desktop's own redesign.
 */
export function galleryOf(values: Values): StoredFile[] {
  try {
    const v = JSON.parse(values.images ?? "[]");
    return Array.isArray(v)
      ? v.filter((f) => f && typeof f.name === "string")
      : [];
  } catch {
    return [];
  }
}

const withGallery = (cur: Values, list: StoredFile[]): Values => ({
  ...cur,
  images: JSON.stringify(list),
  file: list[0] ? JSON.stringify(list[0]) : "",
});

const MAX_IMAGES = 10;
const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";

type Pending = { id: number; src: string; progress: number };

export function ImageForm({ s }: { s: FormState }) {
  const list = galleryOf(s.values);
  const [pending, setPending] = useState<Pending[]>([]);
  const [skipped, setSkipped] = useState(false);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const nextId = useRef(0);
  const room = MAX_IMAGES - list.length - pending.length;
  const err = s.errors.imUpl;

  const add = async (picked: File[]) => {
    if (!picked.length) return;
    const ok = picked.filter(
      (f) =>
        matchesAccept(f.name, f.type, IMAGE_ACCEPT) &&
        f.size <= 5 * 1024 * 1024,
    );
    const take = ok.slice(0, Math.max(0, room));
    setSkipped(take.length < picked.length);
    await Promise.all(
      take.map(async (file) => {
        const id = nextId.current++;
        const src = URL.createObjectURL(file);
        setPending((p) => [...p, { id, src, progress: 0 }]);
        try {
          const { key, url } = await uploadFile({
            type: "image",
            field: "file",
            file,
            onProgress: (n) =>
              setPending((p) =>
                p.map((x) => (x.id === id ? { ...x, progress: n } : x)),
              ),
          });
          s.patch((cur) =>
            withGallery(
              cur,
              [
                ...galleryOf(cur),
                { name: file.name, size: file.size, key, url },
              ].slice(0, MAX_IMAGES),
            ),
          );
        } catch (e) {
          if (!(e instanceof UploadError)) throw e;
          setSkipped(true);
        } finally {
          setPending((p) => p.filter((x) => x.id !== id));
          URL.revokeObjectURL(src);
        }
      }),
    );
  };

  const remove = (i: number) =>
    s.patch((cur) =>
      withGallery(
        cur,
        galleryOf(cur).filter((_, j) => j !== i),
      ),
    );

  const move = (from: number, to: number) =>
    s.patch((cur) => {
      const next = [...galleryOf(cur)];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return withGallery(cur, next);
    });

  /**
   * Reorder by dragging a thumbnail onto another. Their file uses HTML5
   * drag-and-drop, which phones do not fire for touch; pointer events work
   * for touch and mouse alike.
   */
  const onPointerDown =
    (i: number) => (e: React.PointerEvent<HTMLLIElement>) => {
      if ((e.target as HTMLElement).closest("a")) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragFrom(i);
    };
  const tileAt = (x: number, y: number) => {
    const el = document
      .elementFromPoint(x, y)
      ?.closest<HTMLElement>("[data-gal]");
    return el ? Number(el.dataset.gal) : null;
  };

  const input = (
    <input
      type="file"
      id="imFiles"
      accept={IMAGE_ACCEPT}
      multiple
      className={hiddenFile}
      onChange={(e) => {
        add(Array.from(e.currentTarget.files ?? []));
        e.currentTarget.value = "";
      }}
    />
  );

  return (
    <>
      <TrackingPill />
      <div className="mt-[12.2px]">
        <div className="flex items-center">
          <Label required>Images</Label>
        </div>
        <Sub>Upload up to 10 images · Max 5 MB each · PNG, JPG, JPEG, WEBP</Sub>
        <BlueDrop id="imUpl" input={input} disabled={room <= 0}>
          <span className="mt-[7.9px] block text-[11.36px] leading-[normal] font-semibold text-body">
            <b className="font-black text-primary">Click to upload images</b>
          </span>
          <span className="mt-[3.4px] block text-[9.73px] leading-[normal] text-faint">
            or tap to browse
          </span>
        </BlueDrop>

        {/* Always in the flow, as theirs is: its top margin is what spaces the
            counter even while it holds nothing. */}
        <ul className="mt-[9.7px] grid touch-none grid-cols-3 gap-[8.1px] select-none">
          {list.map((f, i) => (
            <li
              key={f.key ?? f.url ?? i}
              data-gal={i}
              onPointerDown={onPointerDown(i)}
              onPointerMove={(e) =>
                dragFrom !== null && setDragOver(tileAt(e.clientX, e.clientY))
              }
              onPointerUp={(e) => {
                const to = tileAt(e.clientX, e.clientY);
                if (dragFrom !== null && to !== null && to !== dragFrom)
                  move(dragFrom, to);
                setDragFrom(null);
                setDragOver(null);
              }}
              onPointerCancel={() => {
                setDragFrom(null);
                setDragOver(null);
              }}
              className={`relative aspect-square cursor-grab overflow-hidden rounded-[8.1px] border ${
                dragOver === i && dragFrom !== i
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-mc-acc-line"
              } ${dragFrom === i ? "opacity-50" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.url ?? f.dataUrl}
                alt=""
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <a
                href="#"
                aria-label="Remove image"
                onClick={(e) => {
                  e.preventDefault();
                  remove(i);
                }}
                className="absolute top-[3.2px] right-[3.2px] flex h-[15.4px] w-[15.4px] items-center justify-center rounded-full bg-ink/55 text-white [&>svg]:block [&>svg]:h-[8.5px] [&>svg]:w-[8.5px]"
              >
                {closeGlyph}
              </a>
            </li>
          ))}
          {/* In flight: the local picture, dimmed, with its progress. */}
          {pending.map((p) => (
            <li
              key={`p${p.id}`}
              className="relative aspect-square overflow-hidden rounded-[8.1px] border border-mc-acc-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-50"
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10.14px] font-semibold text-ink">
                {p.progress}%
              </span>
            </li>
          ))}
          {/* Their `.addTile`: shown once there is something to add to. */}
          {(list.length > 0 || pending.length > 0) && (
            <li
              className={`aspect-square ${room <= 0 ? "pointer-events-none opacity-45" : ""}`}
            >
              <label
                htmlFor="imFiles"
                className="flex h-full cursor-pointer flex-col items-center justify-center gap-[4.1px] rounded-[8.1px] border-2 border-dashed border-mc-drop-line bg-mc-drop text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="block h-[13.8px] w-[13.8px]"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                <span className="text-[9.33px] leading-[normal] font-semibold">
                  Add more
                </span>
                <span className="text-[7.71px] leading-[normal] text-muted">
                  (up to 10)
                </span>
              </label>
            </li>
          )}
        </ul>
        {/* Unmocked: their script drops oversized files without a word. */}
        {skipped && (
          <FieldError>
            Some files were skipped — images must be PNG, JPG or WEBP, up to 5
            MB, and 10 at most.
          </FieldError>
        )}
        {err && <FieldError>{err}</FieldError>}
        {/* Their `.imgCnt`: images, not characters, against the same 10. */}
        <Counter value={" ".repeat(list.length)} max={MAX_IMAGES} />
      </div>
      <TextFld
        s={s}
        id="imTitle"
        k="title"
        label="Title (optional)"
        placeholder="e.g. My Photo Gallery"
        max={40}
      />
    </>
  );
}

/* ---- WhatsApp -------------------------------------------------------------- */

export const WA_DEFAULT =
  "Hi! 👋 I just scanned your QR code and I'd love to hear more — can you fill me in?";

export function WhatsAppForm({ s }: { s: FormState }) {
  const dial = s.values.phoneCountry ?? dialCodes[0].value;
  const err = s.errors.waNum;
  const message = s.values.message ?? WA_DEFAULT;

  // Their file prefills the message, and suggests the visitor's own country
  // from the browser language. Seeded into the values, so both reach the code.
  const { values, patch } = s;
  useEffect(() => {
    if (values.message !== undefined && values.phoneCountry !== undefined)
      return;
    const region = (navigator.language.split("-")[1] ?? "").toUpperCase();
    const guess = dialCodes.find((c) => c.region === region)?.value;
    patch((cur) => ({
      ...cur,
      message: cur.message ?? WA_DEFAULT,
      phoneCountry: cur.phoneCountry ?? guess ?? dialCodes[0].value,
    }));
    // Once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Their `.rowCols`. */}
      <div className="flex gap-[9.7px]">
        <Fld id="waCc" label="Country" className="mt-[12.2px] w-[36%] shrink-0">
          <select
            id="waCc"
            value={dial}
            onChange={(e) => s.set("phoneCountry", e.target.value)}
            className={`${textInput(false)} cursor-pointer appearance-none pr-[12.8px] pl-[13px]`}
          >
            {dialCodes.map((c) => (
              <option key={c.value} value={c.value}>
                {mobileDialLabel(c)}
              </option>
            ))}
          </select>
        </Fld>
        <Fld
          id="waNum"
          label="WhatsApp number"
          required
          tip={{
            label: "About your WhatsApp number",
            text: "The number people message on WhatsApp after scanning.",
          }}
          error={err}
          className="mt-[12.2px] min-w-0 flex-1"
        >
          <input
            type="tel"
            id="waNum"
            value={s.values.phone ?? ""}
            placeholder="Enter mobile number"
            aria-invalid={!!err}
            onChange={(e) => s.set("phone", e.target.value)}
            className={textInput(!!err)}
          />
        </Fld>
      </div>
      <Fld
        id="waMsg"
        label="Pre-typed message (optional)"
        tip={{
          label: "About the pre-typed message",
          text: "Pre-filled chat text — the scanner just taps send.",
        }}
        counter={<Counter value={message} max={500} />}
      >
        <textarea
          id="waMsg"
          value={message}
          maxLength={500}
          placeholder="Type your message here…"
          onChange={(e) => s.set("message", e.target.value)}
          className={`${textArea(false)} resize-y`}
        />
      </Fld>
    </>
  );
}
