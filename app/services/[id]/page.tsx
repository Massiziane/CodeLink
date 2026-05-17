import { getServiceById } from "@/lib/queries/services";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/app/components/UserHeader";
import { AddToCartSubmitButton } from "@/app/components/AddToCartSubmitButton";
import { addToCart } from "@/app/actions/cart";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publié",
  ARCHIVED: "Archivé",
};

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const service = await getServiceById(id);
  const { userId } = await auth();

  if (!service) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-x-1 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            <span>Back to services</span>
          </Link>
        </div>
      </section>

      <main className="container mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
        <section className="space-y-8">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
                {service.category.name}
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {statusLabels[service.status]}
              </span>

              {service.isFeatured && (
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold leading-tight text-gray-950 md:text-5xl">
              {service.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              {service.description}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Price</p>
              <p className="mt-2 text-2xl font-bold text-orange-600">
                ${service.price}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Delivery</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {service.deliveryDays} days
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Revisions</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {service.revisions}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              About this service
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              This service is offered by an independent developer on CodeLink.
              Review the delivery time, revisions, and project details before
              adding it to your cart.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Developer</h2>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-xl font-bold text-orange-700">
                {(service.developer.name ?? service.developer.email)
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  {service.developer.name ?? service.developer.email}
                </p>
                <p className="text-sm text-gray-500">
                  Verified CodeLink seller
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
            <p className="text-sm font-medium text-gray-500">Starting at</p>

            <p className="mt-2 text-5xl font-bold text-orange-600">
              ${service.price}
            </p>

            <p className="mt-2 text-sm text-gray-500">One-time payment</p>

            <div className="mt-6 space-y-4 rounded-2xl bg-gray-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="font-semibold text-gray-900">
                  {service.deliveryDays} days
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Revisions</span>
                <span className="font-semibold text-gray-900">
                  {service.revisions}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="font-semibold text-gray-900">
                  {service.category.name}
                </span>
              </div>
            </div>

 <form
  action={async () => {
    "use server";

    if (!userId) return;

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!dbUser) return;

    await addToCart(dbUser.id, id);

    redirect(`/services/${id}`);
  }}
>
  <AddToCartSubmitButton />
</form>

            <Link href="/cart">
              <button className="mt-3 w-full rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-50">
                Go to Cart
              </button>
            </Link>

            <p className="mt-4 text-center text-xs text-gray-400">
              Secure cart powered by database
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}