import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/app/lib/prisma";
import ServiceForm from "@/app/components/services/ServiceForm";

export default async function NewServicePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/services" className="text-sm text-blue-600 hover:underline">
          ← Retour aux services
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Créer un service</h1>
      <ServiceForm categories={categories} />
    </main>
  );
}
