import type { NextConfig } from "next";

// При билде в GitHub Actions автоматически устанавливаем basePath/assetPrefix
const isActions = Boolean(process.env.GITHUB_ACTIONS);
const repoName = process.env.GITHUB_REPOSITORY?.split("/")?.[1] || "yourruletube";

const nextConfig: NextConfig = {
  output: "export", // включаем статический экспорт
  basePath: isActions ? `/${repoName}` : undefined,
  assetPrefix: isActions ? `/${repoName}/` : undefined,
  trailingSlash: true, // удобнее для статического экспорта на GitHub Pages
};

export default nextConfig;

