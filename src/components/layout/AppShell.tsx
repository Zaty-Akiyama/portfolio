import styles from "./AppShell.module.css";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.app}>
      <Sidebar />
      <main className={styles.main}>
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