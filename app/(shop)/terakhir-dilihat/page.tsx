import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/icons";
import { Notice } from "@/components/Ui";
import { ITEM_STATUS_LABEL } from "@/lib/constants";
import { getVisitorKey } from "@/lib/auth";
import { getRecentViews } from "@/lib/data";
import { rupiah, timeAgo } from "@/lib/format";

export const metadata = { title: "Terakhir dilihat" };

export default async function TerakhirDilihatPage() {
  const visitorKey = await getVisitorKey();
  const views = await getRecentViews(visitorKey);

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "Terakhir dilihat" }]} />

      <div className="mt-6">
        <h1 className="h-display">Tadi lihat apa, ya?</h1>
        <p className="mt-2 text-[13.5px] text-[#7d6c71]">
          Lanjutkan pencarianmu dari barang yang baru saja dibuka.
        </p>
      </div>

      <div className="mt-6">
        <Notice>
          Riwayat hanya berlaku selama sesi ini dan tidak disimpan setelah sesi berakhir.
        </Notice>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {views.length > 0 ? (
          <Link
            href={`/barang/${views[0].item.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-[12.5px] font-bold text-heading transition hover:bg-cream-50"
          >
            <Icon name="arrow-left" size={14} />
            Kembali ke barang sebelumnya
          </Link>
        ) : (
          <span />
        )}
        <p className="text-[11.5px] text-[#8a787d]">Urutan dari yang paling baru dilihat</p>
      </div>

      {views.length === 0 ? (
        <div className="card mt-5 px-7 py-9">
          <h2 className="text-[22px] font-extrabold">Belum ada riwayat di sesi ini.</h2>
          <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-[#7d6c71]">
            Buka beberapa barang, lalu kembali ke sini untuk melanjutkan pencarian tanpa
            mengulang dari awal.
          </p>
          <Link
            href="/barang"
            className="btn btn-primary mt-5 w-fit px-5 py-2.5 text-[12.5px]"
          >
            Jelajahi barang
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {views.map(({ item, viewedAt }) => (
            <article key={item.id} className="card overflow-hidden">
              <Link href={`/barang/${item.id}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden bg-cream-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-heading shadow-sm">
                    {ITEM_STATUS_LABEL[item.status] ?? item.status}
                  </span>
                </div>
                <div className="px-4 pt-3">
                  <p className="text-[11px] text-[#8a787d]">{timeAgo(viewedAt)}</p>
                  <h3 className="mt-1 line-clamp-1 text-[14.5px] font-bold text-heading">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[17px] font-extrabold text-maroon">
                    {rupiah(item.price)}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 pb-4 text-[11.5px] font-bold text-[#9b1735] group-hover:underline">
                    Lihat detail
                    <Icon name="arrow-right" size={13} />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      <div className="mt-5 rounded-xl border border-[#f6ded2] bg-[#fff1e9] px-5 py-4">
        <p className="text-[13px] font-bold text-heading">Sudah dipesan atau terjual?</p>
        <p className="mt-1 text-[11.5px] text-[#8a6a70]">
          Detail barang tetap bisa dilihat, tetapi tombol menghubungi dan tambah ke keranjang
          dinonaktifkan.
        </p>
      </div>
    </div>
  );
}
