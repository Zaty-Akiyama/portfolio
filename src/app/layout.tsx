// src/app/layout.tsx
import { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import myIcon from "./myIcon.jpeg";

export const metadata: Metadata = {
  title: "秋山 雄哉 - フロント/バックエンドエンジニア ポートフォリオ",
  icons: {
    icon: myIcon.src,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
