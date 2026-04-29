"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ label = "Enregistrer" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Enregistrement..." : label}
    </button>
  );
}
