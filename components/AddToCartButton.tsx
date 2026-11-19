"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { addToCartAction } from "@/lib/actions";
import { Icon } from "./icons";

export function AddToCartButton({
  itemId,
  inCart,
}: {
  itemId: string;
  inCart: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(false), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (inCart) {
    return (
      <>
        <Link href="/keranjang" className="btn btn-outline flex-1">
          <Icon name="check" size={16} />
          Sudah di keranjang
        </Link>
        {toast && <CartToast />}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await addToCartAction(itemId);
            setToast(true);
            router.refresh();
          })
        }
        className="btn btn-outline flex-1"
      >
        <Icon name="plus" size={16} />
        {pending ? "Menyimpan..." : "Tambah ke keranjang"}
      </button>

      {toast && <CartToast />}
    </>
  );
}

function CartToast() {
  return (
    <div className="fixed bottom-6 left-1/2 z-[60] w-[min(420px,calc(100vw-32px))] -translate-x-1/2 rounded-xl border border-[#f3ddd3] bg-[#fff2ea] px-5 py-4 shadow-[0_20px_50px_-20px_rgba(90,0,25,0.45)]">
      <p className="flex items-center gap-2 text-sm font-bold text-heading">
        <Icon name="check" size={17} />
        Barang ditambahkan ke keranjang
      </p>
      <Link
        href="/keranjang"
        className="mt-1.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#9b1735] hover:underline"
      >
        Lihat keranjang
        <Icon name="arrow-right" size={13} />
      </Link>
    </div>
  );
}
