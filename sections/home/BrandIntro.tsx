import { DishMarquee } from "@/components/ui/DishMarquee";
import { Reveal } from "@/components/ui/Motion";
import { Seal } from "@/components/ui/Seal";
import { signatureMarquee } from "@/data/marquee";

export function BrandIntro() {
  return (
    <section id="vila-medi" className="overflow-x-clip bg-cal pt-28 pb-24 md:pt-44 md:pb-36">
      <div className="shell grid items-end gap-y-12 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <h2 className="display-l max-w-[13ch]">Um destino mediterrâneo em São Paulo.</h2>
        </Reveal>
        <div className="flex items-end justify-between gap-8 md:col-span-5 md:col-start-8 md:flex-col md:items-end">
          <Reveal delay={0.15}>
            <p className="lede max-w-[34ch]">
              Três cozinhas, um bar central e salões de arcos, pedra e palha no 3º piso do Shopping Cidade Jardim.
              Gastronomia, arquitetura e encontros no mesmo endereço.
            </p>
          </Reveal>
          <Seal className="w-[118px] shrink-0 text-grafite md:order-first md:w-[172px]" />
        </div>
      </div>

      <DishMarquee items={signatureMarquee} className="mt-20 text-grafite md:mt-32" />
      <p className="shell meta mt-6 opacity-60">Do cardápio das três casas</p>
    </section>
  );
}
