import type { Metadata } from "next";
import { Inter, Anton, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.barcodesqr.com"),
  title: "BarcodesQR — Create your QR code in seconds",
  description:
    "Generate dynamic, editable QR codes with custom colors, shapes, frames and logos. Track scans, edit after printing, and download in high resolution.",
  openGraph: {
    title: "BarcodesQR — Create your QR code in seconds",
    description:
      "Generate dynamic, editable QR codes with custom colors, shapes, frames and logos. Track scans, edit after printing, and download in high resolution.",
    url: "https://www.barcodesqr.com",
    siteName: "BarcodesQR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BarcodesQR — Create your QR code in seconds",
    description:
      "Generate dynamic, editable QR codes with custom colors, shapes, frames and logos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${anton.variable} ${caveat.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg text-body antialiased">
        {children}
      </body>
    </html>
  );
}
