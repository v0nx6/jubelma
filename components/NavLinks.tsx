"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Beranda", exact: true },
  { href: "/barang", label: "Jelajahi barang" },
  { href: "/pembelian", label: "Pembelian saya" },
  { href: "/terakhir-dilihat", label: "Terakhir dilihat" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-5 overflow-x-auto text-[13.5px] whitespace-nowrap md:gap-9">
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? "font-bold text-maroon"
                : "font-medium text-[#6f5a60] transition hover:text-maroon"
            }
          >
            {link.label}
          </Link>
        );
      })}
      <span className="ml-auto hidden text-[12px] text-[#8a787d] lg:block">
        Khusus mahasiswa Poltek
      </span>
    </nav>
  );
}
