import { cn } from "@/lib/cn";

type Props = { className?: string; title?: string };

/** Emblema (arco + vila) e assinatura do Vila Medí, vetorizados do logo original.
 *  Usam máscara CSS: herdam a cor do texto (currentColor). */
function Mark({ file, ratio, className, title }: Props & { file: string; ratio: string }) {
  const mask = `url(/brand/${file}.svg) center / contain no-repeat`;
  return (
    <span
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("inline-block shrink-0 bg-current align-middle", className)}
      style={{ aspectRatio: ratio, WebkitMask: mask, mask }}
    />
  );
}

export const Emblem = (p: Props) => <Mark {...p} file="emblema" ratio="1221.4 / 1338.2" />;
export const Wordmark = (p: Props) => <Mark {...p} file="assinatura" ratio="1217.7 / 318.1" />;
