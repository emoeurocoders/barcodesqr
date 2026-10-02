/**
 * mainB.html's #mainCustomize — step 2 drawn out as a spread under the three
 * step cards: copy on the left, a demo panel (standard → branded QR, colour
 * dots, two mock buttons) on the right.
 *
 * Desktop only. main_mobile.html has no such section; its Steps block carries
 * the same demo as a card, which is what Steps.tsx renders below `md:`.
 *
 * Their media queries at 576 and 480 are not reproduced: below 768 this whole
 * section is hidden, so those rules could never apply.
 */

const swatches = ["#2563eb", "#19b9aa", "#a855f7", "#f0526d", "#f5a524", "#111827"];

export function Customize() {
  return (
    <section className="hidden bg-white md:block">
      <div className="container-wide-home pb-[76px] pt-[10px] text-[10px] leading-[normal]">
        <div className="flex items-center to-992:flex-col to-992:items-start">
          <div className="flex-auto pr-[70px] to-992:pr-0">
            <span className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-spread-num-tile text-[23px] font-extrabold text-primary">
              2
            </span>
            {/* Their <h4>; the double space in their source collapses. */}
            <h4 className="mt-[0.44em] text-[50px] font-black leading-[1.09em] tracking-[-0.055em] text-spread-ink to-768:text-[40px]">
              Customize your QR&nbsp;code
            </h4>
            <p className="mt-[1.05em] max-w-[27em] p-0 text-[17px] leading-[1.6em] text-spread-copy to-992:max-w-full">
              Add your colors, shapes, a frame and your logo to match your brand.
            </p>
            <ul className="mt-[27px] flex items-center">
              <li className="flex items-center whitespace-nowrap text-[13px] font-semibold text-spread-item not-first:ml-[22px]">
                <span className="mr-[6px] flex h-[17px] w-[17px] shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" fill="none" aria-hidden="true" className="h-full w-full"><path d="M8.5 2.125C7.66282 2.125 6.83384 2.28989 6.06039 2.61027C5.28694 2.93064 4.58417 3.40022 3.99219 3.99219C3.40022 4.58417 2.93064 5.28694 2.61027 6.06039C2.28989 6.83384 2.125 7.66282 2.125 8.5C2.125 9.33718 2.28989 10.1662 2.61027 10.9396C2.93064 11.7131 3.40022 12.4158 3.99219 13.0078C4.58417 13.5998 5.28694 14.0694 6.06039 14.3897C6.83384 14.7101 7.66282 14.875 8.5 14.875H9.20833C9.58406 14.875 9.94439 14.7257 10.2101 14.4601C10.4757 14.1944 10.625 13.8341 10.625 13.4583C10.6211 13.1189 10.4954 12.7921 10.2708 12.5375C10.1088 12.3222 10.0116 12.0652 9.99047 11.7966C9.96937 11.528 10.0253 11.259 10.1517 11.021C10.2781 10.7831 10.4697 10.5861 10.7041 10.4533C10.9385 10.3204 11.2059 10.2571 11.475 10.2708H12.75C13.3136 10.2708 13.8541 10.047 14.2526 9.64844C14.6511 9.24992 14.875 8.70942 14.875 8.14583C14.7844 6.51721 14.0729 4.98527 12.8871 3.86528C11.7012 2.7453 10.1311 2.12248 8.5 2.125Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.95833 8.5C5.34953 8.5 5.66667 8.18287 5.66667 7.79167C5.66667 7.40047 5.34953 7.08333 4.95833 7.08333C4.56713 7.08333 4.25 7.40047 4.25 7.79167C4.25 8.18287 4.56713 8.5 4.95833 8.5Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.375 5.66667C6.7662 5.66667 7.08333 5.34953 7.08333 4.95833C7.08333 4.56713 6.7662 4.25 6.375 4.25C5.9838 4.25 5.66667 4.56713 5.66667 4.95833C5.66667 5.34953 5.9838 5.66667 6.375 5.66667Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.91667 5.66667C10.3079 5.66667 10.625 5.34953 10.625 4.95833C10.625 4.56713 10.3079 4.25 9.91667 4.25C9.52546 4.25 9.20833 4.56713 9.20833 4.95833C9.20833 5.34953 9.52546 5.66667 9.91667 5.66667Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.0417 7.79167C12.4329 7.79167 12.75 7.47453 12.75 7.08333C12.75 6.69213 12.4329 6.375 12.0417 6.375C11.6505 6.375 11.3333 6.69213 11.3333 7.08333C11.3333 7.47453 11.6505 7.79167 12.0417 7.79167Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                Brand colors
              </li>
              <li className="flex items-center whitespace-nowrap text-[13px] font-semibold text-spread-item not-first:ml-[22px]">
                <span className="mr-[6px] flex h-[17px] w-[17px] shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" fill="none" aria-hidden="true" className="h-full w-full"><path d="M13.4583 2.125H3.54167C2.75926 2.125 2.125 2.75926 2.125 3.54167V13.4583C2.125 14.2407 2.75926 14.875 3.54167 14.875H13.4583C14.2407 14.875 14.875 14.2407 14.875 13.4583V3.54167C14.875 2.75926 14.2407 2.125 13.4583 2.125Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.02083 7.08333C6.60764 7.08333 7.08333 6.60764 7.08333 6.02083C7.08333 5.43403 6.60764 4.95833 6.02083 4.95833C5.43403 4.95833 4.95833 5.43403 4.95833 6.02083C4.95833 6.60764 5.43403 7.08333 6.02083 7.08333Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.125 12.0417L5.66667 8.5L8.5 11.3333L10.625 9.20833L14.875 13.4583" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                Add your logo
              </li>
              <li className="flex items-center whitespace-nowrap text-[13px] font-semibold text-spread-item not-first:ml-[22px]">
                <span className="mr-[6px] flex h-[17px] w-[17px] shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" fill="none" aria-hidden="true" className="h-full w-full"><path d="M8.5 1.41667L9.70417 5.87917L14.1667 7.08333L9.70417 8.2875L8.5 12.75L7.29583 8.2875L2.83333 7.08333L7.29583 5.87917L8.5 1.41667Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.4583 12.75L13.8125 13.8125L14.875 14.1667L13.8125 14.5208L13.4583 15.5833L13.1042 14.5208L12.0417 14.1667L13.1042 13.8125L13.4583 12.75Z" stroke="#2563EB" strokeWidth="1.275" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                Choose a style
              </li>
            </ul>
          </div>

          <div className="box-border min-w-0 flex-[0_1_612px] rounded-[22px] border border-spread-panel-line bg-spread-panel p-[30px] shadow-spread-panel to-992:mt-[3.5em] to-992:w-full to-992:max-w-full to-992:flex-none">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="flex h-[140px] w-[140px] items-center justify-center rounded-[12px] bg-white shadow-spread-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/customize-qr-standard.svg" alt="Standard QR code" className="h-[112px] w-[112px]" />
                </div>
                <p className="mt-[10px] p-0 text-[12px] font-semibold text-spread-caption">
                  Standard QR
                </p>
              </div>
              <span className="mx-[35px] flex pb-[28px] text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[30px] w-[30px]"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </span>
              <div className="flex flex-col items-center">
                <div className="flex h-[140px] w-[140px] items-center justify-center rounded-[12px] bg-white shadow-spread-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/customize-qr-branded.svg" alt="Branded QR code" className="h-[112px] w-[112px]" />
                </div>
                <p className="mt-[10px] p-0 text-[12px] font-semibold text-spread-caption">
                  Your Branded QR
                </p>
              </div>
            </div>

            <div className="mt-[23px] border-t border-spread-rule pt-[16px]">
              <h5 className="text-[14px] font-bold text-spread-ink">Colors</h5>
              <ul className="mt-[10px] flex">
                {swatches.map((color) => (
                  <li
                    key={color}
                    className="h-[22px] w-[22px] rounded-full not-first:ml-[15px]"
                    style={{ background: color }}
                  />
                ))}
              </ul>
            </div>

            <div className="mt-[22px] flex">
              <div className="box-border flex h-[44px] flex-[1_0_0] items-center justify-center rounded-[9px] border border-spread-rule bg-white text-[13px] font-bold text-spread-btn-ink">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mr-[8px] h-[16px] w-[16px] shrink-0"><path d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.66667 6.66667C6.21895 6.66667 6.66667 6.21895 6.66667 5.66667C6.66667 5.11438 6.21895 4.66667 5.66667 4.66667C5.11438 4.66667 4.66667 5.11438 4.66667 5.66667C4.66667 6.21895 5.11438 6.66667 5.66667 6.66667Z" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 11.3333L5.33333 8L8 10.6667L10 8.66667L14 12.6667" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Add Logo
              </div>
              <div className="ml-[12px] box-border flex h-[44px] flex-[1_0_0] items-center justify-center rounded-[9px] border border-spread-rule bg-white text-[13px] font-bold text-spread-btn-ink">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mr-[8px] h-[16px] w-[16px] shrink-0"><path d="M8 1.33333L9.13333 5.53333L13.3333 6.66667L9.13333 7.8L8 12L6.86667 7.8L2.66667 6.66667L6.86667 5.53333L8 1.33333Z" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.6667 12L13 13L14 13.3333L13 13.6667L12.6667 14.6667L12.3333 13.6667L11.3333 13.3333L12.3333 13L12.6667 12Z" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Styles
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="ml-[6px] h-[14px] w-[14px] shrink-0"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
