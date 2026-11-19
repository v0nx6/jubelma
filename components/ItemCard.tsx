import Link from "next/link";
import type { ItemWithSeller } from "@/lib/types";
import { ITEM_STATUS_LABEL } from "@/lib/constants";
import { rupiah, usageLabel } from "@/lib/format";
import { StarFilled } from "./icons";

export function StatusBadge({ status }: { status: string }) {
  return <span className="pill">{ITEM_STATUS_LABEL[status] ?? status}</span>;
}

export function Stars({
  value,
  size = 14,
  className = "text-[#8f1030]",
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const filled = Math.round(value);
  return (
    <span className={`inline-flex items-center gap-[2px] ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarFilled
          key={i}
          size={size}
          className={i <= filled ? "opacity-100" : "opacity-20"}
        />
      ))}
    </span>
  );
}

export function ItemCard({ item }: { item: ItemWithSeller }) {
  const rating = item.sellerRating;

  return (
    <Link
      href={`/barang/${item.id}`}
      className="group card flex flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-22px_rgba(90,0,25,0.45)]"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-cream-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-heading shadow-sm backdrop-blur">
          {ITEM_STATUS_LABEL[item.status] ?? item.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11.5px] text-[#8a787d]">
          {item.category} &nbsp;•&nbsp; {usageLabel(item.usageMonths)}
        </p>
        <h3 className="mt-1.5 line-clamp-1 text-[15.5px] font-bold text-heading">
          {item.title}
        </h3>
        <p className="mt-1 text-[19px] font-extrabold tracking-[-0.01em] text-maroon">
          {rupiah(item.price)}
        </p>
        <div className="mt-auto flex items-center gap-1.5 pt-3 text-[12px] text-[#7d6c71]">
          <span className="truncate">{item.seller.name}</span>
          <span className="text-[#c24366]">•</span>
          <StarFilled size={12} className="shrink-0 text-[#8f1030]" />
          <span>{rating && rating.count > 0 ? rating.average.toFixed(1).replace(".", ",") : "Baru"}</span>
        </div>
      </div>
    </Link>
  );
}
