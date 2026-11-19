import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./icons";

export function Notice({
  children,
  tone = "cream",
}: {
  children: ReactNode;
  tone?: "cream" | "outline" | "success";
}) {
  const styles =
    tone === "success"
      ? "border-[#cfe4d6] bg-[#f1f8f3] text-[#245c36]"
      : tone === "outline"
        ? "border-line bg-white text-[#5d484e]"
        : "border-[#f6ded2] bg-[#fff1e9] text-[#7a2438]";
  return (
    <div className={`rounded-xl border px-5 py-4 text-[13px] leading-relaxed ${styles}`}>
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon = "cart",
}: {
  title: string;
  description: string;
  action?: { href: string; label: string };
  icon?: IconName;
}) {
  return (
    <div className="card p-8">
      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-cream-100 text-maroon">
        <Icon name={icon} size={21} />
      </span>
      <h2 className="mt-4 text-[21px] font-extrabold">{title}</h2>
      <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-[#7d6c71]">
        {description}
      </p>
      {action && (
        <Link href={action.href} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#fff1e9] px-5 py-3 text-[13px] font-bold text-maroon transition hover:bg-[#ffe4d8] sm:w-auto">
          {action.label}
          <Icon name="arrow-right" size={15} />
        </Link>
      )}
    </div>
  );
}

export function Alert({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 text-[12.5px] leading-relaxed ${
        error
          ? "border-[#e7c3c9] bg-[#fdf1f2] text-[#8c1430]"
          : "border-[#cfe4d6] bg-[#f1f8f3] text-[#245c36]"
      }`}
    >
      {error ?? success}
    </div>
  );
}
