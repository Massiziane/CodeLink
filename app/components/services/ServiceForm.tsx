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
  const fieldClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelClass = "text-sm font-medium text-gray-800";
  const errorClass = "text-xs font-medium text-red-600";

  return (
    <form
      action={formAction}
      className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >

      {/* Message global */}
      {state.message && (
        <p className={`mb-5 rounded-md border p-3 text-sm font-medium ${state.success ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>
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

      <div className="grid gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className={labelClass}>Titre</label>
          <input
            id="title"
            name="title"
            defaultValue={service?.title ?? ""}
            className={fieldClass}
          />
          {state.errors?.title && (
            <p className={errorClass}>{state.errors.title[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug" className={labelClass}>Slug</label>
          <input
            id="slug"
            name="slug"
            defaultValue={service?.slug ?? ""}
            className={fieldClass}
          />
          {state.errors?.slug && (
            <p className={errorClass}>{state.errors.slug[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={service?.description ?? ""}
            className={`${fieldClass} min-h-32 resize-y leading-6`}
          />
          {state.errors?.description && (
            <p className={errorClass}>{state.errors.description[0]}</p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="price" className={labelClass}>Prix ($)</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={service?.price ?? ""}
              className={fieldClass}
            />
            {state.errors?.price && (
              <p className={errorClass}>{state.errors.price[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="deliveryDays" className={labelClass}>Délai (jours)</label>
            <input
              id="deliveryDays"
              name="deliveryDays"
              type="number"
              defaultValue={service?.deliveryDays ?? ""}
              className={fieldClass}
            />
            {state.errors?.deliveryDays && (
              <p className={errorClass}>{state.errors.deliveryDays[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="revisions" className={labelClass}>Révisions</label>
            <input
              id="revisions"
              name="revisions"
              type="number"
              defaultValue={service?.revisions ?? 0}
              className={fieldClass}
            />
            {state.errors?.revisions && (
              <p className={errorClass}>{state.errors.revisions[0]}</p>
            )}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="categoryId" className={labelClass}>Catégorie</label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={service?.categoryId ?? ""}
              className={fieldClass}
            >
              <option value="">-- Sélectionner --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {state.errors?.categoryId && (
              <p className={errorClass}>{state.errors.categoryId[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className={labelClass}>Statut</label>
            <select
              id="status"
              name="status"
              defaultValue={service?.status ?? "DRAFT"}
              className={fieldClass}
            >
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publié</option>
              <option value="ARCHIVED">Archivé</option>
            </select>
            {state.errors?.status && (
              <p className={errorClass}>{state.errors.status[0]}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-5">
          <SubmitButton label={service ? "Mettre à jour" : "Créer le service"} />
        </div>
      </div>
    </form>
  );
}
