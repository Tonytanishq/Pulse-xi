import type { Metadata, Viewport } from "next";
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
  title: {
    default: "PULSE XI — The Digital Operating System for Modern Football Clubs",
    template: "%s · PULSE XI",
  },
  description:
    "PULSE XI is the futuristic operating system for football clubs — attendance, formations, analytics, and player management in one premium platform. Built for BVRIT FC.",
  applicationName: "PULSE XI",
  keywords: [
    "football club management",
    "attendance",
    "formation builder",
    "BVRIT FC",
    "PULSE XI",
  ],
};

export const viewport: Viewport = {
  themeColor: "#050816",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
