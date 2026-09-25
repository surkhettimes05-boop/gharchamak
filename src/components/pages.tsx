import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, Home, MapPin, MessageCircle, PackageCheck, Phone, Sparkles, Store, Truck, WalletCards } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { brand, products, type Locale, type ProductSlug, whatsappMessages, whatsappUrl } from "@/src/config/brand";
import { copy, faqItems } from "@/src/content/site";

const path = (locale: Locale, slug = "") => `/${locale}${slug ? `/${slug}` : ""}`;

export function SectionHeading({ eyebrow, title, copyText, center = false }: { eyebrow?: string; title: string; copyText?: string; center?: boolean }) {
  return <div className={`section-heading ${center ? "center" : ""}`}>{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}<h2>{title}</h2>{copyText ? <p>{copyText}</p> : null}</div>;
}

export function ProductVisual({ product, large = false }: { product: (typeof products)[number]; large?: boolean }) {
  return <div className={`product-visual product-${product.color} ${large ? "product-visual-large" : ""}`}>
    <div className={`mockup-crop mockup-${product.slug}`}>
      <img src="/brand/gharchamak-range.webp" alt={`${product.name.en} packaging concept`} />
    </div>
    <span className="visual-glow" />
  </div>;
}

export function ProductCard({ product, locale }: { product: (typeof products)[number]; locale: Locale }) {
  const c = copy[locale];
  return <article className={`product-card card-${product.color}`}>
    <div className="product-card-visual"><ProductVisual product={product} /></div>
    <div className="product-card-body">
      <div className="product-meta"><span className="status-dot" />{c.common.coming}</div>
      <p className="product-variant">{product.variant[locale]}</p>
      <h3>{product.name[locale]}</h3>
      <p>{product.short[locale]}</p>
      <Link className="text-link" href={path(locale, `products/${product.slug}`)}>{c.common.learn}<ArrowRight size={16} /></Link>
    </div>
  </article>;
}

export function FaqList({ locale, limit }: { locale: Locale; limit?: number }) {
  const items = limit ? faqItems[locale].slice(0, limit) : faqItems[locale];
  return <Accordion className="faq-list" type="multiple">{items.map(([question, answer], i) => <AccordionItem value={`item-${i}`} key={question}><AccordionTrigger className="faq-question">{question}</AccordionTrigger><AccordionContent className="faq-answer"><p>{answer}</p></AccordionContent></AccordionItem>)}</Accordion>;
}

const benefits = {
  en: [[Sparkles, "Strong Clean", "Practical cleaning performance for everyday household use."], [WalletCards, "Fair Price", "Value engineered for repeat purchase, not premium theatre."], [BadgeCheck, "Consistent Quality", "Clear expectations, simple claims and disciplined product standards."], [Home, "Made for Everyday Homes", "Designed around the routines of real Nepali households."]],
  ne: [[Sparkles, "बलियो सफाइ", "दैनिक घरायसी प्रयोगका लागि व्यावहारिक सफाइ प्रदर्शन।"], [WalletCards, "सही दाम", "महँगो देखावटभन्दा पुनःखरिद योग्य मूल्य।"], [BadgeCheck, "एकरूप गुणस्तर", "स्पष्ट अपेक्षा, सरल दाबी र अनुशासित उत्पादन मापदण्ड।"], [Home, "दैनिक घरका लागि", "वास्तविक नेपाली घरको दैनिक जीवनलाई ध्यानमा राखेर।"]],
} as const;

