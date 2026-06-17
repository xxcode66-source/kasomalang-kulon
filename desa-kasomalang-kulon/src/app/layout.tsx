import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Desa Kasomalang Kulon - Website Resmi",
  description: "Portal resmi Pemerintah Desa Kasomalang Kulon, Kecamatan Kasomalang, Kabupaten Indramayu. Melayani masyarakat dengan transparan, cepat, dan akuntabel.",
  keywords: "desa, kasomalang kulon, indramayu, jawa barat, pemerintahan desa, pbb, bansos",
  authors: [{ name: "Pemerintah Desa Kasomalang Kulon" }],
  openGraph: {
    title: "Desa Kasomalang Kulon",
    description: "Website Resmi Desa Kasomalang Kulon",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
