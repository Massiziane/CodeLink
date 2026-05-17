import { getServiceById } from "@/lib/queries/services";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteServiceButton from "@/app/components/services/DeleteServiceButton";
import { Header } from "@/app/components/UserHeader"; // ✅ added header

type Props = { params: Promise<{ id: string }> };

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publié",
  ARCHIVED: "Archivé",
};

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) notFound();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* GLOBAL HEADER */}
      <Header />

      {/* TOP BAR */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">

          <Link
            href="/services"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Back to services
          </Link>

          <div className="flex gap-2">
            <Link
              href={`/services/${id}/edit`}
              className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Edit
            </Link>

            <DeleteServiceButton id={id} />
          </div>

        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-2">

          <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
            {service.category.name}
          </span>

          <h1 className="text-4xl font-bold text-gray-900 mt-2 leading-tight">
            {service.title}
          </h1>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              {statusLabels[service.status]}
            </span>
          </div>

          <p className="mt-6 text-gray-600 leading-relaxed text-lg">
            {service.description}
          </p>

          {/* DEVELOPER CARD (upgraded) */}
          <div className="mt-10 bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Developer</p>
            <p className="font-semibold text-gray-900">
              {service.developer.name ?? service.developer.email}
            </p>
          </div>

        </div>

        {/* RIGHT SIDEBAR (PROFESSIONAL CARD) */}
        <div className="lg:col-span-1">

          <div className="sticky top-24 bg-white border rounded-2xl p-6 shadow-sm">

            <p className="text-4xl font-bold text-orange-600">
              ${service.price}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              One-time payment
            </p>

            <div className="mt-6 space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="font-medium text-gray-900">
                  {service.deliveryDays} days
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Revisions</span>
                <span className="font-medium text-gray-900">
                  {service.revisions}
                </span>
              </div>

            </div>

            <button className="w-full mt-6 bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition">
              Continue
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}