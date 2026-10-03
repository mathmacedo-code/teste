import Image from "next/image";
import { img, imgFocus, type ImageKey } from "@/data/media";
import { cn } from "@/lib/cn";

type Props = {
  k: ImageKey;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  quality?: 60 | 70 | 75 | 85;
};

/** Imagem responsiva (AVIF/WebP via next/image) com blur de carregamento. Ocupa o pai (fill). */
export function Photo({ k, alt, sizes, className, priority, quality = 75 }: Props) {
  return (
    <Image
      src={img[k]}
      alt={alt}
      fill
      sizes={sizes}
      quality={quality}
      priority={priority}
      placeholder="blur"
      className={cn("object-cover", className)}
      style={imgFocus[k] ? { objectPosition: imgFocus[k] } : undefined}
    />
  );
}
