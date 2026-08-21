import Link from "next/link";
import { logoutUser } from "@/app/actions/auth";
import {
  QrCode,
  Layers,
  LayoutGrid,
  Copy,
  Activity,
  CalendarClock,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

type NavItem = { icon: LucideIcon; label: string; href: string };

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: "Create",
    items: [
      { icon: QrCode, label: "Create QR", href: "/create" },
      { icon: Layers, label: "Create Bulk", href: "/dashboard" },
    ],
  },
  {
    title: "Manage",
    items: [
      { icon: LayoutGrid, label: "My QR Codes", href: "/dashboard" },
      { icon: Copy, label: "QR Templates", href: "/dashboard" },
    ],
  },
  {
    title: "Analyze",
    items: [
      { icon: Activity, label: "Statistics", href: "/dashboard" },
      { icon: CalendarClock, label: "Scheduled Reports", href: "/dashboard" },
    ],
  },
];

export function Sidebar({
  current = "My QR Codes",
  user,
}: {
  current?: string;
  user: { name?: string | null; email?: string | null; plan?: string };
}) {
  const display = user.name || user.email || "Account";
  const initial = display.charAt(0).toUpperCase();
  const plan = user.plan ?? "Free";

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-line bg-white lg:flex">
      <div className="px-6 py-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <Logo />
          <span className="text-lg font-bold tracking-tight text-ink">
            Barcodes<span className="text-primary">QR</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4">
        {groups.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-faint">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map(({ icon: Icon, label, href }) => {
                const active = label === current;
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-[#e9f0fb] text-primary"
                          : "text-body hover:bg-bg-alt/70"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-4">
        <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-bg-alt/70">
          <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
            {initial}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink">
              {display}
            </span>
            <span className="block truncate text-xs capitalize text-muted">
              {plan} Plan
            </span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-faint" />
        </div>

        <form action={logoutUser} className="mt-1">
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-muted transition-colors hover:bg-bg-alt/70 hover:text-ink"
          >
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
