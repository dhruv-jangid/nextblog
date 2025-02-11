import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
    staleTimes: {
      static: 30,
      dynamic: 180,
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`,
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
