import fs from "fs/promises";
import path from "node:path";

export async function readMd(filePath: string): Promise<string> {
  const mdPath = path.join(process.cwd(), "public", "pages", filePath);
  return await fs.readFile(mdPath, "utf8");
}