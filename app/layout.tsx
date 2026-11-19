import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Upwork Jobs | Webethics Solutions",
  description: "Internal AI-rated Upwork jobs dashboard for Webethics Solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-[#3C4043]">
        <Header />
        <main className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
