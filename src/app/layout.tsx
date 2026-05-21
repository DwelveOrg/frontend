import type { Metadata } from "next";
import { Montserrat, Inter, Geist } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Providers from "./providers";
import Toaster from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dwelve",
  description: "Dwelve is a digital academic testing and performance management platform built for schools and learning centers. It streamlines the entire assessment workflow — from test creation and submission to automated grading and performance analytics.",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body
        className={`${montserrat.variable} ${inter.variable} bg-background text-foreground antialiased min-h-screen transition-colors`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
