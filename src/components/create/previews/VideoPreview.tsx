import { Link as LinkIcon, Play } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

/**
 * Step-2 preview for the Video type: the player a scan opens, with the
 * creator's sample thumbnail standing in for the uploaded clip.
 */
export function VideoPreview() {
  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col items-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute -right-24 -top-28 h-72 w-72 rounded-full"
            style={{ border: "26px solid rgba(248, 248, 250, 0.9)" }}
          />
          <div
            className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full"
            style={{ border: "30px solid rgba(248, 248, 250, 0.9)" }}
          />
        </div>

        <span className="relative mt-12 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
          <LinkIcon className="h-3 w-3" style={{ color: "#bc4e9a" }} />
          <span
            className="text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: "#1f2430" }}
          >
            Click to watch
          </span>
        </span>

        <div className="relative mt-5 w-[88%] rounded-2xl bg-white p-2 shadow-pop">
          <div className="relative overflow-hidden rounded-xl">
            <div className="aspect-[16/10] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/previews/video-thumb.jpg"
                alt=""
                aria-hidden="true"
                className="h-full w-full"
                style={{ objectFit: "cover", objectPosition: "50% 50%" }}
              />
            </div>
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white/70 shadow-lg backdrop-blur-sm">
                <Play className="ml-0.5 h-5 w-5 text-white" fill="white" />
              </span>
            </span>
          </div>
          <p
            className="truncate py-2 text-center text-[13px] font-bold"
            style={{ color: "#111111" }}
          >
            Happy Moments
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
