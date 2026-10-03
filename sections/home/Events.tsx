import { OpenEventButton } from "@/components/overlays/Overlays";
import { Cta } from "@/components/ui/Cta";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { CandleGlow } from "@/components/ui/CandleGlow";
import { Reveal } from "@/components/ui/Motion";
import { eventTypes } from "@/data/events";
import { video } from "@/data/media";
import { Float, OliveBranch } from "@/components/ui/Motifs";

export function Events() {
  return (
    <section id="eventos" className="relative overflow-hidden bg-oliva-fundo py-28 text-perola md:py-44">
      <CandleGlow />
      <Float className="absolute -top-6 -right-16 w-[260px] rotate-[170deg] text-perola opacity-[0.13] md:w-[460px]" amount={80}>
        <OliveBranch className="sway-branch" />
      </Float>
      <Float className="absolute bottom-10 -left-16 w-[220px] text-perola opacity-[0.1] md:w-[380px]" amount={60}>
        <OliveBranch />
      </Float>
      <div className="shell relative grid gap-x-6 gap-y-16 md:grid-cols-12">
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

        <div className="md:col-span-6 md:col-start-7 md:self-center">
          <Reveal className="relative mx-auto w-[86%] md:w-[78%]">
            {/* arco duplo, como no emblema */}
            <div aria-hidden className="arch-23 absolute -inset-[10px] border border-perola/30" />
            <div className="arch-23 relative aspect-[2/3] overflow-hidden">
              <AmbientVideo source={video.heroMobile} label="O salão do Vila Medí à noite, com mesas postas e coquetéis" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
