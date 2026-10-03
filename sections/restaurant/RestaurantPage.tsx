import { JsonLd } from "@/components/seo/JsonLd";
import { OpenMenuButton } from "@/components/overlays/Overlays";
import { StickyReserve } from "@/components/layout/StickyReserve";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { Cta } from "@/components/ui/Cta";
import { Photo } from "@/components/ui/Photo";
import { Reveal, RevealMedia } from "@/components/ui/Motion";
import { dishes } from "@/data/dishes";
import { video } from "@/data/media";
import type { Restaurant, Theme } from "@/data/restaurants";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { restaurantSchema } from "@/lib/schema";
import { DishRow } from "@/sections/shared/DishRow";

/** Cada casa mantém a linguagem Vila Medí com temperatura própria. */
const THEMES: Record<Theme, { page: string; alt: string; rule: string; cta: "solid" | "light" }> = {
  cal: { page: "bg-cal text-grafite", alt: "bg-areia", rule: "border-grafite/15", cta: "solid" },
  branco: { page: "bg-cal-claro text-grafite", alt: "bg-[#e3e8ee]", rule: "border-azul/15", cta: "solid" },
  noite: { page: "bg-noite text-perola", alt: "bg-[#211a13]", rule: "border-perola/15", cta: "light" },
};

