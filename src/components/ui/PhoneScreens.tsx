"use client";

import {
  Signal,
  Wifi,
  BatteryFull,
  Globe,
  Menu as MenuIcon,
  ShoppingCart,
  Heart,
  ChevronRight,
  Image as ImageIcon,
  Plus,
  Phone as PhoneIcon,
  Mail,
  MapPin,
  Scissors,
  Sparkles,
  Share2,
  Play,
  Download,
  Star,
  ArrowLeft,
  User,
  Video as VideoIcon,
  CheckCheck,
  ArrowUp,
  BadgeCheck,
  Check,
  X,
  Send,
  Coffee,
  MicOff,
  Grid3x3,
  Volume2,
  PhoneOff,
  CalendarPlus,
  UtensilsCrossed,
  CalendarCheck,
  Navigation,
  ArrowUpRight,
  Quote,
  Copy,
  Lock,
} from "lucide-react";

/** rgba() helper so an accent can be used at partial opacity. */
export function alpha(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/* ---------------------------------------------------------------- shared */

function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between px-5 pb-1 pt-3 text-xs font-semibold ${
        dark ? "text-ink" : "text-white"
      }`}
    >
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <Signal className="h-3 w-3" />
        <Wifi className="h-3 w-3" />
        <BatteryFull className="h-3 w-3" />
      </span>
    </div>
  );
}

/** Grey placeholder line, used where the real design shows dummy copy. */
function Bar({ w = "100%", className = "" }: { w?: string; className?: string }) {
  return (
    <div
      className={`h-2 rounded-full bg-line-soft ${className}`}
      style={{ width: w }}
    />
  );
}

function Row({
  icon: Icon,
  label,
  accent,
  chevron = true,
}: {
  icon: React.ElementType;
  label: string;
  accent: string;
  chevron?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-line/70 bg-white px-2.5 py-2">
      <span
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
        style={{ background: alpha(accent, 0.12), color: accent }}
      >
        <Icon className="h-3 w-3" />
      </span>
      <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-ink">
        {label}
      </span>
      {chevron && <ChevronRight className="h-3 w-3 shrink-0 text-faint" />}
    </div>
  );
}

function Header({
  accent,
  title,
  children,
}: {
  accent: string;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ background: accent }}>
      <StatusBar />
      {title && (
        <p className="px-4 pb-3 pt-1 text-[13px] font-bold text-white">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- screens */

function WebsiteScreen({ accent }: { accent: string }) {
  return (
    <>
      <Header accent={accent}>
        <div className="px-3 pb-2 pt-1">
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
            <Globe className="h-3 w-3 text-muted" />
            <span className="truncate text-[11px] font-medium text-ink">
              barcodesqr.com
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between px-0.5 text-white">
            <MenuIcon className="h-3.5 w-3.5" />
            <ShoppingCart className="h-3.5 w-3.5" />
          </div>
        </div>
      </Header>
      <div className="flex-1 bg-white p-3.5">
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
          <Bar w="64px" />
          <ChevronRight className="h-3.5 w-3.5" style={{ color: accent }} />
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-line/70 bg-white p-2 shadow-sm"
            >
              <div
                className="relative grid h-14 place-items-center rounded-lg"
                style={{ background: alpha(accent, 0.12) }}
              >
                <ImageIcon className="h-5 w-5" style={{ color: accent }} />
                <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-white shadow-sm">
                  <Heart className="h-2.5 w-2.5" style={{ color: accent }} />
                </span>
              </div>
              <div className="mt-2 space-y-2">
                <Bar w="90%" />
                <Bar w="50%" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function VCardScreen({ accent }: { accent: string }) {
  return (
    <>
      <div className="relative pb-12" style={{ background: accent }}>
        <StatusBar />
        <div className="px-4 pb-4 pt-2 text-center">
          <p className="text-base font-bold text-white">John Smith</p>
          <p className="text-[11px] text-white/85">Product Designer</p>
        </div>
        <div
          role="img"
          aria-label="John Smith"
          className="absolute -bottom-8 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full border-4 border-white bg-cover bg-center shadow-sm"
          style={{ backgroundImage: "url(/avatars/3.png)" }}
        />
      </div>
      <div className="flex-1 bg-white px-3.5 pt-11">
        <button className="mx-auto flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[11px] font-semibold text-white">
          <Plus className="h-3 w-3" />
          Add contact
        </button>
        <div className="mt-4 space-y-2">
          <Row icon={PhoneIcon} label="+1 555 0142" accent={accent} />
          <Row icon={Mail} label="john@studio.co" accent={accent} />
          <Row icon={MapPin} label="San Francisco" accent={accent} />
        </div>
      </div>
    </>
  );
}

function PdfScreen({ accent }: { accent: string }) {
  const items = [
    ["Cut & style", "$45"],
    ["Full color", "$80"],
    ["Blowout", "$35"],
    ["Treatment", "$25"],
  ];
  return (
    <>
      <Header accent={accent} title="Your PDF, one scan away" />
      <div className="flex-1 bg-white p-3.5">
        <div className="rounded-2xl border border-line/70 p-3">
          <div className="flex items-center gap-2">
            <span
              className="grid h-7 w-7 place-items-center rounded-lg"
              style={{ background: alpha(accent, 0.12), color: accent }}
            >
              <Scissors className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-[12px] font-bold text-ink">Salon Glow</p>
              <p className="text-[10px] text-muted">Price list</p>
            </div>
            <Sparkles
              className="ml-auto h-3.5 w-3.5"
              style={{ color: accent }}
            />
          </div>
          <div className="mt-3 space-y-2">
            {items.map(([name, price]) => (
              <div
                key={name}
                className="flex items-center justify-between border-b border-line/60 pb-1.5 last:border-0"
              >
                <span className="text-[11px] text-body">{name}</span>
                <span className="text-[11px] font-bold text-ink">{price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ImageScreen({ accent }: { accent: string }) {
  return (
    <>
      <Header accent={accent} title="Your image" />
      <div className="relative flex-1 bg-white">
        <div
          role="img"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/previews/sunset-hearts.jpg)" }}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-gradient-to-t from-black/55 to-transparent px-4 pb-4 pt-10 text-white">
          {[Heart, Share2, MapPin].map((Icon, i) => (
            <span
              key={i}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/25 backdrop-blur"
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function VideoScreen({ accent }: { accent: string }) {
  return (
    <>
      <Header accent={accent} title="Your video" />
      <div className="flex-1 bg-white">
        <div className="relative h-40">
          <div
            role="img"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/previews/video-thumb.jpg)" }}
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow-sm">
              <Play className="h-4 w-4 fill-ink text-ink" />
            </span>
          </span>
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            3:24
          </span>
        </div>
        <div className="p-3.5">
          <p className="text-[12px] font-bold leading-snug text-ink">
            Golden hour with the crew
          </p>
          <p className="mt-1 text-[10px] text-muted">1.2K views · 2h ago</p>
        </div>
      </div>
    </>
  );
}

function AppLinkScreen({ accent }: { accent: string }) {
  return (
    <>
      <Header accent={accent} title="Your App" />
      <div className="flex-1 bg-white p-3.5 text-center">
        <span
          className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-white shadow-sm"
          style={{ background: accent }}
        >
          <Download className="h-7 w-7" />
        </span>
        <div className="mt-3 flex items-center justify-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="h-3 w-3 fill-star text-star" />
          ))}
          <span className="ml-1 text-[11px] font-bold text-ink">4.9</span>
        </div>
        <div className="mt-4 space-y-2">
          {[
            ["Download on", "the App Store"],
            ["Get it on", "Google Play"],
          ].map(([small, big]) => (
            <div
              key={big}
              className="flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-left text-white"
            >
              <Play className="h-4 w-4 shrink-0 fill-white" />
              <span>
                <span className="block text-[8px] leading-tight opacity-80">
                  {small}
                </span>
                <span className="block text-[11px] font-bold leading-tight">
                  {big}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ChatScreen({
  accent,
  title,
  message,
}: {
  accent: string;
  title: string;
  message: string;
}) {
  return (
    <>
      <div style={{ background: accent }}>
        <StatusBar />
        <div className="flex items-center gap-2 px-3 pb-3 pt-1 text-white">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/25">
            <User className="h-3 w-3" />
          </span>
          <span className="flex-1 truncate text-[11px] font-bold">{title}</span>
          <VideoIcon className="h-3.5 w-3.5" />
          <PhoneIcon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="flex-1 bg-bg-alt/60 p-3">
        <p className="mb-2 text-center text-[9px] font-medium text-faint">
          Today
        </p>
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-white px-3 py-2 shadow-sm">
          <p className="text-[11px] leading-relaxed text-ink">{message}</p>
          <span className="mt-1 flex items-center justify-end gap-1 text-[9px] text-faint">
            9:41
            <CheckCheck className="h-3 w-3" style={{ color: accent }} />
          </span>
        </div>
      </div>
    </>
  );
}

function SmsScreen({ accent }: { accent: string }) {
  return (
    <>
      <div style={{ background: accent }}>
        <StatusBar />
        <div className="flex items-center gap-2 px-3 pb-3 pt-1 text-white">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/25">
            <User className="h-3 w-3" />
          </span>
          <span className="flex-1 truncate text-[11px] font-bold">
            BarcodesQR
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col bg-white p-3">
        <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-bg-alt px-3 py-2">
          <p className="text-[11px] leading-relaxed text-ink">
            Text JOIN to get 15% off your first order 🎉
          </p>
        </div>
        <div className="mt-2 flex gap-1.5">
          {["JOIN", "SAVE15"].map((chip) => (
            <span
              key={chip}
              className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ background: alpha(accent, 0.12), color: accent }}
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 rounded-full border border-line px-3 py-1.5">
          <span className="flex-1 text-[10px] text-faint">Text Message</span>
          <span
            className="grid h-5 w-5 place-items-center rounded-full text-white"
            style={{ background: accent }}
          >
            <ArrowUp className="h-3 w-3" />
          </span>
        </div>
      </div>
    </>
  );
}

function SocialScreen({ accent }: { accent: string }) {
  return (
    <>
      <Header accent={accent} />
      <div className="flex-1 bg-white px-3.5 pb-3.5 text-center">
        <div
          role="img"
          className="mx-auto -mt-6 h-14 w-14 rounded-full border-4 border-white bg-cover bg-center shadow-sm"
          style={{ backgroundImage: "url(/previews/portrait.jpg)" }}
        />
        <p className="mt-2 flex items-center justify-center gap-1 text-[12px] font-bold text-ink">
          All my links, one scan
          <BadgeCheck className="h-3 w-3" style={{ color: accent }} />
        </p>
        <div className="mt-3 space-y-2 text-left">
          {["Instagram", "YouTube", "TikTok", "Facebook"].map((name) => (
            <Row key={name} icon={Share2} label={name} accent={accent} />
          ))}
        </div>
      </div>
    </>
  );
}

function WifiScreen({ accent }: { accent: string }) {
  return (
    <>
      <Header accent={accent} title="Wi-Fi" />
      <div className="flex-1 bg-white p-3.5">
        <div className="rounded-2xl border border-line/70 p-3 text-center">
          <span
            className="mx-auto grid h-12 w-12 place-items-center rounded-full"
            style={{ background: alpha(accent, 0.12), color: accent }}
          >
            <Wifi className="h-6 w-6" />
          </span>
          <p className="mt-2.5 text-[12px] font-bold text-ink">
            BarcodesQR_5G
          </p>
          <p className="mt-0.5 flex items-center justify-center gap-1 text-[10px] text-muted">
            <Lock className="h-2.5 w-2.5" />
            WPA2
          </p>
          <div
            className="mt-3 rounded-full py-2 text-[11px] font-bold text-white"
            style={{ background: accent }}
          >
            Connect
          </div>
        </div>
      </div>
    </>
  );
}

function ReviewsScreen({ accent }: { accent: string }) {
  return (
    <>
      <Header accent={accent} />
      <div className="flex-1 bg-white p-3.5 text-center">
        <p className="mt-2 text-[13px] font-bold leading-snug text-ink">
          How was your experience?
        </p>
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < 4 ? "fill-star text-star" : "text-line"}`}
            />
          ))}
        </div>
        <div className="mt-4 space-y-2 rounded-xl border border-line/70 p-2.5">
          <Bar w="100%" />
          <Bar w="80%" />
          <Bar w="60%" />
        </div>
        <div
          className="mt-4 rounded-full py-2 text-[11px] font-bold text-white"
          style={{ background: accent }}
        >
          Submit review
        </div>
      </div>
    </>
  );
}

