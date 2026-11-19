import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/icons";
import { Notice } from "@/components/Ui";
import { contactSellerAction } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { getPurchases } from "@/lib/data";
import { formatDate, rupiah, waLink } from "@/lib/format";

export const metadata = { title: "Pembelian saya" };

const TABS = [
  { key: "semua", label: "Semua" },
  { key: "antrean", label: "Dalam antrean" },
  { key: "dipesan", label: "Dipesan" },
  { key: "selesai", label: "Selesai" },
];

export default async function PembelianPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; ulasan?: string }>;
}) {
  const user = await requireUser("/pembelian");
  const { tab = "semua", ulasan } = await searchParams;
  const { interests, orders, queuePositions } = await getPurchases(user.id);

  const entries = [
    ...interests.map((interest) => ({
      kind: "queue" as const,
      createdAt: interest.createdAt,
      item: interest.item,
      interest,
    })),
    ...orders.map((order) => ({
      kind: "order" as const,
      createdAt: order.createdAt,
      item: order.item,
      order,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const counts = {
    semua: entries.length,
    antrean: interests.length,
    dipesan: orders.filter((order) => order.status === "ORDERED").length,
    selesai: orders.filter((order) => order.status === "COMPLETED").length,
  };

  const visible = entries.filter((entry) => {
    if (tab === "antrean") return entry.kind === "queue";
    if (tab === "dipesan") return entry.kind === "order" && entry.order.status === "ORDERED";
    if (tab === "selesai") return entry.kind === "order" && entry.order.status === "COMPLETED";
    return true;
  });

  return (
    <div className="container-page pt-6">
      <Breadcrumbs
        items={[{ label: "Beranda", href: "/" }, { label: "Akun saya", href: "/pembelian" }, { label: "Pembelian" }]}
      />

      <div className="mt-6">
        <h1 className="h-display">Pembelian saya</h1>
        <p className="mt-2 text-[13.5px] text-[#7d6c71]">
          Pantau antrean, jadwal COD, dan transaksi yang sudah selesai.
        </p>
      </div>

      {ulasan === "terkirim" && (
        <div className="mt-5">
          <Notice tone="success">
            Ulasanmu sudah terkirim. Terima kasih telah membantu teman kampus membeli dengan
            lebih yakin.
          </Notice>
        </div>
      )}

      <div className="mt-6 flex gap-1.5 overflow-x-auto rounded-lg bg-[#fffaf7] p-1.5">
        {TABS.map((item) => (
          <Link
            key={item.key}
            href={item.key === "semua" ? "/pembelian" : `/pembelian?tab=${item.key}`}
            className={`shrink-0 rounded-md px-4 py-2.5 text-[12.5px] transition ${
              tab === item.key
                ? "bg-[#ffe9dd] font-bold text-[#9b1735]"
                : "font-medium text-[#6f5a60] hover:bg-[#fff1e9]"
            }`}
          >
            {item.label} ({counts[item.key as keyof typeof counts]})
          </Link>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {visible.length === 0 && (
          <div className="card px-7 py-9">
            <h2 className="text-[21px] font-extrabold">Belum ada aktivitas di sini.</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-[#7d6c71]">
              Barang yang kamu hubungi atau pesan akan muncul di halaman ini.
            </p>
            <Link
              href="/barang"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#fff1e9] px-5 py-2.5 text-[12.5px] font-bold text-maroon hover:bg-[#ffe4d8]"
            >
              Jelajahi barang
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        )}

        {visible.map((entry) => {
          const item = entry.item;
          const isQueue = entry.kind === "queue";
          const order = entry.kind === "order" ? entry.order : null;
          const position = isQueue ? queuePositions.get(entry.interest.id) ?? 1 : 0;
          const statusLabel = isQueue
            ? "Dalam antrean"
            : order?.status === "COMPLETED"
              ? "Selesai"
              : "Dipesan";

          return (
            <article
              key={isQueue ? entry.interest.id : order?.id}
              className="card flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center"
            >
              <Link
                href={`/barang/${item.id}`}
                className="block h-[96px] w-full shrink-0 overflow-hidden rounded-lg bg-cream-100 sm:w-[150px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} className="size-full object-cover" />
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/barang/${item.id}`}
                  className="block truncate text-[16.5px] font-bold text-heading hover:text-maroon"
                >
                  {item.title}
                </Link>
                <p className="mt-1 text-[17px] font-extrabold text-maroon">
                  {rupiah(item.price)}
                </p>

                {isQueue ? (
                  <>
                    <p className="mt-2.5 text-[12px] font-semibold text-[#5d484e]">
                      Posisi antrean: {position}
                    </p>
                    <p className="mt-1 text-[11.5px] text-[#8a787d]">
                      Tunggu konfirmasi penjual. Belum ada reservasi.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-2.5 text-[12px] font-semibold text-[#5d484e]">
                      {order?.status === "COMPLETED"
                        ? `COD selesai · ${order.completedAt ? formatDate(order.completedAt) : ""}`
                        : `COD · ${order?.meetPoint}`}
                    </p>
                    <p className="mt-1 text-[11.5px] text-[#8a787d]">
                      {order?.status === "COMPLETED"
                        ? "Barang ditandai terjual oleh penjual."
                        : "Sepakati waktu COD langsung lewat WhatsApp."}
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-row items-center justify-between gap-4 sm:w-[235px] sm:flex-col sm:items-end">
                <span className="pill">{statusLabel}</span>

                {isQueue ? (
                  <form action={contactSellerAction} className="sm:w-full">
                    <input type="hidden" name="itemId" value={item.id} />
                    <button type="submit" className="btn btn-outline w-full px-4 py-2.5 text-[12px]">
                      Lanjut ke WhatsApp
                      <Icon name="arrow-right" size={13} />
                    </button>
                  </form>
                ) : order?.status === "COMPLETED" ? (
                  order.review ? (
                    <span className="btn btn-outline cursor-default px-4 py-2.5 text-[12px] text-[#7d6c71] sm:w-full">
                      <Icon name="check" size={14} />
                      Ulasan terkirim
                    </span>
                  ) : (
                    <Link href={`/ulasan/${order.id}`} className="btn btn-primary px-4 py-2.5 text-[12px] sm:w-full">
                      Beri ulasan
                      <Icon name="arrow-right" size={13} />
                    </Link>
                  )
                ) : (
                  <a
                    href={waLink(
                      item.seller.whatsapp,
                      `Halo ${item.seller.name}, saya ${user.name} (NIM ${user.nim}). Saya memesan "${item.title}" (${item.code}) di JUBELMA. Mari sepakati waktu COD di ${order?.meetPoint}.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline px-4 py-2.5 text-[12px] sm:w-full"
                  >
                    Hubungi penjual
                    <Icon name="arrow-right" size={13} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-[11.5px] leading-relaxed text-[#8a787d]">
        Belum cocok saat COD? Pembatalan disepakati dengan penjual; antrean berikutnya akan
        dilayani.
      </p>
    </div>
  );
}
