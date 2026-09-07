import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAIO · Senegal All In One",
  description:
    "SAIO, la porte d’entrée unique vers les services numériques du Sénégal : e-gouvernement, e-éducation, e-santé, e-transport, e-commerce, e-agriculture, e-finances.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
