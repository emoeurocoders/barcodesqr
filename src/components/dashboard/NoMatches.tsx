import Link from "next/link";
import { Search } from "lucide-react";

/**
 * A search with no results. Unmocked: the designer drew only the full table,
 * so this borrows the empty state's card. See LAUNCH.md.
 */
export function NoMatches({ q }: { q: string }) {
  return (
    <div className="px-6 pb-10 pt-4">
      <div className="rounded-2xl border border-line bg-white px-6 py-16 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e9f0fb] text-primary">
          <Search className="h-7 w-7" />
        </span>
        <h2 className="mt-6 text-lg font-bold text-ink">No matching QR codes</h2>
        <p className="mx-auto mt-2 max-w-sm break-words text-sm leading-relaxed text-muted">
          Nothing is named &ldquo;{q}&rdquo;.
        </p>
        <Link href="/dashboard" className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">
          Show all QR codes
        </Link>
      </div>
    </div>
  );
}
