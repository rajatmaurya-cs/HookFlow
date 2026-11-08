import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HookFlow - Webhook Dispatching & Management",
  description: "Reliable webhook ingestion and forwarding service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-white">{children}</body>
    </html>
  );
}
