# jubelma.

Marketplace barang bekas khusus mahasiswa Politeknik Negeri Ujung Pandang. Semua transaksi dilakukan COD (bayar dan temu langsung) di area kampus — tidak ada pengiriman, tidak ada pembayaran online.

Dibuat dengan Next.js 15 (App Router, Server Actions, TypeScript), Tailwind CSS v4, Prisma 6, dan SQLite.

## Menjalankan proyek

Prasyarat: Node.js 20+ dan npm.

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Buka <http://localhost:3000>.

Untuk mode produksi:

```bash
npm run build
npm start
```

## Akun demo

| NIM | Kata sandi | Nama |
| --- | --- | --- |
| `421001` | `jubelma123` | Awwal |
| `421002` | `jubelma123` | Faridz Reyhan |
| `421003` | `jubelma123` | Nadia Putri |
| `421004` | `jubelma123` | Rizky Pratama |
| `421005` | `jubelma123` | Farhan Anugrah |

`421001` adalah akun utama untuk mencoba alur lengkap: belanja, antrean, COD, ulasan, dan dashboard penjual.

## Alur yang tersedia

- Jelajahi katalog dengan pencarian, kategori, kondisi, dan filter COD.
- Detail barang, tambah ke keranjang, serta daftar barang terakhir dilihat.
- Hubungi penjual lewat WhatsApp; otomatis masuk antrean peminat.
- Penjual memilih pembeli terdepan, lalu menyelesaikan atau membatalkan COD.
- Pembeli memberi ulasan setelah transaksi selesai; rating tampil di profil penjual.
- Notifikasi untuk peminat baru, pembeli terpilih, barang terjual, dan ulasan.
- Dashboard penjual, unggah barang dengan foto, serta kelola antrean dan COD.
- Registrasi, login, dan reset kata sandi (verifikasi NIM + nomor WhatsApp).

## Struktur penting

- `app/` — halaman dan route handler (`app/uploads/[filename]` melayani foto unggahan saat runtime).
- `components/` — komponen UI dan form.
- `lib/actions.ts` — seluruh Server Action dan aturan bisnis.
- `lib/data.ts` — query katalog, keranjang, pembelian, dan dashboard.
- `lib/auth.ts` — sesi berbasis cookie HTTP-only yang disimpan di database.
- `prisma/schema.prisma` — model data.
- `prisma/seed.ts` — data demo; **menghapus seluruh data lama** sebelum mengisi ulang.

## Catatan

- Database SQLite ada di `prisma/dev.db` dan dikonfigurasi lewat `DATABASE_URL="file:./dev.db"`.
- Foto unggahan disimpan di `public/uploads/` dan disajikan oleh route handler agar langsung tersedia tanpa restart server.
- Tidak ada pembayaran atau pengiriman. Titik temu COD berupa teks yang disepakati lewat WhatsApp.
- `scripts/shots.mjs` mengambil screenshot halaman untuk pemeriksaan visual.
- `scripts/e2e.mjs` menguji alur mutasi (unggah barang, keranjang, antrean, COD, ulasan, pembatalan, registrasi, reset sandi). Jalankan dengan server aktif, lalu seed ulang setelahnya karena data demo berubah.
