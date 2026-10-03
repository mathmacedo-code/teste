import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@/components/analytics/Analytics";
import { Providers } from "@/components/Providers";
import { site } from "@/data/site";
import { jost, newsreader } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Vila Medí | Restaurante mediterrâneo no Shopping Cidade Jardim",
    template: "%s | Vila Medí",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "restaurante Cidade Jardim",
    "restaurante Shopping Cidade Jardim",
    "restaurante mediterrâneo São Paulo",
    "restaurante italiano Cidade Jardim",
    "oyster bar São Paulo",
    "Temperani Amalfi",
    "MII Mar",
    "Cru Oyster Bar",
  ],
  openGraph: { siteName: site.name, locale: "pt_BR", type: "website" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#16110C",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${newsreader.variable} ${jost.variable}`}>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
