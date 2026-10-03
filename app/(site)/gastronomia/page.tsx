import Link from "next/link";
import { MenuContent } from "@/components/menu/MenuContent";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { Cta } from "@/components/ui/Cta";
import { Photo } from "@/components/ui/Photo";
import { Cutout } from "@/components/ui/Cutout";
import { Reveal } from "@/components/ui/Motion";
import { dishes, gastronomyDishes } from "@/data/dishes";
import { video } from "@/data/media";
import { restaurantList, type Theme } from "@/data/restaurants";
import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/seo";
import { DishStack } from "@/sections/shared/DishStack";

export const metadata = pageMetadata({
  title: "Gastronomia e cardápio | Vila Medí, Cidade Jardim",
  description:
    "Cozinha italiana, grega e do mar no Shopping Cidade Jardim: massas frescas do Temperani Amalfi, polvo e mezze do MII Mar, ostras e crudos do Cru Oyster Bar.",
  path: "/gastronomia",
  absoluteTitle: true,
});

/** fundo de cada casa atrás do prato recortado */
const TILE: Record<Theme, string> = { cal: "bg-areia", branco: "bg-[#dfe6ee]", noite: "bg-noite" };

export default function GastronomiaPage() {
  return (
    <>
      <section className="relative h-[100svh] min-h-[620px] overflow-hidden bg-noite text-perola">
        <Photo k="plateau-cru" alt="" sizes="100vw" priority />
        <div aria-hidden className="scrim-bottom absolute inset-0" />
        {/* a foto é cheia de detalhe: escurece o lado do título para manter a leitura */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-noite/65 via-noite/20 to-transparent" />
        <div className="shell relative flex h-full flex-col justify-end pb-[max(3.25rem,7vh)]">
          <Reveal>
            <h1 className="display-xl max-w-[13ch]">Sabores que atravessam o Mediterrâneo.</h1>
          </Reveal>
          <Reveal delay={0.2} className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="lede max-w-[40ch] opacity-90">Itália, Grécia e o mar em três cozinhas que dividem o mesmo salão e a mesma conta.</p>
            <Cta href="#cardapio" variant="light">Ver cardápio completo</Cta>
          </Reveal>
        </div>
      </section>

      <section className="bg-cal py-28 md:py-44">
        <div className="shell grid gap-16 md:grid-cols-3 md:gap-6">
          {restaurantList.map((r, i) => (
            <Reveal key={r.slug} delay={i * 0.1} className={i === 1 ? "md:mt-24" : undefined}>
              <Link href={r.path} className="group block">
                <div className={cn("arch-45 relative flex aspect-[4/5] items-center justify-center overflow-hidden", TILE[r.theme])}>
                  <Cutout
                    k={r.dish}
                    motion={r.dish === "recorte-risoni" ? "float" : "spin"}
                    turn={r.dish === "recorte-peixe" ? 36 : 90}
                    tilt={r.dish === "recorte-peixe" ? -18 : 0}
                    drift={6}
                    sizes="(min-width: 768px) 28vw, 80vw"
                    className={cn("transition-transform duration-[1600ms] ease-[var(--ease-lux)] group-hover:scale-[1.06]", r.dish === "recorte-risoni" ? "w-[96%]" : "w-[80%]")}
                  />
                </div>
                <p className="meta mt-6 opacity-60">{r.origin}</p>
                <h2 className="display-m mt-2">{r.name}</h2>
                <p className="mt-3 max-w-[32ch] opacity-80">{r.line}</p>
                <span className="link-u mt-5 inline-flex text-[0.92rem] font-[450]">Conhecer a casa</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-areia py-28 md:py-44">
        <div className="shell">
          <Reveal>
            <h2 className="display-l">Pratos da casa.</h2>
          </Reveal>
          <DishStack dishes={gastronomyDishes.map((id) => dishes[id])} className="mt-16 md:mt-24" />
        </div>
      </section>

      <section className="bg-noite text-perola">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[86vh]">
            <AmbientVideo source={video.drinkTaca} label="Coquetel sendo servido na taça, com casca de laranja, no bar central" />
          </div>
          <Reveal className="flex flex-col justify-center px-[clamp(1.25rem,6vw,6rem)] py-20">
            <h2 className="display-l">Bar central e carta de vinhos.</h2>
            <p className="lede mt-7 max-w-[38ch] opacity-85">
              Coquetelaria assinada por Rafael Welbert e seleção de vinhos de Ricardo Santinho, pensadas para acompanhar as três cozinhas.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="cardapio" className="bg-cal py-28 md:py-44">
        <div className="shell">
          <h2 className="display-l">Cardápio.</h2>
          <div className="mt-14">
            <MenuContent />
          </div>
        </div>
      </section>
    </>
  );
}
