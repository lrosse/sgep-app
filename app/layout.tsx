import { auth } from "@/auth";
import { Sidebar } from "@/components/ui/Sidebar";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
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
  title: "SGEP - Gestão de Estudos",
  description: "Sistema profissional para gestão e acompanhamento de estudos.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-50 flex h-screen overflow-hidden`}
      >
        <SessionProvider session={session}>
          {session && <Sidebar />}
          <main className="flex-1 overflow-y-auto bg-zinc-950/50">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
