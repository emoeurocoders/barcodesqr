import {
  Globe,
  Briefcase,
  Contact,
  Link as LinkIcon,
  Share2,
  Smartphone,
  FileText,
  Image as ImageIcon,
  Video,
  Wifi,
  MessageCircle,
  Utensils,
  UtensilsCrossed,
  MapPin,
  CalendarDays,
  Mail,
  MessageSquare,
  Phone,
  Type,
  CreditCard,
  Music,
  TicketPercent,
  Star,
  Building2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ReviewIcon } from "@/components/ui/ReviewIcon";

export type QrTypeIcon = LucideIcon | typeof ReviewIcon;

export type CreateQrType = {
  value: string;
  label: string;
  desc: string;
  color: string;
  icon: QrTypeIcon;
  tag?: string;
  /**
   * Step 2 introduces a few formats differently from the step-1 list — the
   * list sells the format, the form describes what you are about to fill in,
   * and three formats are named differently once you are inside them. Only
   * set where the creator's wording actually diverges from the mockup's.
   */
  stepLabel?: string;
  stepDesc?: string;
  stepIcon?: QrTypeIcon;
};

/**
 * The formats shown as full rows, each with a one-line description.
 *
 * Google Review and Google Maps carry Google's trademarked marks in the
 * designer's file. We keep the names — which describe where the code points
 * — but swap the artwork for neutral icons, since we have no licence to
 * display the logos themselves.
 */
export const primaryTypes: CreateQrType[] = [
  {
    value: "website",
    label: "Website",
    desc: "Open a website or landing page",
    color: "#2563EB",
    icon: Globe,
    tag: "MOST USED",
  },
  {
    value: "vcard",
    label: "vCard",
    desc: "Share a digital business card",
    color: "#2563EB",
    icon: Contact,
  },
  {
    value: "multilink",
    label: "Multi-Link",
    desc: "Share several links at once",
    color: "#7C3AED",
    icon: LinkIcon,
    stepDesc: "Promote your business, service or profile",
    stepIcon: Briefcase,
  },
  {
    value: "social",
    label: "Social Media",
    desc: "Share all your social profiles",
    color: "#EC4899",
    icon: Share2,
    stepDesc: "Share your profiles and grow your audience",
  },
  {
    value: "applink",
    label: "App Link",
    desc: "Send users to the right app store",
    color: "#10B981",
    icon: Smartphone,
  },
  {
    value: "pdf",
    label: "PDF",
    desc: "Open or download a PDF file",
    color: "#DC2626",
    icon: FileText,
    stepDesc: "Open or download a PDF document",
  },
  {
    value: "image",
    label: "Image",
    desc: "Display an image or photo",
    color: "#16A34A",
    icon: ImageIcon,
  },
  {
    value: "video",
    label: "Video",
    desc: "Play a video with one scan",
    color: "#EF4444",
    icon: Video,
  },
  {
    value: "wifi",
    label: "WiFi",
    desc: "Connect to a WiFi network",
    color: "#0EA5E9",
    icon: Wifi,
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    desc: "Start a WhatsApp chat",
    color: "#25D366",
    icon: MessageCircle,
    stepDesc: "Start a WhatsApp chat instantly",
  },
  {
    value: "menu",
    label: "Menu",
    desc: "Share your digital menu",
    color: "#F97316",
    icon: Utensils,
    stepDesc: "Show a digital restaurant menu",
    stepIcon: UtensilsCrossed,
  },
  {
    value: "review",
    label: "Google Review",
    desc: "Get more reviews on Google",
    color: "#6366F1",
    icon: ReviewIcon,
  },
  {
    value: "location",
    label: "Google Maps",
    desc: "Share a location",
    color: "#EA4335",
    icon: MapPin,
    stepLabel: "Location",
    stepDesc: "Open a location on the map",
  },
  {
    value: "event",
    label: "Event",
    desc: "Promote your event",
    color: "#3B82F6",
    icon: CalendarDays,
    stepDesc: "Add an event to the calendar",
  },
  {
    value: "email",
    label: "Email",
    desc: "Send an email message",
    color: "#8B5CF6",
    icon: Mail,
    stepDesc: "Open a pre-filled email",
  },
];

/** Formats shown as compact tiles under the "More QR Types" link. */
export const secondaryTypes: CreateQrType[] = [
  {
    value: "sms",
    label: "SMS",
    desc: "",
    color: "#2563EB",
    icon: MessageSquare,
    stepDesc: "Send a text message instantly",
  },
  {
    value: "phone",
    label: "Phone",
    desc: "",
    color: "#16A34A",
    icon: Phone,
    stepDesc: "Call a phone number",
  },
  {
    value: "text",
    label: "Plain Text",
    desc: "",
    color: "#6B7280",
    icon: Type,
    stepLabel: "Text",
    stepDesc: "Show a plain text message",
  },
  {
    value: "payment",
    label: "Payment",
    desc: "",
    color: "#7C3AED",
    icon: CreditCard,
    stepDesc: "Accept payments with a scan",
  },
  {
    value: "mp3",
    label: "Audio",
    desc: "",
    color: "#F59E0B",
    icon: Music,
    stepDesc: "Play an audio clip",
  },
  {
    value: "coupon",
    label: "Coupon",
    desc: "",
    color: "#EF4444",
    icon: TicketPercent,
    stepDesc: "Share a redeemable coupon",
  },
  {
    value: "feedback",
    label: "Feedback",
    desc: "",
    color: "#F59E0B",
    icon: Star,
    stepDesc: "Collect ratings and feedback",
  },
  {
    value: "business",
    label: "Business",
    desc: "",
    color: "#2563EB",
    icon: Building2,
    stepLabel: "Business Page",
    stepDesc: "A mini landing page for your business",
  },
];

/** Both groups, for looking a type up by value. */
export const allTypes: CreateQrType[] = [...primaryTypes, ...secondaryTypes];
