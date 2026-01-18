import React, {JSX} from "react";

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

// インライン要素の置換
const replaceMap = {
  "bold": {
    check: (text: string) => text.includes("**"),
    regex: /\*\*(.+?)\*\*/g,
    htmlTag: "strong",
  },
  "code": {
    check: (text: string) => text.match(/`(.+?)`/),
    regex: /`(.+?)`/g,
    htmlTag: "code",
  },
};
const replaceInlineElements = (text: string): (string | JSX.Element) => {
  if  (!Object.values(replaceMap).some(r => r.check(text))) {
    return text;
  }

  const parts: (string | JSX.Element)[] = [];

  let cursor = 0;

  const combinedRegex = new RegExp(
    Object.values(replaceMap)
      .map(r => r.regex.source)
      .join("|"),
    "g"
  );

  let match: RegExpExecArray | null;
  while ((match = combinedRegex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = combinedRegex.lastIndex;

    // 置換対象でない部分を追加
    if (cursor < matchStart) {
      parts.push(text.slice(cursor, matchStart));
    }

    // 置換対象部分を追加
    for (let i = 1; i < match.length; i++) {
      if (match[i]) {
        const replaceEntry = Object.values(replaceMap)[i - 1];
        const Tag = replaceEntry.htmlTag as keyof JSX.IntrinsicElements;
        parts.push(<Tag>{match[i]}</Tag>);
        break;
      }
    }

    cursor = matchEnd;
  }

  // 最後の置換以降の部分を追加
  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return <>
    {parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
      </React.Fragment>
    ))}
  </>
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

export function TransformMarkDown(
  { markdown }:
  { markdown: string }
) {
  const transformedHTML = [] as React.ReactNode[];
  const lines = splitLines(markdown);

  let buffer = [] as (string | JSX.Element)[];

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