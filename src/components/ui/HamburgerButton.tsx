import { cn } from "@/utils/cn";
import styles from "./HamburgerButton.module.css";

export function HamburgerButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="menu"
      className={cn(styles.button, open && styles.open)}
    >
      <span className={styles.line}></span>
      <span className={styles.line}></span>
      <span className={styles.line}></span>
      <span className={styles.menuText}>Menu</span>
    </button>
  );
}
