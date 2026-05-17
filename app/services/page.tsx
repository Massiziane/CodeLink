import Link from "next/link";
import { getServices } from "@/lib/queries/services";
import { Pagination } from "@/components/Pagination";
import { Header } from "@/app/components/UserHeader";

type SearchParams = Promise<{
  page?: string;
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}>;

export default async function ServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

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

  const currentSearchParams: Record<string, string | undefined> = {
    q: params.q,
    category: params.category,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    sort: params.sort,
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* GLOBAL HEADER */}
      <Header />

      {/* HERO */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-700 text-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* LEFT TEXT */}
            <div>
              <h1 className="text-4xl font-bold">
                Browse Services
              </h1>

              <p className="text-orange-100 mt-2">
                Find developers and services for your project
              </p>

              <p className="text-orange-100 text-sm mt-3">
                {pagination.total} service{pagination.total !== 1 ? "s" : ""} available
              </p>
            </div>


          </div>

          {/* SEARCH BAR (NEW — IMPORTANT UX UPGRADE) */}
          <form method="GET" className="mt-8 max-w-2xl">
            <div className="flex bg-white rounded-xl overflow-hidden shadow-sm">

              <input
                name="q"
                defaultValue={params.q}
                placeholder="Search services, categories, developers..."
                className="w-full px-4 py-3 text-gray-900 outline-none"
              />

              <button
                type="submit"
                className="bg-orange-600 text-white px-6 hover:bg-orange-700"
              >
                Search
              </button>

            </div>
          </form>

        </div>
      </section>

      {/* CONTENT */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* EMPTY STATE */}
          {services.length === 0 && (
            <div className="text-center py-24">
              <p className="text-5xl">🔍</p>
              <h2 className="text-xl font-semibold mt-4 text-gray-800">
                No services found
              </h2>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}

          {/* GRID */}
          {services.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition block"
                >

                  {/* HEADER ROW */}
                  <div className="flex items-center justify-between mb-3">

                    <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                      {service.category.name}
                    </p>

                    {service.isFeatured && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}

                  </div>

                  {/* TITLE */}
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {service.title}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                    {service.description}
                  </p>

                  {/* FOOTER */}
                  <div className="mt-5 flex items-end justify-between">

                    <div>
                      <p className="text-xl font-bold text-orange-600">
                        ${service.price}
                      </p>

                      <p className="text-xs text-gray-400">
                        {service.deliveryDays} day{service.deliveryDays > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="text-right text-xs text-gray-500">
                      <p>By</p>
                      <p className="font-medium text-gray-700">
                        {service.developer.name ?? service.developer.email}
                      </p>
                    </div>

                  </div>

                </Link>
              ))}

            </div>
          )}

          {/* PAGINATION */}
          <div className="mt-10">
            <Pagination
              pagination={pagination}
              basePath="/services"
              currentSearchParams={currentSearchParams}
            />
          </div>

          {pagination.totalPages > 1 && (
            <p className="text-center text-sm text-gray-400 mt-4">
              Page {pagination.page} of {pagination.totalPages}
            </p>
          )}

        </div>
      </section>
    </div>
  );
}