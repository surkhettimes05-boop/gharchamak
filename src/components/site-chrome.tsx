import Link from "next/link";
import { ArrowRight, Menu, MessageCircle, Share2 } from "lucide-react";
import { brand, type Locale, whatsappMessages, whatsappUrl } from "@/src/config/brand";
import { copy } from "@/src/content/site";

export function Logo({ light = false }: { light?: boolean }) {
  return <span className={`logo ${light ? "logo-light" : ""}`}><span className="logo-mark" aria-hidden="true">G</span><span><strong>GharChamak</strong><small>by Pasalho</small></span></span>;
}

function path(locale: Locale, slug = "") { return `/${locale}${slug ? `/${slug}` : ""}`; }

export function Header({ locale, currentPath }: { locale: Locale; currentPath: string }) {
  const c = copy[locale];
  const alternate = locale === "en" ? "ne" : "en";
  const links = [
    [c.nav.products, "products"], [c.nav.why, "why-gharchamak"], [c.nav.retailers, "retailers"],
    [c.nav.about, "about"], [c.nav.faq, "faq"],
  ] as const;
  return <>
    <a className="skip-link" href="#main">{c.skip}</a>
    <header className="site-header">
      <div className="container nav-shell">
        <Link href={path(locale)} aria-label="GharChamak home"><Logo /></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, slug]) => <Link key={slug} href={path(locale, slug)}>{label}</Link>)}
        </nav>
        <div className="nav-actions">
          <Link className="language-link" href={`/${alternate}${currentPath}`} hrefLang={alternate}>{locale === "en" ? "नेपाली" : "EN"}</Link>
          <a className="btn btn-primary nav-cta" href={whatsappUrl(whatsappMessages.general)} target="_blank" rel="noreferrer"><MessageCircle size={18} />{c.nav.whatsapp}</a>
          <details className="mobile-menu">
            <summary aria-label="Open navigation"><Menu size={23} /></summary>
            <div className="mobile-menu-panel">
              {links.map(([label, slug]) => <Link key={slug} href={path(locale, slug)}>{label}</Link>)}
              <Link href={path(locale, "contact")}>{c.nav.contact}</Link>
              <a href={whatsappUrl(whatsappMessages.general)} target="_blank" rel="noreferrer">{c.nav.whatsapp}<ArrowRight size={16} /></a>
            </div>
          </details>
        </div>
      </div>
    </header>
  </>;
}

export function Footer({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const socials = [
    ["Facebook", brand.social.facebook, Share2], ["Instagram", brand.social.instagram, Share2],
    ["TikTok", brand.social.tiktok, Share2], ["YouTube", brand.social.youtube, Share2],
  ] as const;
  return <footer className="site-footer">
    <div className="container footer-grid">
      <div className="footer-brand"><Logo light /><p>{brand.tagline}</p><p lang="ne">{brand.taglineNe}</p></div>
      <div><h2>{locale === "en" ? "Explore" : "हेर्नुहोस्"}</h2><nav aria-label="Footer navigation"><Link href={path(locale, "products")}>{c.nav.products}</Link><Link href={path(locale, "why-gharchamak")}>{c.nav.why}</Link><Link href={path(locale, "retailers")}>{c.nav.retailers}</Link><Link href={path(locale, "about")}>{c.nav.about}</Link></nav></div>
      <div><h2>{locale === "en" ? "Help" : "सहयोग"}</h2><nav><Link href={path(locale, "faq")}>{c.nav.faq}</Link><Link href={path(locale, "contact")}>{c.nav.contact}</Link><Link href={path(locale, "privacy")}>{locale === "en" ? "Privacy" : "गोपनीयता"}</Link><a href={whatsappUrl(whatsappMessages.general)} target="_blank" rel="noreferrer">WhatsApp</a></nav></div>
      <div><h2>{locale === "en" ? "Based in" : "स्थान"}</h2><p>{c.common.location}</p><a className="footer-phone" href={`tel:${brand.phone}`}>{brand.phoneDisplay}</a><div className="socials">{socials.filter(([, url]) => Boolean(url)).map(([name, url, Icon]) => <a key={name} href={url} aria-label={name}><Icon size={18} /></a>)}</div></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} GharChamak by Pasalho. All rights reserved.</span><span>{locale === "en" ? "Nepal-focused household cleaning" : "नेपाल-केन्द्रित घर सफाइ"}</span></div>
  </footer>;
}

export function WhatsAppFloat({ locale }: { locale: Locale }) {
  return <a className="whatsapp-float" href={whatsappUrl(whatsappMessages.general)} target="_blank" rel="noreferrer" aria-label={locale === "en" ? "Chat with GharChamak on WhatsApp" : "घरचमकसँग WhatsApp मा कुरा गर्नुहोस्"}><MessageCircle size={23} /></a>;
}

export function PageShell({ locale, currentPath, children }: { locale: Locale; currentPath: string; children: React.ReactNode }) {
  return <div className={locale === "ne" ? "locale-ne" : ""}><Header locale={locale} currentPath={currentPath} /><main id="main">{children}</main><Footer locale={locale} /><WhatsAppFloat locale={locale} /></div>;
}
