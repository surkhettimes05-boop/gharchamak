import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "gharchamak_admin";
const SESSION_SECONDS = 60 * 60 * 12;

type Session = { email: string; exp: number };

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sessionSecret(): string {
  const value = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!value) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return value;
}

function sign(encoded: string): string {
  return createHmac("sha256", sessionSecret()).update(encoded).digest("base64url");
}

function encodeSession(session: Session): string {
  const encoded = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function decodeSession(value: string): Session | null {
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;
  try {
    if (!safeEqual(signature, sign(encoded))) return null;
    const session = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Session;
    if (!session.email || !session.exp || Date.now() >= session.exp) return null;
    return session;
  } catch {
    return null;
  }
}

export function adminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET?.trim());
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword || !process.env.ADMIN_SESSION_SECRET) return false;
  return safeEqual(email.trim().toLowerCase(), expectedEmail) && safeEqual(password, expectedPassword);
}

export async function setAdminSession(email: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, encodeSession({ email, exp: Date.now() + SESSION_SECONDS * 1000 }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<Session | null> {
  if (!adminAuthConfigured()) return null;
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  return raw ? decodeSession(raw) : null;
}

export async function requireAdmin(): Promise<Session> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
