import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "@/provider/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

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
    template: "%s | Job Prep",
    default: "Job Prep - Master Your Next Interview",
  },
  description: "A comprehensive platform to prepare for your job interviews with mock tests, problem solving, and resume building.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head />
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <QueryProvider>

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
              <Toaster position="top-center" duration={3000} richColors theme="system" />
            </TooltipProvider>
          </ThemeProvider>
        </QueryProvider>

      </body>
    </html>
  );
}
