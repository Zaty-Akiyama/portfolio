import type { NextConfig } from "next";

const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const trimmed = raw.replace(/^\/|\/$/g, ""); // 先頭/末尾の / を除去
const basePath = trimmed ? `/${trimmed}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
};

export default nextConfig;
