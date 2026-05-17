import prisma from "@/app/lib/prisma";

export const ITEMS_PER_PAGE = 6;

// Types de filtres acceptés par les requêtes de services
export interface ServiceFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sort?: string;
  page?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Construit le orderBy Prisma selon le paramètre de tri
function buildOrderBy(sort?: string) {
  switch (sort) {
    case "price_asc":
      return { price: "asc" as const };
    case "price_desc":
      return { price: "desc" as const };
    case "date_asc":
      return { createdAt: "asc" as const };
    case "title_asc":
      return { title: "asc" as const };
    case "title_desc":
      return { title: "desc" as const };
    case "date_desc":
    default:
      return { createdAt: "desc" as const };
  }
}

// B.2 — Requête principale avec include, filtrage dynamique, tri et pagination (B.3)
export async function getServices(filters: ServiceFilters = {}) {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    status = "PUBLISHED",
    sort,
    page = 1,
  } = filters;

  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // Construction du filtre where dynamique
  const where: Record<string, unknown> = {
    status,
  };

  // Recherche textuelle insensible à la casse sur titre et description
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  // Filtrage par slug de catégorie
  if (category) {
    where.category = { slug: { equals: category, mode: "insensitive" } };
  }

  // Filtrage par plage de prix (gte / lte)
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: Record<string, number> = {};
    if (minPrice !== undefined) priceFilter.gte = minPrice;
    if (maxPrice !== undefined) priceFilter.lte = maxPrice;
    where.price = priceFilter;
  }

  const orderBy = buildOrderBy(sort);

  // B.3 — Pagination par offset : données + total en parallèle
  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      include: {
        // B.2 — include pour charger les relations
        category: {
          select: { id: true, name: true, slug: true },
        },
        developer: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: { select: { avatarUrl: true, bio: true } },
          },
        },
      },
      orderBy,
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.service.count({ where }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return {
    data: services,
    pagination: {
      total,
      page: currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    } satisfies PaginationMeta,
  };
}

// B.2 — Requête détail avec include complet des relations
export async function getServiceById(id: string) {
  return prisma.service.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true, slug: true, description: true },
      },
      developer: {
        select: {
          id: true,
          name: true,
          email: true,
          profile: {
            select: { avatarUrl: true, bio: true, companyName: true },
          },
        },
      },
    },
  });
}

// B.2 — Agrégation : statistiques globales des services publiés
export async function getServicesStats() {
  // Promise.all pour exécuter les 3 requêtes en parallèle
  const [totalPublished, pricing, byCategory] = await Promise.all([
    // Nombre total de services publiés
    prisma.service.count({
      where: { status: "PUBLISHED" },
    }),

    // Prix moyen, min et max des services publiés
    prisma.service.aggregate({
      where: { status: "PUBLISHED" },
      _avg: { price: true },
      _min: { price: true },
      _max: { price: true },
      _count: { id: true },
    }),

    // Nombre de services par catégorie (groupBy)
    prisma.service.groupBy({
      by: ["categoryId"],
      where: { status: "PUBLISHED" },
      _count: { id: true },
      _avg: { price: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  return {
    totalPublished,
    pricing: {
      average: pricing._avg.price,
      min: pricing._min.price,
      max: pricing._max.price,
    },
    byCategory,
  };
}

// B.2 — Requête avec select précis pour une liste légère (sans toutes les relations)
export async function getServicesLight() {
  return prisma.service.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      price: true,
      deliveryDays: true,
      revisions: true,
      status: true,
      isFeatured: true,
      category: { select: { name: true, slug: true } },
      developer: { select: { name: true } },
    },
    orderBy: { isFeatured: "desc" },
  });
}
