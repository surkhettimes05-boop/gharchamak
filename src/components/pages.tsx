import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, Home, MapPin, MessageCircle, PackageCheck, Phone, Sparkles, Store, Truck, WalletCards } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { brand, products, type Locale, type ProductSlug, type ProductStatus, whatsappMessages, whatsappUrl } from "@/src/config/brand";
import { copy, faqItems } from "@/src/content/site";
import type { CmsPublicContent, ProductOverride } from "@/src/cms/types";

const path = (locale: Locale, slug = "") => `/${locale}${slug ? `/${slug}` : ""}`;

export function SectionHeading({ eyebrow, title, copyText, center = false }: { eyebrow?: string; title: string; copyText?: string; center?: boolean }) {
  return <div className={`section-heading ${center ? "center" : ""}`}>{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}<h2>{title}</h2>{copyText ? <p>{copyText}</p> : null}</div>;
}

const defaultProductImages: Record<ProductSlug, string> = {
  "dishwash-liquid": "/products/dishwash/dishwash.svg",
  "floor-cleaner": "/products/floor-cleaner/floor-cleaner.svg",
  "toilet-cleaner": "/products/toilet-cleaner/toilet-cleaner.svg",
};

function productOverride(cms: CmsPublicContent | undefined, slug: ProductSlug): ProductOverride | undefined {
  return cms?.productOverrides.find(item => item.productSlug === slug);
}

export function ProductVisual({ product, large = false, imageUrl }: { product: (typeof products)[number]; large?: boolean; imageUrl?: string | null }) {
  return <div className={`product-visual product-${product.color} ${large ? "product-visual-large" : ""}`}>
    <img className="product-render" src={imageUrl || defaultProductImages[product.slug]} alt={`${product.name.en} product image`} />
    <span className="visual-glow" />
  </div>;
}

