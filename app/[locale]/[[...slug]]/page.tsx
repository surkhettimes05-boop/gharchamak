import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutPage, ContactPage, FaqPage, HomePage, PrivacyPage, ProductPage, ProductsPage, RetailersPage, WhyPage } from "@/src/components/pages";
import { PageShell } from "@/src/components/site-chrome";
import { brand, products, type Locale, type ProductSlug } from "@/src/config/brand";
import { faqItems } from "@/src/content/site";

type Params = Promise<{ locale: string; slug?: string[] }>;
const locales: Locale[] = ["en", "ne"];
const simplePages = ["products", "why-gharchamak", "retailers", "about", "faq", "contact", "privacy"] as const;

function isLocale(value: string): value is Locale { return locales.includes(value as Locale); }
function getRoute(slug?: string[]) { return slug?.join("/") || ""; }
function validRoute(route: string) { return route === "" || simplePages.includes(route as (typeof simplePages)[number]) || /^products\/(dishwash-liquid|floor-cleaner|toilet-cleaner)$/.test(route); }

const meta: Record<Locale, Record<string, [string, string]>> = {
  en: {
    "": ["Strong Clean. Fair Price.", "Reliable everyday household cleaning by Pasalho, developed for Nepali homes with dependable quality and fair prices."],
    products: ["Household Cleaning Products", "Explore GharChamak dishwash liquid, floor cleaner and toilet cleaner, all currently coming soon in Nepal."],
    "why-gharchamak": ["Why GharChamak", "Learn how GharChamak combines dependable everyday cleaning, consistent quality and fair value for Nepali households."],
    retailers: ["Retailer & Distributor Enquiries", "Register interest in stocking or distributing GharChamak household cleaning products in Nepal."],
    about: ["About GharChamak by Pasalho", "GharChamak is a Nepal-focused home-care brand by Pasalho with a mission to make dependable cleaning more accessible."],
    faq: ["Frequently Asked Questions", "Clear answers about GharChamak products, planned availability, product use and retailer enquiries."],
    contact: ["Contact GharChamak", "Contact GharChamak by WhatsApp or phone for product, retailer and distribution enquiries."],
    privacy: ["Privacy", "How GharChamak handles website enquiries, analytics and personal information."],
  },
  ne: {
    "": ["बलियो सफाइ, सही दाम।", "पसल्होको घरचमक नेपाली घरका लागि भरपर्दो दैनिक सफाइ र उचित मूल्यमा केन्द्रित ब्रान्ड हो।"],
    products: ["घर सफाइ उत्पादनहरू", "घरचमक भाँडा धुने झोल, फ्लोर क्लिनर र ट्वाइलेट क्लिनर हेर्नुहोस्। सबै उत्पादन हाल चाँडै आउँदैछन्।"],
    "why-gharchamak": ["किन घरचमक", "घरचमकको भरपर्दो दैनिक सफाइ, एकरूप गुणस्तर र उचित मूल्यको सोचबारे जान्नुहोस्।"],
    retailers: ["खुद्रा तथा वितरण सोधपुछ", "नेपालमा घरचमक सफाइ उत्पादन राख्न वा वितरण गर्न रुचि दर्ता गर्नुहोस्।"],
    about: ["पसल्होको घरचमकबारे", "घरचमक भरपर्दो सफाइ धेरै नेपाली घरको पहुँचमा पुर्‍याउने उद्देश्य भएको पसल्होको होम-केयर ब्रान्ड हो।"],
    faq: ["बारम्बार सोधिने प्रश्न", "घरचमक उत्पादन, उपलब्धता, प्रयोग र विक्रेता सोधपुछबारे स्पष्ट उत्तर।"],
    contact: ["घरचमक सम्पर्क", "उत्पादन, खुद्रा वा वितरण सोधपुछका लागि WhatsApp वा फोनमार्फत घरचमकलाई सम्पर्क गर्नुहोस्।"],
    privacy: ["गोपनीयता", "घरचमकले वेबसाइट सोधपुछ, एनालिटिक्स र व्यक्तिगत जानकारी कसरी व्यवस्थापन गर्छ।"],
  },
};

