/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "development";
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  swcMinify: true,
  basePath: "",
  assetPrefix: "",
  images: isProd ? { loader: "imgix", path: "/" } : { unoptimized: true },
};

module.exports = nextConfig;
