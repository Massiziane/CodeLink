"use client";

import { useActionState } from "react";
import { createService, updateService, ActionState } from "@/app/actions/services";
import SubmitButton from "./SubmitButton";
import type { ServiceModel } from "@/app/generated/prisma/models/Service";

const initialState: ActionState = { success: false, message: "" };

type Props = {
  categories: { id: string; name: string }[];
  service?: ServiceModel;
};


export default function ServiceForm({ categories, service }: Props) {
  const action = service ? updateService : createService;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-xl">

      {/* Message global */}
      {state.message && (
        <p className={`p-3 rounded-md text-sm ${state.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {state.message}
        </p>
      )}

      {/* Champs cachés pour l'édition */}
      {service && (
        <>
          <input type="hidden" name="id" value={service.id} />
          <input type="hidden" name="version" value={service.version} />
        </>
      )}

      {/* Titre */}
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">Titre</label>
        <input
          id="title"
          name="title"
          defaultValue={service?.title ?? ""}
          className="border rounded-md px-3 py-2 text-sm"
        />
        {state.errors?.title && (
          <p className="text-red-500 text-xs">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Slug */}
      <div className="flex flex-col gap-1">
        <label htmlFor="slug" className="text-sm font-medium">Slug</label>
        <input
          id="slug"
          name="slug"
          defaultValue={service?.slug ?? ""}
          className="border rounded-md px-3 py-2 text-sm"
        />
        {state.errors?.slug && (
          <p className="text-red-500 text-xs">{state.errors.slug[0]}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={service?.description ?? ""}
          className="border rounded-md px-3 py-2 text-sm"
        />
        {state.errors?.description && (
          <p className="text-red-500 text-xs">{state.errors.description[0]}</p>
        )}
      </div>

      {/* Prix */}
      <div className="flex flex-col gap-1">
        <label htmlFor="price" className="text-sm font-medium">Prix ($)</label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          defaultValue={service?.price ?? ""}
          className="border rounded-md px-3 py-2 text-sm"
        />
        {state.errors?.price && (
          <p className="text-red-500 text-xs">{state.errors.price[0]}</p>
        )}
      </div>

      {/* Délai de livraison */}
      <div className="flex flex-col gap-1">
        <label htmlFor="deliveryDays" className="text-sm font-medium">Délai de livraison (jours)</label>
        <input
          id="deliveryDays"
          name="deliveryDays"
          type="number"
          defaultValue={service?.deliveryDays ?? ""}
          className="border rounded-md px-3 py-2 text-sm"
        />
        {state.errors?.deliveryDays && (
          <p className="text-red-500 text-xs">{state.errors.deliveryDays[0]}</p>
        )}
      </div>

      {/* Révisions */}
      <div className="flex flex-col gap-1">
        <label htmlFor="revisions" className="text-sm font-medium">Révisions incluses</label>
        <input
          id="revisions"
          name="revisions"
          type="number"
          defaultValue={service?.revisions ?? 0}
          className="border rounded-md px-3 py-2 text-sm"
        />
        {state.errors?.revisions && (
          <p className="text-red-500 text-xs">{state.errors.revisions[0]}</p>
        )}
      </div>

      {/* Catégorie */}
      <div className="flex flex-col gap-1">
        <label htmlFor="categoryId" className="text-sm font-medium">Catégorie</label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={service?.categoryId ?? ""}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">-- Sélectionner --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {state.errors?.categoryId && (
          <p className="text-red-500 text-xs">{state.errors.categoryId[0]}</p>
        )}
      </div>

      {/* Statut */}
      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="text-sm font-medium">Statut</label>
        <select
          id="status"
          name="status"
          defaultValue={service?.status ?? "DRAFT"}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="DRAFT">Brouillon</option>
          <option value="PUBLISHED">Publié</option>
          <option value="ARCHIVED">Archivé</option>
        </select>
        {state.errors?.status && (
          <p className="text-red-500 text-xs">{state.errors.status[0]}</p>
        )}
      </div>

      <SubmitButton label={service ? "Mettre à jour" : "Créer le service"} />
    </form>
  );
}