import { Cormorant_Garamond, Manrope } from "next/font/google";

export const atelierDisplay = Manrope({
  subsets: ["latin"],
  variable: "--font-atelier-display",
  display: "swap",
});

export const atelierSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
  variable: "--font-atelier-serif",
  display: "swap",
});
