import { Cta } from "@/components/ui/Cta";
import { Reveal } from "@/components/ui/Motion";
import { site, whatsappLink } from "@/data/site";

export function Location() {
  return (
    <section id="localizacao" className="bg-areia py-28 md:py-40">
      <div className="shell grid gap-x-6 gap-y-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <h2 className="display-l max-w-[12ch]">No coração do Cidade Jardim.</h2>
          </Reveal>
          <dl className="mt-12 grid gap-x-10 gap-y-9 text-[1rem] sm:grid-cols-2">
            <div>
              <dt className="meta opacity-60">Endereço</dt>
              <dd className="mt-2">
                {site.address.venue}, {site.address.floor}
                <br />
                {site.address.street}
                <br />
                {site.address.city} - {site.address.state}
              </dd>
            </div>
            <div>
              <dt className="meta opacity-60">Horário</dt>
              <dd className="mt-2">
                {site.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.time}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="meta opacity-60">Estacionamento</dt>
              <dd className="mt-2">{site.parking}</dd>
            </div>
            <div>
              <dt className="meta opacity-60">Contato</dt>
              <dd className="mt-2">
                <a className="link-u" href={whatsappLink("Olá! Vim pelo site do Vila Medí.")} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
                <br />
                <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
                <br />
                <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">{site.instagram.handle}</a>
              </dd>
            </div>
          </dl>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Cta href={site.directionsUrl} external event="directions_click" location="home">Como chegar</Cta>
            <Cta href="/reservas" variant="line" event="reserve_click" location="localizacao">Reservar uma mesa</Cta>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-pedra/30 md:col-span-6 md:col-start-7 md:aspect-auto md:min-h-[600px]">
          <iframe
            src={site.mapEmbedUrl}
            title="Mapa: Vila Medí no Shopping Cidade Jardim"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_sepia(0.22)_contrast(0.94)]"
          />
        </div>
      </div>
    </section>
  );
}
