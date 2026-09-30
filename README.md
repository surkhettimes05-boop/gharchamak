# GharChamak official website

Production-oriented bilingual brand website for **GharChamak**, built with Next.js App Router, TypeScript and Tailwind CSS.

## Local development

Requirements: Node.js 22.13 or later.

```bash
npm install
npm run dev
```

English pages live under `/en`; Nepali pages live under `/ne`.

## Production checks

```bash
npm run lint
npm run typecheck
npm run build
```

CI runs the same checks on pushes and pull requests to `main`.

## Configuration

Copy `.env.example` to `.env.local`.

- `NEXT_PUBLIC_SITE_URL` is the canonical public origin for SEO metadata, sitemap, robots and structured data.
- On Vercel, the site also falls back to `VERCEL_PROJECT_PRODUCTION_URL` when a canonical override is not supplied.
- Analytics and advertising scripts are disabled unless their environment IDs are set.

Brand contact details, WhatsApp settings, social URLs and the product catalog are maintained in `src/config/brand.ts`.

## Product truth

All launch products are currently marked `coming-soon`. Do not publish pack sizes, prices, ingredients, certifications, safety claims or retail availability until they are commercially confirmed. Packaging artwork in this repository is concept artwork, not an approved commercial label.

## SEO

Localized metadata, canonical URLs, hreflang alternates and JSON-LD are generated in `app/[locale]/[[...slug]]/page.tsx`. The sitemap and robots files use the same canonical origin.

## Deployment

The project is configured for native Vercel Next.js deployment. Set the production environment values in Vercel before publishing a custom domain.

## Admin CMS

The repository now includes a protected admin panel at `/admin`.

It manages:
- offers and campaigns
- retailer/distributor partners
- image/video media records and image uploads
- customer reviews
- homepage announcement content
- product availability, MRP, pack size and public product image overrides

The public site only renders published CMS records. Static brand/product content remains the fallback when the CMS is not configured.

### Admin infrastructure

1. Provision **Neon Postgres** through Vercel Marketplace and expose `DATABASE_URL`.
2. Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD` and a long `ADMIN_SESSION_SECRET`.
3. Provision **Vercel Blob** and expose `BLOB_READ_WRITE_TOKEN` if direct media uploads are required.
4. Redeploy. The CMS tables are created lazily on first use.

Do not prefix admin credentials or database/blob tokens with `NEXT_PUBLIC_`.

The V1 admin uses a single environment-configured owner account. If multiple staff accounts, granular permissions or audit approval workflows become necessary, replace this with a full identity provider before expanding access.
