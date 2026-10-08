#!/usr/bin/env bash
# Gera toda a mídia otimizada do site a partir do reel original (media-src/reel-original.mp4).
#   npm run media
# Requer ffmpeg (com libx264 e libwebp). O original NÃO é versionado (6 MB) — coloque-o em media-src/.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="media-src/reel-original.mp4"
OUT="public/media"
[ -f "$SRC" ] || { echo "Falta $SRC (o reel original do Edan Park)"; exit 1; }
mkdir -p "$OUT/tour"

# --- Hero: trecho limpo (0,5s–19,5s: sem o fade-in preto nem o cartão final), SEM áudio,
#     com dissolve embutido entre o fim e o começo => o loop não tem corte seco.
D=0.9   # duração do dissolve (s)
FILTER="[0:v]split=3[a][b][c];
[a]trim=1.4:18.6,setpts=PTS-STARTPTS[m];
[b]trim=18.6:19.5,setpts=PTS-STARTPTS[t];
[c]trim=0.5:1.4,setpts=PTS-STARTPTS[h];
[t][h]xfade=transition=fade:duration=$D:offset=0[x];
[m][x]concat=n=2:v=1:a=0[v]"

encode() { # nome largura altura crf
  ffmpeg -v error -y -i "$SRC" -filter_complex "$FILTER;[v]fps=30,scale=$2:$3:flags=lanczos[o]" -map "[o]" \
    -an -c:v libx264 -preset slow -crf "$4" -profile:v high -level 4.0 -pix_fmt yuv420p \
    -g 60 -movflags +faststart "$OUT/$1.mp4"
}
# 720x1280 é a resolução do reel original: alta qualidade (30 fps) nos dois; o do celular só usa um crf maior
encode hero 720 1280 27      # desktop / telas grandes (~4 MB)
encode hero-sm 720 1280 30   # celular e arquivo único (~3 MB)

# --- Poster do hero = 1º quadro do vídeo (evita "salto" quando o vídeo começa) + miniatura p/ blur-up
ffmpeg -v error -y -ss 1.4 -i "$SRC" -frames:v 1 -vf "scale=720:1280:flags=lanczos" -c:v libwebp -quality 74 -compression_level 6 "$OUT/hero-poster.webp"

# --- Cenas do tour 360° (quadros limpos, sem legendas gravadas) — nome:tempo(s)
scene() { ffmpeg -v error -y -ss "$2" -i "$SRC" -frames:v 1 -vf "scale=720:1280:flags=lanczos" -c:v libwebp -quality 74 -compression_level 6 "$OUT/tour/$1.webp"; }
scene fachada 1.4
scene visao-geral 5.8
scene heliponto 3.5
scene galpao 12.2
scene modulos 17.7

# Miniaturas desfocadas (~0,5 KB cada): viram a "atmosfera" em volta de cada cena no tour 360°
bg() { ffmpeg -v error -y -ss "$2" -i "$SRC" -frames:v 1 -vf "scale=36:64:flags=area,gblur=sigma=1.4" -c:v libwebp -quality 55 "$OUT/tour/$1-bg.webp"; }
bg fachada 1.4
bg visao-geral 5.8
bg heliponto 3.5
bg galpao 12.2
bg modulos 17.7

# Halo do tour 360°: miniatura desfocada, saturada e com máscara radial já "assada" no canal alfa
# (assim o navegador não precisa de blur/máscara em camadas gigantes durante o giro 3D)
aura() { ffmpeg -v error -y -ss "$2" -i "$SRC" -frames:v 1 -vf "scale=40:70:flags=area,gblur=sigma=1.3,eq=saturation=1.55:brightness=-0.02,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*pow(max(0,1-hypot((X-W/2)/(W/2),(Y-H/2)/(H/2))),1.15)'" -c:v libwebp -quality 62 -pix_fmt yuva420p "$OUT/tour/$1-aura.webp"; }
aura fachada 1.4
aura visao-geral 5.8
aura heliponto 3.5
aura galpao 12.2
aura modulos 17.7

# Versão leve (432x768) das fotos para o arquivo único (npm run build:single): tudo vai dentro do HTML, então cada KB conta
mkdir -p single/lite
lite() { ffmpeg -v error -y -ss "$2" -i "$SRC" -frames:v 1 -vf "scale=432:768:flags=lanczos" -c:v libwebp -quality 54 -compression_level 6 "single/lite/$1.webp"; }
lite fachada 1.4
lite visao-geral 5.8
lite heliponto 3.5
lite galpao 12.2
lite modulos 17.7

ls -la "$OUT" "$OUT/tour"
