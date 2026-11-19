import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon, StarFilled } from "@/components/icons";
import { Stars } from "@/components/ItemCard";
import { Notice } from "@/components/Ui";
import { contactSellerAction } from "@/lib/actions";
import { getCurrentUser, getVisitorKey } from "@/lib/auth";
import { ITEM_STATUS_LABEL } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { formatDate, rupiah, usageLabel } from "@/lib/format";

export default async function ItemDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ gagal?: string }>;
}) {
  const { id } = await params;
  const { gagal } = await searchParams;

  const item = await prisma.item.findUnique({
    where: { id },
    include: { seller: true },
  });

  if (!item) notFound();

  const user = await getCurrentUser();
  const visitorKey = await getVisitorKey();

  const [reviewAgg, soldCount, cartEntry, waitingInterests] = await Promise.all([
    prisma.review.aggregate({
      where: { sellerId: item.sellerId },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.item.count({ where: { sellerId: item.sellerId, status: "SOLD" } }),
    user
      ? prisma.cartItem.findUnique({
          where: { userId_itemId: { userId: user.id, itemId: item.id } },
        })
      : null,
    prisma.interest.count({ where: { itemId: item.id, status: "WAITING" } }),
  ]);

  await prisma.itemView.upsert({
    where: { sessionKey_itemId: { sessionKey: visitorKey, itemId: item.id } },
    update: { viewedAt: new Date() },
    create: { sessionKey: visitorKey, itemId: item.id },
  });

  const ratingCount = reviewAgg._count._all;
  const ratingAverage = reviewAgg._avg.rating ?? 0;
  const isOwner = user?.id === item.sellerId;
  const available = item.status === "AVAILABLE";
  const statusText =
    item.status === "AVAILABLE"
      ? "Tersedia · 1 barang"
      : (ITEM_STATUS_LABEL[item.status] ?? item.status);

  return (
    <div className="container-page pt-6">
      <Breadcrumbs
        items={[
          { label: "Kembali", href: "/barang" },
          { label: "Jelajahi barang", href: "/barang" },
          { label: item.category, href: `/barang?kategori=${encodeURIComponent(item.category)}` },
        ]}
      />

      {gagal === "status" && (
        <div className="mt-5">
          <Notice>
            Barang ini sudah dipesan atau terjual. Kamu masih bisa melihat detailnya, tetapi
            peminat baru tidak dapat dihubungi.
          </Notice>
        </div>
      )}
      {gagal === "milik" && (
        <div className="mt-5">
          <Notice>Ini barangmu sendiri. Kelola peminat dan COD dari dasbor penjual.</Notice>
        </div>
      )}

      <div className="mt-5 grid items-start gap-x-10 gap-y-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-[14px] bg-cream-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.title}
              className="aspect-[3/2] w-full object-cover"
            />
            <span className="absolute top-4 left-4 rounded-md bg-white/95 px-3 py-1.5 text-[11.5px] font-bold text-heading shadow-sm">
              {statusText}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="size-[62px] overflow-hidden rounded-lg border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" className="size-full object-cover" />
            </div>
            <span className="text-[11.5px] text-[#8a787d]">Foto utama</span>
            {waitingInterests > 0 && available && (
              <span className="ml-auto text-[11.5px] text-[#8a787d]">
                {waitingInterests} peminat dalam antrean
              </span>
            )}
          </div>

          <section className="mt-9">
            <h2 className="text-[20px] font-extrabold">Tentang barang</h2>
            <p className="mt-3 text-[13.5px] leading-[1.75] whitespace-pre-line text-[#6a555b]">
              {item.description}
            </p>
          </section>

          <div className="mt-6 rounded-xl bg-[#fff1e9] px-5 py-4">
            <p className="text-[13px] font-bold text-heading">COD · {item.codPoint}</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-[#8a6a70]">
              Sepakati waktu lewat WhatsApp. Periksa barang sebelum bayar.
            </p>
          </div>
        </div>

        {/* Info & actions */}
        <div>
          <p className="text-[11.5px] text-[#8a787d]">
            {item.code} &nbsp;·&nbsp; Diunggah {formatDate(item.createdAt)}
          </p>
          <h1 className="mt-2 text-[34px] leading-[1.14] font-extrabold tracking-[-0.03em] text-[#6d0a21] sm:text-[40px]">
            {item.title}
          </h1>
          <p className="mt-4 text-[32px] font-extrabold tracking-[-0.02em] text-maroon">
            {rupiah(item.price)}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="pill">
              <Icon name="check" size={12} />
              Diperiksa penjual
            </span>
            <span className="pill">
              {item.warrantyDays > 0 ? `Garansi ${item.warrantyDays} hari` : "Tanpa garansi"}
            </span>
          </div>

          <div className="card mt-5 grid grid-cols-3 divide-x divide-[#f3e8e4] px-1 py-4 text-center sm:text-left">
            {[
              { label: "Kondisi", value: item.condition },
              { label: "Pemakaian", value: usageLabel(item.usageMonths) },
              { label: "Kategori", value: item.category },
            ].map((spec) => (
              <div key={spec.label} className="px-4">
                <p className="text-[11px] text-[#8a787d]">{spec.label}</p>
                <p className="mt-1.5 text-[13px] font-bold text-heading">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            {isOwner ? (
              <Link href={`/jualan/${item.id}/antrean`} className="btn btn-outline flex-1">
                Kelola barang ini
                <Icon name="arrow-right" size={15} />
              </Link>
            ) : available ? (
              <>
                <AddToCartButton itemId={item.id} inCart={!!cartEntry} />
                <form action={contactSellerAction} className="flex-1">
                  <input type="hidden" name="itemId" value={item.id} />
                  <button type="submit" className="btn btn-primary w-full">
                    Hubungi via WhatsApp
                    <Icon name="arrow-right" size={15} />
                  </button>
                </form>
              </>
            ) : (
              <div className="w-full rounded-lg border border-line bg-cream-50 px-4 py-3 text-center text-[12.5px] font-semibold text-[#8a6a70]">
                Barang ini sudah {item.status === "SOLD" ? "terjual" : "dipesan"} dan tidak
                bisa dihubungi lagi.
              </div>
            )}
          </div>

          <p className="mt-3 text-[11.5px] leading-relaxed text-[#8a787d]">
            Menghubungi penjual memasukkanmu ke antrean peminat. Menyimpan di keranjang
            tidak memesan barang.
          </p>

          <div className="mt-6 rounded-xl bg-[#fff7f2] px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-[#ffe0d2] text-[14px] font-extrabold text-maroon">
                  {item.seller.name.slice(0, 1)}
                </span>
                <div>
                  <p className="text-[14.5px] font-bold text-heading">{item.seller.name}</p>
                  <p className="text-[11.5px] text-[#8a787d]">{item.seller.major}</p>
                </div>
              </div>
              <Link
                href={`/penjual/${item.seller.id}`}
                className="inline-flex shrink-0 items-center gap-1 text-[11.5px] font-bold text-[#9b1735] hover:underline"
              >
                Lihat profil
                <Icon name="arrow-right" size={12} />
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-[#7d6c71]">
              <span className="inline-flex items-center gap-1 font-semibold text-[#4a1622]">
                <StarFilled size={12} className="text-[#8f1030]" />
                {ratingCount > 0 ? ratingAverage.toFixed(1).replace(".", ",") : "Baru"}
              </span>
              <span>·</span>
              <span>{ratingCount} ulasan</span>
              <span>·</span>
              <span>{soldCount} terjual</span>
            </div>
          </div>

          <section className="mt-7">
            <h2 className="text-[16px] font-extrabold">Garansi dari penjual</h2>
            <div className="mt-2.5 flex items-center gap-2 text-[12px] text-[#7d6c71]">
              <Stars value={ratingAverage} size={13} />
              <span>Rata-rata dari {ratingCount} ulasan pembeli</span>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-[#6a555b]">
              {item.warrantyDays > 0
                ? `${item.warrantyDays} hari setelah COD untuk kendala fungsi. Syarat pengembalian disepakati langsung dengan penjual.`
                : "Tanpa garansi. Periksa barang dengan teliti sebelum membayar."}
            </p>
            <p className="mt-2 text-[11.5px] font-semibold text-[#8a6a70]">
              Tidak ada pembayaran atau pengiriman di dalam JUBELMA.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
