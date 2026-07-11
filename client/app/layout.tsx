import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import QueryProviders from "@/context/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/context/AuthProvider";

export const metadata: Metadata = {
  title: "Formly",
  description: "Build and publish beautiful forms with Formly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <QueryProviders>
          <AuthProvider>{children}</AuthProvider>
        </QueryProviders>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
