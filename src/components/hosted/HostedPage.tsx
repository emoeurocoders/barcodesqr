"use client";

import { PageMode } from "@/components/create/mobile/pageMode";
import { MultiLinkPreview, VCardPreview } from "@/components/create/mobile/previews";
import { AppLinkPreview, ImagePreview, PdfPreview } from "@/components/create/mobile/previews2";
import { MenuPreview, SocialMediaPreview, VideoPreview } from "@/components/create/mobile/previews3";
import { AudioPreview } from "@/components/create/mobile/previews5";
import { BusinessPreview, CouponPreview } from "@/components/create/mobile/previews6";

type Values = Record<string, string>;

/**
 * The width each page is drawn at — its preview's phone, in the creator's
 * 390px layout. The page is that drawing zoomed to the visitor's screen (see
 * app/q/[slug]), so every size stays the preview's.
 */
export const designWidth: Record<string, number> = {
  vcard: 243.4,
  multilink: 243.4,
  social: 243.4,
  menu: 243.4,
  image: 243.4,
  applink: 243.4,
  pdf: 332.8,
  video: 332.8,
  mp3: 332.8,
  coupon: 332.8,
  business: 332.8,
};

const noop = () => {};

/** One saved code's page: its preview, in page mode. */
export function HostedPage({ type, values, slug }: { type: string; values: Values; slug: string }) {
  const p = { values, open: true, onToggle: noop };
  let body = null;
  if (type === "vcard") body = <VCardPreview {...p} selectedSocials={[]} />;
  else if (type === "multilink") body = <MultiLinkPreview {...p} selectedSocials={[]} />;
  else if (type === "social") body = <SocialMediaPreview {...p} selectedSocials={[]} />;
  else if (type === "menu") body = <MenuPreview {...p} />;
  else if (type === "image") body = <ImagePreview {...p} />;
  else if (type === "applink") body = <AppLinkPreview {...p} />;
  else if (type === "pdf") body = <PdfPreview {...p} />;
  else if (type === "video") body = <VideoPreview {...p} />;
  else if (type === "mp3") body = <AudioPreview {...p} />;
  else if (type === "coupon") body = <CouponPreview {...p} />;
  else if (type === "business") body = <BusinessPreview {...p} />;
  return <PageMode.Provider value={{ slug }}>{body}</PageMode.Provider>;
}
