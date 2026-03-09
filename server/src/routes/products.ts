import express, { Response } from 'express';
import { prisma } from '../index';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Parser } from 'json2csv';

const router = express.Router();

// Export products to CSV
router.get('/export', authMiddleware, async (req: AuthRequest, res: Response) => {
  const orgId = req.user?.orgId;

  if (!orgId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const products = await prisma.product.findMany({
      where: { orgId }
    });

    const fields = ['sku', 'name', 'quantity', 'lowStockThreshold', 'costPrice', 'sellingPrice'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(products);

    res.header('Content-Type', 'text/csv');
    res.attachment(`inventory-export-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to export inventory" });
  }
});

// Create a product
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { sku, name, quantity, lowStockThreshold, costPrice, sellingPrice } = req.body;
  const orgId = req.user?.orgId;

  if (!orgId) {
    res.status(401).json({ error: "Unauthorized: No organization ID found" });
    return;
  }

  try {
    const product = await prisma.product.create({
      data: {
        sku,
        name,
        quantity: quantity || 0,
        lowStockThreshold,
        costPrice,
        sellingPrice,
        orgId
      }
    });
    res.status(201).json(product);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Failed to create product", details: error.message });
  }
});

// Fetch all products for the user's organization
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const orgId = req.user?.orgId;

  if (!orgId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const products = await prisma.product.findMany({
      where: { orgId }
    });
    res.json(products);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
