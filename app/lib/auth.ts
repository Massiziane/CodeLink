import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import {
    AllowedRolesSchema,
    AuthUserSchema,
    type AppRole,
    type AuthUser,
  } from "@/schemas/auth";

type AuthFailureReason = "UNAUTHENTICATED" | "USER_NOT_FOUND" | "INVALID_USER" | "FORBIDDEN";

export type AuthResult = | { success: true; user: AuthUser } | { success: false; reason: AuthFailureReason };

async function syncAuthUser(clerkId: string){

    const clerkUser = await currentUser();
    if (!clerkUser) {
        return null;
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress ;
    if (!email) {
        return null;
    }

    return prisma.user.create({
        data: {
            clerkId,
            email,
            name: clerkUser.firstName?? clerkUser.username ?? null,
            role: "CLIENT",
        },
        select: {
            id: true,
            clerkId: true,
            email: true,
            name: true,
            role: true,
        }
    })

}

export async function getAuthUser(): Promise<AuthResult> {

    const {userId: clerkId} = await auth();
    if (!clerkId) {
      return { success: false, reason: "UNAUTHENTICATED" };
    }


    let user = await prisma.user.findUnique({
        where: { clerkId },
        select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        role: true,
        },
    });;
    if (!user) {
        user = await syncAuthUser(clerkId);
    }
    if (!user) {
        return { success: false, reason: "USER_NOT_FOUND" };
    }

    const parsedUser = AuthUserSchema.safeParse(user);
    if (!parsedUser.success) {
        return { success: false, reason: "INVALID_USER" };
    }

    return { success: true, user: parsedUser.data };
}

export async function requireAuthUser(): Promise<AuthUser>{
    
    const result = await getAuthUser();
    if (!result.success) {
        redirect("/sign-in");
    }
    return result.user;
}

export async function requireRole(allowedRoles: AppRole[]): Promise<AuthUser> {

    const parsedRoles = AllowedRolesSchema.safeParse(allowedRoles);
    if (!parsedRoles.success) {
        throw new Error("Invalid roles configuration");
    }

    const user = await requireAuthUser();
    if (!parsedRoles.data.includes(user.role)) {
        redirect("/");
    }

    return user;
}

export async function requireDeveloper(): Promise<AuthUser> {
    return requireRole(["DEVELOPER", "ADMIN"]);
}