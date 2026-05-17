"use server";

import  prisma  from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthUser } from "../lib/auth";

export async function addToCart(serviceId: string) {
  const authResult = await getAuthUser();
  if (!authResult.success) throw new Error("Non authentifié");
  const userId = authResult.user.id;

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) throw new Error("Service introuvable");

  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: true },
    });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_serviceId: { cartId: cart.id, serviceId } },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, serviceId, quantity: 1 },
    });
  }

  revalidatePath("/cart");
}


export async function updateCartItem(cartItemId: string, quantity: number) {
  if (quantity <= 0){
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  }else{
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
export async function clearCart() {
  const authResult = await getAuthUser();
  if (!authResult.success) throw new Error("Non authentifié");

  const userId = authResult.user.id;
  
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

