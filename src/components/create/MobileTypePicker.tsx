"use client";

import Link from "next/link";
import { primaryTypes, secondaryTypes } from "./qrTypes";
import type { CreateQrType } from "./qrTypes";
import { designerTypeIcons } from "./designerTypeIcons";

/**
 * Step 1 below `md`, ported from create_mobile.html.
 *
 * Not a reflow of the desktop picker: the mobile file has its own numbered
 * rail, one type per row with a visible radio, a three-up "More QR Types"
 * grid whose tiles carry a description, and a preview card ending in the
 * Continue button. Picking a row only SELECTS it here — Continue is what
 * advances, which is the one behavioural difference from desktop, where a
 * click on a format goes straight into its form.
 *
 * Every number is the mockup's computed value at 390px. Their stylesheet
 * sizes this page in `vw`, so it scales with the screen; ours is fixed at
 * the 390 rendering, as the mobile homepage is.
 */

const railSteps = ["Choose", "Customize", "Download"];

/** Their `.top`: numbered circles joined by a grey bar, the first one live. */
function NumberRail() {
  return (
    <div className="flex">
      {railSteps.map((label, i) => {
        const on = i === 0;
        const last = i === railSteps.length - 1;
        return (
          <div
            key={label}
            className={`flex items-center text-left ${last ? "flex-none" : "flex-auto"}`}
          >
            <div
              className={`flex h-[29.9px] w-[29.9px] shrink-0 items-center justify-center rounded-full text-[11.72px] font-bold ${
                on ? "bg-primary text-white" : "bg-mc-num text-prose"
              }`}
            >
              {i + 1}
            </div>
            <h5
              className={`ml-[7.2px] max-w-[70.3px] text-[11.72px] leading-[14.07px] ${
                on ? "font-bold text-primary" : "font-medium text-muted"
              }`}
            >
              {label}
            </h5>
            {/* Their `.stp:not(:last-child):after` connector. */}
            {!last && (
              <span
                aria-hidden="true"
                className="mx-[6.5px] block h-[1.63px] min-w-[7.8px] flex-1 bg-mc-rule"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TypeRow({
  type,
  selected,
  onSelect,
}: {
  type: CreateQrType;
  selected: boolean;
  onSelect: () => void;
}) {
  const Glyph = designerTypeIcons[type.value];
  return (
    <li
      className={`rounded-[11.1px] border ${
        selected ? "border-primary bg-mc-on" : "border-mc-card-line bg-white"
      }`}
    >
      <label className="flex cursor-pointer items-center p-[11.138px]">
        <div
          className="flex h-[40.84px] w-[40.84px] shrink-0 items-center justify-center rounded-full"
          style={{ background: `${type.color}14` }}
        >
          <Glyph className="h-[23.2px] w-[23.2px]" />
        </div>
        <div className="min-w-0 flex-1 pl-[7.4px] pr-[4.6px]">
          <h5
            className={`flex items-center text-[13.92px] leading-[normal] font-bold ${
              selected ? "text-primary-dark" : "text-black"
            }`}
          >
            {type.label}
            {type.tag && (
              <span className="ml-[6.2px] rounded-full bg-mc-tag px-[6.5px] py-[2.8px] text-[9.75px] font-bold tracking-[0.39px] text-brand-dark">
                {type.tag}
              </span>
            )}
          </h5>
          <p className="mt-[2.8px] text-[11.6px] leading-[16.82px] font-medium text-muted">
            {type.desc}
          </p>
        </div>
        {/* A real radio, drawn the way their `input[type=radio]` is. */}
        <input
          type="radio"
          name="qrTypeMobile"
          value={type.value}
          checked={selected}
          onChange={onSelect}
          className={`h-[26.7px] w-[26.7px] shrink-0 cursor-pointer appearance-none rounded-full bg-center bg-no-repeat ${
            selected
              ? "border border-mc-radio-on-line bg-primary bg-[url(/create/check-white.svg)] bg-[length:12px_12px]"
              : "border-2 border-mc-radio-line bg-white"
          }`}
        />
      </label>
    </li>
  );
}

/** Their `.chv`: the grey caret at the end of each small tile. */
function TileCaret() {
  return (
    <div className="flex shrink-0">
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-[9.8px] w-[9.8px]"
      >
        <path
          d="M6.375 4.25L10.625 8.5L6.375 12.75"
          stroke="#9CA3AF"
          strokeWidth="1.41667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const tileBox =
  "flex cursor-pointer items-center px-[6.6px] py-[9px] text-left";

function TypeTile({
  type,
  selected,
  onSelect,
}: {
  type: CreateQrType;
  selected: boolean;
  onSelect: () => void;
}) {
  const Glyph = designerTypeIcons[type.value];
  return (
    <li
      className={`rounded-[9.8px] border ${
        selected ? "border-primary bg-mc-on" : "border-mc-card-line bg-white"
      }`}
    >
      <label className={tileBox}>
        <div
          className="flex h-[28.7px] w-[28.7px] shrink-0 items-center justify-center rounded-full"
          style={{ background: `${type.color}14` }}
        >
          <Glyph className="h-[14.3px] w-[14.3px]" />
        </div>
        <TileText title={type.label} desc={type.tileDesc ?? ""} />
        <TileCaret />
        <input
          type="radio"
          name="qrTypeMobile"
          value={type.value}
          checked={selected}
          onChange={onSelect}
          className="sr-only"
        />
      </label>
    </li>
  );
}

function TileText({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="min-w-0 flex-1 pl-[5.7px] pr-[2.5px]">
      <h5 className="block text-[9.83px] leading-[normal] font-bold text-ink">
        {title}
      </h5>
      <p className="mt-[1.6px] text-[8.19px] leading-[9.42px] font-medium text-muted">
        {desc}
      </p>
    </div>
  );
}

/** Their preview-card perks, glyphs copied from the file. */
const perks: { title: string; tint: string; icon: React.ReactNode }[] = [
  {
    title: "Dynamic",
    tint: "rgba(17, 177, 167, 0.08)",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-[17.2px] w-[17.2px]"
      >
        <path
          d="M18.375 10.5C18.3766 12.322 17.7464 14.0882 16.5917 15.4976C15.437 16.907 13.8294 17.8724 12.0426 18.2294C10.2559 18.5863 8.40074 18.3126 6.7932 17.455C5.18566 16.5973 3.92524 15.2088 3.22672 13.526C2.5282 11.8432 2.43481 9.9703 2.96246 8.22636C3.4901 6.48243 4.60614 4.97541 6.12039 3.96212C7.63464 2.94882 9.4534 2.49195 11.2668 2.66935C13.0801 2.84675 14.7758 3.64745 16.065 4.935"
          stroke="#11B1A7"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.375 2.625V7.875H13.125"
          stroke="#11B1A7"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Trackable",
    tint: "rgba(37, 99, 235, 0.08)",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-[17.2px] w-[17.2px]"
      >
        <path
          d="M12 20V10"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 20V4"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 20V16"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Editable",
    tint: "rgba(124, 58, 237, 0.08)",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-[17.2px] w-[17.2px]"
      >
        <path
          d="M16.1 2.275C16.4481 1.9269 16.9202 1.73134 17.4125 1.73134C17.9048 1.73134 18.3769 1.9269 18.725 2.275C19.0731 2.6231 19.2687 3.09522 19.2687 3.5875C19.2687 4.07978 19.0731 4.5519 18.725 4.9L10.85 12.775L7.35 13.65L8.225 10.15L16.1 2.275Z"
          stroke="#7C3AED"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Secure",
    tint: "rgba(239, 68, 68, 0.08)",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-[17.2px] w-[17.2px]"
      >
        <path
          d="M17.5 11.375C17.5 15.75 14.4375 17.9375 10.7975 19.2062C10.6069 19.2708 10.3998 19.2678 10.2113 19.1975C6.5625 17.9375 3.5 15.75 3.5 11.375V5.25C3.5 5.01794 3.59219 4.79538 3.75628 4.63128C3.92038 4.46719 4.14294 4.375 4.375 4.375C6.125 4.375 8.3125 3.325 9.835 1.995C9.91714 1.89894 10.0191 1.82182 10.1339 1.76894C10.2487 1.71606 10.3736 1.68868 10.5 1.68868C10.6264 1.68868 10.7513 1.71606 10.8661 1.76894C10.9809 1.82182 11.0829 1.89894 11.165 1.995C12.6963 3.33375 14.875 4.375 16.625 4.375C16.8571 4.375 17.0796 4.46719 17.2437 4.63128C17.4078 4.79538 17.5 5.01794 17.5 5.25V11.375Z"
          stroke="#EF4444"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/** Their `.genBtn9`: 57.5px tall, 16px/600, 11.2px corners. */
const bigBtn =
  "flex h-[57.5px] w-full items-center justify-center gap-[9.6px] rounded-[11.2px] px-[17.6px] text-[15.99px] leading-[20.79px] font-semibold capitalize transition-colors";

export function MobileTypePicker({
  selected,
  onSelect,
  onContinue,
}: {
  selected: string;
  onSelect: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="bg-white px-[14.6px] py-[12.2px]">
      <NumberRail />

      <div className="py-[12.2px]">
        <h4 className="text-center text-[26.79px] leading-[normal] font-extrabold tracking-[-1.34px] text-black">
          Choose your QR code type
        </h4>
        <p className="mt-[6.1px] text-center text-[12.29px] leading-[normal] font-medium text-muted">
          Choose what you want to share, then create your QR code.
        </p>

        <ul className="mt-[11.6px] grid gap-[14px]">
          {primaryTypes.map((type) => (
            <TypeRow
              key={type.value}
              type={type}
              selected={selected === type.value}
              onSelect={() => onSelect(type.value)}
            />
          ))}
        </ul>

        {/* Their `.lnk`. Not a disclosure in their file either — the grid
            below is always open — so, as on desktop, it is a label for the
            grid that does nothing when pressed. */}
        <div className="mt-[31.7px] flex flex-col items-center">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center text-[14.43px] leading-[normal] font-bold text-black"
          >
            More QR Types
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/create/chevron-down.svg"
              alt=""
              className="ml-[4.5px] h-[15.3px] w-[15.3px]"
            />
          </a>
          <p className="pt-[4.7px] text-[10.53px] leading-[normal] text-muted">
            Explore more ways to connect
          </p>
        </div>

        <ul className="mt-[8.5px] grid grid-cols-3 gap-[7.3px]">
          {secondaryTypes.map((type) => (
            <TypeTile
              key={type.value}
              type={type}
              selected={selected === type.value}
              onSelect={() => onSelect(type.value)}
            />
          ))}
          <li className="rounded-[9.8px] border border-mc-card-line bg-white">
            <a href="#" onClick={(e) => e.preventDefault()} className={tileBox}>
              <div
                className="flex h-[28.7px] w-[28.7px] shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(156, 163, 175, 0.08)" }}
              >
                <designerTypeIcons.seeall className="h-[14.3px] w-[14.3px]" />
              </div>
              <TileText title="See All" desc="View all 23 QR types" />
              <TileCaret />
            </a>
          </li>
        </ul>

        {/* Their `.rgt`: the preview card, which also carries the actions. */}
        <div className="mt-[18.6px] rounded-[14.9px] border border-mc-card-line bg-white p-[18.6px]">
          <div className="flex justify-center rounded-[14px] border border-mc-art-line p-[12.2px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/create/qr-illustration.svg"
              alt=""
              className="h-[190.3px] w-[190.3px]"
            />
          </div>

          <div className="mt-[16.4px]">
            <h5 className="text-center text-[19.66px] leading-[normal] font-extrabold tracking-[-0.39px] text-ink">
              Your QR Code Preview
            </h5>
            <p className="mt-[4.9px] text-center text-[13.92px] leading-[normal] text-muted">
              Select a QR type to see your code update here.
            </p>

            <ul className="mt-[21.3px] grid grid-cols-2 gap-[11.5px]">
              {perks.map((p) => (
                <li
                  key={p.title}
                  className="flex items-center rounded-[9.8px] border border-mc-card-line bg-white p-[11.5px]"
                >
                  <div
                    className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full"
                    style={{ background: p.tint }}
                  >
                    {p.icon}
                  </div>
                  <h5 className="pl-[11.4px] text-[13.92px] leading-[normal] font-bold text-ink">
                    {p.title}
                  </h5>
                </li>
              ))}
            </ul>

            <div className="mt-[22.9px]">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
                className={`${bigBtn} bg-primary text-white hover:bg-primary-press`}
              >
                Continue to Customize
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[19.2px] w-[19.2px]"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="mt-[10.6px]">
              <Link
                href="/"
                className={`${bigBtn} border border-mc-cancel-line bg-white text-body hover:border-primary hover:bg-primary hover:text-white`}
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
