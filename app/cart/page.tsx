// app/cart/page.tsx

import prisma from "../lib/prisma";
import { updateCartItem, removeCartItem, clearCart } from "@/app/actions/cart";
import { revalidatePath } from "next/cache";

const TAXES = {
  TPS: 0.05,
  TVQ: 0.09975,
};

export default async function CartPage({
  searchParams,
}: {
  searchParams: { userId?: string };
}) {
  const userId = searchParams.userId; // Clerk later

  if (!userId) {
    return <p className="p-6">No user found</p>;
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">
          Add services to start building your order
        </p>
      </div>
    );
  }

  // subtotal
  const subtotal = cart.items.reduce((acc, item) => {
    return acc + item.quantity * item.service.price;
  }, 0);

  // taxes
  const tps = subtotal * TAXES.TPS;
  const tvq = subtotal * TAXES.TVQ;

  const total = subtotal + tps + tvq;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Cart</h1>

        <form
          action={async () => {
            "use server";
            await clearCart(userId);
          }}
        >
          <button className="text-red-600 hover:underline">
            Clear Cart
          </button>
        </form>
      </div>

      {/* CART ITEMS */}
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border p-4 rounded-lg"
          >
            {/* LEFT */}
            <div>
              <h3 className="font-semibold">{item.service.title}</h3>
              <p className="text-sm text-gray-500">
                ${item.service.price.toFixed(2)}
              </p>
            </div>

            {/* MIDDLE (QTY CONTROLS) */}
            <div className="flex items-center gap-2">
              <form
                action={async () => {
                  "use server";
                  await updateCartItem(item.id, item.quantity - 1);
                }}
              >
                <button className="px-2 py-1 border rounded">-</button>
              </form>

              <span className="px-3">{item.quantity}</span>

              <form
                action={async () => {
                  "use server";
                  await updateCartItem(item.id, item.quantity + 1);
                }}
              >
                <button className="px-2 py-1 border rounded">+</button>
              </form>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <p className="font-semibold">
                ${(item.quantity * item.service.price).toFixed(2)}
              </p>

              <form
                action={async () => {
                  "use server";
                  await removeCartItem(item.id);
                }}
              >
                <button className="text-red-500 text-sm hover:underline">
                  Remove
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="border-t pt-6 space-y-2 text-right">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>TPS (5%): ${tps.toFixed(2)}</p>
        <p>TVQ (9.975%): ${tvq.toFixed(2)}</p>

        <p className="text-xl font-bold">
          Total: ${total.toFixed(2)}
        </p>
      </div>
    </div>
  );
}