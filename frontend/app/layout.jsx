import "./globals.css";

export const metadata = {
  title: "HookFlow - Never miss an Event Again",
  description: "Reliable webhook ingestion, verification, and dispatch engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F2F3F4] text-[#36454F] antialiased">
        {children}
      </body>
    </html>
  );
}
