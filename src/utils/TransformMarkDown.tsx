import React from "react";
import Link from "next/link";

// markdownの各行を切り分ける
const splitLines = (markdown: string) => {
  let splitLines = markdown.split("\n");

  let skipLineNumber = null as number | null;
  const returnLines = [] as string[];

  splitLines.forEach((line, index) => {
    if (skipLineNumber !== null && index <= skipLineNumber) {
      return;
    }

    // コードブロックと引用の処理
    if (line.startsWith("```") || line.startsWith(">")) {
      returnLines[index] = `${line}\n`;
      const isCodeBlock = line.startsWith("```");
      const isBlockQuote = line.startsWith(">");

      for (let i = index + 1; i < splitLines.length; i++) {
        const currentLine = splitLines[i];

        returnLines[index] += `\n${currentLine}`;
        skipLineNumber = i;
        if (
          isCodeBlock && currentLine.endsWith("```") ||
          isBlockQuote && !currentLine.startsWith(">")
        ) {
          break;
        }

        if (i === splitLines.length) {
          console.warn("コードブロックの終了が見つかりませんでした。");
        }
      }

      return;
    }


    // リストの処理
    if (line.match(/^(\s*[-*+]\s+.+|\s*(\d+)\.\s+.+)$/)) {
      returnLines[index] = line;
      for (let i = index + 1; i < splitLines.length; i++) {
        const currentLine = splitLines[i];
        if (currentLine.match(/^(\s*[-*+]\s+.+|\s*(\d+)\.\s+.+)$/)) {
          returnLines[index] += `\n${currentLine}`;
          skipLineNumber = i;
        } else {
          break;
        }
      }
      return;
    }

    returnLines.push(line);
  });
  return returnLines;
}

const splitListItems = (listContent: string) => {
  let splitLines = listContent.split("\n");
  
  // リストの階層対応するためのインデント記録用
  let firstListIndent = null as number | null;

  let skipLineNumber = null as number | null;
  const returnLines = [] as string[];

  splitLines.forEach((line, index) => {
    if (skipLineNumber !== null && index <= skipLineNumber) {
      return;
    }

    if (firstListIndent === null) {
      const match = line.match(/^(\s*)/);
      firstListIndent = match ? match[1].length : 0;
    }

    returnLines[index] = line;
    for (let i = index + 1; i < splitLines.length; i++) {
      const currentLine = splitLines[i];
      if (currentLine.match(
        new RegExp(`^\\s{${firstListIndent+2},}([-*+]\\s+.+|(\\d+)\\.\\s+.+)$`)
      )) {
        returnLines[index] += `\n${currentLine}`;
        skipLineNumber = i;
      } else {
        break;
      }
    }
  });

  return returnLines;
}

type Rule = {
  name: string;
  regex: RegExp;
  render: (m: RegExpExecArray) => React.ReactNode;
};

const rules: Rule[] = [
  {
    name: "bold",
    regex: /^\*\*(.+?)\*\*$/,
    render: (m) => <strong>{m[1]}</strong>,
  },
  {
    name: "code",
    regex: /^`(.+?)`$/,
    render: (m) => <code>{m[1]}</code>,
  },
  {
    name: "italic",
    regex: /^_(.+?)_$/,
    render: (m) => <em>{m[1]}</em>,
  },
  {
    name: "underline",
    regex: /^~~(.+?)~~$/,
    render: (m) => <u>{m[1]}</u>,
  },
  {
    name: "link",
    regex: /^\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\)$/,
    render: (m) => (
      <a href={m[2]} target="_blank" rel="noreferrer">
        {m[1]}
      </a>
    ),
  },
  {
    name: "nextLink",
    regex: /^\[([^\]]+?)\]\((\/[^\s)]+)\)$/,
    render: (m) => <Link href={m[2]}>{m[1]}</Link>,
  },
];

const combined = new RegExp(
  rules.map((r) => `(?<${r.name}>${r.regex.source.slice(1, -1)})`).join("|"),
  "g"
);

