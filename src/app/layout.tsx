import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  metadataBase: new URL("https://avatar.v5apollo.com"),
  title: "V5 Apollo Avatar • Agência Central de Identidades Digitais",
  description: "Criação de Personagens Consistentes, Turnaround 360°, Voz Clonada e Atuação Multicanal para a Holding V5 Apollo.",
  authors: [{ name: "Holding V5 Apollo", url: "https://v5apollo.com" }],
  creator: "Apollo La Plata",
  publisher: "Holding V5 Apollo",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "V5 Apollo Avatar • Agência Central de Identidades Digitais",
    description: "Criação de Personagens Consistentes, Turnaround 360°, Voz Clonada e Atuação Multicanal para a Holding V5 Apollo.",
    url: "https://avatar.v5apollo.com",
    siteName: "V5 Apollo Avatar",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "V5 Apollo Avatar • Agência Central de Identidades Digitais",
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
      <body className="bg-obsidian-950 text-slate-100 min-h-screen flex flex-col antialiased">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
