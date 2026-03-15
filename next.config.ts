import type { NextConfig } from "next";

const isGhPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGhPages ? "/paraflux" : "",
  assetPrefix: isGhPages ? "/paraflux/" : "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
