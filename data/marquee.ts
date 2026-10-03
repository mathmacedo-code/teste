import type { MarqueeItem } from "@/components/ui/DishMarquee";
import type { RestaurantSlug } from "./restaurants";

/** Faixa de pratos da home: nomes do cardápio, com os pratos recortados como separadores. */
export const signatureMarquee: MarqueeItem[] = [
  { name: "Burrata con pomodorini", k: "recorte-burrata" },
  { name: "Ostras frescas" },
  { name: "Orzo com polvo", k: "recorte-risoni" },
  { name: "Gnocchi alla Sorrentina" },
  { name: "Peixe do dia em sashimi", k: "recorte-peixe" },
  { name: "Moussaka" },
  { name: "Plateau Cru", k: "recorte-burrata" },
  { name: "Lobster X.O." },
];

/** Faixa de cada casa (páginas das casas). */
export const houseMarquee: Record<RestaurantSlug, MarqueeItem[]> = {
  temperani: [
    { name: "Burrata con pomodorini", k: "recorte-burrata" },
    { name: "Gnocchi alla Sorrentina" },
    { name: "Pappardelle al ragù", k: "recorte-burrata" },
    { name: "Linguine alle vongole" },
    { name: "Pizza Amalfi", k: "recorte-burrata" },
    { name: "Cubos de lasanha" },
  ],
  miimar: [
    { name: "Orzo com polvo", k: "recorte-risoni" },
    { name: "Moussaka" },
    { name: "Polvo grelhado", k: "recorte-risoni" },
    { name: "Labneh" },
    { name: "Couscous aux fruits de mer", k: "recorte-risoni" },
    { name: "Roz a djej" },
  ],
  cru: [
    { name: "Peixe do dia em sashimi", k: "recorte-peixe" },
    { name: "Ostras frescas" },
    { name: "Plateau Cru", k: "recorte-peixe" },
    { name: "Tuna tartare" },
    { name: "Lobster X.O.", k: "recorte-peixe" },
    { name: "Ostra grelhada" },
  ],
};
