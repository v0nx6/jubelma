import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/icons";
import { Notice } from "@/components/Ui";
import { getSellerStats } from "@/lib/data";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ITEM_STATUS_LABEL } from "@/lib/constants";
import { rupiah } from "@/lib/format";

export const metadata = { title: "Jualan saya" };

const TABS = [
  { key: "semua", label: "Semua" },
  { key: "tersedia", label: "Tersedia" },
  { key: "dipesan", label: "Dipesan" },
  { key: "terjual", label: "Terjual" },
];

const PAGE_SIZE = 5;

export default async function JualanPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string; tayang?: string; selebrasi?: string }>;
}) {
  const user = await requireUser("/jualan");
  const sp = await searchParams;
  const tab = sp.tab && TABS.some((t) => t.key === sp.tab) ? sp.tab : "semua";
  const page = Math.max(1, Number(sp.page) || 1);

  const [stats, allItems] = await Promise.all([
    getSellerStats(user.id),
    prisma.item.findMany({
      where: { sellerId: user.id },
      include: {
        interests: { where: { status: "WAITING" }, select: { id: true } },
        orders: {
          where: { status: { in: ["ORDERED", "COMPLETED"] } },
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { buyer: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const counts = {
    semua: allItems.length,
    tersedia: allItems.filter((item) => item.status === "AVAILABLE").length,
    dipesan: allItems.filter((item) => item.status === "ORDERED").length,
    terjual: allItems.filter((item) => item.status === "SOLD").length,
  };

  const statusForTab: Record<string, string | undefined> = {
    semua: undefined,
    tersedia: "AVAILABLE",
    dipesan: "ORDERED",
    terjual: "SOLD",
  };

  const filtered = allItems.filter(
    (item) => !statusForTab[tab] || item.status === statusForTab[tab],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const firstName = user.name.split(" ")[0];

  const tabHref = (key: string) =>
    key === "semua" ? "/jualan" : `/jualan?tab=${key}`;

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "Jualan" }]} />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[30px] leading-[1.12] font-extrabold tracking-[-0.03em] text-[#6d0a21] sm:text-[34px]">
            Halo, {firstName}. Siap berbagi manfaat?
          </h1>
          <p className="mt-2 text-[13.5px] text-[#7d6c71]">
            Kelola barang dan layani peminat tanpa harus promosi berulang.
          </p>
        </div>
        <Link href="/jual" className="btn btn-primary">
          <Icon name="plus" size={16} />
          Jual barang baru
        </Link>
      </div>

      {sp.tayang === "1" && (
        <div className="mt-5">
          <Notice tone="success">
            Barangmu sudah tayang di katalog. Peminat bisa menghubungimu lewat WhatsApp.
          </Notice>
        </div>
      )}
      {sp.selebrasi === "1" && (
        <div className="mt-5">
          <Notice tone="success">
            Transaksi selesai. Barang ditandai terjual dan seluruh peminat sudah diberi tahu.
          </Notice>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-xl bg-maroon px-5 py-4 text-[#ffe4d8]">
          <p className="text-[12px] font-medium">Tersedia</p>
          <p className="mt-1 text-[34px] leading-none font-extrabold tracking-[-0.02em] text-white">
            {stats.available}
          </p>
        </div>
        <div className="card px-5 py-4">
          <p className="text-[12px] text-[#7d6c71]">Dipesan</p>
          <p className="mt-1 text-[34px] leading-none font-extrabold text-maroon">{stats.ordered}</p>
        </div>
        <div className="card px-5 py-4">
          <p className="text-[12px] text-[#7d6c71]">Terjual</p>
          <p className="mt-1 text-[34px] leading-none font-extrabold text-maroon">{stats.sold}</p>
        </div>
        <div className="card px-5 py-4">
          <p className="text-[12px] text-[#7d6c71]">Rating penjual</p>
          <p className="mt-1 text-[34px] leading-none font-extrabold text-maroon">
            {stats.reviewCount > 0 ? stats.rating.toFixed(1).replace(".", ",") : "—"}
          </p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-[22px] font-extrabold">Barang jualanmu</h2>

        <div className="mt-4 flex gap-1.5 overflow-x-auto rounded-lg bg-[#fffaf7] p-1.5">
          {TABS.map((item) => (
            <Link
              key={item.key}
              href={tabHref(item.key)}
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

        <div className="card mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#fff6f1] text-[10.5px] font-bold tracking-[0.06em] text-[#8a6a70] uppercase">
                  <th className="px-4 py-3.5 sm:px-5">Barang</th>
                  <th className="hidden px-4 py-3.5 sm:table-cell sm:px-5">Harga</th>
                  <th className="hidden px-5 py-3.5 md:table-cell">Status</th>
                  <th className="hidden px-5 py-3.5 lg:table-cell">Peminat</th>
                  <th className="px-4 py-3.5 text-right sm:px-5">Kelola</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-9 text-center">
                      <p className="text-[14px] font-bold text-heading">Belum ada barang di tab ini.</p>
                      <p className="mt-1.5 text-[12px] text-[#8a787d]">
                        Unggah barang baru agar teman kampus bisa menemukannya.
                      </p>
                      <Link href="/jual" className="btn btn-primary mt-4 px-4 py-2.5 text-[12px]">
                        Jual barang
                      </Link>
                    </td>
                  </tr>
                )}

                {visible.map((item) => {
                  const waiting = item.interests.length;
                  const order = item.orders[0];

                  return (
                    <tr key={item.id} className="border-t border-line-soft text-[12.5px]">
                      <td className="px-4 py-3.5 sm:px-5">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-cream-100 sm:size-[52px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt="" className="size-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/barang/${item.id}`}
                              className="block max-w-[150px] truncate font-bold text-heading hover:text-maroon sm:max-w-[260px]"
                            >
                              {item.title}
                            </Link>
                            <p className="mt-0.5 text-[10.5px] text-[#a29196]">{item.code}</p>
                            <p className="mt-0.5 text-[11px] font-extrabold text-maroon sm:hidden">
                              {rupiah(item.price)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3.5 font-extrabold whitespace-nowrap text-maroon sm:table-cell sm:px-5">
                        {rupiah(item.price)}
                      </td>
                      <td className="hidden px-5 py-3.5 md:table-cell">
                        <span className="pill">{ITEM_STATUS_LABEL[item.status] ?? item.status}</span>
                      </td>
                      <td className="hidden px-5 py-3.5 text-[11.5px] text-[#7d6c71] lg:table-cell">
                        {item.status === "AVAILABLE"
                          ? `${waiting} peminat`
                          : item.status === "ORDERED"
                            ? `1 dipilih`
                            : "Selesai"}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap sm:px-5">
                        {item.status === "AVAILABLE" ? (
                          <Link
                            href={`/jualan/${item.id}/antrean`}
                            className="inline-flex items-center gap-1 font-bold text-[#9b1735] hover:underline"
                          >
                            Lihat antrean
                            <Icon name="arrow-right" size={12} />
                          </Link>
                        ) : item.status === "ORDERED" && order ? (
                          <Link
                            href={`/jualan/${item.id}/cod`}
                            className="inline-flex items-center gap-1 font-bold text-[#9b1735] hover:underline"
                          >
                            Kelola COD
                            <Icon name="arrow-right" size={12} />
                          </Link>
                        ) : (
                          <Link
                            href={`/barang/${item.id}`}
                            className="inline-flex items-center gap-1 font-bold text-[#9b1735] hover:underline"
                          >
                            Lihat detail
                            <Icon name="arrow-right" size={12} />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11.5px] text-[#8a787d]">
            Menampilkan {visible.length} dari {filtered.length} barang
          </p>
          <div className="flex gap-2">
            <Link
              href={`${tabHref(tab)}${tabHref(tab).includes("?") ? "&" : "?"}page=${Math.max(1, currentPage - 1)}`}
              aria-disabled={currentPage <= 1}
              className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2.5 text-[12px] font-bold text-heading transition hover:bg-cream-50 ${
                currentPage <= 1 ? "pointer-events-none opacity-45" : ""
              }`}
            >
              <Icon name="arrow-left" size={13} />
              Sebelumnya
            </Link>
            <Link
              href={`${tabHref(tab)}${tabHref(tab).includes("?") ? "&" : "?"}page=${Math.min(totalPages, currentPage + 1)}`}
              aria-disabled={currentPage >= totalPages}
              className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2.5 text-[12px] font-bold text-heading transition hover:bg-cream-50 ${
                currentPage >= totalPages ? "pointer-events-none opacity-45" : ""
              }`}
            >
              Berikutnya
              <Icon name="arrow-right" size={13} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
