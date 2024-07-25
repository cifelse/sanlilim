import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
