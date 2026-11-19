"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/constants";

export function SortSelect() {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <select
      aria-label="Urutkan barang"
      value={params.get("urut") ?? "baru"}
      onChange={(event) => {
        const next = new URLSearchParams(params.toString());
        next.set("urut", event.target.value);
        router.push(`/barang?${next.toString()}`);
      }}
      className="select w-auto min-w-[150px] border-transparent bg-[#fff1e9] py-2.5 pr-9 pl-4 text-[12.5px] font-semibold text-heading focus:border-[#800021]/30"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
