import type { Locale } from "@/src/config/brand";

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <div lang={locale === "ne" ? "ne" : "en"}>{children}</div>;
}
