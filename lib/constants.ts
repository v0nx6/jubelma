export const CATEGORIES = [
  "Laptop",
  "Kabel jaringan",
  "Buku",
  "Alat praktik",
] as const;

export const CONDITIONS = ["Sangat baik", "Baik", "Cukup baik"] as const;

export const MAJORS = [
  "Teknik Informatika dan Komputer",
  "Teknik Elektronika",
  "Teknik Listrik",
  "Teknik Mesin",
  "Teknik Sipil",
  "Teknik Kimia",
  "Akuntansi",
  "Administrasi Niaga",
  "Teknik Grafika",
] as const;

export const ITEM_STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Tersedia",
  ORDERED: "Dipesan",
  SOLD: "Terjual",
};

export const INTEREST_STATUS_LABEL: Record<string, string> = {
  WAITING: "Menunggu",
  CHOSEN: "Peminta terdepan",
  CLOSED: "Ditutup",
};

export const ORDER_STATUS_LABEL: Record<string, string> = {
  ORDERED: "Dipesan",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export const NOTIFICATION_LABEL: Record<string, string> = {
  ITEM_SOLD: "Barang terjual",
  ORDER: "Pesanan COD",
  NEW_INTEREST: "Peminat baru",
  REVIEW: "Ulasan",
};

export const SORT_OPTIONS = [
  { value: "baru", label: "Terbaru" },
  { value: "termurah", label: "Harga termurah" },
  { value: "termahal", label: "Harga tertinggi" },
] as const;

export const CAMPUS_NAME = "Politeknik Negeri Ujung Pandang";
