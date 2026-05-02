"use client";

import { useState } from "react";
import "../styles/cart.css";

const TAXES = {
  TPS: 0.05,
  TVQ: 0.09975,
};

type Item = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

const initialProducts = [
  { id: "1", title: "Website Design", price: 120 },
  { id: "2", title: "Logo Creation", price: 60 },
  { id: "3", title: "Mobile App Development", price: 180 },
  { id: "4", title: "E-commerce Website", price: 240 },
  { id: "5", title: "Custom Software Development", price: 300 },
];

export default function CartPage() {
  const [items, setItems] = useState<Item[]>([]);

  function addItem(product: (typeof initialProducts)[0]) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tps = subtotal * TAXES.TPS;
  const tvq = subtotal * TAXES.TVQ;
  const total = subtotal + tps + tvq;

  return (
    <div className="cart-layout">

      {/* LEFT - PRODUCTS */}
      <div className="panel">
        <div className="panel-header">
          <h2>Products</h2>
        </div>

        {initialProducts.map((p) => (
          <div key={p.id} className="product-card">
            <div>
              <h3>{p.title}</h3>
              <p>${p.price.toFixed(2)}</p>
            </div>

            <button className="primary" onClick={() => addItem(p)}>
              Add
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT - CART */}
      <div className="panel">
        <div className="panel-header row">
          <h2>Your Cart</h2>

          <button className="danger-outline" onClick={clearCart}>
            Clear
          </button>
        </div>

        {items.length === 0 && (
          <p className="empty">Your cart is empty</p>
        )}

        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div>
              <h4>{item.title}</h4>
              <p className="muted">${item.price.toFixed(2)}</p>
            </div>

            <div className="qty">
              <button onClick={() => updateQty(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQty(item.id, 1)}>+</button>
            </div>

            <div className="right">
              <p>${(item.price * item.quantity).toFixed(2)}</p>

              <button
                className="danger-text"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* SUMMARY */}
        <div className="summary">
          <p>Subtotal <span>${subtotal.toFixed(2)}</span></p>
          <p>TPS <span>${tps.toFixed(2)}</span></p>
          <p>TVQ <span>${tvq.toFixed(2)}</span></p>

          <h3>Total <span>${total.toFixed(2)}</span></h3>

          <button
            className="checkout"
            onClick={() => alert("going to payment")}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}