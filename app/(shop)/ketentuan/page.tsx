import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/icons";
import { CAMPUS_NAME } from "@/lib/constants";

export const metadata = { title: "Ketentuan & cara belanja" };

export default function KetentuanPage() {
  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "Ketentuan" }]} />

      <div className="mx-auto mt-8 max-w-[760px]">
        <h1 className="h-display">Sederhana alurnya. Jelas aturannya.</h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-[#7d6c71]">
          JUBELMA adalah ruang jual beli barang bekas antar mahasiswa {CAMPUS_NAME}. Tidak ada
          pembayaran online, ongkir, atau titip dana di aplikasi.
        </p>

        <section id="cara-belanja" className="card mt-8 p-7">
          <h2 className="text-[22px] font-extrabold">Cara belanja</h2>
          <ol className="mt-4 space-y-3 text-[13px] leading-relaxed text-[#5d484e]">
            <li>
              <strong className="text-heading">01 Temukan.</strong> Cari barang lewat katalog,
              filter kategori, atau harga maksimal.
            </li>
            <li>
              <strong className="text-heading">02 Simpan atau hubungi.</strong> Simpan ke
              keranjang untuk nanti, atau hubungi penjual via WhatsApp. Menghubungi penjual
              memasukkanmu ke antrean peminat.
            </li>
            <li>
              <strong className="text-heading">03 Antrean.</strong> Penjual memilih peminat
              terdepan. Kamu akan mendapat notifikasi jika dipilih.
            </li>
            <li>
              <strong className="text-heading">04 COD.</strong> Sepakati waktu dan titik temu di
              area kampus. Periksa barang sebelum membayar.
            </li>
            <li>
              <strong className="text-heading">05 Selesai.</strong> Penjual menandai barang
              terjual. Kamu bisa memberi ulasan untuk membantu pembeli lain.
            </li>
          </ol>
        </section>

        <section className="card mt-4 p-7">
          <h2 className="text-[22px] font-extrabold">Cara menjual</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-[#5d484e]">
            Unggah satu barang per unggahan dengan foto asli, kondisi jujur, harga, lama
            pemakaian, dan titik temu COD. Barang yang hampir rusak tidak boleh tayang. Kamu
            wajib memeriksa fungsi barang sebelum menayangkannya.
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-[#5d484e]">
            Antrean ditutup otomatis saat barang ditandai terjual. Jika transaksi batal,
            kembalikan status barang ke Tersedia agar peminat berikutnya bisa dilayani.
          </p>
        </section>

        <section id="privasi" className="card mt-4 p-7">
          <h2 className="text-[22px] font-extrabold">Privasi &amp; keamanan</h2>
          <ul className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-[#5d484e]">
            <li>NIM hanya dipakai untuk masuk dan tidak ditampilkan di profil publik.</li>
            <li>Kata sandi disimpan dalam bentuk hash, bukan teks asli.</li>
            <li>
              Nomor WhatsApp hanya dibagikan kepada lawan transaksi saat kamu menghubungi
              penjual atau dipilih sebagai pembeli.
            </li>
            <li>Riwayat “Terakhir dilihat” hanya berlaku selama sesi peramban.</li>
            <li>
              Jangan mengirim uang muka atau data rekening. JUBELMA tidak memproses pembayaran
              apa pun.
            </li>
          </ul>
        </section>

        <section className="mt-4 rounded-[14px] border border-[#f6ded2] bg-[#fff1e9] p-7">
          <h2 className="text-[22px] font-extrabold">Pembayaran hanya saat COD</h2>
          <p className="mt-2 text-[12.5px] leading-relaxed text-[#8a6a70]">
            Tidak ada biaya layanan, ongkir, maupun pembayaran di muka. Bertemulah di area
            kampus yang ramai dan periksa barang sebelum menyerahkan uang.
          </p>
          <Link
            href="/barang"
            className="btn btn-primary mt-5 w-fit px-5 py-2.5 text-[12.5px]"
          >
            Mulai jelajah
            <Icon name="arrow-right" size={14} />
          </Link>
        </section>
      </div>
    </div>
  );
}
