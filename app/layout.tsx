// app/layout.tsx
import type { Metadata } from "next";
import "./global.css"; // Singular, as provided
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AuthProvider } from "@/contexts/auth-context";
import { BookingProvider } from "@/contexts/booking-context";
import { CartProvider } from "@/contexts/cart-context";
import { LanguageProvider } from "@/contexts/language-context";
import ChatWidget from "@/components/chat-widget";

export const metadata: Metadata = {
  title: "DOLT - Smart Maintenance Solutions",
  description: "Professional maintenance services powered by IoT technology across Latin America",
  generator: "Nasir",
  openGraph: {
    title: "DOLT - Smart Maintenance Solutions",
    description: "Professional maintenance services powered by IoT technology across Latin America",
    images: [
      {
        url: "/images/logo/D_Black.png",
        width: 1200,
        height: 630,
        alt: "DOLT Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DOLT - Smart Maintenance Solutions",
    description: "Professional maintenance services powered by IoT technology across Latin America",
    images: ["/images/logo/D_Black.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased bg-background text-foreground">
        <LanguageProvider>
          <AuthProvider>
            <BookingProvider>
              <CartProvider>
                {children}
                <ChatWidget />
              </CartProvider>
            </BookingProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}