export function HomePage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return <>
    <section className="hero-premium">
      <div className="hero-aurora hero-aurora-one" />
      <div className="hero-aurora hero-aurora-two" />
      <div className="container hero-premium-grid">
        <div className="hero-premium-copy">
          <div className="hero-chip"><span className="chip-spark">✦</span>{locale === "en" ? "Home care, built for Nepal" : "नेपालका लागि बनेको होम केयर"}</div>
          <h1>{locale === "en" ? <>A cleaner home.<br/><span>Without the premium.</span></> : <>सफा घर।<br/><span>अनावश्यक महँगो मूल्य बिना।</span></>}</h1>
          <p className="hero-ne" lang="ne">{brand.taglineNe}</p>
          <p className="hero-description">{c.home.heroCopy}</p>
          <div className="button-row">
            <Link className="btn btn-dark btn-lg" href={path(locale, "products")}>{c.home.explore}<ArrowRight size={18} /></Link>
            <a className="btn btn-glass btn-lg" href={whatsappUrl(whatsappMessages.general)} target="_blank" rel="noreferrer"><MessageCircle size={18} />{c.common.chat}</a>
          </div>
          <div className="hero-proof">
            <span><BadgeCheck size={16}/>GharChamak by Pasalho</span>
            <span>{locale === "en" ? "Launching from Surkhet" : "सुर्खेतबाट सुरुवात"}</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-card">
            <img src="/brand/gharchamak-range.webp" alt="GharChamak dishwash, floor cleaner and toilet cleaner packaging concepts" />
          </div>
          <div className="floating-note note-one"><small>{locale === "en" ? "Brand promise" : "ब्रान्ड वाचा"}</small><strong>{brand.tagline}</strong></div>
          <div className="floating-note note-two"><span className="mini-dot" />{locale === "en" ? "3 focused launch products" : "३ केन्द्रित सुरुवाती उत्पादन"}</div>
        </div>
      </div>
    </section>

    <section className="signal-strip">
      <div className="container signal-grid">
        <div><span>01</span><strong>{locale === "en" ? "Clear performance" : "स्पष्ट प्रदर्शन"}</strong></div>
        <div><span>02</span><strong>{locale === "en" ? "Fair everyday value" : "दैनिक उचित मूल्य"}</strong></div>
        <div><span>03</span><strong>{locale === "en" ? "Shelf-ready design" : "पसलमैत्री डिजाइन"}</strong></div>
        <div><span>04</span><strong>{locale === "en" ? "Built for repeat use" : "पुनः प्रयोगका लागि"}</strong></div>
      </div>
    </section>

    <section className="section products-section">
      <div className="container">
        <div className="section-topline">
          <SectionHeading eyebrow={locale === "en" ? "Launch range" : "सुरुवाती दायरा"} title={locale === "en" ? "Three products. One clear promise." : "तीन उत्पादन। एउटै स्पष्ट वाचा।"} copyText={locale === "en" ? "A focused first range designed to look coherent on shelf and solve common cleaning jobs without confusing the customer." : "सामान्य सफाइ आवश्यकताका लागि स्पष्ट, एउटै पहिचान भएको सुरुवाती उत्पादन दायरा।"} />
          <Link className="text-link section-link" href={path(locale, "products")}>{locale === "en" ? "Explore the range" : "उत्पादन हेर्नुहोस्"}<ArrowRight size={16}/></Link>
        </div>
        <div className="product-grid">{products.map(p => <ProductCard key={p.slug} product={p} locale={locale} />)}</div>
      </div>
    </section>

    <section className="section system-section">
      <div className="container system-grid">
        <div className="system-copy">
          <p className="eyebrow">{locale === "en" ? "Designed as a system" : "एक प्रणालीको रूपमा डिजाइन"}</p>
          <h2>{locale === "en" ? "One brand language across every bottle." : "हरेक बोतलमा एउटै ब्रान्ड भाषा।"}</h2>
          <p>{locale === "en" ? "Deep blue builds trust. Product colors make categories instantly recognizable. The house-and-spark symbol carries the promise of a cleaner home without relying on a generic lettermark." : "गाढा निलोले भरोसा दिन्छ। उत्पादन रंगले श्रेणी छुट्याउँछ। घर र चमक चिन्हले साधारण अक्षर चिन्हभन्दा फरक पहिचान दिन्छ।"}</p>
          <div className="system-pills"><span>Deep Blue #0047BA</span><span>Bright Red #E11D2E</span><span>Fresh Green #22C55E</span></div>
        </div>
        <div className="system-board">
          <div className="brand-symbol-large">
            <svg viewBox="0 0 180 150" aria-hidden="true"><path d="M18 72 88 17l74 55" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/><path d="M43 70v60h92V70" fill="none" stroke="currentColor" strokeWidth="14" strokeLinejoin="round"/><path d="M90 84v27M76 97h28" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/></svg><i>✦</i>
          </div>
          <div className="brand-wordmark"><strong><span>Ghar</span><em>Chamak</em></strong><small>by Pasalho</small></div>
          <div className="brand-tagline">{brand.tagline}<span lang="ne">{brand.taglineNe}</span></div>
        </div>
      </div>
    </section>

    <section className="section principles-section">
      <div className="container">
        <SectionHeading eyebrow={locale === "en" ? "What we optimize for" : "हामी केका लागि बनाउँदैछौँ"} title={c.home.stands} />
        <div className="benefit-grid">{benefits[locale].map(([Icon, title, text]) => <article className="benefit-card" key={title}><span className="icon-box"><Icon size={22} /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>

    <RetailerBanner locale={locale} />

    <section className="section faq-section"><div className="container faq-grid"><SectionHeading eyebrow="FAQ" title={locale === "en" ? "Clear answers, no clutter." : "स्पष्ट उत्तर, अनावश्यक जटिलता बिना।"} copyText={locale === "en" ? "The essentials about GharChamak, availability and future stocking." : "घरचमक, उपलब्धता र भविष्यको स्टकबारे मुख्य जानकारी।"} /><div><FaqList locale={locale} limit={5} /><Link className="text-link faq-more" href={path(locale, "faq")}>{locale === "en" ? "View all questions" : "सबै प्रश्न हेर्नुहोस्"}<ArrowRight size={17} /></Link></div></div></section>
    <ContactBanner locale={locale} />
  </>;
}

export function RetailerBanner({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return <section className="retailer-section"><div className="container retailer-grid"><div><p className="eyebrow light">{locale === "en" ? "Trade partners" : "व्यापार साझेदार"}</p><h2>{c.home.retailerTitle}</h2><p>{c.home.retailerCopy}</p><a className="btn btn-white" href={whatsappUrl(whatsappMessages.retailer)} target="_blank" rel="noreferrer">{c.common.enquiry}<ArrowRight size={18} /></a></div><div className="trade-card">{(locale === "en" ? ["Clear product positioning", "Consumer-friendly pricing", "Coherent shelf identity", "Reliable supply ambition"] : ["स्पष्ट उत्पादन पहिचान", "ग्राहकमैत्री मूल्य", "एकरूप शेल्फ पहिचान", "भरपर्दो आपूर्ति लक्ष्य"]).map(item => <div key={item}><Check size={17}/><span>{item}</span></div>)}</div></div></section>;
}

export function ContactBanner({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return <section className="contact-banner"><div className="container contact-banner-inner"><div><p className="eyebrow">WhatsApp</p><h2>{c.home.contactTitle}</h2><p>{c.home.contactCopy}</p></div><a className="btn btn-dark" href={whatsappUrl(whatsappMessages.general)} target="_blank" rel="noreferrer"><MessageCircle size={19} />{c.common.chat}</a></div></section>;
}

export function PageIntro({ eyebrow, title, copyText }: { eyebrow: string; title: string; copyText: string }) {
  return <section className="page-intro"><div className="page-intro-orb"/><div className="container"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copyText}</p></div></section>;
}

export function ProductsPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return <><PageIntro eyebrow={c.nav.products} title={locale === "en" ? "A focused range for everyday cleaning." : "दैनिक सफाइका लागि केन्द्रित उत्पादन दायरा।"} copyText={locale === "en" ? "Three household cleaning products are being prepared as the first GharChamak range." : "घरचमकको पहिलो दायराका रूपमा तीन घर सफाइ उत्पादन तयार हुँदैछन्।"} /><section className="section"><div className="container product-grid">{products.map(p => <ProductCard key={p.slug} product={p} locale={locale} />)}</div></section><section className="small-note"><div className="container"><PackageCheck size={24}/><div><h2>{locale === "en" ? "Launch information, kept honest." : "बजार जानकारी, स्पष्ट रूपमा।"}</h2><p>{locale === "en" ? "Prices, pack sizes, ingredients and retail availability will only be published after confirmation." : "मूल्य, प्याक साइज, सामग्री र खुद्रा उपलब्धता पुष्टि भएपछि मात्र प्रकाशित गरिनेछ।"}</p></div></div></section><ContactBanner locale={locale}/></>;
}

export function ProductPage({ locale, slug }: { locale: Locale; slug: ProductSlug }) {
  const c = copy[locale]; const product = products.find(p => p.slug === slug)!; const related = products.filter(p => p.slug !== slug);
  const message = `Namaste, I would like more information about ${product.name.en}.`;
  return <><section className="product-hero"><div className="container"><nav className="breadcrumbs"><Link href={path(locale)}>{c.common.home}</Link><span>/</span><Link href={path(locale, "products")}>{c.nav.products}</Link><span>/</span><span>{product.name[locale]}</span></nav><div className="product-detail-grid"><ProductVisual product={product} large/><div><div className="product-meta"><span className="status-dot"/>{c.common.coming}</div><p className="product-variant">{product.variant[locale]}</p><h1>{product.name[locale]}</h1><p className="product-lead">{product.short[locale]}</p><a className="btn btn-dark btn-lg" href={whatsappUrl(message)} target="_blank" rel="noreferrer"><MessageCircle size={18}/>{c.common.productEnquiry}</a></div></div></div></section><section className="section"><div className="container detail-grid"><article><h2>{c.common.characteristics}</h2><ul className="check-list">{product.characteristics[locale].map(item => <li key={item}><Check size={18}/>{item}</li>)}</ul></article><article><h2>{c.common.use}</h2><p>{product.use[locale]}</p></article><article><h2>{c.common.packSizes}</h2><p>{c.common.packPending}</p></article><article><h2>{c.common.safety}</h2><p>{c.common.safetyCopy}</p></article></div></section><section className="section related-section"><div className="container"><SectionHeading title={c.common.related}/><div className="product-grid related-grid">{related.map(p => <ProductCard key={p.slug} product={p} locale={locale}/>)}</div></div></section></>;
}

export function WhyPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return <><PageIntro eyebrow={c.nav.why} title={locale === "en" ? "Dependable cleaning. Sensible value." : "भरपर्दो सफाइ। उचित मूल्य।"} copyText={locale === "en" ? "GharChamak is built for the practical middle: trustworthy everyday performance without unnecessary premium pricing." : "घरचमक व्यावहारिक बीचको विकल्पका रूपमा बन्दैछ: अनावश्यक महँगो मूल्यबिना भरपर्दो दैनिक सफाइ।"}/><section className="section"><div className="container benefit-grid">{benefits[locale].map(([Icon,title,text]) => <article className="benefit-card elevated" key={title}><span className="icon-box"><Icon size={22}/></span><h2>{title}</h2><p>{text}</p></article>)}</div></section><ContactBanner locale={locale}/></>;
}

