import { cn } from "@/utils/cn";
import styles from "./Header.module.css";

export function Header(
  { children, isFixed = false, className = "" }:
  { children: React.ReactNode; isFixed?: boolean; className?: string }
) {
  return (
    <header className={cn(className, isFixed && styles.fixed, styles.header)}>
      {children}
    </header>
  );
}