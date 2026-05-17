import prisma from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({
      count: 0,
    });
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!dbUser) {
    return Response.json({
      count: 0,
    });
  }

  const cart = await prisma.cart.findUnique({
    where: {
      userId: dbUser.id,
    },
    include: {
      items: true,
    },
  });

  const count =
    cart?.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    ) ?? 0;

  return Response.json({
    count,
  });
}