import styles from "./WorksSection.module.css";
import { Project } from "@/types/project";
import { WorkCard } from "./WorkCard";

export function WorksSection({
  id,
  title,
  note,
  projects,
  keywords,
}: {
  id: string;
  title: string;
  note?: string;
  projects: Project[];
  keywords?: string;
}) {
  const keywordsArray = keywords
    ? keywords.trim().toLowerCase().split(/\s+|,+/)
    : [];

  return (
    <section className={styles.section} id={id}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        {note ? <p className={styles.note}>{note}</p> : null}
      </div>

      <div className={styles.grid}>
        {projects.map((p) => (
          <WorkCard key={p.id} project={p} keywords={keywordsArray} />
        ))}
      </div>
    </section>
  );
}
