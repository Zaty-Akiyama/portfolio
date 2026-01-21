"use client";

import { useMemo, useState } from "react";
import styles from "./WorksPage.module.css";
import { projects } from "@/data/projects";
import { SearchBox } from "@/components/ui/SearchBox";
import { WorksSection } from "./WorksSection";

import { normalizeKana } from "@/utils/normalizedText";
import { Header } from "@/components/layout/Header";

export const getStartDateMs = (period: string) => {
  const start = period.split("-")[0]?.trim() ?? "";
  return new Date(start.replace(/\./g, "/")).getTime();
};

export function WorksPage() {
  const [q, setQ] = useState("");

  const baseProjects = useMemo(() => {
    return projects
      .map((p) => ({ ...p, count: 0 }))
      .sort((a, b) => getStartDateMs(b.period) - getStartDateMs(a.period))
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, []);

  const filteredProjects = useMemo(() => {
    const raw = q.trim();
    if (!raw) return baseProjects;

    const keywords = normalizeKana(raw)
      .split(/\s+|,+/)
      .filter(Boolean);

    const withCount = baseProjects.map((p) => {
      const hay = normalizeKana(
        [
          p.title,
          p.category,
          p.period,
          p.role,
          p.summary,
          ...(p.stack ?? []),
        ].join(" ")
      );

      const count = keywords.reduce((acc, kw) => {
        return hay.includes(kw) ? acc + 1 : acc;
      }, 0);

      return { ...p, count };
    });

    const filtered = withCount.filter((p) => p.count > 0);

    return filtered.sort((a, b) => {
      const countDiff = b.count - a.count;
      if (countDiff !== 0) return countDiff;
      return getStartDateMs(b.period) - getStartDateMs(a.period);
    });
  }, [q, baseProjects]);

  return (
    <>
      <Header isFixed>
        <div>
          <h1 className={styles.title}>Works</h1>
        </div>

        <div className={styles.right}>
          <SearchBox value={q} onChange={setQ} />
        </div>
      </Header>

      <div className={styles.content}>
        <p className={styles.sub}>
          右上の検索フォームからスキルや開発フェーズの絞り込みができます。スペースやカンマで複数キーワードの検索ができます。
        </p>

        <WorksSection id="featured" title="実績" projects={filteredProjects} keywords={q} />
      </div>
    </>
  );
}
