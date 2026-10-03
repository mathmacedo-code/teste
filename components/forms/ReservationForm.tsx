"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { HOUSES, site, whatsappLink } from "@/data/site";
import { track } from "@/lib/analytics";
import { CtaButton } from "@/components/ui/Cta";
import { Field, Honeypot, SelectChevron, maskPhone } from "./fields";
import { submitLead } from "./submitLead";

type Status = "idle" | "sending" | "sent" | "error";

const TIMES = Array.from({ length: 21 }, (_, i) => {
  const m = 12 * 60 + i * 30;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${m % 60 === 0 ? "00" : "30"}`;
});

export function ReservationForm({
  defaultHouse, cta = "Solicitar reserva", source = "reservas", tone = "light",
}: { defaultHouse?: string; cta?: string; source?: string; tone?: "light" | "dark" }) {
  const [status, setStatus] = useState<Status>("idle");
  const [phone, setPhone] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const data = await submitLead("reserva", e.currentTarget);
      track("reservation_submit", { source, house: String(data.casa || ""), guests: Number(data.pessoas || 0) });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-4" role="status">
        <p className="display-m">Pedido de reserva enviado.</p>
        <p className="lede mt-5 max-w-md opacity-85">Confirmamos a sua mesa pelo WhatsApp. Até breve no Vila Medí.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid grid-cols-2 gap-x-8 gap-y-8">
      <Honeypot />
      <Field label="Casa" className="relative col-span-2">
        <select className="field" name="casa" defaultValue={defaultHouse || HOUSES[0]}>
          {HOUSES.map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
        <SelectChevron />
      </Field>
      <Field label="Data" className="col-span-2 sm:col-span-1">
        <input className="field" type="date" name="data" min={today} required />
      </Field>
      <Field label="Horário" className="relative col-span-1">
        <select className="field" name="horario" required defaultValue="">
          <option value="" disabled>Selecione</option>
          {TIMES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <SelectChevron />
      </Field>
      <Field label="Pessoas" className="relative col-span-1">
        <select className="field" name="pessoas" required defaultValue="2">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "pessoa" : "pessoas"}
            </option>
          ))}
        </select>
        <SelectChevron />
      </Field>
      <Field label="Nome" className="col-span-2 sm:col-span-1">
        <input className="field" name="nome" required autoComplete="name" minLength={2} />
      </Field>
      <Field label="WhatsApp" className="col-span-2 sm:col-span-1">
        <input
          className="field" name="whatsapp" required inputMode="tel" autoComplete="tel"
          value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))}
          pattern="\(\d{2}\) \d{4,5}-\d{4}" title="Informe DDD e número"
        />
      </Field>
      <Field label="Ocasião ou observações (opcional)" className="col-span-2">
        <input className="field" name="observacoes" placeholder="Aniversário, restrição alimentar, mesa no salão…" />
      </Field>
      <div className="col-span-2 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="meta max-w-xs opacity-70">
          Grupos acima de 12 pessoas: <Link href="/eventos" className="link-u">fale com eventos</Link>.
        </p>
        <CtaButton type="submit" variant={tone === "dark" ? "light" : "solid"} disabled={status === "sending"}>
          {status === "sending" ? "Enviando…" : cta}
        </CtaButton>
      </div>
      {status === "error" && (
        <p className="meta col-span-2" role="alert">
          Não foi possível enviar agora. Tente de novo ou{" "}
          <a className="link-u" href={whatsappLink("Olá! Gostaria de reservar uma mesa no Vila Medí.")} target="_blank" rel="noopener noreferrer">
            reserve pelo WhatsApp
          </a>
          .
        </p>
      )}
      {site.reservationProviderUrl && (
        <p className="meta col-span-2 opacity-75">
          Prefere reservar online?{" "}
          <a className="link-u" href={site.reservationProviderUrl} target="_blank" rel="noopener noreferrer">Ver horários disponíveis</a>
        </p>
      )}
    </form>
  );
}
