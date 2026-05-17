import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Settings, Package, FileText, Archive, ShoppingBag } from "lucide-react";
import { getCurrentUser } from "@/app/lib/current-user";
import prisma from "@/app/lib/prisma";

export default async function DeveloperDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding/role");
  if (user.role !== "DEVELOPER" && user.role !== "ADMIN") redirect("/");

  const devFilter = user.role === "ADMIN" ? {} : { developerId: user.id };

  const [total, published, draft, archived, totalOrders] = await Promise.all([
    prisma.service.count({ where: devFilter }),
    prisma.service.count({ where: { ...devFilter, status: "PUBLISHED" } }),
    prisma.service.count({ where: { ...devFilter, status: "DRAFT" } }),
    prisma.service.count({ where: { ...devFilter, status: "ARCHIVED" } }),
    prisma.orderItem.count({ where: { service: devFilter } }),
  ]);

  const stats = [
    { label: "Total services", value: total, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Publiés", value: published, icon: FileText, color: "bg-green-50 text-green-600" },
    { label: "Brouillons", value: draft, icon: Settings, color: "bg-yellow-50 text-yellow-600" },
    { label: "Archivés", value: archived, icon: Archive, color: "bg-gray-50 text-gray-500" },
    { label: "Commandes reçues", value: totalOrders, icon: ShoppingBag, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">

      {/* HEADER */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <p className="text-sm font-medium text-blue-600">Espace développeur</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-2 text-sm text-gray-600">
          Connecté en tant que {user.name ?? user.email}
        </p>
      </div>

      {/* STATS */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-md ${color}`}>
              <Icon className="size-4" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="mt-1 text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Actions rapides
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/developer/services"
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600">
            <Settings className="size-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Mes services</h3>
          <p className="mt-1 text-sm text-gray-600">
            Gérer vos services publiés, brouillons et archivés.
          </p>
        </Link>

        <Link
          href="/developer/services/new"
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600">
            <Plus className="size-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Créer un service</h3>
          <p className="mt-1 text-sm text-gray-600">
            Ajouter une nouvelle offre au catalogue CodeLink.
          </p>
        </Link>
      </div>

    </main>
  );
}