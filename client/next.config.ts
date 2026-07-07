import type { NextConfig } from "next";

const remotePatterns: NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> = [
  {
    protocol: "http",
    hostname: "localhost",
    port: "8000",
    pathname: "/cover/**",
  },
];

if (process.env.NEXT_PUBLIC_ASSETS_BASE_URL) {
  const assetsUrl = new URL(process.env.NEXT_PUBLIC_ASSETS_BASE_URL);
  remotePatterns.push({
    protocol: assetsUrl.protocol.replace(":", "") as "http" | "https",
    hostname: assetsUrl.hostname,
    port: assetsUrl.port,
    pathname: "/cover/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/embed/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
