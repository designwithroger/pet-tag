import type { Metadata } from "next";
import localFont from "next/font/local";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const clashSemibold = localFont({
  src: "./fonts/ClashDisplay-Semibold.woff2",
  variable: "--font-clash-semibold",
  weight: "600",
  display: "swap",
});

const clashRegular = localFont({
  src: "./fonts/ClashDisplay-Regular.woff2",
  variable: "--font-clash-regular",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pet Tag",
  description: "Crea el perfil NFC de tu mascota y genera su link.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${clashSemibold.variable} ${clashRegular.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans overflow-x-hidden">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
