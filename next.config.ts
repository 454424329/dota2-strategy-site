import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/*": ["./node_modules/.prisma/**/*", "./node_modules/@prisma/**/*", "./node_modules/@auth/**/*", "./node_modules/next-auth/**/*", "./node_modules/prisma/**/*", "./node_modules/jose/**/*", "./node_modules/preact/**/*", "./node_modules/oauth4webapi/**/*", "./node_modules/@prisma/adapter-pg/**/*"],
    "/api/community/**/*": ["./node_modules/.prisma/**/*", "./node_modules/@prisma/**/*"],
    "/community/**/*": ["./node_modules/.prisma/**/*", "./node_modules/@prisma/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.cloudflare.steamstatic.com",
        pathname: "/apps/dota2/images/dota_react/**",
      },
      {
        protocol: "https",
        hostname: "cdn.cloudflare.steamstatic.com",
        pathname: "/apps/dota2/videos/dota_react/**",
      },
    ],
  },
};

export default nextConfig;
