import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/icons";
import { Notice } from "@/components/Ui";
import { chooseBuyerAction } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { ITEM_STATUS_LABEL } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { formatDateShort, rupiah, waLink } from "@/lib/format";

export const metadata = { title: "Antrean peminat" };

export default async function AntreanPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ gagal?: string; dibatalkan?: string }>;
}) {
  const user = await requireUser("/jualan");
  const { id } = await params;
  const { gagal, dibatalkan } = await searchParams;

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      interests: {
        include: { buyer: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!item || item.sellerId !== user.id) notFound();

  const waiting = item.interests.filter((interest) => interest.status === "WAITING");
  const chosen = item.interests.find((interest) => interest.status === "CHOSEN");
  const first = chosen ?? waiting[0];
  const canChoose = item.status === "AVAILABLE" && waiting.length > 0;

  return (
    <div className="container-page pt-6">
      <Breadcrumbs
        items={[
          { label: "Penjualan", href: "/jualan" },
          { label: item.title, href: `/barang/${item.id}` },
          { label: "Peminat" },
        ]}
      />

      {gagal === "status" && (
        <div className="mt-5">
          <Notice>
            Status barang sudah berubah. Muat ulang halaman untuk melihat antrean terbaru.
          </Notice>
        </div>
      )}
      {dibatalkan === "1" && (
        <div className="mt-5">
          <Notice>
            Pesanan dibatalkan. Barang kembali berstatus Tersedia dan peminat berikutnya bisa
            dilayani.
          </Notice>
        </div>
      )}

      <div className="mt-6">
        <h1 className="h-display">Layani yang datang lebih dulu.</h1>
        <p className="mt-2 text-[13.5px] text-[#7d6c71]">
          Antrean mengikuti waktu menghubungi. Pilih peminat terdepan untuk melanjutkan COD.
        </p>
      </div>

      <div className="card mt-6 flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center">
        <div className="h-[104px] w-full shrink-0 overflow-hidden rounded-lg bg-cream-100 sm:w-[150px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} className="size-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-bold text-heading">{item.title}</p>
          <p className="mt-1.5 text-[11.5px] text-[#8a787d]">
            {item.code} &nbsp;·&nbsp; {rupiah(item.price)} &nbsp;·&nbsp; COD {item.codPoint}
          </p>
          <p className="mt-2 line-clamp-1 text-[11.5px] text-[#a29196]">{item.description}</p>
        </div>
        <span className="pill self-start sm:self-center">
          {ITEM_STATUS_LABEL[item.status] ?? item.status}
        </span>
      </div>

      <div className="mt-8 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_324px]">
        <section>
          <h2 className="text-[19px] font-extrabold">
            {waiting.length + (chosen ? 1 : 0)} peminat dalam antrean
          </h2>

          <div className="mt-4 space-y-3">
            {item.interests.length === 0 && (
              <div className="card px-6 py-8">
                <p className="text-[15px] font-bold text-heading">Belum ada peminat.</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#8a787d]">
                  Bagikan tautan barangmu ke teman kampus. Peminat akan muncul di sini setelah
                  menghubungi lewat WhatsApp.
                </p>
                <Link href={`/barang/${item.id}`} className="btn btn-outline mt-4 w-fit px-4 py-2.5 text-[12px]">
                  Lihat halaman barang
                </Link>
              </div>
            )}

            {item.interests.map((interest, index) => {
              const isChosen = interest.status === "CHOSEN";
              const isFirst = !chosen && index === 0 && interest.status === "WAITING";
              const highlighted = isChosen || isFirst;

              return (
                <div
                  key={interest.id}
                  className={`card flex items-center gap-4 px-5 py-4 ${
                    highlighted ? "border-[#f3d3c5] bg-[#fff6f1]" : ""
                  }`}
                >
                  <span
                    className={`text-[22px] font-extrabold tracking-[-0.02em] ${
                      highlighted ? "text-[#9b1735]" : "text-[#c9b2b8]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold text-heading">
                      {interest.buyer.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#8a787d]">
                      {formatDateShort(interest.createdAt)} ·{" "}
                      {interest.createdAt.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="pill">
                    {isChosen ? "Pembeli terpilih" : isFirst ? "Peminat terdepan" : "Menunggu"}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-[11.5px] leading-relaxed text-[#8a787d]">
            Jika transaksi batal, kembalikan ke Tersedia lalu layani peminat berikutnya.
          </p>
        </section>

        <aside className="card sticky top-5 p-6">
          {canChoose && first ? (
            <>
              <h2 className="text-[20px] font-extrabold">
                Lanjutkan dengan {first.buyer.name.split(" ")[0]}
              </h2>
              <p className="mt-3 text-[12px] leading-relaxed text-[#7d6c71]">
                Setelah dipilih, status barang menjadi Dipesan. Sepakati waktu COD langsung
                melalui WhatsApp.
              </p>

              <form action={chooseBuyerAction} className="mt-5">
                <input type="hidden" name="interestId" value={first.id} />
                <button type="submit" className="btn btn-primary w-full">
                  Pilih pembeli terdepan
                </button>
              </form>

              <a
                href={waLink(
                  first.buyer.whatsapp,
                  `Halo ${first.buyer.name}, saya ${user.name} dari JUBELMA. Kamu peminat terdepan untuk "${item.title}" (${item.code}) seharga ${rupiah(item.price)}. Mari sepakati waktu COD di ${item.codPoint}.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline mt-2.5 w-full"
              >
                Hubungi via WhatsApp
                <Icon name="arrow-right" size={14} />
              </a>

              <div className="mt-5 border-t border-line-soft pt-4">
                <p className="text-[12px] font-bold text-heading">Saat COD selesai</p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#8a787d]">
                  Tandai terjual agar peminat lain otomatis mendapat pemberitahuan.
                </p>
              </div>
            </>
          ) : chosen ? (
            <>
              <h2 className="text-[20px] font-extrabold">
                Menunggu COD dengan {chosen.buyer.name.split(" ")[0]}
              </h2>
              <p className="mt-3 text-[12px] leading-relaxed text-[#7d6c71]">
                Pembeli sudah dipilih dan barang berstatus Dipesan. Selesaikan serah terima
                langsung di kampus.
              </p>
              <Link href={`/jualan/${item.id}/cod`} className="btn btn-primary mt-5 w-full">
                Kelola COD
                <Icon name="arrow-right" size={14} />
              </Link>
              <a
                href={waLink(
                  chosen.buyer.whatsapp,
                  `Halo ${chosen.buyer.name}, saya ${user.name} dari JUBELMA. Saya sudah memilihmu sebagai pembeli "${item.title}". Mari sepakati waktu COD di ${item.codPoint}.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline mt-2.5 w-full"
              >
                Hubungi pembeli
                <Icon name="arrow-right" size={14} />
              </a>
            </>
          ) : (
            <>
              <h2 className="text-[20px] font-extrabold">Belum ada yang bisa dipilih</h2>
              <p className="mt-3 text-[12px] leading-relaxed text-[#7d6c71]">
                {item.status === "SOLD"
                  ? "Barang ini sudah terjual. Antrean ditutup otomatis."
                  : "Peminat akan muncul di sini setelah menghubungi penjual. Kamu bisa membagikan tautan barang ke teman kampus."}
              </p>
              {item.status === "AVAILABLE" && (
                <Link href={`/barang/${item.id}`} className="btn btn-outline mt-5 w-full">
                  Buka halaman barang
                </Link>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
