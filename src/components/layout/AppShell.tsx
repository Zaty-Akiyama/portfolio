'use client';

import { useEffect, useState } from "react";
import styles from "./AppShell.module.css";
import { Sidebar } from "./Sidebar";
import { useAtomValue } from "jotai";
import { sidebarOpenAtom } from "@/store/uiAtoms";
import { cn } from "@/utils/cn";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [tmpScrollY, setTmpScrollY] = useState(-56);
  const open = useAtomValue(sidebarOpenAtom);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY - 56;
      if (currentScrollY > tmpScrollY || open || currentScrollY <= 0) {
        setIsHeaderVisible(true);
      } else {
        setIsHeaderVisible(false);
      }
      setTmpScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tmpScrollY, open]);

  return (
    <div className={styles.app} style={{ "--sp-header-height": "56px", "--sp-header-visible": isHeaderVisible ? "1" : "0" } as React.CSSProperties}>
      <Sidebar />
      <main className={cn(styles.main, isHeaderVisible && styles.isHeaderVisible)}>
        <div className={styles.content}>
          {children}
        </div>
        <footer className={styles.footer}>
          <div>© Yuya Akiyama</div>
          <div className={styles.footerNote}>最終更新: 2026年01月05日</div>
        </footer>
      </main>
    </div>
  );
}