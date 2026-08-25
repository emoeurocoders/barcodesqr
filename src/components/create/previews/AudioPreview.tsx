import { Music, Play, SkipBack, SkipForward } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

/**
 * Step-2 preview for the Audio type: the player a scan opens. Track and
 * artist stay unnamed until an upload can supply them.
 */
export function AudioPreview() {
  return (
    <PhoneFrame>
      <div
        className="flex h-full flex-col items-center justify-center px-5 pb-4"
        style={{
          background: "linear-gradient(#1b1330 0%, #0e0a1c 100%)",
        }}
      >
        <div
          className="grid aspect-square w-full max-w-[190px] place-items-center rounded-2xl shadow-pop"
          style={{
            background:
              "linear-gradient(135deg, #7c3aed 0%, #db2777 60%, #f97316 100%)",
          }}
        >
          <Music className="h-16 w-16 text-white/90" />
        </div>

        <p className="mt-5 w-full truncate text-center text-base font-bold text-white">
          Untitled track
        </p>
        <p className="mt-1 w-full truncate text-center text-[11px] font-medium text-white/55">
          Unknown artist
        </p>

        <div className="mt-5 w-full max-w-[210px]">
          <div className="relative h-1 w-full rounded-full bg-white/15">
            <div
              className="h-full rounded-full"
              style={{ width: "25%", background: "#db2777" }}
            />
            <span
              className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white shadow"
              style={{ left: "25%" }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[9px] font-medium text-white/45">
            <span>0:48</span>
            <span>3:12</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-8 text-white">
          <SkipBack className="h-5 w-5 text-white/80" fill="currentColor" />
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink shadow-pop">
            <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
          </span>
          <SkipForward className="h-5 w-5 text-white/80" fill="currentColor" />
        </div>

        <div className="mt-8 h-1 w-24 rounded-full bg-white/20" />
      </div>
    </PhoneFrame>
  );
}
