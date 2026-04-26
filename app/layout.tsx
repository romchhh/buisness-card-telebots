import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://telebots.site"),
  title: {
    default: "Telebots — Bots & Web Systems",
    template: "%s | Telebots",
  },
  description:
    "Telebots builds chatbots, landing pages, and complex web systems: design, development, integrations, and post-launch support.",
  applicationName: "Telebots",
  keywords: [
    "chatbot development",
    "web development",
    "landing page development",
    "telegram bots",
    "custom web systems",
    "ui ux design",
    "telebots",
  ],
  authors: [{ name: "Telebots", url: "https://telebots.site" }],
  creator: "Telebots",
  publisher: "Telebots",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://telebots.site",
    siteName: "Telebots",
    title: "Telebots — Bots & Web Systems",
    description:
      "From landing pages to complex web systems: bots, websites, integrations, and long-term technical support.",
    images: [
      {
        url: "/Group 1000007124.png",
        width: 1200,
        height: 630,
        alt: "Telebots portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Telebots — Bots & Web Systems",
    description:
      "From landing pages to complex web systems: bots, websites, integrations, and support.",
    images: ["/Group 1000007124.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
