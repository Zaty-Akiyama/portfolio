import styles from "./SidebarNav.module.css";

const items = [
  { href: "#featured", label: "Featured Works" },
  { href: "#all", label: "All Works" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function SidebarNav() {
  return (
    <nav className={styles.nav} aria-label="sidebar">
      <div className={styles.title}>Navigate</div>
      {items.map((it, i) => (
        <a key={it.href} href={it.href} className={i === 0 ? styles.active : undefined}>
          {it.label}
        </a>
      ))}
    </nav>
  );
}
