import { OpenMenuButton } from "@/components/overlays/Overlays";
import { Reveal } from "@/components/ui/Motion";
import { dishes, homeDishes } from "@/data/dishes";
import { DishRow } from "@/sections/shared/DishRow";

export function Gastronomy() {
  return (
    <section id="gastronomia" className="bg-areia py-28 md:py-44">
      <div className="shell">
        <Reveal>
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
