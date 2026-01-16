const kataToHira = (str: string) => {
  return str.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
};

export const normalizeKana = (str: string) => {
  return kataToHira(str.normalize("NFKC")).toLowerCase();
};