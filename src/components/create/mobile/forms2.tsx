"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cropStyle, parseStoredFile } from "../storedValues";
import type { StoredFile } from "../storedValues";
import { ImageAdjuster } from "../ImageAdjuster";
import { useFileUpload } from "../useFileUpload";
import { UploadError, uploadFile } from "../uploadFile";
import { matchesAccept } from "@/lib/uploads";
import { isValidUrl } from "../validate";
import { Counter, FieldError, Fld, Label, TrackingPill, textArea } from "./ui";
import {
  TextAreaFld,
  TextFld,
  IntlNumberFld,
  mobileNumberOk,
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
          msg: mobileNumberOk(values.phone, values.phoneCountry)
            ? null
            : "Please enter a valid mobile number (without the country code).",
        },
      ];
    default:
      return [];
  }
}

/* ---- Shared ---------------------------------------------------------------- */

export const infoGlyph = (
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
            text: "Where iPhone users are sent: your Apple App Store page.",
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
            text: "Where Android users are sent: your Google Play page.",
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

/**
 * Lets the form turn the preview to the picture being reframed. The two sit
 * in different subtrees and share only `values`, which is saved — a pick is
 * not worth saving, so it travels as a window event instead.
 */
export const GALLERY_SHOW = "bqr:gallery-show";
const showInPreview = (i: number) =>
  window.dispatchEvent(new CustomEvent(GALLERY_SHOW, { detail: i }));

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
  /** The picture being reframed; tapping a tile picks it (Tami, 2026-10-21). */
  const [sel, setSel] = useState<number | null>(null);
  const picked = sel !== null ? list[sel] : undefined;
  const select = (i: number | null) => {
    setSel(i);
    if (i !== null) showInPreview(i);
  };
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

  const remove = (i: number) => {
    if (sel !== null) setSel(i === sel ? null : i < sel ? sel - 1 : sel);
    s.patch((cur) =>
      withGallery(
        cur,
        galleryOf(cur).filter((_, j) => j !== i),
      ),
    );
  };

  const reframe = (i: number, crop: StoredFile["crop"]) =>
    s.patch((cur) =>
      withGallery(
        cur,
        galleryOf(cur).map((f, j) => (j === i ? { ...f, crop } : f)),
      ),
    );

  const move = (from: number, to: number) => {
    setSel(null);
    s.patch((cur) => {
      const next = [...galleryOf(cur)];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return withGallery(cur, next);
    });
  };

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
                // Lifted where it was pressed: a tap, which picks it.
                else if (dragFrom === i && to === i) select(sel === i ? null : i);
                setDragFrom(null);
                setDragOver(null);
              }}
              onPointerCancel={() => {
                setDragFrom(null);
                setDragOver(null);
              }}
              className={`relative aspect-square cursor-grab overflow-hidden rounded-[8.1px] border ${
                (dragOver === i && dragFrom !== i) || (sel === i && dragFrom === null)
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-mc-acc-line"
              } ${dragFrom === i ? "opacity-50" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.url ?? f.dataUrl}
                alt=""
                draggable={false}
                className="absolute inset-0 h-full w-full"
                style={cropStyle(f)}
              />
              <a
                href="#"
                aria-label="Remove image"
                onClick={(e) => {
                  e.preventDefault();
                  remove(i);
                }}
                className="absolute top-[3.2px] right-[3.2px] flex h-[16.22px] w-[16.22px] items-center justify-center rounded-full bg-white text-muted shadow-[1px_1px_3.5px_0_rgba(0,0,0,0.45)] [&>svg]:block [&>svg]:h-[8.5px] [&>svg]:w-[8.5px]"
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
        {/*
          Reframing, which the file does not have: Tami found photos showing
          only their middle with no way to move them. Unmocked — the hint
          borrows the Sub line, the panel is the same ImageAdjuster the
          single-photo fields use. See LAUNCH.md.
        */}
        {list.length > 0 && (
          <Sub>
            {picked
              ? `Image ${sel! + 1}: drag to reposition, slide to zoom. Tap it again when done.`
              : "Tap an image to adjust its position & zoom."}
          </Sub>
        )}
        {picked && (
          <ImageAdjuster
            shape="wide"
            stored={picked}
            src={picked.url ?? picked.dataUrl ?? ""}
            onChange={(crop) => reframe(sel!, crop)}
          />
        )}
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
  const message = s.values.message ?? WA_DEFAULT;

  // Their file prefills the message as a real value, so it reaches the code.
  const { values, patch } = s;
  useEffect(() => {
    if (values.message !== undefined) return;
    patch((cur) => ({ ...cur, message: cur.message ?? WA_DEFAULT }));
    // Once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <IntlNumberFld
        s={s}
        ccId="waCc"
        numId="waNum"
        label="WhatsApp number"
        tip={{
          label: "About your WhatsApp number",
          text: "The number people message on WhatsApp after scanning.",
        }}
      />
      <Fld
        id="waMsg"
        label="Pre-typed message (optional)"
        tip={{
          label: "About the pre-typed message",
          text: "Pre-filled chat text. The scanner just taps send.",
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
