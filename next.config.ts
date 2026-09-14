import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `GOOGLE_MAPS_API_KEY` is set unprefixed in Vercel, but the Places SDK runs in
  // the browser (PlacesAutocompleteField is a client component). This inlines the
  // value into the client bundle at build time, the same way a NEXT_PUBLIC_ var
  // would. The key is public either way — restrict it by HTTP referrer in the
  // Google Cloud Console.
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dckyndryf/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dp4cbs8c2/**',
      },
    ],
  },
};

export default nextConfig;
