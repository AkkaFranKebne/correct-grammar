import type { Metadata } from "next"; // used to define the metadata for the Next.js application.
import { Geist, Geist_Mono } from "next/font/google"; // used to load Google Fonts
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

// define the metadata for the Next.js application header
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// component is wrapped in Readonly to make it immutable
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
