export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SKELETON (NEW — matches real page) */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-700 py-14">
        <div className="container mx-auto px-4 max-w-6xl">

          <div className="space-y-4">

            <div className="h-10 w-72 bg-white/20 rounded animate-pulse" />

            <div className="h-5 w-96 bg-white/20 rounded animate-pulse" />

            <div className="h-4 w-56 bg-white/20 rounded animate-pulse" />

          </div>

        </div>
      </section>

      {/* CONTENT SKELETON */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >

                {/* category */}
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-4" />

                {/* title */}
                <div className="h-5 w-full bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse mb-4" />

                {/* description */}
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse mb-4" />

                {/* footer */}
                <div className="flex justify-between items-center">

                  <div>
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>

                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />

                </div>

              </div>
            ))}

          </div>

          {/* PAGINATION SKELETON */}
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}