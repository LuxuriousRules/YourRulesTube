import type { NextConfig } from "next";

const isActions = Boolean(process.env.GITHUB_ACTIONS);
const repoName = process.env.GITHUB_REPOSITORY?.split("/")?.[1] || "yourruletube";

const nextConfig: NextConfig = {
  // ❌ убрали output: "export", чтобы не ломать SSR и API
  trailingSlash: false, // можно оставить по умолчанию
  // basePath и assetPrefix нужны только для GitHub Pages, на Vercel они не требуются
};

export default nextConfig;


