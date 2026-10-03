import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { CandleGlow } from "@/components/ui/CandleGlow";
import { Reveal } from "@/components/ui/Motion";
import { Photo } from "@/components/ui/Photo";
import { video, type VideoKey } from "@/data/media";
import { cn } from "@/lib/cn";

const drinks: { v: VideoKey; label: string; caption: string }[] = [
  { v: "drinkTaca", label: "Coquetel sendo servido na taça, com casca de laranja", caption: "Servido na taça" },
  { v: "drinkSpritz", label: "Spritz sendo montado com gelo e casca de laranja", caption: "Spritz da casa" },
];

/**
 * O bar central: os drinks sendo montados em destaque, sobre a foto do balcão
 * esmaecida ao fundo (luz de vela por cima).
 */
export function Bar() {
  return (
    <section id="bar" className="relative isolate overflow-hidden bg-noite py-28 text-perola md:py-40">
      {/* o balcão ao fundo, bem escuro: dá o clima sem competir com os vídeos */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Photo k="bar-1" alt="" sizes="100vw" quality={70} className="scale-105 opacity-35 blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-noite via-noite/70 to-noite" />
      </div>
      <CandleGlow />

      <div className="shell relative grid items-center gap-14 md:grid-cols-12 md:gap-6">
        <Reveal className="md:col-span-5">
          <p className="meta opacity-60">Bar central</p>
          <h2 className="display-l mt-4 max-w-[12ch]">Onde a noite começa.</h2>
          <p className="lede mt-6 max-w-[38ch] opacity-85">
            Clássicos bem executados e coquetéis autorais assinados por Rafael Welbert, num balcão de madeira sob as luminárias de palha.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:col-span-6 md:col-start-7 md:gap-6">
          {drinks.map((d, i) => {
            const card = (
              <figure>
                <div className="relative aspect-[9/16] overflow-hidden rounded-[3px] bg-[#211a13] shadow-[0_30px_70px_-30px_rgb(0_0_0/0.8)]">
                  <AmbientVideo source={video[d.v]} label={d.label} />
                </div>
                <figcaption className="meta mt-4 flex items-center gap-3 opacity-70">
                  <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="h-px w-6 bg-current opacity-40" />
                  {d.caption}
                </figcaption>
              </figure>
            );
            // o segundo drink fica mais baixo, em degrau
            return (
              <Reveal key={d.v} delay={i * 0.15} className={cn(i === 1 && "mt-16 md:mt-28")}>
                {card}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
