"use client";

import { useMemo } from "react";
import toast from "react-hot-toast";

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

type Props = {
  items: CartItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
};


export default function Cart({ items = [], onRemove, onClear }: Props) {
  // calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const tps = useMemo(() => subtotal * 0.05, [subtotal]);
  const tvq = useMemo(() => subtotal * 0.09975, [subtotal]);

  const total = useMemo(() => subtotal + tps + tvq, [subtotal, tps, tvq]);

  // actions
  const handleRemove = (id: string) => {
    onRemove(id);
    toast.success("Item removed from cart");
  };

  const handleClear = () => {
    onClear();
    toast("Cart cleared", { icon: "🧹" });
  };

  return (
    <div className="bg-black text-white p-6 rounded-2xl w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Cart</h2>

      {items.length === 0 ? (
        <p className="text-gray-400">Your cart is empty</p>
      ) : (
        <>
          {/* ITEMS */}
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b border-white/20 pb-2"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-400">
                    ${item.price} × {item.quantity}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-sm border border-white px-2 py-1 rounded hover:bg-white hover:text-black transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* TOTALS */}
          <div className="space-y-2 text-sm border-t border-white/20 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>TPS (5%)</span>
              <span>${tps.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>TVQ (9.975%)</span>
              <span>${tvq.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-semibold text-base pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex gap-2">
            <button
              onClick={handleClear}
              className="flex-1 border border-white py-2 rounded hover:bg-white hover:text-black transition"
            >
              Clear Cart
            </button>

            <button className="flex-1 bg-white text-black py-2 rounded hover:opacity-80 transition">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}