export function RetailersPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return <><PageIntro eyebrow={c.nav.retailers} title={locale === "en" ? "A practical brand for practical shelves." : "व्यावहारिक पसलका लागि व्यावहारिक ब्रान्ड।"} copyText={locale === "en" ? "Retailers, wholesalers and distribution partners can register interest in GharChamak’s planned product range." : "खुद्रा विक्रेता, थोक विक्रेता र वितरण साझेदारले घरचमकको योजनाबद्ध उत्पादन दायरामा रुचि दर्ता गर्न सक्छन्।"}/><section className="section"><div className="container trade-grid"><article><Store size={28}/><h2>{locale === "en" ? "Retailers" : "खुद्रा विक्रेता"}</h2><p>{locale === "en" ? "Tell us about your store and the customers you serve. We’ll share confirmed stocking information when ready." : "आफ्नो पसल र ग्राहकबारे बताउनुहोस्। पुष्टि भएको स्टक जानकारी तयार भएपछि साझा गर्नेछौं।"}</p><a className="text-link" href={whatsappUrl(whatsappMessages.retailer)} target="_blank" rel="noreferrer">{c.common.enquiry}<ArrowRight size={17}/></a></article><article><Truck size={28}/><h2>{locale === "en" ? "Distributors & wholesalers" : "वितरक र थोक विक्रेता"}</h2><p>{locale === "en" ? "Share your coverage area and distribution interest directly with the GharChamak team." : "आफ्नो वितरण क्षेत्र र सहकार्यको रुचि घरचमक टोलीसँग सिधै साझा गर्नुहोस्।"}</p><a className="text-link" href={whatsappUrl(whatsappMessages.distributor)} target="_blank" rel="noreferrer">{locale === "en" ? "Distributor enquiry" : "वितरण सोधपुछ"}<ArrowRight size={17}/></a></article></div></section><RetailerBanner locale={locale}/></>;
}

