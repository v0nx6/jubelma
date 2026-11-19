"use client";

import { useActionState } from "react";
import { createItemAction } from "@/lib/actions";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { Icon } from "./icons";
import { ImagePicker } from "./ImagePicker";
import { SubmitButton } from "./SubmitButton";
import { Alert } from "./Ui";

export function SellForm() {
  const [state, formAction] = useActionState(createItemAction, {});
  const values = state.values ?? {};

  return (
    <form action={formAction} className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
      <section className="card p-6 sm:p-7">
        <h2 className="text-[18px] font-extrabold">01 &nbsp;Foto &amp; informasi barang</h2>

        {state.error && (
          <div className="mt-4">
            <Alert error={state.error} />
          </div>
        )}

        <div className="mt-5 grid gap-6 sm:grid-cols-[300px_minmax(0,1fr)]">
          <ImagePicker />
          <div>
            <p className="text-[15px] font-bold text-heading">Tampilkan kondisi asli barang</p>
            <p className="mt-2 text-[12px] leading-relaxed text-[#8a787d]">
              Foto bagian depan, belakang, dan detail minus. Foto yang jelas membuat pembeli
              lebih yakin.
            </p>
            <div className="mt-4 rounded-lg bg-[#fff6f1] px-4 py-3 text-[11.5px] leading-relaxed text-[#8a6a70]">
              Barang dengan foto asli mendapat lebih banyak peminat. Jangan gunakan foto
              katalog.
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="title" className="label">
              Nama barang <span className="text-[#b81750]">*</span>
            </label>
            <input
              id="title"
              name="title"
              defaultValue={values.title ?? ""}
              placeholder="Contoh: Kabel LAN Cat6 3 meter"
              className="input"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="label">
                Kategori <span className="text-[#b81750]">*</span>
              </label>
              <select
                id="category"
                name="category"
                defaultValue={values.category ?? ""}
                className="select"
                required
              >
                <option value="" disabled>
                  Pilih kategori
                </option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="label">
                Harga (Rp) <span className="text-[#b81750]">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min={1}
                step={1}
                defaultValue={values.price ?? ""}
                placeholder="20.000"
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="usageMonths" className="label">
                Lama pemakaian (bulan) <span className="text-[#b81750]">*</span>
              </label>
              <input
                id="usageMonths"
                name="usageMonths"
                type="number"
                min={0}
                max={600}
                defaultValue={values.usageMonths ?? ""}
                placeholder="6"
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="condition" className="label">
                Kondisi <span className="text-[#b81750]">*</span>
              </label>
              <select
                id="condition"
                name="condition"
                defaultValue={values.condition ?? "Baik"}
                className="select"
                required
              >
                {CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="warrantyDays" className="label">
                Garansi (hari) <span className="text-[#b81750]">*</span>
              </label>
              <input
                id="warrantyDays"
                name="warrantyDays"
                type="number"
                min={0}
                max={365}
                defaultValue={values.warrantyDays ?? "7"}
                placeholder="7"
                className="input"
                required
              />
              <p className="mt-1.5 text-[10.5px] text-[#8a787d]">Isi 0 jika tanpa garansi.</p>
            </div>
          </div>

          <div>
            <label htmlFor="codPoint" className="label">
              Titik temu COD <span className="text-[#b81750]">*</span>
            </label>
            <input
              id="codPoint"
              name="codPoint"
              defaultValue={values.codPoint ?? ""}
              placeholder="Perpustakaan kampus"
              className="input"
              required
            />
            <p className="mt-1.5 text-[11px] text-[#8a787d]">
              Titik temu berupa teks; tidak ada peta atau pengiriman.
            </p>
          </div>

          <div>
            <label htmlFor="description" className="label">
              Deskripsi barang <span className="text-[#b81750]">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={values.description ?? ""}
              placeholder="Jelaskan kondisi, kelengkapan, dan alasan menjual. Minimal 20 karakter."
              className="textarea"
              minLength={20}
              maxLength={1200}
              required
            />
            <p className="mt-1.5 text-[11px] text-[#8a787d]">
              Sebutkan minus bila ada. Kejujuran mempercepat transaksi.
            </p>
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-[14px] border border-[#f6ded2] bg-[#fff1e9] p-6">
          <h2 className="text-[18px] font-extrabold">02 &nbsp;Cek sebelum tayang</h2>
          <p className="mt-2 text-[11.5px] text-[#8a6a70]">Pastikan semua syarat terpenuhi.</p>

          <ul className="mt-4 space-y-2.5 text-[12px] text-[#6a4a52]">
            {[
              "Harga lebih dari Rp0",
              "Lama pemakaian sudah diisi",
              "Kondisi baik / layak pakai",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <Icon name="check" size={14} className="mt-0.5 text-[#9b1735]" />
                {line}
              </li>
            ))}
          </ul>

          <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-[11.5px] leading-relaxed font-semibold text-[#7a2438]">
            <input type="checkbox" name="checked" className="mt-0.5 size-3.5 shrink-0 accent-[#800021]" required />
            Saya sudah memeriksa fungsi dan kelayakan barang ini.
          </label>

          <p className="mt-3 text-[10.5px] leading-relaxed text-[#9b6a72]">
            Barang hampir rusak tidak boleh tayang. Pernyataan pemeriksaan wajib dicentang.
          </p>

          <SubmitButton className="btn btn-primary mt-5 w-full" pendingLabel="Mengunggah...">
            Tayangkan barang
            <Icon name="arrow-right" size={15} />
          </SubmitButton>
        </div>

        <div className="rounded-[14px] bg-[#fff7f2] p-6">
          <p className="text-[15px] font-extrabold text-heading">Satu unggahan, satu barang.</p>
          <p className="mt-2 text-[11.5px] leading-relaxed text-[#8a6a70]">
            ID barang dibuat otomatis.
            <br />
            Barang tayang dengan status Tersedia.
            <br />
            Jika data belum lengkap, perbaiki kolom yang ditandai sebelum melanjutkan.
          </p>
        </div>
      </aside>
    </form>
  );
}
