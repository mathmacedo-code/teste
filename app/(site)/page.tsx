import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { vilaMediSchema } from "@/lib/schema";
import { Bar } from "@/sections/home/Bar";
import { BrandIntro } from "@/sections/home/BrandIntro";
import { Cinematic } from "@/sections/home/Cinematic";
import { Events } from "@/sections/home/Events";
import { Experiences } from "@/sections/home/Experiences";
import { Gastronomy } from "@/sections/home/Gastronomy";
import { Hero } from "@/sections/home/Hero";
import { Location } from "@/sections/home/Location";
import { Moments } from "@/sections/home/Moments";
import { Testimonials } from "@/sections/home/Testimonials";
import { VilaExperience } from "@/sections/home/VilaExperience";

export const metadata = pageMetadata({
  title: "Vila Medí | Restaurante mediterrâneo no Shopping Cidade Jardim",
  description: site.description,
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <>
      <JsonLd data={vilaMediSchema()} />
      <Hero />
      <BrandIntro />
      <Experiences />
      <VilaExperience />
      <Gastronomy />
      <Moments />
      <Cinematic />
      <Bar />
      <Events />
      <Testimonials />
      <Location />
    </>
  );
}
