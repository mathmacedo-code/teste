import type { Metadata } from "next";
import { site } from "@/data/site";

export function pageMetadata({
  title, description, path, noindex, absoluteTitle,
}: { title: string; description: string; path: string; noindex?: boolean; absoluteTitle?: boolean }): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      locale: "pt_BR",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
