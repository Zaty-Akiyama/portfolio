"use client";

import { useMemo, useState } from "react";
import styles from "./WorksPage.module.css";
import { projects } from "@/data/projects";
import { SearchBox } from "@/components/ui/SearchBox";
import { WorksSection } from "./WorksSection";

export function WorksPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const rowKeyword = q.trim().toLowerCase();
    if (!rowKeyword) return projects;

    const keywords = rowKeyword.split(/\s+|,+/);

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
      
      return keywords.every((kw) => hay.includes(kw));
    });
  }, [q]);

  const featured = filtered.filter((p) => p.featured);
  const all = filtered.filter((p) => !p.featured);

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Works</h1>
        </div>

        <div className={styles.right}>
          <SearchBox value={q} onChange={setQ} />
        </div>
      </header>
      <div className={styles.content}>
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
      </div>
    </>
  );
}
