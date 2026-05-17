
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import ServiceForm from "@/app/components/services/ServiceForm";
import { getCurrentUser } from "@/app/lib/current-user";

export default async function NewDeveloperServicePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding/role");
  if (user.role !== "DEVELOPER" && user.role !== "ADMIN") redirect("/");

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/developer/services"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Retour à mes services
        </Link>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-blue-600">Espace développeur</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Créer un service
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Ajoutez une nouvelle offre au catalogue CodeLink.
        </p>
      </div>

      <ServiceForm categories={categories} />
    </main>
  );
}
