"use client";

import { useEffect, useState } from "react";

/**
 * Odometer-style counter: each digit is a vertical reel of 0-9 that slides
 * into position on mount.
 */
export function AnimatedCounter({ value }: { value: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const formatted = value.toLocaleString("en-US");

  return (
    <span className="inline-flex tabular-nums">
      <span className="sr-only">{formatted}</span>
      <span aria-hidden="true" className="inline-flex">
        {formatted.split("").map((char, i) => {
          if (char === ",") return <span key={i}>,</span>;

          const digit = Number(char);
          return (
            <span
              key={i}
              className="inline-block overflow-hidden align-bottom"
              style={{ height: "1em", lineHeight: "1em" }}
            >
              <span
                className="flex flex-col ease-out motion-safe:transition-transform motion-safe:duration-500"
                style={{
                  transform: `translateY(-${(mounted ? digit : 0) * 10}%)`,
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                {Array.from({ length: 10 }, (_, n) => (
                  <span key={n} style={{ height: "1em", lineHeight: "1em" }}>
                    {n}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
