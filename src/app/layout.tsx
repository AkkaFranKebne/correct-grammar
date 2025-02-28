import type { Metadata } from "next"; // used to define the metadata for the Next.js application.
import { Geist, Geist_Mono } from "next/font/google"; // used to load Google Fonts
import StoryblokProvider from "@/components/storyblok/StoryblokProvider";
import "./globals.css";

/*
In Next.js, the layout.tsx file is used to define the layout of your application. 
It typically includes components and elements that should be present on every page, such as headers, footers, and global styles.
*/

// initialize the Geist Sans and Geist Mono fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Automatic Metadata Handling: Next.js automatically handles the metadata you export from your layout or page files. You don't need to manually implement it anywhere else in your code.
export const metadata: Metadata = {
  title: {
    default: "Correct Grammar",
    template: "%s | Correct Grammar",
  },
  description: "Improve your writing with our AI-powered grammar checker",
  keywords: ["grammar", "spelling", "writing", "AI", "language"],
  authors: [{ name: "Your Name" }],
  creator: "Your Company Name",
  publisher: "Your Company Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "Grammar Checker",
    title: "Grammar Checker - Improve Your Writing",
    description:
      "Enhance your writing with our AI-powered grammar and spelling checker",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Grammar Checker OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grammar Checker - Improve Your Writing",
    description:
      "Enhance your writing with our AI-powered grammar and spelling checker",
    images: ["https://your-domain.com/twitter-image.jpg"],
    creator: "@YourTwitterHandle",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

// component is wrapped in Readonly to make it immutable
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoryblokProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </StoryblokProvider>
    </html>
  );
}
