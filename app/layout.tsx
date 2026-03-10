import { Sidebar } from "@/components/ui/Sidebar";
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
  title: "SGEP - Gestão de Estudos",
  description: "Sistema profissional para gestão e acompanhamento de estudos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-50 flex h-screen overflow-hidden`}
      >
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-zinc-950/50">
          {children}
        </main>
      </body>
    </html>
  );
}
