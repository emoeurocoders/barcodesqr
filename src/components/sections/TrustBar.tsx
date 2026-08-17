import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const USERS = 1151500;
const SCANS = 33260280;

const avatars = ["/avatars/1.png", "/avatars/2.png"];
const avatarsAfter = ["/avatars/3.png", "/avatars/4.png"];

const avatarClass =
  "h-10 w-10 object-cover rounded-full border-2 border-white ring-1 ring-black/5";

/**
 * Press outlets shown in the marquee. `logo` is intentionally left empty —
 * drop in the outlet's own artwork (as an /public/press/*.svg path) once
 * you have clearance to display it, and the wordmark fallback goes away.
 */
const press: { name: string; logo?: string }[] = [
  { name: "FOX" },
  { name: "Globe and Mail" },
  { name: "Yahoo" },
  { name: "Barchart" },
  { name: "Benzinga" },
  { name: "MSN" },
];

const dotPattern = {
  backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
  backgroundSize: "16px 16px",
};

function PressLogo({ item }: { item: (typeof press)[number] }) {
  return (
    <span
      role="img"
      aria-label={item.name}
      className="block shrink-0 text-muted/60 transition-colors hover:text-muted"
    >
      {item.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.logo} alt="" className="h-6 w-auto" />
      ) : (
        <span className="whitespace-nowrap text-lg font-semibold tracking-tight">
          {item.name}
        </span>
      )}
    </span>
  );
}

export function TrustBar() {
  return (
    <section className="border-y border-line bg-bg">
      <div className="container-page">
        <div className="flex flex-col items-center gap-4 py-7 lg:flex-row lg:gap-6 lg:py-6">
          <div
            aria-hidden="true"
            className="hidden h-20 w-28 shrink-0 text-line lg:block"
            style={dotPattern}
          />

          <div className="flex flex-col items-center gap-3 lg:flex-row lg:gap-4">
            <div className="flex -space-x-3">
              {avatars.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                  className={avatarClass}
                />
              ))}
              <span
                aria-hidden="true"
                className="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-bg-alt text-sm font-semibold text-muted ring-1 ring-black/5"
              >
                S
              </span>
              {avatarsAfter.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                  className={avatarClass}
                />
              ))}
            </div>

            <div className="text-center lg:text-left">
              <p className="text-xl font-semibold text-ink lg:text-base">
                Trusted by{" "}
                <span className="font-bold">
                  <AnimatedCounter value={USERS} />
                </span>{" "}
                users
              </p>
              <p className="mt-0.5 text-sm text-muted">
                Their QR codes are scanned{" "}
                <span className="font-semibold text-body">
                  <AnimatedCounter value={SCANS} />
                </span>{" "}
                times
              </p>
            </div>
          </div>

          <div className="marquee-group marquee-mask relative hidden w-full flex-1 overflow-hidden lg:block">
            <div className="flex w-max animate-marquee items-center gap-14 pr-14">
              {press.map((item) => (
                <div key={item.name} className="flex items-center">
                  <PressLogo item={item} />
                </div>
              ))}
              {press.map((item) => (
                <div
                  key={`dup-${item.name}`}
                  aria-hidden="true"
                  className="flex items-center"
                >
                  <PressLogo item={item} />
                </div>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="hidden h-20 w-28 shrink-0 text-line lg:block"
            style={dotPattern}
          />
        </div>
      </div>
    </section>
  );
}
