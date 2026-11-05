import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Detecta caídas de conexión y reintenta navegaciones y Server Actions
    // automáticamente cuando vuelve el internet.
    useOffline: true,
  },
  images: {
    // Fotos de reseñas guardadas en Supabase Storage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // El service worker nunca debe quedar cacheado por el navegador ni
        // por la CDN: así las actualizaciones llegan de inmediato.
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Content-Type",
            value: "application/manifest+json; charset=utf-8",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
