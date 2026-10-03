"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track, type TrackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Variant = "solid" | "light" | "line";

export const ctaStyles: Record<Variant, string> = {
  solid:
    "inline-flex items-center justify-center rounded-full bg-azul px-7 py-[0.95rem] text-[0.95rem] font-[450] tracking-[0.01em] text-cal transition-colors duration-500 hover:bg-azul-claro",
  light:
    "inline-flex items-center justify-center rounded-full bg-perola px-7 py-[0.95rem] text-[0.95rem] font-[450] tracking-[0.01em] text-noite transition-colors duration-500 hover:bg-white",
  line: "link-u inline-flex w-fit text-[0.95rem] font-[450] tracking-[0.01em]",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  event?: TrackEvent;
  location?: string;
  external?: boolean;
};

/** Link de ação com rastreamento opcional (dataLayer + Meta Pixel). */
export function Cta({ href, children, variant = "solid", className, event, location, external }: Props) {
  const onClick = () => event && track(event, { location: location || "" });
  const cls = cn(ctaStyles[variant], className);
  if (external) {
    return (
      <a href={href} className={cls} onClick={onClick} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}

/** Botão com o mesmo visual (enviar formulários). */
export function CtaButton({
  children, onClick, variant = "solid", className, type = "button", disabled,
}: {
  children: ReactNode; onClick?: () => void; variant?: Variant; className?: string;
  type?: "button" | "submit"; disabled?: boolean;
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn(ctaStyles[variant], "cursor-pointer disabled:opacity-50", className)}>
      {children}
    </button>
  );
}
