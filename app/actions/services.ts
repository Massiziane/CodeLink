"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";
import { createServiceSchema, updateServiceSchema } from "../schemas/service";


export type ActionState = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
};

// ---- READ 
// ─── GET ALL PUBLISHED SERVICES ─────────────────────────────────────────

export async function getPublishedServices() {
  return await prisma.service.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      category: true,
      developer: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}


// ─── CREATE ────────────────────────────────────────────────────────────────

export async function createService(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const { userId: clerkId} =  await auth();

    if (!clerkId) {
        return {
            success: false,
            message: "Vous devez être connecté pour créer un service.",
        };
    }

   const user = await prisma.user.findUnique({
        where: { clerkId },
    });
    
    if (!user) {
        return {
            success: false,
            message: "Utilisateur non trouvé.",
        };
    }
    const raw = {
        title: formData.get("title") ,
        slug: formData.get("slug"),
        description: formData.get("description"),
        price: formData.get("price"),
        deliveryDays: formData.get("deliveryDays"),
        revisions: formData.get("revisions"),
        categoryId: formData.get("categoryId"),
        status: formData.get("status"),
    };
    const result = createServiceSchema.safeParse(raw);
    if (!result.success) {
        return {
        success: false,
        message: "Veuillez corriger les erreurs du formulaire.",
        errors: result.error.flatten().fieldErrors as Record<string, string[]>,
     };
   }
   try{
    await prisma.service.create({
        data: {
            ...result.data, developerId: user.id
        },
    });
    revalidatePath("/services");
   }catch{
    return {
        success: false,
        message: "Une erreur est survenue lors de la création du service.",
    };
   }

   redirect("/services");

}

// ─── UPDATE ────────────────────────────────────────────────────────────────

export async function updateService(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get("id") as string;
    const version = parseInt(formData.get("version") as string, 10);

    const raw = {
        title: formData.get("title") ,
        slug: formData.get("slug"),
        description: formData.get("description"),
        price: formData.get("price"),
        deliveryDays: formData.get("deliveryDays"),
        revisions: formData.get("revisions"),
        categoryId: formData.get("categoryId"),
        status: formData.get("status"),
    };
    const result = updateServiceSchema.safeParse(raw);
    if (!result.success) {
        return {
        success: false,
        message: "Veuillez corriger les erreurs du formulaire.",
        errors: result.error.flatten().fieldErrors as Record<string, string[]>,
     };
   }
    try{
        const updateResult = await prisma.service.updateMany({
            where: { id, version },
            data: { ...result.data, version: {increment: 1} },
        });
        if (updateResult.count === 0) {
            return {
                success: false,
                message: "Le service a été modifié par un autre utilisateur. Veuillez recharger la page et réessayer.",
            };
        }
        revalidatePath("/services");
        revalidatePath(`/services/${id}`);

    }catch{
        return {
            success: false,
            message: "Une erreur est survenue lors de la mise à jour du service.",
        };
        

    }
    redirect("/services");

}

// ─── DELETE ────────────────────────────────────────────────────────────────

export async function deleteService(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id") as string;

  const existing = await prisma.service.findUnique({ where: { id } });

  if (!existing) {
    return { success: false, message: "Service introuvable." };
  }

  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/services");
  } catch {
    return { success: false, message: "Erreur lors de la suppression du service." };
  }

  redirect("/services");
}"