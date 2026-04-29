import { getServiceById } from "@/lib/queries/services";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteServiceButton from "@/app/components/services/DeleteServiceButton";

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
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/services" className="text-sm text-blue-600 hover:underline">
          ← Retour aux services
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/services/${id}/edit`}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Modifier
          </Link>
          <DeleteServiceButton id={id} />
        </div>
      </div>

      <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
        {service.category.name}
      </p>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mb-4">
        {statusLabels[service.status] ?? service.status}
      </span>
      <p className="text-gray-600 mb-8 leading-relaxed">{service.description}</p>

      <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-5 mb-6">
        <div>
          <p className="text-xs text-gray-500 mb-1">Prix</p>
          <p className="text-2xl font-bold text-gray-900">{service.price.toFixed(2)} $</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Délai</p>
          <p className="text-2xl font-bold text-gray-900">
            {service.deliveryDays} jour{service.deliveryDays > 1 ? "s" : ""}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Révisions</p>
          <p className="text-2xl font-bold text-gray-900">{service.revisions}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Proposé par{" "}
        <span className="font-medium text-gray-700">
          {service.developer.name ?? service.developer.email}
        </span>
      </p>
    </main>
  );
}
