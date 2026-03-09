const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Global Logistics Corp',
      defaultThreshold: 10,
    },
  });

  // 2. Create User
  const user = await prisma.user.create({
    data: {
      email: 'admin@globallogistics.com',
      password: hashedPassword,
      orgId: organization.id,
    },
  });

  // 3. Create 5 Sample Products
  const products = [
    { sku: 'GL-PRD-001', name: 'Ultra-Fast Processor', quantity: 5, lowStockThreshold: 10, costPrice: 450, sellingPrice: 599 },
    { sku: 'GL-PRD-002', name: 'Titanium Case', quantity: 25, lowStockThreshold: 5, costPrice: 85, sellingPrice: 150 },
    { sku: 'GL-PRD-003', name: 'Power Module X', quantity: 3, lowStockThreshold: 8, costPrice: 120, sellingPrice: 210 },
    { sku: 'GL-PRD-004', name: 'Carbon Heat Sink', quantity: 45, lowStockThreshold: 15, costPrice: 12, sellingPrice: 25 },
    { sku: 'GL-PRD-005', name: 'OLED Display Panel', quantity: 12, lowStockThreshold: 10, costPrice: 210, sellingPrice: 350 },
  ];

  for (const productData of products) {
    await prisma.product.create({
      data: {
        ...productData,
        orgId: organization.id,
      },
    });
  }

  console.log('--- Database Seeded Successfully ---');
  console.log(`Organization: ${organization.name}`);
  console.log(`User: ${user.email} (Password: password123)`);
  console.log(`${products.length} products created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
