import type { ImageKey } from "./media";

/**
 * Estrutura espelhando a Instagram Graph API (/me/media):
 * id, media_type, media_url, permalink, caption.
 * Para integrar: buscar no servidor (revalidate) e mapear para este formato.
 */
export type InstaPost = {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  image: ImageKey; // em produção: media_url
  permalink: string;
  caption: string;
};

const profile = "https://www.instagram.com/vilamedicj/";

export const instagramPosts: InstaPost[] = [
  { id: "1", media_type: "IMAGE", image: "plateau-cru", permalink: profile, caption: "Plateau do Cru" },
  { id: "2", media_type: "IMAGE", image: "prato-polvo-risoni", permalink: profile, caption: "Orzo com polvo" },
  { id: "3", media_type: "IMAGE", image: "prato-burrata-topo", permalink: profile, caption: "Burrata, tomate confit e pesto" },
  { id: "4", media_type: "IMAGE", image: "prato-peixe-cru", permalink: profile, caption: "Peixe do dia em sashimi" },
  { id: "5", media_type: "IMAGE", image: "prato-burrata", permalink: profile, caption: "Burrata e azeite" },
];
