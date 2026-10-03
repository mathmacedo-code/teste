import { Cta } from "@/components/ui/Cta";
import { Cutout } from "@/components/ui/Cutout";
import { Reveal } from "@/components/ui/Motion";

/**
 * "Mais que uma mesa." — a mesa sendo posta enquanto a página desce:
 * pratos recortados entram em velocidades diferentes (parallax) e giram devagar.
 */
export function VilaExperience() {
  return (
    <section className="relative overflow-x-clip bg-cal pb-28 md:pb-44">
      <div className="shell grid grid-cols-12 gap-x-3 gap-y-6 md:gap-x-6">
        <Reveal className="col-span-12 md:col-span-6 md:row-start-1 md:pt-10">
          <h2 className="display-l">
            Mais que uma mesa.
            <br />
            Uma experiência mediterrânea.
          </h2>
        </Reveal>

        <Cutout
          k="recorte-risoni"
          motion="float"
          drift={14}
          tilt={-4}
          sizes="(min-width: 768px) 46vw, 100vw"
          className="col-span-12 -mr-[12vw] ml-[6vw] md:col-span-6 md:col-start-7 md:row-span-2 md:row-start-1 md:mt-20 md:mr-0 md:ml-0"
        />

        <Reveal className="col-span-12 md:col-span-4 md:col-start-1 md:row-start-2 md:self-end">
          <p className="lede max-w-[38ch]">
            Gastronomia, arquitetura, música e encontros se misturam em diferentes ambientes criados para acompanhar cada momento do dia.
          </p>
          <Cta href="#momentos" variant="line" className="mt-8">
            Descubra os ambientes
          </Cta>
        </Reveal>

        <Cutout
          k="recorte-peixe"
          motion="spin"
          turn={36}
          drift={20}
          tilt={-22}
          sizes="(min-width: 768px) 30vw, 70vw"
          className="col-span-9 col-start-1 -ml-[6vw] md:col-span-4 md:col-start-4 md:row-start-3 md:-mt-6 md:ml-0"
        />
      </div>
    </section>
  );
}
