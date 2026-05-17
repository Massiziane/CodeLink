
import Link from "next/link";
import {  Rocket, Shield, Zap, ArrowRight } from "lucide-react";

import { Header } from "@/app/components/header";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { ServiceCard, type Service } from "@/app/components/ServiceCard";
import { getServicesLight } from "@/lib/queries/services";
import { getAuthUser } from "@/app/lib/auth";
import { LayoutDashboard } from "lucide-react";

export default async function Home() {
  const [servicesData, authResult] = await Promise.all([
    getServicesLight(),
    getAuthUser(),
  ]);
  const isDeveloper = authResult.success && (authResult.user.role === "DEVELOPER" || authResult.user.role === "ADMIN");
  const service = servicesData;
  const featured = service.slice(0, 6); // Juste pour l'exemple, on prend les 6 premiers comme "populaires"
  

    return (
      <>
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
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/services">
                  <Button className="inline-flex items-center">
                    Explorer les services
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                {isDeveloper && (
                  <Link href="/developer">
                    <Button className="inline-flex items-center">
                      <LayoutDashboard className="mr-2 size-4" />
                      Mon dashboard
                    </Button>
                  </Link>
                )}
              </div>
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
              <h2 className="text-3xl font-bold mb-8">Services populaires</h2>
              {featured.length === 0 ? (
                <p className="text-gray-500">Aucun service disponible pour l&apos;instant.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((service) => (
                    <ServiceCard key={service.id} service={service as Service} />
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </>
  );
}
