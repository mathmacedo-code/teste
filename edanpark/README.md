# Edan Park — site do polo industrial e logístico

Reconstrução do site do **Edan Park** (Estiva · MG) pensada para **carregar rápido**: HTML/CSS/JS puros, sem framework, sem
biblioteca de animação, sem fonte de ícones, sem scripts de terceiros. Cada aba é uma página estática.

> Está numa subpasta (`edanpark/`) porque a raiz deste repositório tem outro projeto (Vila Medí, em Next.js), que não foi alterado.

## Rodar

```bash
cd edanpark
npm install          # só o esbuild (empacotador de CSS/JS)
npm run dev          # http://localhost:4173 — reconstrói ao salvar
npm run build        # gera dist/ (é o que se publica)
npm run build:preview  # gera dist-preview/: versão com caminhos relativos, abre por duplo clique em index.html (sem servidor)
```

## Identidade visual

Baseada no logotipo oficial (azul-petróleo `#2a3447`, laranja `#c35007`, fundo branco; fonte Montserrat, a mesma da tagline).
O logo virou layout, não só marca no canto:

- **Recorte em "telhado"** (`--roof` no CSS): fotos, vídeo e blocos têm o topo cortado nos mesmos ângulos do telhado do logo.
- **Linha laranja que cruza** a imagem, como no logo (`frameLines()` em `src/lib/logo.mjs`), e o **ícone do galpão "desenhando"** no
  fundo das abas e da chamada final (`logoIcon()`).
- **Nome vetorizado** (`logoWord()`): o azul segue a cor do texto (branco no rodapé) e o **E** é sempre laranja.
- Sem brilhos, vidro, degradês ou partículas; cantos retos, linhas finas e grade de projeto ao fundo.
- Para trocar o logo por um SVG oficial, edite `src/lib/logo.mjs` e `public/brand/favicon.svg`.

## Arquivo único (`index.html` e pronto)

`npm run build:single` gera **`dist-single/index.html`**: um só arquivo com tudo dentro (CSS, JS, fontes, imagens, vídeo e as
6 abas, trocadas pelo endereço: `#empreendimento`, `#tour`…). É só subir esse arquivo na hospedagem.

- ~1,0 MB (≈ 0,8 MB com gzip). A ordem do arquivo foi pensada para a página funcionar enquanto o resto ainda chega:
  CSS + fonte → cabeçalho e abas (poster do hero já embutido) → **JS** (menu e abas já respondem) → fotos, uma a uma → vídeo (por último).
- Usa versões leves do vídeo (432×768, ~0,4 MB) e das fotos do tour (~45 KB cada); o vídeo é decodificado do próprio HTML.
- Medido em 4G lento simulado (1,6 Mbps, 150 ms, CPU 4× mais lenta): 1º paint em ~0,5 s, abas e menu respondendo em ~1 s,
  fotos do tour prontas em ~1,9 s e vídeo tocando em ~4,2 s (antes: abas só aos ~7 s, porque o JS ficava depois do vídeo).
  Em 4G bom: 0,2 s / 0,5 s / 0,5 s / 1,0 s.
- Sem `og:image` (link de pré-visualização no WhatsApp/redes não terá imagem) nem `sitemap`: não há como referenciar arquivos externos.
- Para a **melhor performance** em celular, prefira o site em várias páginas (`npm run build`): o primeiro carregamento
  é ~140 KB e o vídeo vem depois. No Lighthouse (celular simulado) o arquivo único marca ~60 porque o simulador
  conta o download inteiro antes do primeiro paint; na prática a página aparece em ~150 ms.
- As fotos leves, o poster e o vídeo leve ficam em `single/` (gerados por `npm run media`).

## Abas (e onde editar)

| Aba | Rota | Arquivo |
|---|---|---|
| Início | `/` | `src/pages/index.mjs` |
| Empreendimento | `/empreendimento/` | `src/pages/empreendimento.mjs` |
| Infraestrutura | `/infraestrutura/` | `src/pages/infraestrutura.mjs` |
| Localização | `/localizacao/` | `src/pages/localizacao.mjs` |
| **Tour 360°** | `/tour-360/` | `src/pages/tour-360.mjs` · `src/data/tour.mjs` |
| Contato | `/contato/` | `src/pages/contato.mjs` |

**Textos, números, lista de abas, contatos e coordenadas ficam em `src/data/site.mjs`** (um só lugar). Para renomear/reordenar
uma aba, edite `nav` ali.

## Por que carrega rápido

