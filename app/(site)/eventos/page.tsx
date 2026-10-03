import { EventForm } from "@/components/forms/EventForm";
import { Cta } from "@/components/ui/Cta";
import { Photo } from "@/components/ui/Photo";
import { Reveal, RevealMedia } from "@/components/ui/Motion";
import { eventSteps, eventTypes, spaces } from "@/data/events";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Eventos no Vila Medí | Aniversários, corporativos e celebrações no Cidade Jardim",
  description:
    "Realize seu evento no Vila Medí, no Shopping Cidade Jardim: aniversários, eventos corporativos, confraternizações e experiências privadas com menus das três cozinhas.",
  path: "/eventos",
  absoluteTitle: true,
});

export default function EventosPage() {
  return (
    <>
      <section className="relative h-[100svh] min-h-[620px] overflow-hidden bg-noite text-perola">
        <Photo k="mesa-longa" alt="" sizes="100vw" priority className="object-[50%_40%]" />
        <div aria-hidden className="scrim-bottom absolute inset-0" />
        <div className="shell relative flex h-full flex-col justify-end pb-[max(3.25rem,7vh)]">
          <Reveal>
            <h1 className="display-xl max-w-[12ch]">Celebre no Vila Medí.</h1>
          </Reveal>
          <Reveal delay={0.2} className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="lede max-w-[40ch] opacity-90">
              Aniversários, encontros de empresa e celebrações com menus das três cozinhas, bar central e uma equipe dedicada do início ao fim.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
              <Cta href="#formulario" variant="light" event="event_click" location="eventos_hero">Realizar meu evento</Cta>
              <Cta href="#espacos" variant="line">Ver espaços</Cta>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cal py-28 md:py-44">
        <div className="shell grid gap-x-6 gap-y-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <h2 className="display-l">Para cada ocasião, uma mesa à altura.</h2>
          </Reveal>
          <ul className="grid gap-x-12 sm:grid-cols-2 md:col-span-6 md:col-start-7">
            {eventTypes.map((e) => (
              <li key={e.name} className="border-b border-grafite/15 py-6">
                <p className="title">{e.name}</p>
                <p className="mt-2 text-[0.98rem] opacity-75">{e.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="espacos" className="bg-cal pb-28 md:pb-44">
        <div className="shell">
          <Reveal>
            <h2 className="display-l">Os espaços.</h2>
          </Reveal>
          <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-3 md:gap-6">
            {spaces.map((s, i) => (
              <article key={s.name} className={cn(i === 1 && "md:mt-28", i === 2 && "md:mt-12")}>
                <RevealMedia className="aspect-[3/4]" delay={i * 0.1}>
                  <Photo k={s.image} alt={s.name} sizes="(min-width: 768px) 31vw, 92vw" />
                </RevealMedia>
                <h3 className="title mt-6">{s.name}</h3>
                <p className="mt-2 max-w-[34ch] opacity-75">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-areia py-28 md:py-40">
        <div className="shell grid gap-x-6 gap-y-14 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <h2 className="display-l">Como funciona.</h2>
          </Reveal>
          <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2 md:col-span-7 md:col-start-6">
            {eventSteps.map((s, i) => (
              <li key={s.title}>
                <span className="font-serif text-[2.6rem] leading-none font-light opacity-40">{i + 1}</span>
                <p className="title mt-4">{s.title}</p>
                <p className="mt-2 max-w-[32ch] opacity-75">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="formulario" className="bg-oliva-fundo py-28 text-perola md:py-44">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="display-l">Vamos desenhar o seu evento.</h2>
            <p className="lede mt-7 max-w-[34ch] opacity-85">
              Respondemos com espaços, menus e valores. Se preferir, escreva para{" "}
              <a className="link-u" href={`mailto:${site.eventsEmail}`}>{site.eventsEmail}</a>.
            </p>
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
            <EventForm source="pagina_eventos" />
          </div>
        </div>
      </section>
    </>
  );
}
