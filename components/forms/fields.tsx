import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="meta block opacity-75">{label}</span>
      {children}
    </label>
  );
}

export function SelectChevron() {
  return (
    <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute right-0 bottom-4 h-2 w-3 opacity-60">
      <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Máscara simples para WhatsApp: (11) 90000-0000 */
export function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Campo isca anti-spam: invisível para pessoas, preenchido por robôs. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
      <label>
        Site
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
