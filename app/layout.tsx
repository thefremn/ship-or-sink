import type { Metadata } from "next";
import { Cinzel, Crimson_Text, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-cinzel" });
const crimson = Crimson_Text({ subsets: ["latin"], weight: ["400"], style: ["italic"], variable: "--font-crimson" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "FREMN Oracle — Prescience for your decisions",
  description: "An AI-powered decision advisor in the voice of the Kwisatz Haderach.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${crimson.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
