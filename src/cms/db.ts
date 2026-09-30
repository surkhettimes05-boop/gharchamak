import { neon } from "@neondatabase/serverless";

let sqlClient: ReturnType<typeof neon> | null = null;
let schemaPromise: Promise<void> | null = null;

export function hasCmsDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getCmsSql(): ReturnType<typeof neon> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured");
  if (!sqlClient) sqlClient = neon(url);
  return sqlClient;
}

export async function ensureCmsSchema(): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      const sql = getCmsSql();
      await sql`CREATE TABLE IF NOT EXISTS cms_offers (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        title_ne TEXT,
        description TEXT NOT NULL DEFAULT '',
        description_ne TEXT,
        badge TEXT,
        image_url TEXT,
        cta_label TEXT,
        cta_url TEXT,
        starts_at TIMESTAMPTZ,
        ends_at TIMESTAMPTZ,
        published BOOLEAN NOT NULL DEFAULT FALSE,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS cms_partners (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        partner_type TEXT NOT NULL DEFAULT 'Retailer',
        location TEXT,
        image_url TEXT,
        website_url TEXT,
        published BOOLEAN NOT NULL DEFAULT FALSE,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS cms_media (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        kind TEXT NOT NULL CHECK (kind IN ('image','video')),
        url TEXT NOT NULL,
        alt_en TEXT,
        alt_ne TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS cms_reviews (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        quote TEXT NOT NULL,
        quote_ne TEXT,
        product_slug TEXT,
        media_url TEXT,
        published BOOLEAN NOT NULL DEFAULT FALSE,
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS cms_product_overrides (
        product_slug TEXT PRIMARY KEY,
        status TEXT,
        mrp TEXT,
        pack_size TEXT,
        image_url TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS cms_site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE INDEX IF NOT EXISTS cms_offers_publish_idx ON cms_offers (published, sort_order)`;
      await sql`CREATE INDEX IF NOT EXISTS cms_partners_publish_idx ON cms_partners (published, sort_order)`;
      await sql`CREATE INDEX IF NOT EXISTS cms_reviews_publish_idx ON cms_reviews (published, featured)`;
    })().catch(error => {
      schemaPromise = null;
      throw error;
    });
  }
  return schemaPromise;
}
