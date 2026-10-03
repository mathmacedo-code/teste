import { Reveal } from "@/components/ui/Motion";
import { site } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/cn";
import { WaveLines } from "@/components/ui/Motifs";

const layout = ["md:col-span-8", "md:col-span-6 md:col-start-6", "md:col-span-7 md:col-start-2"];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-cal py-28 md:py-44">
      <WaveLines className="absolute inset-x-0 bottom-0 h-[30%] text-azul opacity-[0.08] [mask-image:linear-gradient(to_top,black,transparent)]" />
      <div className="shell relative">
        <Reveal>
          <h2 className="display-l max-w-[16ch]">Vila Medí por quem viveu a experiência.</h2>
        </Reveal>

        <div className="mt-20 grid gap-y-16 md:mt-28 md:grid-cols-12 md:gap-y-24">
          {testimonials.map((t, i) => (
            <Reveal key={i} className={cn(layout[i % layout.length])}>
              <figure>
                <blockquote className={cn("font-serif font-light", i === 0 ? "display-m" : "text-[clamp(1.5rem,2.2vw,2.2rem)] leading-[1.18]")}>
                  <p>“{t.quote}”</p>
                </blockquote>
                <figcaption className="meta mt-6 opacity-60">{t.author}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-24 grid gap-6 border-t border-grafite/15 pt-10 md:mt-36 md:grid-cols-12">
          <p className="font-serif text-[1.6rem] font-light italic md:col-span-4">{site.press.award.outlet}</p>
          <p className="text-[1rem] md:col-span-5 md:col-start-6">
            {site.press.award.title}
            <br />
            <span className="opacity-70">{site.press.award.detail}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
