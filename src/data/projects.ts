// src/data/projects.ts
import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "core-nda",
    title: "基幹システム開発・保守",
    category: "システム開発・保守",
    period: "2023.08 - 現在",
    role: "FE / BE（準委任）",
    summary:
      "CakePHP/jQueryの基幹システムをLaravel + Vue(Nuxt)へ段階移行。",
    stack: ["PHP", "CakePHP", "Laravel", "Vue", "Nuxt", "TypeScript", "MySQL"],
    labels: ["NDA"],
    featured: false,
  },
  {
    id: "aduma",
    title: "WEBサイトリニューアル（あづま幼稚園）",
    category: "リニューアル",
    period: "2025.06 - 2025.08",
    role: "要件定義・設計・開発・テスト",
    summary:
      "情報が分散した旧サイトを整理し、重要情報へアクセスしやすい導線に再構成。ピックアップ/主要ナビを簡易運用できる更新システムも作成。",
    stack: ["HTML", "Sass", "JavaScript", "PHP", "WordPress"],
    featured: true,
    links: [{ label: "Webサイト", href: "https://aduma-kindergarden.com/" }],
  },
  {
    id: "shogein",
    title: "WEBサイトリニューアル（東洋書芸院）",
    category: "リニューアル",
    period: "2025.01 - 2025.02",
    role: "詳細設計・開発・テスト・運用保守",
    summary:
      "静的サイトで構築されていた旧WEBサイトから、お知らせコンテンツや年次開催の展覧会情報の更新ができるようWordPressで作成",
    stack: ["HTML", "Sass", "TypeScript", "PHP", "WordPress"],
    featured: true,
    links: [{ label: "Webサイト", href: "https://gendaisho.jp/" }],
  },
  {
    id: "ace",
    title: "コーポレートサイト制作（ACE株式会社）",
    category: "WEBサイト制作",
    period: "2024.05 - 2024.08",
    role: "要件定義・設計・開発・テスト・運用保守",
    summary:
      "コーポレートサイトの作成",
    stack: ["HTML", "Sass", "PHP"],
    featured: false,
    links: [{ label: "現在閉鎖中" }],
  },
  {
    id: "amorphia",
    title: "PRページ作成・リニューアル（AMORPHIA TOKYO）",
    category: "リニューアル",
    period: "2022.08 - 2023.01",
    role: "要件定義・設計・開発",
    summary:
      "・プロモーションページの作成\nブランドのコレクションイベントのイメージである砂時計をThree.jsを使って3Dで表現\n・共通部分のデザイン修正\nShopifyデフォルトのテーマデザインのヘッダー/フッターからサイト主要要素を大きく表示するようデザインの修正",
    stack: ["Shopify", "liquid", "Three.js", "WebGL"],
    featured: true,
    labels: ["WEBサイト制作"],
    links: [
      { label: "ホームページ", href: "https://amorphia.tokyo/" },
      { label: "プロモーションページ", href: "https://amorphia.tokyo/pages/2023-spring-summer" },
    ],
  },
  {
    id: "nexer",
    title: "SEO施策コーディング",
    category: "コーディング",
    period: "2022.11 - 2023.11 / 2025.11 - 現在",
    role: "コーディング業務",
    summary:
      "SEO対策を目的とした修正依頼のコーディング対応\n\nWordPressやMovableTypeなどのCMSやShopifyやMakeShopなどのECサイトで作成されたWEBサイトへの本番反映",
    stack: ["HTML", "CSS", "各種CMS"],
    labels: ["NDA"],
    featured: false,
  },
  {
    id: "zaty",
    title: "WEBサイトリニューアル（ZATY）",
    category: "リニューアル",
    period: "2024.09 - 2024.10",
    role: "要件定義・設計・開発・テスト・運用保守",
    summary:
      "ホームページ制作や名刺やロゴの作成、システムの開発を手がけるチームをデザイナーと業務提携し運営しています。\n公式サイトをリニューアルしました。",
    stack: ["HTML", "CSS", "React", "TypeScript"],
    featured: true,
    links: [{ label: "Webサイト", href: "https://zaty.jp/" }],
  },
  {
    id: "blog.zaty",
    title: "ブログ運営（ZATY）",
    category: "ブログ運営",
    period: "2021.08 - 現在に至る",
    role: "要件定義・設計・開発・テスト・運用保守",
    summary:
      "WEB制作・開発を手がけるZATYの公式ブログです。技術的な情報から実績や近況報告などZATYについても詳しく解説します。",
    stack: ["HTML", "Sass", "WordPress"],
    featured: true,
    labels: ["WEBサイト制作"],
    links: [{ label: "ブログ", href: "https://blog.zaty.jp/" }],
  },
  {
    id: "web.zaty",
    title: "WEBサイト制作（ZATY）",
    category: "WEBサイト制作",
    period: "2022.02 - 2022.06",
    role: "要件定義・設計・開発・テスト・運用保守",
    summary:
      "ZATYが運営するWEBサイト制作のポートフォリオサイトです。主に個人事業主や中小企業向けに、コーポレートサイトやランディングページ、ECサイトなどを制作しています。",
    stack: ["HTML", "Sass", "JavaScript"],
    featured: true,
    links: [{ label: "Webサイト", href: "https://web-production.zaty.jp/" }],
  },
  {
    id: "white-sesame",
    title: "ブログ運営（白ごまブログ）",
    category: "ブログ運営",
    period: "2019.06 - 現在に至る",
    role: "要件定義・設計・開発・テスト・運用保守",
    summary:
      "主にWeb制作やプログラミング、ガジェットレビューなどを扱う個人ブログです。初心者向けの解説記事や最新技術の紹介など幅広く発信しています。",
    stack: ["HTML", "Sass", "WordPress"],
    featured: false,
    labels: ["WEBサイト制作"],
    links: [{ label: "ブログ", href: "https://white-sesame.com" }],
  }
];