| | |
|---|---|
| CSS | ~8 KB gzip (todas as abas) + 3 KB só no tour |
| JS | 1,5 KB (comum) + 0,3–3 KB por aba, módulos ES sem dependências |
| Fontes | 1 arquivo `woff2` (Montserrat variável, ~38 KB), com *preload* |
| Início (celular), 1ª carga | ~140 KB: HTML + CSS + JS + fontes + poster do hero |
| Vídeo do hero | **só começa a baixar depois do evento `load`**; celular recebe a versão de 1,3 MB, desktop a de 2,6 MB (original: 6,2 MB com áudio) |
| LCP | é o *poster* (WebP, com `preload` e `fetchpriority=high`); o hero **não depende de JS** para aparecer |
| Economia de dados | com `saveData`/2G ou "reduzir movimento" o vídeo não é baixado; há um botão de reproduzir |
| Mapa | iframe só carrega se a pessoa clicar |
| Imagens do tour / infraestrutura | só a 1ª vem no HTML; as outras baixam ~2,5 s depois do `load` (e na hora, se você navegar antes) — o peso inicial dessas abas caiu de ~570 para ~280 KiB |
| Navegação | `prefetch` das outras abas ao passar o mouse/tocar + transições entre páginas (View Transitions) |
| Cache | `assets/*`, `media/*` e `fonts/*` com `Cache-Control: immutable` (arquivos com *hash* no nome) |

### Medido (Lighthouse 12, celular simulado: 4G lenta + CPU 4× mais lenta, servidor local com gzip)

| Aba | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | Peso inicial |
|---|---|---|---|---|---|---|
| Início | 100 | 100 | 100 | 100 | 1,8 s | 140 KiB |
| Empreendimento | 100 | 100 | 100 | 100 | 1,4 s | 73 KiB |
| Infraestrutura | 97 | 100 | 100 | 100 | 2,6 s | 286 KiB |
| Localização | 100 | 100 | 100 | 100 | 1,4 s | 72 KiB |
| Tour 360° | 98 | 100 | 100 | 100 | 2,3 s | 279 KiB |
| Contato | 100 | 100 | 100 | 100 | 1,4 s | 73 KiB |

TBT ≤ 9 ms e CLS ≈ 0 em todas. Em Chrome sem simulação o hero pinta em ~150 ms. axe-core: 0 violações (6 abas × celular/desktop).
São números de laboratório; na hospedagem real variam com rede, CDN e compressão (use Brotli/gzip). Para repetir:
`npx lighthouse http://localhost:4173/ --only-categories=performance,accessibility,best-practices,seo` com `npm run start` rodando.

## Mapa de lotes (Início)

Seção `#lotes` da página inicial (no lugar do carrossel de fotos): planta 2D e vista 3D do empreendimento com os 13 lotes
clicáveis, no estilo do site antigo.

- **Clique num lote** (no mapa ou na lista) para ampliar, ver quadra, tamanho relativo e o botão *Quero este lote*, que abre o
  contato já com o lote escolhido na mensagem (`?lote=B02`).
- **Planta 2D / Vista 3D**: duas imagens do empreendimento com contornos próprios; a seleção se mantém ao trocar.
- **Fazer o percurso**: um marcador percorre as vias internas, da entrada da Edan até a última quadra, e a câmera vai parando
  em cada lote (~55 s; pausa, avança e volta pelas setas; `Esc` volta ao mapa inteiro). Com "reduzir movimento" a câmera não desliza.
- Pelo teclado/leitor de tela, use a **lista de lotes** ao lado (as etiquetas sobre a imagem são só visuais).
- A planta só baixa quando o mapa chega perto da tela; a vista 3D, quando a pessoa passa o mouse/foco no botão ou a escolhe
  (~110 KB cada). Nada disso pesa na 1ª carga da Início.

**Dados:** `src/data/lotes.mjs` (contornos em pixels das imagens `public/media/lotes/lotes-plan.webp` e `lotes-3d.webp`,
caminho do percurso e posição das etiquetas). Para ajustar um lote, edite os pontos `plan` / `p3d`. **Preencha `area`**
(m² de cada lote) quando tiver: o cartão passa a mostrar o valor em vez de "Sob consulta". A numeração (quadras A/B/C, lotes
01–08 e 14) segue a imagem do site atual; se ela mudar, edite `id`, `q` e `n`.
Marcação em `src/lib/lotmap.mjs`, estilos em `src/css/lotmap.css`, comportamento em `src/js/lotmap.js`.

## Hero em vídeo

