import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true, // оставляем, как у тебя было
  output: 'export', // важная строчка для статического экспорта
  images: {
    unoptimized: true, // чтобы Netlify нормально отрабатывал картинки
  },
};

export default nextConfig;
