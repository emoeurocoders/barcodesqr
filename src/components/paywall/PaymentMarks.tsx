/**
 * The card marks the designer drew inline in `modal_join.html`, copied path
 * for path rather than substituted — these are brand lockups, not icons, and
 * lucide has no equivalent.
 *
 * One deliberate change: the Visa mark's paths sit inside
 * `<g style="clip-path: url(#clippath-1proUp)">` in the mockup, and no
 * clipPath with that id exists anywhere in the file. An unresolvable
 * clip-path reference is defined to hide the element, so reproducing the
 * wrapper verbatim would render a blank card. The wrapper is dropped and the
 * paths kept; raised with the designer to fix at source.
 */

export function VisaMark() {
  return (
    <svg
      width="32"
      height="20"
      viewBox="0 0 32 20"
      className="block"
      aria-hidden="true"
    >
      <path
        d="M28.4.7H3.6C1.8.7.4,2.1.4,3.8v12.4c0,1.7,1.4,3.1,3.1,3.1h24.9c1.7,0,3.1-1.4,3.1-3.1V3.8c0-1.7-1.4-3.1-3.1-3.1Z"
        style={{ fill: "#fff", stroke: "#e2e8f0", strokeWidth: ".9px" }}
      />
      <path
        d="M13.1,6.3l-3.1,7.5h-2.1l-1.5-6c0-.4-.2-.5-.5-.7-.5-.3-1.2-.5-1.9-.6v-.2h3.3c.2,0,.4,0,.6.2.2.1.3.3.3.5l.8,4.3,2-5.1h2ZM21.1,11.3c0-2-2.7-2.1-2.7-3,0-.3.3-.6.8-.6.7,0,1.3,0,1.9.3l.3-1.6c-.6-.2-1.2-.3-1.8-.3-1.9,0-3.3,1-3.3,2.5,0,1.1,1,1.7,1.7,2,.8.4,1,.6,1,.9,0,.5-.6.7-1.2.7-1,0-1.5-.3-2-.5l-.4,1.6c.5.2,1.3.4,2.2.4,2,0,3.4-1,3.4-2.6ZM26.2,13.8h1.8l-1.6-7.5h-1.7c-.2,0-.4,0-.5.1-.1,0-.3.2-.3.4l-2.9,6.9h2l.4-1.1h2.5l.2,1.1ZM24,11.1l1-2.8.6,2.8h-1.6ZM15.9,6.3l-1.6,7.5h-1.9l1.6-7.5h1.9Z"
        style={{ fill: "#1a1f71" }}
      />
    </svg>
  );
}

export function MastercardMark() {
  return (
    <svg
      width="32"
      height="20"
      viewBox="0 0 32 20"
      fill="none"
      className="block"
      aria-hidden="true"
    >
      <rect
        x=".5"
        y=".5"
        width="31"
        height="19"
        rx="3"
        fill="#fff"
        stroke="#e5e7eb"
      />
      <circle cx="13" cy="10" r="5" fill="#eb001b" />
      <circle cx="19" cy="10" r="5" fill="#f79e1b" />
      <path d="M16 6a5 5 0 010 8 5 5 0 000-8z" fill="#ff5f00" />
    </svg>
  );
}

/** The little card-with-CVC hint that sits inside the CVC field. */
export function CvcMark() {
  return (
    <svg
      width="34"
      height="24"
      viewBox="0 0 34 24"
      fill="none"
      className="block"
      aria-hidden="true"
    >
      <path
        d="M22.9 4H3.1C1.66406 4 0.5 5.16406 0.5 6.6V18.4C0.5 19.8359 1.66406 21 3.1 21H22.9C24.3359 21 25.5 19.8359 25.5 18.4V6.6C25.5 5.16406 24.3359 4 22.9 4Z"
        fill="#D5D9DF"
      />
      <path d="M25.5 7.4H0.5V11H25.5V7.4Z" fill="#A5ABB5" />
      <path
        d="M15.1 13.2H3.9C3.40294 13.2 3 13.6029 3 14.1V15.7C3 16.1971 3.40294 16.6 3.9 16.6H15.1C15.5971 16.6 16 16.1971 16 15.7V14.1C16 13.6029 15.5971 13.2 15.1 13.2Z"
        fill="white"
      />
      <path
        d="M26.5 16C30.6421 16 34 12.6421 34 8.5C34 4.35786 30.6421 1 26.5 1C22.3579 1 19 4.35786 19 8.5C19 12.6421 22.3579 16 26.5 16Z"
        fill="#5B6472"
      />
      <text
        x="26.5"
        y="10.8"
        textAnchor="middle"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="6.4"
        fontWeight="700"
        letterSpacing="-0.128"
        fill="#ffffff"
      >
        123
      </text>
    </svg>
  );
}

/** The "Credit or Debit Card" wallet tile. */
export function CardMark() {
  return (
    <span className="flex items-center">
      <svg
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
        className="shrink-0"
        aria-hidden="true"
      >
        <path
          d="M15.8333 3.95833H3.16667C2.29222 3.95833 1.58333 4.66722 1.58333 5.54167V13.4583C1.58333 14.3328 2.29222 15.0417 3.16667 15.0417H15.8333C16.7078 15.0417 17.4167 14.3328 17.4167 13.4583V5.54167C17.4167 4.66722 16.7078 3.95833 15.8333 3.95833Z"
          stroke="#2563EB"
          strokeWidth="1.58333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.58333 7.91667H17.4167"
          stroke="#2563EB"
          strokeWidth="1.58333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="pl-1.5 text-left text-[12.5px] font-semibold leading-[1.15em] text-primary">
        Credit or
        <br />
        Debit Card
      </span>
    </span>
  );
}
