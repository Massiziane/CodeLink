import prisma from "./prisma";
import { randomUUID } from "node:crypto";

type TransactionResult<T> =
  | ({ success: true } & T)
  | { success: false; error: string };

type CreateDeveloperInput = {
  clerkId: string;
  email: string;
  name?: string;
};

type CreateProfileInput = {
  bio?: string;
  avatarUrl?: string;
  companyName?: string;
  phone?: string;
};

type CreateServiceInput = {
  title: string;
  slug: string;
  description: string;
  price: number;
  deliveryDays: number;
  categoryId: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

type OrderInputItem = {
  serviceId: string;
  quantity: number;
};

export async function createDeveloperWithProfileAndService(
  userData: CreateDeveloperInput,
  profileData: CreateProfileInput,
  serviceData: CreateServiceInput
): Promise<
  TransactionResult<{
    user: unknown;
    profile: unknown;
    service: unknown;
  }>
> {
  try {
    const developerId = randomUUID();

    const [user, profile, service] = await prisma.$transaction([
      prisma.user.create({
        data: {
          id: developerId,
          ...userData,
          role: "DEVELOPER",
        },
      }),
      prisma.profile.create({
        data: {
          ...profileData,
          userId: developerId,
        },
      }),
      prisma.service.create({
        data: {
          ...serviceData,
          status: serviceData.status ?? "DRAFT",
          developerId,
        },
      }),
    ]);

    return {
      success: true,
      user,
      profile,
      service,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "La creation transactionnelle du developpeur a echoue.",
    };
  }
}

export async function createOrder(
  userId: string,
  items: OrderInputItem[]
): Promise<TransactionResult<{ order: unknown }>> {
  try {
    const order = await prisma.$transaction(async (tx) => {
      if (items.length === 0) {
        throw new Error("La commande doit contenir au moins un service.");
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("Le client est introuvable.");
      }

      const orderItems: Array<{
        serviceId: string;
        quantity: number;
        price: number;
      }> = [];

      let total = 0;

      for (const item of items) {
        if (item.quantity <= 0) {
          throw new Error(
            `La quantite du service ${item.serviceId} doit etre superieure a zero.`
          );
        }

        const service = await tx.service.findUnique({
          where: { id: item.serviceId },
        });

        if (!service) {
          throw new Error(`Le service ${item.serviceId} est introuvable.`);
        }

        if (service.status !== "PUBLISHED") {
          throw new Error(
            `Le service "${service.title}" ne peut pas etre commande car il n'est pas publie.`
          );
        }

        total += service.price * item.quantity;
        orderItems.push({
          serviceId: service.id,
          quantity: item.quantity,
          price: service.price,
        });
      }

      return tx.order.create({
        data: {
          userId,
          total,
          status: "PENDING",
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });
    });

    return {
      success: true,
      order,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "La creation transactionnelle de la commande a echoue.",
    };
  }
}
