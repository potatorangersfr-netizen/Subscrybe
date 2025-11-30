'use client';

import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context";
import { Toaster } from "react-hot-toast";
import { MemePopup } from "@/components/memes/meme-popup";
import { KonamiListener } from "@/components/ui/konami-listener";
import { WelcomeModal } from "@/components/ui/welcome-modal";
import { useState, useEffect } from "react";
import { Loading3D } from "@/components/ui/loading-3d";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loading animation for 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Subscrybe - Manage Your Crypto Subscriptions</title>
        <meta name="description" content="Track, optimize, and cancel crypto subscriptions with privacy-first design on Cardano" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
        {loading && <Loading3D />}
        <AppProvider>
          {children}
          <MemePopup />
          <KonamiListener />
          <WelcomeModal />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid #334155',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#F8FAFC',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#F8FAFC',
                },
              },
            }}
          />
        </AppProvider>
      </body>
    </html>
  );
}
