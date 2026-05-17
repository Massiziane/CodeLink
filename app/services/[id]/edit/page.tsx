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
    <div className="min-h-screen bg-gray-50">

      {/* HERO (consistent with rest of app) */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-700 text-white py-12">
        <div className="container mx-auto px-4 max-w-2xl">

          <Link
            href={`/services/${id}`}
            className="text-sm text-orange-100 hover:text-white"
          >
            ← Back to service
          </Link>

          <h1 className="text-3xl font-bold mt-3">
            Edit Service
          </h1>

          <p className="text-orange-100 mt-2 text-sm">
            Update your service details and pricing
          </p>

        </div>
      </section>

      {/* FORM SECTION */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-2xl">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <ServiceForm
              service={service as unknown as ServiceModel}
              categories={categories}
            />

          </div>

        </div>
      </section>

    </div>
  );
}
