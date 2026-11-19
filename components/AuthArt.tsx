import { Icon } from "./icons";

export function AuthArt({
  image,
  headline = "Barangmu berguna. Dompetmu lega.",
  description = "Satu komunitas. Banyak kesempatan baru. Temukan kebutuhan kuliah dari teman kampusmu.",
}: {
  image: string;
  headline?: string;
  description?: string;
}) {
  return (
    <aside className="relative hidden overflow-hidden rounded-[22px] bg-maroon p-9 text-[#ffe9df] lg:flex lg:flex-col">
      <span className="inline-flex w-fit items-center rounded-md bg-[#fff0e7] px-2.5 py-1.5 text-[10px] font-extrabold tracking-[0.08em] text-[#7c0a22] uppercase">
        Khusus mahasiswa Poltek
      </span>

      <h2 className="mt-8 max-w-[320px] text-[40px] leading-[1.12] font-extrabold tracking-[-0.03em] text-[#ffb9a3]">
        {headline}
      </h2>

      <p className="mt-5 max-w-[280px] text-[13.5px] leading-relaxed text-[#ffd6c8]">
        {description}
      </p>

      <div className="mt-8 overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt="Barang bekas berkualitas untuk mahasiswa"
          className="h-[248px] w-full object-cover"
        />
      </div>

      <div className="mt-9 flex items-center gap-5 text-[11px] font-bold text-[#ffd6c8]">
        <span>01 &nbsp;Temukan</span>
        <span>02 &nbsp;Hubungi</span>
        <span>03 &nbsp;COD</span>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-[#ffcbbb]">
        Tidak ada pembayaran di aplikasi.
        <br />
        Cek langsung, baru bayar saat bertemu.
      </p>

      <div className="mt-auto flex items-center gap-2 pt-8 text-[10.5px] text-[#e5a795]">
        <Icon name="shield" size={14} />
        Transaksi aman, tanpa perantara
      </div>
    </aside>
  );
}
