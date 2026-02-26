'use client';
import styles from "./Sidebar.module.css";
import { SidebarProfile } from "./SidebarProfile";
import { SidebarNav } from "./SidebarNav";
import { SidebarSkills } from "./SidebarSkills";
import { SidebarLinks } from "./SidebarLinks";
import { HamburgerButton } from "@/components/ui/HamburgerButton";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const sidebar = document.querySelector(`.${styles.sidebar}`);
      if (sidebar) {
        setHeight(sidebar.scrollHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <aside className={cn(styles.sidebar, open && styles.open)} style={{ '--height': `${height}px` } as React.CSSProperties} aria-label="sidebar">
      <div className={styles.brand}>
        <div className={styles.brandName}>Yuya Akiyama</div>
        <div className={styles.hamburgerButton}>
          <HamburgerButton
            open={open}
            onClick={() => setOpen(!open)}
          />
        </div>
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