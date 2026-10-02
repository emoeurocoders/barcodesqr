/**
 * mainB.html's #mainShare — step 3 as a spread, mirrored from Customize: the
 * demo panel (format tiles and a scans card) on the left, copy on the right.
 * Below 992px their `column-reverse` puts the copy back on top.
 *
 * Desktop only, for the same reason as Customize.tsx. Their 576/480 rules are
 * unreachable here and are not reproduced.
 *
 * "1,248" and "+12%" are the mockup's illustrative figures, not live data —
 * this is a marketing demo of the analytics, not the analytics.
 */

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <span className="mr-[6px] flex h-[17px] w-[17px] shrink-0">{children}</span>
  );
}

const itemClass =
  "flex items-center whitespace-nowrap text-[13px] font-semibold text-spread-item not-first:ml-[22px]";
const tileClass =
  "box-border flex flex-col items-center rounded-[12px] border border-share-tile-line bg-white px-[10px] py-[18px] text-center";
const tileIconClass =
  "mb-[10px] flex h-[40px] w-[40px] items-center justify-center rounded-[9px]";

export function Share() {
  return (
    <section className="hidden bg-white md:block">
      <div className="container-wide-home pb-[76px] pt-0 text-[10px] leading-[normal]">
        <div className="flex items-center to-992:flex-col-reverse to-992:items-start">
          <div className="box-border min-w-0 flex-[0_1_612px] rounded-[22px] border border-spread-panel-line bg-spread-panel p-[30px] shadow-spread-panel to-992:mt-[3.5em] to-992:w-full to-992:max-w-full to-992:flex-none">
            <h5 className="text-[17px] font-bold text-spread-ink">Download Your QR Code</h5>
            <div className="mt-[22px] grid grid-cols-3 gap-[10px]">
              <div className={tileClass}>
                <span className={`${tileIconClass} bg-share-png-tile`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" fill="none" aria-hidden="true" className="h-[23px] w-[23px]"><path d="M18.2083 2.875H4.79167C3.73312 2.875 2.875 3.73312 2.875 4.79167V18.2083C2.875 19.2669 3.73312 20.125 4.79167 20.125H18.2083C19.2669 20.125 20.125 19.2669 20.125 18.2083V4.79167C20.125 3.73312 19.2669 2.875 18.2083 2.875Z" stroke="#9056E8" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.14583 9.58333C8.93974 9.58333 9.58333 8.93974 9.58333 8.14583C9.58333 7.35192 8.93974 6.70833 8.14583 6.70833C7.35192 6.70833 6.70833 7.35192 6.70833 8.14583C6.70833 8.93974 7.35192 9.58333 8.14583 9.58333Z" stroke="#9056E8" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.875 16.2917L7.66667 11.5L11.5 15.3333L14.375 12.4583L20.125 18.2083" stroke="#9056E8" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <p className="p-0 text-[14px] font-semibold text-spread-ink">PNG</p>
                <p className="mt-[4px] p-0 text-[12px] leading-[1.4em] text-share-tile-copy">
                  Best for web &amp;
                  <br /> digital
                </p>
              </div>
              <div className={tileClass}>
                <span className={`${tileIconClass} bg-share-svg-tile`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" fill="none" aria-hidden="true" className="h-[23px] w-[23px]"><path d="M7.66667 7.66667L3.83333 11.5L7.66667 15.3333M15.3333 7.66667L19.1667 11.5L15.3333 15.3333M13.4167 3.83333L9.58333 19.1667" stroke="#16AC9D" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <p className="p-0 text-[14px] font-semibold text-spread-ink">SVG</p>
                <p className="mt-[4px] p-0 text-[12px] leading-[1.4em] text-share-tile-copy">
                  Best for print &amp;
                  <br /> scaling
                </p>
              </div>
              <div className={tileClass}>
                <span className={`${tileIconClass} bg-share-jpeg-tile`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" fill="none" aria-hidden="true" className="h-[23px] w-[23px]"><path d="M18.2083 2.875H4.79167C3.73312 2.875 2.875 3.73312 2.875 4.79167V18.2083C2.875 19.2669 3.73312 20.125 4.79167 20.125H18.2083C19.2669 20.125 20.125 19.2669 20.125 18.2083V4.79167C20.125 3.73312 19.2669 2.875 18.2083 2.875Z" stroke="#DC8A14" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.14583 9.58333C8.93974 9.58333 9.58333 8.93974 9.58333 8.14583C9.58333 7.35192 8.93974 6.70833 8.14583 6.70833C7.35192 6.70833 6.70833 7.35192 6.70833 8.14583C6.70833 8.93974 7.35192 9.58333 8.14583 9.58333Z" stroke="#DC8A14" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.875 16.2917L7.66667 11.5L11.5 15.3333L14.375 12.4583L20.125 18.2083" stroke="#DC8A14" strokeWidth="1.725" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <p className="p-0 text-[14px] font-semibold text-spread-ink">JPEG</p>
                <p className="mt-[4px] p-0 text-[12px] leading-[1.4em] text-share-tile-copy">
                  Easy to share
                </p>
              </div>
            </div>
            <p className="mt-[16px] p-0 text-center text-[12px] text-share-note">
              Choose the best format for print or digital use.
            </p>

            <div className="mt-[20px] flex items-center rounded-[12px] border border-share-stat-line bg-white px-[16px] py-[14px]">
              <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[8px] bg-spread-num-tile">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="none" aria-hidden="true" className="h-[22px] w-[22px]"><path d="M2.75 18.3333H19.25" stroke="#2563EB" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.5 15.5833V8.25" stroke="#2563EB" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 15.5833V3.66667" stroke="#2563EB" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.5 15.5833V10.0833" stroke="#2563EB" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.5 7.33333C6.00626 7.33333 6.41667 6.92293 6.41667 6.41667C6.41667 5.91041 6.00626 5.5 5.5 5.5C4.99374 5.5 4.58333 5.91041 4.58333 6.41667C4.58333 6.92293 4.99374 7.33333 5.5 7.33333Z" stroke="#2563EB" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.5 9.16667C17.0063 9.16667 17.4167 8.75626 17.4167 8.25C17.4167 7.74374 17.0063 7.33333 16.5 7.33333C15.9937 7.33333 15.5833 7.74374 15.5833 8.25C15.5833 8.75626 15.9937 9.16667 16.5 9.16667Z" stroke="#2563EB" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <div className="ml-[12px] flex-none">
                <p className="whitespace-nowrap p-0 text-[10px] font-semibold text-spread-copy">
                  Tracks scans over time
                </p>
                <p className="mt-[2px] p-0 text-[23px] font-bold leading-[1.15em] text-spread-ink">
                  1,248
                </p>
                <p className="mt-[1px] p-0 text-[11px] text-share-stat-label">Total scans</p>
              </div>
              <div className="mx-[12px] flex min-w-0 flex-auto justify-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/share-scans-chart.svg" alt="Scan activity" className="w-[207px] max-w-full" />
              </div>
              <span className="inline-flex shrink-0 items-center rounded-[7px] bg-share-up-tile p-[5px] text-[11px] text-share-up">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-[2px] h-[1em] w-[1em]"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                +12%
              </span>
            </div>
          </div>

          <div className="ml-[70px] flex-auto to-992:ml-0">
            <span className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-spread-num-tile text-[23px] font-extrabold text-primary">
              3
            </span>
            <h4 className="mt-[0.44em] text-[50px] font-black leading-[1.09em] tracking-[-0.055em] text-spread-ink to-768:text-[40px]">
              Download &amp; share
            </h4>
            <p className="mt-[1.05em] max-w-[27em] p-0 text-[17px] leading-[1.6em] text-spread-copy to-992:max-w-full">
              Export print-ready PNG, JPEG or SVG, then track scans over time.
            </p>
            <ul className="mt-[27px] flex items-center">
              <li className={itemClass}>
                <Bullet>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" fill="none" aria-hidden="true" className="h-full w-full"><path d="M8.5 14.875C12.0208 14.875 14.875 12.0208 14.875 8.5C14.875 4.97918 12.0208 2.125 8.5 2.125C4.97918 2.125 2.125 4.97918 2.125 8.5C2.125 12.0208 4.97918 14.875 8.5 14.875Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.125 8.5H14.875M8.5 2.125C9.87936 3.96415 10.625 6.20107 10.625 8.5C10.625 10.7989 9.87936 13.0359 8.5 14.875C7.12064 13.0359 6.375 10.7989 6.375 8.5C6.375 6.20107 7.12064 3.96415 8.5 2.125Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Bullet>
                Web
              </li>
              <li className={itemClass}>
                <Bullet>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" fill="none" aria-hidden="true" className="h-full w-full"><path d="M4.25 6.375V2.125H12.75V6.375" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.4583 6.375H3.54167C2.75926 6.375 2.125 7.00926 2.125 7.79167V11.3333C2.125 12.1157 2.75926 12.75 3.54167 12.75H13.4583C14.2407 12.75 14.875 12.1157 14.875 11.3333V7.79167C14.875 7.00926 14.2407 6.375 13.4583 6.375Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.25 11.3333H12.75V14.875H4.25V11.3333Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.0417 8.5H12.75" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Bullet>
                Print
              </li>
              <li className={itemClass}>
                <Bullet>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" fill="none" aria-hidden="true" className="h-full w-full"><path d="M14.1667 2.83333H2.83333C2.44213 2.83333 2.125 3.15047 2.125 3.54167V11.3333C2.125 11.7245 2.44213 12.0417 2.83333 12.0417H14.1667C14.5579 12.0417 14.875 11.7245 14.875 11.3333V3.54167C14.875 3.15047 14.5579 2.83333 14.1667 2.83333Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.66667 14.875H11.3333M8.5 12.0417V14.875M4.95833 6.375H12.0417M4.95833 8.5H9.20833" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Bullet>
                Signage
              </li>
              <li className={itemClass}>
                <Bullet>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" fill="none" aria-hidden="true" className="h-full w-full"><path d="M8.5 15.5833L2.125 12.0417V4.95833L8.5 1.41667L14.875 4.95833V12.0417L8.5 15.5833ZM14.875 4.95833L8.5 8.5M8.5 8.5L2.125 4.95833M8.5 8.5V15.5833M4.95833 2.83333L11.3333 6.375" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Bullet>
                Packaging
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
