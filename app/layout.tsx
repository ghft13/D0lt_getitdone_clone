// app/layout.tsx
import type { Metadata } from "next";
import "./global.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "./providers"; // ✅ import here

export const metadata: Metadata = {
  title: "DOLT - Smart Maintenance Solutions",
  description: "Professional maintenance services powered by IoT technology across Latin America",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased bg-background text-foreground">
        <Providers>{children}</Providers> {/* ✅ Wrapped here */}
      </body>
    </html>
  );
}
