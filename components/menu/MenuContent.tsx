"use client";

import { useState } from "react";
import { menu } from "@/data/menu";
import { cn } from "@/lib/cn";

/** Cardápio completo com abas por casa. Usado no painel (home) e inline em /gastronomia. */
export function MenuContent({ initial = "temperani" }: { initial?: string }) {
  const [active, setActive] = useState(initial);
  const house = menu.find((h) => h.id === active) ?? menu[0];

  return (
    <div>
      <div role="tablist" aria-label="Casas" className="no-scrollbar -mx-1 flex gap-8 overflow-x-auto px-1 md:gap-12">
        {menu.map((h) => (
          <button
            key={h.id}
            role="tab"
            id={`tab-${h.id}`}
            aria-selected={h.id === active}
            aria-controls={`panel-${h.id}`}
            onClick={() => setActive(h.id)}
            className={cn(
              "shrink-0 cursor-pointer pb-2 font-serif text-[1.35rem] font-light whitespace-nowrap transition-opacity duration-500 md:text-[1.6rem]",
              h.id === active ? "link-u opacity-100" : "opacity-45 hover:opacity-80",
            )}
          >
            {h.name}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${house.id}`} aria-labelledby={`tab-${house.id}`} className="mt-12 md:mt-16">
        <p className="lede max-w-xl opacity-80">{house.intro}</p>
        <div className="mt-12 grid gap-x-20 gap-y-14 md:grid-cols-2">
          {house.sections.map((s) => (
            <section key={s.title}>
              <h3 className="font-serif text-[1.15rem] font-light italic opacity-70">{s.title}</h3>
              <ul className="mt-5">
                {s.items.map((it) => (
                  <li key={it.name} className="flex items-baseline justify-between gap-6 border-b border-current/12 py-4">
                    <div>
                      <p className="font-serif text-[1.3rem] leading-snug font-normal">{it.name}</p>
                      {it.description && <p className="mt-1 text-[0.95rem] opacity-70">{it.description}</p>}
                    </div>
                    {it.price && <span className="meta shrink-0 opacity-80">{it.price}</span>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="meta mt-14 opacity-60">Cardápio sujeito a alterações sazonais. Consulte a equipe sobre alergias e restrições.</p>
      </div>
    </div>
  );
}
