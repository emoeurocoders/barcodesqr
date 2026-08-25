"use client";

import { Globe, ChevronRight, Heart, Image as ImageIcon } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

type Values = Record<string, string>;

const BAR = "#e0e1eb";
const TILE = "#ececf3";
const HEART = "#0e4a50";
const CHEVRON = "#17a878";

/** A grey placeholder bar of the given width. */
function Bar({ w, className = "" }: { w: string; className?: string }) {
  return (
    <div
      className={`h-1.5 rounded-full ${className}`}
      style={{ width: w, background: BAR }}
    />
  );
}

/** An image slot with its little favourite button. */
function Tile({ h, icon }: { h: string; icon: "sm" | "md" }) {
  return (
    <div
      className={`relative grid ${h} place-items-center ${
        icon === "md" ? "rounded-xl" : "rounded-lg"
      }`}
      style={{ background: TILE }}
    >
      <span
        className={`absolute right-1.5 top-1.5 grid place-items-center rounded-full bg-white shadow-sm ${
          icon === "md" ? "h-5 w-5" : "h-[18px] w-[18px] p-1"
        }`}
      >
        <Heart
          className={icon === "md" ? "h-2.5 w-2.5" : "h-2 w-2"}
          style={{ color: HEART }}
        />
      </span>
      <ImageIcon
        className={icon === "md" ? "h-5 w-5" : "h-4 w-4"}
        style={{ color: "#c9cad4" }}
      />
    </div>
  );
}

/**
 * Step-2 preview for the Website type: the page a scan opens, drawn as a
 * generic storefront. The address bar is the only live part — everything
 * below is placeholder furniture, exactly as the creator draws it, because
 * neither of us can know what is at the other end of the link.
 */
export function WebsitePreview({ values }: { values: Values }) {
  const url = values.url?.trim() || "https://";

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col" style={{ background: "#fafdfc" }}>
        <div className="px-3 pb-4 pt-10" style={{ background: "#7cd4c2" }}>
          <div
            className="flex items-center gap-2 rounded-full px-3 py-2"
            style={{ background: "rgba(255, 255, 255, 0.55)" }}
          >
            <Globe
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: "#16323a" }}
            />
            <span
              className="truncate text-[11px] font-bold"
              style={{ color: "#16323a" }}
            >
              {url}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-3 px-3 pt-4">
          <div className="flex items-center justify-between">
            <Bar w="106px" />
            <ChevronRight className="h-3.5 w-3.5" style={{ color: CHEVRON }} />
          </div>

          <div className="-mr-3 flex overflow-hidden">
            <div className="relative z-10 w-[60%] shrink-0 rounded-2xl bg-white p-2.5">
              <Tile h="h-36" icon="md" />
              <div className="mt-2 flex items-center justify-between">
                <Bar w="48%" />
                <Bar w="28%" />
              </div>
              <Bar w="34%" className="mt-1.5" />
            </div>
            <div className="-ml-2 w-[42%] shrink-0 rounded-2xl bg-white p-2.5 pl-4">
              <Tile h="h-36" icon="md" />
              <Bar w="80%" className="mt-2" />
              <Bar w="80%" className="mt-1.5" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Bar w="106px" />
            <ChevronRight className="h-3.5 w-3.5" style={{ color: CHEVRON }} />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="rounded-xl border bg-white p-2"
                style={{ borderColor: "#eef0f4" }}
              >
                <Tile h="h-20" icon="sm" />
                <Bar w="90%" className="mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
