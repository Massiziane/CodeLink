import { z } from "zod";

// Schéma de création d'un service (utilisé par l'API Route POST)
// Note : Zod v4 utilise { error: "message" } au lieu de { required_error / errorMap }
export const createServiceSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères")
    .trim(),
  slug: z
    .string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .max(100, "Le slug ne peut pas dépasser 100 caractères")
    .trim()
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"
    ),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(2000, "La description ne peut pas dépasser 2000 caractères")
    .trim(),
  price: z.coerce
    .number()
    .min(1, "Le prix doit être d'au moins 1 $")
    .max(10000, "Le prix ne peut pas dépasser 10 000 $"),
  deliveryDays: z.coerce
    .number()
    .int("Le délai de livraison doit être un nombre entier")
    .min(1, "Le délai doit être d'au moins 1 jour")
    .max(365, "Le délai ne peut pas dépasser 365 jours"),
  revisions: z.coerce
    .number()
    .int("Le nombre de révisions doit être un nombre entier")
    .min(0, "Le nombre de révisions ne peut pas être négatif")
    .default(0),
  isFeatured: z.boolean().optional().default(false),
  status: z
    .enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .optional()
    .default("DRAFT"),
  developerId: z
    .string()
    .min(1, "L'identifiant du développeur est requis"),
  categoryId: z
    .string()
    .min(1, "L'identifiant de la catégorie est requis"),
});

// Schéma de mise à jour : tous les champs sont optionnels (.partial())
export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
