import { firefox } from "playwright";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";

const prisma = new PrismaClient();
const OUT = "/tmp/opencode/e2e";
await fs.mkdir(OUT, { recursive: true });

const base = "http://localhost:3000";
const browser = await firefox.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
});
page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

let step = 0;
const results = [];
async function check(name, fn) {
  step += 1;
  const label = String(step).padStart(2, "0");
  try {
    await fn();
    results.push({ label, name, ok: true });
    console.log(`${label} PASS ${name}`);
  } catch (error) {
    results.push({ label, name, ok: false, error: error.message });
    await page.screenshot({ path: `${OUT}/${label}-FAIL-${name.replace(/\W+/g, "-")}.png`, fullPage: true }).catch(() => {});
    console.log(`${label} FAIL ${name}: ${error.message}`);
    throw error;
  }
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function login(nim, password = "jubelma123") {
  await page.goto(base + "/masuk", { waitUntil: "networkidle" });
  await page.fill("#nim", nim);
  await page.fill("#password", password);
  await page.click('form button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.startsWith("/masuk"), { timeout: 15000 });
  await page.waitForLoadState("networkidle");
}

async function logout() {
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.click("summary");
  await page.getByRole("button", { name: "Keluar" }).click();
  await page.waitForURL(base + "/");
  await page.waitForLoadState("networkidle");
}

const TITLE = "Kotak Perkakas Praktikum E2E";
const TEMP_NIM = "429999";
const TEMP_PASS = "rahasia123";
const NEW_PASS = "rahasia456";

// Intercept WhatsApp redirect so the test stays offline-safe.
await page.route("https://wa.me/**", (route) =>
  route.fulfill({ status: 200, contentType: "text/html", body: "<h1>WhatsApp redirect OK</h1>" }),
);

const kabel5 = await prisma.item.findUnique({ where: { code: "BR-3305" } });
const x240 = await prisma.item.findUnique({ where: { code: "BR-7021" } });

try {
  await check("Login sebagai Awwal", async () => {
    await login("421001");
    assert(await page.getByText("Akun saya").isVisible(), "menu akun tidak tampil");
  });

  await check("Buat barang baru dengan foto", async () => {
    await page.goto(base + "/jual", { waitUntil: "networkidle" });
    await page.fill("#title", TITLE);
    await page.selectOption("#category", "Alat praktik");
    await page.fill("#price", "45000");
    await page.fill("#usageMonths", "3");
    await page.selectOption("#condition", "Baik");
    await page.fill("#warrantyDays", "7");
    await page.fill("#codPoint", "Lab Elektro");
    await page.fill(
      "#description",
      "Kotak perkakas plastik untuk praktikum, isi lengkap dan semua kunci masih berfungsi baik.",
    );
    await page.setInputFiles('input[name="image"]', "public/images/products/kabel.jpg");
    await page.check('input[name="checked"]');
    await page.getByRole("button", { name: "Tayangkan barang" }).click();
    await page.waitForURL(/\/jualan\?tayang=1/, { timeout: 20000 });
    await page.waitForLoadState("networkidle");
    assert(await page.getByText(TITLE).first().isVisible(), "barang baru tidak muncul di dashboard");
    await page.screenshot({ path: `${OUT}/01-created.png`, fullPage: true });
  });

  const created = await prisma.item.findFirst({ where: { title: TITLE }, orderBy: { createdAt: "desc" } });
  assert(created, "barang baru tidak tersimpan di database");
  assert(created.status === "AVAILABLE", `status awal salah: ${created.status}`);
  assert(created.image.startsWith("data:image/"), `foto tidak tersimpan: ${created.image.slice(0, 40)}`);
  assert(created.image.length > 1000, "data foto kosong");

  await check("Logout lalu login sebagai Nadia", async () => {
    await logout();
    await page.getByRole("link", { name: "Masuk" }).waitFor({ state: "visible", timeout: 10000 });
    await login("421003");
    await page.getByText("Akun saya").waitFor({ state: "visible", timeout: 10000 });
  });

  await check("Tambah ke keranjang memunculkan toast", async () => {
    await page.goto(`${base}/barang/${created.id}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Tambah ke keranjang" }).click();
    await page.getByText("Barang ditambahkan ke keranjang").waitFor({ timeout: 15000 });
    await page.getByRole("link", { name: "Sudah di keranjang" }).waitFor({ timeout: 15000 });
    await page.screenshot({ path: `${OUT}/02-added-to-cart.png`, fullPage: true });
    const cart = await prisma.cartItem.findFirst({ where: { itemId: created.id, userId: (await prisma.user.findUnique({ where: { nim: "421003" } })).id } });
    assert(cart, "cart item tidak tersimpan");
  });

  await check("Hubungi penjual membuat antrean + redirect WhatsApp", async () => {
    await page.getByRole("button", { name: /Hubungi via WhatsApp/ }).click();
    await page.waitForURL(/wa\.me/, { timeout: 20000 });
    assert((await page.content()).includes("WhatsApp redirect OK"), "redirect WhatsApp tidak terjadi");
    const interest = await prisma.interest.findFirst({ where: { itemId: created.id } });
    assert(interest, "antrean tidak terbentuk");
    assert(interest.status === "WAITING", `status antrean salah: ${interest.status}`);
    const notif = await prisma.notification.findFirst({
      where: { userId: created.sellerId, type: "NEW_INTEREST", title: { contains: "Nadia" } },
      orderBy: { createdAt: "desc" },
    });
    assert(notif, "notifikasi peminat baru tidak dibuat");
  });

  await check("Keranjang menampilkan barang baru", async () => {
    await page.goto(base + "/keranjang", { waitUntil: "networkidle" });
    assert(await page.getByText(TITLE).first().isVisible(), "barang baru tidak ada di keranjang");
    await page.screenshot({ path: `${OUT}/03-cart.png`, fullPage: true });
  });

  await check("Logout lalu pilih pembeli sebagai Awwal", async () => {
    await logout();
    await login("421001");
    await page.goto(`${base}/jualan/${created.id}/antrean`, { waitUntil: "networkidle" });
    assert(await page.getByText("Nadia Putri").first().isVisible(), "peminat Nadia tidak tampil");
    await page.getByRole("button", { name: "Pilih pembeli terdepan" }).click();
    await page.waitForURL(new RegExp(`/jualan/${created.id}/cod`), { timeout: 20000 });
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${OUT}/04-cod.png`, fullPage: true });
    const order = await prisma.order.findFirst({ where: { itemId: created.id, status: "ORDERED" } });
    assert(order, "order tidak dibuat");
    const item = await prisma.item.findUnique({ where: { id: created.id } });
    assert(item.status === "ORDERED", `status barang salah: ${item.status}`);
    const buyerNotif = await prisma.notification.findFirst({
      where: { userId: order.buyerId, type: "ORDER", title: { contains: TITLE } },
    });
    assert(buyerNotif, "notifikasi pembeli terpilih tidak dibuat");
  });

  await check("Tandai terjual menyelesaikan COD", async () => {
    await page.getByRole("button", { name: "Tandai terjual" }).click();
    await page.waitForURL(/tab=terjual&selebrasi=1/, { timeout: 20000 });
    await page.waitForLoadState("networkidle");
    assert(await page.getByText(TITLE).first().isVisible(), "barang terjual tidak tampil");
    await page.screenshot({ path: `${OUT}/05-sold.png`, fullPage: true });
    const order = await prisma.order.findFirst({ where: { itemId: created.id } });
    assert(order.status === "COMPLETED", `status order salah: ${order.status}`);
    assert(order.completedAt, "completedAt kosong");
    const item = await prisma.item.findUnique({ where: { id: created.id } });
    assert(item.status === "SOLD", `status barang salah: ${item.status}`);
    const reviewNotif = await prisma.notification.findFirst({
      where: { userId: order.buyerId, type: "REVIEW", title: { contains: TITLE } },
    });
    assert(reviewNotif, "notifikasi ulasan tidak dibuat");
  });

  await check("Beri ulasan sebagai Nadia", async () => {
    await logout();
    await login("421003");
    await page.goto(base + "/pembelian?tab=selesai", { waitUntil: "networkidle" });
    assert(await page.getByText(TITLE).first().isVisible(), "transaksi selesai tidak tampil");
    const order = await prisma.order.findFirst({ where: { itemId: created.id, status: "COMPLETED" } });
    await page.goto(`${base}/ulasan/${order.id}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Beri 4 bintang" }).click();
    await page.fill("#text", "Barang sesuai deskripsi, COD tepat waktu, dan penjualnya ramah sekali.");
    await page.getByRole("button", { name: "Kirim ulasan" }).click();
    await page.waitForURL(/tab=selesai&ulasan=terkirim/, { timeout: 20000 });
    await page.waitForLoadState("networkidle");
    assert(await page.getByText("Ulasan terkirim").first().isVisible(), "status ulasan terkirim tidak tampil");
    await page.screenshot({ path: `${OUT}/06-reviewed.png`, fullPage: true });
    const review = await prisma.review.findUnique({ where: { orderId: order.id } });
    assert(review, "ulasan tidak tersimpan");
    assert(review.rating === 4, `rating salah: ${review.rating}`);
  });

  await check("Hapus barang dari keranjang", async () => {
    await page.goto(base + "/keranjang", { waitUntil: "networkidle" });
    const row = page.locator("article", { hasText: TITLE }).first();
    await row.getByRole("button", { name: "Hapus" }).click();
    await page.getByText("Belum ada barang tersimpan.").waitFor({ timeout: 15000 });
    assert((await page.getByText(TITLE).count()) === 0, "barang masih tampil di keranjang");
    const cart = await prisma.cartItem.findFirst({ where: { itemId: created.id } });
    assert(!cart, "cart item masih ada di database");
  });

  await check("Batalkan pesanan mengembalikan barang ke Tersedia", async () => {
    await logout();
    await login("421001");
    const before = await prisma.order.findFirst({ where: { itemId: x240.id, status: "ORDERED" } });
    assert(before, "order ThinkPad X240 tidak ditemukan");
    await page.goto(`${base}/jualan/${x240.id}/cod`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Batalkan pesanan" }).click();
    await page.waitForURL(/dibatalkan=1/, { timeout: 20000 });
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${OUT}/07-cancelled.png`, fullPage: true });
    const after = await prisma.order.findUnique({ where: { id: before.id } });
    assert(after.status === "CANCELLED", `status order salah: ${after.status}`);
    const item = await prisma.item.findUnique({ where: { id: x240.id } });
    assert(item.status === "AVAILABLE", `status barang salah: ${item.status}`);
    const cancelNotif = await prisma.notification.findFirst({
      where: { userId: before.buyerId, type: "ORDER", title: { contains: "dibatalkan" } },
    });
    assert(cancelNotif, "notifikasi pembatalan tidak dibuat");
  });

  await check("Daftar akun baru", async () => {
    await logout();
    await page.goto(base + "/daftar", { waitUntil: "networkidle" });
    await page.fill("#name", "Mahasiswa Uji");
    await page.fill("#nim", TEMP_NIM);
    await page.selectOption("#major", "Teknik Informatika dan Komputer");
    await page.fill("#whatsapp", "089876543210");
    await page.fill("#password", TEMP_PASS);
    await page.fill("#confirm", TEMP_PASS);
    await page.check('input[name="agree"]');
    await page.getByRole("button", { name: "Buat akun" }).click();
    await page.waitForURL(base + "/", { timeout: 20000 });
    await page.waitForLoadState("networkidle");
    assert(await page.getByText("Akun saya").isVisible(), "registrasi tidak membuat sesi login");
    const user = await prisma.user.findUnique({ where: { nim: TEMP_NIM } });
    assert(user, "user baru tidak tersimpan");
    const welcome = await prisma.notification.findFirst({ where: { userId: user.id, type: "REVIEW" } });
    assert(welcome, "notifikasi selamat datang tidak dibuat");
  });

  await check("Reset kata sandi lalu masuk dengan sandi baru", async () => {
    await logout();
    await page.goto(base + "/lupa-sandi", { waitUntil: "networkidle" });
    await page.fill("#nim", TEMP_NIM);
    await page.fill("#whatsapp", "089876543210");
    await page.fill("#password", NEW_PASS);
    await page.fill("#confirm", NEW_PASS);
    await page.getByRole("button", { name: "Simpan kata sandi" }).click();
    await page.waitForURL(/\/masuk\?reset=1/, { timeout: 20000 });
    await page.waitForLoadState("networkidle");
    await login(TEMP_NIM, NEW_PASS);
    assert(await page.getByText("Akun saya").isVisible(), "login dengan sandi baru gagal");
  });

  await check("Tandai semua notifikasi dibaca", async () => {
    await page.goto(base + "/notifikasi", { waitUntil: "networkidle" });
    const button = page.getByRole("button", { name: /Tandai semua/ });
    if (await button.isVisible().catch(() => false)) {
      await button.click();
      await page.getByText("Belum dibaca (0)").waitFor({ timeout: 15000 });
    }
    const user = await prisma.user.findUnique({ where: { nim: TEMP_NIM } });
    const unread = await prisma.notification.count({ where: { userId: user.id, read: false } });
    assert(unread === 0, `masih ada ${unread} notifikasi belum dibaca`);
  });

  console.log(`\n${results.filter((r) => r.ok).length}/${results.length} langkah lulus`);
} catch (error) {
  console.error("\nE2E gagal:", error.message);
  process.exitCode = 1;
} finally {
  console.log("ERRORS:", errors.length ? errors.join("\n") : "none");
  await browser.close();
  await prisma.$disconnect();
}
