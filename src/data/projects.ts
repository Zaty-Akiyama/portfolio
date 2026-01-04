// src/data/projects.ts
import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "core-nda",
    title: "基幹システム開発・保守（NDA準拠）",
    category: "システム開発・保守",
    period: "2023.08 - 現在",
    role: "FE / BE（準委任）",
    summary:
      "CakePHP/jQueryの基幹システムをLaravel + Vue(Nuxt)へ段階移行。旧仕様の洗い出し、API作成、Figmaデザイン実装、運用バグ調査〜修正〜テストまで対応。",
    stack: ["PHP", "CakePHP", "Laravel", "Vue", "Nuxt", "TypeScript", "MySQL"],
    labels: ["NDA"],
    featured: false,
    links: [{ label: "Case Study", href: "#", primary: true }],
  },
  {
    id: "aduma",
    title: "WEBサイトリニューアル（あづま幼稚園）",
    category: "リニューアル",
    period: "2025.06 - 2025.08",
    role: "Member",
    summary:
      "情報が分散した旧サイトを整理し、重要情報へアクセスしやすい導線に再構成。ピックアップ/主要ナビを簡易運用できる更新システムも作成。",
    stack: ["HTML", "Sass", "JavaScript", "PHP", "WordPress"],
    featured: true,
    links: [{ label: "Website", href: "https://aduma-kindergarden.com/" }],
  },
  // ...（他も同様に）
];
