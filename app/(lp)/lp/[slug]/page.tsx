import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { landingBySlug, landings } from "@/data/landing-pages";
import { pageMetadata } from "@/lib/seo";
import { LandingPage } from "@/sections/lp/LandingPage";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return landings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const l = landingBySlug((await params).slug);
  if (!l) return {};
  return pageMetadata({ title: l.meta.title, description: l.meta.description, path: `/lp/${l.slug}`, noindex: true, absoluteTitle: true });
}

export default async function Page({ params }: Params) {
  const l = landingBySlug((await params).slug);
  if (!l) notFound();
  return <LandingPage l={l} />;
}
