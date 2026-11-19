"use client";

import { useActionState } from "react";
import { submitReviewAction } from "@/lib/actions";
import { Icon } from "./icons";
import { RatingInput } from "./RatingInput";
import { SubmitButton } from "./SubmitButton";
import { Alert } from "./Ui";

export function ReviewForm({
  orderId,
  sellerName,
}: {
  orderId: string;
  sellerName: string;
}) {
  const [state, formAction] = useActionState(submitReviewAction, {});

  return (
    <form action={formAction} className="mt-5">
      <input type="hidden" name="orderId" value={orderId} />
      <Alert error={state.error} />

      <h2 className="mt-5 text-[23px] leading-tight font-extrabold text-heading">
        Bagaimana barang dan penjualnya?
      </h2>
      <p className="mt-2 text-[12.5px] text-[#7d6c71]">Pilih rating untuk {sellerName}</p>

      <div className="mt-4">
        <RatingInput />
      </div>

      <div className="mt-6">
        <label htmlFor="text" className="label">
          Ulasanmu <span className="text-[#b81750]">*</span>
        </label>
        <textarea
          id="text"
          name="text"
          className="textarea min-h-[140px] bg-[#fff8f4]"
          placeholder="Ceritakan kondisi barang dan pengalaman COD-mu. Hindari data pribadi."
          minLength={10}
          maxLength={500}
          required
        />
        <p className="mt-2 text-[11px] text-[#8a787d]">
          Ceritakan kondisi barang dan pengalaman COD. Hindari data pribadi.
        </p>
      </div>

      <SubmitButton className="btn btn-primary mt-5 w-full" pendingLabel="Mengirim ulasan...">
        Kirim ulasan
        <Icon name="arrow-right" size={15} />
      </SubmitButton>

      <p className="mt-3 text-[10.5px] text-[#a29196]">
        Ulasan akan muncul di profil penjual, dari yang terbaru.
      </p>
    </form>
  );
}
