"use client";

import { useRef, useState } from "react";
import { Icon } from "./icons";

export function ImagePicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name="image"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          setPreview(file ? URL.createObjectURL(file) : null);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group flex w-full max-w-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-[#c98c9d] bg-[#fffdfc] px-6 py-9 text-center transition hover:bg-cream-50"
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Pratinjau foto barang"
              className="mb-3 h-32 w-full rounded-lg object-cover"
            />
            <span className="text-[13px] font-semibold text-maroon">Ganti foto</span>
          </>
        ) : (
          <>
            <span className="mb-3 text-[#9b1735]">
              <Icon name="plus" size={26} />
            </span>
            <span className="text-[13.5px] font-bold text-maroon">Tambahkan foto</span>
            <span className="mt-2 text-[11.5px] text-[#8a787d]">JPG / PNG · maks. 2 MB</span>
          </>
        )}
      </button>
      <p className="mt-3 max-w-[300px] text-[12px] leading-relaxed text-[#8a787d]">
        Foto bagian depan, belakang, dan detail minus. Foto yang jelas membantu pembeli
        lebih yakin.
      </p>
    </div>
  );
}
