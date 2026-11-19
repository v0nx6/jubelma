import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/icons";
import { Notice } from "@/components/Ui";
import { cancelOrderAction, markSoldAction } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { ITEM_STATUS_LABEL } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { formatDate, rupiah, waLink } from "@/lib/format";

export const metadata = { title: "Serah terima COD" };

export default async function CodPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("/jualan");
  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      orders: {
        where: { status: { in: ["ORDERED", "COMPLETED"] } },
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { buyer: true },
      },
    },
  });

  if (!item || item.sellerId !== user.id) notFound();

  const order = item.orders[0];
  if (!order) redirect(`/jualan/${item.id}/antrean`);

  const completed = order.status === "COMPLETED";

  return (
    <div className="container-page pt-6">
      <Breadcrumbs
        items={[
          { label: "Penjualan", href: "/jualan" },
          { label: item.title, href: `/barang/${item.id}` },
          { label: "COD" },
        ]}
      />

      <div className="mt-6">
        <h1 className="h-display">Satu langkah lagi, barang berpindah.</h1>
        <p className="mt-2 text-[13.5px] text-[#7d6c71]">
          Konfirmasi transaksi hanya setelah serah terima langsung dengan pembeli.
        </p>
      </div>

      {completed && (
        <div className="mt-5">
          <Notice tone="success">
            Transaksi ini sudah selesai pada{" "}
            {order.completedAt ? formatDate(order.completedAt) : "hari ini"}. Pembeli sudah
            dapat meninggalkan ulasan.
          </Notice>
        </div>
      )}

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
        <section className="card p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="h-[132px] w-full shrink-0 overflow-hidden rounded-lg bg-cream-100 sm:h-[124px] sm:w-[190px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="size-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="pill">{ITEM_STATUS_LABEL[item.status] ?? item.status}</span>
              <h2 className="mt-2.5 text-[23px] leading-tight font-extrabold text-heading">
                {item.title}
              </h2>
              <p className="mt-2.5 text-[24px] font-extrabold text-maroon">
                {rupiah(item.price)}
              </p>
              <p className="mt-1 text-[11px] text-[#a29196]">{item.code}</p>
            </div>
          </div>

          <div className="mt-6 space-y-5 border-t border-line-soft pt-5">
            <div>
              <p className="text-[11.5px] text-[#8a787d]">Pembeli terpilih</p>
              <p className="mt-1 text-[16px] font-bold text-heading">{order.buyer.name}</p>
              <p className="mt-0.5 text-[11.5px] text-[#8a787d]">{order.buyer.major}</p>
            </div>

            <div>
              <p className="text-[11.5px] text-[#8a787d]">Titik temu</p>
              <p className="mt-1 text-[16px] font-bold text-heading">{order.meetPoint}</p>
            </div>

            <div>
              <p className="text-[11.5px] text-[#8a787d]">Waktu pertemuan</p>
              <p className="mt-1 text-[16px] font-bold text-heading">
                {completed && order.completedAt
                  ? `Selesai ${formatDate(order.completedAt)}`
                  : "Disepakati langsung via WhatsApp"}
              </p>
            </div>
          </div>

          <a
            href={waLink(
              order.buyer.whatsapp,
              `Halo ${order.buyer.name}, saya ${user.name} dari JUBELMA. Saya siap COD untuk "${item.title}" (${item.code}) seharga ${rupiah(item.price)} di ${order.meetPoint}. Kapan waktu yang cocok?`,
            )}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline mt-6 w-full sm:w-fit"
          >
            Hubungi pembeli
            <Icon name="arrow-right" size={14} />
          </a>

          <p className="mt-5 text-[11px] leading-relaxed text-[#8a787d]">
            Pembayaran tidak diproses oleh JUBELMA. Tidak ada konfirmasi transfer atau unggahan
            bukti pembayaran.
          </p>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[14px] border border-[#f6ded2] bg-[#fff1e9] p-6">
            <h2 className="text-[20px] font-extrabold">Sudah serah terima?</h2>
            <p className="mt-2 text-[11.5px] text-[#8a6a70]">
              Periksa kembali sebelum menyelesaikan:
            </p>

            <ul className="mt-3.5 space-y-2 text-[12px] text-[#6a4a52]">
              {[
                "Barang sudah diterima pembeli",
                "Pembayaran COD sudah diterima",
                "Pembeli sudah memeriksa kondisi",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <Icon name="check" size={14} className="mt-0.5 text-[#9b1735]" />
                  {line}
                </li>
              ))}
            </ul>

            {completed ? (
              <div className="mt-5 rounded-lg bg-white/70 px-4 py-3 text-[11.5px] font-semibold text-[#245c36]">
                Transaksi selesai. Terima kasih sudah berjualan di kampus.
              </div>
            ) : (
              <form action={markSoldAction} className="mt-5">
                <input type="hidden" name="orderId" value={order.id} />
                <button type="submit" className="btn btn-primary w-full">
                  Tandai terjual
                </button>
              </form>
            )}

            <p className="mt-3 text-[10.5px] leading-relaxed text-[#9b6a72]">
              Antrean ditutup dan peminat tersisa mendapat notifikasi bahwa barang terjual.
            </p>
          </div>

          {!completed && (
            <div className="card p-6">
              <h2 className="text-[16px] font-extrabold">Transaksi tidak jadi?</h2>
              <p className="mt-2 text-[11.5px] leading-relaxed text-[#8a787d]">
                Kembalikan status ke Tersedia, lalu layani peminat berikutnya dalam antrean.
              </p>
              <form action={cancelOrderAction} className="mt-4">
                <input type="hidden" name="orderId" value={order.id} />
                <button type="submit" className="btn btn-outline w-full text-[12.5px]">
                  Batalkan pesanan
                </button>
              </form>
            </div>
          )}

          {completed && (
            <Link href={`/penjual/${user.id}`} className="btn btn-outline w-full">
              Lihat ulasan di profil penjual
              <Icon name="arrow-right" size={14} />
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
