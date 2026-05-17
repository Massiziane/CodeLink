import prisma from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const { role } = await req.json();

  await prisma.user.update({
    where: {
      clerkId: userId,
    },
    data: {
      role,
    },
  });

  // IMPORTANT
  revalidatePath("/");
  revalidatePath("/developer");
  revalidatePath("/services");

  return Response.json({
    ok: true,
  });
}