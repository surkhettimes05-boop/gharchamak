# GharChamak official website

Production-oriented bilingual brand website for **GharChamak by Pasalho**. Built with Next.js App Router, TypeScript, Tailwind CSS and semantic server-rendered HTML.

## Run locally

Requirements: Node.js 22.13 or later.

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal. English pages live under `/en`; Nepali pages live under `/ne`.

## Validate and build

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Central configuration

Brand contact details, WhatsApp settings, social URLs and the complete product catalog are in `src/config/brand.ts`.

- Change `phone`, `phoneDisplay` and `whatsappNumber` together when updating the WhatsApp number.
- Add verified social URLs under `brand.social`. Empty values are not rendered.
- Change a product's `status` from `coming-soon` to `available` only after commercial availability is confirmed.
- Add new products to the `products` array and extend the `ProductSlug` type. Then add the slug to the product route validation pattern in `app/[locale]/[[...slug]]/page.tsx`.

## Brand and product assets

Temporary wordmark files are in `public/brand/`. Replace them with approved artwork while keeping filenames, or update the references in the app metadata and components.

Product asset folders:

- `public/products/dishwash/`
- `public/products/floor-cleaner/`
- `public/products/toilet-cleaner/`

The current site intentionally shows polished category placeholders rather than fabricated packaging. When approved transparent WebP/AVIF product photography is available, replace the visual placeholder component in `src/components/pages.tsx` with `next/image` and provide explicit dimensions and responsive `sizes`.

## Content and translations

Shared English and Nepali interface copy lives in `src/content/site.ts`. Product-specific translated content lives beside each product in `src/config/brand.ts`. Have final Nepali marketing and label copy reviewed before commercial launch.

## SEO

Page metadata, canonical URLs, Open Graph/Twitter support, hreflang alternates and JSON-LD are generated in `app/[locale]/[[...slug]]/page.tsx`. `app/sitemap.ts` and `app/robots.ts` generate crawlable endpoints. Set `NEXT_PUBLIC_SITE_URL` to the final canonical origin in production.

No offer, price, ingredient, certification or availability schema is emitted until factual values exist. To add a social preview image later, place the approved file in `public/` and set `brand.ogImage`.

## Analytics and Search Console

Copy `.env.example` to `.env.local` and add only the IDs you intend to activate:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

Analytics scripts are not rendered when IDs are empty. If analytics or advertising pixels are enabled for public use, update the privacy notice and consent approach as required for the target market.

## Deployment

Run `npm run build` for a production build. This project includes Sites hosting configuration and can also be adapted to another Next.js-compatible host. Configure the environment values above on the deployment platform before publishing.
