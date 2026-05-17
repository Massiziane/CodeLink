import prisma from "@/app/lib/prisma";
import {
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/app/actions/cart";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const TAXES = {
  TPS: 0.05,
  TVQ: 0.09975,
};

export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to view your cart</p>
        </div>
      </div>
    );
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
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

      {/* HEADER BAR (consistent with app) */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">

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

            <form action={async () => {
              "use server";
              await clearCart(userId);
            }}>
              <button className="text-sm text-red-500 hover:underline">
                Clear cart
              </button>
            </form>

          </div>

        </div>
      </div>

      {/* MAIN */}
      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">

        {/* ITEMS */}
        <div className="lg:col-span-2 space-y-4">

          {items.length === 0 && (
            <div className="bg-white border rounded-2xl p-10 text-center">
              <p className="text-gray-500">Your cart is empty</p>

              <Link
                href="/services"
                className="inline-block mt-4 text-orange-600 font-medium"
              >
                Browse services →
              </Link>
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-2xl p-5 flex items-center justify-between hover:shadow-sm transition"
            >

              {/* SERVICE INFO */}
              <div className="flex-1">

                <h3 className="font-semibold text-gray-900">
                  {item.service.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  ${item.service.price.toFixed(2)} per service
                </p>

              </div>

              {/* QTY CONTROLS */}
              <div className="flex items-center gap-2">

                <form action={updateCartItem.bind(null, item.id, item.quantity - 1)}>
                  <button className="w-8 h-8 border rounded-lg hover:bg-gray-50">
                    -
                  </button>
                </form>

                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>

                <form action={updateCartItem.bind(null, item.id, item.quantity + 1)}>
                  <button className="w-8 h-8 border rounded-lg hover:bg-gray-50">
                    +
                  </button>
                </form>

              </div>

              {/* PRICE + REMOVE */}
              <div className="text-right ml-6">

                <p className="font-semibold text-gray-900">
                  ${(item.service.price * item.quantity).toFixed(2)}
                </p>

                <form action={removeCartItem.bind(null, item.id)}>
                  <button className="text-xs text-red-500 hover:underline mt-1">
                    Remove
                  </button>
                </form>

              </div>

            </div>
          ))}

        </div>

        {/* SUMMARY SIDEBAR */}
        <div className="lg:col-span-1">

          <div className="bg-white border rounded-2xl p-6 shadow-sm sticky top-24">

            <h2 className="text-lg font-bold text-gray-900 mb-4">
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

            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-orange-600">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* STRIPE READY CTA */}
            <button className="w-full mt-6 bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition">
              Proceed to Checkout
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Secure payment powered by Stripe
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}