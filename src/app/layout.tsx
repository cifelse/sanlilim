import type { Metadata, Viewport } from "next";
import { Open_Sans, Bowlby_One_SC } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Sanlilim",
  description: "One stop shelter finder for Filipinos. Find the nearest shelter in your area.",
  applicationName: "Sanlilim",
  generator: "Next.js",
  keywords: ["Shelter", "Evacuation", "Emergency", "Flood", "Earthquake", "Hazard", "Philippines"],
  openGraph: {
    images: {
      url: "https://i.imgur.com/lSEwsnI.png",
      type: "image/png",
      width: 1200,
      height: 630,
    },
    type: "website",
    siteName: "Sanlilim",
    url: "https://sanlilim.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    images: {
      url: "https://i.imgur.com/lSEwsnI.png",
      type: "image/png",
      width: 1200,
      height: 630,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#F05454",
};

const primaryFont = Bowlby_One_SC({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-bowlby-one-sc",
});

const secondaryFont = Open_Sans({ 
  weight: "800", 
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${primaryFont.variable} ${secondaryFont.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
