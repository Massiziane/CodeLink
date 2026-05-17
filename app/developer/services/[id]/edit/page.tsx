import { getServiceById } from "@/lib/queries/services";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/app/lib/prisma";
import ServiceForm from "@/app/components/services/ServiceForm";
import type { ServiceModel } from "@/app/generated/prisma/models/Service";
import { requireDeveloper } from "@/app/lib/auth";


type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const user = await requireDeveloper();

  const [service, categories] = await Promise.all([
    getServiceById(id),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!service) notFound();
  if (user.role !== "ADMIN" && service.developerId !== user.id) {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link href="/developer/services" className="text-sm font-medium text-blue-600 hover:underline">
          ← Retour à mes services
        </Link>
      </div>
      <div className="mb-6">
        <p className="text-sm font-medium text-blue-600">Espace développeur</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Modifier le service</h1>
        <p className="mt-2 text-sm text-gray-600">Mettez à jour les informations de votre offre.</p>
      </div>
      <ServiceForm
        service={service as unknown as ServiceModel}
        categories={categories}
      />
    </main>
  );
}