function PaymentScreen({ accent }: { accent: string }) {
  return (
    <>
      <Header accent={accent} title="Payment" />
      <div className="flex-1 bg-white p-3.5 text-center">
        <span
          className="mx-auto mt-3 grid h-14 w-14 place-items-center rounded-full text-white"
          style={{ background: accent }}
        >
          <Check className="h-7 w-7" />
        </span>
        <p className="mt-3 text-[14px] font-bold text-ink">Thank you!</p>
        <p className="mt-0.5 text-[10px] text-muted">Payment completed</p>
        <div className="mt-4 rounded-xl border border-line/70 p-3">
          <p className="text-[10px] text-muted">Amount</p>
          <p className="mt-0.5 text-xl font-bold text-ink">$35.00</p>
        </div>
      </div>
    </>
  );
}

function EmailScreen({ accent }: { accent: string }) {
  return (
    <>
      <div style={{ background: accent }}>
        <StatusBar />
        <div className="flex items-center gap-2 px-3 pb-3 pt-1 text-white">
          <X className="h-3.5 w-3.5" />
          <span className="flex-1 text-[11px] font-bold">New message</span>
          <Send className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="flex-1 bg-white px-3.5">
        <div className="flex gap-2 border-b border-line py-2.5">
          <span className="text-[10px] text-faint">To:</span>
          <span className="text-[10px] font-medium text-ink">
            hello@barcodesqr.com
          </span>
        </div>
        <div className="flex gap-2 border-b border-line py-2.5">
          <span className="text-[10px] text-faint">Subject:</span>
          <span className="text-[10px] font-medium text-ink">
            Let&rsquo;s work together
          </span>
        </div>
        <div className="space-y-2 py-3">
          <Bar w="100%" />
          <Bar w="92%" />
          <Bar w="70%" />
          <Bar w="45%" />
        </div>
      </div>
    </>
  );
}

