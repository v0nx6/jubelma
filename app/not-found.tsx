import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md text-center">
        <Link href="/" className="text-[28px] font-extrabold tracking-[-0.045em] text-maroon">
          jubelma.
        </Link>
        <p className="mt-8 text-[11px] font-extrabold tracking-[0.12em] text-[#9b1735] uppercase">
          Halaman tidak ditemukan
        </p>
        <h1 className="mt-3 text-[34px] leading-tight font-extrabold tracking-[-0.03em]">
          Barangnya mungkin sudah berpindah.
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-[#7d6c71]">
          Tautan yang kamu buka tidak tersedia atau barang sudah dihapus. Kembali ke katalog
          untuk mencari barang lain.
        </p>
        <Link href="/barang" className="btn btn-primary mt-6">
          Jelajahi barang
        </Link>
      </div>
    </div>
  );
}
