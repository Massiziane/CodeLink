import prisma from "@/app/lib/prisma";
import {
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/app/actions/cart";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import {
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { Header } from "@/app/components/UserHeader";
import { AuthRequiredModal } from "../components/AuthRequireModal";

const TAXES = {
  TPS: 0.05,
  TVQ: 0.09975,
};

export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <>
        <Header />

        <AuthRequiredModal
          redirectUrl="/cart"
          title="Please sign in"
          message="You need an account to access your cart and continue shopping."
          backHref="/services"
          backLabel="Continue browsing"
        />
      </>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!dbUser) {
    return (
      <>
        <Header />

        <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
          <p className="text-gray-500">
            User not found in database.
          </p>
        </div>
      </>
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
    (acc, item) =>
      acc +
      item.service.price *
        item.quantity,
    0
  );

  const tps = subtotal * TAXES.TPS;
  const tvq = subtotal * TAXES.TVQ;

  const total =
    subtotal + tps + tvq;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* TOP */}
      <section className="border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                <ShoppingCart className="size-4" />
                Cart
              </div>

              <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">
                Shopping Cart
              </h1>

              <p className="mt-2 text-gray-500">
                {items.length} item
                {items.length !== 1
                  ? "s"
                  : ""}{" "}
                in your cart
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/services"
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
              >
                Continue browsing
              </Link>

              {items.length > 0 && (
                <form
                  action={async () => {
                    "use server";

                    await clearCart(
                      dbUser.id
                    );
                  }}
                >
                  <button className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                    <Trash2 className="size-4" />
                    Clear cart
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="container mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">

        {/* ITEMS */}
        <section className="space-y-4">

          {/* EMPTY */}
          {items.length === 0 && (
            <div className="rounded-3xl border border-gray-100 bg-white px-12 py-20 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <ShoppingCart className="size-8" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Your cart is empty
              </h2>

              <p className="mt-2 text-gray-500">
                Browse services and add
                something to your cart.
              </p>

              <Link
                href="/services"
                className="mt-6 inline-flex rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
              >
                Browse services
              </Link>
            </div>
          )}

          {/* ITEMS */}
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="grid gap-5 md:grid-cols-[1fr_130px_110px] md:items-center">

                {/* INFO */}
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-gray-900">
                    {item.service.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    $
                    {item.service.price.toFixed(
                      2
                    )}{" "}
                    per service
                  </p>
                </div>

                {/* QUANTITY */}
                <div className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50 md:w-[130px]">

                  <form
                    action={updateCartItem.bind(
                      null,
                      item.id,
                      item.quantity - 1
                    )}
                  >
                    <button className="flex h-10 w-10 items-center justify-center text-lg text-gray-600 transition hover:bg-gray-100">
                      -
                    </button>
                  </form>

                  <span className="flex w-10 items-center justify-center text-sm font-bold text-gray-900">
                    {item.quantity}
                  </span>

                  <form
                    action={updateCartItem.bind(
                      null,
                      item.id,
                      item.quantity + 1
                    )}
                  >
                    <button className="flex h-10 w-10 items-center justify-center text-lg text-gray-600 transition hover:bg-gray-100">
                      +
                    </button>
                  </form>

                </div>

                {/* PRICE */}
                <div className="w-full text-left md:w-[110px] md:text-right">

                  <p className="font-bold text-gray-900">
                    $
                    {(
                      item.service.price *
                      item.quantity
                    ).toFixed(2)}
                  </p>

                  <form
                    action={removeCartItem.bind(
                      null,
                      item.id
                    )}
                  >
                    <button className="mt-1 text-xs font-medium text-red-500 transition hover:text-red-700">
                      Remove
                    </button>
                  </form>

                </div>

              </div>
            </div>
          ))}
        </section>

        {/* SUMMARY */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">

            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3 text-sm text-gray-600">

              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>TPS</span>

                <span>
                  ${tps.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>TVQ</span>

                <span>
                  ${tvq.toFixed(2)}
                </span>
              </div>

            </div>

            <div className="mt-5 flex justify-between border-t pt-5 text-lg font-bold">

              <span>Total</span>

              <span className="text-orange-600">
                ${total.toFixed(2)}
              </span>

            </div>

            <button className="mt-6 w-full rounded-xl bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50">
              Proceed to Checkout
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
              Secure payment powered by Stripe
            </p>

          </div>
        </aside>

      </main>
    </div>
  );
}