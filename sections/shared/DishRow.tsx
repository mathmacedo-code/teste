import { Photo } from "@/components/ui/Photo";
import { Reveal, RevealMedia } from "@/components/ui/Motion";
import type { Dish } from "@/data/dishes";
import { cn } from "@/lib/cn";

/** Prato em destaque: imagem grande + nome, descrição e casa. Alterna lados. */
export function DishRow({ dish, flip, priority }: { dish: Dish; flip?: boolean; priority?: boolean }) {
  return (
    <article className="grid grid-cols-12 items-center gap-y-8 md:gap-x-6">
      <RevealMedia
        className={cn(
          "arch-45 col-span-11 aspect-[4/5] md:col-span-6",
          flip ? "col-start-2 md:col-start-7 md:row-start-1" : "md:col-start-1",
        )}
      >
        <Photo k={dish.image} alt={dish.alt} sizes="(min-width: 768px) 46vw, 92vw" priority={priority} />
      </RevealMedia>
      <Reveal
        className={cn(
          "col-span-11 md:col-span-4 md:row-start-1",
          flip ? "col-start-2 md:col-start-2" : "col-start-1 md:col-start-8",
        )}
        delay={0.15}
      >
        <p className="meta opacity-65">{dish.house}</p>
        <h3 className="display-m mt-3">{dish.name}</h3>
        <p className="lede mt-5 max-w-[32ch] opacity-85">{dish.description}</p>
      </Reveal>
    </article>
  );
}
