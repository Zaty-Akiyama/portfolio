import { cn } from "@/utils/cn";
import styles from "./SimpleButton.module.css";

interface SimpleButtonProps {
  type?: 'basic' | 'primary' | 'danger' | 'light';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function SimpleButton({
  onClick,
  children,
  type = 'basic',
  disabled = false,
}: SimpleButtonProps) {

  const classNames = [styles.button, styles[type]];
  if ( disabled ) {
    classNames.push(styles.disabled);
  }

  return (
    <button
      className={cn(...classNames)}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}