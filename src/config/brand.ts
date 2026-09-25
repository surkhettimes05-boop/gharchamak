export type Locale = "en" | "ne";
export type ProductStatus = "coming-soon" | "available";
export type ProductSlug = "dishwash-liquid" | "floor-cleaner" | "toilet-cleaner";

export const brand = {
  name: "GharChamak",
  parentBrand: "Pasalho",
  tagline: "Strong Clean. Fair Price.",
  taglineNe: "बलियो सफाइ, सही दाम।",
  description: "GharChamak is a Nepal-focused household cleaning brand by Pasalho, built around dependable everyday cleaning and fair prices.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://gharchamak-pasalho.surkhettimes05.chatgpt.site",
  phoneDisplay: "+977 9822403262",
  phone: "+9779822403262",
  whatsappNumber: "9779822403262",
  email: "",
  location: "Birendranagar, Surkhet, Nepal",
  launchNote: "Launching initially from Birendranagar, Surkhet.",
  social: { facebook: "", instagram: "", tiktok: "", youtube: "", x: "" },
  ogImage: "",
} as const;

export const products = [
  { slug: "dishwash-liquid", status: "coming-soon", name: { en: "GharChamak Dishwash Liquid", ne: "घरचमक भाँडा धुने झोल" }, variant: { en: "Lemon Fresh", ne: "लेमन फ्रेश" }, short: { en: "Everyday dish cleaning designed to tackle grease while remaining easy to use and easy to rinse.", ne: "दैनिक भाँडा सफा गर्न, चिल्लो हटाउन र सजिलै पखाल्न मिल्ने गरी तयार हुँदैछ।" }, color: "yellow", characteristics: { en: ["Designed for everyday dish cleaning", "Easy-to-use liquid format", "Fresh lemon direction"], ne: ["दैनिक भाँडा सफाइका लागि", "प्रयोग गर्न सजिलो झोल", "ताजा कागती सुगन्धको दिशा"] }, use: { en: "Use only according to the directions printed on the final product label. Approved usage directions will be added before launch.", ne: "अन्तिम उत्पादनको लेबलमा दिइएको निर्देशनअनुसार मात्र प्रयोग गर्नुहोस्। स्वीकृत प्रयोग विधि बजारमा आउनुअघि थपिनेछ।" } },
  { slug: "floor-cleaner", status: "coming-soon", name: { en: "GharChamak Floor Cleaner", ne: "घरचमक फ्लोर क्लिनर" }, variant: { en: "Fresh Home", ne: "फ्रेस होम" }, short: { en: "Everyday floor cleaning designed for a fresh, clean home.", ne: "घरलाई ताजा र सफा राख्ने दैनिक भुइँ सफाइका लागि तयार हुँदैछ।" }, color: "teal", characteristics: { en: ["Designed for routine floor cleaning", "Straightforward everyday use", "Fresh-home fragrance direction"], ne: ["नियमित भुइँ सफाइका लागि", "दैनिक प्रयोगमा सरल", "ताजा घरको सुगन्ध दिशा"] }, use: { en: "Use only according to the directions printed on the final product label. Surface guidance and dilution instructions will be confirmed before launch.", ne: "अन्तिम उत्पादनको लेबलमा दिइएको निर्देशनअनुसार मात्र प्रयोग गर्नुहोस्। सतह र घोलको निर्देशन बजारमा आउनुअघि पुष्टि गरिनेछ।" } },
  { slug: "toilet-cleaner", status: "coming-soon", name: { en: "GharChamak Toilet Cleaner", ne: "घरचमक ट्वाइलेट क्लिनर" }, variant: { en: "Power Clean", ne: "पावर क्लिन" }, short: { en: "Purpose-built toilet cleaning for routine household use.", ne: "घरको नियमित ट्वाइलेट सफाइका लागि उद्देश्यअनुसार तयार हुँदैछ।" }, color: "red", characteristics: { en: ["Purpose-built for toilet cleaning", "Designed for routine household use", "Focused, easy-to-understand format"], ne: ["ट्वाइलेट सफाइका लागि विशेष", "घरको नियमित प्रयोगका लागि", "सरल र स्पष्ट प्रयोग ढाँचा"] }, use: { en: "Use only according to the directions and safety information printed on the final product label. Full instructions will be added before launch.", ne: "अन्तिम उत्पादनको लेबलमा दिइएको प्रयोग तथा सुरक्षा निर्देशनअनुसार मात्र प्रयोग गर्नुहोस्। पूर्ण निर्देशन बजारमा आउनुअघि थपिनेछ।" } },
] as const satisfies readonly { slug: ProductSlug; status: ProductStatus; name: Record<Locale, string>; variant: Record<Locale, string>; short: Record<Locale, string>; color: string; characteristics: Record<Locale, readonly string[]>; use: Record<Locale, string> }[];

export function whatsappUrl(message: string) { return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`; }
export const whatsappMessages = {
  general: "Namaste, I would like to know more about GharChamak.",
  retailer: "Namaste, I am interested in stocking GharChamak products. Please share retailer details.",
  distributor: "Namaste, I am interested in GharChamak distribution opportunities. Please share details.",
};
