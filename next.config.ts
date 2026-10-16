import type { NextConfig } from "next";

const repo = "usefull-things-467-gallery";

const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? `/${repo}` : "";

const nextConfig: NextConfig = {
    devIndicators: false,

    output: "export",
    basePath,
    assetPrefix: isProduction ? `${basePath}/` : "",

    env: {
        NEXT_PUBLIC_BASE_PATH: basePath,
    },

    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