`public/media/hero.mp4` (desktop) e `hero-sm.mp4` (celular), gerados do reel original **sem áudio**, com um dissolve embutido
entre o fim e o começo (o loop não tem corte). O vídeo pausa fora da tela, com a aba em segundo plano e pelo botão. No
desktop, a cor do vídeo "vaza" para o fundo (um canvas de 48 px + blur em CSS, bem leve).

Para regerar a mídia (precisa de `ffmpeg`): coloque o reel em `media-src/reel-original.mp4` e rode `npm run media`.
O original não é versionado. Os recortes de tempo estão em `scripts/media.sh`.

## Tour 360°

Você fica no centro de uma cúpula ao entardecer; as 5 paradas ficam num arco ao seu redor, como num panorama, e depois da
última o giro de 360° termina num cartão de contato.

- **Arrastar** gira (inércia + encaixe na parada); setas do teclado; trackpad horizontal; giroscópio no celular.
- **Entrar na cena** avança a câmera até a foto e mostra os *hotspots* (rótulos). **Tour guiado** faz isso sozinho.
- **Mapa do tour** (canto superior direito): visão de cima da cúpula com um ponto numerado por parada (clique para ir até ela) e o cone mostrando para onde você olha. Também há bolinhas no cartão e tela cheia.
- Tudo em CSS 3D (sem WebGL, sem biblioteca) e o laço de animação para sozinho quando nada se move.

### Usar uma imagem 360° de verdade

As paradas hoje são quadros do vídeo aéreo (fotos verticais). Se houver uma foto 360° do empreendimento
(JPG equirretangular, proporção 2:1, ex.: 8192×4096):

1. Copie para `public/media/tour/panorama.jpg`.
2. Em `src/data/tour.mjs` use `panorama: { src: "/media/tour/panorama.jpg" }`.

Ela passa a ser o cenário que gira atrás das paradas. **Para testar sem editar nada:** abra `/tour-360/#preview` e **arraste
a imagem** para a página.

Para trocar/adicionar paradas, edite `scenes` em `src/data/tour.mjs` (imagem 9:16, texto e *hotspots* em % da foto) e gere o
halo de cada uma em `scripts/media.sh` (funções `scene` e `aura`).

## Contato / formulário

O site é estático. O formulário envia para o `formEndpoint` (Formspree, Netlify Forms, Make, n8n…) se houver; senão abre o
**WhatsApp** ou o **e-mail** já com a mensagem pronta. Preencha `contact` em `src/data/site.mjs`. Enquanto estiver vazio,
o formulário avisa que os canais ainda não foram configurados (e o build lista a pendência).

## Publicar

`npm run build` e publique a pasta `dist/` em qualquer hospedagem estática (Vercel, Netlify, Cloudflare Pages, S3/CloudFront…).

- **Vercel:** *Root Directory* = `edanpark`; o `vercel.json` já define build, saída e cache.
- **Netlify / Cloudflare Pages:** build `npm run build`, pasta `dist`; o arquivo `_headers` já vai em `dist/`.
- Domínio: defina `SITE_URL` no build (`SITE_URL=https://edanpark.com.br npm run build`) para o canonical, OG e sitemap.

## ⚠️ Antes de publicar (marcado como CONFIRMAR em `src/data/site.mjs`)

- **Abas e textos:** a estrutura foi montada sem acesso ao site original (o domínio estava bloqueado no ambiente de desenvolvimento).
  Confira nomes/ordem das abas e o conteúdo.
- **Números** (13 lotes, 5–35 mil m², R$ 20 mi, ~750 empregos, R$ 60 mi/+200 do CD Edan): vieram de reportagem pública.
- **Andamento da obra** e descrições de infraestrutura: baseados no que aparece no vídeo.
- **Contato** (WhatsApp, e-mail, telefone, endereço) e **coordenadas exatas** (hoje, centro de Estiva).
- **Logotipo:** o ícone foi redesenhado a partir do cartão final do vídeo; troque pelo arquivo oficial (`src/lib/ui.mjs` e
  `public/brand/favicon.svg`).
- Uso da música: o vídeo vem sem áudio de propósito (trilha de reel pode não ter licença para site).

## Estrutura

```
src/data/        conteúdo editável (site.mjs, tour.mjs, lotes.mjs)
src/pages/       uma página por aba (módulos que devolvem HTML)
src/layout.mjs   <head>, SEO, cabeçalho, rodapé
src/css/         main.css (todas as abas) · tour.css (só no tour)
src/js/          main.js (comum) + um arquivo por aba
scripts/         build.mjs · dev.mjs · media.sh
public/          vídeo, imagens, fontes, favicon (copiado para dist/)
```
