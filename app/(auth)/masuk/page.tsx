import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthArt } from "@/components/AuthArt";
import { LoginForm } from "@/components/LoginForm";
import { Alert } from "@/components/Ui";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Masuk" };

export default async function MasukPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const { next, reset } = await searchParams;

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="mx-auto grid max-w-[1080px] items-stretch gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <AuthArt image="/images/products/laptop.jpg" />

        <div className="mx-auto w-full max-w-[480px] py-2 lg:py-6">
          <h1 className="text-[34px] leading-[1.1] font-extrabold tracking-[-0.03em] text-[#6d0a21] sm:text-[38px]">
            Senang kamu kembali!
          </h1>
          <p className="mt-3 text-[14px] text-[#7d6c71]">
            Masuk untuk mulai berburu barang incaranmu.
          </p>

          {reset && (
            <div className="mt-5">
              <Alert success="Kata sandi berhasil diperbarui. Silakan masuk dengan kata sandi baru." />
            </div>
          )}

          <LoginForm nextPath={next ?? "/"} />

          <p className="mt-8 text-center text-[13px] text-[#6f5a60]">
            Belum punya akun?{" "}
            <Link href="/daftar" className="font-bold text-[#9b1735] hover:underline">
              Daftar sekarang
            </Link>
          </p>

          <div className="mt-9 rounded-xl bg-[#fff1e9] px-5 py-4">
            <p className="text-[13px] font-bold text-heading">NIM kamu tetap privat.</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-[#8a6a70]">
              NIM digunakan untuk masuk dan tidak ditampilkan pada profil publik atau
              halaman barang.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-[#e7d3cc] bg-white px-5 py-4">
            <p className="text-[11px] font-bold tracking-wide text-[#9b1735] uppercase">
              Akun demo
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-[#7d6c71]">
              NIM <strong className="text-heading">421001</strong> · kata sandi{" "}
              <strong className="text-heading">jubelma123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
