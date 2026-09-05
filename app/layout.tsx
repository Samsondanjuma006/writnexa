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
  metadataBase: new URL("https://writnexa.vercel.app"),
  title: {
    default: "Writnexa — Your AI Writing Studio",
    template: "%s | Writnexa",
  },
  description:
    "Writnexa helps you turn ideas into polished blogs, social posts, scripts, emails, proposals, and more with AI.",
  applicationName: "Writnexa",
  keywords: [
    "AI writing",
    "AI writing assistant",
    "AI content generator",
    "writing studio",
    "content creation",
  ],
  openGraph: {
    title: "Writnexa — Your AI Writing Studio",
    description:
      "Turn ideas into polished content with Writnexa, your AI writing studio.",
    url: "https://writnexa.vercel.app",
    siteName: "Writnexa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writnexa — Your AI Writing Studio",
    description:
      "Turn ideas into polished content with Writnexa, your AI writing studio.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
