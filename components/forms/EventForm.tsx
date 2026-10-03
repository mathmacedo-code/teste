"use client";

import { useState, type FormEvent } from "react";
import { eventFormOptions } from "@/data/events";
import { whatsappLink } from "@/data/site";
import { track } from "@/lib/analytics";
import { CtaButton } from "@/components/ui/Cta";
import { Field, Honeypot, SelectChevron, maskPhone } from "./fields";
import { submitLead } from "./submitLead";

type Status = "idle" | "sending" | "sent" | "error";

export function EventForm({ cta = "Quero realizar meu evento no Vila Medí", source = "eventos" }: { cta?: string; source?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [phone, setPhone] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const data = await submitLead("evento", e.currentTarget);
      track("event_lead_submit", { source, event_type: String(data.tipo || ""), guests: Number(data.convidados || 0) });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-6" role="status">
        <p className="display-m">Recebemos seu pedido.</p>
        <p className="lede mt-5 max-w-md opacity-85">
          A equipe de eventos do Vila Medí vai falar com você pelo WhatsApp com espaços, menus e valores.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-x-10 gap-y-8 md:grid-cols-2">
      <Honeypot />
      <Field label="Nome">
        <input className="field" name="nome" required autoComplete="name" minLength={2} />
      </Field>
      <Field label="WhatsApp">
        <input
          className="field" name="whatsapp" required inputMode="tel" autoComplete="tel"
          value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))}
          pattern="\(\d{2}\) \d{4,5}-\d{4}" title="Informe DDD e número"
        />
      </Field>
      <Field label="E-mail">
        <input className="field" name="email" type="email" required autoComplete="email" />
      </Field>
      <Field label="Data desejada">
        <input className="field" name="data" type="date" min={today} required />
      </Field>
      <Field label="Quantidade de convidados">
        <input className="field" name="convidados" type="number" min={2} max={600} inputMode="numeric" required />
      </Field>
      <Field label="Tipo de evento" className="relative">
        <select className="field" name="tipo" required defaultValue="">
          <option value="" disabled>Selecione</option>
          {eventFormOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <SelectChevron />
      </Field>
      <Field label="Mensagem" className="md:col-span-2">
        <textarea className="field min-h-24 resize-y" name="mensagem" rows={3} placeholder="Conte um pouco sobre a ocasião" />
      </Field>
      <div className="flex flex-col gap-5 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="meta max-w-sm opacity-70">Ao enviar, você concorda em ser contatado pela equipe do Vila Medí sobre este pedido.</p>
        <CtaButton type="submit" variant="light" disabled={status === "sending"}>
          {status === "sending" ? "Enviando…" : cta}
        </CtaButton>
      </div>
      {status === "error" && (
        <p className="meta md:col-span-2" role="alert">
          Não foi possível enviar agora. Tente de novo ou{" "}
          <a className="link-u" href={whatsappLink("Olá! Gostaria de fazer um evento no Vila Medí.")} target="_blank" rel="noopener noreferrer">
            fale com a equipe pelo WhatsApp
          </a>
          .
        </p>
      )}
    </form>
  );
}
