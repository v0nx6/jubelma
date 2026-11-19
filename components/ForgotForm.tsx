"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPasswordAction } from "@/lib/actions";
import { ArrowIcon } from "./ArrowIcon";
import { SubmitButton } from "./SubmitButton";
import { Alert } from "./Ui";

export function ForgotForm() {
  const [state, formAction] = useActionState(resetPasswordAction, {});

  return (
    <form action={formAction} className="mt-7 space-y-5">
      <Alert error={state.error} />

      <div>
        <label htmlFor="nim" className="label">
          NIM <span className="text-[#b81750]">*</span>
        </label>
        <input
          id="nim"
          name="nim"
          inputMode="numeric"
          defaultValue={state.values?.nim ?? ""}
          placeholder="Nomor Induk Mahasiswa"
          className="input"
          required
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className="label">
          Nomor WhatsApp terdaftar <span className="text-[#b81750]">*</span>
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          inputMode="tel"
          placeholder="08xxxxxxxxxx"
          className="input"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className="label">
            Kata sandi baru <span className="text-[#b81750]">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Minimal 8 karakter"
            className="input"
            minLength={8}
            required
          />
        </div>
        <div>
          <label htmlFor="confirm" className="label">
            Ulangi kata sandi <span className="text-[#b81750]">*</span>
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            placeholder="Ulangi kata sandi"
            className="input"
            minLength={8}
            required
          />
        </div>
      </div>

      <SubmitButton className="btn btn-primary w-full py-3.5" pendingLabel="Menyimpan...">
        Simpan kata sandi
        <ArrowIcon />
      </SubmitButton>

      <p className="text-center text-[12.5px] text-[#7d6c71]">
        Ingat kata sandimu?{" "}
        <Link href="/masuk" className="font-bold text-[#9b1735] hover:underline">
          Kembali masuk
        </Link>
      </p>
    </form>
  );
}
