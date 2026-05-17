"use client";

import { useState, useTransition } from "react";
import { addToCart, updateCartItem, removeCartItem,clearCart } from "@/app/actions/cart";


const TAXES = {tps: 0.05, tvq: 0.09975};

type Service = {
    id: string;
    title: string;
    price: number;
    
};

type CartItem = {
    id: string;
    service: Service;
    quantity: number;
};

type Props = {
    initialItems: CartItem[];
    services: Service[];
};

export function CartClient({ initialItems, services }: Props) {
    const [items, setItems] = useState<CartItem[]>(initialItems);
    const [isPending, startTransition] = useTransition();

    function handleAdd(service : Service) {
        startTransition(async () => {
            await addToCart(service.id);
            setItems((prev) => {
                const existing = prev.find((i) => i.service.id === service.id);
                if (existing) {
                    return prev.map((i) =>
                        i.service.id === service.id ? { ...i, quantity: i.quantity + 1 } : i
                    );
                }
                return [...prev, { id: crypto.randomUUID(), quantity: 1, service }];
            });
        }); 
    }

    function handleUpdate(itemId: string, serviceId: string, delta: number) {
        const item = items.find((i) => i.id === itemId);
        if (!item) return;

        const newQty = item.quantity + delta;
        startTransition(async () => {
            await updateCartItem(itemId, newQty);
            setItems((prev) =>
                newQty <= 0
                    ? prev.filter((i) => i.id !== itemId)
                    : prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
            );
        });
    }

    function handleRemove(itemId: string) {
        startTransition(async () => {
            await removeCartItem(itemId);
            setItems((prev) => prev.filter((i) => i.id !== itemId));
        });
    }

    function handleClear() {
        startTransition(async () => {
            await clearCart();
            setItems([]);
        });
    }

    const subtotal = items.reduce((acc, i ) => acc + i.service.price * i.quantity, 0);
    const tps = subtotal * TAXES.tps;
    const tvq = subtotal * TAXES.tvq;
    const total = subtotal + tps + tvq;


      return (
        <div className="grid md:grid-cols-2 gap-6 p-6 max-w-5xl mx-auto">

        {/* SERVICES */}
        <div className="bg-white rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-4">Services disponibles</h2>
            <div className="space-y-3">
            {services.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-sm text-gray-500">{s.price}€</p>
                </div>
                <button
                    onClick={() => handleAdd(s)}
                    disabled={isPending}
                    className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
                >
                    Ajouter
                </button>
                </div>
            ))}
            </div>
        </div>

        {/* PANIER */}
        <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Votre panier</h2>
            {items.length > 0 && (
                <button
                onClick={handleClear}
                disabled={isPending}
                className="text-sm text-red-500 hover:underline disabled:opacity-50"
                >
                Vider
                </button>
            )}
            </div>

            {items.length === 0 ? (
            <p className="text-gray-400 text-sm">Votre panier est vide.</p>
            ) : (
            <div className="space-y-3">
                {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                    <p className="font-medium">{item.service.title}</p>
                    <p className="text-sm text-gray-500">{item.service.price}€</p>
                    </div>
                    <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleUpdate(item.id, item.service.id, -1)}
                        disabled={isPending}
                        className="w-6 h-6 border rounded text-center leading-none hover:bg-gray-100"
                    >-</button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                        onClick={() => handleUpdate(item.id, item.service.id, 1)}
                        disabled={isPending}
                        className="w-6 h-6 border rounded text-center leading-none hover:bg-gray-100"
                    >+</button>
                    </div>
                    <div className="text-right ml-3 min-w-[60px]">
                    <p className="text-sm font-medium">{(item.service.price * item.quantity).toFixed(2)}€</p>
                    <button
                        onClick={() => handleRemove(item.id)}
                        disabled={isPending}
                        className="text-xs text-red-500 hover:underline"
                    >Retirer</button>
                    </div>
                </div>
                ))}
            </div>
            )}

            {items.length > 0 && (
            <div className="mt-4 pt-4 border-t space-y-1 text-sm">
                <div className="flex justify-between"><span>Sous-total</span><span>{subtotal.toFixed(2)}€</span></div>
                <div className="flex justify-between text-gray-500"><span>TPS (5%)</span><span>{tps.toFixed(2)}€</span></div>
                <div className="flex justify-between text-gray-500"><span>TVQ (9.975%)</span><span>{tvq.toFixed(2)}€</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total</span><span>{total.toFixed(2)}€</span>
                </div>
                <button className="w-full mt-3 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600">
                Procéder au paiement
                </button>
            </div>
            )}
        </div>
        </div>
  );


}