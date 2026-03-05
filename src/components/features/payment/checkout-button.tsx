"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CheckoutButtonProps {
  courseId: string;
  price: number;
  className?: string;
}

/**
 * Initiates a MercadoPago checkout session.
 * Shows a loading state while the API call is in flight.
 */
export function CheckoutButton({ courseId, price, className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) throw new Error("Error al iniciar el pago");

      const { init_point } = await res.json();
      window.location.href = init_point;
    } catch {
      setLoading(false);
      alert("No se pudo iniciar el pago. Intenta de nuevo.");
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={cn(
        "relative flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4",
        "bg-brand-accent font-bold text-black transition-all",
        "hover:bg-brand-accent-400 hover:shadow-accent",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "animate-pulse-accent",
        className,
      )}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
          Procesando...
        </>
      ) : (
        <>
          Comprar — ${price.toLocaleString("es-CL")} CLP
        </>
      )}
    </button>
  );
}
