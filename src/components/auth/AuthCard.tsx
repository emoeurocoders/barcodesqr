import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 items-center justify-center bg-bg px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Link href="/" aria-label="BarcodesQR home">
            <span className="inline-flex items-center gap-2">
              <Logo />
              <span className="text-lg font-bold tracking-tight text-ink">
                BarcodesQR
              </span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-line bg-white p-7 shadow-card">
          <h1 className="text-center text-2xl font-bold">{title}</h1>
          <p className="mb-6 mt-1 text-center text-sm text-muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </main>
  );
}
