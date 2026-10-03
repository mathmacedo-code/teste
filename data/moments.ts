import type { ImageKey } from "./media";

/**
 * O Vila Medí ao longo do dia. A seção de momentos roda um dia inteiro:
 * o céu muda de cor, o sol e a lua cruzam o fundo e a foto de cada momento
 * aparece na sua hora (sections/home/Moments.tsx).
 */
export type Moment = {
  id: string;
  name: string;
  /** texto curto mostrado junto do nome */
  time: string;
  /** hora do dia em que o momento aparece na cena (0–24, frações = minutos) */
  hour: number;
  text: string;
  image: ImageKey;
  alt: string;
};

export const moments: Moment[] = [
  { id: "almoco", name: "Almoço", time: "a partir das 12h", hour: 12.5, text: "Luz do dia, mezze para dividir e uma taça de branco gelado.", image: "amb-almoco", alt: "Labneh com azeite e endro servido no almoço" },
  { id: "sunset", name: "Sunset", time: "fim de tarde", hour: 17.75, text: "Rosé no balde, a cidade lá fora e a conversa que se estende.", image: "amb-sunset", alt: "Rosé sendo servido de um balde de gelo" },
  { id: "privados", name: "Eventos privados", time: "sob consulta", hour: 19.25, text: "Uma mesa longa só sua, com menu desenhado para a ocasião.", image: "amb-privados", alt: "Mesa longa posta para um evento privado" },
  { id: "jantar", name: "Jantar", time: "à noite", hour: 20.5, text: "Mesas sob luminárias de palha e o salão no seu momento mais bonito.", image: "amb-jantar", alt: "Mesa posta sob luminária de palha" },
  { id: "drinks", name: "Drinks", time: "no bar central", hour: 22.25, text: "Clássicos bem feitos e coquetéis autorais servidos no balcão.", image: "amb-drinks", alt: "Drink sendo servido no bar central" },
  { id: "celebracoes", name: "Celebrações", time: "sexta e sábado", hour: 23.75, text: "Música, brindes e a noite que não tem pressa de acabar.", image: "amb-celebracoes", alt: "Convidados celebrando no salão" },
];
