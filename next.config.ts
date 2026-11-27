import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/case-studies/tiffany-boutique-backlit-facade",
        destination: "/case-studies/backlit-fluted-metal-boutique-facade",
        permanent: true,
      },
      {
        source: "/case-studies/lancome-boutique-entrance-pavilion",
        destination: "/case-studies/elliptical-curved-metal-entrance-pavilion",
        permanent: true,
      },
      {
        source: "/case-studies/fluted-escalator-cladding-uk-office-tower",
        destination: "/case-studies/curved-fluted-escalator-atrium-cladding",
        permanent: true,
      },
      {
        source: "/case-studies/victorias-secret-flagship-helical-staircase",
        destination: "/case-studies/helical-metal-feature-staircase",
        permanent: true,
      },
    ];
  },
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
