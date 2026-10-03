import { JsonLd } from "@/components/seo/JsonLd";
import { OpenMenuButton } from "@/components/overlays/Overlays";
import { StickyReserve } from "@/components/layout/StickyReserve";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { Cta } from "@/components/ui/Cta";
import { CandleGlow } from "@/components/ui/CandleGlow";
import { Cutout } from "@/components/ui/Cutout";
import { DishMarquee } from "@/components/ui/DishMarquee";
import { Photo } from "@/components/ui/Photo";
import { Parallax, Reveal } from "@/components/ui/Motion";
import { Float, LemonBranch, Meander, TileField, WaveLines } from "@/components/ui/Motifs";
import { Seal } from "@/components/ui/Seal";
import { dishes } from "@/data/dishes";
import { houseMarquee } from "@/data/marquee";
import { video } from "@/data/media";
import type { Restaurant, RestaurantSlug, Theme } from "@/data/restaurants";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { restaurantSchema } from "@/lib/schema";
import { DishStack } from "@/sections/shared/DishStack";

/** Cada casa mantém a linguagem Vila Medí com temperatura própria. */
const THEMES: Record<Theme, { page: string; alt: string; rule: string; cta: "solid" | "light" }> = {
  cal: { page: "bg-cal text-grafite", alt: "bg-areia", rule: "border-grafite/15", cta: "solid" },
  branco: { page: "bg-cal-claro text-grafite", alt: "bg-[#e3e8ee]", rule: "border-azul/15", cta: "solid" },
  noite: { page: "bg-noite text-perola", alt: "bg-[#211a13]", rule: "border-perola/15", cta: "light" },
};

/** Motivo mediterrâneo de fundo de cada casa. */
function HouseMotif({ slug, place }: { slug: RestaurantSlug; place: "concept" | "closing" }) {
  if (slug === "temperani")
    return (
      <Float
        className={cn(
          "absolute w-[240px] text-[#7d6a1e] opacity-35 md:w-[360px]",
          place === "concept" ? "bottom-[4%] -left-12 rotate-[15deg]" : "top-0 -right-14 rotate-[195deg]",
        )}
        amount={60}
      >
        <LemonBranch className="sway-branch" />
      </Float>
    );
  if (slug === "miimar")
    return place === "concept" ? (
      <TileField size={80} className="absolute inset-y-0 left-0 w-[70%] text-azul opacity-[0.08] [mask-image:radial-gradient(60%_60%_at_25%_55%,black,transparent)]" />
    ) : (
      <Meander className="absolute inset-x-0 top-0 text-azul opacity-30" />
    );
  return (
    <WaveLines
      className={cn(
        "absolute inset-x-0 h-[40%] text-perola opacity-[0.07]",
        place === "concept" ? "bottom-0 [mask-image:linear-gradient(to_top,black,transparent)]" : "top-0 [mask-image:linear-gradient(to_bottom,black,transparent)]",
      )}
    />
  );
}

export function RestaurantPage({ r }: { r: Restaurant }) {
  const t = THEMES[r.theme];
  const reserveHref = `/reservas?casa=${encodeURIComponent(r.name)}`;

  return (
    <div className={t.page}>
      <JsonLd data={restaurantSchema(r)} />

      {/* Hero */}
      <section className="relative h-[100svh] min-h-[620px] overflow-hidden bg-noite text-perola">
        <AmbientVideo source={video[r.hero.video]} priority label={`Ambiente do ${r.name}`} />
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
      <section className="relative overflow-x-clip py-28 md:py-44">
        <HouseMotif slug={r.slug} place="concept" />
        <div className="shell relative grid items-center gap-x-6 gap-y-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <h2 className="display-l">{r.concept.title}</h2>
            {r.concept.text.map((p) => (
              <p key={p} className="lede mt-7 max-w-[40ch] opacity-85">{p}</p>
            ))}
          </Reveal>
          <Cutout
            k={r.dish}
            motion={r.dish === "recorte-risoni" ? "float" : "spin"}
            turn={r.dish === "recorte-peixe" ? 40 : 80}
            tilt={r.dish === "recorte-peixe" ? -20 : 0}
            sizes="(min-width: 768px) 46vw, 92vw"
            className="-mr-[14vw] ml-[6vw] md:col-span-6 md:col-start-7 md:mr-[-4vw] md:ml-0"
          />
        </div>
      </section>

      {/* Cozinha / chef */}
      {r.kitchen && (
        <section className={cn("py-28 md:py-40", t.alt)}>
          <div className="shell grid items-end gap-x-6 gap-y-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Seal text={`${r.name} · Feito à mão · Forno a lenha · `} className="w-[150px] md:w-[220px]" />
            </div>
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
          <DishStack dishes={r.signatureDishes.map((id) => dishes[id])} className="mt-16 md:mt-24" />
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
          <Reveal className="relative col-span-11 col-start-2 mt-12 md:col-span-5 md:col-start-7 md:row-start-1 md:mt-0" delay={0.1}>
            {/* moldura deslocada em linha fina, como um passe-partout */}
            <div aria-hidden className="absolute -top-3 -left-3 h-full w-full border border-current/25" />
            <Parallax className="relative aspect-[4/5] bg-noite" amount={6}>
              <Photo k={r.photo} alt={r.photoAlt} sizes="(min-width: 768px) 40vw, 90vw" quality={85} />
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* Destaque: vinhos / grelha / coquetelaria */}
      <section className="relative overflow-hidden bg-noite py-32 text-perola md:py-48">
        <CandleGlow />
        <Reveal className="shell relative text-center">
          <h2 className="display-xl mx-auto max-w-[14ch] italic">{r.feature.title}</h2>
          <p className="lede mx-auto mt-8 max-w-[44ch] opacity-85">{r.feature.text}</p>
        </Reveal>
      </section>

      {/* Faixa de pratos da casa */}
      <section className="py-24 md:py-36" aria-label={`Pratos do ${r.name}`}>
        <DishMarquee items={houseMarquee[r.slug]} />
      </section>

      {/* Fechamento */}
      <section className="relative overflow-hidden pt-16 pb-36 md:pt-24 md:pb-48">
        <HouseMotif slug={r.slug} place="closing" />
        <div className="shell relative">
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
