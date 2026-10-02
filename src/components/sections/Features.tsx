/**
 * mainB.html's `#mainFeat`: three feature cards between the hero and the
 * steps. It took the place of the press-logo scroller in the designer's
 * 2026-09-11 sync and is desktop-only — main_mobile.html has no equivalent,
 * its hero carrying a benefits strip instead.
 *
 * The glyphs are the designer's filled 1024-unit paths, copied verbatim; each
 * carries its own fill, so the colour is in the data rather than a token.
 */
const features = [
  {
    title: "Dynamic QR Codes",
    desc: "Edit your destination anytime, no reprints needed.",
    tile: "bg-feat-tile-1",
    fill: "#257ef9",
    paths: [
      "M434.897971 962.214818c-2.485611 0-4.357238-0.661056-5.599532-1.871627-8.714476-2.52552-11.821233-7.463995-9.335622-14.935154l57.877175-341.637937L225.804792 603.7701c-6.220678 0-10.577916-2.492774-13.071713-7.471159-3.727904-4.938476-3.106758-10.538007 1.871627-16.799618L602.920756 71.702042c4.978385-7.471159 10.577916-8.674567 16.799618-3.736091 6.220678 1.242294 9.335622 6.260587 9.335622 14.935154l-57.877175 341.646124L793.34269 424.547229c6.220678 0 10.577916 2.52552 13.071713 7.463995 1.242294 4.978385 1.242294 10.577916 0 16.806781L447.969685 956.615287C444.233594 960.343191 439.876356 962.214818 434.897971 962.214818z",
    ],
  },
  {
    title: "Built-in Analytics",
    desc: "Track scans, locations, devices and performance.",
    tile: "bg-feat-tile-2",
    fill: "#07b8a2",
    paths: [
      "M51.2 307.2m51.2 0l102.4 0q51.2 0 51.2 51.2l0 460.8q0 51.2-51.2 51.2l-102.4 0q-51.2 0-51.2-51.2l0-460.8q0-51.2 51.2-51.2Z",
      "M409.6 51.2m51.2 0l102.4 0q51.2 0 51.2 51.2l0 716.8q0 51.2-51.2 51.2l-102.4 0q-51.2 0-51.2-51.2l0-716.8q0-51.2 51.2-51.2Z",
      "M768 204.8m51.2 0l102.4 0q51.2 0 51.2 51.2l0 563.2q0 51.2-51.2 51.2l-102.4 0q-51.2 0-51.2-51.2l0-563.2q0-51.2 51.2-51.2Z",
    ],
  },
  {
    title: "Custom Branding",
    desc: "Add your logo, colors, frames and styles.",
    tile: "bg-feat-tile-3",
    fill: "#0896cf",
    paths: [
      "M833.706667 216.746667A452.693333 452.693333 0 0 0 508.16 85.333333a426.666667 426.666667 0 0 0-2.133333 853.333334 110.08 110.08 0 0 0 107.946666-80.64 107.52 107.52 0 0 0-24.32-97.28 21.333333 21.333333 0 0 1 15.786667-35.413334h70.4A262.4 262.4 0 0 0 938.666667 483.413333a361.813333 361.813333 0 0 0-104.96-266.666666z m-541.866667 412.16a64 64 0 1 1 17.066667-88.746667 63.573333 63.573333 0 0 1-17.066667 88.746667zM354.133333 394.666667a64 64 0 1 1-23.466666-85.333334 64 64 0 0 1 23.466666 85.333334zM469.333333 298.666667a64 64 0 1 1 64-64A64 64 0 0 1 469.333333 298.666667z m245.333334 34.133333a64 64 0 1 1 23.466666-85.333333 64 64 0 0 1-23.466666 85.333333z",
    ],
  },
];

export function Features() {
  return (
    <section className="relative hidden border-y border-hero-line bg-feat-bg md:block">
      <div className="container-wide-home py-[76px]">
        {/* Their .btm wrapper carries no styles, but it is in the markup. */}
        <div>
          {/*
            text-[10px] because their gaps and paddings are `em` against the
            mockup's 10px body, not the 16px ours inherits.
          */}
          <div className="grid grid-cols-3 gap-[2.4em] text-[10px] to-992:grid-cols-1 to-992:gap-[2em]">
            {features.map(({ title, desc, tile, fill, paths }) => (
              <div
                key={title}
                className="flex items-start rounded-[16px] border border-help-card-line bg-white px-[3em] py-[3.4em] shadow-[0_1px_2px_rgba(14,19,17,0.04)]"
              >
                <span
                  className={`flex h-[5.2em] w-[5.2em] shrink-0 items-center justify-center rounded-[1em] ${tile}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1024 1024"
                    fill={fill}
                    aria-hidden="true"
                    className="block w-[63%]"
                  >
                    {paths.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                </span>
                <div className="ml-[2em]">
                  <h5 className="text-[1.9em] font-bold leading-[normal] text-black">
                    {title}
                  </h5>
                  <p className="mt-[0.55em] p-0 text-[1.39em] leading-[1.55em] text-muted">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
