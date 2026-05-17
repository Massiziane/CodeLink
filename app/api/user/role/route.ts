import prisma from "@/app/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { role } = await req.json();

    if (role !== "CLIENT" && role !== "DEVELOPER") {
      return Response.json(
        { ok: false, error: "Invalid role" },
        { status: 400 }
      );
    }

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return Response.json(
        { ok: false, error: "Clerk user not found" },
        { status: 404 }
      );
    }

    await prisma.user.upsert({
      where: {
        clerkId: userId,
      },
      update: {
        role,
      },
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
        role,
      },
    });

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/developer");
    revalidatePath("/onboarding/role");

    return Response.json({ ok: true });
  } catch (error) {
    console.error("ROLE UPDATE ERROR:", error);

    return Response.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}