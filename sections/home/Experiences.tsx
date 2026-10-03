import Link from "next/link";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { Reveal } from "@/components/ui/Motion";
import { video } from "@/data/media";
import { restaurantList } from "@/data/restaurants";

/** Três casas como grandes painéis verticais em vídeo. Desktop: o painel em foco se expande e troca o texto. */
export function Experiences() {
  return (
    <section id="experiencias" className="bg-cal pb-28 md:pb-44">
      <div className="shell">
        <Reveal>
          <h2 className="display-l max-w-[12ch]">Um destino. Três experiências.</h2>
        </Reveal>
      </div>

      <div className="xp-row mt-14 flex flex-col gap-[6px] md:mt-20 md:h-[88vh] md:min-h-[620px] md:flex-row">
        {restaurantList.map((r) => (
          <Link
            key={r.slug}
            href={r.path}
            className="xp-panel group relative block aspect-[4/5] overflow-hidden bg-noite text-perola md:aspect-auto"
          >
            <AmbientVideo
              source={video[r.cover]}
              className="transition-transform duration-[1800ms] ease-[var(--ease-lux)] group-hover:scale-[1.05]"
            />
            <div aria-hidden className="scrim-bottom absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <p className="meta opacity-75">{r.origin}</p>
              <h3 className="display-m mt-2">{r.name}</h3>
              <div className="relative mt-3 max-w-[30ch] text-[1rem] leading-relaxed md:min-h-[3.3em]">
                <p className="transition-all duration-700 ease-[var(--ease-lux)] md:group-hover:-translate-y-2 md:group-hover:opacity-0">
                  {r.line}
                </p>
                <p className="hidden md:absolute md:inset-0 md:block md:translate-y-2 md:opacity-0 md:transition-all md:duration-700 md:ease-[var(--ease-lux)] md:group-hover:translate-y-0 md:group-hover:opacity-100">
                  {r.hoverLine}
                </p>
              </div>
              <span className="link-u mt-6 inline-flex text-[0.92rem] font-[450] md:opacity-0 md:transition-opacity md:duration-700 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                Conhecer o {r.name.split(" ")[0] === "Cru" ? "Cru" : r.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
