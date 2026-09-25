import type { MetadataRoute } from "next";
import { brand } from "@/src/config/brand";
export default function robots(): MetadataRoute.Robots { return { rules:{userAgent:"*",allow:"/"},sitemap:`${brand.siteUrl}/sitemap.xml`,host:brand.siteUrl }; }
