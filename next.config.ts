import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'souhaygiitgemoplvwnl.supabase.co',
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: false,
  },
};

export default nextConfig;
