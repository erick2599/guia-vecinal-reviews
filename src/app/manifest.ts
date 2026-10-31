import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Guía Comercial Vecinal",
    short_name: "GuíaVecinal",
    description:
      "Descubre, califica y apoya a los pequeños negocios de tu ciudad. Funciona incluso sin conexión.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait",
    background_color: "#f9fafb",
    theme_color: "#4f46e5",
    lang: "es",
    dir: "ltr",
    categories: ["shopping", "business", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Escribir una reseña",
        short_name: "Reseñar",
        description: "Publica tu experiencia o registra tu negocio",
        url: "/reportar",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Buscar negocios",
        short_name: "Buscar",
        description: "Explora los negocios de tu barrio",
        url: "/",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
