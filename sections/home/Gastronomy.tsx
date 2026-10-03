import { OpenMenuButton } from "@/components/overlays/Overlays";
import { Reveal } from "@/components/ui/Motion";
import { Cutout } from "@/components/ui/Cutout";
import { dishes, homeDishes } from "@/data/dishes";
import { DishStack } from "@/sections/shared/DishStack";
import { Meander } from "@/components/ui/Motifs";

export function Gastronomy() {
  return (
    <section id="gastronomia" className="relative overflow-x-clip bg-areia py-28 md:py-44">
      <Meander className="absolute inset-x-0 top-6 text-grafite opacity-[0.14]" />
      <div className="shell relative">
        <Cutout
          k="recorte-burrata"
          sizes="(min-width: 768px) 36vw, 66vw"
          className="relative -mt-10 -mr-[18vw] mb-[-3rem] ml-auto w-[66vw] md:absolute md:top-[-5rem] md:right-[-7vw] md:m-0 md:w-[36vw] md:max-w-[600px]"
        />
        <Reveal className="relative">
          <h2 className="display-l max-w-[15ch]">Sabores que atravessam o Mediterrâneo.</h2>
        </Reveal>
        <DishStack dishes={homeDishes.map((id) => dishes[id])} className="mt-16 md:mt-28" />
        <Reveal className="mt-24 flex flex-col items-start gap-6 md:mt-36 md:items-center">
          <p className="lede opacity-80">Temperani Amalfi, MII Mar, Cru Oyster Bar e o bar central.</p>
          <OpenMenuButton variant="solid">Ver cardápio completo</OpenMenuButton>
        </Reveal>
      </div>
    </section>
  );
}
