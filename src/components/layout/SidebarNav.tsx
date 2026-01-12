'use client';
import { usePathname } from "next/navigation";
import styles from "./SidebarNav.module.css";

export const items = [
  { href: "/", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SidebarNav() {
  const pathname = usePathname();

  const isCurrent = (href: string) => {
    return pathname.match(new RegExp(`^${href}(/|$)`)) !== null;
  };

  return (
    <nav className={styles.nav} aria-label="sidebar">
      <div className={styles.title}>Navigate</div>
      {items.map((it) => (
        <a key={it.href} href={it.href} className={isCurrent(it.href) ? styles.active : undefined}>
          {it.label}
        </a>
      ))}
    </nav>
  );
}
