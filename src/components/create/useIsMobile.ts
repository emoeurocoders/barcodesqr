"use client";

import { useSyncExternalStore } from "react";

/** Below Tailwind's `md`, where the create_mobile*.html compositions apply. */
const QUERY = "(max-width: 767.98px)";

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Whether the creator should render its mobile composition.
 *
 * Only for what CSS cannot switch: the step-2 forms, where rendering both
 * layouts would put every input id on the page twice. Step 1 has no such
 * clash and is switched with `md:` classes, so it is right on first paint.
 * Step 2 is only ever reached after a click, by which point this has the
 * real answer — the server's `false` is never what a visitor sees.
 */
export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
