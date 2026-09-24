import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // <-- 1. Importamos el Footer
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guía Comercial Vecinal",
  description: "Califica y descubre los pequeños negocios de nuestra ciudad de forma transparente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col text-gray-900`}>
        {/* Navbar superior */}
        <Navbar />
        
        {/* Contenido principal flexible para empujar el footer hacia abajo */}
        <div className="flex-grow">
          {children}
        </div>
        
        {/* NUEVO: Footer global al fondo de la pantalla */}
        <Footer />
      </body>
    </html>
  );
}
