"use client";
import React, { useState, useEffect, ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/atoms/sonner";
import { ApolloProviderWrapper } from "@/lib/providers";

function ThemeProviderWrapper({ children }: { readonly children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="es">
      <head>
        {/* Inline script to apply color class from localStorage before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var color = localStorage.getItem('color-theme');
                if (color) {
                  document.documentElement.classList.add(color);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <ApolloProviderWrapper>
          <ThemeProviderWrapper>
            <main className="flex-1">{children}</main>
            <Toaster />
          </ThemeProviderWrapper>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
