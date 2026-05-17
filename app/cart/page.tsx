
import { requireAuthUser } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { CartClient } from "@/app/components/cart/CartClient";
import { Header } from "@/app/components/header";

import "../styles/cart.css";

export default async function CartPage() {
  const user = await requireAuthUser();

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          service: {
            select: { id: true, title: true, price: true },
          },
        },
      },
    },
  });

  const services = await prisma.service.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true, price: true },
    orderBy: { isFeatured: "desc" },
    take: 20,
  });

  const initialItems = cart?.items ?? [];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">Panier</h1>
          <CartClient initialItems={initialItems} services={services} />
        </div>
      </div>
    </>
  );
}