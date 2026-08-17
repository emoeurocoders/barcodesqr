import { Palette, RefreshCw, ChartColumn, Lock, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const features: Feature[] = [
  {
    icon: Palette,
    title: "Full customization",
    body: "Style every code to match your brand — pick custom colors and gradients, dot and corner shapes, a framed call-to-action, and drop your logo in the center. Ideal for event invites, social posts, personal links, and small-business flyers.",
  },
  {
    icon: RefreshCw,
    title: "Dynamic & editable",
    body: "Print once and change it forever. Update where a dynamic code points whenever you want — swap a menu, repoint a social link, or refresh a live event page without ever generating a new code.",
  },
  {
    icon: ChartColumn,
    title: "Advanced analytics",
    body: "Know exactly how each code performs. Track total and unique scans over time, plus location, device, and OS — so you can see which poster, channel, or campaign is actually landing with people.",
  },
  {
    icon: Lock,
    title: "Password protection",
    body: "Lock a code behind a password so only the right people can open it. Perfect for gated promotions, internal documents, and private menus you'd rather keep out of public search results.",
  },
  {
    icon: Download,
    title: "High-quality downloads",
    body: "Export crisp, print-ready files at any size — PNG and JPG for screens, vector SVG for large-format print. Your code stays sharp and scan-ready on a phone, a flyer, or a billboard.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-bg-alt">
      <div className="container-page py-16 md:py-20">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          More than just a QR code generator
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Everything you need to launch, manage and measure your QR codes.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-line/60 bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
            >
              <Icon className="h-8 w-8 text-brand" />
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
