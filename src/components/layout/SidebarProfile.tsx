import Image from "next/image";
import styles from "./SidebarProfile.module.css";
import myIcon from "@/app/myIcon.jpeg";


export function SidebarProfile() {
  return (
    <section className={styles.profile}>
      <div className={styles.top}>
        <div className={styles.avatar}>
          <Image src={myIcon} alt="秋山 雄哉" className={styles.avatarImage} />
        </div>
        <div>
          <div className={styles.name}>秋山 雄哉</div>
          <div className={styles.role}>Frontend / Backend Engineer</div>
        </div>
      </div>
      <p className={styles.desc}>
        制作実績（Web制作 / 開発 / 基幹システム運用保守）を中心に、設計→開発→運用まで一貫して支援しています。NDA案件は要点のみ掲載しています。
      </p>
    </section>
  );
}
