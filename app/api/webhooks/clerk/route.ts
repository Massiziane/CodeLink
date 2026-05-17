import { headers } from "next/headers";
import { Webhook } from "svix";

import  prisma from "../../../lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", {
      status: 400,
    });
  }

  const payload = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);

  let event: any;

  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);

    return new Response("Invalid signature", {
      status: 400,
    });
  }

  const eventType = event.type;

  // USER CREATED
  if (eventType === "user.created") {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
    } = event.data;

    const email = email_addresses[0]?.email_address;

    try {
      await prisma.user.create({
        data: {
          clerkId: id,
          email,
          name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        },
      });

      console.log("User synced to DB");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  // USER UPDATED
  if (eventType === "user.updated") {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
    } = event.data;

    const email = email_addresses[0]?.email_address;

    try {
      await prisma.user.update({
        where: {
          clerkId: id,
        },
        data: {
          email,
          name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        },
      });

      console.log("User updated");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  // USER DELETED
  if (eventType === "user.deleted") {
    const { id } = event.data;

    try {
      await prisma.user.delete({
        where: {
          clerkId: id,
        },
      });

      console.log("User deleted");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return new Response("Webhook received", {
    status: 200,
  });
}