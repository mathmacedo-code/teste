import { cn } from "@/lib/cn";

/**
 * Luz de vela: manchas quentes e desfocadas que respiram e tremulam devagar
 * sobre fundos escuros. Puro CSS (sem custo de JS), decorativo.
 */
export function CandleGlow({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="glow absolute top-[8%] left-[6%] h-[46vmax] w-[46vmax] [animation-duration:13s]" />
      <div className="glow absolute right-[-8%] bottom-[-12%] h-[56vmax] w-[56vmax] [animation-delay:-5s] [animation-duration:17s]" />
      <div className="glow glow-soft absolute top-[40%] left-[45%] h-[28vmax] w-[28vmax] [animation-delay:-9s] [animation-duration:11s]" />
    </div>
  );
}
