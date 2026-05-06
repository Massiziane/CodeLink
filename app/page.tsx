"use client";

import Link from "next/link";
import { Code2, Rocket, Shield, Zap, ArrowRight } from "lucide-react";

import { Header } from "@/app/components/header";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { ServiceCard } from "@/app/components/ServiceCard";

export default function Home() {
  const featuredServices = [
    {
      id: "1",
      title: "Landing Page Design",
      slug: "landing-page-design",
      description: "Modern landing page UI/UX design",
      price: 120,
      deliveryDays: 3,
      revisions: 2,
      status: "PUBLISHED",
      isFeatured: true,
      category: { name: "Web", slug: "web" },
      developer: { name: "John Doe" },
    },
    {
      id: "2",
      title: "API Development",
      slug: "api-development",
      description: "REST API with Node.js",
      price: 200,
      deliveryDays: 5,
      revisions: 3,
      status: "PUBLISHED",
      isFeatured: false,
      category: { name: "Backend", slug: "api" },
      developer: { name: "Sarah Dev" },
    },
    {
      id: "3",
      title: "Mobile App UI",
      slug: "mobile-app-ui",
      description: "Flutter mobile UI design",
      price: 180,
      deliveryDays: 4,
      revisions: 2,
      status: "PUBLISHED",
      isFeatured: true,
      category: { name: "Mobile", slug: "mobile" },
      developer: { name: "Alex Studio" },
    },
  ];

  return (
    <>
      {/* HEADER */}
      <Header />

      <div className="min-h-screen">

        {/* HERO */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-700 text-white py-20">
          <div className="container mx-auto px-4 text-center max-w-3xl">

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trouvez les meilleurs développeurs pour vos projets
            </h1>

            <p className="text-xl mb-8 text-orange-100">
              CodeLink connecte vos idées avec des développeurs experts.
            </p>

            <Link href="/services">
              <Button className="inline-flex items-center">
                Explorer les services
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>

          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">

            <h2 className="text-3xl font-bold text-center mb-12">
              Pourquoi choisir CodeLink ?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

              <Card>
                <CardContent className="pt-6 text-center">
                  <Rocket className="mx-auto mb-4" />
                  <h3 className="font-semibold">Rapide</h3>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Shield className="mx-auto mb-4" />
                  <h3 className="font-semibold">Sécurisé</h3>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Zap className="mx-auto mb-4" />
                  <h3 className="font-semibold">Efficace</h3>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-16">
          <div className="container mx-auto px-4">

            <h2 className="text-3xl font-bold mb-8">
              Services populaires
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service as any} />
              ))}
            </div>

          </div>
        </section>

      </div>
    </>
  );
}