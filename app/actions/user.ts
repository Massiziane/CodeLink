"use server"

import { currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";


export async function syncUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("Unauthorized");

  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (user) return user;

  user = await prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      name: clerkUser.firstName ?? "",
    },
  });

  return user;
}

export async function getCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  return user;
}