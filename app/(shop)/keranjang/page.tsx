import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon, WhatsAppIcon } from "@/components/icons";
import { Notice } from "@/components/Ui";
import { contactSellerAction, removeFromCartAction } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { ITEM_STATUS_LABEL } from "@/lib/constants";
import { getCart } from "@/lib/data";
import { rupiah } from "@/lib/format";

export const metadata = { title: "Keranjang" };

export default async function KeranjangPage() {
  const user = await requireUser("/keranjang");
  const cart = await getCart(user.id);

  const available = cart.filter((entry) => entry.item.status === "AVAILABLE");
  const sold = cart.filter((entry) => entry.item.status !== "AVAILABLE");
  const total = available.reduce((sum, entry) => sum + entry.item.price, 0);
  const firstAvailable = available[0];

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "Keranjang" }]} />

      <div className="mt-6">
        <h1 className="h-display">Keranjang incaranmu</h1>
        <p className="mt-2 text-[13.5px] text-[#7d6c71]">
          Simpan dulu, hubungi penjual saat kamu sudah siap.
        </p>
      </div>

      <div className="mt-6">
        <Notice>
          Keranjang bukan reservasi. Setiap barang hanya tersedia 1 unit; status dapat
          berubah kapan saja.
        </Notice>
      </div>

      {cart.length === 0 ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="card p-8">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-cream-100 text-maroon">
              <Icon name="cart" size={21} />
            </span>
            <h2 className="mt-4 text-[22px] font-extrabold">Belum ada incaran?</h2>
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-[#7d6c71]">
              Simpan barang yang menarik di keranjang. Kamu bisa menghubungi penjual
              kapan saja.
            </p>
            <Link
              href="/barang"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#fff1e9] px-5 py-3 text-[13px] font-bold text-maroon transition hover:bg-[#ffe4d8]"
            >
              Jelajahi barang
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>

          <aside className="card h-fit p-6">
            <h2 className="text-[19px] font-extrabold">Ringkasan incaran</h2>
            <p className="mt-3 text-[12.5px] text-[#8a787d]">Belum ada barang tersimpan.</p>
            <div className="mt-5 border-t border-line-soft pt-4 text-[12px] leading-relaxed text-[#8a6a70]">
              Bayar langsung saat COD. Tidak ada biaya layanan atau ongkir.
            </div>
          </aside>
        </div>
      ) : (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section>
            <h2 className="text-[19px] font-extrabold">
              Barang tersimpan ({cart.length})
            </h2>

            <div className="mt-4 space-y-3">
              {[...available, ...sold].map((entry) => {
                const { item } = entry;
                const isAvailable = item.status === "AVAILABLE";

                return (
                  <article
                    key={entry.id}
                    className="card flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center"
                  >
                    <Link
                      href={`/barang/${item.id}`}
                      className="block h-[92px] w-full shrink-0 overflow-hidden rounded-lg bg-cream-100 sm:w-[138px]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="size-full object-cover"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11.5px] text-[#8a787d]">{item.seller.name}</p>
                      <Link
                        href={`/barang/${item.id}`}
                        className="mt-0.5 block truncate text-[15.5px] font-bold text-heading hover:text-maroon"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-1 text-[17px] font-extrabold text-maroon">
                        {rupiah(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:w-[168px] sm:flex-col sm:items-end sm:gap-2.5">
                      <div className="sm:text-right">
                        <span className="pill">{ITEM_STATUS_LABEL[item.status] ?? item.status}</span>
                        <p className="mt-1.5 text-[11px] text-[#8a787d]">
                          {isAvailable ? "1 barang · COD" : "Tidak bisa dihubungi"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {isAvailable && (
                          <form action={contactSellerAction}>
                            <input type="hidden" name="itemId" value={item.id} />
                            <button className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9b1735] hover:underline">
                              <WhatsAppIcon size={12} />
                              Hubungi penjual
                            </button>
                          </form>
                        )}
                        <form action={removeFromCartAction}>
                          <input type="hidden" name="cartItemId" value={entry.id} />
                          <button className="text-[11px] font-bold text-[#8a6a70] hover:text-maroon hover:underline">
                            Hapus
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/barang"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-[12.5px] font-bold text-heading transition hover:bg-cream-50"
              >
                <Icon name="arrow-left" size={14} />
                Lanjut jelajah
              </Link>
              <p className="text-[11.5px] text-[#8a787d]">
                Barang terjual tidak disertakan dalam total.
              </p>
            </div>
          </section>

          <aside className="card sticky top-5 p-6">
            <h2 className="text-[20px] font-extrabold">Ringkasan incaran</h2>
            <p className="mt-3 text-[12.5px] text-[#7d6c71]">
              {available.length} barang tersedia
            </p>

            <p className="mt-4 text-[12.5px] font-semibold text-[#5d484e]">Perkiraan total</p>
            <p className="mt-1 text-[28px] font-extrabold tracking-[-0.02em] text-maroon">
              {rupiah(total)}
            </p>

            <div className="mt-5 border-t border-line-soft pt-4">
              <p className="text-[12px] font-semibold text-[#5d484e]">Bayar langsung saat COD.</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-[#8a787d]">
                Tidak ada biaya layanan atau ongkir.
              </p>
            </div>

            {firstAvailable ? (
              <Link href={`/barang/${firstAvailable.id}`} className="btn btn-primary mt-5 w-full">
                Hubungi penjual per barang
                <Icon name="arrow-right" size={15} />
              </Link>
            ) : (
              <button disabled className="btn btn-primary mt-5 w-full">
                Tidak ada barang tersedia
              </button>
            )}

            <p className="mt-3 text-[11px] text-[#8a787d]">
              Total bukan tagihan pembayaran.
            </p>
          </aside>
        </div>
      )}

      {sold.length > 0 && (
        <div className="mt-5 rounded-xl border border-[#f6ded2] bg-[#fff1e9] px-5 py-4">
          <p className="text-[13px] font-bold text-heading">
            {sold.length} incaran sudah terjual
          </p>
          <p className="mt-1 text-[12px] text-[#8a6a70]">
            Hapus dari keranjang atau cari barang serupa di katalog.
          </p>
        </div>
      )}
    </div>
  );
}
