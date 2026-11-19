import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthArt } from "@/components/AuthArt";
import { RegisterForm } from "@/components/RegisterForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Daftar" };

export default async function DaftarPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="mx-auto grid max-w-[1080px] items-stretch gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <AuthArt image="/images/products/buku.jpg" />

        <div className="mx-auto w-full max-w-[480px] py-2 lg:py-4">
          <h1 className="text-[34px] leading-[1.1] font-extrabold tracking-[-0.03em] text-[#6d0a21] sm:text-[38px]">
            Mulai cerita barumu.
          </h1>
          <p className="mt-3 text-[14px] text-[#7d6c71]">
            Satu akun untuk membeli dan menjual.
          </p>

          <RegisterForm />

          <p className="mt-8 text-center text-[13px] text-[#6f5a60]">
            Sudah punya akun?{" "}
            <Link href="/masuk" className="font-bold text-[#9b1735] hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
