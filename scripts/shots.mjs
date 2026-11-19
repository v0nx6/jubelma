import { firefox } from "playwright";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";

const prisma = new PrismaClient();
const OUT = "/tmp/opencode/shots";
await fs.mkdir(OUT, { recursive: true });

const [kabel5, kabel3, x240, buku, faridz] = await Promise.all([
  prisma.item.findUnique({ where: { code: "BR-3305" } }),
  prisma.item.findUnique({ where: { code: "BR-4412" } }),
  prisma.item.findUnique({ where: { code: "BR-7021" } }),
  prisma.item.findUnique({ where: { code: "BR-1180" } }),
  prisma.user.findUnique({ where: { nim: "421002" } }),
]);
const bukuOrder = await prisma.order.findFirst({ where: { itemId: buku.id } });

const browser = await firefox.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
});
page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

const base = "http://localhost:3000";
let n = 0;
async function shot(path, name) {
  n += 1;
  await page.goto(base + path, { waitUntil: "networkidle" });
  const label = String(n).padStart(2, "0");
  await page.screenshot({ path: `${OUT}/${label}-${name}.png`, fullPage: true });
  console.log(`${label}-${name}`);
}

// public
await shot("/", "home");
await shot("/barang", "browse");
await shot(`/barang/${kabel5.id}`, "item-detail");
await shot("/keranjang", "cart-guest-redirect"); // will redirect to login
await shot("/masuk", "login");
await shot("/daftar", "register");
await shot("/terakhir-dilihat", "recent-guest");
await shot("/ketentuan", "ketentuan");

// login
await page.goto(base + "/masuk", { waitUntil: "networkidle" });
await page.fill("#nim", "421001");
await page.fill("#password", "jubelma123");
await page.click('form button[type="submit"]');
await page.waitForURL(base + "/");
console.log("logged in:", page.url());

await shot("/keranjang", "cart");
await shot("/pembelian", "purchases");
await shot("/pembelian?tab=selesai", "purchases-done");
await shot(`/penjual/${faridz.id}`, "seller-profile");
await shot("/jualan", "dashboard");
await shot("/jual", "sell-form");
await shot(`/jualan/${kabel3.id}/antrean`, "queue");
await shot(`/jualan/${x240.id}/cod`, "cod");
await shot("/notifikasi", "notifications");
await shot("/notifikasi?tab=belum", "notifications-unread");
await shot(`/ulasan/${bukuOrder.id}`, "review");
await shot("/terakhir-dilihat", "recent");

// mobile
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.screenshot({ path: `${OUT}/20-home-mobile.png`, fullPage: true });
await page.goto(base + "/jualan", { waitUntil: "networkidle" });
await page.screenshot({ path: `${OUT}/21-dashboard-mobile.png`, fullPage: true });

console.log("\nERRORS:", errors.length ? errors.join("\n") : "none");
await browser.close();
await prisma.$disconnect();
