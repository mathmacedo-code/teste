# Vila Medí — site institucional + landing pages

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Framer Motion · TypeScript

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Deploy recomendado: **Vercel** (otimização de imagens AVIF/WebP e a rota `/api/leads` funcionam sem configuração).
Copie `.env.example` para `.env.local` e preencha o que for usar.

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Home: hero em vídeo, três casas, experiência, pratos, momentos, seção cinematográfica, eventos, prova social, Instagram, localização |
| `/temperani-amalfi` · `/miimar` · `/cru-oyster-bar` | Páginas das casas (mesmo template, temas próprios: cal, branco egeu, noite) |
| `/gastronomia` | Três cozinhas, pratos, bar e vinhos, cardápio completo |
| `/eventos` | Tipos de evento, espaços, como funciona, formulário |
| `/reservas` | Formulário de reserva (aceita `?casa=Temperani%20Amalfi`) |
| `/lp/jantar` · `/lp/almoco` · `/lp/eventos` · `/lp/temperani` · `/lp/miimar` · `/lp/cru` | Landing pages de mídia paga (noindex, navegação mínima) |

> As LPs ficam em `/lp/*` porque `/eventos` e `/miimar` já são páginas institucionais.
> **Nova campanha:** adicione um objeto em `data/landing-pages.ts` — a página é gerada automaticamente.

## Estrutura

```
app/            rotas, layouts, API (/api/leads), sitemap, robots, OG image, ícone
components/     brand (logo), ui (vídeo, imagem, animações, CTA, painel), layout, forms, menu, overlays, analytics, seo
sections/       home/*, restaurant/RestaurantPage, lp/LandingPage, shared/DishRow
data/           TODO o conteúdo editável: site, casas, pratos, cardápio, momentos, eventos, depoimentos, Instagram, LPs, mídia
lib/            analytics (dataLayer + Meta Pixel), utm (atribuição), schema.org, metadata
assets/         fontes (auto-hospedadas) e fotos-mestre (JPG → AVIF/WebP via next/image)
public/         brand (SVGs do logo), media/video (MP4), media/poster (WebP)
scripts/media/  pipeline de vídeo/foto (ffmpeg + OpenCV)
```

## Conversão e rastreamento

Eventos enviados ao `dataLayer` (GTM/GA4) e mapeados no Meta Pixel:

| Evento | Quando | Meta Pixel |
|---|---|---|
| `reserve_click` | clique em qualquer "Reservar" (com `location`) | InitiateCheckout |
| `reservation_submit` | pedido de reserva enviado | Schedule |
| `event_click` | abertura do formulário de eventos | — |
| `event_lead_submit` | pedido de evento enviado | Lead |
| `menu_open` | cardápio aberto | — |
| `directions_click` | "Como chegar" | FindLocation |

UTMs, `fbclid` e `gclid` da primeira página da sessão são anexados a todo lead.

### Integração com CRM

`POST /api/leads` valida, filtra spam (honeypot) e repassa para `LEAD_WEBHOOK_URL` (RD Station, HubSpot, Kommo, Make, Zapier, n8n…):

```json
{
  "type": "reserva | evento",
  "receivedAt": "2026-10-03T18:00:00.000Z",
  "nome": "…", "whatsapp": "+5511…", "email": "…",
  "data": "2026-10-20", "horario": "20:30", "pessoas": 4, "casa": "Cru Oyster Bar",
  "convidados": 40, "tipo": "Aniversários", "mensagem": "…",
  "page": "/lp/jantar",
  "attribution": { "utm_source": "meta", "utm_campaign": "…", "fbclid": "…", "landing_page": "/lp/jantar" }
}
```

## Mídia

Os vídeos enviados são reels verticais (720×1280). Por isso:

