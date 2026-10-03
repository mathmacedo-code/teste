import { Photo } from "@/components/ui/Photo";
import { Reveal, RevealMedia } from "@/components/ui/Motion";

export function BrandIntro() {
  return (
    <section id="vila-medi" className="bg-cal pt-28 pb-24 md:pt-44 md:pb-36">
      <div className="shell grid gap-y-10 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <h2 className="display-l max-w-[13ch]">Um destino mediterrâneo em São Paulo.</h2>
        </Reveal>
        <Reveal className="md:col-span-4 md:col-start-9 md:self-end" delay={0.15}>
          <p className="lede">
            Três cozinhas, um bar central e salões de arcos, pedra e palha no 3º piso do Shopping Cidade Jardim.
            Gastronomia, arquitetura e encontros no mesmo endereço.
          </p>
        </Reveal>
      </div>

      <div className="shell mt-16 grid grid-cols-12 items-end gap-3 md:mt-28 md:gap-6">
        <RevealMedia className="col-span-7 aspect-[3/4] md:col-span-5 md:col-start-2">
          <Photo k="luminarias" alt="Luminárias de tecido listrado sob os arcos do salão" sizes="(min-width: 768px) 40vw, 58vw" />
        </RevealMedia>
        <div className="col-span-5 md:col-span-3 md:col-start-8 md:mb-24">
          <RevealMedia className="aspect-[4/5]" delay={0.2}>
            <Photo k="fachada" alt="Letreiro do Vila Medí iluminado na entrada" sizes="(min-width: 768px) 24vw, 40vw" />
          </RevealMedia>
          <p className="meta mt-4 opacity-65">3º piso, Shopping Cidade Jardim</p>
        </div>
      </div>
    </section>
  );
}
