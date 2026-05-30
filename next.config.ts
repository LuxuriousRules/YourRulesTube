import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // включаем статический экспорт
  basePath: "/yourruletube", // путь для GitHub Pages (должен совпадать с именем репозитория)
  assetPrefix: "/yourruletube/", // префикс для статических файлов
};

export default nextConfig;

