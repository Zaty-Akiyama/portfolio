import styles from "./WorkCard.module.css";
import { Project } from "@/types/project";

export function WorkCard({ project }: { project: Project }) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.labels}>
          {project.labels?.map((l) => (
            <span key={l} className={styles.label}>
              {l}
            </span>
          ))}
          <span className={styles.label}>{project.category}</span>
        </div>

        <h3 className={styles.title}>{project.title}</h3>

        <div className={styles.meta}>
          <span>{project.period}</span>
          <span>／</span>
          <span>{project.role}</span>
        </div>
      </div>

      <div className={styles.body}>
        {project.summary ? (
          <p className={styles.desc}>
            {project.summary.split(/\r?\n/).map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        ) : null}

        {project.stack?.length ? (
          <div className={styles.pills}>
            {project.stack.map((s) => (
              <span key={s} className={styles.pill}>
                {s}
              </span>
            ))}
          </div>
        ) : null}

        {project.links?.length ? (
          <div className={styles.actions}>
            {project.links.map((l) => {
              const external = l.href?.startsWith("http");
              const cls = l.primary ? `${styles.aBtn} ${styles.aBtnPrimary}` : styles.aBtn;

              return (
                <a
                  key={l.label}
                  className={cls}
                  href={l.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                >
                  {l.label}
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    </article>
  );
}
