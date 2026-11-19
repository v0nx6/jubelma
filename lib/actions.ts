"use server";

import { randomInt, randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, destroySession, getCurrentUser, requireUser } from "@/lib/auth";
import { CATEGORIES, CONDITIONS, MAJORS } from "@/lib/constants";
import { rupiah, waLink } from "@/lib/format";
import type { FormState } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

async function notify(
  userId: string,
  data: { type: string; title: string; body: string; href: string },
) {
  await prisma.notification.create({ data: { userId, ...data } });
}

async function generateItemCode() {
  for (let i = 0; i < 25; i++) {
    const code = `BR-${randomInt(1000, 9999)}`;
    const existing = await prisma.item.findUnique({ where: { code } });
    if (!existing) return code;
  }
  return `BR-${Date.now().toString().slice(-6)}`;
}

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export async function registerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = {
    name: text(formData, "name"),
    nim: text(formData, "nim"),
    major: text(formData, "major"),
    whatsapp: text(formData, "whatsapp"),
  };
  const password = text(formData, "password");
  const confirm = text(formData, "confirm");
  const agreed = formData.get("agree") === "on";

  if (!values.name || !values.nim || !values.whatsapp) {
    return { error: "Lengkapi semua data wajib terlebih dahulu.", values };
  }
  if (!/^\d{6,12}$/.test(values.nim)) {
    return { error: "NIM harus berupa 6–12 angka.", values };
  }
  if (!MAJORS.includes(values.major as (typeof MAJORS)[number])) {
    return { error: "Pilih jurusan yang valid.", values };
  }
  if (!/^0\d{8,13}$/.test(values.whatsapp.replace(/[\s-]/g, ""))) {
    return { error: "Nomor WhatsApp harus diawali 0 dan berisi 9–14 angka.", values };
  }
  if (password.length < 8) {
    return { error: "Kata sandi minimal 8 karakter.", values };
  }
  if (password !== confirm) {
    return { error: "Konfirmasi kata sandi tidak cocok.", values };
  }
  if (!agreed) {
    return { error: "Kamu perlu menyetujui ketentuan dan kebijakan privasi.", values };
  }

  const existing = await prisma.user.findUnique({ where: { nim: values.nim } });
  if (existing) {
    return { error: "NIM ini sudah terdaftar. Coba masuk dengan akunmu.", values };
  }

  const user = await prisma.user.create({
    data: {
      name: values.name,
      nim: values.nim,
      major: values.major,
      whatsapp: values.whatsapp.replace(/[\s-]/g, ""),
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  await notify(user.id, {
    type: "REVIEW",
    title: "Selamat datang di JUBELMA",
    body: "Akunmu aktif. Mulai jelajahi barang kampus atau unggah barang pertamamu.",
    href: "/barang",
  });

  await createSession(user.id);
  redirect("/");
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const nim = text(formData, "nim");
  const password = text(formData, "password");
  const next = safeNext(formData.get("next"));

  if (!nim || !password) {
    return { error: "NIM dan kata sandi wajib diisi.", values: { nim } };
  }

  const user = await prisma.user.findUnique({ where: { nim } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "NIM atau kata sandi tidak sesuai.", values: { nim } };
  }

  await createSession(user.id);
  redirect(next);
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function resetPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const nim = text(formData, "nim");
  const whatsapp = text(formData, "whatsapp").replace(/[\s-]/g, "");
  const password = text(formData, "password");
  const confirm = text(formData, "confirm");

  if (!nim || !whatsapp) {
    return { error: "Isi NIM dan nomor WhatsApp yang terdaftar.", values: { nim } };
  }
  if (password.length < 8) {
    return { error: "Kata sandi baru minimal 8 karakter.", values: { nim } };
  }
  if (password !== confirm) {
    return { error: "Konfirmasi kata sandi tidak cocok.", values: { nim } };
  }

  const user = await prisma.user.findUnique({ where: { nim } });
  if (!user || user.whatsapp.replace(/\D/g, "") !== whatsapp.replace(/\D/g, "")) {
    return {
      error: "Data tidak cocok. Pastikan NIM dan nomor WhatsApp sesuai saat mendaftar.",
      values: { nim },
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(password, 10) },
  });

  redirect("/masuk?reset=1");
}

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */

export async function addToCartAction(itemId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/masuk?next=${encodeURIComponent(`/barang/${itemId}`)}`);
  }

  await prisma.cartItem.upsert({
    where: { userId_itemId: { userId: user.id, itemId } },
    update: {},
    create: { userId: user.id, itemId },
  });

  revalidatePath("/keranjang");
  revalidatePath(`/barang/${itemId}`);
  return { ok: true };
}

export async function removeFromCartAction(formData: FormData) {
  const user = await requireUser("/keranjang");
  const cartItemId = text(formData, "cartItemId");

  await prisma.cartItem.deleteMany({
    where: { id: cartItemId, userId: user.id },
  });

  revalidatePath("/keranjang");
  redirect("/keranjang");
}

/* ------------------------------------------------------------------ */
/* Interest + COD flow                                                 */
/* ------------------------------------------------------------------ */

export async function contactSellerAction(formData: FormData) {
  const itemId = text(formData, "itemId");
  const user = await requireUser(`/barang/${itemId}`);

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { seller: true },
  });

  if (!item) redirect("/barang");
  if (item.status !== "AVAILABLE") {
    redirect(`/barang/${item.id}?gagal=status`);
  }
  if (item.sellerId === user.id) {
    redirect(`/barang/${item.id}?gagal=milik`);
  }

  const existing = await prisma.interest.findUnique({
    where: { itemId_buyerId: { itemId: item.id, buyerId: user.id } },
  });

  if (!existing) {
    await prisma.interest.create({
      data: { itemId: item.id, buyerId: user.id },
    });

    const waiting = await prisma.interest.count({
      where: { itemId: item.id, status: "WAITING" },
    });

    await notify(item.sellerId, {
      type: "NEW_INTEREST",
      title: `${user.name} tertarik dengan barangmu`,
      body: `${item.title} punya peminat baru. Kamu ada di urutan ${waiting} untuk dihubungi.`,
      href: `/jualan/${item.id}/antrean`,
    });
  }

  const message = [
    `Halo ${item.seller.name}, saya ${user.name} (NIM ${user.nim}) dari JUBELMA.`,
    ``,
    `Saya tertarik dengan "${item.title}" (${item.code}) seharga ${rupiah(item.price)}.`,
    `Apakah masih tersedia untuk COD di ${item.codPoint}?`,
  ].join("\n");

  redirect(waLink(item.seller.whatsapp, message));
}

export async function chooseBuyerAction(formData: FormData) {
  const user = await requireUser("/jualan");
  const interestId = text(formData, "interestId");

  const interest = await prisma.interest.findUnique({
    where: { id: interestId },
    include: { item: true, buyer: true },
  });

  if (!interest || interest.item.sellerId !== user.id) {
    redirect("/jualan");
  }

  if (interest.item.status !== "AVAILABLE") {
    redirect(`/jualan/${interest.itemId}/antrean?gagal=status`);
  }

  const activeOrder = await prisma.order.findFirst({
    where: {
      itemId: interest.itemId,
      status: { in: ["ORDERED", "COMPLETED"] },
    },
  });
  if (activeOrder) {
    redirect(`/jualan/${interest.itemId}/antrean?gagal=status`);
  }

  const others = await prisma.interest.findMany({
    where: {
      itemId: interest.itemId,
      status: "WAITING",
      id: { not: interestId },
    },
    include: { buyer: true },
  });

  await prisma.$transaction([
    prisma.item.update({
      where: { id: interest.itemId },
      data: { status: "ORDERED" },
    }),
    prisma.interest.update({
      where: { id: interestId },
      data: { status: "CHOSEN" },
    }),
    prisma.interest.updateMany({
      where: {
        itemId: interest.itemId,
        status: "WAITING",
        id: { not: interestId },
      },
      data: { status: "CLOSED" },
    }),
    prisma.order.create({
      data: {
        itemId: interest.itemId,
        buyerId: interest.buyerId,
        sellerId: user.id,
        meetPoint: interest.item.codPoint,
      },
    }),
    prisma.notification.create({
      data: {
        userId: interest.buyerId,
        type: "ORDER",
        title: `${interest.item.title} dipesan untukmu`,
        body: "Penjual memilihmu sebagai pembeli. Hubungi penjual untuk menyepakati waktu COD.",
        href: "/pembelian?tab=dipesan",
      },
    }),
    ...others.map((other) =>
      prisma.notification.create({
        data: {
          userId: other.buyerId,
          type: "ITEM_SOLD",
          title: "Barang sudah dipesan peminat lain",
          body: `${interest.item.title} sudah dipesan. Kamu bisa mencari barang serupa di katalog.`,
          href: `/barang/${interest.itemId}`,
        },
      }),
    ),
  ]);

  revalidatePath("/jualan");
  revalidatePath(`/jualan/${interest.itemId}/antrean`);
  redirect(`/jualan/${interest.itemId}/cod`);
}

export async function markSoldAction(formData: FormData) {
  const user = await requireUser("/jualan");
  const orderId = text(formData, "orderId");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { item: true, buyer: true },
  });

  if (!order || order.sellerId !== user.id || order.status !== "ORDERED") {
    redirect("/jualan");
  }

  const otherBuyers = await prisma.interest.findMany({
    where: {
      itemId: order.itemId,
      buyerId: { not: order.buyerId },
      status: { in: ["WAITING", "CHOSEN"] },
    },
  });

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    }),
    prisma.item.update({
      where: { id: order.itemId },
      data: { status: "SOLD" },
    }),
    prisma.interest.updateMany({
      where: { itemId: order.itemId, status: { in: ["WAITING", "CHOSEN"] } },
      data: { status: "CLOSED" },
    }),
    prisma.notification.create({
      data: {
        userId: order.buyerId,
        type: "REVIEW",
        title: `${order.item.title} sudah diterima`,
        body: "Transaksi selesai. Ceritakan pengalamanmu agar teman kampus lebih yakin.",
        href: `/ulasan/${order.id}`,
      },
    }),
    ...otherBuyers.map((interest) =>
      prisma.notification.create({
        data: {
          userId: interest.buyerId,
          type: "ITEM_SOLD",
          title: `${order.item.title} sudah terjual`,
          body: "Barang incaranmu telah dibeli. Antrean ditutup, cari barang serupa di katalog.",
          href: `/barang/${order.itemId}`,
        },
      }),
    ),
  ]);

  revalidatePath("/jualan");
  revalidatePath("/pembelian");
  redirect("/jualan?tab=terjual&selebrasi=1");
}

export async function cancelOrderAction(formData: FormData) {
  const user = await requireUser("/jualan");
  const orderId = text(formData, "orderId");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { item: true },
  });

  if (!order || order.sellerId !== user.id || order.status !== "ORDERED") {
    redirect("/jualan");
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
    }),
    prisma.item.update({
      where: { id: order.itemId },
      data: { status: "AVAILABLE" },
    }),
    prisma.interest.updateMany({
      where: { itemId: order.itemId, status: "CHOSEN" },
      data: { status: "CLOSED" },
    }),
    prisma.notification.create({
      data: {
        userId: order.buyerId,
        type: "ORDER",
        title: "Pesanan COD dibatalkan penjual",
        body: `${order.item.title} kembali tersedia. Kamu masih bisa menghubungi penjual bila tertarik.`,
        href: `/barang/${order.itemId}`,
      },
    }),
  ]);

  revalidatePath("/jualan");
  revalidatePath(`/jualan/${order.itemId}/antrean`);
  redirect(`/jualan/${order.itemId}/antrean?dibatalkan=1`);
}

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

export async function submitReviewAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const orderId = text(formData, "orderId");
  const user = await getCurrentUser();
  if (!user) redirect(`/masuk?next=${encodeURIComponent(`/ulasan/${orderId}`)}`);

  const rating = Number(formData.get("rating") ?? 0);
  const reviewText = text(formData, "text");

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Pilih rating 1 sampai 5 bintang." };
  }
  if (reviewText.length < 10) {
    return { error: "Ulasan minimal 10 karakter agar bermanfaat untuk pembeli lain." };
  }
  if (reviewText.length > 500) {
    return { error: "Ulasan maksimal 500 karakter." };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { item: true, review: true, seller: true },
  });

  if (!order || order.buyerId !== user.id) redirect("/pembelian");
  if (order.status !== "COMPLETED" || order.review) {
    redirect("/pembelian?tab=selesai");
  }

  await prisma.$transaction([
    prisma.review.create({
      data: {
        orderId: order.id,
        itemId: order.itemId,
        sellerId: order.sellerId,
        authorId: user.id,
        rating,
        text: reviewText,
      },
    }),
    prisma.notification.create({
      data: {
        userId: order.sellerId,
        type: "REVIEW",
        title: `${user.name} memberi ulasan ${rating} bintang`,
        body: `Ulasan baru untuk ${order.item.title}: "${reviewText.slice(0, 90)}${
          reviewText.length > 90 ? "…" : ""
        }"`,
        href: `/penjual/${order.sellerId}`,
      },
    }),
  ]);

  revalidatePath("/pembelian");
  revalidatePath(`/penjual/${order.sellerId}`);
  redirect("/pembelian?tab=selesai&ulasan=terkirim");
}

