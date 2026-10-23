import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { qrCodes } from "@/db/schema";
import { encodeQr, isDynamic } from "@/components/create/encodeQr";
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
    v.title || v.headline || [v.firstName, v.lastName].filter(Boolean).join(" ") || row?.name || "BarcodesQR";
  // The customer's page, not ours: kept out of search results.
  return { title, robots: { index: false, follow: false } };
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
    const http = (u?: string) => (u && /^https?:\/\//i.test(u.trim()) ? u.trim() : "");
    const target = /iPhone|iPad|iPod/i.test(ua)
      ? http(v.iosUrl) || http(v.fallbackUrl)
      : /Android/i.test(ua)
        ? http(v.androidUrl) || http(v.fallbackUrl)
        : http(v.fallbackUrl);
    if (target) redirect(target);
  }

  // A direct type never points here, but an old code might: send it on.
  if (!isDynamic(row.type)) {
    const target = encodeQr(row.type, v);
    if (/^https?:\/\//i.test(target)) redirect(target);
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
