import styles from "./SidebarProfile.module.css";

export function SidebarProfile() {
  return (
    <section className={styles.profile}>
      <div className={styles.top}>
        <div className={styles.avatar}>Photo</div>
        <div>
          <div className={styles.name}>秋山 雄哉</div>
          <div className={styles.role}>Frontend / Backend Engineer</div>
        </div>
      </div>
      <p className={styles.desc}>
        制作実績（Web / WordPress / Shopify / 基幹システム）を中心に、課題→施策→運用まで一貫して支援。NDA案件は要点のみ掲載。
      </p>
    </section>
  );
}
