import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
      // Allow placeholder images / common storage if needed here
      // {
      //   protocol: "https",
      //   hostname: "*.supabase.co", // Future Supabase storage URL
      //   pathname: "/storage/v1/object/public/**",
      // }
    ],
  },
};

export default nextConfig;
