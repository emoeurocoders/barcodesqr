import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { qrCodes } from "@/db/schema";
import { encodeQr, isDynamic } from "@/components/create/encodeQr";
import { isValidUrl } from "@/components/create/validate";
import { HostedPage, designWidth } from "@/components/hosted/HostedPage";

/**
 * What a hosted QR code opens: https://www.barcodesqr.com/q/<slug>.
 *
 * Every visit counts as a scan (the dashboard's Scans column). App Link
 * sends phones straight to their store and shows desktop browsers its
 * page; every other hosted type shows its page — the creator's preview,
 * drawn at its design width and zoomed to the screen, so a scanner sees
 * what the customer saw while building it.
 */

export const dynamic = "force-dynamic";

async function find(slug: string) {
  if (!/^[A-Za-z0-9]{6,16}$/.test(slug)) return undefined;
  const [row] = await db
    .select({ id: qrCodes.id, type: qrCodes.type, name: qrCodes.name, values: qrCodes.values })
    .from(qrCodes)
    .where(eq(qrCodes.slug, slug))
    .limit(1);
  return row;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const row = await find((await params).slug);
  const v = row?.values ?? {};
  const title =
    v.title || v.eventTitle || v.headline || [v.firstName, v.lastName].filter(Boolean).join(" ") || row?.name || "BarcodesQR";
  // The customer's page, not ours: kept out of search results.
  return { title, robots: { index: false, follow: false } };
}

/**
 * A stored link made safe to send a scan to: parsed the way a browser would
 * (spaces and non-ASCII percent-encoded — raw, a space failed validation and
 * a "ż" crashed the redirect; Tami, 2026-11-10), then required to be a
 * well-formed http(s) link. "" when it is not one.
 */
function target(raw: string | undefined, httpsOnly: boolean) {
  let v = (raw ?? "").trim();
  // Saved bare ("forms.gle/abc") by the old desktop form, which only added
  // https:// when drawing the code — those printed codes worked, so the
  // redirect reads them the same way (Tami, 2026-11-10: a Feedback code that
  // "previously worked" now 404'd). Any other scheme is refused below.
  if (v && !/^[a-z][a-z0-9+.-]*:/i.test(v)) v = `https://${v}`;
  if (!/^https?:\/\//i.test(v)) return "";
  let url: URL;
  try {
    url = new URL(v);
  } catch {
    return "";
  }
  if (httpsOnly && url.protocol !== "https:") return "";
  return isValidUrl(url.href) ? url.href : "";
}

export default async function QrPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await find(slug);
  if (!row) notFound();

  await db
    .update(qrCodes)
    .set({ scans: sql`${qrCodes.scans} + 1` })
    .where(eq(qrCodes.id, row.id));

  const v = row.values;
  if (row.type === "applink") {
    const ua = (await headers()).get("user-agent") ?? "";
    const http = (u?: string) => target(u, false);
    const dest = /iPhone|iPad|iPod/i.test(ua)
      ? http(v.iosUrl) || http(v.fallbackUrl)
      : /Android/i.test(ua)
        ? http(v.androidUrl) || http(v.fallbackUrl)
        : http(v.fallbackUrl);
    if (dest) redirect(dest);
  }

  // Payment and Feedback go straight on to the customer's link — no page of
  // ours in between (JB). Only a well-formed https:// link, whatever was
  // stored: this is the one place a scan is sent somewhere.
  if (row.type === "payment" || row.type === "feedback") {
    // Payment must be https (JB); Feedback links saved before 2026-11-05
    // could be http://, and those codes worked.
    const to = target(row.type === "payment" ? v.paymentLink : v.url, row.type === "payment");
    if (to) redirect(to);
    notFound();
  }

  // A direct type never points here, but an old code might: send it on.
  // vCards printed while vCard was hosted (2026-10-23 → 10-30) keep their page.
  if (!isDynamic(row.type) && row.type !== "vcard") {
    const to = target(encodeQr(row.type, v), false);
    if (to) redirect(to);
    notFound();
  }

  const w = designWidth[row.type] ?? 332.8;
  return (
    <main className="min-h-dvh bg-white">
      {/* The screen's width, read before first paint so the page is drawn at
          the right scale from the start; capped so a desktop window shows a
          phone-width page rather than a giant one. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){var r=document.documentElement;function f(){r.style.setProperty('--qw',Math.min(window.innerWidth,480))}f();addEventListener('resize',f)})()",
        }}
      />
      {/* --qh: the screen's height in the drawing's own pixels, so a page
          short of content still runs its background to the bottom. */}
      <div
        className="mx-auto"
        style={
          {
            width: w,
            zoom: `calc(var(--qw, 390) / ${w})`,
            "--qh": `calc(100dvh * ${w} / var(--qw, 390))`,
          } as React.CSSProperties
        }
      >
        <HostedPage type={row.type} values={v} slug={slug} />
      </div>
    </main>
  );
}
