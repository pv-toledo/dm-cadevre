import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "  *.app.github.dev"]
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "umhhotgarvpcoffgxckz.supabase.co"
      }
    ]
  }
};

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig);