export function generateStaticParams() {
  const routes = [[], ...simplePages.map(p => [p]), ...products.map(p => ["products", p.slug])];
  return locales.flatMap(locale => routes.map(slug => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const route = getRoute(slug);
  const productSlug = route.startsWith("products/") ? route.split("/")[1] as ProductSlug : null;
  const product = productSlug ? products.find(p => p.slug === productSlug) : undefined;
  const [title, description] = product ? [product.name[rawLocale], product.short[rawLocale]] : (meta[rawLocale][route] || meta[rawLocale][""]);
  const canonical = `/${rawLocale}${route ? `/${route}` : ""}`;
  const alternateRoute = `/${rawLocale === "en" ? "ne" : "en"}${route ? `/${route}` : ""}`;
  return {
    title, description,
    alternates: { canonical, languages: { en: rawLocale === "en" ? canonical : alternateRoute, ne: rawLocale === "ne" ? canonical : alternateRoute, "x-default": `/en${route ? `/${route}` : ""}` } },
    openGraph: { title, description, url: canonical, siteName: brand.name, locale: rawLocale === "ne" ? "ne_NP" : "en_NP", type: "website", images: brand.ogImage ? [brand.ogImage] : undefined },
    twitter: { card: brand.ogImage ? "summary_large_image" : "summary", title, description, images: brand.ogImage ? [brand.ogImage] : undefined },
  };
}

function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export default async function LocalizedPage({ params }: { params: Params }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const route = getRoute(slug);
  if (!validRoute(route)) notFound();
  const currentPath = route ? `/${route}` : "";
  let page: React.ReactNode;
  if (route === "") page = <HomePage locale={locale} />;
  else if (route === "products") page = <ProductsPage locale={locale} />;
  else if (route === "why-gharchamak") page = <WhyPage locale={locale} />;
  else if (route === "retailers") page = <RetailersPage locale={locale} />;
  else if (route === "about") page = <AboutPage locale={locale} />;
  else if (route === "faq") page = <FaqPage locale={locale} />;
  else if (route === "contact") page = <ContactPage locale={locale} />;
  else if (route === "privacy") page = <PrivacyPage locale={locale} />;
  else page = <ProductPage locale={locale} slug={route.split("/")[1] as ProductSlug} />;

  const organization = { "@context": "https://schema.org", "@type": "Organization", name: brand.name, url: brand.siteUrl, description: brand.description, telephone: brand.phone, areaServed: "Nepal", brand: { "@type": "Brand", name: brand.name }, parentOrganization: { "@type": "Organization", name: brand.parentBrand }, sameAs: Object.values(brand.social).filter(Boolean) };
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: brand.name, url: brand.siteUrl, inLanguage: ["en", "ne"] };
  const extra: object[] = [];
  if (route === "faq") extra.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems[locale].map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
  if (route.startsWith("products/")) {
    const product = products.find(p => p.slug === route.split("/")[1])!;
    extra.push({ "@context": "https://schema.org", "@type": "Product", name: product.name[locale], description: product.short[locale], brand: { "@type": "Brand", name: brand.name }, category: "Household cleaning product" });
    extra.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: locale === "en" ? "Home" : "गृहपृष्ठ", item: `${brand.siteUrl}/${locale}` }, { "@type": "ListItem", position: 2, name: locale === "en" ? "Products" : "उत्पादनहरू", item: `${brand.siteUrl}/${locale}/products` }, { "@type": "ListItem", position: 3, name: product.name[locale] }] });
  }
  return <PageShell locale={locale} currentPath={currentPath}><JsonLd data={[organization, website, ...extra]} />{page}</PageShell>;
}
