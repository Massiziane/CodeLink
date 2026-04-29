import {z} from "zod";

export const createServiceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Le titre doit contenir au moins 3 caractères." })
    .max(100, { message: "Le titre ne peut pas dépasser 100 caractères." }),

  slug: z
    .string()
    .trim()
    .min(3, { message: "Le slug doit contenir au moins 3 caractères." })
    .max(100, { message: "Le slug ne peut pas dépasser 100 caractères." })
    .regex(/^[a-z0-9-]+$/, { message: "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets." }),

  description: z
    .string()
    .trim()
    .min(10, { message: "La description doit contenir au moins 10 caractères." })
    .max(2000, { message: "La description ne peut pas dépasser 2000 caractères." }),

  price: z.coerce
    .number({ error: "Le prix doit être un nombre." })
    .positive({ message: "Le prix doit être supérieur à 0." })
    .max(10000, { message: "Le prix ne peut pas dépasser 10 000 $." }),

  deliveryDays: z.coerce
    .number({ error: "Le délai de livraison doit être un nombre." })
    .int({ message: "Le délai doit être un nombre entier." })
    .min(1, { message: "Le délai de livraison doit être d'au moins 1 jour." })
    .max(365, { message: "Le délai de livraison ne peut pas dépasser 365 jours." }),

  revisions: z.coerce
    .number({ error: "Le nombre de révisions doit être un nombre." })
    .int({ message: "Le nombre de révisions doit être un entier." })
    .min(0, { message: "Le nombre de révisions ne peut pas être négatif." })
    .max(100, { message: "Le nombre de révisions ne peut pas dépasser 100." }),

  categoryId: z
    .string()
    .trim()
    .min(1, { message: "Veuillez sélectionner une catégorie." }),

  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    error: "Le statut est invalide.",
  }),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;