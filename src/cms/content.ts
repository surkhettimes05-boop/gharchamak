import { ensureCmsSchema, getCmsSql, hasCmsDatabase } from "@/src/cms/db";
import type { CmsAdminContent, CmsMedia, CmsOffer, CmsPartner, CmsPublicContent, CmsReview, ProductOverride } from "@/src/cms/types";

const emptyPublic: CmsPublicContent = { offers: [], partners: [], reviews: [], productOverrides: [], settings: {} };

function text(value: unknown): string | null {
  return value === null || value === undefined || value === "" ? null : String(value);
}

function mapOffer(row: Record<string, unknown>): CmsOffer {
  return { id: String(row.id), title: String(row.title), titleNe: text(row.titleNe), description: String(row.description || ""), descriptionNe: text(row.descriptionNe), badge: text(row.badge), imageUrl: text(row.imageUrl), ctaLabel: text(row.ctaLabel), ctaUrl: text(row.ctaUrl), published: Boolean(row.published) };
}
function mapPartner(row: Record<string, unknown>): CmsPartner {
  return { id: String(row.id), name: String(row.name), partnerType: String(row.partnerType || "Retailer"), location: text(row.location), imageUrl: text(row.imageUrl), websiteUrl: text(row.websiteUrl), published: Boolean(row.published) };
}
function mapReview(row: Record<string, unknown>): CmsReview {
  return { id: String(row.id), customerName: String(row.customerName), quote: String(row.quote), quoteNe: text(row.quoteNe), productSlug: text(row.productSlug) as CmsReview["productSlug"], mediaUrl: text(row.mediaUrl), published: Boolean(row.published), featured: Boolean(row.featured) };
}
function mapProductOverride(row: Record<string, unknown>): ProductOverride {
  return { productSlug: String(row.productSlug) as ProductOverride["productSlug"], status: text(row.status) as ProductOverride["status"], mrp: text(row.mrp), packSize: text(row.packSize), imageUrl: text(row.imageUrl) };
}
function settingsMap(rows: Record<string, unknown>[]): Record<string, string> {
  return Object.fromEntries(rows.map(row => [String(row.key), String(row.value || "")]).filter(([, value]) => Boolean(value)));
}

export async function getPublicCmsContent(): Promise<CmsPublicContent> {
  if (!hasCmsDatabase()) return emptyPublic;
  try {
    await ensureCmsSchema();
    const sql = getCmsSql();
    const [offerRows, partnerRows, reviewRows, productRows, settingRows] = await Promise.all([
      sql`SELECT id,title,title_ne AS "titleNe",description,description_ne AS "descriptionNe",badge,image_url AS "imageUrl",cta_label AS "ctaLabel",cta_url AS "ctaUrl",published FROM cms_offers WHERE published=TRUE AND (starts_at IS NULL OR starts_at<=NOW()) AND (ends_at IS NULL OR ends_at>=NOW()) ORDER BY sort_order, created_at DESC LIMIT 12`,
      sql`SELECT id,name,partner_type AS "partnerType",location,image_url AS "imageUrl",website_url AS "websiteUrl",published FROM cms_partners WHERE published=TRUE ORDER BY sort_order, created_at DESC LIMIT 24`,
      sql`SELECT id,customer_name AS "customerName",quote,quote_ne AS "quoteNe",product_slug AS "productSlug",media_url AS "mediaUrl",published,featured FROM cms_reviews WHERE published=TRUE ORDER BY featured DESC, created_at DESC LIMIT 12`,
      sql`SELECT product_slug AS "productSlug",status,mrp,pack_size AS "packSize",image_url AS "imageUrl" FROM cms_product_overrides`,
      sql`SELECT key,value FROM cms_site_settings`,
    ]);
    return {
      offers: (offerRows as Record<string, unknown>[]).map(mapOffer),
      partners: (partnerRows as Record<string, unknown>[]).map(mapPartner),
      reviews: (reviewRows as Record<string, unknown>[]).map(mapReview),
      productOverrides: (productRows as Record<string, unknown>[]).map(mapProductOverride),
      settings: settingsMap(settingRows as Record<string, unknown>[]),
    };
  } catch {
    return emptyPublic;
  }
}

export async function getAdminCmsContent(): Promise<CmsAdminContent> {
  if (!hasCmsDatabase()) return { ...emptyPublic, media: [], databaseReady: false, error: "DATABASE_URL is not configured." };
  try {
    await ensureCmsSchema();
    const sql = getCmsSql();
    const [offerRows, partnerRows, reviewRows, productRows, settingRows, mediaRows] = await Promise.all([
      sql`SELECT id,title,title_ne AS "titleNe",description,description_ne AS "descriptionNe",badge,image_url AS "imageUrl",cta_label AS "ctaLabel",cta_url AS "ctaUrl",published FROM cms_offers ORDER BY created_at DESC`,
      sql`SELECT id,name,partner_type AS "partnerType",location,image_url AS "imageUrl",website_url AS "websiteUrl",published FROM cms_partners ORDER BY created_at DESC`,
      sql`SELECT id,customer_name AS "customerName",quote,quote_ne AS "quoteNe",product_slug AS "productSlug",media_url AS "mediaUrl",published,featured FROM cms_reviews ORDER BY created_at DESC`,
      sql`SELECT product_slug AS "productSlug",status,mrp,pack_size AS "packSize",image_url AS "imageUrl" FROM cms_product_overrides ORDER BY product_slug`,
      sql`SELECT key,value FROM cms_site_settings`,
      sql`SELECT id,label,kind,url,alt_en AS "altEn",alt_ne AS "altNe",created_at AS "createdAt" FROM cms_media ORDER BY created_at DESC LIMIT 100`,
    ]);
    const media: CmsMedia[] = (mediaRows as Record<string, unknown>[]).map(row => ({ id: String(row.id), label: String(row.label), kind: String(row.kind) as CmsMedia["kind"], url: String(row.url), altEn: text(row.altEn), altNe: text(row.altNe), createdAt: new Date(String(row.createdAt)).toISOString() }));
    return {
      offers: (offerRows as Record<string, unknown>[]).map(mapOffer),
      partners: (partnerRows as Record<string, unknown>[]).map(mapPartner),
      reviews: (reviewRows as Record<string, unknown>[]).map(mapReview),
      productOverrides: (productRows as Record<string, unknown>[]).map(mapProductOverride),
      settings: settingsMap(settingRows as Record<string, unknown>[]),
      media,
      databaseReady: true,
    };
  } catch (error) {
    return { ...emptyPublic, media: [], databaseReady: false, error: error instanceof Error ? error.message : "Could not connect to the CMS database." };
  }
}
