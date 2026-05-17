import Link from "next/link";
import {Plus} from "lucide-react";
import prisma from "@/app/lib/prisma";
import { requireDeveloper } from "@/app/lib/auth";

const statusLabels: Record<string, string> = {
    DRAFT: "Brouillon",
    PUBLISHED: "Publié",
    ARCHIVED: "Archivé",
};

const statusClasses: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    PUBLISHED: "bg-green-100 text-green-700",
    ARCHIVED: "bg-red-100 text-red-700",
};

export default async function DeveloperServicesPage() {
    const user = await requireDeveloper();

    const services = await prisma.service.findMany({
        where: user.role === "ADMIN" ? {} : { developerId: user.id },
        include: {
            category: {
                select: { name: true },
            },
            _count: {
                select: { orderItems: true },
            },
        },
        orderBy: { createdAt: "desc" },
        
    });
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <p className="text-sm font-medium text-blue-600">Espace développeur</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">Mes services</h1>
            <p className="mt-2 text-sm text-gray-600">
              {services.length} service{services.length !== 1 ? "s" : ""} à gérer.
            </p>
          </div>

          <Link
            href="/developer/services/new"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="size-4" />
            Créer
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Aucun service pour l’instant
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Créez votre premier service pour commencer à vendre sur CodeLink.
            </p>
            <Link
              href="/developer/services/new"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="size-4" />
              Créer un service
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Catégorie</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Prix</th>
                  <th className="px-4 py-3 font-medium">Commandes</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{service.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                        {service.description}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {service.category.name}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusClasses[service.status] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {statusLabels[service.status] ?? service.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {service.price.toFixed(2)} $
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {service._count.orderItems}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/services/${service.id}`}
                          className="text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                          Voir
                        </Link>
                        <Link
                          href={`/developer/services/${service.id}/edit`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Modifier
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    );

}