export function AboutPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return <><PageIntro eyebrow={c.nav.about} title={locale === "en" ? "A home-care brand by Pasalho." : "पसल्होको होम-केयर ब्रान्ड।"} copyText={c.home.storyCopy}/><section className="section"><div className="container about-grid"><article><p className="eyebrow">{locale === "en" ? "Our mission" : "हाम्रो उद्देश्य"}</p><h2>{locale === "en" ? "Make dependable everyday cleaning accessible to more Nepali households." : "भरपर्दो दैनिक सफाइ धेरै नेपाली घरको पहुँचमा पुर्‍याउनु।"}</h2></article><article><h2>{locale === "en" ? "Why GharChamak exists" : "घरचमक किन बनिरहेको छ"}</h2><p>{locale === "en" ? "Families should not have to choose between questionable quality and unnecessary premium pricing. Clear products, consistent quality and sensible prices can earn trust over time." : "परिवारले शंकास्पद गुणस्तर र अनावश्यक महँगो मूल्यबीच छनोट गर्न नपरोस्। स्पष्ट उत्पादन, एकरूप गुणस्तर र उचित मूल्यले समयसँगै विश्वास जित्न सक्छ।"}</p><blockquote><strong>{brand.tagline}</strong><span lang="ne">{brand.taglineNe}</span></blockquote></article></div></section><ContactBanner locale={locale}/></>;
}