export function ProductCard({ product, locale, cms }: { product: (typeof products)[number]; locale: Locale; cms?: CmsPublicContent }) {
  const c = copy[locale];
  const override = productOverride(cms, product.slug);
  const status: ProductStatus = override?.status ?? product.status;
  const available = status === "available";
  return <article className={`product-card card-${product.color}`}>
    <div className="product-card-visual"><ProductVisual product={product} imageUrl={override?.imageUrl} /></div>
    <div className="product-card-body">
      <div className="product-meta"><span className="status-dot" />{available ? (locale === "en" ? "Available" : "उपलब्ध") : c.common.coming}</div>
      <p className="product-variant">{product.variant[locale]}</p>
      <h3><span lang="ne">{product.name.ne}</span><small className="product-name-en">{product.name.en}</small></h3>
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

export function HomePage({ locale, cms }: { locale: Locale; cms?: CmsPublicContent }) {
  const c = copy[locale];
  const productDetails = products.map(product => {
    const override = productOverride(cms, product.slug);
    return {
      product,
      status: (override?.status ?? product.status) as ProductStatus,
      packSize: override?.packSize?.trim() || "",
      mrp: override?.mrp?.trim() || "",
      imageUrl: override?.imageUrl,
    };
  });
  const availableProducts = productDetails.filter(item => item.status === "available");
  const confirmedCommercial = productDetails.filter(item => item.packSize || item.mrp);
  const commercialSummary = confirmedCommercial.length
    ? confirmedCommercial.map(item => `${item.product.name.ne}: ${item.packSize || (locale === "ne" ? "साइज पुष्टि हुन बाँकी" : "size pending")}${item.mrp ? ` · रु ${item.mrp}` : ""}`).join(" • ")
    : (locale === "ne"
      ? "अन्तिम प्याक साइज र MRP व्यावसायिक रूपमा पुष्टि भएपछि मात्र यहाँ देखाइनेछ।"
      : "Final pack sizes and MRP will appear here only after commercial confirmation.");
  const availabilitySummary = availableProducts.length
    ? (locale === "ne"
      ? `${availableProducts.length} उत्पादन उपलब्ध देखाइएको छ। नजिकको स्टकिस्ट WhatsApp मा सोध्नुहोस्।`
      : `${availableProducts.length} product${availableProducts.length === 1 ? "" : "s"} marked available. Ask on WhatsApp for the nearest stockist.`)
    : (locale === "ne"
      ? "खुद्रा बिक्री अझै पुष्टि भएको छैन। पहिलो उपलब्धता र नजिकको पसलबारे WhatsApp मा सोध्नुहोस्।"
      : "Retail sale is not yet confirmed. Ask on WhatsApp for first availability and the nearest stockist.");

  return <>
    <section className="gc-home-hero">
      <div className="container gc-home-hero-grid">
        <div className="gc-home-hero-copy">
          <div className="gc-status-pill"><span className="status-dot" />{locale === "ne" ? "उत्पादन र प्याकेजिङ परीक्षणमा" : "Product & packaging validation in progress"}</div>
          <p className="gc-kicker" lang="ne">नेपाली घरको दैनिक सफाइका लागि • Everyday cleaning for Nepali homes</p>
          <h1>
            <span lang="ne">बलियो सफाइ। सही दाम।</span>
            <small>Strong Clean. Fair Price.</small>
          </h1>
          <p className="gc-home-lead" lang="ne">घरचमक भाँडा, भुइँ र ट्वाइलेट सफाइका लागि केन्द्रित नेपाली होम-केयर ब्रान्ड हो—दैनिक प्रयोगमा चाहिने सफाइ, स्पष्ट उत्पादन जानकारी र उचित मूल्यलाई प्राथमिकता दिने।</p>
          <p className="gc-home-lead-en">GharChamak is a Nepal-focused home-care brand for dish, floor and toilet cleaning—built around useful everyday performance, clear product information and fair value.</p>
          <div className="gc-primary-actions">
            <a className="btn btn-dark btn-lg" href={whatsappUrl(whatsappMessages.buy)} target="_blank" rel="noreferrer"><MessageCircle size={19}/>{locale === "ne" ? "कहाँ किन्न पाइन्छ?" : "Where to buy"}</a>
            <a className="btn btn-outline-strong btn-lg" href={whatsappUrl(whatsappMessages.retailer)} target="_blank" rel="noreferrer"><Store size={19}/>{locale === "ne" ? "घरचमक स्टक गर्नुहोस्" : "Stock this brand"}</a>
          </div>
          <p className="gc-action-note">{availabilitySummary}</p>
        </div>

        <div className="gc-home-product-stage" aria-label={locale === "ne" ? "घरचमक उत्पादन प्याक अवधारणा" : "GharChamak product pack concepts"}>
          <div className="gc-pack-label">{locale === "ne" ? "हालको प्याक अवधारणा • अन्तिम उत्पादन फोटो होइन" : "Current pack concepts • not final production photos"}</div>
          <img className="gc-pack gc-pack-dish" src="/products/dishwash/dishwash.svg" alt="GharChamak Dishwash Liquid front pack concept"/>
          <img className="gc-pack gc-pack-floor" src="/products/floor-cleaner/floor-cleaner.svg" alt="GharChamak Floor Cleaner front pack concept"/>
          <img className="gc-pack gc-pack-toilet" src="/products/toilet-cleaner/toilet-cleaner.svg" alt="GharChamak Toilet Cleaner front pack concept"/>
        </div>
      </div>

      <div className="container gc-five-answers">
        <article><span>01</span><div><strong lang="ne">के हो?</strong><small>What is it?</small><p>{locale === "ne" ? "भाँडा धुने झोल, फ्लोर क्लिनर र ट्वाइलेट क्लिनरको केन्द्रित घर-सफाइ दायरा।" : "A focused home-cleaning range: dishwash liquid, floor cleaner and toilet cleaner."}</p></div></article>
        <article><span>02</span><div><strong lang="ne">कसका लागि?</strong><small>Who is it for?</small><p>{locale === "ne" ? "दैनिक सफाइमा भरपर्दो काम र उचित मूल्य खोज्ने नेपाली घरपरिवारका लागि।" : "For Nepali households that want dependable everyday cleaning without paying for unnecessary premium positioning."}</p></div></article>
        <article><span>03</span><div><strong lang="ne">किन घरचमक?</strong><small>Why trust / choose it?</small><p>{locale === "ne" ? "बलियो दैनिक सफाइ + सही दाम। पुष्टि नभएको मूल्य, साइज वा उपलब्धतालाई हामी पुष्टि भएको जस्तो देखाउँदैनौं।" : "Strong everyday cleaning + fair value. Unconfirmed price, pack size or availability is never presented as fact."}</p></div></article>
        <article><span>04</span><div><strong lang="ne">साइज र मूल्य?</strong><small>Sizes & prices</small><p>{commercialSummary}</p></div></article>
        <article><span>05</span><div><strong lang="ne">कहाँ किन्न?</strong><small>Where / how to order</small><p>{availabilitySummary}</p></div></article>
      </div>
    </section>

    <section className="section gc-paths-section">
      <div className="container">
        <SectionHeading eyebrow={locale === "ne" ? "दुई स्पष्ट बाटो" : "Two clear paths"} title={locale === "ne" ? "किन्ने ग्राहक र स्टक गर्ने व्यवसाय—दुवैका लागि सीधा सम्पर्क।" : "A direct path for buyers and a separate path for retailers."} />
        <div className="gc-path-grid">
          <article className="gc-path-card gc-consumer-path">
            <span className="icon-box"><Home size={24}/></span>
            <p className="eyebrow">{locale === "ne" ? "घरायसी ग्राहक" : "Consumers"}</p>
            <h3 lang="ne">कहाँ किन्न पाइन्छ?</h3>
            <p>{locale === "ne" ? "नजिकको उपलब्ध पसल, हालको अर्डर विकल्प वा पहिलो स्टकबारे WhatsApp मा सोध्नुहोस्।" : "Ask for the nearest available shop, current order option or first-stock update."}</p>
            <a className="btn btn-dark" href={whatsappUrl(whatsappMessages.buy)} target="_blank" rel="noreferrer"><MessageCircle size={18}/>{locale === "ne" ? "WhatsApp मा किन्न सोध्नुहोस्" : "Ask to buy on WhatsApp"}</a>
          </article>
          <article className="gc-path-card gc-trade-path">
            <span className="icon-box"><Store size={24}/></span>
            <p className="eyebrow">{locale === "ne" ? "खुद्रा / वितरक" : "Retailer / Distributor"}</p>
            <h3 lang="ne">घरचमक स्टक गर्न चाहनुहुन्छ?</h3>
            <p>{locale === "ne" ? "पसल, होलसेल वा वितरणका लागि छुट्टै trade enquiry पठाउनुहोस्।" : "Send a separate trade enquiry for retail, wholesale or distribution."}</p>
            <a className="btn btn-dark" href={whatsappUrl(whatsappMessages.retailer)} target="_blank" rel="noreferrer"><Truck size={18}/>{locale === "ne" ? "स्टक / डिस्ट्रीब्युसन सोधपुछ" : "Stock / distribution enquiry"}</a>
          </article>
        </div>
      </div>
    </section>

    <section className="section gc-proof-section">
      <div className="container">
        <SectionHeading eyebrow={locale === "ne" ? "दाबीभन्दा पहिले प्रमाण" : "Proof before promises"} title={locale === "ne" ? "अहिले के वास्तविक छ—र के अझै पुष्टि हुन बाँकी छ।" : "What is real today—and what is still waiting for confirmation."} copyText={locale === "ne" ? "वेबसाइटले विकास अवधारणा र व्यावसायिक रूपमा पुष्टि भएको तथ्यलाई छुट्टै देखाउँछ।" : "The site separates development concepts from commercially confirmed facts."} />
        <div className="gc-proof-grid">
          <article>
            <BadgeCheck size={24}/>
            <h3>{locale === "ne" ? "उत्पादन स्थिति स्पष्ट" : "Clear product status"}</h3>
            <p>{locale === "ne" ? "तीनै सुरुवाती उत्पादन हाल उत्पादन/प्याकेजिङ validation चरणमा छन्; उपलब्ध नभएको उत्पादनलाई ‘Available’ भनेर देखाइँदैन।" : "The launch range is currently in product/packaging validation; a product is not shown as Available until its status is changed in the CMS."}</p>
          </article>
          <article>
            <PackageCheck size={24}/>
            <h3>{locale === "ne" ? "प्याक र MRP अनुमान होइन" : "No invented pack or MRP"}</h3>
            <p>{locale === "ne" ? "प्याक साइज र MRP CMS मा पुष्टि भएपछि मात्र सार्वजनिक हुन्छ।" : "Pack size and MRP are published from the CMS only after you enter confirmed commercial details."}</p>
          </article>
          <article>
            <MapPin size={24}/>
            <h3>{locale === "ne" ? "सुरुवाती बजार स्पष्ट" : "Launch market is explicit"}</h3>
            <p>{locale === "ne" ? "प्रारम्भिक फोकस वीरेन्द्रनगर, सुर्खेत हो; वास्तविक खुद्रा साझेदार प्रकाशित भएपछि मात्र ‘कहाँ किन्न’ सूचीमा देखाइनेछ।" : "The initial focus is Birendranagar, Surkhet; real retail partners are shown only when published through the CMS."}</p>
          </article>
        </div>
      </div>
    </section>

    <section className="section gc-pack-proof-section">
      <div className="container">
        <SectionHeading eyebrow={locale === "ne" ? "प्याक प्रमाण" : "Pack proof"} title={locale === "ne" ? "Front concept अहिले। वास्तविक front + back उत्पादन फोटो launch अघि।" : "Front concept now. Real front + back production photos before launch."} />
        <div className="gc-pack-proof-grid">
          {productDetails.map(({ product, imageUrl }) => <article className="gc-pack-proof-card" key={product.slug}>
            <div className="gc-pack-proof-side">
              <span className="gc-side-tag">{locale === "ne" ? "अगाडिको प्याक" : "Front pack"}</span>
              <ProductVisual product={product} imageUrl={imageUrl}/>
              <small>{imageUrl ? (locale === "ne" ? "CMS मा अपलोड गरिएको फोटो" : "Uploaded CMS image") : (locale === "ne" ? "हालको concept artwork" : "Current concept artwork")}</small>
            </div>
            <div className="gc-pack-proof-side gc-back-placeholder">
              <span className="gc-side-tag">{locale === "ne" ? "पछाडिको प्याक" : "Back pack"}</span>
              <PackageCheck size={34}/>
              <strong>{locale === "ne" ? "वास्तविक उत्पादन फोटो आवश्यक" : "Real production photo required"}</strong>
              <p>{locale === "ne" ? "अन्तिम लेबल, प्रयोग निर्देशन, सुरक्षा, net quantity, MRP र batch details देखिने वास्तविक फोटो यहाँ राखिनेछ।" : "This slot is reserved for the real production photo showing final label, directions, safety, net quantity, MRP and batch details."}</p>
            </div>
            <h3><span lang="ne">{product.name.ne}</span><small>{product.name.en}</small></h3>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section gc-standard-section">
      <div className="container gc-standard-grid">
        <div>
          <p className="eyebrow">{locale === "ne" ? "हाम्रो release standard" : "Our release standard"}</p>
          <h2>{locale === "ne" ? "‘Available’ लेख्नुअघि पाँच कुरा पूरा हुनुपर्छ।" : "Five gates before a product is called Available."}</h2>
          <p>{locale === "ne" ? "यो manufacturing claim होइन—घरचमकको commercial release checklist हो।" : "This is not a manufacturing claim; it is GharChamak’s commercial release checklist."}</p>
        </div>
        <div className="gc-standard-list">
          {[
            locale === "ne" ? "उत्पादन नमुना र intended cleaning job स्पष्ट" : "Product sample and intended cleaning job are clear",
            locale === "ne" ? "प्रयोग निर्देशन र सुरक्षा भाषा अन्तिम" : "Directions and safety language are final",
            locale === "ne" ? "प्याक साइज, net quantity र MRP पुष्टि" : "Pack size, net quantity and MRP are confirmed",
            locale === "ne" ? "अन्तिम front/back उत्पादन प्याक फोटो उपलब्ध" : "Final front/back production pack photos are available",
            locale === "ne" ? "खुद्रा उपलब्धता वा अर्डर बाटो वास्तविक रूपमा तयार" : "A real retail or order path is ready",
          ].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><Check size={18}/><p>{item}</p></div>)}
        </div>
      </div>
    </section>

    <section className="section products-section">
      <div className="container">
        <div className="section-topline">
          <SectionHeading eyebrow={locale === "ne" ? "सुरुवाती उत्पादन" : "Launch range"} title={locale === "ne" ? "तीन काम। तीन स्पष्ट उत्पादन।" : "Three jobs. Three focused products."} copyText={locale === "ne" ? "हरेक उत्पादनको नाम र काम नेपाली र English दुवैमा स्पष्ट देखिन्छ।" : "Each product is presented clearly in both Nepali and English."} />
          <Link className="text-link section-link" href={path(locale, "products")}>{locale === "ne" ? "सबै उत्पादन हेर्नुहोस्" : "See all products"}<ArrowRight size={16}/></Link>
        </div>
        <div className="product-grid">{products.map(p => <ProductCard key={p.slug} product={p} locale={locale} cms={cms} />)}</div>
      </div>
    </section>

    {cms?.partners.length ? <section className="section gc-stockists-section"><div className="container">
      <SectionHeading eyebrow={locale === "ne" ? "प्रकाशित साझेदार" : "Published partners"} title={locale === "ne" ? "वास्तविक retailer / distributor मात्र।" : "Only real published retailers / distributors."} />
      <div className="gc-partner-grid">{cms.partners.map(partner => <article key={partner.id}><Store size={20}/><div><strong>{partner.name}</strong><p>{partner.location || partner.partnerType}</p></div></article>)}</div>
    </div></section> : null}

    <RetailerBanner locale={locale} />

    {cms?.reviews.length ? <section className="section cms-public-section cms-review-section"><div className="container">
      <SectionHeading eyebrow={locale === "ne" ? "ग्राहक अनुभव" : "Customer voices"} title={locale === "ne" ? "प्रकाशित वास्तविक प्रतिक्रिया।" : "Published customer feedback."} />
      <div className="cms-review-grid">{cms.reviews.map(review => <article className="cms-review-card" key={review.id}>
        {review.mediaUrl ? <img src={review.mediaUrl} alt="" /> : null}
        <blockquote>“{locale === "ne" && review.quoteNe ? review.quoteNe : review.quote}”</blockquote>
        <strong>{review.customerName}</strong>
      </article>)}</div>
    </div></section> : null}

    <section className="section faq-section"><div className="container faq-grid"><SectionHeading eyebrow="FAQ" title={locale === "ne" ? "किन्नुअघि जान्नुपर्ने मुख्य कुरा।" : "What you should know before buying."} copyText={locale === "ne" ? "उत्पादन, मूल्य, उपलब्धता र स्टकिङबारे स्पष्ट उत्तर।" : "Clear answers on products, price, availability and stocking."} /><div><FaqList locale={locale} limit={5} /><Link className="text-link faq-more" href={path(locale, "faq")}>{locale === "ne" ? "सबै प्रश्न हेर्नुहोस्" : "View all questions"}<ArrowRight size={17}/></Link></div></div></section>

    <div className="gc-mobile-actions" aria-label={locale === "ne" ? "छिटो कार्य" : "Quick actions"}>
      <a href={whatsappUrl(whatsappMessages.buy)} target="_blank" rel="noreferrer"><MessageCircle size={18}/><span>{locale === "ne" ? "किन्ने" : "Buy"}</span></a>
      <a href={whatsappUrl(whatsappMessages.retailer)} target="_blank" rel="noreferrer"><Store size={18}/><span>{locale === "ne" ? "स्टक गर्ने" : "Stock"}</span></a>
    </div>
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

export function ProductsPage({ locale, cms }: { locale: Locale; cms?: CmsPublicContent }) {
  const c = copy[locale];
  return <><PageIntro eyebrow={c.nav.products} title={locale === "en" ? "A focused range for everyday cleaning." : "दैनिक सफाइका लागि केन्द्रित उत्पादन दायरा।"} copyText={locale === "en" ? "Three household cleaning products are being prepared as the first GharChamak range." : "घरचमकको पहिलो दायराका रूपमा तीन घर सफाइ उत्पादन तयार हुँदैछन्।"} /><section className="section"><div className="container product-grid">{products.map(p => <ProductCard key={p.slug} product={p} locale={locale} cms={cms} />)}</div></section><section className="small-note"><div className="container"><PackageCheck size={24}/><div><h2>{locale === "en" ? "Launch information, kept honest." : "बजार जानकारी, स्पष्ट रूपमा।"}</h2><p>{locale === "en" ? "Prices, pack sizes, ingredients and retail availability will only be published after confirmation." : "मूल्य, प्याक साइज, सामग्री र खुद्रा उपलब्धता पुष्टि भएपछि मात्र प्रकाशित गरिनेछ।"}</p></div></div></section><ContactBanner locale={locale}/></>;
}

export function ProductPage({ locale, slug, cms }: { locale: Locale; slug: ProductSlug; cms?: CmsPublicContent }) {
  const c = copy[locale]; const product = products.find(p => p.slug === slug)!; const related = products.filter(p => p.slug !== slug); const override = productOverride(cms, slug); const status: ProductStatus = override?.status ?? product.status; const available = status === "available";
  const message = `Namaste, I would like more information about ${product.name.en}.`;
  return <><section className="product-hero"><div className="container"><nav className="breadcrumbs"><Link href={path(locale)}>{c.common.home}</Link><span>/</span><Link href={path(locale, "products")}>{c.nav.products}</Link><span>/</span><span>{product.name[locale]}</span></nav><div className="product-detail-grid"><ProductVisual product={product} large imageUrl={override?.imageUrl}/><div><div className="product-meta"><span className="status-dot"/>{available ? (locale === "en" ? "Available" : "उपलब्ध") : c.common.coming}</div><p className="product-variant">{product.variant[locale]}</p><h1>{product.name[locale]}</h1><p className="product-lead">{product.short[locale]}</p><a className="btn btn-dark btn-lg" href={whatsappUrl(message)} target="_blank" rel="noreferrer"><MessageCircle size={18}/>{c.common.productEnquiry}</a></div></div></div></section><section className="section"><div className="container detail-grid"><article><h2>{c.common.characteristics}</h2><ul className="check-list">{product.characteristics[locale].map(item => <li key={item}><Check size={18}/>{item}</li>)}</ul></article><article><h2>{c.common.use}</h2><p>{product.use[locale]}</p></article><article><h2>{c.common.packSizes}</h2><p>{override?.packSize || c.common.packPending}</p></article>{override?.mrp ? <article><h2>{locale === "en" ? "MRP" : "एमआरपी"}</h2><p>NPR {override.mrp}</p></article> : null}<article><h2>{c.common.safety}</h2><p>{c.common.safetyCopy}</p></article></div></section><section className="section related-section"><div className="container"><SectionHeading title={c.common.related}/><div className="product-grid related-grid">{related.map(p => <ProductCard key={p.slug} product={p} locale={locale} cms={cms}/>)}</div></div></section></>;
}

export function WhyPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return <><PageIntro eyebrow={c.nav.why} title={locale === "en" ? "Dependable cleaning. Sensible value." : "भरपर्दो सफाइ। उचित मूल्य।"} copyText={locale === "en" ? "GharChamak is built for the practical middle: trustworthy everyday performance without unnecessary premium pricing." : "घरचमक व्यावहारिक बीचको विकल्पका रूपमा बन्दैछ: अनावश्यक महँगो मूल्यबिना भरपर्दो दैनिक सफाइ।"}/><section className="section"><div className="container benefit-grid">{benefits[locale].map(([Icon,title,text]) => <article className="benefit-card elevated" key={title}><span className="icon-box"><Icon size={22}/></span><h2>{title}</h2><p>{text}</p></article>)}</div></section><ContactBanner locale={locale}/></>;
}

export function RetailersPage({ locale, cms }: { locale: Locale; cms?: CmsPublicContent }) {
  const c = copy[locale];
  return <><PageIntro eyebrow={c.nav.retailers} title={locale === "en" ? "A practical brand for practical shelves." : "व्यावहारिक पसलका लागि व्यावहारिक ब्रान्ड।"} copyText={locale === "en" ? "Retailers, wholesalers and distribution partners can register interest in GharChamak’s planned product range." : "खुद्रा विक्रेता, थोक विक्रेता र वितरण साझेदारले घरचमकको योजनाबद्ध उत्पादन दायरामा रुचि दर्ता गर्न सक्छन्।"}/><section className="section"><div className="container trade-grid"><article><Store size={28}/><h2>{locale === "en" ? "Retailers" : "खुद्रा विक्रेता"}</h2><p>{locale === "en" ? "Tell us about your store and the customers you serve. We’ll share confirmed stocking information when ready." : "आफ्नो पसल र ग्राहकबारे बताउनुहोस्। पुष्टि भएको स्टक जानकारी तयार भएपछि साझा गर्नेछौं।"}</p><a className="text-link" href={whatsappUrl(whatsappMessages.retailer)} target="_blank" rel="noreferrer">{c.common.enquiry}<ArrowRight size={17}/></a></article><article><Truck size={28}/><h2>{locale === "en" ? "Distributors & wholesalers" : "वितरक र थोक विक्रेता"}</h2><p>{locale === "en" ? "Share your coverage area and distribution interest directly with the GharChamak team." : "आफ्नो वितरण क्षेत्र र सहकार्यको रुचि घरचमक टोलीसँग सिधै साझा गर्नुहोस्।"}</p><a className="text-link" href={whatsappUrl(whatsappMessages.distributor)} target="_blank" rel="noreferrer">{locale === "en" ? "Distributor enquiry" : "वितरण सोधपुछ"}<ArrowRight size={17}/></a></article></div></section>{cms?.partners.length ? <section className="section cms-public-section"><div className="container"><SectionHeading eyebrow={locale === "en" ? "Network" : "सञ्जाल"} title={locale === "en" ? "Retail and distribution partners." : "खुद्रा तथा वितरण साझेदार।"} /><div className="cms-partner-grid">{cms.partners.map(partner => <article className="cms-partner-card" key={partner.id}>{partner.imageUrl ? <img src={partner.imageUrl} alt={partner.name} /> : null}<div><span className="cms-badge">{partner.partnerType}</span><h3>{partner.name}</h3>{partner.location ? <p>{partner.location}</p> : null}</div></article>)}</div></div></section> : null}<RetailerBanner locale={locale}/></>;
}

export function AboutPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return <><PageIntro eyebrow={c.nav.about} title={locale === "en" ? "A home-care brand built for Nepal." : "नेपालका लागि बनेको होम-केयर ब्रान्ड।"} copyText={c.home.storyCopy}/><section className="section"><div className="container about-grid"><article><p className="eyebrow">{locale === "en" ? "Our mission" : "हाम्रो उद्देश्य"}</p><h2>{locale === "en" ? "Make dependable everyday cleaning accessible to more Nepali households." : "भरपर्दो दैनिक सफाइ धेरै नेपाली घरको पहुँचमा पुर्‍याउनु।"}</h2></article><article><h2>{locale === "en" ? "Why GharChamak exists" : "घरचमक किन बनिरहेको छ"}</h2><p>{locale === "en" ? "Families should not have to choose between questionable quality and unnecessary premium pricing. Clear products, consistent quality and sensible prices can earn trust over time." : "परिवारले शंकास्पद गुणस्तर र अनावश्यक महँगो मूल्यबीच छनोट गर्न नपरोस्। स्पष्ट उत्पादन, एकरूप गुणस्तर र उचित मूल्यले समयसँगै विश्वास जित्न सक्छ।"}</p><blockquote><strong>{brand.tagline}</strong><span lang="ne">{brand.taglineNe}</span></blockquote></article></div></section><ContactBanner locale={locale}/></>;
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
