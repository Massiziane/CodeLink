import prisma from "@/app/lib/prisma";
import {
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/app/actions/cart";
import { AuthRequiredModal } from "../components/AuthRequireModal";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const TAXES = {
  TPS: 0.05,
  TVQ: 0.09975,
};

export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <AuthRequiredModal
        redirectUrl="/cart"
        title="Please sign in"
        message="You need an account to access your cart and continue shopping."
        backHref="/services"
        backLabel="Continue browsing"
      />
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">User not found in database.</p>
      </div>
    );
  }

  const cart = await prisma.cart.findUnique({
    where: {
      userId: dbUser.id,
    },
    include: {
      items: {
        include: {
          service: true,
        },
      },
    },
  });

  const items = cart?.items ?? [];

  const subtotal = items.reduce(
    (acc, item) => acc + item.service.price * item.quantity,
    0
  );

  const tps = subtotal * TAXES.TPS;
  const tvq = subtotal * TAXES.TVQ;
  const total = subtotal + tps + tvq;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>

            <p className="text-sm text-gray-500">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/services"
              className="text-sm text-gray-500 hover:text-black"
            >
              Continue browsing
            </Link>

            <form
              action={async () => {
                "use server";
                await clearCart(dbUser.id);
              }}
            >
              <button className="text-sm text-red-500 hover:underline">
                Clear cart
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.length === 0 && (
            <div className="rounded-2xl border bg-white p-10 text-center">
              <p className="text-gray-500">Your cart is empty</p>

              <Link
                href="/services"
                className="mt-4 inline-block font-medium text-orange-600"
              >
                Browse services →
              </Link>
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border bg-white p-5 transition hover:shadow-sm"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {item.service.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  ${item.service.price.toFixed(2)} per service
                </p>
              </div>

              <div className="flex items-center gap-2">
                <form
                  action={updateCartItem.bind(null, item.id, item.quantity - 1)}
                >
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-gray-50">
                    -
                  </button>
                </form>

                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>

                <form
                  action={updateCartItem.bind(null, item.id, item.quantity + 1)}
                >
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-gray-50">
                    +
                  </button>
                </form>
              </div>

              <div className="ml-6 text-right">
                <p className="font-semibold text-gray-900">
                  ${(item.service.price * item.quantity).toFixed(2)}
                </p>

                <form action={removeCartItem.bind(null, item.id)}>
                  <button className="mt-1 text-xs text-red-500 hover:underline">
                    Remove
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>TPS</span>
                <span>${tps.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>TVQ</span>
                <span>${tvq.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total</span>
              <span className="text-orange-600">${total.toFixed(2)}</span>
            </div>

            <button className="mt-6 w-full rounded-xl bg-orange-600 py-3 font-medium text-white transition hover:bg-orange-700">
              Proceed to Checkout
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}