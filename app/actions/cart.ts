"use server";

import  prisma  from "../lib/prisma";
import { revalidatePath } from "next/cache";

export async function addToCart(
  userId: string,
  serviceId: string
) {
  // 1. Get service
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  // 2. Get or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
      include: { items: true },
    });
  }

  // 3. Check existing item
  const existingItem =
    await prisma.cartItem.findUnique({
      where: {
        cartId_serviceId: {
          cartId: cart.id,
          serviceId,
        },
      },
    });

  // 4. Increment quantity
  if (existingItem) {
    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });
  } else {
    // 5. Create item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        serviceId,
        quantity: 1,
      },
    });
  }

  // REFRESH PAGES
  revalidatePath("/cart");
  revalidatePath("/services");
  revalidatePath(`/services/${service.id}`);
}

export async function updateCartItem(
  cartItemId: string,
  quantity: number
) {
  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  } else {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
}

export async function removeCartItem(cartItemId: string) {
  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  revalidatePath("/cart");
}

// clear cart
export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) return;

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  revalidatePath("/cart");
}

// get cart count
export async function getCartCount(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart) return 0;

  return cart.items.reduce((acc, item) => acc + item.quantity, 0);
}

