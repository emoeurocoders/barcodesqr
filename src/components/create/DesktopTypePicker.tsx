"use client";

import { designerTypeIcons } from "./designerTypeIcons";

/**
 * Step 1 at `md` and up — create_desktop.html (2026-10-21), which replaced the
 * radio cards, the "More QR Types" tiles and the preview panel with one grid
 * of all 23 formats. Choosing one goes straight to its form, as on mobile.
 *
 * Labels, descriptions and order are the file's, pasted. The glyphs are
 * `designerTypeIcons`, whose path data matches this file's byte for byte.
 *
 * Measured at 1440 / 1100 / 800 (their `.mainCreateDskV2` rules, 10px em):
 * three columns above 1190, two to 801, one at 800 and below; a 34px title
 * that drops to 29px at 800.
 */

const types: { value: string; label: string; desc: string; tag?: string }[] = [
  { value: "website", label: "Website", desc: "Open a website or landing page", tag: "MOST USED" },
  { value: "vcard", label: "vCard", desc: "Share a digital business card" },
  { value: "multilink", label: "Multi-Link", desc: "Share several links at once" },
  { value: "social", label: "Social Media", desc: "Share all your social profiles" },
  { value: "applink", label: "App Link", desc: "Send users to the right app store" },
  { value: "pdf", label: "PDF", desc: "Open or download a PDF file" },
  { value: "image", label: "Image", desc: "Display an image or photo" },
  { value: "whatsapp", label: "WhatsApp", desc: "Start a WhatsApp chat" },
  { value: "menu", label: "Menu", desc: "Share your digital menu" },
  { value: "wifi", label: "WiFi", desc: "Connect to a WiFi network" },
  { value: "video", label: "Video", desc: "Play a video with one scan" },
  { value: "review", label: "Google Review", desc: "Get more reviews on Google" },
  { value: "location", label: "Google Maps", desc: "Share a location" },
  { value: "event", label: "Event", desc: "Promote your event" },
  { value: "email", label: "Email", desc: "Send an email message" },
  { value: "sms", label: "SMS", desc: "Send a text message" },
  { value: "phone", label: "Phone", desc: "Call a phone number" },
  { value: "text", label: "Plain Text", desc: "Show text instantly" },
  { value: "payment", label: "Payment", desc: "Accept payments" },
  { value: "mp3", label: "Audio", desc: "Play an audio file" },
  { value: "coupon", label: "Coupon", desc: "Share a discount" },
  { value: "feedback", label: "Feedback", desc: "Collect feedback" },
  { value: "business", label: "Business", desc: "Share business info" },
];

export function DesktopTypePicker({ onChoose }: { onChoose: (value: string) => void }) {
  return (
    // Their `.FrmCtr > div > .btm > .lft`: a 1240 column with 20px of
    // padding, inside which `.btm` pads another 20 — 40px from the edge
    // below 1240, a 1160 grid above it.
    <div className="mx-auto max-w-[1240px] px-5">
      <div className="p-5">
        <h4 className="text-center text-[34px] leading-[normal] font-extrabold tracking-[-0.02em] text-black [@media(max-width:800px)]:text-[29px]">
          Choose your QR code type
        </h4>
        {/* "wan" is the file's typo; JB asked for "want" (2026-10-21). */}
        <p className="mt-[8.25px] text-center text-[16.5px] leading-[normal] text-muted">
          Choose what you want to share, then create your QR code.
        </p>

        <ul className="mt-[19px] grid grid-cols-3 gap-[14px] [@media(max-width:1190px)]:grid-cols-2 [@media(max-width:800px)]:grid-cols-1">
          {types.map((t) => {
            const Icon = designerTypeIcons[t.value];
            return (
              <li
                key={t.value}
                className="group rounded-[12px] border border-cd-card-line bg-white hover:border-cd-hover-line hover:bg-cd-hover"
              >
                <a
                  href={`/create?type=${t.value}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onChoose(t.value);
                  }}
                  className="flex cursor-pointer items-center p-3"
                >
                  <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center">
                    <Icon className="block h-[25px] w-[25px]" />
                  </div>
                  <div className="min-w-0 flex-1 pr-[5px] pl-2">
                    <h5 className="flex items-center text-[15px] leading-[normal] font-bold text-black">
                      {t.label}
                      {t.tag && (
                        <span className="ml-[6.72px] rounded-full bg-cd-tag px-[7.035px] py-[3.045px] text-[10.5px] leading-[normal] font-bold tracking-[0.04em] text-brand-dark">
                          {t.tag}
                        </span>
                      )}
                    </h5>
                    <p className="mt-[3px] text-[12.5px] leading-[1.45em] text-muted">{t.desc}</p>
                  </div>
                  <div className="flex shrink-0">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="block h-[17px] w-[17px]"
                    >
                      <path
                        d="M6.375 4.25L10.625 8.5L6.375 12.75"
                        stroke="#9CA3AF"
                        strokeWidth="1.41667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:stroke-primary"
                      />
                    </svg>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
