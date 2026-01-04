import styles from "./SearchBox.module.css";

export function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className={styles.search} aria-label="search">
      <span className={styles.hint}>⌘K</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="Search (e.g. WordPress, Laravel, Shopify...)"
      />
    </label>
  );
}
