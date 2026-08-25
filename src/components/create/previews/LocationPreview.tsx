import { PhoneFrame } from "../PhonePreview";

const PARK = "#ebf2ef";
const ROAD = "rgba(244, 247, 245, 0.85)";

/**
 * Step-2 preview for the Location type: the map a scan opens, with the pin
 * dropped on the address.
 *
 * Deliberately an abstract map rather than a real one — the creator draws it
 * the same way, and embedding a live tile service for a preview would leak
 * the address to a third party on every keystroke.
 */
export function LocationPreview() {
  return (
    <PhoneFrame>
      <div
        className="relative h-full overflow-hidden"
        style={{ background: "#e4ede9" }}
      >
        <div
          className="absolute -left-6 top-6 h-28 w-32 rounded-3xl"
          style={{ background: PARK }}
        />
        <div
          className="absolute -right-8 top-40 h-32 w-32 rounded-3xl"
          style={{ background: PARK }}
        />
        <div
          className="absolute -left-4 bottom-8 h-28 w-28 rounded-3xl"
          style={{ background: PARK }}
        />
        <div
          className="absolute -right-12 bottom-24 h-36 w-36 rounded-full"
          style={{ background: "#cbe2d2" }}
        />

        <div
          className="absolute left-0 top-28 h-2.5 w-full"
          style={{ background: ROAD }}
        />
        <div
          className="absolute -left-10 top-1/2 h-2 w-[150%] origin-left"
          style={{ background: ROAD, transform: "rotate(-22deg)" }}
        />
        <div
          className="absolute left-1/3 top-0 h-[150%] w-2.5 origin-top"
          style={{ background: ROAD, transform: "rotate(14deg)" }}
        />
        <div
          className="absolute right-1/4 top-0 h-[150%] w-2 origin-top"
          style={{ background: ROAD, transform: "rotate(-10deg)" }}
        />
        <div
          className="absolute left-0 top-2/3 h-3.5 w-[140%] origin-left"
          style={{ background: "#d9e6e1", transform: "rotate(8deg)" }}
        />
        <div
          className="absolute left-0 top-[84%] h-2 w-[140%] origin-left"
          style={{ background: ROAD, transform: "rotate(-12deg)" }}
        />

        <div className="absolute left-[46%] top-[50%] -translate-x-1/2 -translate-y-1/2">
          <span
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: "#d26a5c" }}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: "#f7efea" }}
            />
          </span>
        </div>
      </div>
    </PhoneFrame>
  );
}
