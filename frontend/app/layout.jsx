import "./globals.css";

export const metadata = {
  title: "HookFlow - Never miss an Event Again",
  description: "Reliable webhook ingestion, verification, and dispatch engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#F2F3F4] text-[#36454F] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
