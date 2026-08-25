"use client";

import { Wifi, ChevronRight } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

type Values = Record<string, string>;

/** Sample content, shown until the network name is filled in. */
const sample = { ssid: "CozyCornerWiFi" };

const PILL = "#edeff5";
const BAR_STRONG = "#d2d2d2";
const BAR_WEAK = "#e0e0e0";
const SIGNAL = "#01af6e";

/**
 * Step-2 preview for the WiFi type: the join sheet a scan brings up.
 *
 * The other networks in the list are drawn as blank rows on purpose — they
 * are whatever happens to be in range of whoever scans, so naming them would
 * be inventing data.
 */
export function WifiPreview({ values }: { values: Values }) {
  const ssid = values.ssid?.trim() || sample.ssid;

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-white">
        <div className="flex flex-col items-center px-6 pt-14 text-center">
          <Wifi className="h-16 w-16 text-brand-darker" />
          <p className="mt-2 text-[10px] text-muted">Connect to a network</p>
          <p className="mt-0.5 max-w-full truncate text-[15px] font-bold text-ink">
            {ssid}
          </p>
        </div>

        <div className="mt-6 px-6">
          <div
            className="grid h-9 place-items-center rounded-full"
            style={{ background: PILL }}
          >
            <div
              className="h-1.5 w-[30%] rounded-full"
              style={{ background: BAR_STRONG }}
            />
          </div>
        </div>

        <div className="mt-2 flex flex-1 flex-col justify-evenly px-5 pb-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Wifi className="h-4 w-4 shrink-0" style={{ color: SIGNAL }} />
              <div className="flex-1 space-y-1.5">
                <div
                  className="h-1.5 w-[40%] rounded-full"
                  style={{ background: BAR_STRONG }}
                />
                <div
                  className="h-1.5 w-[52%] rounded-full"
                  style={{ background: BAR_WEAK }}
                />
              </div>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-faint" />
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}
