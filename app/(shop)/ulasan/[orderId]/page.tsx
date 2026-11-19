import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/icons";
import { ReviewForm } from "@/components/ReviewForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, rupiah } from "@/lib/format";

export const metadata = { title: "Beri ulasan" };

export default async function UlasanPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const user = await requireUser(`/ulasan/${orderId}`);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { item: true, seller: true, review: true },
  });

  if (!order || order.buyerId !== user.id) notFound();
  if (order.status !== "COMPLETED" || order.review) {
    redirect("/pembelian?tab=selesai");
  }

  return (
    <div className="container-page pt-6">
      <Breadcrumbs
        items={[
          { label: "Pembelian saya", href: "/pembelian" },
          { label: "Selesai", href: "/pembelian?tab=selesai" },
          { label: "Beri ulasan" },
        ]}
      />

      <div className="mt-6">
        <h1 className="h-display">Ceritakan pengalamanmu.</h1>
        <p className="mt-2 text-[13.5px] text-[#7d6c71]">
          Ulasan jujurmu membantu teman kampus membeli dengan lebih yakin.
        </p>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
        <section className="card p-6 sm:p-7">
          <span className="pill">Transaksi selesai</span>
          <ReviewForm orderId={order.id} sellerName={order.seller.name} />
        </section>

        <aside className="overflow-hidden rounded-[14px] border border-[#f6ded2] bg-[#fff1e9]">
          <div className="h-[174px] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={order.item.image} alt={order.item.title} className="size-full object-cover" />
          </div>
          <div className="p-6">
            <h2 className="text-[19px] leading-snug font-extrabold text-heading">
              {order.item.title}
            </h2>
            <p className="mt-3 text-[23px] font-extrabold text-maroon">
              {rupiah(order.item.price)}
            </p>
            <p className="mt-4 text-[12px] text-[#7a4a52]">Penjual: {order.seller.name}</p>
            <p className="mt-1 text-[11.5px] text-[#8a6a70]">
              COD selesai · {order.completedAt ? formatDate(order.completedAt) : "hari ini"}
            </p>

            <div className="mt-5 flex items-start gap-2 border-t border-[#f3d8cc] pt-4 text-[11px] leading-relaxed text-[#8a6a70]">
              <Icon name="info" size={14} className="mt-0.5 shrink-0" />
              Hanya pembeli pada transaksi berstatus terjual yang dapat memberi ulasan.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
