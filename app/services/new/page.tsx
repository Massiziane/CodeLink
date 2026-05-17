import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/app/lib/prisma";
import ServiceForm from "@/app/components/services/ServiceForm";
import { Header } from "@/app/components/UserHeader";

export default async function NewServicePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* GLOBAL HEADER */}
      <Header />

      {/* HERO */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-700 text-white py-12">
        <div className="container mx-auto px-4 max-w-2xl">

          <Link
            href="/services"
            className="text-sm text-orange-100 hover:text-white"
          >
            ← Back to services
          </Link>

          <h1 className="text-3xl font-bold mt-3">
            Create a Service
          </h1>

          <p className="text-orange-100 mt-2 text-sm">
            Publish your service and start getting clients
          </p>

        </div>
      </section>

      {/* FORM SECTION */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-2xl">

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

            <ServiceForm categories={categories} />

          </div>

        </div>
      </section>

    </div>
  );
}