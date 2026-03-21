import { Geist, Geist_Mono } from "next/font/google";
import ToasterWithBackdrop from "@atom/ToasterWithBackdrop";

import type { Metadata } from "next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ジュース購入用ポイント管理アプリ",
  description: "ジュース購入用ポイントを管理するアプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon-orange.svg" />
        <link rel="icon" type="image/png" href="/favicon-orange.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <ToasterWithBackdrop />
      </body>
    </html>
  );
}
