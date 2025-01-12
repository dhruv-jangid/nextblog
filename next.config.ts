import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
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
