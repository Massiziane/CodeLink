import { Rocket, Shield, Zap, ArrowRight } from "lucide-react";

import { Header } from "@/app/components/UserHeader";
import { Card, CardContent } from "@/app/components/ui/card";
import { SignUpAlertModal } from "@/app/components/SignUpAlertModal";
import { HomeServiceModalCard } from "../app/components/HomeServiceModalCard";
import { getPublishedServices } from "../app/actions/services";

export default async function Home() {
  const publishedServices = await getPublishedServices();

  const featuredServices = publishedServices.slice(0, 3);

  return (
    <>
      <SignUpAlertModal />

      <Header />

      <div className="min-h-screen">
        <section className="bg-gradient-to-br from-orange-500 to-orange-700 text-white py-20">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trouvez les meilleurs développeurs pour vos projets
            </h1>

            <p className="text-xl mb-8 text-orange-100">
              CodeLink connecte vos idées avec des développeurs experts.
            </p>

            <a
              href="/services"
              className="inline-flex items-center px-5 py-3 rounded-lg bg-black text-white hover:bg-zinc-800 transition"
            >
              Explorer les services
              <ArrowRight className="ml-2 size-4" />
            </a>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Pourquoi choisir CodeLink ?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Rocket className="mx-auto mb-4 text-orange-600" />
                  <h3 className="font-semibold">Rapide</h3>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Shield className="mx-auto mb-4 text-orange-600" />
                  <h3 className="font-semibold">Sécurisé</h3>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Zap className="mx-auto mb-4 text-orange-600" />
                  <h3 className="font-semibold">Efficace</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">
              Services populaires
            </h2>

            {featuredServices.length === 0 ? (
              <div className="rounded-2xl border bg-gray-50 p-10 text-center">
                <p className="text-gray-500">
                  Aucun service disponible pour le moment.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredServices.map((service) => (
                  <HomeServiceModalCard
                    key={service.id}
                    service={service}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}