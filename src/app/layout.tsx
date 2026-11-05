import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/components/ui/ToastContainer";
import V5EcosystemHeader from '@/components/layout/V5EcosystemHeader';

import V5EcosystemFooter from '@/components/layout/V5EcosystemFooter';
import V5FloatingConcierge from '@/components/layout/V5FloatingConcierge';
import V5ClientErrorSentinel from '@/components/layout/V5ClientErrorSentinel';
export const metadata: Metadata = {
  metadataBase: new URL("https://avatar.v5apollo.com"),
  title: "V5 Apollo Avatar — Agência Central de Identidades Digitais",
  description: "Criação de Personagens Consistentes, Turnaround 360°, Voz Clonada e Atuação Multicanal para a Holding V5 Apollo.",
  authors: [{ name: "Holding V5 Apollo", url: "https://v5apollo.com" }],
  creator: "Apollo La Plata",
  publisher: "Holding V5 Apollo",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "V5 Apollo Avatar — Agência Central de Identidades Digitais",
    description: "Criação de Personagens Consistentes, Turnaround 360°, Voz Clonada e Atuação Multicanal para a Holding V5 Apollo.",
    url: "https://avatar.v5apollo.com",
    siteName: "V5 Apollo Avatar",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "V5 Apollo Avatar — Agência Central de Identidades Digitais",
    description: "Criação de Personagens Consistentes, Turnaround 360°, Voz Clonada e Atuação Multicanal para a Holding V5 Apollo.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
            <head>
        <link rel="preconnect" href="https://v5apollo.com" />
        <link rel="dns-prefetch" href="https://v5apollo.com" />
        <link rel="preconnect" href="https://hmiynglcsvpzhqbnnqzj.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://hmiynglcsvpzhqbnnqzj.supabase.co" />
      </head>
<body className="bg-obsidian-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <V5EcosystemHeader currentSite="avatar" />
        {children}
        <ToastContainer />
              <V5EcosystemFooter currentSite="avatar" />
        <V5FloatingConcierge currentSite="avatar" />
        <V5ClientErrorSentinel siteId="avatar" />
      </body>
    </html>
  );
}