import type { NextConfig } from "next";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
if (!cloudName) {
  throw new Error("Cloudinary cloud name env required");
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
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
        pathname: `/${cloudName}/**`,
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
