import Link from "next/link";
import { Search } from "lucide-react";
import { SortMenu } from "./SortMenu";
import type { DashboardSort } from "@/app/dashboard/page";

/**
 * Title, sort control, search and "Create QR code".
 *
 * The button is the mockup's (`.btn.genBtn7.btnC3`). The PM had cut it, as
 * the ready banner offered "Create Another QR" — but that banner is gone
 * once you search or sort, which left no way to create from this page on a
 * phone, where the sidebar is hidden (Tami, 2026-10-22). Back as drawn.
 */
export function Toolbar({
  title = "My QR Codes",
  q = "",
  sort = "newest",
}: {
  title?: string;
  q?: string;
  sort?: DashboardSort;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-6 py-5">
      <h1 className="flex-1 text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        <SortMenu sort={sort} q={q} />

        <form
          role="search"
          className="relative w-full sm:w-[285px]"
          action="/dashboard"
        >
          {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}
          <label htmlFor="qr-search" className="sr-only">
            Search QR codes
          </label>
          <input
            id="qr-search"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search QR codes..."
            className="w-full rounded-lg border border-line bg-white py-2.5 pe-10 ps-4 text-sm text-ink placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute end-1 top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:text-ink"
          >
            <Search className="h-[17px] w-[17px]" />
          </button>
        </form>

        <Link
          href="/create"
          className="inline-flex h-[41px] items-center gap-[8.25px] whitespace-nowrap rounded-btn bg-primary px-[27px] text-[15px] leading-[15px] font-medium text-white transition-colors hover:bg-primary-press"
        >
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[17px] w-[17px]">
            <path d="M3.54167 8.5H13.4583" stroke="currentColor" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.5 3.54167V13.4583" stroke="currentColor" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Create QR code
        </Link>
      </div>
    </div>
  );
}
