import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.idealista.com', // <--- ESTA LÍNEA AUTORIZA TODO IDEALISTA
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "rxtxtuokrdvevmvhxewr.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

