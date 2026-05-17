import { NextRequest, NextResponse } from "next/server";
import { getServiceById } from "@/lib/queries/services";
import { updateServiceSchema } from "@/schemas/service-api";
import prisma from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/current-user";

type RouteParams = { params: Promise<{ id: string }> };

// B.1 — GET /api/services/[id]
// Retourne un service précis avec ses relations (404 si introuvable)
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const service = await getServiceById(id);

    if (!service) {
      return NextResponse.json(
        { message: "Service introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: service });
  } catch (error) {
    console.error("GET /api/services/[id] :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// B.1 — PUT /api/services/[id]
// Met à jour un service existant après validation Zod partielle
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    if (user.role !== "DEVELOPER" && user.role !== "ADMIN") {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 });
    }

    const { id } = await params;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { message: "Service introuvable" },
        { status: 404 }
      );
    }

    if (user.role === "DEVELOPER" && existing.developerId !== user.id) {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Le corps de la requête doit être un JSON valide" },
        { status: 400 }
      );
    }

    const parsed = updateServiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updated = await prisma.service.update({
      where: { id },
      data: parsed.data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        developer: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ message: "Service mis à jour avec succès", data: updated });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Un service avec ce slug existe déjà" },
        { status: 400 }
      );
    }
    console.error("PUT /api/services/[id] :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// B.1 — DELETE /api/services/[id]
// Supprime un service après vérification d'existence (404 si absent)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    if (user.role !== "DEVELOPER" && user.role !== "ADMIN") {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 });
    }

    const { id } = await params;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { message: "Service introuvable" },
        { status: 404 }
      );
    }

    if (user.role === "DEVELOPER" && existing.developerId !== user.id) {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 });
    }

    await prisma.service.delete({ where: { id } });

    return NextResponse.json({ message: "Service supprimé avec succès" });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2003"
    ) {
      return NextResponse.json(
        {
          message:
            "Impossible de supprimer ce service : il est associé à des commandes existantes",
        },
        { status: 400 }
      );
    }
    console.error("DELETE /api/services/[id] :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