- **Hero desktop** = tríptico 16:9 com três vídeos verticais lado a lado, trocando de cena em onda (sem esticar/borrar).
- **Hero mobile** = vídeo vertical nativo.
- Câmera lenta com interpolação de movimento, dissolves de 0,8 s e loop sem emenda.
- Cada vídeo em **MP4 (H.264)**, sem áudio, com poster WebP. O `AmbientVideo` foi feito para celular: só MP4, `<source>` já no HTML (o navegador escolhe a versão mobile pelo `media`), vídeo sempre visível com o poster por cima, e — se o sistema bloquear o autoplay (ex.: Modo de Pouca Energia do iPhone) — o primeiro toque na página libera todos os vídeos. Os vídeos e efeitos rodam mesmo com "reduzir movimento" ligado no aparelho (pedido da casa).

### Música

Botão de som no canto inferior esquerdo (`components/layout/SoundToggle.tsx`). Navegadores não deixam som tocar sozinho: a trilha começa no toque, com fade, em loop, e continua ao trocar de página.
Coloque o arquivo em `public/media/audio/trilha.mp3`; título/artista em `data/soundtrack.ts`. Sem o arquivo, o botão não aparece. Use só faixas com licença de uso comercial.

### Fotos e elementos visuais

- **Só fotos de verdade** (`assets/images`): os frames tirados dos vídeos foram removidos.
- `recorte-*.png`: os pratos sem fundo, usados como elementos gráficos (`components/ui/Cutout`) — giram e flutuam com o scroll.
- `DishMarquee`: faixa infinita com nomes de pratos e mini-pratos girando; acelera e inverte com o scroll.
- `Seal`: selo circular com o emblema; `CandleGlow`: luz de vela animada em CSS; `SkyScene`: céu, astro e mar que mudam com o momento do dia.
- Para novos recortes: foto do prato **de cima**, prato inteiro no quadro, fundo liso e contrastante.

Pontos de corte usados (arquivo `scripts/media/build_media.py`):

| Uso | Fonte | Trechos (s) |
|---|---|---|
| Hero (tríptico + mobile) | reel noturno | fachada 0,05–1,50 · luminárias 4,43–5,57 · rosé 5,70–6,97 · mesa de palha 28,03–29,20 · franjas 29,33–30,47 · mesa longa 33,17–34,80 · drink 36,13–37,60 · negroni 37,73–39,10 · salão 42,97–44,00 |
| Forno (Temperani / Experiência) | reel do forno | 2,05–3,55 · 7,00–9,60 · 11,62–12,80 · 12,87–14,12 |
| Cinematográfica (arco) | reel noturno | bartender 1,70–3,20 · janela 30,57–31,47 · DJ 9,77–10,77 · bar 39,23–40,87 |
| Cru | reel noturno | ostras 17,33–18,97 · drink · negroni |
| MII Mar | reel noturno | grelha 31,57–33,03 · frutos do mar 34,93–36,03 · salão |
| Descartado | reel noturno | 13–17 s e 19–26 s (festa tremida, luz azul estourada) |

Para regerar após trocar os arquivos em `media-src/` (noite.mp4, forno.mp4, pratos.mp4): `npm run media`.
**Recomendação:** uma diária de captação horizontal (4K, luz do dia e pôr do sol) substitui o tríptico e melhora almoço/sunset, hoje ilustrados com material noturno.

## ⚠️ Antes de publicar (marcado como `CONFIRMAR` no código)

- `data/site.ts`: WhatsApp, telefone, e-mails, CEP, coordenadas, horários exatos, domínio, URL da plataforma de reservas (se houver).
- `data/testimonials.ts`: substituir pelos depoimentos reais (os atuais são provisórios).
- `data/dishes.ts` e `data/menu.ts`: nomes marcados `(imprensa)` vêm de matérias; os demais foram nomeados a partir das imagens ou são exemplos — validar com a cozinha.
- `app/(site)/politica-de-privacidade`: texto-base, revisar com o jurídico.
- Nome do chef do Temperani (a página mostra "A brigada" até a confirmação).
