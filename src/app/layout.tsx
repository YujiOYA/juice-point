import { Geist, Geist_Mono } from "next/font/google";
import ToasterClient from "@atom/ToasterClient";
import QueryProvider from "@app/../providers/QueryProvider";
import PwaRegister from "@app/../providers/PwaRegister";

import type { Metadata, Viewport } from "next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "おてつだいポイント",
  description: "子供のお手伝いを申請・承認でポイント管理",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "おてつだいポイント",
  },
  icons: {
    icon: [
      { url: "/favicon-orange.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryProvider>
          {children}
          <ToasterClient />
        </QueryProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
