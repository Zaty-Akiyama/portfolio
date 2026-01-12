'use client';
import styles from "./Sidebar.module.css";
import { SidebarProfile } from "./SidebarProfile";
import { SidebarNav, items } from "./SidebarNav";
import { SidebarSkills } from "./SidebarSkills";
import { SidebarLinks } from "./SidebarLinks";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const badgeLabel = items.find((it) => {
    return pathname.match(new RegExp(`^${it.href}(/|$)`)) !== null;
  });

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandName}>Yuya Akiyama</div>
        <div className={styles.badge}>{badgeLabel?.label}</div>
      </div>
      <SidebarProfile />
      <div className={styles.content}>
        <SidebarNav />
        <SidebarSkills />
        <SidebarLinks />
      </div>
    </aside>
  );
}