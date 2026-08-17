"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Contact,
  FileText,
  Image as ImageIcon,
  Video,
  Smartphone,
  MessageCircle,
  MessageSquare,
  Share2,
  Wifi,
  Star,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  CalendarDays,
  Link as LinkIcon,
  Type,
  Pencil,
  Palette,
  Briefcase,
  UserPlus,
  Download,
  Images,
  Camera,
  Lock,
  QrCode,
  Clock,
  Signal,
  BatteryFull,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

type QrType = {
  key: string;
  label: string;
  accent: string;
  icon: LucideIcon;
  tiles: [LucideIcon, LucideIcon];
  blurb: string;
};

const types: QrType[] = [
  {
    key: "website",
    label: "Website",
    accent: "#2563eb",
    icon: Globe,
    tiles: [Pencil, Palette],
    blurb:
      "Point a scan straight to your site. Drop in any URL and send customers, clients, or fans to your page, shop, or booking link in one tap.",
  },
  {
    key: "vcard",
    label: "vCard",
    accent: "#11b1a7",
    icon: Contact,
    tiles: [Briefcase, UserPlus],
    blurb:
      "Hand over your details without the paper. One scan saves your name, number, and links straight to someone's contacts — built for events and everyday networking.",
  },
  {
    key: "pdf",
    label: "PDF",
    accent: "#f97316",
    icon: FileText,
    tiles: [Download, Share2],
    blurb:
      "Put any document one scan away. Attach a menu, brochure, price list, or guide and let people open it on their phone instantly — no app needed.",
  },
  {
    key: "image",
    label: "Image",
    accent: "#0ea5e9",
    icon: ImageIcon,
    tiles: [Images, Camera],
    blurb:
      "Turn a scan into a gallery. Share product shots, event photos, or a hero image that opens full-screen the moment someone scans.",
  },
  {
    key: "video",
    label: "Video",
    accent: "#10b981",
    icon: Video,
    tiles: [Images, Share2],
    blurb:
      "Play a video from anything you print. Link a tutorial, trailer, or promo and it starts the instant it's scanned — on packaging, posters, or cards.",
  },
  {
    key: "applink",
    label: "App Link",
    accent: "#6366f1",
    icon: Smartphone,
    tiles: [Star, LinkIcon],
    blurb:
      "Skip the app-store search. One code sends iPhone and Android users to the right download page automatically — turning a scan into an install.",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    accent: "#22c55e",
    icon: MessageCircle,
    tiles: [Pencil, Camera],
    blurb:
      "Open a chat with one scan. Let customers message you on WhatsApp instantly — no saving numbers, no typing — so conversations start faster.",
  },
  {
    key: "sms",
    label: "SMS",
    accent: "#f59e0b",
    icon: MessageSquare,
    tiles: [Pencil, LinkIcon],
    blurb:
      "Make texting you effortless. A single scan opens a pre-filled message on the visitor's phone, so they reach you in a tap.",
  },
  {
    key: "social",
    label: "Social Media",
    accent: "#d946ef",
    icon: Share2,
    tiles: [LinkIcon, Images],
    blurb:
      "Grow every follow from one code. Link all your profiles behind a single scan so people follow and connect wherever they already are.",
  },
  {
    key: "wifi",
    label: "WiFi",
    accent: "#06b6d4",
    icon: Wifi,
    tiles: [Lock, QrCode],
    blurb:
      "Share your Wi-Fi without the password dance. Guests scan once and connect automatically — ideal for cafés, offices, rentals, and events.",
  },
  {
    key: "feedback",
    label: "Feedback",
    accent: "#f43f5e",
    icon: Star,
    tiles: [MessageCircle, Pencil],
    blurb:
      "Turn a scan into a review. Let customers rate their visit and leave feedback on the spot, so you learn what's working and fix what isn't.",
  },
  {
    key: "payment",
    label: "Payment",
    accent: "#0d9488",
    icon: CreditCard,
    tiles: [Lock, QrCode],
    blurb:
      "Get paid with a scan. Point the code at your payment link and let customers check out on their phone — nothing to install, no integration to wire up.",
  },
  {
    key: "email",
    label: "Email",
    accent: "#8b5cf6",
    icon: Mail,
    tiles: [Pencil, Share2],
    blurb:
      "One scan pre-fills the recipient, subject line, and body in their mail app — handy for support requests, bookings, and quick questions you'd rather not type out.",
  },
  {
    key: "location",
    label: "Location",
    accent: "#f4633a",
    icon: MapPin,
    tiles: [QrCode, LinkIcon],
    blurb:
      "Put your address one scan away. The code opens directions in their maps app and guides visitors straight to your store, office, or event.",
  },
  {
    key: "phone",
    label: "Phone",
    accent: "#65a30d",
    icon: Phone,
    tiles: [UserPlus, MessageSquare],
    blurb:
      "Let customers call you in one tap. A scan dials your number directly — no typing, no searching — perfect for support lines, bookings, and storefronts.",
  },
  {
    key: "event",
    label: "Event",
    accent: "#dc2626",
    icon: CalendarDays,
    tiles: [Clock, MapPin],
    blurb:
      "Get your event into their calendar. One scan shows guests the date, time, and venue with one-tap add to calendar — fewer no-shows, no back-and-forth.",
  },
  {
    key: "multilink",
    label: "Multi-Link",
    accent: "#7e22ce",
    icon: LinkIcon,
    tiles: [Share2, Star],
    blurb:
      "One code, all your links. Send visitors to a mini page with your menu, booking, phone, and directions — perfect for windows, counters, and receipts.",
  },
  {
    key: "text",
    label: "Text",
    accent: "#404040",
    icon: Type,
    tiles: [Pencil, FileText],
    blurb:
      "Share a message with no website needed. A scan reveals your note — instructions, a welcome, a heads-up — readable instantly on any phone.",
  },
];

