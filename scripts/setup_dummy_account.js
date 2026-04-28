const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const companyId = "demo-company";
  const password = "password123";
  const name = "Demo Corp";

  try {
    const company = await prisma.company.upsert({
      where: { id: companyId },
      update: {
        password: password,
        name: name,
        apiKey: "demo_api_key_12345"
      },
      create: {
        id: companyId,
        name: name,
        apiKey: "demo_api_key_12345",
        password: password,
      },
    });

    console.log(`Dummy account created/updated:`);
    console.log(`Company ID: ${company.id}`);
    console.log(`Password: ${company.password}`);
    
    // Add some dummy decisions if none exist
    const count = await prisma.decision.count({ where: { companyId: company.id } });
    if (count === 0) {
      const decisions = [
        { gender: "male", decision: "selected" },
        { gender: "male", decision: "selected" },
        { gender: "female", decision: "rejected" },
        { gender: "male", decision: "rejected" },
        { gender: "female", decision: "selected" },
        { gender: "female", decision: "rejected" },
        { gender: "male", decision: "selected" },
        { gender: "female", decision: "selected" },
      ];

      await prisma.decision.createMany({
        data: decisions.map(d => ({
          ...d,
          companyId: company.id,
          timestamp: new Date()
        }))
      });
      console.log(`Added 8 dummy decisions.`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
