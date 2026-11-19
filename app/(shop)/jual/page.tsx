import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SellForm } from "@/components/SellForm";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Jual barang" };

export default async function JualPage() {
  await requireUser("/jual");

  return (
    <div className="container-page pt-6">
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Jualan", href: "/jualan" },
          { label: "Jual barang" },
        ]}
      />

      <div className="mt-6">
        <h1 className="h-display">Barang nganggur? Jadikan berguna.</h1>
        <p className="mt-2 text-[13.5px] text-[#7d6c71]">
          Isi informasi dengan jujur supaya teman kampus bisa belanja dengan tenang.
        </p>
      </div>

      <SellForm />
    </div>
  );
}
