import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/icons";
import { ItemCard } from "@/components/ItemCard";
import { SortSelect } from "@/components/SortSelect";
import { CATEGORIES } from "@/lib/constants";
import { getItems } from "@/lib/data";

export const metadata = { title: "Jelajahi barang" };

type SearchParams = {
  q?: string;
  kategori?: string;
  max?: string;
  tersedia?: string;
  urut?: string;
};

export default async function BarangPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const category = sp.kategori ?? "";
  const maxPrice = Number(sp.max) || 0;
  const availableOnly = sp.tersedia === "1";
  const sort = sp.urut ?? "baru";

  const items = await getItems({
    q,
    category,
    maxPrice,
    availableOnly,
    sort,
  });

  const promo = (
    <div className="flex flex-col justify-center rounded-[14px] border border-[#f7e1d5] bg-[#ffece2] px-7 py-8 sm:col-span-2 xl:col-span-2">
      <h3 className="text-[27px] leading-[1.18] font-extrabold tracking-[-0.025em] text-[#6d0a21]">
        Lebih dekat.
        <br />
        Lebih tenang.
      </h3>
      <p className="mt-4 max-w-[360px] text-[13.5px] leading-relaxed text-[#7a4a52]">
        Pilih barang <span className="font-semibold">→</span> hubungi penjual{" "}
        <span className="font-semibold">→</span> ketemu di kampus. Periksa barang dulu,
        baru bayar saat COD.
      </p>
      <Link
        href="/ketentuan#cara-belanja"
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-3 text-[13px] font-bold text-maroon transition hover:bg-[#fffaf6]"
      >
        Pelajari cara belanja
        <Icon name="arrow-right" size={15} />
      </Link>
    </div>
  );

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "Jelajahi barang" }]} />

      <div className="mt-6">
        <h1 className="h-display">Temukan yang kamu butuhkan.</h1>
        <p className="mt-2 text-[13.5px] text-[#7d6c71]">
          Barang pilihan teman kampus, dengan harga yang bersahabat.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-7 lg:grid-cols-[228px_minmax(0,1fr)]">
        {/* Filters */}
        <aside className="card sticky top-5 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold">Filter barang</h2>
            <Link href="/barang" className="text-[11.5px] font-bold text-[#9b1735] hover:underline">
              Reset
            </Link>
          </div>

          <form action="/barang" className="mt-5 space-y-5">
            {q && <input type="hidden" name="q" value={q} />}
            {sort !== "baru" && <input type="hidden" name="urut" value={sort} />}

            <fieldset>
              <legend className="mb-2.5 text-[12.5px] font-bold text-[#4a1622]">Kategori</legend>
              <div className="space-y-2.5">
                <label className="flex cursor-pointer items-center gap-2.5 text-[12.5px] text-[#5d484e]">
                  <input
                    type="radio"
                    name="kategori"
                    value=""
                    defaultChecked={!category}
                    className="size-[15px] accent-[#800021]"
                  />
                  Semua kategori
                </label>
                {CATEGORIES.map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-center gap-2.5 text-[12.5px] text-[#5d484e]"
                  >
                    <input
                      type="radio"
                      name="kategori"
                      value={item}
                      defaultChecked={category === item}
                      className="size-[15px] accent-[#800021]"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>

            <hr className="border-line-soft" />

            <div>
              <label htmlFor="max" className="mb-2.5 block text-[12.5px] font-bold text-[#4a1622]">
                Harga maksimal
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[12.5px] text-[#8a787d]">
                  Rp
                </span>
                <input
                  id="max"
                  name="max"
                  type="number"
                  min={0}
                  step={5000}
                  defaultValue={maxPrice || ""}
                  placeholder="3.500.000"
                  className="input bg-[#fff7f2] py-2.5 pl-9 text-[12.5px]"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-[12.5px] font-semibold text-[#5d484e]">
              <input
                type="checkbox"
                name="tersedia"
                value="1"
                defaultChecked={availableOnly}
                className="size-3.5 accent-[#800021]"
              />
              Hanya barang tersedia
            </label>

            <button type="submit" className="btn btn-primary w-full">
              Terapkan filter
            </button>
          </form>
        </aside>

        {/* Results */}
        <section>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-semibold text-[#5d484e]">
              {items.length} barang ditemukan
            </p>
            <SortSelect />
          </div>

          {items.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
              {promo}
            </div>
          ) : (
            <div className="card mt-4 px-7 py-9">
              <h3 className="text-[24px] font-extrabold">Belum ketemu yang pas.</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#7d6c71]">
                Coba kategori lain atau naikkan batas harga maksimalmu.
              </p>
              <Link
                href="/barang"
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-line px-5 py-2.5 text-[12.5px] font-bold text-heading transition hover:bg-cream-50"
              >
                Reset filter
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
