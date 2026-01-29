import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Janmira Jewellery | Exquisite Handcrafted Luxury in Kerala, India",
  description: "Discover Janmira's exclusive collection of contemporary heritage jewellery. Handcrafted in Kerala, India, our pieces blend timeless elegance with modern luxury. Shine your legacy.",
  keywords: ["Janmira Jewellery", "Luxury Jewellery India", "Jewellery in Kerala", "Handcrafted Gold Jewellery", "Contemporary Heritage", "Designer Jewellery", "Indian Jewellery Brand"],
  openGraph: {
    title: "Janmira Jewellery | Shine Your Legacy",
    description: "Premium contemporary jewellery blending timeless elegance with modern luxury. Handcrafted in Kerala.",
    url: "https://janmira.in",
    siteName: "Janmira",
    images: [
      {
        url: "/janmira-logo.png", // Assuming this resolves to the public image
        width: 800,
        height: 600,
        alt: "Janmira Jewellery Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Janmira Jewellery | Shine Your Legacy",
    description: "Premium contemporary jewellery blending timeless elegance with modern luxury. Handcrafted in Kerala.",
    images: ["/janmira-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "name": "Janmira Jewellery",
    "image": "https://janmira.in/janmira-logo.png",
    "description": "Premium contemporary jewellery blending timeless elegance with modern luxury.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kerala",
      "addressCountry": "IN"
    },
    "url": "https://janmira.in",
    "sameAs": [
      "https://www.instagram.com/janmira.in/"
    ]
  };

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-black text-foreground`}
      >
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
