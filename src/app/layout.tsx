import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "ProfitPath — Free AI Tools for Side Hustlers & Creators",
    template: "%s | ProfitPath",
  },
  description:
    "Free AI-powered tools for side hustlers, freelancers, and content creators. Generate viral videos, calculate profits, create YouTube titles, and more.",
  metadataBase: new URL("https://profitpath.online"),
  manifest: "/manifest.json",
  openGraph: {
    siteName: "ProfitPath",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "ProfitPath — Free AI Tools for Creators & Side Hustlers" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="3FRlZhHrr4tpxcVvhSXCfbwGm9yoq8iHOCC8jP0tFv8" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1L75F73Y5L" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-1L75F73Y5L');`,
          }}
        />
        <link rel="icon" href="/images/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/favicon.png" />
      </head>
      <body
        className={`${inter.variable} ${jakarta.variable} font-sans antialiased bg-surface-50 text-surface-900`}
      >
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
