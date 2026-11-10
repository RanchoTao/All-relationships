"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Network,
  BookOpen,
  GitCompareArrows,
  MoveUpRight,
} from "lucide-react";
export function Header() {
  const path = usePathname();
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="AllRelationships 首页">
        <span className="brand-symbol">
          <Network size={23} />
        </span>
        <span>
          AllRelationships<small>人类关系博物馆</small>
        </span>
      </Link>
      <nav aria-label="主导航">
        {[
          { href: "/", text: "探索馆藏", icon: BookOpen },
          { href: "/explore", text: "偏好探索", icon: MoveUpRight },
          { href: "/graph", text: "关系图谱", icon: Network },
          { href: "/compare", text: "关系比较", icon: GitCompareArrows },
        ].map(({ href, text, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={path === href ? "page" : undefined}
          >
            <Icon size={16} />
            <span>{text}</span>
          </Link>
        ))}
      </nav>
      <Link className="header-about" href="/about">
        关于这座馆 <ArrowUpRight size={15} />
      </Link>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">
          AllRelationships <MoveUpRight size={19} />
        </Link>
        <p>理解关系的多样，也保留未知的空间。</p>
      </div>
      <div className="footer-links">
        <Link href="/about">编辑原则与来源</Link>
        <Link href="/graph">浏览知识结构</Link>
        <a
          href="https://github.com/RanchoTao/All-relationships"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
        <span>内容草稿 v0.3 · 2026</span>
      </div>
    </footer>
  );
}
