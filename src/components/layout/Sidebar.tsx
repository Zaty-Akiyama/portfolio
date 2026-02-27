'use client';
import styles from "./Sidebar.module.css";
import { SidebarProfile } from "./SidebarProfile";
import { SidebarNav } from "./SidebarNav";
import { SidebarSkills } from "./SidebarSkills";
import { SidebarLinks } from "./SidebarLinks";
import { HamburgerButton } from "@/components/ui/HamburgerButton";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { useAtom } from 'jotai';
import { sidebarOpenAtom } from '@/store/uiAtoms';

export function Sidebar() {
  const [open, setOpen] = useAtom(sidebarOpenAtom);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const sidebar = document.querySelector(`.${styles.sidebar}`);
      if (sidebar) {
        if (height === 0) {
          setHeight(sidebar.scrollHeight + 12);
        } else {
          setHeight(sidebar.scrollHeight + (open ? -11 : 12));
        }
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [height, open]);

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