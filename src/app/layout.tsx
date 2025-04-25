import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextAuthProvider from "@/components/widgets/providers/nextAuthProvider";
import Header from "@/components/widgets/shared/header";
import { PostsProvider } from "@/components/widgets/providers/boardProvider";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/components/widgets/providers/reactQueryProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "다글제작소",
  icons: {
    icon: "/logo.svg",
  },
};

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
        <ReactQueryProvider>
          <NextAuthProvider>
            <PostsProvider>
              <Header />
              <Toaster />
              {children}
            </PostsProvider>
          </NextAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
