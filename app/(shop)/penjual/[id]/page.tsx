import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon, StarFilled } from "@/components/icons";
import { Stars } from "@/components/ItemCard";
import { prisma } from "@/lib/db";
import { formatDateShort, rupiah, usageLabel } from "@/lib/format";
import { getSellerStats } from "@/lib/data";

export default async function SellerProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "tersedia" } = await searchParams;

  const seller = await prisma.user.findUnique({ where: { id } });
  if (!seller) notFound();

  const [stats, items, reviews] = await Promise.all([
    getSellerStats(seller.id),
    prisma.item.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.findMany({
      where: { sellerId: seller.id },
      include: { author: true, item: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
  ]);

  const availableItems = items.filter((item) => item.status === "AVAILABLE");
  const soldItems = items.filter((item) => item.status === "SOLD");
  const shownItems = tab === "terjual" ? soldItems : availableItems;

  return (
    <div className="container-page pt-6">
      <Breadcrumbs
        items={[{ label: "Beranda", href: "/" }, { label: "Profil penjual" }]}
      />

      <section className="mt-6 flex flex-col gap-7 rounded-[18px] bg-[#ffe9dd] px-7 py-8 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[32px] leading-tight font-extrabold tracking-[-0.03em] text-[#6d0a21] sm:text-[38px]">
            {seller.name}
          </h1>
          <p className="mt-2 text-[13px] font-semibold text-[#8d2038]">{seller.major}</p>
          <p className="mt-3 text-[13px] text-[#7a4a52]">
            Perlengkapan kuliah yang masih layak, untuk teman kampus.
          </p>
        </div>

        <div className="flex items-center gap-9 sm:gap-14">
          <div>
            <p className="text-[30px] leading-none font-extrabold tracking-[-0.02em] text-[#6d0a21]">
              {stats.reviewCount > 0
                ? `${stats.rating.toFixed(1).replace(".", ",")} / 5`
                : "Baru"}
            </p>
            <p className="mt-2 text-[11px] text-[#8d2038]">Rating penjual</p>
          </div>
          <div>
            <p className="text-[30px] leading-none font-extrabold tracking-[-0.02em] text-[#6d0a21]">
              {stats.reviewCount}
            </p>
            <p className="mt-2 text-[11px] text-[#8d2038]">Ulasan</p>
          </div>
          <div>
            <p className="text-[30px] leading-none font-extrabold tracking-[-0.02em] text-[#6d0a21]">
              {stats.sold}
            </p>
            <p className="mt-2 text-[11px] text-[#8d2038]">Barang terjual</p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid items-start gap-9 lg:grid-cols-2 lg:gap-12">
        <section>
          <h2 className="h-section">Barang penjual</h2>

          <div className="mt-4 flex gap-2">
            <Link
              href={`/penjual/${seller.id}`}
              className={`rounded-md px-3.5 py-2 text-[12px] transition ${
                tab !== "terjual"
                  ? "bg-[#ffe9dd] font-bold text-[#9b1735]"
                  : "font-medium text-[#6f5a60] hover:bg-[#fff1e9]"
              }`}
            >
              Tersedia ({availableItems.length})
            </Link>
            <Link
              href={`/penjual/${seller.id}?tab=terjual`}
              className={`rounded-md px-3.5 py-2 text-[12px] transition ${
                tab === "terjual"
                  ? "bg-[#ffe9dd] font-bold text-[#9b1735]"
                  : "font-medium text-[#6f5a60] hover:bg-[#fff1e9]"
              }`}
            >
              Terjual ({soldItems.length})
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {shownItems.length === 0 && (
              <div className="card px-6 py-7 text-[12.5px] text-[#8a787d]">
                Belum ada barang {tab === "terjual" ? "terjual" : "tersedia"} dari penjual ini.
              </div>
            )}

            {shownItems.map((item) => (
              <Link
                key={item.id}
                href={`/barang/${item.id}`}
                className="card flex gap-3.5 p-3.5 transition hover:border-[#e7cfc6]"
              >
                <div className="h-[126px] w-[180px] shrink-0 overflow-hidden rounded-lg bg-cream-100 sm:h-[132px] sm:w-[196px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className="size-full object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col py-1">
                  <h3 className="truncate text-[15px] font-bold text-heading">{item.title}</h3>
                  <p className="mt-2 text-[19px] font-extrabold text-maroon">
                    {rupiah(item.price)}
                  </p>
                  <p className="mt-auto text-[11px] leading-relaxed text-[#8a787d]">
                    {item.condition} · {item.warrantyDays > 0 ? `Garansi ${item.warrantyDays} hari` : "Tanpa garansi"}
                    <br />
                    {usageLabel(item.usageMonths)} pemakaian
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-[#fff1e9] px-5 py-4">
            <p className="text-[14px] font-bold text-heading">Kenali penjual sebelum bertemu.</p>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#8a6a70]">
              Baca kondisi dan ulasan. Gunakan WhatsApp untuk menyepakati titik temu di area
              kampus yang ramai. NIM dan kata sandi tidak ditampilkan pada profil publik.
            </p>
          </div>
        </section>

        <section>
          <h2 className="h-section">Ulasan terbaru</h2>

          <div className="mt-4 flex items-center gap-2.5">
            <Stars value={stats.rating} size={15} />
            <span className="text-[12px] font-semibold text-[#5d484e]">
              {stats.reviewCount > 0
                ? `${stats.rating.toFixed(1).replace(".", ",")} dari ${stats.reviewCount} ulasan`
                : "Belum ada ulasan"}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {reviews.length === 0 && (
              <div className="card px-6 py-7 text-[12.5px] text-[#8a787d]">
                Jadilah pembeli pertama dan beri ulasan setelah COD selesai.
              </div>
            )}

            {reviews.map((review) => (
              <article key={review.id} className="card px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[12.5px] font-bold text-heading">{review.author.name}</p>
                    <p className="mt-0.5 text-[11px] text-[#8a787d]">
                      {formatDateShort(review.createdAt)}
                    </p>
                  </div>
                  <span className="flex gap-0.5 text-[#8f1030]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarFilled key={i} size={12} className={i <= review.rating ? "" : "opacity-20"} />
                    ))}
                  </span>
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-[#6a555b]">{review.text}</p>
                <p className="mt-2 text-[10.5px] text-[#a29196]">Untuk {review.item.title}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
