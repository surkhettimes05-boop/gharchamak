import type { ProductSlug, ProductStatus } from "@/src/config/brand";

export type CmsOffer = {
  id: string;
  title: string;
  titleNe: string | null;
  description: string;
  descriptionNe: string | null;
  badge: string | null;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  published: boolean;
};

export type CmsPartner = {
  id: string;
  name: string;
  partnerType: string;
  location: string | null;
  imageUrl: string | null;
  websiteUrl: string | null;
  published: boolean;
};

export type CmsReview = {
  id: string;
  customerName: string;
  quote: string;
  quoteNe: string | null;
  productSlug: ProductSlug | null;
  mediaUrl: string | null;
  published: boolean;
  featured: boolean;
};

export type CmsMedia = {
  id: string;
  label: string;
  kind: "image" | "video";
  url: string;
  altEn: string | null;
  altNe: string | null;
  createdAt: string;
};

export type ProductOverride = {
  productSlug: ProductSlug;
  status: ProductStatus | null;
  mrp: string | null;
  packSize: string | null;
  imageUrl: string | null;
};

export type CmsPublicContent = {
  offers: CmsOffer[];
  partners: CmsPartner[];
  reviews: CmsReview[];
  productOverrides: ProductOverride[];
  settings: Record<string, string>;
};

export type CmsAdminContent = CmsPublicContent & {
  media: CmsMedia[];
  databaseReady: boolean;
  error?: string;
};
