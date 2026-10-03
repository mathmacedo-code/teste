import type { ImageKey } from "./media";

export type Moment = { id: string; name: string; time: string; text: string; image: ImageKey; alt: string };

export const moments: Moment[] = [
  { id: "almoco", name: "Almoço", time: "a partir das 12h", text: "Luz do dia, mezze para dividir e uma taça de branco gelado.", image: "prato-labneh", alt: "Labneh com azeite servido no almoço" },
  { id: "sunset", name: "Sunset", time: "fim de tarde", text: "Rosé no balde, a cidade lá fora e a conversa que se estende.", image: "rose", alt: "Convidada servindo rosé de um balde de gelo" },
  { id: "jantar", name: "Jantar", time: "à noite", text: "Mesas sob luminárias de palha e o salão no seu momento mais bonito.", image: "mesa-palha", alt: "Mesa posta sob luminária de palha" },
  { id: "drinks", name: "Drinks", time: "no bar central", text: "Clássicos bem feitos e coquetéis autorais servidos no balcão.", image: "drink", alt: "Drink sendo servido no bar" },
  { id: "celebracoes", name: "Celebrações", time: "sexta e sábado", text: "Música, brindes e a noite que não tem pressa de acabar.", image: "celebracao", alt: "Convidados celebrando no salão" },
  { id: "privados", name: "Eventos privados", time: "sob consulta", text: "Uma mesa longa só sua, com menu desenhado para a ocasião.", image: "mesa-longa", alt: "Mesa longa posta para evento privado" },
];
