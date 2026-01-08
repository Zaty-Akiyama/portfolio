"use client";

import { useMemo, useState } from "react";
import styles from "./WorksPage.module.css";
import { projects } from "@/data/projects";
import { SearchBox } from "@/components/ui/SearchBox";
import { WorksSection } from "./WorksSection";

export function WorksPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return projects;

    return projects.filter((p) => {
      const hay = [
        p.title,
        p.category,
        p.period,
        p.role,
        p.summary,
        ...(p.stack ?? []),
        ...(p.labels ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(keyword);
    });
  }, [q]);

  const featured = filtered.filter((p) => p.featured);
  const all = filtered.filter((p) => !p.featured);

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Works</h1>
          <p className={styles.sub}>
            実績を中心に、担当範囲・期間・技術・取り組み内容が一目でわかる構成にしています。
          </p>
        </div>

        <div className={styles.right}>
          <SearchBox value={q} onChange={setQ} />
        </div>
      </header>

      <WorksSection
        id="featured"
        title="代表実績"
        projects={featured}
      />

      <WorksSection id="all" title="その他の実績" projects={all} />

      <footer className={styles.footer}>
        <div>© Yuya Akiyama</div>
        <div className={styles.footerNote}>最終更新: 2026年01月05日</div>
      </footer>
    </>
  );
}