/* ------------------------------------------------------------------ */
/* Selling                                                             */
/* ------------------------------------------------------------------ */

export async function createItemAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk?next=%2Fjual");

  const values = {
    title: text(formData, "title"),
    category: text(formData, "category"),
    price: text(formData, "price"),
    usageMonths: text(formData, "usageMonths"),
    condition: text(formData, "condition"),
    warrantyDays: text(formData, "warrantyDays"),
    codPoint: text(formData, "codPoint"),
    description: text(formData, "description"),
  };

  const price = Number(values.price);
  const usageMonths = Number(values.usageMonths);
  const warrantyDays = Number(values.warrantyDays || 0);
  const image = formData.get("image");

  if (
    values.title.length < 4 ||
    values.description.length < 20 ||
    !CATEGORIES.includes(values.category as (typeof CATEGORIES)[number]) ||
    !CONDITIONS.includes(values.condition as (typeof CONDITIONS)[number]) ||
    !values.codPoint
  ) {
    return {
      error: "Lengkapi seluruh kolom. Deskripsi minimal 20 karakter.",
      values,
    };
  }
  if (!Number.isInteger(price) || price <= 0) {
    return { error: "Harga harus lebih dari Rp0.", values };
  }
  if (!Number.isInteger(usageMonths) || usageMonths < 0) {
    return { error: "Lama pemakaian harus berupa angka bulan.", values };
  }
  if (!Number.isInteger(warrantyDays) || warrantyDays < 0) {
    return { error: "Garansi harus berupa angka hari (isi 0 bila tanpa garansi).", values };
  }
  if (formData.get("checked") !== "on") {
    return {
      error: "Centang pernyataan bahwa kamu sudah memeriksa fungsi dan kelayakan barang.",
      values,
    };
  }

  let imagePath = "";
  if (image instanceof File && image.size > 0) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
      return { error: "Foto harus berformat JPG, PNG, atau WEBP.", values };
    }
    if (image.size > 5 * 1024 * 1024) {
      return { error: "Ukuran foto maksimal 5 MB.", values };
    }

    const ext =
      image.type === "image/png" ? "png" : image.type === "image/webp" ? "webp" : "jpg";
    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), Buffer.from(await image.arrayBuffer()));
    imagePath = `/uploads/${filename}`;
  } else {
    return { error: "Tambahkan minimal satu foto barang.", values };
  }

  const code = await generateItemCode();

  await prisma.item.create({
    data: {
      code,
      title: values.title,
      description: values.description,
      category: values.category,
      price,
      condition: values.condition,
      usageMonths,
      warrantyDays,
      codPoint: values.codPoint,
      image: imagePath,
      sellerId: user.id,
    },
  });

  revalidatePath("/jualan");
  revalidatePath("/barang");
  revalidatePath("/");
  redirect("/jualan?tayang=1");
}

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export async function markAllNotificationsReadAction() {
  const user = await requireUser("/notifikasi");
  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/notifikasi");
  revalidatePath("/");
}

export async function markNotificationReadAction(formData: FormData) {
  const user = await requireUser("/notifikasi");
  const id = text(formData, "id");
  const href = safeNext(formData.get("href"));
  await prisma.notification.updateMany({
    where: { id, userId: user.id },
    data: { read: true },
  });
  revalidatePath("/notifikasi");
  redirect(href);
}
