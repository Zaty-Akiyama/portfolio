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

// 文字を太くする
const replaceBold = (text: string): (string | JSX.Element) => {
  if (!text.includes("**")) return text;

  const targetBoldRegex = /\*\*(.+?)\*\*/g;
  const parts: (string | JSX.Element)[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = targetBoldRegex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = targetBoldRegex.lastIndex;

    // 太字でない部分を追加
    if (lastIndex < matchStart) {
      parts.push(text.slice(lastIndex, matchStart));
    }

    // 太字部分を追加
    parts.push(<strong>{match[1]}</strong>);

    lastIndex = matchEnd;
  }

  // 最後の太字以降の部分を追加
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>
    {parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
      </React.Fragment>
    ))}
  </>
}

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
        {replaceBold(content)}
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

    // 見出し
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushBufferAsParagraph();
      const level = headingMatch[1].length;
      const content = replaceBold(headingMatch[2]);
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

    if (trimmedLine.match(/^(\s*[-*+]\s+.+|\s*(\d+)\.\s+.+)/)) {
      flushBufferAsParagraph();
      transformedHTML.push(transformListHTML(trimmedLine));
      return;
    }

    buffer.push(replaceBold(trimmedLine));
  });

  flushBufferAsParagraph();

  return transformedHTML;
}