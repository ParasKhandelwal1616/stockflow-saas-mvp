"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const auth_1 = require("../middleware/auth");
const json2csv_1 = require("json2csv");
const router = express_1.default.Router();
// Export products to CSV
router.get('/export', auth_1.authMiddleware, async (req, res) => {
    const orgId = req.user?.orgId;
    if (!orgId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const products = await index_1.prisma.product.findMany({
            where: { orgId }
        });
        const fields = ['sku', 'name', 'quantity', 'lowStockThreshold', 'costPrice', 'sellingPrice'];
        const opts = { fields };
        const parser = new json2csv_1.Parser(opts);
        const csv = parser.parse(products);
        res.header('Content-Type', 'text/csv');
        res.attachment(`inventory-export-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to export inventory" });
    }
});
// Create a product
router.post('/', auth_1.authMiddleware, async (req, res) => {
    const { sku, name, quantity, lowStockThreshold, costPrice, sellingPrice } = req.body;
    const orgId = req.user?.orgId;
    if (!orgId) {
        res.status(401).json({ error: "Unauthorized: No organization ID found" });
        return;
    }
    try {
        const product = await index_1.prisma.product.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: "Failed to create product", details: error.message });
    }
});
// Fetch all products for the user's organization
router.get('/', auth_1.authMiddleware, async (req, res) => {
    const orgId = req.user?.orgId;
    if (!orgId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const products = await index_1.prisma.product.findMany({
            where: { orgId }
        });
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});
exports.default = router;
