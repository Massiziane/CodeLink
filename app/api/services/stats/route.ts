import { NextResponse } from "next/server";
import { getServicesStats } from "@/lib/queries/services";

// B.2 — GET /api/services/stats
// Retourne les agrégations Prisma : total publié, prix moyen/min/max, répartition par catégorie
export async function GET() {
  try {
    const stats = await getServicesStats();

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error("GET /api/services/stats :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