export function FaqPage({ locale }: { locale: Locale }) {
  return <><PageIntro eyebrow="FAQ" title={locale === "en" ? "Questions about GharChamak" : "घरचमकबारे प्रश्नहरू"} copyText={locale === "en" ? "Direct answers about the brand, products, launch and trade enquiries." : "ब्रान्ड, उत्पादन, बजार प्रवेश र व्यापारिक सोधपुछबारे सीधा उत्तर।"}/><section className="section"><div className="container narrow"><FaqList locale={locale}/></div></section><ContactBanner locale={locale}/></>;
}

export function ContactPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return <><PageIntro eyebrow={c.nav.contact} title={c.home.contactTitle} copyText={c.home.contactCopy}/><section className="section"><div className="container contact-grid"><article className="contact-primary"><MessageCircle size={32}/><h2>WhatsApp</h2><p>{locale === "en" ? "For product questions, launch updates and general enquiries." : "उत्पादन प्रश्न, बजार अपडेट र सामान्य सोधपुछका लागि।"}</p><a className="btn btn-dark" href={whatsappUrl(whatsappMessages.general)} target="_blank" rel="noreferrer">{brand.phoneDisplay}</a></article><article><Phone size={26}/><h2>{locale === "en" ? "Phone" : "फोन"}</h2><a href={`tel:${brand.phone}`}>{brand.phoneDisplay}</a></article><article><MapPin size={26}/><h2>{locale === "en" ? "Location" : "स्थान"}</h2><p>{c.common.location}</p></article><article><Store size={26}/><h2>{locale === "en" ? "Trade enquiries" : "व्यापारिक सोधपुछ"}</h2><a href={whatsappUrl(whatsappMessages.retailer)} target="_blank" rel="noreferrer">{c.common.enquiry}<ArrowRight size={16}/></a></article></div></section></>;
}

export function PrivacyPage({ locale }: { locale: Locale }) {
  return <><PageIntro eyebrow={locale === "en" ? "Privacy" : "गोपनीयता"} title={locale === "en" ? "A simple privacy approach." : "सरल गोपनीयता दृष्टिकोण।"} copyText={locale === "en" ? "GharChamak keeps this website intentionally simple and does not collect unnecessary personal information." : "घरचमकले यो वेबसाइट सरल राख्छ र अनावश्यक व्यक्तिगत जानकारी सङ्कलन गर्दैन।"}/><section className="section"><div className="container prose"><h2>{locale === "en" ? "Information you choose to share" : "तपाईंले साझा गर्ने जानकारी"}</h2><p>{locale === "en" ? "If you contact GharChamak through WhatsApp, phone or a configured social channel, that service handles the information you send under its own privacy terms." : "WhatsApp, फोन वा उपलब्ध सामाजिक माध्यमबाट सम्पर्क गर्दा सो सेवाको गोपनीयता नियम लागू हुन्छ।"}</p><h2>{locale === "en" ? "Analytics" : "एनालिटिक्स"}</h2><p>{locale === "en" ? "Analytics and advertising pixels are disabled unless valid environment IDs are configured." : "मान्य वातावरण ID कन्फिगर नभएसम्म एनालिटिक्स र विज्ञापन पिक्सेल निष्क्रिय छन्।"}</p><h2>{locale === "en" ? "Contact" : "सम्पर्क"}</h2><p>{locale === "en" ? `Questions can be sent by WhatsApp or phone to ${brand.phoneDisplay}.` : `प्रश्न WhatsApp वा फोनबाट ${brand.phoneDisplay} मा पठाउन सकिन्छ।`}</p></div></section></>;
}
