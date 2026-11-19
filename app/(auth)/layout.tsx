import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Header";
import { Icon } from "@/components/icons";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-white">
        <div className="container-page flex items-center justify-between gap-6 py-5">
          <div className="flex items-center gap-10">
            <Logo />
            <span className="hidden text-[12.5px] text-[#8a787d] md:block">
              Marketplace barang bekas mahasiswa Poltek
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#7d6c71] transition hover:text-maroon"
          >
            <Icon name="arrow-left" size={14} />
            Kembali ke beranda
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
