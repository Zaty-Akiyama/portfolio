import styles from "./SidebarSkills.module.css";

const skills = ["HTML", "CSS", "JavaScript", "Sass", "PHP", "CakePHP", "Laravel", "Vue", "Nuxt", "TypeScript", "WordPress", "Shopify", "Three.js", "MySQL"];

export function SidebarSkills() {
  return (
    <section className={styles.block}>
      <div className={styles.title}>Skills</div>
      <div className={styles.chips}>
        {skills.map((s) => (
          <span key={s} className={styles.chip}>
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
