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
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
    ],
    dangerouslyAllowSVG: true,
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 128, 256, 384],
  },
};

export default nextConfig;
