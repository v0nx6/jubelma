import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const IMG = {
  laptop: "/images/products/laptop.jpg",
  kabel: "/images/products/kabel.jpg",
  buku: "/images/products/buku.jpg",
  multimeter: "/images/products/multimeter.jpg",
};

const now = Date.now();
const ago = (days: number, hours = 0, minutes = 0) =>
  new Date(now - days * 86400000 - hours * 3600000 - minutes * 60000);

async function main() {
  // Reset (order matters for foreign keys)
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.itemView.deleteMany();
  await prisma.order.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.item.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("jubelma123", 10);

  const awwal = await prisma.user.create({
    data: {
      nim: "421001",
      name: "Awwal",
      major: "Teknik Informatika dan Komputer",
      whatsapp: "081234567890",
      passwordHash,
    },
  });

  const faridz = await prisma.user.create({
    data: {
      nim: "421002",
      name: "Faridz Reyhan",
      major: "Teknik Informatika dan Komputer",
      whatsapp: "081234567891",
      passwordHash,
    },
  });

  const nadia = await prisma.user.create({
    data: {
      nim: "421003",
      name: "Nadia Putri",
      major: "Akuntansi",
      whatsapp: "081234567892",
      passwordHash,
    },
  });

  const rizky = await prisma.user.create({
    data: {
      nim: "421004",
      name: "Rizky Pratama",
      major: "Teknik Elektronika",
      whatsapp: "081234567893",
      passwordHash,
    },
  });

  const farhan = await prisma.user.create({
    data: {
      nim: "421005",
      name: "Farhan Anugrah",
      major: "Teknik Mesin",
      whatsapp: "081234567894",
      passwordHash,
    },
  });

  const t480 = await prisma.item.create({
    data: {
      code: "BR-2210",
      title: "Laptop ThinkPad T480",
      description:
        "Lenovo ThinkPad T480, Intel Core i5-8250U, RAM 8 GB, SSD 256 GB. Layar 14 inci masih jernih, keyboard empuk, dan baterai tahan sekitar 4 jam. Minus: ada goresan halus di bodi atas. Charger original dan tas sleeve disertakan. Cocok untuk kuliah, coding, dan tugas praktikum.",
      category: "Laptop",
      price: 3250000,
      condition: "Baik",
      usageMonths: 18,
      warrantyDays: 7,
      codPoint: "Perpustakaan kampus",
      image: IMG.laptop,
      status: "ORDERED",
      sellerId: farhan.id,
      createdAt: ago(0, 2),
    },
  });

  const kabel5 = await prisma.item.create({
    data: {
      code: "BR-3305",
      title: "Kabel LAN Cat6 · 5 meter",
      description:
        "Kabel LAN Cat6 sepanjang 5 meter. Seluruh konektor sudah dites, koneksi stabil, dan pengunci RJ45 masih utuh. Cocok untuk praktik jaringan atau kebutuhan internet di kos.",
      category: "Kabel jaringan",
      price: 25000,
      condition: "Baik",
      usageMonths: 6,
      warrantyDays: 7,
      codPoint: "Perpustakaan kampus",
      image: IMG.kabel,
      status: "AVAILABLE",
      sellerId: faridz.id,
      createdAt: ago(0, 5),
    },
  });

  const buku = await prisma.item.create({
    data: {
      code: "BR-1180",
      title: "Buku Dasar Pemrograman",
      description:
        "Buku Dasar Pemrograman untuk mahasiswa. Kondisi masih rapi, tidak ada coretan tebal, hanya nama pemilik di halaman pertama. Cocok untuk latihan algoritma dan tugas praktikum.",
      category: "Buku",
      price: 55000,
      condition: "Baik",
      usageMonths: 4,
      warrantyDays: 7,
      codPoint: "Kantin kampus",
      image: IMG.buku,
      status: "SOLD",
      sellerId: nadia.id,
      createdAt: ago(1, 2),
    },
  });

  const multimeter = await prisma.item.create({
    data: {
      code: "BR-1906",
      title: "Multimeter digital",
      description:
        "Multimeter digital merk Sanfix, fungsi pengukuran tegangan, arus, dan resistansi berjalan normal. Probe merah dan hitam lengkap. Sudah dipakai untuk praktikum dasar elektronika.",
      category: "Alat praktik",
      price: 85000,
      condition: "Baik",
      usageMonths: 8,
      warrantyDays: 7,
      codPoint: "Lab Elektro",
      image: IMG.multimeter,
      status: "SOLD",
      sellerId: rizky.id,
      createdAt: ago(2, 4),
    },
  });

  const kabel3 = await prisma.item.create({
    data: {
      code: "BR-4412",
      title: "Kabel LAN Cat6 · 3 meter",
      description:
        "Kabel LAN Cat6 3 meter sisa praktikum. Sudah dites di lab, konektor rapi, tidak ada kabel yang terkelupas. Bisa dipakai untuk menghubungkan laptop ke switch atau router kos.",
      category: "Kabel jaringan",
      price: 20000,
      condition: "Baik",
      usageMonths: 6,
      warrantyDays: 7,
      codPoint: "Perpustakaan kampus",
      image: IMG.kabel,
      status: "AVAILABLE",
      sellerId: awwal.id,
      createdAt: ago(4, 3),
    },
  });

  const x240 = await prisma.item.create({
    data: {
      code: "BR-7021",
      title: "ThinkPad X240",
      description:
        "ThinkPad X240 untuk mobilitas kuliah. Core i5 generasi keempat, RAM 8 GB, SSD 128 GB. Bodi ringkas dan ringan, layar 12,5 inci. Baterai masih normal untuk catatan dan browsing. Keyboard dan port berfungsi baik.",
      category: "Laptop",
      price: 2000000,
      condition: "Baik",
      usageMonths: 24,
      warrantyDays: 7,
      codPoint: "Kantin kampus",
      image: IMG.laptop,
      status: "ORDERED",
      sellerId: awwal.id,
      createdAt: ago(5, 6),
    },
  });

  const dt830 = await prisma.item.create({
    data: {
      code: "BR-1806",
      title: "Multimeter DT830B",
      description:
        "Multimeter DT830B untuk praktikum dasar. Layar jelas, putaran selektor masih presisi, dan probe lengkap. Cocok untuk mahasiswa baru yang butuh alat ukur sederhana.",
      category: "Alat praktik",
      price: 75000,
      condition: "Baik",
      usageMonths: 10,
      warrantyDays: 7,
      codPoint: "Lab Elektro",
      image: IMG.multimeter,
      status: "SOLD",
      sellerId: awwal.id,
      createdAt: ago(7, 2),
    },
  });

  const cable2 = await prisma.item.create({
    data: {
      code: "BR-3321",
      title: "Kabel LAN Cat6 · 2 meter",
      description:
        "Kabel LAN Cat6 2 meter, sudah dites dan berfungsi normal. Cocok untuk koneksi singkat di meja belajar.",
      category: "Kabel jaringan",
      price: 15000,
      condition: "Baik",
      usageMonths: 5,
      warrantyDays: 7,
      codPoint: "Perpustakaan kampus",
      image: IMG.kabel,
      status: "SOLD",
      sellerId: faridz.id,
      createdAt: ago(12),
    },
  });

  const cable10 = await prisma.item.create({
    data: {
      code: "BR-3344",
      title: "Kabel LAN Cat6 · 10 meter",
      description:
        "Kabel LAN Cat6 10 meter untuk kebutuhan jaringan kos. Semua pin konektor lengkap dan koneksi stabil.",
      category: "Kabel jaringan",
      price: 40000,
      condition: "Baik",
      usageMonths: 8,
      warrantyDays: 7,
      codPoint: "Perpustakaan kampus",
      image: IMG.kabel,
      status: "SOLD",
      sellerId: faridz.id,
      createdAt: ago(15),
    },
  });

  const cable1 = await prisma.item.create({
    data: {
      code: "BR-3390",
      title: "Kabel LAN Cat6 · 1 meter",
      description:
        "Kabel LAN Cat6 1 meter, konektor rapi, cocok untuk menghubungkan perangkat di meja praktikum.",
      category: "Kabel jaringan",
      price: 10000,
      condition: "Baik",
      usageMonths: 3,
      warrantyDays: 7,
      codPoint: "Perpustakaan kampus",
      image: IMG.kabel,
      status: "SOLD",
      sellerId: faridz.id,
      createdAt: ago(18),
    },
  });

  /* Orders */

  const t480Order = await prisma.order.create({
    data: {
      itemId: t480.id,
      buyerId: awwal.id,
      sellerId: farhan.id,
      meetPoint: "Perpustakaan kampus",
      status: "ORDERED",
      createdAt: ago(1, 1),
    },
  });

  const bukuOrder = await prisma.order.create({
    data: {
      itemId: buku.id,
      buyerId: awwal.id,
      sellerId: nadia.id,
      meetPoint: "Kantin kampus",
      status: "COMPLETED",
      createdAt: ago(5, 4),
      completedAt: ago(4, 2),
    },
  });

  const x240Order = await prisma.order.create({
    data: {
      itemId: x240.id,
      buyerId: farhan.id,
      sellerId: awwal.id,
      meetPoint: "Kantin kampus",
      status: "ORDERED",
      createdAt: ago(1, 3),
    },
  });

  const dt830Order = await prisma.order.create({
    data: {
      itemId: dt830.id,
      buyerId: nadia.id,
      sellerId: awwal.id,
      meetPoint: "Lab Elektro",
      status: "COMPLETED",
      createdAt: ago(6, 2),
      completedAt: ago(5, 5),
    },
  });

  const multimeterOrder = await prisma.order.create({
    data: {
      itemId: multimeter.id,
      buyerId: farhan.id,
      sellerId: rizky.id,
      meetPoint: "Lab Elektro",
      status: "COMPLETED",
      createdAt: ago(3, 3),
      completedAt: ago(2, 6),
    },
  });

  const cable2Order = await prisma.order.create({
    data: {
      itemId: cable2.id,
      buyerId: nadia.id,
      sellerId: faridz.id,
      meetPoint: "Perpustakaan kampus",
      status: "COMPLETED",
      createdAt: ago(11, 2),
      completedAt: ago(10, 1),
    },
  });

  const cable10Order = await prisma.order.create({
    data: {
      itemId: cable10.id,
      buyerId: awwal.id,
      sellerId: faridz.id,
      meetPoint: "Perpustakaan kampus",
      status: "COMPLETED",
      createdAt: ago(14, 1),
      completedAt: ago(13, 3),
    },
  });

  const cable1Order = await prisma.order.create({
    data: {
      itemId: cable1.id,
      buyerId: rizky.id,
      sellerId: faridz.id,
      meetPoint: "Perpustakaan kampus",
      status: "COMPLETED",
      createdAt: ago(17, 4),
      completedAt: ago(16, 2),
    },
  });

  /* Reviews */

  await prisma.review.createMany({
    data: [
      {
        orderId: cable2Order.id,
        itemId: cable2.id,
        sellerId: faridz.id,
        authorId: nadia.id,
        rating: 5,
        text: "Barang sesuai deskripsi, sudah dites sebelum COD. Penjualnya ramah dan tepat waktu.",
        createdAt: ago(10, 1),
      },
      {
        orderId: cable10Order.id,
        itemId: cable10.id,
        sellerId: faridz.id,
        authorId: awwal.id,
        rating: 5,
        text: "Kabel berfungsi dengan baik untuk praktik. Proses ketemu juga mudah.",
        createdAt: ago(13, 3),
      },
      {
        orderId: cable1Order.id,
        itemId: cable1.id,
        sellerId: faridz.id,
        authorId: rizky.id,
        rating: 4,
        text: "Kondisi sesuai foto. Terima kasih!",
        createdAt: ago(16, 2),
      },
      {
        orderId: dt830Order.id,
        itemId: dt830.id,
        sellerId: awwal.id,
        authorId: nadia.id,
        rating: 5,
        text: "Multimeter berfungsi normal dan sudah dicek di lokasi. Penjual sabar menjelaskan cara pakainya.",
        createdAt: ago(5, 5),
      },
      {
        orderId: multimeterOrder.id,
        itemId: multimeter.id,
        sellerId: rizky.id,
        authorId: farhan.id,
        rating: 5,
        text: "Alat ukur sesuai deskripsi, probe lengkap. COD di lab berjalan cepat.",
        createdAt: ago(2, 6),
      },
    ],
  });

  /* Interests / queues */

  await prisma.interest.createMany({
    data: [
      {
        itemId: t480.id,
        buyerId: awwal.id,
        status: "CHOSEN",
        createdAt: ago(1, 1),
      },
      {
        itemId: x240.id,
        buyerId: farhan.id,
        status: "CHOSEN",
        createdAt: ago(1, 3),
      },
      {
        itemId: kabel3.id,
        buyerId: nadia.id,
        status: "WAITING",
        createdAt: ago(1, 7, 10),
      },
      {
        itemId: kabel3.id,
        buyerId: farhan.id,
        status: "WAITING",
        createdAt: ago(1, 6, 56),
      },
      {
        itemId: kabel3.id,
        buyerId: rizky.id,
        status: "WAITING",
        createdAt: ago(1, 6, 15),
      },
      {
        itemId: kabel5.id,
        buyerId: farhan.id,
        status: "WAITING",
        createdAt: ago(3, 2),
      },
      {
        itemId: kabel5.id,
        buyerId: awwal.id,
        status: "WAITING",
        createdAt: ago(2, 2),
      },
    ],
  });

  /* Cart for Awwal */

  await prisma.cartItem.createMany({
    data: [
      { itemId: kabel5.id, userId: awwal.id, createdAt: ago(0, 4) },
      { itemId: buku.id, userId: awwal.id, createdAt: ago(0, 6) },
      { itemId: multimeter.id, userId: awwal.id, createdAt: ago(1, 1) },
    ],
  });

  /* Notifications for Awwal */

  await prisma.notification.createMany({
    data: [
      {
        userId: awwal.id,
        type: "ITEM_SOLD",
        title: "Multimeter digital sudah terjual",
        body: "Barang incaranmu telah dibeli. Antrean ditutup dan seluruh peminat diberi tahu.",
        href: "/keranjang",
        read: false,
        createdAt: ago(0, 0, 5),
      },
      {
        userId: awwal.id,
        type: "ORDER",
        title: "ThinkPad T480 dipesan untukmu",
        body: "Penjual memilihmu sebagai pembeli. Hubungi penjual untuk menyepakati waktu COD.",
        href: "/pembelian?tab=dipesan",
        read: false,
        createdAt: ago(0, 0, 28),
      },
      {
        userId: awwal.id,
        type: "NEW_INTEREST",
        title: "Nadia tertarik dengan barangmu",
        body: "Kabel LAN Cat6 3 meter punya peminat baru. Layani antrean terdepan lebih dulu.",
        href: `/jualan/${kabel3.id}/antrean`,
        read: false,
        createdAt: ago(0, 1),
      },
      {
        userId: awwal.id,
        type: "REVIEW",
        title: "Bagaimana pengalaman belanjamu?",
        body: "Buku Dasar Pemrograman sudah selesai ditransaksikan. Yuk, bantu pembeli lain.",
        href: `/ulasan/${bukuOrder.id}`,
        read: true,
        createdAt: ago(1, 2),
      },
      {
        userId: awwal.id,
        type: "REVIEW",
        title: "Nadia memberi ulasan 5 bintang",
        body: "Ulasan baru untuk Multimeter DT830B: penjual sabar menjelaskan cara pakainya.",
        href: `/penjual/${awwal.id}`,
        read: true,
        createdAt: ago(5, 5),
      },
      {
        userId: faridz.id,
        type: "NEW_INTEREST",
        title: "Ada peminat baru untuk kabelmu",
        body: "Kabel LAN Cat6 5 meter sedang ditanyakan. Balas lewat WhatsApp agar cepat COD.",
        href: `/jualan/${kabel5.id}/antrean`,
        read: false,
        createdAt: ago(2, 1),
      },
      {
        userId: awwal.id,
        type: "ORDER",
        title: "Pesanan COD dibatalkan penjual",
        body: "Contoh notifikasi lama: transaksi lain dibatalkan dan barang kembali tersedia.",
        href: `/barang/${x240.id}`,
        read: true,
        createdAt: ago(9, 1),
      },
    ],
  });

  // Silence intentionally unused variable warnings for order refs kept for clarity.
  void t480Order;
  void x240Order;

  console.log("Seed selesai.");
  console.log("Login demo: NIM 421001 / kata sandi jubelma123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
