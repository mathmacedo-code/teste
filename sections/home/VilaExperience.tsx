import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { Cta } from "@/components/ui/Cta";
import { Photo } from "@/components/ui/Photo";
import { Parallax, Reveal, RevealMedia } from "@/components/ui/Motion";
import { video } from "@/data/media";

/** "Mais que uma mesa." — colagem editorial assimétrica (desktop) e sequência simples (mobile). */
export function VilaExperience() {
  return (
    <section className="overflow-hidden bg-cal pb-28 md:pb-44">
      <div className="shell grid grid-cols-12 gap-x-3 gap-y-10 md:gap-x-6 md:gap-y-6">
        <Reveal className="col-span-12 md:col-span-6 md:row-start-1 md:pt-10">
          <h2 className="display-l">
            Mais que uma mesa.
            <br />
            Uma experiência mediterrânea.
          </h2>
        </Reveal>

        <RevealMedia className="col-span-12 aspect-[4/5] md:col-span-4 md:col-start-9 md:row-span-2 md:row-start-1 md:aspect-[9/14]">
          <AmbientVideo source={video.forno} label="Massa sendo aberta à mão e levada ao forno a lenha" />
        </RevealMedia>

        <Parallax className="col-span-7 aspect-[3/4] md:col-span-4 md:col-start-1 md:row-start-2 md:mt-16" amount={5}>
          <Photo k="rose" alt="Convidada servindo rosé de um balde de gelo" sizes="(min-width: 768px) 32vw, 56vw" />
        </Parallax>
        <Parallax className="col-span-5 mt-24 aspect-[3/4] md:col-span-3 md:col-start-6 md:row-start-2 md:mt-56" amount={8}>
          <Photo k="negroni" alt="Negroni com casca de laranja sobre guardanapo do Vila Medí" sizes="(min-width: 768px) 24vw, 40vw" />
        </Parallax>

        <Reveal className="col-span-12 md:col-span-4 md:col-start-2 md:row-start-3 md:mt-40">
          <p className="lede max-w-[38ch]">
            Gastronomia, arquitetura, música e encontros se misturam em diferentes ambientes criados para acompanhar cada momento do dia.
          </p>
          <Cta href="#momentos" variant="line" className="mt-8">
            Descubra os ambientes
          </Cta>
        </Reveal>

        <RevealMedia className="col-span-9 col-start-4 aspect-[4/5] md:col-span-6 md:col-start-7 md:row-start-3 md:mt-24 md:aspect-[5/4]">
          <Photo k="mesa-palha" alt="Mesa posta sob luminária de palha" sizes="(min-width: 768px) 40vw, 75vw" className="object-[50%_35%]" />
        </RevealMedia>
      </div>
    </section>
  );
}
