import { NextRequest, NextResponse } from "next/server";
import { getServices } from "@/lib/queries/services";
import { createServiceSchema } from "@/schemas/service-api";
import prisma from "@/app/lib/prisma";

// B.1 — GET /api/services
// Retourne la liste paginée des services avec filtrage et tri
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const rawPage = parseInt(searchParams.get("page") ?? "1");
    const rawMinPrice = searchParams.get("minPrice");
    const rawMaxPrice = searchParams.get("maxPrice");

    const filters = {
      q: searchParams.get("q") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      minPrice: rawMinPrice ? parseFloat(rawMinPrice) : undefined,
      maxPrice: rawMaxPrice ? parseFloat(rawMaxPrice) : undefined,
      status: (searchParams.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED") ?? "PUBLISHED",
      sort: searchParams.get("sort") ?? undefined,
      page: isNaN(rawPage) || rawPage < 1 ? 1 : rawPage,
    };

    const result = await getServices(filters);

    return NextResponse.json({
      data: result.data,
      pagination: result.pagination,
      filters: {
        q: filters.q ?? null,
        category: filters.category ?? null,
        minPrice: filters.minPrice ?? null,
        maxPrice: filters.maxPrice ?? null,
        status: filters.status,
        sort: filters.sort ?? null,
      },
    });
  } catch (error) {
    console.error("GET /api/services :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// B.1 — POST /api/services
// Crée un nouveau service après validation Zod du body JSON
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Le corps de la requête doit être un JSON valide" },
        { status: 400 }
      );
    }

    const parsed = createServiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: parsed.data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        developer: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(
      { message: "Service créé avec succès", data: service },
      { status: 201 }
    );
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
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2003"
    ) {
      return NextResponse.json(
        { message: "Le développeur ou la catégorie spécifié(e) n'existe pas" },
        { status: 400 }
      );
    }
    console.error("POST /api/services :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
