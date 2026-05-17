"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Header } from "@/app/components/UserHeader";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";


type ServiceOffer = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  category: {
    name: string;
    slug: string;
  };
  developer: {
    name: string | null;
  };
};

export default function OffersPage() {
  const [search, setSearch] = useState("");

  // MOCK = exactly Prisma-aligned structure
  const services: ServiceOffer[] = [
    {
      id: "1",
      title: "Landing Page Design",
      slug: "landing-page-design",
      description: "Modern UI/UX landing page optimized for conversion",
      price: 120,
      deliveryDays: 3,
      revisions: 2,
      status: "PUBLISHED",
      category: { name: "Web", slug: "web" },
      developer: { name: "John Doe" },
    },
    {
      id: "2",
      title: "REST API Development",
      slug: "api-development",
      description: "Node.js + Express backend API with authentication",
      price: 200,
      deliveryDays: 5,
      revisions: 3,
      status: "PUBLISHED",
      category: { name: "Backend", slug: "backend" },
      developer: { name: "Sarah Dev" },
    },
    {
      id: "3",
      title: "Mobile App UI",
      slug: "mobile-app-ui",
      description: "Flutter mobile UI design with modern patterns",
      price: 180,
      deliveryDays: 4,
      revisions: 2,
      status: "PUBLISHED",
      category: { name: "Mobile", slug: "mobile" },
      developer: { name: "Alex Studio" },
    },
  ];

  // only published services (matches schema logic)
  const publishedServices = useMemo(
    () => services.filter((s) => s.status === "PUBLISHED"),
    [services]
  );

  const filtered = useMemo(() => {
    return publishedServices.filter((s) => {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.name.toLowerCase().includes(q)
      );
    });
  }, [search, publishedServices]);

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">

        {/* HERO + SEARCH */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-700 text-white py-16">
          <div className="container mx-auto px-4 text-center max-w-2xl">

            <h1 className="text-4xl font-bold mb-4">
              Browse Services
            </h1>

            <p className="text-orange-100 mb-6">
              Find developers and services for your project
            </p>

            {/* SEARCH */}
            <div className="flex items-center bg-white rounded-lg overflow-hidden">
              <Search className="ml-3 text-gray-500" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services, categories..."
                className="w-full px-3 py-3 text-black outline-none"
              />
            </div>

          </div>
        </section>

        {/* GRID */}
        <section className="py-12">
          <div className="container mx-auto px-4">

            <h2 className="text-2xl font-bold mb-6">
              Available Services
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition">
                  <CardContent className="p-5">

                    {/* CATEGORY */}
                    <span className="text-xs text-orange-600 font-medium">
                      {service.category.name}
                    </span>

                    {/* TITLE */}
                    <h3 className="text-lg font-semibold mt-1">
                      {service.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-sm text-gray-600 mt-2">
                      {service.description}
                    </p>

                    {/* DEV */}
                    <p className="text-xs text-gray-500 mt-3">
                      by {service.developer.name ?? "Unknown"}
                    </p>

                    {/* META */}
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <p className="text-orange-600 font-bold">
                          ${service.price}
                        </p>
                        <p className="text-xs text-gray-500">
                          {service.deliveryDays} days • {service.revisions} revisions
                        </p>
                      </div>

                      <Link href={`/offers/${service.slug}`}>
                        <Button className="px-4 py-2">
                          View
                        </Button>
                      </Link>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-gray-500 mt-10">
                No services found.
              </p>
            )}

          </div>
        </section>

      </div>
    </>
  );
}