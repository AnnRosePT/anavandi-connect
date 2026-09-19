import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "AnaVandi Connect | Kerala KSRTC AI Timetable Platform",
  description:
    "Connecting Kerala, one route at a time. From paper timetables to intelligent journeys. AI-powered timetable digitization, verification and search for Kerala’s public transportation network.",
  keywords: [
    "AnaVandi",
    "KSRTC",
    "Kerala Bus Timetable",
    "GTFS Kerala",
    "Aana Vandi",
    "Ashok Leyland KSRTC",
    "Bus Search Kerala",
    "Timetable Digitization",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Epilogue:wght@600;700;800&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-background font-body-md text-body-md text-on-surface antialiased min-h-screen">
        <LanguageProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col w-full lg:pl-72 min-h-screen">
              <Header />
              <main className="w-full flex-1 pt-16 pb-20 lg:pb-8 bg-background">
                {children}
              </main>
              <MobileNav />
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
