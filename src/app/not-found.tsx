import Link from "next/link";
export default function NotFound() {
  return (
    <div className="error-page">
      <h1>404 · 未收录</h1>
      <p>这条馆藏地址不存在。请核对稳定 ID，或回到目录继续探索。</p>
      <Link href="/" className="primary-button">
        返回全部馆藏
      </Link>
    </div>
  );
}
