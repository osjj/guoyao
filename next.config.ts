import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return ["/admin/:path*", "/api/:path*", "/healthz"].map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.guoyaometal.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "media.glarivoglass.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
