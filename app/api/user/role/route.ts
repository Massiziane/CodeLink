import prisma from "@/app/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { role } = await req.json();

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
    const name = clerkUser?.firstName ?? clerkUser?.username ?? null;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ clerkId: userId }, { email }] },
    });

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { clerkId: userId, role },
      });
    } else {
      await prisma.user.create({
        data: { clerkId: userId, email, name, role },
      });
    }

    revalidatePath("/");
    revalidatePath("/developer");
    revalidatePath("/services");

    return Response.json({ ok: true });
  } catch (error) {
    console.error("POST /api/user/role:", error);
    return Response.json({ ok: false, message: "Erreur interne" }, { status: 500 });
  }
}