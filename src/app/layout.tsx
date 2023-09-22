import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import "@picocss/pico";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rent Record Analyser",
  description: "A Simple House Rent Record Analyser",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
