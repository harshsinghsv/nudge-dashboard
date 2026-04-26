import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nudge Merchant Dashboard",
  description: "Manage your Nudge offers and rules",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FAFAF8] text-[#1A1A18] min-h-screen antialiased`}>
        <Providers>
          <Nav />
          <main className="max-w-[1200px] mx-auto p-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
