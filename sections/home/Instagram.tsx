import { Cta } from "@/components/ui/Cta";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Motion";
import { instagramPosts } from "@/data/instagram";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

/** Grade própria inspirada no perfil (pronta para receber a Instagram Graph API). */
export function Instagram() {
  const posts = instagramPosts.slice(0, 5);
  return (
    <section className="bg-cal pb-28 md:pb-44">
      <div className="shell">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="display-l">
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">{site.instagram.handle}</a>
          </h2>
          <Cta href={site.instagram.url} external variant="line">Seguir no Instagram</Cta>
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-2 md:mt-16 md:grid-cols-4 md:grid-rows-2 md:gap-3">
          {posts.map((p, i) => (
            <li key={p.id} className={cn(i === 0 && "col-span-2 md:row-span-2")}>
              <a
                href={p.permalink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.caption} no Instagram`}
                className={cn("group relative block overflow-hidden bg-areia", i === 0 ? "aspect-[4/5] md:aspect-auto md:h-full" : "aspect-[4/5]")}
              >
                <Photo
                  k={p.image}
                  alt=""
                  sizes={i === 0 ? "(min-width: 768px) 46vw, 92vw" : "(min-width: 768px) 23vw, 46vw"}
                  quality={70}
                  className="transition-transform duration-[1600ms] ease-[var(--ease-lux)] group-hover:scale-[1.05]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noite/70 to-transparent p-4 pt-12 text-[0.9rem] text-perola opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                  {p.caption}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
