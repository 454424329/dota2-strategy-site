import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "DOTA2攻略站 — 实时Meta数据 + 深度攻略 + 新闻资讯",
    template: "%s | DOTA2攻略站",
  },
  description:
    "DOTA2攻略站提供实时的英雄胜率、装备选择、克制关系等Meta数据，以及深度的英雄攻略、版本分析和最新DOTA2新闻资讯。",
  keywords: ["DOTA2", "攻略", "英雄", "胜率", "装备", "Meta", "刀塔"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://dota2-strategy.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "DOTA2攻略站",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark h-full antialiased">
      <head>
        <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" />
      </head>
      <body className="min-h-full flex flex-col bg-dota-bg text-dota-text">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
