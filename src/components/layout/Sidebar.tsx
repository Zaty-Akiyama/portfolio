import styles from "./Sidebar.module.css";
import { SidebarProfile } from "./SidebarProfile";
import { SidebarNav } from "./SidebarNav";
import { SidebarSkills } from "./SidebarSkills";
import { SidebarLinks } from "./SidebarLinks";

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandName}>Yuya Akiyama</div>
        <div className={styles.badge}>WORKS</div>
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