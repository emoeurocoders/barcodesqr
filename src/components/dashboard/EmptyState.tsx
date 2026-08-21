import Link from "next/link";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Shown until the account has saved codes to list. */
export function EmptyState() {
  return (
    <div className="px-6 pb-10 pt-4">
      <div className="rounded-2xl border border-line bg-white px-6 py-16 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e9f0fb] text-primary">
          <QrCode className="h-7 w-7" />
        </span>

        <h2 className="mt-6 text-lg font-bold text-ink">No QR codes yet</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Codes you create will show up here, with their scans, status and
          settings.
        </p>

        <Link className="mt-7 inline-block" href="/create">
          <Button size="lg">
            <QrCode className="h-4 w-4" />
            Create your first QR code
          </Button>
        </Link>
      </div>
    </div>
  );
}
