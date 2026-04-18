import { NextRequest, NextResponse } from "next/server";
import { getServiceById } from "@/lib/queries/services";
import { updateServiceSchema } from "@/schemas/service-api";
import prisma from "@/app/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

// B.1 — GET /actions/services/[id]
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
    console.error("GET /actions/services/[id] :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// B.1 — PUT /actions/services/[id]
// Met à jour un service existant après validation Zod partielle
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { message: "Service introuvable" },
        { status: 404 }
      );
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
    console.error("PUT /actions/services/[id] :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// B.1 — DELETE /actions/services/[id]
// Supprime un service après vérification d'existence (404 si absent)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { message: "Service introuvable" },
        { status: 404 }
      );
    }

    await prisma.service.delete({ where: { id } });

    return NextResponse.json({ message: "Service supprimé avec succès" });
  } catch (error: unknown) {
    // P2003 = le service est référencé dans une commande, suppression impossible
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
    console.error("DELETE /actions/services/[id] :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
