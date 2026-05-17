"use client";

import { useFormStatus } from "react-dom";

export function AddToCartSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full rounded-xl bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
    >
      {pending ? "Adding..." : "Add to Cart"}
    </button>
  );
}