export const replaceInlineElements = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  let match: RegExpExecArray | null;
  while ((match = combined.exec(text)) !== null) {
    const start = match.index;
    const end = combined.lastIndex;

    if (cursor < start) {
      parts.push(text.slice(cursor, start));
    }

    const full = text.slice(start, end);

    const groups = (match as any).groups as Record<string, string> | undefined;
    const hitName = groups ? Object.keys(groups).find((k) => groups[k] !== undefined) : undefined;

    if (!hitName) {
      parts.push(full);
      cursor = end;
      continue;
    }

    const rule = rules.find((r) => r.name === hitName);
    if (!rule) {
      parts.push(full);
      cursor = end;
      continue;
    }

    const m = rule.regex.exec(full);
    if (!m) {
      parts.push(full);
      cursor = end;
      continue;
    }

    parts.push(rule.render(m));
    cursor = end;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return (
    <>
      {parts.map((p, i) => (
        <React.Fragment key={i}>{p}</React.Fragment>
      ))}
    </>
  );
};

/**
 * 行の前後の不要な空白とエスケープ文字を削除する
 * リストの場合はインデントを保持する
 * 
 * @param line 
 */
const trimLine = (line: string) => {
  return line
    .replace(/\\([\\`*_{}[\]()#+\-.!])/g, "$1")
    .replace(/^(?!\s*([-\*+]|(\d+)\.))\s+/gm, "")
    .replace(/\s+$/, "")
}

/**
 * ul, olのHTMLを生成する
 * @param paramLine
 * @param indent
 */
const transformListHTML = (paramLine: string, indent: number = 0): React.ReactNode => {
  const isOrdered = Boolean(paramLine.trim().match(/^\d+\./));
  const ListTag = isOrdered ? "ol" : "ul";

  const lines = splitListItems(paramLine);

  const nextIndent = indent + 2;
  const nextMatch = new RegExp(
    `\n(\\s{${nextIndent},}[-*+]\\s+.+|\\s{${nextIndent},}(\\d+)\\.\\s+.+)`
  );

  const listElements = lines.map((line, index) => {
    const firstLine = line.split("\n")[0] ?? "";
    const trimmedFirst = firstLine.trim();

    const content = trimmedFirst.replace(/^([-*+]|(\d+)\.)\s+/, "");

    let subList: React.ReactNode = null;

    if (nextMatch.test(line)) {
      const subListContent = line.replace(/^[^\n]*\n/, "");
      subList = transformListHTML(subListContent, nextIndent);
    }

    return (
      <li key={index}>
        {replaceInlineElements(content)}
        {subList}
      </li>
    );
  });

  return <ListTag>{listElements}</ListTag>;
};

/**
 * マークダウンをReactノードに変換する
 * @param markdown 
 * @returns React.ReactNode[]
 */
export function TransformMarkDown(
  { markdown }:
  { markdown: string }
) {
  const transformedHTML = [] as React.ReactNode[];
  const lines = splitLines(markdown);

  let buffer = [] as (string | React.ReactNode)[];

  const flushBufferAsParagraph = () => {
    if (buffer.length > 0) {
      transformedHTML.push(
        <p>
          {buffer.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < buffer.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
      buffer = [];
    }
  };

  lines.forEach((line) => {
    let trimmedLine = trimLine(line);

    // コードブロック
    if (trimmedLine.startsWith("```") && trimmedLine.endsWith("```")) {
      flushBufferAsParagraph();
      const codeContent = trimmedLine.slice(3, -3).trim();
      transformedHTML.push(
        <pre>
          <code>{codeContent}</code>
        </pre>
      );
      return;
    }

    // 引用
    if (trimmedLine.startsWith(">")) {
      flushBufferAsParagraph();
      const quoteContent = trimmedLine
        .split("\n")
        .map((l) => l.replace(/^>\s?/, ""))
        .join("\n");
      transformedHTML.push(
        <blockquote>
          <React.Fragment>
            {TransformMarkDown({ markdown: quoteContent })}
          </React.Fragment>
        </blockquote>
      );
      return;
    }

    // 見出し
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushBufferAsParagraph();
      const level = headingMatch[1].length;
      const content = replaceInlineElements(headingMatch[2]);
      transformedHTML.push(React.createElement(`h${level}`, {}, content));
      return;
    }

    // 段落
    if (trimmedLine === "") {
      flushBufferAsParagraph();
      return;
    }
        
    // 水平線
    if (trimmedLine.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
      flushBufferAsParagraph();
      transformedHTML.push(<hr />);
      return;
    }

    // リスト
    if (trimmedLine.match(/^(\s*[-*+]\s+.+|\s*(\d+)\.\s+.+)/)) {
      flushBufferAsParagraph();
      transformedHTML.push(transformListHTML(trimmedLine));
      return;
    }

    buffer.push(replaceInlineElements(trimmedLine));
  });

  flushBufferAsParagraph();

  return transformedHTML;
}