import { PreferenceExplorer } from "@/components/preference-explorer";
export const metadata = {
  title: "关系偏好探索 · 此刻想要什么关系",
  description:
    "约 6–12 题，透明分支、本地计算、可保留未知的关系阅读探索。不是人格测评。",
};
export default function Page() {
  return <PreferenceExplorer />;
}
