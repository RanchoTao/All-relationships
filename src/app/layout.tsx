import type { Metadata } from "next";
import { Header, Footer } from "@/components/shell";
import "@fontsource/noto-serif-sc/400.css";
import "@fontsource/noto-serif-sc/600.css";
import "@fontsource-variable/inter";
import "@fontsource/jetbrains-mono/400.css";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "AllRelationships · 人类关系博物馆",
    template: "%s · AllRelationships",
  },
  description:
    "探索 479 个关系名称与场景。一个保留证据、边界与未知的人类关系 Wiki。",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main">
          跳至主要内容
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
