import { Search } from "lucide-react";
import { SortMenu } from "./SortMenu";
import type { DashboardSort } from "@/app/dashboard/page";

/**
 * Title, sort control and search.
 *
 * The mockup also puts a "Create QR code" button at the right-hand end. The PM
 * cut it: the ready banner underneath already offers "Create Another QR", and
 * the sidebar has "Create QR", so a third one crowded the row.
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
      </div>
    </div>
  );
}
