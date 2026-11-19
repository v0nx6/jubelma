import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/icons";
import { Notice } from "@/components/Ui";
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { NOTIFICATION_LABEL } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { timeAgo } from "@/lib/format";

export const metadata = { title: "Notifikasi" };

function actionLabel(type: string, href: string) {
  if (type === "NEW_INTEREST") return "Kelola antrean";
  if (type === "ORDER") return "Lihat pembelian";
  if (type === "REVIEW") return href.startsWith("/penjual") ? "Lihat profil" : "Beri ulasan";
  if (type === "ITEM_SOLD") return "Lihat keranjang";
  return "Lihat";
}

export default async function NotifikasiPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await requireUser("/notifikasi");
  const { tab = "semua" } = await searchParams;

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const unread = notifications.filter((notification) => !notification.read);
  const visible = tab === "belum" ? unread : notifications;

  return (
    <div className="container-page pt-6">
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Akun saya", href: "/pembelian" },
          { label: "Notifikasi" },
        ]}
      />

      <div className="mt-6">
        <h1 className="h-display">Kabar terbaru untukmu</h1>
        <p className="mt-2 text-[13.5px] text-[#7d6c71]">
          Tidak perlu menebak status barang. Semua perubahan penting ada di sini.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 rounded-lg bg-[#fffaf7] p-1.5">
          <Link
            href="/notifikasi"
            className={`rounded-md px-4 py-2.5 text-[12.5px] transition ${
              tab !== "belum"
                ? "bg-[#ffe9dd] font-bold text-[#9b1735]"
                : "font-medium text-[#6f5a60] hover:bg-[#fff1e9]"
            }`}
          >
            Semua
          </Link>
          <Link
            href="/notifikasi?tab=belum"
            className={`rounded-md px-4 py-2.5 text-[12.5px] transition ${
              tab === "belum"
                ? "bg-[#ffe9dd] font-bold text-[#9b1735]"
                : "font-medium text-[#6f5a60] hover:bg-[#fff1e9]"
            }`}
          >
            Belum dibaca ({unread.length})
          </Link>
        </div>

        {unread.length > 0 && (
          <form action={markAllNotificationsReadAction}>
            <button className="text-[12px] font-bold text-[#9b1735] hover:underline">
              Tandai semua dibaca
            </button>
          </form>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {visible.length === 0 && (
          <div className="card px-7 py-9">
            <h2 className="text-[21px] font-extrabold">Belum ada kabar baru.</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-[#7d6c71]">
              Aktivitas antrean, pesanan, dan ulasan akan muncul di halaman ini.
            </p>
            <Link
              href="/barang"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#fff1e9] px-5 py-2.5 text-[12.5px] font-bold text-maroon hover:bg-[#ffe4d8]"
            >
              Jelajahi barang
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        )}

        {visible.map((notification) => (
          <article
            key={notification.id}
            className={`rounded-[14px] border px-5 py-4 transition ${
              notification.read
                ? "border-line bg-white"
                : "border-[#f7e1d4] bg-[#fff5ef]"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold tracking-[0.09em] text-[#9b1735] uppercase">
                  {NOTIFICATION_LABEL[notification.type] ?? "Kabar"}
                </p>
                <h2 className="mt-1.5 text-[17px] font-bold text-heading">
                  {notification.title}
                </h2>
                <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-[#7d6c71]">
                  {notification.body}
                </p>
                <p className="mt-2 text-[10.5px] text-[#a29196]">
                  {timeAgo(notification.createdAt)}
                </p>
              </div>

              <form action={markNotificationReadAction} className="shrink-0 sm:self-center">
                <input type="hidden" name="id" value={notification.id} />
                <input type="hidden" name="href" value={notification.href} />
                <button className="inline-flex items-center gap-1.5 text-[12px] font-bold whitespace-nowrap text-[#9b1735] hover:underline">
                  {actionLabel(notification.type, notification.href)}
                  <Icon name="arrow-right" size={13} />
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>

      {notifications.length > 0 && (
        <div className="mt-5">
          <Notice>
            Notifikasi ditandai dibaca saat kamu membuka tindakannya. Kamu tetap bisa membaca
            ulang riwayat kapan saja.
          </Notice>
        </div>
      )}
    </div>
  );
}
