import {z} from "zod";

export const RoleSchema = z.enum(["CLIENT", "DEVELOPER", "ADMIN"]);

export const AuthUserSchema = z.object({
    id: z.string().min(1),
    clerkId: z.string().min(1),
    email: z.string().email(),
    name: z.string().nullable(),
    role: RoleSchema,
});

export const AllowedRolesSchema = z.array(RoleSchema).min(1, "Au moins un rôle doit être spécifié");

export type AppRole = z.infer<typeof RoleSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;