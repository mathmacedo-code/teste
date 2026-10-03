import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ["", "/temperani-amalfi", "/miimar", "/cru-oyster-bar", "/gastronomia", "/eventos", "/reservas"].map((p, i) => ({
    url: `${site.url}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: i === 0 ? 1 : 0.8,
  }));
}
