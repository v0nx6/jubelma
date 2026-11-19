import { prisma } from "@/lib/db";
import { CATEGORIES } from "@/lib/constants";

export type ItemFilters = {
  q?: string;
  category?: string;
  maxPrice?: number;
  availableOnly?: boolean;
  sort?: string;
  take?: number;
};

export async function getItems(filters: ItemFilters = {}) {
  const { q, category, maxPrice, availableOnly, sort = "baru", take } = filters;

  const items = await prisma.item.findMany({
    where: {
      ...(category && CATEGORIES.includes(category as (typeof CATEGORIES)[number])
        ? { category }
        : {}),
      ...(maxPrice && maxPrice > 0 ? { price: { lte: maxPrice } } : {}),
      ...(availableOnly ? { status: "AVAILABLE" } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
              { category: { contains: q } },
            ],
          }
        : {}),
    },
    include: { seller: true },
    orderBy:
      sort === "termurah"
        ? { price: "asc" }
        : sort === "termahal"
          ? { price: "desc" }
          : { createdAt: "desc" },
    ...(take ? { take } : {}),
  });

  const ratings = await getSellerRatings(items.map((item) => item.sellerId));
  return items.map((item) => ({ ...item, sellerRating: ratings.get(item.sellerId) }));
}

export async function getSellerRatings(sellerIds: string[]) {
  const ids = [...new Set(sellerIds)];
  const map = new Map<string, { average: number; count: number }>();
  if (ids.length === 0) return map;

  const grouped = await prisma.review.groupBy({
    by: ["sellerId"],
    where: { sellerId: { in: ids } },
    _avg: { rating: true },
    _count: { _all: true },
  });

  for (const row of grouped) {
    map.set(row.sellerId, {
      average: row._avg.rating ?? 0,
      count: row._count._all,
    });
  }

  return map;
}

export async function getCartCount(userId?: string) {
  if (!userId) return 0;
  return prisma.cartItem.count({ where: { userId } });
}

export async function getUnreadCount(userId?: string) {
  if (!userId) return 0;
  return prisma.notification.count({ where: { userId, read: false } });
}

export async function getCart(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: { item: { include: { seller: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRecentViews(sessionKey: string) {
  const views = await prisma.itemView.findMany({
    where: { sessionKey },
    include: { item: { include: { seller: true } } },
    orderBy: { viewedAt: "desc" },
    take: 4,
  });
  return views;
}

export async function getSellerStats(sellerId: string) {
  const [available, ordered, sold, reviewAgg] = await Promise.all([
    prisma.item.count({ where: { sellerId, status: "AVAILABLE" } }),
    prisma.item.count({ where: { sellerId, status: "ORDERED" } }),
    prisma.item.count({ where: { sellerId, status: "SOLD" } }),
    prisma.review.aggregate({
      where: { sellerId },
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);

  return {
    available,
    ordered,
    sold,
    total: available + ordered + sold,
    rating: reviewAgg._avg.rating ?? 0,
    reviewCount: reviewAgg._count._all,
  };
}

export async function getPurchases(userId: string) {
  const [interests, orders] = await Promise.all([
    prisma.interest.findMany({
      where: { buyerId: userId, status: "WAITING" },
      include: { item: { include: { seller: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { buyerId: userId, status: { in: ["ORDERED", "COMPLETED"] } },
      include: {
        item: { include: { seller: true } },
        seller: true,
        review: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const queuePositions = new Map<string, number>();
  for (const interest of interests) {
    const position = await prisma.interest.count({
      where: {
        itemId: interest.itemId,
        status: "WAITING",
        createdAt: { lte: interest.createdAt },
      },
    });
    queuePositions.set(interest.id, position);
  }

  return { interests, orders, queuePositions };
}

export async function getSellerDashboardItems(sellerId: string, status?: string) {
  return prisma.item.findMany({
    where: {
      sellerId,
      ...(status && status !== "semua" ? { status } : {}),
    },
    include: {
      _count: { select: { interests: true } },
      orders: {
        where: { status: { in: ["ORDERED", "COMPLETED"] } },
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { buyer: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
