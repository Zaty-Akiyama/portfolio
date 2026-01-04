import styles from "./SidebarLinks.module.css";

const links = [
  { href: "https://github.com/Zaty-Akiyama", label: "GitHub"},
  { href: "https://zaty.jp", label: "ZATY", hint: "制作チーム" },
  { href: "https://blog.zaty.jp", label: "Blog"},
];

export function SidebarLinks() {
  return (
    <section className={styles.block}>
      <div className={styles.title}>Links</div>
      <div className={styles.links}>
        {links.map((l) => {
          const external = l.href.startsWith("http");
          return (
            <a
              key={l.label}
              className={styles.link}
              href={l.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
            >
              {l.label} <span className={styles.hint}>{l.hint}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
