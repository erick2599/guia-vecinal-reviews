import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import OfflineBanner from "@/components/OfflineBanner";
import InstallPrompt from "@/components/InstallPrompt";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://guiacomercialcomunitaria.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "GuíaVecinal",
  title: {
    default: "Guía Comercial Vecinal",
    template: "%s | GuíaVecinal",
  },
  description:
    "Califica y descubre los pequeños negocios de nuestra ciudad de forma transparente. Instálala en tu celular y úsala sin conexión.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "GuíaVecinal",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    // Safari/iOS siguen usando esta etiqueta para abrir sin barra de navegador.
    "apple-mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "es_SV",
    siteName: "Guía Comercial Vecinal",
    title: "Guía Comercial Vecinal",
    description:
      "Descubre y califica los pequeños negocios de tu ciudad. Disponible como app en tu celular.",
    images: ["/icons/icon-512.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4f46e5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col text-gray-900`}>
        {/* Registro del service worker para que la app funcione sin conexión */}
        <ServiceWorkerRegister />

        {/* Aviso cuando el celular pierde la conexión */}
        <OfflineBanner />

        {/* Navbar superior */}
        <Navbar />

        {/* Contenido principal flexible para empujar el footer hacia abajo */}
        <div className="flex-grow">
          {children}
        </div>

        {/* NUEVO: Footer global al fondo de la pantalla */}
        <Footer />

        {/* Invitación a instalar la app como si fuera nativa */}
        <InstallPrompt />
      </body>
    </html>
  );
}
