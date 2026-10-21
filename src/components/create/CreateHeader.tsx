import Link from "next/link";

/**
 * The creator's own header — create_desktop.html's `#mainHdr.hdrCreate`
 * (2026-10-21): the logo, the three steps centred over the page, and "Back
 * to Home" where the site header has its account buttons.
 *
 * Pinned like the site header (`position: fixed`), with the same spacer and
 * the same logo and gutter steps — those are the shared `#mainHdr` rules,
 * see layout/Header.tsx. The steps are absolutely centred and disappear at
 * 1150 and below, where they would run into the logo.
 */

const steps = ["Choose QR Type", "Add Content", "Customize & Download"];

export function CreateHeader({ current = 1 }: { current?: number }) {
  return (
    <>
      <div aria-hidden="true" className="h-[71px] min-[1300px]:h-[83px]" />
      <header className="fixed top-0 left-0 z-40 w-full border-b border-line bg-white py-px">
        <div className="relative flex items-center justify-between [@media(min-width:768px)_and_(max-width:1024px)]:mx-5 [@media(min-width:1025px)_and_(max-width:1299px)]:mx-5 min-[1025px]:px-5">
          <h1>
            <Link
              href="/"
              className="block h-[68px] w-[153px] overflow-hidden bg-[url(/brand/logo.svg)] bg-contain bg-left bg-no-repeat -indent-[8000px] text-[20px] font-bold whitespace-nowrap min-[1300px]:h-[80px]"
            >
              BarcodesQR
            </Link>
          </h1>

          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center [@media(max-width:1150px)]:hidden">
            {steps.map((label, i) => {
              const on = i + 1 === current;
              return (
                <div
                  key={label}
                  aria-current={on ? "step" : undefined}
                  className="flex items-center after:mx-[14px] after:h-[2px] after:w-[38px] after:rounded-[2px] after:bg-cd-step-rule after:content-[''] last:after:hidden"
                >
                  <div
                    className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-[13px] font-bold ${
                      on ? "bg-primary text-white" : "bg-cd-step text-muted"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <h5
                    className={`ml-2.5 text-[15px] leading-[normal] whitespace-nowrap ${
                      on ? "font-bold text-primary" : "font-semibold text-faint"
                    }`}
                  >
                    {label}
                  </h5>
                </div>
              );
            })}
          </div>

          <Link
            href="/"
            className="my-2.5 flex items-center gap-2 rounded-[12px] border border-cd-btn-line bg-white px-4 py-2.5 text-[14.5px] leading-[normal] font-semibold text-ink"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 flex-none"
            >
              <path d="M19 12H5"></path>
              <path d="m12 19-7-7 7-7"></path>
            </svg>
            Back to Home
          </Link>
        </div>
      </header>
    </>
  );
}
