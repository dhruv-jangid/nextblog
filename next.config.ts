import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      static: 30,
      dynamic: 180,
    },
  },
};

module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dkzj1yg2n/**",
        search: "?_a=BAVAZGBz0",
      },
    ],
  },
};

export default nextConfig;
