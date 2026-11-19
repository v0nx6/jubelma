"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAction } from "@/lib/actions";
import { ArrowIcon } from "./ArrowIcon";
import { SubmitButton } from "./SubmitButton";
import { Alert } from "./Ui";

export function LoginForm({ nextPath = "/" }: { nextPath?: string }) {
  const [state, formAction] = useActionState(loginAction, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={nextPath} />
      <Alert error={state.error} />

      <div>
        <label htmlFor="nim" className="label">
          NIM <span className="text-[#b81750]">*</span>
        </label>
        <input
          id="nim"
          name="nim"
          inputMode="numeric"
          autoComplete="username"
          defaultValue={state.values?.nim ?? ""}
          placeholder="Masukkan Nomor Induk Mahasiswa"
          className="input"
          required
        />
        <p className="mt-2 text-[11.5px] text-[#8a787d]">
          Gunakan NIM yang terdaftar di akun JUBELMA.
        </p>
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
            autoComplete="current-password"
            placeholder="Masukkan kata sandi"
            className="input pr-16"
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

      <div className="flex items-center justify-between gap-3 text-[12.5px]">
        <label className="flex cursor-pointer items-center gap-2 text-[#5d484e]">
          <input type="checkbox" name="remember" className="size-3.5 accent-[#800021]" />
          Ingat saya
        </label>
        <Link href="/lupa-sandi" className="font-bold text-[#9b1735] hover:underline">
          Lupa kata sandi?
        </Link>
      </div>

      <SubmitButton className="btn btn-primary w-full py-3.5" pendingLabel="Memeriksa...">
        Masuk
        <ArrowIcon />
      </SubmitButton>
    </form>
  );
}
