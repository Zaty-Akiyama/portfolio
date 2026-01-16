import styles from "./WorkCard.module.css";
import { Project } from "@/types/project";
import { normalizeKana } from "@/utils/normalizedText";

const hiraToKata = (str: string) =>
  str.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );

const kataToHira = (str: string) =>
  str.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );

const escapeRegExp = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

const buildKwVariants = (kw: string) => {
  const raw = kw.trim();
  if (!raw) return [];

  const nfkc = raw.normalize("NFKC");
  const hira = kataToHira(nfkc);
  const kata = hiraToKata(hira);

  // normalizeKana が「カナ→ひら + 小文字化」とかなら、これも拾っておく
  const norm = normalizeKana(raw);
  const normKata = hiraToKata(norm);

  return Array.from(
    new Set([raw, nfkc, hira, kata, norm, normKata].filter(Boolean))
  );
};

type Range = { start: number; end: number };

const mergeRanges = (ranges: Range[]) => {
  if (ranges.length === 0) return [];
  const sorted = [...ranges].sort((a, b) => a.start - b.start);

  const merged: Range[] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = merged[merged.length - 1];
    const cur = sorted[i];

    if (cur.start <= prev.end) {
      prev.end = Math.max(prev.end, cur.end);
    } else {
      merged.push(cur);
    }
  }
  return merged;
};

export function WorkCard({
  project,
  keywords,
}: {
  project: Project;
  keywords?: string[];
}) {
  const markText = (text: string) => {
    if (!keywords || keywords.length === 0) return text;

    const ranges: Range[] = [];

    keywords.forEach((kw) => {
      const variants = buildKwVariants(kw);

      variants.forEach((v) => {
        if (!v) return;
        const re = new RegExp(escapeRegExp(v), "gi");

        let m: RegExpExecArray | null;
        while ((m = re.exec(text)) !== null) {
          ranges.push({ start: m.index, end: m.index + m[0].length });

          // 空文字対策（念のため）
          if (m.index === re.lastIndex) re.lastIndex++;
        }
      });
    });

    const merged = mergeRanges(ranges);
    if (merged.length === 0) return text;

    const nodes: React.ReactNode[] = [];
    let cursor = 0;

    merged.forEach((r, i) => {
      if (cursor < r.start) {
        nodes.push(text.slice(cursor, r.start));
      }
      nodes.push(
        <mark key={`m-${i}`} className={styles.mark}>
          {text.slice(r.start, r.end)}
        </mark>
      );
      cursor = r.end;
    });

    if (cursor < text.length) {
      nodes.push(text.slice(cursor));
    }

    return <span>{nodes}</span>;
  };

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.labels}>
          {project.labels?.map((l) => (
            <span key={l} className={styles.label}>
              {markText(l)}
            </span>
          ))}
          <span className={styles.label}>{markText(project.category)}</span>
        </div>

        <h3 className={styles.title}>{markText(project.title)}</h3>

        <div className={styles.meta}>
          <span>{markText(project.period)}</span>
          <span>／</span>
          <span>{markText(project.role)}</span>
        </div>
      </div>

      <div className={styles.body}>
        {project.summary ? (
          <p className={styles.desc}>
            {project.summary.split(/\r?\n/).map((line, i, arr) => (
              <span key={i}>
                {markText(line)}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        ) : null}

        {project.stack?.length ? (
          <div className={styles.pills}>
            {project.stack.map((s) => (
              <span key={s} className={styles.pill}>
                {markText(s)}
              </span>
            ))}
          </div>
        ) : null}

        {project.links?.length ? (
          <div className={styles.actions}>
            {project.links.map((l) => {
              const external = l.href?.startsWith("http");
              const cls = l.primary ? `${styles.aBtn} ${styles.aBtnPrimary}` : styles.aBtn;

              return (
                <a
                  key={l.label}
                  className={cls}
                  href={l.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                >
                  {l.label}
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    </article>
  );
}
