import prisma from '../app/lib/prisma';

async function main() {
  console.log(" Seeding...");

  // 🧹 CLEAN DATABASE (ordre important)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  //  USERS
  await prisma.user.create({
    data: {
      clerkId: "clerk_admin_001",
      email: "admin@codelink.com",
      name: "Admin",
      role: "ADMIN",
    },
  });

  const dev1 = await prisma.user.create({
    data: {
      clerkId: "clerk_dev_001",
      email: "dev1@codelink.com",
      name: "Alex Dev",
      role: "DEVELOPER",
    },
  });

  const dev2 = await prisma.user.create({
    data: {
      clerkId: "clerk_dev_002",
      email: "dev2@codelink.com",
      name: "Sam Code",
      role: "DEVELOPER",
    },
  });

  const client1 = await prisma.user.create({
    data: {
      clerkId: "clerk_client_001",
      email: "client1@codelink.com",
      name: "John Client",
      role: "CLIENT",
    },
  });

  //  PROFILES (1-1)
  await prisma.profile.create({
    data: {
      userId: dev1.id,
      bio: "Full-stack developer spécialisé en React et Node.js",
    },
  });

  await prisma.profile.create({
    data: {
      userId: dev2.id,
      bio: "Backend developer expert en API et bases de données",
    },
  });

  //  CATEGORIES
  const webDev = await prisma.category.create({
    data: {
      name: "Web Development",
      slug: "web-development",
    },
  });

  const apiDev = await prisma.category.create({
    data: {
      name: "API Development",
      slug: "api-development",
    },
  });

  const bugFix = await prisma.category.create({
    data: {
      name: "Bug Fixing",
      slug: "bug-fixing",
    },
  });

  //  SERVICES
  const service1 = await prisma.service.create({
    data: {
      title: "Créer un site web React professionnel",
      slug: "react-website",
      description: "Je vais créer un site web moderne avec React et Tailwind",
      price: 500,
      deliveryDays: 5,
      developerId: dev1.id,
      categoryId: webDev.id,
      status: "PUBLISHED",
    },
  });

  const service2 = await prisma.service.create({
    data: {
      title: "Développer une API REST avec Node.js",
      slug: "node-api",
      description: "API sécurisée avec Express et Prisma",
      price: 300,
      deliveryDays: 3,
      developerId: dev2.id,
      categoryId: apiDev.id,
      status: "PUBLISHED",
    },
  });

  await prisma.service.create({
    data: {
      title: "Corriger bugs JavaScript rapidement",
      slug: "fix-js-bugs",
      description: "Debug rapide et efficace de ton code JS",
      price: 100,
      deliveryDays: 1,
      developerId: dev1.id,
      categoryId: bugFix.id,
      status: "PUBLISHED",
    },
  });

  //  ORDER (transaction simulée)
  await prisma.order.create({
    data: {
      userId: client1.id,
      total: 800,
      status: "PAID",
      items: {
        create: [
          {
            serviceId: service1.id,
            quantity: 1,
            price: 500,
          },
          {
            serviceId: service2.id,
            quantity: 1,
            price: 300,
          },
        ],
      },
    },
  });

  console.log("✅ Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