function LocationScreen({ accent }: { accent: string }) {
  return (
    <>
      <Header accent={accent} />
      <div className="relative flex-1 bg-bg-alt">
        {/* Stylised map */}
        <svg viewBox="0 0 210 260" className="absolute inset-0 h-full w-full">
          <rect width="210" height="260" fill="#eef1f3" />
          <path d="M0 70h210M0 160h210M60 0v260M150 0v260" stroke="#dfe4e8" strokeWidth="8" />
          <path d="M0 115h210M105 0v260" stroke="#fff" strokeWidth="10" />
          <circle cx="105" cy="115" r="34" fill={alpha(accent, 0.14)} />
        </svg>
        <span
          className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-pop"
          style={{ background: accent }}
        >
          <MapPin className="h-4 w-4" />
        </span>
        <div className="absolute inset-x-3 bottom-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-white px-2.5 py-2 shadow-sm">
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
              style={{ background: alpha(accent, 0.12), color: accent }}
            >
              <Coffee className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold text-ink">
                The Matcha Den
              </p>
              <p className="truncate text-[10px] text-muted">123 Harbor St</p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-faint" />
          </div>
        </div>
      </div>
    </>
  );
}

function PhoneCallScreen({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col" style={{ background: accent }}>
      <StatusBar />
      <div className="flex-1 px-4 pt-8 text-center">
        <div
          role="img"
          className="mx-auto h-16 w-16 rounded-full border-4 border-white/40 bg-cover bg-center"
          style={{ backgroundImage: "url(/avatars/2.png)" }}
        />
        <p className="mt-3 text-[14px] font-bold text-white">Riverside Clinic</p>
        <p className="mt-0.5 text-[10px] text-white/80">calling…</p>

        <div className="mt-6 grid grid-cols-3 gap-2 text-white">
          {[
            [MicOff, "mute"],
            [Grid3x3, "keypad"],
            [Volume2, "speaker"],
          ].map(([Icon, label]) => {
            const I = Icon as React.ElementType;
            return (
              <div key={label as string} className="flex flex-col items-center gap-1">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20">
                  <I className="h-4 w-4" />
                </span>
                <span className="text-[9px] opacity-90">{label as string}</span>
              </div>
            );
          })}
        </div>

        <span className="mx-auto mt-6 grid h-12 w-12 place-items-center rounded-full bg-danger text-white">
          <PhoneOff className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function EventScreen({ accent }: { accent: string }) {
  return (
    <>
      <Header accent={accent} title="You’re invited" />
      <div className="flex-1 bg-white p-3.5">
        <div className="flex items-start gap-3">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-center leading-none"
            style={{ background: alpha(accent, 0.12), color: accent }}
          >
            <span>
              <span className="block text-[9px] font-bold uppercase">Jun</span>
              <span className="block text-base font-bold">20</span>
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-ink">Summerfest</p>
            <p className="text-[10px] text-muted">By Studio North</p>
          </div>
        </div>

        <div className="mt-3 space-y-1.5 text-[10px] text-body">
          <p className="font-medium">Sat · 7:00 PM</p>
          <p className="flex items-center gap-1 text-muted">
            <MapPin className="h-3 w-3" />
            Rooftop Nine
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            {["1", "3", "4"].map((n) => (
              <span
                key={n}
                role="img"
                className="h-6 w-6 rounded-full border-2 border-white bg-cover bg-center"
                style={{ backgroundImage: `url(/avatars/${n}.png)` }}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted">18 going</span>
        </div>

        <div
          className="mt-4 flex items-center justify-center gap-1.5 rounded-full py-2 text-[11px] font-bold text-white"
          style={{ background: accent }}
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          Add to calendar
        </div>
      </div>
    </>
  );
}

function MultiLinkScreen({ accent }: { accent: string }) {
  const links = [
    [UtensilsCrossed, "Menu"],
    [CalendarCheck, "Reserve"],
    [PhoneIcon, "Call us"],
    [Navigation, "Directions"],
  ] as const;
  return (
    <>
      <div className="relative h-28">
        <div
          role="img"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/previews/food.jpg)" }}
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative">
          <StatusBar />
        </div>
      </div>
      <div className="flex-1 bg-white px-3.5 pb-3.5 text-center">
        <p className="mt-3 text-[13px] font-bold text-ink">Marigold Kitchen</p>
        <p className="text-[10px] text-muted">Order · Book · Find us</p>
        <div className="mt-3 space-y-2 text-left">
          {links.map(([Icon, label]) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-xl border border-line/70 px-2.5 py-2"
            >
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
                style={{ background: alpha(accent, 0.12), color: accent }}
              >
                <Icon className="h-3 w-3" />
              </span>
              <span className="flex-1 text-[11px] font-medium text-ink">
                {label}
              </span>
              <ArrowUpRight className="h-3 w-3 text-faint" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function MenuScreen({ accent }: { accent: string }) {
  const dishes = [
    ["Miso ramen", "$14"],
    ["Gyoza (6 pc)", "$8"],
    ["Matcha tiramisu", "$9"],
  ];
  return (
    <>
      <div className="relative h-24">
        <div
          role="img"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/previews/food.jpg)" }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative">
          <StatusBar />
        </div>
      </div>
      <div className="flex-1 bg-white p-3.5">
        <p className="text-[13px] font-bold text-ink">Today&rsquo;s menu</p>
        <p className="text-[10px] text-muted">Updated 2 min ago</p>
        <div className="mt-3 space-y-2.5">
          {dishes.map(([name, price]) => (
            <div
              key={name}
              className="flex items-center justify-between border-b border-line/60 pb-2 last:border-0"
            >
              <span className="flex items-center gap-2 text-[11px] text-body">
                <span
                  className="grid h-6 w-6 place-items-center rounded-full"
                  style={{ background: alpha(accent, 0.12), color: accent }}
                >
                  <UtensilsCrossed className="h-3 w-3" />
                </span>
                {name}
              </span>
              <span className="text-[11px] font-bold text-ink">{price}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function TextScreen({ accent }: { accent: string }) {
  return (
    <>
      <Header accent={accent} title="A note for you" />
      <div className="flex-1 bg-white p-3.5">
        <Quote className="h-5 w-5" style={{ color: accent }} />
        <p className="mt-2 text-[11px] leading-relaxed text-body">
          Welcome! The Wi-Fi code is
        </p>
        <p className="mt-1.5 text-2xl font-bold tracking-widest text-ink">
          4482
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-body">
          Coffee is in the cupboard. Enjoy your stay.
        </p>
        <p className="mt-3 text-[10px] italic text-muted">— Sam, your host</p>
        <div
          className="mt-4 flex items-center justify-center gap-1.5 rounded-full py-2 text-[11px] font-bold"
          style={{ background: alpha(accent, 0.12), color: accent }}
        >
          <Copy className="h-3.5 w-3.5" />
          Copy note
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------ dispatcher */

/** Renders the screen body for a given QR type inside the phone frame. */
export function PhoneScreen({ type, accent }: { type: string; accent: string }) {
  switch (type) {
    case "vcard":
      return <VCardScreen accent={accent} />;
    case "pdf":
      return <PdfScreen accent={accent} />;
    case "image":
      return <ImageScreen accent={accent} />;
    case "video":
      return <VideoScreen accent={accent} />;
    case "applink":
      return <AppLinkScreen accent={accent} />;
    case "whatsapp":
      return (
        <ChatScreen
          accent={accent}
          title="+1 555 0134"
          message="Hi! Saw your QR platform — I'd love to set up digital menus for my restaurant."
        />
      );
    case "sms":
      return <SmsScreen accent={accent} />;
    case "social":
      return <SocialScreen accent={accent} />;
    case "wifi":
      return <WifiScreen accent={accent} />;
    case "menu":
      return <MenuScreen accent={accent} />;
    case "email":
      return <EmailScreen accent={accent} />;
    case "phone":
      return <PhoneCallScreen accent={accent} />;
    case "location":
      return <LocationScreen accent={accent} />;
    case "event":
      return <EventScreen accent={accent} />;
    case "reviews":
      return <ReviewsScreen accent={accent} />;
    case "multilink":
      return <MultiLinkScreen accent={accent} />;
    case "payment":
      return <PaymentScreen accent={accent} />;
    case "text":
      return <TextScreen accent={accent} />;
    case "website":
    default:
      return <WebsiteScreen accent={accent} />;
  }
}
