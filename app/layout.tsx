// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/site/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calorice — suivi nutrition & musculation",
  description:
    "Calorice : calcule tes calories, suis tes macros et tes entraînements avec une interface simple et rapide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-dvh flex flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
