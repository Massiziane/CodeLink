import Link from "next/link";
import { PaginationMeta } from "@/lib/queries/services";

interface PaginationProps {
  pagination: PaginationMeta;
  basePath: string;
  currentSearchParams?: Record<string, string | undefined>;
}

// B.3 — Composant de pagination avec liens Next.js
// La page courante est dans l'URL (searchParams) pour permettre le partage du lien
export function Pagination({
  pagination,
  basePath,
  currentSearchParams = {},
}: PaginationProps) {
  const { page, totalPages, hasNextPage, hasPreviousPage } = pagination;

  // Construit l'URL d'une page en conservant les filtres actifs
  function buildUrl(targetPage: number): string {
    const params = new URLSearchParams();
    Object.entries(currentSearchParams).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value);
    });
    params.set("page", targetPage.toString());
    return `${basePath}?${params.toString()}`;
  }

  if (totalPages <= 1) return null;

  // Affiche au maximum 5 numéros de page pour éviter de déborder
  const getPageNumbers = (): number[] => {
    const delta = 2;
    const range: number[] = [];
    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8 flex-wrap">
      {/* Bouton Précédent */}
      {hasPreviousPage ? (
        <Link
          href={buildUrl(page - 1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          ← Précédent
        </Link>
      ) : (
        <span className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed">
          ← Précédent
        </span>
      )}

      {/* Numéros de pages */}
      {getPageNumbers().map((pageNum) => (
        <Link
          key={pageNum}
          href={buildUrl(pageNum)}
          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
            pageNum === page
              ? "bg-blue-600 text-white border-blue-600 pointer-events-none"
              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          }`}
          aria-current={pageNum === page ? "page" : undefined}
        >
          {pageNum}
        </Link>
      ))}

      {/* Bouton Suivant */}
      {hasNextPage ? (
        <Link
          href={buildUrl(page + 1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Suivant →
        </Link>
      ) : (
        <span className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed">
          Suivant →
        </span>
      )}
    </nav>
  );
}
