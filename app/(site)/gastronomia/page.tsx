import Link from "next/link";
import { MenuContent } from "@/components/menu/MenuContent";
import { Cta } from "@/components/ui/Cta";
import { Photo } from "@/components/ui/Photo";
import { PlateSpin } from "@/components/ui/PlateSpin";
import { Reveal, RevealMedia } from "@/components/ui/Motion";
import { dishes, gastronomyDishes } from "@/data/dishes";
import { restaurantList } from "@/data/restaurants";
import { pageMetadata } from "@/lib/seo";
import { DishRow } from "@/sections/shared/DishRow";

export const metadata = pageMetadata({
  title: "Gastronomia e cardápio | Vila Medí, Cidade Jardim",
  description:
    "Cozinha italiana, grega e do mar no Shopping Cidade Jardim: massas frescas do Temperani Amalfi, polvo e mezze do MII Mar, ostras e crudos do Cru Oyster Bar.",
  path: "/gastronomia",
  absoluteTitle: true,
});

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
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Photo k={r.cover} alt="" sizes="(min-width: 768px) 31vw, 92vw" className="transition-transform duration-[1600ms] ease-[var(--ease-lux)] group-hover:scale-[1.04]" />
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

      <section className="relative overflow-x-clip bg-areia py-28 md:py-44">
        <div className="shell relative">
          <PlateSpin
            sizes="(min-width: 768px) 30vw, 60vw"
            turn={90}
            className="relative -mt-10 -mr-[16vw] mb-[-2.5rem] ml-auto w-[60vw] md:absolute md:top-[-6rem] md:right-[-6vw] md:m-0 md:w-[30vw] md:max-w-[520px]"
          />
          <Reveal className="relative">
            <h2 className="display-l">Pratos da casa.</h2>
          </Reveal>
          <div className="mt-20 space-y-24 md:mt-28 md:space-y-40">
            {gastronomyDishes.map((id, i) => (
              <DishRow key={id} dish={dishes[id]} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-noite text-perola">
        <div className="grid md:grid-cols-2">
          <RevealMedia className="aspect-[4/5] md:aspect-auto md:min-h-[86vh]">
            <Photo k="drink" alt="Drink sendo servido no bar central" sizes="(min-width: 768px) 50vw, 100vw" />
          </RevealMedia>
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