export function RestaurantPage({ r }: { r: Restaurant }) {
  const t = THEMES[r.theme];
  const reserveHref = `/reservas?casa=${encodeURIComponent(r.name)}`;

  return (
    <div className={t.page}>
      <JsonLd data={restaurantSchema(r)} />

      {/* Hero */}
      <section className="relative h-[100svh] min-h-[620px] overflow-hidden bg-noite text-perola">
        {r.hero.video ? (
          <AmbientVideo source={video[r.hero.video]} priority label={`Ambiente do ${r.name}`} />
        ) : (
          <Photo k={r.hero.image} alt="" sizes="100vw" priority />
        )}
        <div aria-hidden className="scrim-bottom absolute inset-0" />
        <div className="shell relative flex h-full flex-col justify-end pb-[max(3.25rem,7vh)]">
          <Reveal>
            <p className="meta opacity-80">{r.name}, no Vila Medí</p>
            <h1 className="display-xl mt-5 max-w-[14ch]">{r.hero.headline}</h1>
          </Reveal>
          <Reveal delay={0.2} className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="lede max-w-[40ch] opacity-90">{r.hero.sub}</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
              <Cta href={reserveHref} variant="light" event="reserve_click" location={`${r.slug}_hero`}>{r.cta}</Cta>
              <OpenMenuButton house={r.slug}>Ver cardápio</OpenMenuButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Conceito */}
      <section className="py-28 md:py-44">
        <div className="shell grid items-center gap-x-6 gap-y-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <h2 className="display-l">{r.concept.title}</h2>
            {r.concept.text.map((p) => (
              <p key={p} className="lede mt-7 max-w-[40ch] opacity-85">{p}</p>
            ))}
          </Reveal>
          <RevealMedia className="aspect-[4/5] md:col-span-6 md:col-start-7">
            <Photo k={r.concept.image} alt={r.concept.imageAlt} sizes="(min-width: 768px) 46vw, 92vw" />
          </RevealMedia>
        </div>
      </section>

      {/* Cozinha / chef */}
      {r.kitchen && (
        <section className={cn("py-28 md:py-40", t.alt)}>
          <div className="shell grid items-end gap-x-6 gap-y-12 md:grid-cols-12">
            <RevealMedia className="aspect-[4/5] md:col-span-5">
              <Photo k={r.kitchen.image} alt={r.kitchen.imageAlt} sizes="(min-width: 768px) 40vw, 92vw" />
            </RevealMedia>
            <Reveal className="md:col-span-5 md:col-start-7 md:pb-10">
              <h2 className="display-l">{r.kitchen.title}</h2>
              <p className="lede mt-7 max-w-[38ch] opacity-85">{r.kitchen.text}</p>
            </Reveal>
          </div>
        </section>
      )}

      {/* Pratos */}
      <section className="py-28 md:py-44">
        <div className="shell">
          <Reveal>
            <h2 className="display-l">Da cozinha do {r.name.split(" ")[0] === "Cru" ? "Cru" : r.name}.</h2>
          </Reveal>
          <div className="mt-20 space-y-24 md:mt-28 md:space-y-40">
            {r.signatureDishes.map((id, i) => (
              <DishRow key={id} dish={dishes[id]} flip={i % 2 === 1} />
            ))}
          </div>
          <div className="mt-28 grid gap-x-6 gap-y-10 md:mt-40 md:grid-cols-12">
            <Reveal className="md:col-span-4">
              <h3 className="title">Também no cardápio</h3>
              <div className="mt-8">
                <OpenMenuButton house={r.slug}>Ver cardápio completo</OpenMenuButton>
              </div>
            </Reveal>
            <ul className="md:col-span-7 md:col-start-6">
              {r.menuHighlights.map((m) => (
                <li key={m.name} className={cn("flex flex-col gap-1 border-b py-5 md:flex-row md:items-baseline md:justify-between", t.rule)}>
                  <span className="font-serif text-[1.5rem] font-light">{m.name}</span>
                  <span className="text-[0.95rem] opacity-70">{m.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Ambiente */}
      <section className="pb-28 md:pb-44">
        <div className="shell grid grid-cols-12 gap-3 md:gap-6">
          <Reveal className="col-span-12 md:col-span-4 md:col-start-1 md:row-start-1 md:self-center">
            <h2 className="display-l">{r.ambience.title}</h2>
            <p className="lede mt-7 max-w-[34ch] opacity-85">{r.ambience.text}</p>
          </Reveal>
          <RevealMedia className="col-span-7 mt-8 aspect-[3/4] md:col-span-4 md:col-start-6 md:row-start-1 md:mt-0">
            <Photo k={r.ambience.images[0]} alt="" sizes="(min-width: 768px) 32vw, 58vw" />
          </RevealMedia>
          <RevealMedia className="col-span-5 mt-24 aspect-[3/4] md:col-span-3 md:col-start-10 md:row-start-1 md:mt-40" delay={0.15}>
            <Photo k={r.ambience.images[1]} alt="" sizes="(min-width: 768px) 24vw, 40vw" />
          </RevealMedia>
        </div>
      </section>

      {/* Destaque: vinhos / grelha / coquetelaria */}
      <section className={t.alt}>
        <div className="grid md:grid-cols-2">
          <RevealMedia className="aspect-[4/5] md:aspect-auto md:min-h-[86vh]">
            <Photo k={r.feature.image} alt={r.feature.imageAlt} sizes="(min-width: 768px) 50vw, 100vw" />
          </RevealMedia>
          <Reveal className="flex flex-col justify-center px-[clamp(1.25rem,6vw,6rem)] py-20">
            <h2 className="display-l">{r.feature.title}</h2>
            <p className="lede mt-7 max-w-[38ch] opacity-85">{r.feature.text}</p>
          </Reveal>
        </div>
      </section>

      {/* Galeria */}
      <section className="py-28 md:py-40" aria-label={`Galeria do ${r.name}`}>
        <ul className="no-scrollbar flex snap-x snap-mandatory scroll-px-[clamp(1.25rem,4vw,4rem)] gap-3 overflow-x-auto px-[clamp(1.25rem,4vw,4rem)] md:gap-5">
          {r.gallery.map((k, i) => (
            <li key={k + i} className={cn("relative w-[72vw] shrink-0 snap-start overflow-hidden md:w-[30vw]", i % 2 ? "aspect-[3/4] md:mt-20" : "aspect-[4/5]")}>
              <Photo k={k} alt="" sizes="(min-width: 768px) 30vw, 72vw" quality={70} />
            </li>
          ))}
        </ul>
      </section>

      {/* Fechamento */}
      <section className="pb-36 md:pb-48">
        <div className="shell">
          <Reveal>
            <p className="display-l max-w-[16ch]">{r.closing}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Cta href={reserveHref} variant={t.cta} event="reserve_click" location={`${r.slug}_footer`}>{r.cta}</Cta>
              <span className="meta opacity-65">
                {site.address.venue}, {site.address.floor}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <StickyReserve label={r.cta} href={reserveHref} desktop />
    </div>
  );
}
