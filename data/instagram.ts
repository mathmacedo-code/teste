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
  { id: "1", media_type: "IMAGE", image: "negroni", permalink: profile, caption: "Negroni da casa" },
  { id: "2", media_type: "IMAGE", image: "prato-polvo-risoni", permalink: profile, caption: "Risoni al polpo" },
  { id: "3", media_type: "VIDEO", image: "rose", permalink: profile, caption: "Fim de tarde com rosé" },
  { id: "4", media_type: "IMAGE", image: "luminarias", permalink: profile, caption: "Luminárias do salão" },
  { id: "5", media_type: "IMAGE", image: "plateau-cru", permalink: profile, caption: "Plateau do Cru" },
  { id: "6", media_type: "IMAGE", image: "mesa-longa", permalink: profile, caption: "Mesa posta para evento" },
  { id: "7", media_type: "IMAGE", image: "prato-burrata", permalink: profile, caption: "Burrata e azeite" },
  { id: "8", media_type: "VIDEO", image: "dj", permalink: profile, caption: "Sexta no Vila Medí" },
];
