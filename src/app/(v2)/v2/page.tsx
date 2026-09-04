import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Makimoo V2",
};

// V2 首页占位：深棕 hero 块验证外壳（fixed Header / Footer / 全宽布局）工作正常，
// 后续替换为真正的 V2 首页
export default function V2HomePage() {
  return (
    <section className="h-[90vh] bg-brand flex items-center justify-center">
      <h1 className="text-cream text-4xl md:text-6xl font-bold text-center px-6">
        Makimoo V2 — Coming Soon
      </h1>
    </section>
  );
}
