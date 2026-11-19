import { AuthArt } from "@/components/AuthArt";
import { ForgotForm } from "@/components/ForgotForm";

export const metadata = { title: "Lupa kata sandi" };

export default function LupaSandiPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <div className="mx-auto grid max-w-[1080px] items-stretch gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <AuthArt image="/images/products/kabel.jpg" />

        <div className="mx-auto w-full max-w-[460px] py-2 lg:py-8">
          <h1 className="h-display">Lupa kata sandi?</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[#7d6c71]">
            Verifikasi dengan NIM dan nomor WhatsApp yang kamu daftarkan, lalu buat kata
            sandi baru.
          </p>

          <ForgotForm />

          <div className="mt-8 rounded-xl bg-[#fff1e9] px-5 py-4 text-[12px] leading-relaxed text-[#8a6a70]">
            Demi keamanan demo kampus, verifikasi hanya memakai data akun yang tersimpan.
            Hubungi pengelola JUBELMA bila nomor WhatsApp-mu berubah.
          </div>
        </div>
      </div>
    </div>
  );
}
