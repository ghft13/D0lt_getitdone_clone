"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { BookingProvider } from "@/contexts/booking-context";
import { CartProvider } from "@/contexts/cart-context";
import { LanguageProvider } from "@/contexts/language-context";
import ChatWidget from "@/components/chat-widget";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
