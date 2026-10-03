import { OpenMenuButton } from "@/components/overlays/Overlays";
import { Reveal } from "@/components/ui/Motion";
import { Cutout } from "@/components/ui/Cutout";
import { dishes, homeDishes } from "@/data/dishes";
import { DishRow } from "@/sections/shared/DishRow";

export function Gastronomy() {
  return (
    <section id="gastronomia" className="relative overflow-x-clip bg-areia py-28 md:py-44">
      <div className="shell relative">
        <Cutout
          k="recorte-burrata"
          sizes="(min-width: 768px) 36vw, 66vw"
          className="relative -mt-10 -mr-[18vw] mb-[-3rem] ml-auto w-[66vw] md:absolute md:top-[-5rem] md:right-[-7vw] md:m-0 md:w-[36vw] md:max-w-[600px]"
        />
        <Reveal className="relative">
          <h2 className="display-l max-w-[15ch]">Sabores que atravessam o Mediterrâneo.</h2>
        </Reveal>
        <div className="mt-20 space-y-24 md:mt-32 md:space-y-44">
          {homeDishes.map((id, i) => (
            <DishRow key={id} dish={dishes[id]} flip={i % 2 === 1} />
          ))}
        </div>
        <Reveal className="mt-24 flex flex-col items-start gap-6 md:mt-36 md:items-center">
          <p className="lede opacity-80">Temperani Amalfi, MII Mar, Cru Oyster Bar e o bar central.</p>
          <OpenMenuButton variant="solid">Ver cardápio completo</OpenMenuButton>
        </Reveal>
      </div>
    </section>
  );
}
