/**
 * O Vila Medí ao longo do dia. A seção de momentos roda um dia inteiro
 * (sections/home/DayScene.tsx): o sol e a lua cruzam o céu e cada momento
 * aparece na sua hora.
 */
export type Moment = {
  id: string;
  name: string;
  /** texto curto mostrado junto do nome */
  time: string;
  /** hora do dia em que o momento aparece na cena (0–24, frações = minutos) */
  hour: number;
  text: string;
};

export const moments: Moment[] = [
  { id: "almoco", name: "Almoço", time: "a partir das 12h", hour: 12.5, text: "Luz do dia, mezze para dividir e uma taça de branco gelado." },
  { id: "sunset", name: "Sunset", time: "fim de tarde", hour: 17.75, text: "Rosé no balde, a cidade lá fora e a conversa que se estende." },
  { id: "privados", name: "Eventos privados", time: "sob consulta", hour: 19.25, text: "Uma mesa longa só sua, com menu desenhado para a ocasião." },
  { id: "jantar", name: "Jantar", time: "à noite", hour: 20.5, text: "Mesas sob luminárias de palha e o salão no seu momento mais bonito." },
  { id: "drinks", name: "Drinks", time: "no bar central", hour: 22.25, text: "Clássicos bem feitos e coquetéis autorais servidos no balcão." },
  { id: "celebracoes", name: "Celebrações", time: "sexta e sábado", hour: 23.75, text: "Música, brindes e a noite que não tem pressa de acabar." },
];
