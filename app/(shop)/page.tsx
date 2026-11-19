import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { CATEGORIES } from "@/lib/constants";
import { getItems } from "@/lib/data";
import { Icon } from "@/components/icons";
import { ItemCard } from "@/components/ItemCard";
import { EmptyState } from "@/components/Ui";

export default async function HomePage() {
  const [items, user] = await Promise.all([
    getItems({ take: 4 }),
    getCurrentUser(),
  ]);

  return (
    <div className="container-page">
      {/* Hero */}
      <section className="hero-shell mt-6 grid items-center gap-8 rounded-[22px] border border-[#f7e1d6] p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12 lg:p-10">
        <div>
          <p className="text-[10.5px] font-extrabold tracking-[0.12em] text-[#8d2038] uppercase">
            Belanja cerdas, sesama mahasiswa
          </p>
          <h1 className="mt-4 text-[34px] leading-[1.06] font-extrabold tracking-[-0.04em] text-[#6d0a21] sm:mt-5 sm:text-[46px] lg:text-[54px]">
            Bekas barangnya.
            <br />
            Baru ceritanya.
          </h1>
          <p className="mt-4 max-w-[430px] text-[13.5px] leading-relaxed text-[#6f4a52] sm:mt-5 sm:text-[14.5px]">
            Temukan kebutuhan kuliah tanpa bikin kantong menyerah. Jual beli lebih dekat,
            ketemu langsung di kampus.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/barang" className="btn btn-primary px-5 py-3">
              Jelajahi barang
              <Icon name="arrow-right" size={16} />
            </Link>
            <Link
              href={user ? "/jual" : "/masuk?next=%2Fjual"}
              className="btn bg-white px-5 py-3 text-heading shadow-[0_1px_0_rgba(120,60,60,0.04)] hover:bg-cream-50"
            >
              Mulai jualan
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/products/hero.jpg"
              alt="Laptop, buku, dan kabel jaringan siap COD di kampus"
              className="h-[200px] w-full object-cover sm:h-[250px] lg:h-[262px]"
            />
          </div>
          <p className="mt-3 text-right text-[12px] font-bold text-[#8d2038]">
            Barang baik layak dapat kesempatan kedua
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="card mt-4 grid gap-5 px-6 py-5 sm:grid-cols-3 sm:divide-x sm:divide-[#f2e4df]">
        {[
          {
            icon: "check" as const,
            title: "Diperiksa oleh penjual",
            text: "Kondisi jelas, bukan tebak-tebakan.",
          },
          {
            icon: "map-pin" as const,
            title: "COD di area kampus",
            text: "Cek barang sebelum membayar.",
          },
          {
            icon: "bag" as const,
            title: "Satu akun, dua peran",
            text: "Bisa belanja sekaligus berjualan.",
          },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3 sm:px-6 sm:first:pl-0 sm:last:pr-0">
            <span className="mt-0.5 text-[#800021]">
              <Icon name={item.icon} size={19} />
            </span>
            <div>
              <p className="text-[12.5px] font-bold text-heading">{item.title}</p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#8a787d]">{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="h-section">Cari sesuai kebutuhanmu</h2>
          <Link href="/barang" className="link-maroon">
            Lihat semua kategori
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/barang"
            className="inline-flex min-w-[180px] flex-1 items-center justify-center rounded-lg bg-maroon px-5 py-3 text-[13.5px] font-bold text-white transition hover:bg-maroon-700 sm:flex-none"
          >
            Semua barang
          </Link>
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/barang?kategori=${encodeURIComponent(category)}`}
              className="inline-flex min-w-[160px] flex-1 items-center justify-center rounded-lg bg-[#fff1e9] px-5 py-3 text-[13.5px] font-semibold text-heading transition hover:bg-[#ffe7db]"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* Latest items */}
      <section className="mt-11">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="h-section">Baru mampir di kampus</h2>
            <p className="mt-1.5 text-[12.5px] text-[#8a787d]">
              Diurutkan berdasarkan unggahan terbaru
            </p>
          </div>
          <Link href="/barang" className="link-maroon">
            Jelajahi semua
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              title="Belum ada barang di kampus"
              description="Jadilah yang pertama mengunggah barang bekas layak pakai untuk teman kampus."
              action={{ href: "/jual", label: "Jual barang pertama" }}
              icon="tag"
            />
          </div>
        )}
      </section>
    </div>
  );
}
