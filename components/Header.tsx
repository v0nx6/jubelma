import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getCartCount, getUnreadCount } from "@/lib/data";
import { logoutAction } from "@/lib/actions";
import { Icon } from "./icons";
import { NavLinks } from "./NavLinks";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`text-[26px] leading-none font-extrabold tracking-[-0.045em] text-maroon ${className}`}
    >
      jubelma.
    </Link>
  );
}

export async function Header() {
  const user = await getCurrentUser();
  const [cartCount, unread] = await Promise.all([
    getCartCount(user?.id),
    getUnreadCount(user?.id),
  ]);

  return (
    <header className="bg-white">
      <div className="bg-maroon px-4 py-2 text-center text-[11.5px] font-medium tracking-wide text-[#ffe4d8]">
        Dari mahasiswa, untuk mahasiswa. &nbsp;•&nbsp; COD di kampus, belanja lebih tenang.
      </div>

      <div className="container-page flex flex-wrap items-center gap-x-6 gap-y-3 py-4 md:flex-nowrap">
        <Logo />

        <form action="/barang" className="relative order-last w-full md:order-none md:w-auto md:max-w-[520px] md:flex-1">
          <Icon
            name="search"
            size={17}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#9c8a8f]"
          />
          <input
            type="search"
            name="q"
            placeholder="Cari laptop, buku, atau alat praktik..."
            aria-label="Cari barang"
            className="w-full rounded-full border border-[#f3e7e2] bg-[#fff6f1] py-2.5 pr-4 pl-10 text-[13.5px] text-ink outline-none transition placeholder:text-[#a08e93] focus:border-[#800021]/25 focus:bg-white"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/keranjang"
            className="relative flex items-center gap-2 rounded-lg px-2 py-2 text-[13.5px] font-semibold text-heading transition hover:bg-cream-50"
          >
            <Icon name="cart" size={19} />
            <span className="hidden lg:inline">Keranjang</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 left-4 grid size-[17px] place-items-center rounded-full bg-maroon text-[10px] font-bold text-white lg:left-5">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href={user ? "/notifikasi" : "/masuk?next=%2Fnotifikasi"}
            aria-label="Notifikasi"
            className="relative rounded-lg p-2 text-heading transition hover:bg-cream-50"
          >
            <Icon name="bell" size={19} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 size-2 rounded-full bg-[#b81750] ring-2 ring-white" />
            )}
          </Link>

          <Link href={user ? "/jual" : "/masuk?next=%2Fjual"} className="btn btn-primary px-4 py-2.5 text-[13px] max-sm:px-3">
            <Icon name="plus" size={16} />
            <span className="max-sm:hidden">Jual barang</span>
          </Link>

          {user ? (
            <details className="group relative">
              <summary className="summary-none btn btn-cream cursor-pointer px-4 py-2.5 text-[13px]">
                Akun saya
                <Icon
                  name="chevron-down"
                  size={14}
                  className="transition group-open:rotate-180"
                />
              </summary>
              <div className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-line bg-white p-2 shadow-[0_18px_40px_-18px_rgba(70,0,20,0.35)]">
                <div className="border-b border-line-soft px-3 py-2.5">
                  <p className="truncate text-[13.5px] font-bold text-heading">{user.name}</p>
                  <p className="text-[11.5px] text-muted">NIM {user.nim}</p>
                </div>
                <div className="py-1 text-[13px]">
                  <Link href="/jualan" className="block rounded-lg px-3 py-2 hover:bg-cream-50">
                    Jualan saya
                  </Link>
                  <Link href="/pembelian" className="block rounded-lg px-3 py-2 hover:bg-cream-50">
                    Pembelian saya
                  </Link>
                  <Link href="/notifikasi" className="block rounded-lg px-3 py-2 hover:bg-cream-50">
                    Notifikasi
                    {unread > 0 && (
                      <span className="ml-1.5 rounded-full bg-cream-100 px-1.5 py-0.5 text-[10px] font-bold text-maroon">
                        {unread}
                      </span>
                    )}
                  </Link>
                  <Link href={`/penjual/${user.id}`} className="block rounded-lg px-3 py-2 hover:bg-cream-50">
                    Profil penjual
                  </Link>
                </div>
                <form action={logoutAction} className="border-t border-line-soft pt-1">
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-maroon hover:bg-cream-50">
                    <Icon name="logout" size={15} />
                    Keluar
                  </button>
                </form>
              </div>
            </details>
          ) : (
            <Link
              href="/masuk"
              className="btn btn-cream px-4 py-2.5 text-[13px]"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-line-soft">
        <div className="container-page py-3">
          <NavLinks />
        </div>
      </div>
    </header>
  );
}
