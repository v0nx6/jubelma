import { randomBytes, randomUUID } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "jubelma_session";
const VISITOR_COOKIE = "jubelma_visitor";
const SESSION_DAYS = 30;

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({ data: { token, userId, expiresAt } });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }

  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return session.user;
}

export async function requireUser(nextPath = "/") {
  const user = await getCurrentUser();
  if (!user) redirect(`/masuk?next=${encodeURIComponent(nextPath)}`);
  return user;
}

/** Stable per-browser key for the "Terakhir dilihat" session history. */
export async function getVisitorKey() {
  const store = await cookies();
  let key = store.get(VISITOR_COOKIE)?.value;

  if (!key) {
    key = randomUUID();
    try {
      store.set(VISITOR_COOKIE, key, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
    } catch {
      // Setting cookies is only allowed in actions/route handlers.
    }
  }

  return key;
}
