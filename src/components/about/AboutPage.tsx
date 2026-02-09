'use client';
import { Header } from "@/components/layout/Header";
import styles from "./AboutPage.module.css";
import { MdContent } from "@/components/layout/MdContent";
import { useMemo } from "react";
import { WorkCard } from "@/components/works/WorkCard";
import { projects } from "@/data/projects";
import { getStartDateMs } from "@/components/works/WorksPage";

export function AboutPage({ markdown }: { markdown: string }) {
  const components = useMemo(() => ({
    RecentWorksList: () =>
      <div className={styles.recentWorksList}>
        {
          projects
            .sort((a, b) => getStartDateMs(b.period) - getStartDateMs(a.period))
            .sort((a, b) => {
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              return 0;
            })
            .slice(0, 4)
            .map(p => <WorkCard key={p.id} project={p} />)
        }
      </div>
  }), []);

  return <>
    <Header>
      <h1 className={styles.title}>自己紹介</h1>
    </Header>
    <div className={styles.content}>
      <MdContent markdown={markdown} components={components} />
    </div>
  </>;
}