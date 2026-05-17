"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../lib/prisma";
import { getCurrentUser } from "@/app/lib/current-user";
import { createServiceSchema, updateServiceSchema } from "../schemas/service";


export type ActionState = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
};

// ─── CREATE ────────────────────────────────────────────────────────────────

export async function createService(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user || (user.role !== "DEVELOPER" && user.role !== "ADMIN")) {
        return { success: false, message: "Accès refusé." };
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

   redirect("/developer/services");

}

// ─── UPDATE ────────────────────────────────────────────────────────────────

export async function updateService(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user || (user.role !== "DEVELOPER" && user.role !== "ADMIN")) {
        return { success: false, message: "Accès refusé." };
    }

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
            where: user.role === "ADMIN"
                 ? { id, version }
                    : { id, version, developerId: user.id },
            data: {
                ...result.data,
                version: {increment: 1},
            },
            
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
    redirect("/developer/services");

}

// ─── DELETE ────────────────────────────────────────────────────────────────

export async function deleteService(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user || (user.role !== "DEVELOPER" && user.role !== "ADMIN")) {
        return { success: false, message: "Accès refusé." };
    }

    const id = formData.get("id") as string;

    const existing = await prisma.service.findUnique({
        where: { id },
        select: { 
            id: true,
            developerId: true,
        },
    });

    if (!existing) {
        return {
            success: false,
            message: "Service non trouvé.",
        };
    }


    if (user.role !== "ADMIN" && existing.developerId !== user.id) {
        return {
            success: false,
            message: "Vous n'avez pas la permission de supprimer ce service.",
        };
    }
    try {
        await prisma.service.delete({
            where: { id }
        });
        revalidatePath("/services");
    } catch {
        return {
            success: false,
            message: "Une erreur est survenue lors de la suppression du service.",
        };
    }
    redirect("/developer/services");
}
