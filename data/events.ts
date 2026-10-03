import type { VideoKey } from "./media";

export const eventTypes = [
  { name: "Eventos corporativos", text: "Almoços de negócios, lançamentos e jantares com clientes." },
  { name: "Aniversários", text: "Da mesa reservada ao salão inteiro, com bolo e brinde." },
  { name: "Confraternizações", text: "Fim de ano, equipes e reencontros, com menu compartilhado." },
  { name: "Celebrações", text: "Noivados, bodas e conquistas que pedem uma noite à altura." },
  { name: "Eventos de marca", text: "Ativações, imprensa e lançamentos em um cenário mediterrâneo." },
  { name: "Experiências privadas", text: "Jantares harmonizados e menus exclusivos das três cozinhas." },
];

export const eventFormOptions = [...eventTypes.map((e) => e.name), "Outro"];

export const spaces: { name: string; text: string; video: VideoKey }[] = [
  { name: "Salão principal", text: "Arcos, pedra e janelões. Ideal para eventos com a casa toda.", video: "heroMobile" },
  { name: "Mesas longas", text: "Jantares sentados sob as luminárias de palha, para grupos.", video: "noite" },
  { name: "Bar central", text: "Coquetel em pé, música e o balcão como ponto de encontro.", video: "cru" },
];

export const eventSteps = [
  { title: "Conte sua ideia", text: "Data, número de convidados e o clima que você imagina." },
  { title: "Receba a proposta", text: "Nossa equipe de eventos responde com espaços, menus e valores." },
  { title: "Desenhe o menu", text: "Escolha entre as três cozinhas, bar e harmonização." },
  { title: "Celebre", text: "No dia, você recebe. Nós cuidamos do resto." },
];
