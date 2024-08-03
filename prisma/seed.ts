import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const items = Array.from({ length: 100 }, (_, i) => ({
    title: `タイトル ${i + 1}`,
    description: `説明 ${i + 1} の内容です。`,
  }));

  await prisma.item.createMany({
    data: items,
  });

  console.log("Seed data created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
