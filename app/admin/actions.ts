"use server";

import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, requireAdmin, setAdminSession, verifyAdminCredentials } from "@/src/cms/auth";
import { ensureCmsSchema, getCmsSql } from "@/src/cms/db";
import { products, type ProductSlug } from "@/src/config/brand";

function value(form: FormData, key: string): string {
  const item = form.get(key);
  return typeof item === "string" ? item.trim() : "";
}
function optional(form: FormData, key: string): string | null {
  return value(form, key) || null;
}
function checked(form: FormData, key: string): boolean {
  return form.get(key) === "on" || form.get(key) === "true";
}
function numberValue(form: FormData, key: string): number {
  const n = Number(value(form, key));
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}
function refreshPublic(): void {
  revalidatePath("/en");
  revalidatePath("/ne");
  revalidatePath("/en/products");
  revalidatePath("/ne/products");
  revalidatePath("/en/retailers");
  revalidatePath("/ne/retailers");
}
function done(message: string): never {
  redirect(`/admin?notice=${encodeURIComponent(message)}`);
}
function fail(message: string): never {
  redirect(`/admin?error=${encodeURIComponent(message)}`);
}

export async function loginAdmin(form: FormData) {
  const email = value(form, "email");
  const password = value(form, "password");
  if (!verifyAdminCredentials(email, password)) redirect("/admin/login?error=Invalid%20admin%20credentials");
  await setAdminSession(email);
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

async function db() {
  await requireAdmin();
  try {
    await ensureCmsSchema();
    return getCmsSql();
  } catch (error) {
    fail(error instanceof Error ? error.message : "CMS database is unavailable");
  }
}

export async function saveOffer(form: FormData) {
  const sql = await db();
  const title = value(form, "title");
  if (!title) fail("Offer title is required");
  const id = value(form, "id") || randomUUID();
  await sql`INSERT INTO cms_offers (id,title,title_ne,description,description_ne,badge,image_url,cta_label,cta_url,starts_at,ends_at,published,sort_order,updated_at)
    VALUES (${id},${title},${optional(form,"titleNe")},${value(form,"description")},${optional(form,"descriptionNe")},${optional(form,"badge")},${optional(form,"imageUrl")},${optional(form,"ctaLabel")},${optional(form,"ctaUrl")},${optional(form,"startsAt")},${optional(form,"endsAt")},${checked(form,"published")},${numberValue(form,"sortOrder")},NOW())
    ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,title_ne=EXCLUDED.title_ne,description=EXCLUDED.description,description_ne=EXCLUDED.description_ne,badge=EXCLUDED.badge,image_url=EXCLUDED.image_url,cta_label=EXCLUDED.cta_label,cta_url=EXCLUDED.cta_url,starts_at=EXCLUDED.starts_at,ends_at=EXCLUDED.ends_at,published=EXCLUDED.published,sort_order=EXCLUDED.sort_order,updated_at=NOW()`;
  refreshPublic();
  done("Offer saved");
}

export async function deleteOffer(form: FormData) {
  const sql = await db();
  await sql`DELETE FROM cms_offers WHERE id=${value(form,"id")}`;
  refreshPublic();
  done("Offer deleted");
}

export async function savePartner(form: FormData) {
  const sql = await db();
  const name = value(form, "name");
  if (!name) fail("Partner name is required");
  const id = value(form, "id") || randomUUID();
  await sql`INSERT INTO cms_partners (id,name,partner_type,location,image_url,website_url,published,sort_order,updated_at)
    VALUES (${id},${name},${value(form,"partnerType") || "Retailer"},${optional(form,"location")},${optional(form,"imageUrl")},${optional(form,"websiteUrl")},${checked(form,"published")},${numberValue(form,"sortOrder")},NOW())
    ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,partner_type=EXCLUDED.partner_type,location=EXCLUDED.location,image_url=EXCLUDED.image_url,website_url=EXCLUDED.website_url,published=EXCLUDED.published,sort_order=EXCLUDED.sort_order,updated_at=NOW()`;
  refreshPublic();
  done("Partner saved");
}

export async function deletePartner(form: FormData) {
  const sql = await db();
  await sql`DELETE FROM cms_partners WHERE id=${value(form,"id")}`;
  refreshPublic();
  done("Partner deleted");
}

export async function saveReview(form: FormData) {
  const sql = await db();
  const customerName = value(form, "customerName");
  const quote = value(form, "quote");
  if (!customerName || !quote) fail("Customer name and review are required");
  const slug = optional(form, "productSlug");
  if (slug && !products.some(product => product.slug === slug)) fail("Unknown product");
  const id = value(form, "id") || randomUUID();
  await sql`INSERT INTO cms_reviews (id,customer_name,quote,quote_ne,product_slug,media_url,published,featured,updated_at)
    VALUES (${id},${customerName},${quote},${optional(form,"quoteNe")},${slug},${optional(form,"mediaUrl")},${checked(form,"published")},${checked(form,"featured")},NOW())
    ON CONFLICT (id) DO UPDATE SET customer_name=EXCLUDED.customer_name,quote=EXCLUDED.quote,quote_ne=EXCLUDED.quote_ne,product_slug=EXCLUDED.product_slug,media_url=EXCLUDED.media_url,published=EXCLUDED.published,featured=EXCLUDED.featured,updated_at=NOW()`;
  refreshPublic();
  done("Review saved");
}

export async function deleteReview(form: FormData) {
  const sql = await db();
  await sql`DELETE FROM cms_reviews WHERE id=${value(form,"id")}`;
  refreshPublic();
  done("Review deleted");
}

export async function saveProductOverride(form: FormData) {
  const sql = await db();
  const slug = value(form, "productSlug") as ProductSlug;
  if (!products.some(product => product.slug === slug)) fail("Unknown product");
  const status = optional(form, "status");
  if (status && status !== "coming-soon" && status !== "available") fail("Invalid product status");
  await sql`INSERT INTO cms_product_overrides (product_slug,status,mrp,pack_size,image_url,updated_at)
    VALUES (${slug},${status},${optional(form,"mrp")},${optional(form,"packSize")},${optional(form,"imageUrl")},NOW())
    ON CONFLICT (product_slug) DO UPDATE SET status=EXCLUDED.status,mrp=EXCLUDED.mrp,pack_size=EXCLUDED.pack_size,image_url=EXCLUDED.image_url,updated_at=NOW()`;
  refreshPublic();
  done("Product settings saved");
}

export async function saveSiteSettings(form: FormData) {
  const sql = await db();
  const pairs = [
    ["announcement_en", value(form, "announcementEn")],
    ["announcement_ne", value(form, "announcementNe")],
  ] as const;
  for (const [key, setting] of pairs) {
    await sql`INSERT INTO cms_site_settings (key,value,updated_at) VALUES (${key},${setting},NOW()) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_at=NOW()`;
  }
  refreshPublic();
  done("Site settings saved");
}

export async function addMediaUrl(form: FormData) {
  const sql = await db();
  const url = value(form, "url");
  const label = value(form, "label");
  if (!url || !label) fail("Media label and URL are required");
  try { new URL(url); } catch { fail("Media URL must be a valid absolute URL"); }
  const kind = value(form, "kind") === "video" ? "video" : "image";
  await sql`INSERT INTO cms_media (id,label,kind,url,alt_en,alt_ne) VALUES (${randomUUID()},${label},${kind},${url},${optional(form,"altEn")},${optional(form,"altNe")})`;
  done("Media added");
}

export async function uploadMedia(form: FormData) {
  const sql = await db();
  if (!process.env.BLOB_READ_WRITE_TOKEN) fail("BLOB_READ_WRITE_TOKEN is not configured");
  const file = form.get("file");
  const label = value(form, "label");
  if (!(file instanceof File) || file.size === 0 || !label) fail("Choose a file and provide a media label");
  if (file.size > 4_000_000) fail("Direct uploads are limited to 4 MB");
  const allowed = new Set(["image/jpeg","image/png","image/webp","image/gif","image/avif","video/mp4","video/webm"]);
  if (!allowed.has(file.type)) fail("Unsupported file type");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-100) || "upload";
  const blob = await put(`gharchamak/${Date.now()}-${safeName}`, file, { access: "public", addRandomSuffix: true });
  const kind = file.type.startsWith("video/") ? "video" : "image";
  await sql`INSERT INTO cms_media (id,label,kind,url,alt_en,alt_ne) VALUES (${randomUUID()},${label},${kind},${blob.url},${optional(form,"altEn")},${optional(form,"altNe")})`;
  done("Media uploaded");
}

export async function deleteMedia(form: FormData) {
  const sql = await db();
  await sql`DELETE FROM cms_media WHERE id=${value(form,"id")}`;
  done("Media record deleted");
}
