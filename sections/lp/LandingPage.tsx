import Link from "next/link";
import { Emblem, Wordmark } from "@/components/brand/Logo";
import { EventForm } from "@/components/forms/EventForm";
import { ReserveChoices } from "@/components/forms/ReserveChoices";
import { StickyReserve } from "@/components/layout/StickyReserve";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { Cta } from "@/components/ui/Cta";
import { DishMarquee } from "@/components/ui/DishMarquee";
import { Reveal } from "@/components/ui/Motion";
import { dishes } from "@/data/dishes";
import type { Landing } from "@/data/landing-pages";
import { signatureMarquee } from "@/data/marquee";
import { video } from "@/data/media";
import { site } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import { DishStack } from "@/sections/shared/DishStack";

/**
 * Template de LP para mídia paga: navegação mínima, uma ação só (o formulário),
 * vídeo no topo, benefícios, ambientação, pratos e prova social.
 * Desktop: o vídeo vertical ocupa um painel à direita (sem esticar a imagem).
 */
export function LandingPage({ l }: { l: Landing }) {
  const v = video[l.hero.video];
  return (
    <div className="bg-cal text-grafite">
      <header className="absolute inset-x-0 top-0 z-30 text-perola">
        <div className="shell flex h-[76px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Vila Medí">
            <Emblem className="w-[24px]" />
            <Wordmark className="w-[96px]" />
          </Link>
          <Cta href="#reserva" variant="light" className="!px-5 !py-2.5" event={l.form === "evento" ? "event_click" : "reserve_click"} location={`lp_${l.slug}_header`}>
            {l.form === "evento" ? "Pedir proposta" : "Reservar"}
          </Cta>
        </div>
      </header>

      <section className="relative grid min-h-[100svh] bg-noite text-perola md:grid-cols-[1fr_auto]">
        <div className="absolute inset-0 md:relative md:order-2 md:h-[100svh] md:w-[min(56.25svh,46vw)]">
          <AmbientVideo source={v} priority label="Ambiente do Vila Medí" />
          <div aria-hidden className="scrim-bottom absolute inset-0 md:hidden" />
        </div>
        <div className="shell relative flex flex-col justify-end pt-32 pb-[max(3.25rem,7vh)] md:order-1 md:justify-center md:pb-24">
          <Reveal>
            <h1 className="display-xl max-w-[12ch]">{l.hero.headline}</h1>
            <p className="lede mt-7 max-w-[38ch] opacity-90">{l.hero.sub}</p>
            <div className="mt-10">
              <Cta href="#reserva" variant="light" event={l.form === "evento" ? "event_click" : "reserve_click"} location={`lp_${l.slug}_hero`}>
                {l.cta}
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 md:py-36">
        <div className="shell grid gap-12 md:grid-cols-3 md:gap-10">
          {l.benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <h2 className="title">{b.title}</h2>
              <p className="mt-3 max-w-[32ch] opacity-80">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-24 md:pb-36" aria-label="Pratos do Vila Medí">
        <DishMarquee items={signatureMarquee} />
      </section>

      <section className="bg-areia py-24 md:py-36">
        <div className="shell">
          <DishStack dishes={l.dishes.map((id) => dishes[id])} />
        </div>
      </section>

      <section className="py-24 md:py-36">
        <div className="shell grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-8">
            <figure>
              <blockquote className="display-m">“{testimonials[0].quote}”</blockquote>
              <figcaption className="meta mt-6 opacity-60">{testimonials[0].author}</figcaption>
            </figure>
          </Reveal>
          <Reveal className="md:col-span-3 md:col-start-10 md:self-end">
            <p className="font-serif text-[1.3rem] italic">{site.press.award.outlet}</p>
            <p className="mt-1 text-[0.95rem] opacity-75">
              {site.press.award.title}. {site.press.award.detail}.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="reserva" className={l.form === "evento" ? "bg-oliva-fundo py-24 text-perola md:py-36" : "bg-noite py-24 text-perola md:py-36"}>
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="display-l">{l.form === "evento" ? "Peça sua proposta." : "Reserve sua mesa."}</h2>
            <p className="lede mt-6 max-w-[34ch] opacity-85">
              {site.address.venue}, {site.address.floor}. {l.form === "evento" ? "Respondemos com uma proposta." : "Reserve direto pelo WhatsApp."}
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            {l.form === "evento" ? (
              <EventForm cta={l.cta} source={`lp_${l.slug}`} />
            ) : (
              <ReserveChoices houses={l.house ? [l.house] : undefined} source={`lp_${l.slug}`} tone="dark" />
            )}
          </div>
        </div>
      </section>

      <footer className="bg-noite pb-28 text-perola md:pb-12">
        <div className="shell meta flex flex-col gap-3 border-t border-perola/10 pt-8 opacity-60 md:flex-row md:justify-between">
          <span>{site.name}: {site.address.street}, {site.address.floor}, {site.address.venue}, {site.address.city}</span>
          <Link href="/politica-de-privacidade">Política de privacidade</Link>
        </div>
      </footer>

      <StickyReserve label={l.cta} href="#reserva" />
    </div>
  );
}
