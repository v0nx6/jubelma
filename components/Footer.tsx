import { CAMPUS_NAME } from "@/lib/constants";
import { Logo } from "./Header";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-[#fffcfb]">
      <div className="container-page flex flex-col gap-3 py-6 text-[12.5px] text-[#7d6c71] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Logo className="text-[21px]" />
          <span>Barang berpindah. Manfaat bertambah.</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{CAMPUS_NAME}</span>
          <span className="text-[#b81750]">•</span>
          <span>COD saja</span>
        </div>
      </div>
    </footer>
  );
}
