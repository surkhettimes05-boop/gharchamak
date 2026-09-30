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

No database or authentication layer is required for this brand site.
