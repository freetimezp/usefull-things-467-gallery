const repo = "usefull-things-467-gallery";

const nextConfig = {
    devIndicators: false,

    output: "export",
    basePath: process.env.NODE_ENV === "production" ? `/${repo}` : "",
    assetPrefix: process.env.NODE_ENV === "production" ? `/${repo}/` : "",
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
