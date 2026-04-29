import { getServiceById } from "@/lib/queries/services";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/app/lib/prisma";
import ServiceForm from "@/app/components/services/ServiceForm";
import type { ServiceModel } from "@/app/generated/prisma/models/Service";

type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;

  const [service, categories] = await Promise.all([
    getServiceById(id),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!service) notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/services/${id}`} className="text-sm text-blue-600 hover:underline">
          ← Retour au service
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Modifier le service</h1>
      <ServiceForm
        service={service as unknown as ServiceModel}
        categories={categories}
      />
    </main>
  );
}
