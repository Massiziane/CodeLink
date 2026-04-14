import prisma from "./prisma";
import { createOrder } from "./transactions";

function assertCondition(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

async function testTransactions() {
  let passed = 0;
  const total = 2;

  const client = await prisma.user.findFirst({
    where: { role: "CLIENT" },
  });

  const publishedService = await prisma.service.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "asc" },
  });

  const draftService = await prisma.service.findFirst({
    where: { status: "DRAFT" },
    orderBy: { createdAt: "asc" },
  });

  if (!client || !publishedService || !draftService) {
    throw new Error(
      "Les donnees de test sont incompletes. Executez le seed avant de lancer ce script."
    );
  }

  console.log("=== TEST 1 : Commande reussie ===");

  try {
    const ordersBefore = await prisma.order.count({
      where: { userId: client.id },
    });

    const result = await createOrder(client.id, [
      { serviceId: publishedService.id, quantity: 2 },
    ]);

    assertCondition(result.success, "La transaction aurait du reussir.");

    if (!result.success) {
      throw new Error(result.error);
    }

    const createdOrderId = (result.order as { id: string }).id;

    const createdOrder = await prisma.order.findUnique({
      where: { id: createdOrderId },
      include: { items: true },
    });

    const ordersAfter = await prisma.order.count({
      where: { userId: client.id },
    });

    assertCondition(ordersAfter === ordersBefore + 1, "La commande n'a pas ete ajoutee.");
    assertCondition(createdOrder !== null, "La commande creee est introuvable.");
    assertCondition(createdOrder?.items.length === 1, "Le OrderItem attendu est absent.");
    assertCondition(
      createdOrder?.total === publishedService.price * 2,
      "Le total de la commande est incorrect."
    );

    console.log("OK - La commande a ete creee avec succes.");
    passed += 1;
  } catch (error) {
    console.error("ECHEC - Test 1:", error);
  }

  console.log("\n=== TEST 2 : Commande echouee (service non publie) ===");

  try {
    const ordersBefore = await prisma.order.count({
      where: { userId: client.id },
    });
    const orderItemsBefore = await prisma.orderItem.count();

    const result = await createOrder(client.id, [
      { serviceId: draftService.id, quantity: 1 },
    ]);

    assertCondition(!result.success, "La transaction aurait du echouer.");

    const ordersAfter = await prisma.order.count({
      where: { userId: client.id },
    });
    const orderItemsAfter = await prisma.orderItem.count();

    assertCondition(
      ordersAfter === ordersBefore,
      "Une commande a ete creee alors que la transaction devait rollback."
    );
    assertCondition(
      orderItemsAfter === orderItemsBefore,
      "Des OrderItem ont ete persistes alors que la transaction devait rollback."
    );

    console.log("OK - Le rollback a fonctionne et la BD est inchangee.");
    passed += 1;
  } catch (error) {
    console.error("ECHEC - Test 2:", error);
  }

  console.log("\n=== RESULTATS ===");
  console.log(`${passed} tests passes / ${total} tests au total`);
}

testTransactions()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
