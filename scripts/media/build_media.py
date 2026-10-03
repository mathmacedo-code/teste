#!/usr/bin/env python3
"""
Pipeline de mídia do Vila Medí
==============================

Transforma os reels originais (verticais, 720x1280) em:
  • vídeos de fundo em MP4 (H.264), sem áudio, em loop contínuo (o único formato
    que todo celular decodifica por hardware; WebM foi removido)
  • versão desktop do hero em tríptico 16:9 (3 painéis verticais lado a lado)
  • (opcional) stills tirados dos vídeos — o site NÃO usa mais; só fotos de verdade
  • posters WebP para cada vídeo

Uso:  python3 scripts/media/build_media.py          (vídeos e posters)
      python3 scripts/media/build_media.py stills   (só stills, em assets/images — não usados pelo site)
      python3 scripts/media/build_media.py videos   (só vídeos)
      python3 scripts/media/build_media.py triptych (só o hero desktop)

Fontes esperadas em ./media-src:
  noite.mp4   reel noturno (fachada, bar, luminárias, ostras, coquetéis)
  forno.mp4   reel do pão/pizza no forno a lenha
  pratos.mp4  reel "os artistas / a arte" (equipe + pratos)

Todos os pontos de corte abaixo estão em segundos do arquivo original.
Quando chegarem vídeos novos (idealmente horizontais, 4K), basta trocar
os tempos aqui e rodar de novo.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

import cv2  # opencv-python
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "media-src"
OUT_VIDEO = ROOT / "public" / "media" / "video"
OUT_POSTER = ROOT / "public" / "media" / "poster"
OUT_STILL = ROOT / "assets" / "images"

SOURCES = {
    "noite": SRC / "noite.mp4",
    "forno": SRC / "forno.mp4",
    "pratos": SRC / "pratos.mp4",
}


def run(cmd: list[str]) -> None:
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(" ".join(cmd))
        print(res.stderr[-3000:])
        raise SystemExit(res.returncode)


# ---------------------------------------------------------------------------
# Cortes (clips) — janelas internas de cada take, evitando os frames de corte
# ---------------------------------------------------------------------------
@dataclass
class Clip:
    src: str
    start: float
    end: float

    @property
    def length(self) -> float:
        return self.end - self.start


CLIPS = {
    # noite.mp4
    "fachada": Clip("noite", 0.05, 1.50),          # letreiro VILA MEDÍ aceso
    "bartender": Clip("noite", 1.70, 3.20),        # coquetel sendo montado
    "adega": Clip("noite", 3.30, 4.33),            # parede de vinhos
    "luminarias": Clip("noite", 4.43, 5.57),       # luminárias listradas
    "rose": Clip("noite", 5.70, 6.97),             # rosé no balde, mesa
    "dj": Clip("noite", 9.77, 10.77),              # DJ, luz azul
    "ostras": Clip("noite", 17.33, 18.97),         # ostras grelhadas
    "mesa-palha": Clip("noite", 28.03, 29.20),     # luminária de palha + mesa posta
    "franjas": Clip("noite", 29.33, 30.47),        # luminárias de franja
    "janela": Clip("noite", 30.57, 31.47),         # janela redonda em latão
    "grelha": Clip("noite", 31.57, 33.03),         # grelha
    "mesa-longa": Clip("noite", 33.17, 34.80),     # mesa longa posta
    "frutos-do-mar": Clip("noite", 34.93, 36.03),  # bowl de frutos do mar
    "drink": Clip("noite", 36.13, 37.60),          # drink sendo servido
    "negroni": Clip("noite", 37.73, 39.10),        # negroni com guardanapo da casa
    "bar": Clip("noite", 39.23, 40.87),            # bar à noite
    "salao": Clip("noite", 42.97, 44.00),          # salão
    # forno.mp4
    "massa-maos": Clip("forno", 2.05, 3.55),
    "massa-rolo": Clip("forno", 7.00, 9.60),
    "pa": Clip("forno", 11.62, 12.80),
    "forno": Clip("forno", 12.87, 14.12),
}


# ---------------------------------------------------------------------------
# Sequências de vídeo
#   clips: (nome do clip, duração final em segundos)
#   A velocidade é calculada para cada clip caber na duração pedida
#   (câmera lenta com interpolação de movimento — minterpolate/mci).
# ---------------------------------------------------------------------------
XF = 0.8  # duração das fusões (dissolve)

VERTICAL_SEQUENCES = {
    # Hero mobile — vídeo vertical nativo
    "hero-mobile": dict(size=(720, 1280), clips=[
        ("fachada", 2.9), ("luminarias", 2.9), ("rose", 2.9), ("negroni", 2.9)]),
    # Cozinha / forno — Gastronomia, Temperani, LP almoço
    "forno": dict(size=(720, 1280), clips=[
        ("massa-maos", 2.6), ("massa-rolo", 3.4), ("pa", 2.4), ("forno", 2.6)]),
    # Seção cinematográfica (janela em arco) — noite
    "noite": dict(size=(720, 1280), clips=[
        ("bartender", 3.0), ("janela", 2.6), ("dj", 2.6), ("bar", 3.0)]),
    # Cru Oyster Bar
    "cru": dict(size=(720, 1280), clips=[
        ("ostras", 3.0), ("drink", 3.0), ("negroni", 2.8)]),
    # MII Mar
    "miimar": dict(size=(720, 1280), clips=[
        ("grelha", 3.0), ("frutos-do-mar", 2.8), ("salao", 2.6)]),
}

# Hero desktop: tríptico 16:9. Cada painel troca de cena em "onda"
# (esquerda → centro → direita, 0.22 s de defasagem).
TRIPTYCH = dict(
    panel=(636, 1080), gutter=6, hold=3.2, wave=0.22,
    panels=[
        ["fachada", "mesa-palha", "adega"],
        ["luminarias", "franjas", "salao"],
        ["rose", "negroni", "drink"],
    ],
)

# ---------------------------------------------------------------------------
# Stills — escolhe automaticamente o frame mais nítido dentro da janela
#   crop: (x, y, w, h) no frame 720x1280 original; None = frame inteiro
#   O texto queimado "a arte:" / "os artistas:" fica entre y≈175–215,
#   por isso os cortes do pratos.mp4 começam abaixo de y=232.
# ---------------------------------------------------------------------------
STILLS = {
    # pratos.mp4 (4:5)
    "prato-tartare": ("pratos", 2.85, 3.50, (0, 300, 720, 900)),
    "prato-labneh": ("pratos", 3.56, 4.27, (0, 300, 720, 900)),
    "prato-polvo": ("pratos", 4.33, 4.87, (0, 250, 720, 900)),
    "prato-ravioli": ("pratos", 4.93, 5.63, (0, 330, 720, 900)),
    "prato-chocolate": ("pratos", 5.70, 6.33, (0, 250, 720, 900)),
    "prato-pavlova": ("pratos", 6.40, 7.03, (0, 300, 720, 900)),
    "prato-cordeiro": ("pratos", 7.09, 7.54, (0, 250, 720, 900)),
    "equipe": ("pratos", 0.10, 2.70, (0, 300, 720, 900)),
    # noite.mp4 (9:16 inteiro)
    "fachada": ("noite", 0.05, 1.50, None),
    "bartender": ("noite", 1.70, 3.20, None),
    "adega": ("noite", 3.30, 4.33, None),
    "luminarias": ("noite", 4.43, 5.57, None),
    "rose": ("noite", 5.70, 6.97, None),
    "bar-convidado": ("noite", 7.15, 8.30, None),
    "dj": ("noite", 9.77, 10.77, None),
    "escultura": ("noite", 12.03, 13.33, None),
    "ostras": ("noite", 17.33, 18.97, None),
    "celebracao": ("noite", 19.40, 23.60, None),
    "pista": ("noite", 24.70, 26.00, None),
    "teto": ("noite", 26.07, 27.93, None),
    "mesa-palha": ("noite", 28.03, 29.20, None),
    "franjas": ("noite", 29.33, 30.47, None),
    "janela": ("noite", 30.85, 31.30, None),
    "grelha": ("noite", 31.57, 33.03, None),
    "mesa-longa": ("noite", 33.17, 34.80, None),
    "frutos-do-mar": ("noite", 34.93, 36.03, None),
    "drink": ("noite", 36.13, 37.60, None),
    "negroni": ("noite", 37.73, 39.10, None),
    "salao": ("noite", 42.97, 44.00, None),
    # forno.mp4
    "padeiro": ("forno", 0.10, 1.95, None),
    "massa-maos": ("forno", 2.05, 3.55, None),
    "massa-rolo": ("forno", 7.00, 9.60, None),
    "forno": ("forno", 12.87, 14.12, None),
}


# ---------------------------------------------------------------------------
# Stills
# ---------------------------------------------------------------------------
def sharpest_frame(src: Path, t0: float, t1: float) -> np.ndarray:
    cap = cv2.VideoCapture(str(src))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    first, last = int(t0 * fps), int(t1 * fps)
    cap.set(cv2.CAP_PROP_POS_FRAMES, first)
    best, best_score = None, -1.0
    for _ in range(first, last):
        ok, frame = cap.read()
        if not ok:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        score = cv2.Laplacian(gray, cv2.CV_64F).var()
        if score > best_score:
            best, best_score = frame, score
    cap.release()
    assert best is not None, f"sem frames em {src} {t0}-{t1}"
    return best


def build_stills() -> dict:
    OUT_STILL.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for name, (src, t0, t1, crop) in STILLS.items():
        frame = sharpest_frame(SOURCES[src], t0, t1)
        if crop:
            x, y, w, h = crop
            frame = frame[y:y + h, x:x + w]
        # leve realce de nitidez (unsharp mask) para compensar a compressão do Instagram
        blur = cv2.GaussianBlur(frame, (0, 0), 1.1)
        frame = cv2.addWeighted(frame, 1.35, blur, -0.35, 0)
        out = OUT_STILL / f"{name}.jpg"
        cv2.imwrite(str(out), frame, [cv2.IMWRITE_JPEG_QUALITY, 92, cv2.IMWRITE_JPEG_PROGRESSIVE, 1])
        manifest[name] = {"w": frame.shape[1], "h": frame.shape[0]}
        print("still", name, frame.shape[1], "x", frame.shape[0])
    return manifest


# ---------------------------------------------------------------------------
# Vídeo
# ---------------------------------------------------------------------------
def render_clip(clip: Clip, duration: float, size: tuple[int, int], out: Path) -> None:
    """Corta, aplica câmera lenta suave e redimensiona (cover) para `size`."""
    w, h = size
    factor = duration / clip.length  # >1 = câmera lenta
    vf = [
        f"setpts={factor:.4f}*PTS",
        "minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1",
        f"scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos",
        f"crop={w}:{h}",
        # grade sutil: um pouco mais de calor e contraste, pretos mais profundos
        "eq=contrast=1.04:saturation=0.96:gamma=0.98",
        "colorbalance=rs=0.02:bs=-0.02:rm=0.01",
        "fps=30",
        f"trim=duration={duration:.3f}",
        "setpts=PTS-STARTPTS",
        "format=yuv420p",
    ]
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{clip.start:.3f}", "-t", f"{clip.length:.3f}",
         "-i", str(SOURCES[clip.src]), "-an", "-vf", ",".join(vf),
         "-c:v", "libx264", "-crf", "12", "-preset", "veryfast", str(out)])


def seamless_loop(parts: list[Path], durations: list[float], xf: float, out: Path) -> float:
    """Encadeia clipes com dissolve e fecha o loop sem emenda visível.

    Sequência: c1 → c2 → … → cN → c1 (início), depois remove os primeiros `xf`
    segundos. O último frame cai exatamente no frame seguinte ao primeiro.
    Retorna a duração do loop.
    """
    inputs, labels = [], []
    seq = parts + [parts[0]]
    seq_d = durations + [durations[0]]
    for p in seq:
        inputs += ["-i", str(p)]
    filt, prev, acc = [], "[0:v]", seq_d[0]
    for i in range(1, len(seq)):
        offset = acc - xf
        lab = f"[x{i}]"
        filt.append(f"{prev}[{i}:v]xfade=transition=fade:duration={xf}:offset={offset:.3f}{lab}")
        prev, acc = lab, offset + seq_d[i]
    loop_len = sum(durations) - len(durations) * xf
    filt.append(f"{prev}trim=start={xf}:duration={loop_len:.3f},setpts=PTS-STARTPTS[v]")
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(filt),
         "-map", "[v]", "-c:v", "libx264", "-crf", "12", "-preset", "veryfast", str(out)])
    return loop_len


def rotate_loop(src: Path, offset: float, length: float, out: Path) -> None:
    """Desloca o ponto de início de um loop contínuo (para a 'onda' do tríptico)."""
    if offset <= 0:
        shutil.copy(src, out)
        return
    filt = (f"[0:v]trim=start={offset:.3f}:end={length:.3f},setpts=PTS-STARTPTS[a];"
            f"[0:v]trim=start=0:end={offset:.3f},setpts=PTS-STARTPTS[b];"
            f"[a][b]concat=n=2:v=1[v]")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-filter_complex", filt,
         "-map", "[v]", "-c:v", "libx264", "-crf", "12", "-preset", "veryfast", str(out)])


def encode_web(master: Path, name: str, vp9_crf: int, h264_crf: int) -> None:
    OUT_VIDEO.mkdir(parents=True, exist_ok=True)
    OUT_POSTER.mkdir(parents=True, exist_ok=True)
    mp4 = OUT_VIDEO / f"{name}.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-i", str(master), "-an",
         "-c:v", "libx264", "-crf", str(h264_crf), "-preset", "slow", "-profile:v", "high",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(mp4)])
    # poster = primeiro frame (é o que aparece antes do vídeo carregar)
    run(["ffmpeg", "-v", "error", "-y", "-i", str(master), "-frames:v", "1",
         "-c:v", "libwebp", "-quality", "80", str(OUT_POSTER / f"{name}.webp")])
    print(f"video {name}: mp4 {mp4.stat().st_size/1e6:.2f} MB")


def build_vertical(name: str, spec: dict, tmp: Path, crf=(36, 28)) -> None:
    parts, durs = [], []
    for i, (clip_name, d) in enumerate(spec["clips"]):
        p = tmp / f"{name}_{i}.mp4"
        render_clip(CLIPS[clip_name], d, spec["size"], p)
        parts.append(p)
        durs.append(d)
    master = tmp / f"{name}_master.mp4"
    seamless_loop(parts, durs, XF, master)
    encode_web(master, name, *crf)


def build_triptych(tmp: Path) -> None:
    pw, ph = TRIPTYCH["panel"]
    hold, wave, gut = TRIPTYCH["hold"], TRIPTYCH["wave"], TRIPTYCH["gutter"]
    loops = []
    for pi, names in enumerate(TRIPTYCH["panels"]):
        parts = []
        for ci, clip_name in enumerate(names):
            p = tmp / f"tri_{pi}_{ci}.mp4"
            render_clip(CLIPS[clip_name], hold, (pw, ph), p)
            parts.append(p)
        loop = tmp / f"tri_{pi}_loop.mp4"
        length = seamless_loop(parts, [hold] * len(names), XF, loop)
        # painel da esquerda lidera; os outros "atrasam" a troca de cena
        shifted = tmp / f"tri_{pi}_shift.mp4"
        rotate_loop(loop, (length - pi * wave) % length if pi else 0, length, shifted)
        loops.append(shifted)
    master = tmp / "hero-desktop_master.mp4"
    filt = (f"color=c=0x16110C:s={gut}x{ph}:r=30:d=60[g1];color=c=0x16110C:s={gut}x{ph}:r=30:d=60[g2];"
            f"[0:v][g1][1:v][g2][2:v]hstack=inputs=5:shortest=1,format=yuv420p[v]")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(loops[0]), "-i", str(loops[1]), "-i", str(loops[2]),
         "-filter_complex", filt, "-map", "[v]", "-c:v", "libx264", "-crf", "12",
         "-preset", "veryfast", str(master)])
    encode_web(master, "hero-desktop", 37, 29)


def main() -> None:
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    for k, p in SOURCES.items():
        if not p.exists():
            raise SystemExit(f"Fonte ausente: {p}")
    if what == "stills":
        # mantém no manifesto as fotos adicionadas à mão (pratos fotografados), que não saem dos vídeos
        path = OUT_STILL / "_manifest.json"
        manifest = json.loads(path.read_text()) if path.exists() else {}
        manifest.update(build_stills())
        path.write_text(json.dumps(manifest, indent=2))
    if what in ("all", "videos", "triptych"):
        with tempfile.TemporaryDirectory() as td:
            tmp = Path(td)
            build_triptych(tmp)
            if what != "triptych":
                for name, spec in VERTICAL_SEQUENCES.items():
                    build_vertical(name, spec, tmp)


if __name__ == "__main__":
    main()
