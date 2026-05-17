import Link from "next/link";
import { getServices } from "@/lib/queries/services";
import { Pagination } from "@/components/Pagination";
import { getAuthUser } from "@/app/lib/auth";

// B.3 — Page Server Component : liste paginée des services
// La page courante est lue depuis searchParams (URL partageable)
type SearchParams = Promise<{
  page?: string;
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}>;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const authResult = await getAuthUser();
  const canCreateService =
    authResult.success &&
    (authResult.user.role === "DEVELOPER" || authResult.user.role === "ADMIN");

  const page = parseInt(params.page ?? "1");
  const filters = {
    q: params.q,
    category: params.category,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    sort: params.sort,
    page: isNaN(page) || page < 1 ? 1 : page,
  };

  const { data: services, pagination } = await getServices(filters);

  // Paramètres actuels pour la reconstruction des URLs de pagination
  const currentSearchParams: Record<string, string | undefined> = {
    q: params.q,
    category: params.category,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    sort: params.sort,
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Services CodeLink</h1>
        {canCreateService && (
          <Link
            href="/developer/services/new"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            + Créer un service
          </Link>
        )}
      </div>
      <p className="text-gray-500 mb-8">
        {pagination.total} service{pagination.total !== 1 ? "s" : ""} disponible
        {pagination.total !== 1 ? "s" : ""}
      </p>

      {/* État vide */}
      {services.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Aucun service trouvé
          </h2>
          <p className="text-gray-500">
            Essayez de modifier vos filtres ou revenez plus tard.
          </p>
        </div>
      )}

      {/* Grille de services */}
      {services.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow block"
            >
              {service.isFeatured && (
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded mb-2">
                  En vedette
                </span>
              )}
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
                {service.category.name}
              </p>
              <h2 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
                {service.title}
              </h2>
              <p className="text-sm text-gray-500 mb-3 line-clamp-3">
                {service.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-lg font-bold text-gray-900">
                  {service.price.toFixed(2)} $
                </span>
                <span className="text-xs text-gray-400">
                  {service.deliveryDays} jour{service.deliveryDays > 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Par {service.developer.name ?? service.developer.email}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* B.3 — Composant Pagination avec métadonnées */}
      <Pagination
        pagination={pagination}
        basePath="/services"
        currentSearchParams={currentSearchParams}
      />

      {/* Informations de pagination */}
      {pagination.totalPages > 1 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          Page {pagination.page} sur {pagination.totalPages}
        </p>
      )}
    </main>
  );
}
