import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { AuthProvider } from "@/contexts/auth-context";
import { BookingProvider } from "@/contexts/booking-context";
import { CartProvider } from "@/contexts/cart-context";
import { LanguageProvider } from "@/contexts/language-context";
import ChatWidget from "@/components/chat-widget";
import WhatsAppButton from "@/components/whatsapp-button";

export const metadata: Metadata = {
  title: "DOLT - Smart Maintenance Solutions",
  description:
    "Professional maintenance services powered by IoT technology across Latin America",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <LanguageProvider>
          <AuthProvider>
            <BookingProvider>
              <CartProvider>
                {children}
                <ChatWidget />
                <WhatsAppButton />
              </CartProvider>
            </BookingProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
