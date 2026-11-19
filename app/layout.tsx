import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { VisitorCookie } from "@/components/VisitorCookie";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "jubelma. — Marketplace barang bekas mahasiswa Poltek",
    template: "%s — jubelma.",
  },
  description:
    "Jual beli barang bekas antar mahasiswa Politeknik Negeri Ujung Pandang. COD di kampus, tanpa pembayaran online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} font-sans`}>
        <VisitorCookie />
        {children}
      </body>
    </html>
  );
}
