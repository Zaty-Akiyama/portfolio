"use client";

import Link from "next/link";
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
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className={styles.nav} aria-label="sidebar">
      <div className={styles.title}>Navigate</div>

      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={isCurrent(it.href) ? styles.active : ""}
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
