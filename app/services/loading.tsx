// B.3 — Squelette de chargement affiché automatiquement par Next.js
// pendant le chargement du Server Component ServicesPage
export default function ServicesLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Titre squelette */}
      <div className="h-9 w-64 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-8" />

      {/* Grille de cartes squelettes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
          >
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-5 w-full bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="flex justify-between mt-4">
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination squelette */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-10 bg-gray-200 rounded-md animate-pulse" />
        ))}
      </div>
    </main>
  );
}