/** rgba() helper so the accent can be used at partial opacity. */
function alpha(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function PhonePreview({ type }: { type: QrType }) {
  const { accent, icon: Icon, tiles } = type;
  const [TileA, TileB] = tiles;

  return (
    <div
      aria-hidden="true"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] sm:aspect-[16/10] lg:aspect-[16/9]"
      style={{ background: alpha(accent, 0.1) }}
    >
      {/* Floating accent badges */}
      <span
        className="absolute left-5 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-2xl text-white shadow-pop sm:flex"
        style={{ background: accent }}
      >
        <Icon className="h-7 w-7" />
      </span>
      <span
        className="absolute right-6 top-8 z-20 hidden h-11 w-11 items-center justify-center rounded-2xl shadow-soft sm:flex"
        style={{ background: alpha(accent, 0.16), color: accent }}
      >
        <TileA className="h-5 w-5" />
      </span>
      <span
        className="absolute bottom-10 right-6 z-20 hidden h-11 w-11 items-center justify-center rounded-2xl shadow-soft sm:flex"
        style={{ background: alpha(accent, 0.16), color: accent }}
      >
        <TileB className="h-5 w-5" />
      </span>

      {/* Phone */}
      <div
        key={type.key}
        className="showcase-fade absolute left-1/2 top-7 w-[210px] -translate-x-1/2 sm:w-[240px]"
      >
        <div className="relative rounded-[2.5rem] border-[7px] border-ink bg-ink shadow-pop">
          <span className="absolute left-1/2 top-3 z-20 h-5 w-16 -translate-x-1/2 rounded-full bg-ink sm:w-20" />
          <div className="relative h-[452px] overflow-hidden rounded-[2rem] bg-white">
            <div className="flex h-full flex-col">
              <div style={{ background: accent }}>
                <div className="flex items-center justify-between px-5 pb-1 pt-3 text-xs font-semibold text-white">
                  <span>9:41</span>
                  <span className="flex items-center gap-1">
                    <Signal className="h-3 w-3" />
                    <Wifi className="h-3 w-3" />
                    <BatteryFull className="h-3 w-3" />
                  </span>
                </div>
                <div className="px-3 pb-3 pt-1">
                  <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
                    <Globe className="h-3 w-3 text-muted" />
                    <span className="truncate text-[11px] font-medium text-ink">
                      barcodesqr.com
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between px-0.5 text-white">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              <div className="-mt-1 flex-1 rounded-t-2xl bg-white p-3.5">
                <div className="relative h-32 overflow-hidden rounded-2xl">
                  <div
                    role="img"
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url(/previews/cafe.jpg)" }}
                  />
                  <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white shadow-sm">
                    <Heart className="h-3 w-3" style={{ color: accent }} />
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="space-y-2">
                    <div
                      className="h-2 rounded-full bg-line-soft"
                      style={{ width: 64 }}
                    />
                  </div>
                  <Icon className="h-4 w-4" style={{ color: accent }} />
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                  {[TileA, TileB].map((Tile, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-line/70 bg-white p-2 shadow-sm"
                    >
                      <div
                        className="relative grid h-14 place-items-center rounded-lg"
                        style={{ background: alpha(accent, 0.12) }}
                      >
                        <Tile className="h-5 w-5" style={{ color: accent }} />
                        <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-white shadow-sm">
                          <Star className="h-2.5 w-2.5 text-star" />
                        </span>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div
                          className="h-2 rounded-full bg-line-soft"
                          style={{ width: "90%" }}
                        />
                        <div
                          className="h-2 rounded-full bg-line-soft"
                          style={{ width: "50%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Showcase() {
  const [active, setActive] = useState(0);
  const type = types[active];

  return (
    <section className="bg-white">
      <div className="container-page py-16 md:py-20">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Generate a QR code in seconds.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Choose a type below and watch your dynamic QR code come to life.
        </p>

        <div
          role="tablist"
          aria-label="Generate a QR code in seconds."
          className="scroll-thin mt-10 flex gap-3 overflow-x-auto px-1 pb-2 pt-1"
        >
          {types.map((t, i) => {
            const selected = i === active;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={`flex min-w-[104px] shrink-0 cursor-pointer flex-col items-center gap-2.5 rounded-2xl border bg-white p-4 shadow-sm transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                  selected ? "" : "border-line/70 text-body hover:shadow-md"
                }`}
                style={
                  selected
                    ? {
                        borderColor: t.accent,
                        color: t.accent,
                        background: alpha(t.accent, 0.07),
                      }
                    : undefined
                }
              >
                <Icon
                  className="h-7 w-7"
                  style={{ color: selected ? t.accent : "#0e8f87" }}
                />
                <span className="whitespace-nowrap text-xs font-semibold">
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid items-center gap-10 md:grid-cols-[5fr_7fr]">
          <div>
            <h3 className="text-2xl font-bold">{type.label}</h3>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
              {type.blurb}
            </p>
            <Link className="mt-7 inline-block" href="/create">
              <Button size="lg">Create QR Code</Button>
            </Link>
          </div>

          <PhonePreview type={type} />
        </div>
      </div>
    </section>
  );
}
