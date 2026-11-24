import type { ReactNode, SVGProps } from "react";

/**
 * create_customize_desktop.html's icons, copied verbatim (Lucide glyphs in
 * the file; kept as the file draws them rather than through lucide-react, so
 * a library update cannot redraw one).
 */

type P = SVGProps<SVGSVGElement>;

const icon = (sw: number, children: ReactNode) =>
  function Icon(p: P) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
        {children}
      </svg>
    );
  };

export const IcoArrowLeft = icon(2, <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>);

export const IcoCustom = icon(
  1.8,
  <>
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 16v.01" />
    <path d="M16 12h1" />
    <path d="M21 12v.01" />
    <path d="M12 21v-1" />
  </>,
);

export const IcoBranded = icon(
  1.8,
  <>
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </>,
);

export const IcoAi = icon(
  1.8,
  <>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
  </>,
);

export const IcoReset = icon(2, <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></>);
export const IcoPrev = icon(2, <path d="m15 18-6-6 6-6" />);
export const IcoNext = icon(2, <path d="m9 18 6-6-6-6" />);
export const IcoChevron = icon(2, <path d="m6 9 6 6 6-6" />);

export const IcoPalette = icon(
  2,
  <>
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </>,
);

export const IcoUpload = icon(2, <><path d="M12 13v8" /><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="m8 17 4-4 4 4" /></>);

export const IcoReplace = icon(
  2,
  <>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </>,
);

export const IcoRemove = icon(2, <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>);
export const IcoInfo = icon(2, <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>);
export const IcoPhone = icon(2, <><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></>);
export const IcoArrowRight = icon(2.2, <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>);

/** create_ico_check.svg — the white tick in every selected badge. */
export const IcoBadgeTick = (p: P) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...p}>
    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** main_pay_ico_check.svg — the teal tick in the preview's benefit list. */
export const IcoBenefitTick = (p: P) => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...p}>
    <path d="M14.1667 4.25L6.375 12.0417L2.83333 8.5" stroke="#11B1A7" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
