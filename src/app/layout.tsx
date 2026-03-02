import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HAMCODZ Trading Hub | Professional Trading Tools",
  description: "Free professional trading tools by HAMCODZ - Position sizing, risk management, signals tracking, and live market data. Built by a trader from Uganda.",
  keywords: ["trading", "forex", "crypto", "position sizing", "risk management", "signals", "HAMCODZ", "Uganda"],
  authors: [{ name: "HAMCODZ", url: "https://twitter.com/hamcodz" }],
  openGraph: {
    title: "HAMCODZ Trading Hub",
    description: "Professional trading tools - 100% Free, No API Keys Required",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HAMCODZ Trading Hub",
    description: "Professional trading tools - 100% Free",
    creator: "@hamcodz",
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
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
