import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tundra-backend-s3.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tundra-backend-s3.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
export default nextConfig;