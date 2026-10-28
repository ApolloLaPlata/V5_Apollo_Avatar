import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  title: "V5 Apollo Avatar · Agência Central de Identidades Digitais",
  description: "Criação de Personagens Consistentes, Turnaround 360º, Voz Clonada e Atuação Multicanal para a Holding V5 Apollo.",
  icons: {
    icon: "/icon.svg",
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
