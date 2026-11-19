"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { registerAction } from "@/lib/actions";
import { MAJORS } from "@/lib/constants";
import { ArrowIcon } from "./ArrowIcon";
import { SubmitButton } from "./SubmitButton";
import { Alert } from "./Ui";

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, {});
  const [showPassword, setShowPassword] = useState(false);
  const values = state.values ?? {};

  return (
    <form action={formAction} className="mt-7 space-y-5">
      <Alert error={state.error} />

      <div>
        <label htmlFor="name" className="label">
          Nama lengkap <span className="text-[#b81750]">*</span>
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          defaultValue={values.name ?? ""}
          placeholder="Nama sesuai data mahasiswa"
          className="input"
          required
        />
      </div>

      <div>
        <label htmlFor="nim" className="label">
          NIM <span className="text-[#b81750]">*</span>
        </label>
        <input
          id="nim"
          name="nim"
          inputMode="numeric"
          defaultValue={values.nim ?? ""}
          placeholder="Nomor Induk Mahasiswa"
          className="input"
          required
        />
        <p className="mt-2 text-[11.5px] text-[#8a787d]">
          Wajib diisi. NIM tidak ditampilkan ke pengguna lain.
        </p>
      </div>

      <div>
        <label htmlFor="major" className="label">
          Jurusan <span className="text-[#b81750]">*</span>
        </label>
        <select
          id="major"
          name="major"
          defaultValue={values.major ?? ""}
          className="select"
          required
        >
          <option value="" disabled>
            Pilih jurusan
          </option>
          {MAJORS.map((major) => (
            <option key={major} value={major}>
              {major}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="whatsapp" className="label">
          Nomor WhatsApp <span className="text-[#b81750]">*</span>
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          inputMode="tel"
          defaultValue={values.whatsapp ?? ""}
          placeholder="08xxxxxxxxxx"
          className="input"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Kata sandi <span className="text-[#b81750]">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            className="input pr-16"
            minLength={8}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-[11.5px] font-bold text-[#9b1735]"
          >
            {showPassword ? "Tutup" : "Lihat"}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirm" className="label">
          Konfirmasi kata sandi <span className="text-[#b81750]">*</span>
        </label>
        <div className="relative">
          <input
            id="confirm"
            name="confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Ulangi kata sandi"
            className="input pr-16"
            minLength={8}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-[11.5px] font-bold text-[#9b1735]"
          >
            {showPassword ? "Tutup" : "Lihat"}
          </button>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-relaxed text-[#5d484e]">
        <input
          type="checkbox"
          name="agree"
          className="mt-0.5 size-3.5 shrink-0 accent-[#800021]"
          required
        />
        <span>
          Saya menyetujui{" "}
          <Link href="/ketentuan" className="font-semibold text-[#9b1735] underline">
            ketentuan dan kebijakan privasi
          </Link>
          .
        </span>
      </label>

      <SubmitButton className="btn btn-primary w-full py-3.5" pendingLabel="Membuat akun...">
        Buat akun
        <ArrowIcon />
      </SubmitButton>
    </form>
  );
}
