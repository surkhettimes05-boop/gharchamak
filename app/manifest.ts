import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest { return { name:"GharChamak by Pasalho",short_name:"GharChamak",description:"Strong Clean. Fair Price.",start_url:"/en",display:"standalone",background_color:"#ffffff",theme_color:"#0047BA",icons:[{src:"/brand/icon.svg",sizes:"any",type:"image/svg+xml"}] }; }
