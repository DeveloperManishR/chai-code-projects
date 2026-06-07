import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToastHost } from "@/components/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atelier.example.com"),
  title: {
    default: "Atelier — Curated objects, made with care",
    template: "%s · Atelier",
  },
  description:
    "An independent storefront featuring considered objects from independent makers. Browse collections, discover new arrivals, and bring the quiet into your home.",
  openGraph: {
    title: "Atelier — Curated objects, made with care",
    description:
      "An independent storefront featuring considered objects from independent makers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <ToastHost />
        </CartProvider>
      </body>
    </html>
  );
}
