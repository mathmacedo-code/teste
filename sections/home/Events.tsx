import { OpenEventButton } from "@/components/overlays/Overlays";
import { Cta } from "@/components/ui/Cta";
import { Photo } from "@/components/ui/Photo";
import { Reveal, RevealMedia } from "@/components/ui/Motion";
import { eventTypes } from "@/data/events";

export function Events() {
  return (
    <section id="eventos" className="bg-oliva-fundo py-28 text-perola md:py-44">
      <div className="shell grid gap-x-6 gap-y-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <h2 className="display-l">Celebre no Vila Medí.</h2>
            <p className="lede mt-8 max-w-[38ch] opacity-85">
              Da mesa longa para doze ao salão inteiro, com menus das três cozinhas e o bar central como cenário.
            </p>
          </Reveal>
          <ul className="mt-12">
            {eventTypes.map((e, i) => (
              <Reveal key={e.name} delay={i * 0.05}>
                <li className="border-b border-perola/15 py-4">
                  <p className="font-serif text-[1.45rem] leading-tight font-light">{e.name}</p>
                  <p className="mt-1 text-[0.95rem] opacity-70">{e.text}</p>
                </li>
              </Reveal>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
            <OpenEventButton source="home">Realizar meu evento</OpenEventButton>
            <Cta href="/eventos" variant="line">Ver espaços e formatos</Cta>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3 md:col-span-6 md:col-start-7 md:gap-5">
          <RevealMedia className="col-span-6 aspect-[4/5]">
            <Photo k="mesa-longa" alt="Mesa longa posta para um evento privado" sizes="(min-width: 768px) 46vw, 92vw" />
          </RevealMedia>
          <RevealMedia className="col-span-3 aspect-[3/4]" delay={0.1}>
            <Photo k="franjas" alt="Luminárias de franjas sobre o salão" sizes="(min-width: 768px) 23vw, 46vw" />
          </RevealMedia>
          <RevealMedia className="col-span-3 mt-16 aspect-[3/4]" delay={0.2}>
            <Photo k="bartender" alt="Bartender preparando coquetel no bar central" sizes="(min-width: 768px) 23vw, 46vw" />
          </RevealMedia>
        </div>
      </div>
    </section>
  );
}
