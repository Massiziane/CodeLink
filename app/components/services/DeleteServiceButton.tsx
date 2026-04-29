"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { deleteService, ActionState } from "@/app/actions/services";

const initialState: ActionState = { success: false, message: "" };

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Suppression..." : "Supprimer"}
    </button>
  );
}

export default function DeleteServiceButton({ id }: { id: string }) {
  const [state, formAction] = useActionState(deleteService, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      {state.message && !state.success && (
        <p className="text-red-500 text-xs mb-1">{state.message}</p>
      )}
      <DeleteButton />
    </form>
  );
}
