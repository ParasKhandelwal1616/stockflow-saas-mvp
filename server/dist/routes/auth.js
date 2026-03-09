"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
// Get current user and organization
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const user = await index_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                organization: true
            }
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({
            id: user.id,
            email: user.email,
            organization: user.organization
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});
// Update Organization settings
router.put('/organization', auth_1.authMiddleware, async (req, res) => {
    try {
        const orgId = req.user?.orgId;
        const { name, defaultThreshold } = req.body;
        if (!orgId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const updatedOrg = await index_1.prisma.organization.update({
            where: { id: orgId },
            data: {
                name,
                defaultThreshold: parseInt(defaultThreshold)
            }
        });
        res.json(updatedOrg);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update organization" });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await index_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, orgId: user.orgId }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, email: user.email, orgId: user.orgId } });
    }
    catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const result = await index_1.prisma.$transaction(async (tx) => {
            const organization = await tx.organization.create({
                data: {
                    name,
                },
            });
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    orgId: organization.id,
                },
            });
            return { organization, user };
        });
        res.status(201).json({
            message: "Organization and User created successfully",
            orgId: result.organization.id,
            userId: result.user.id
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: "Registration failed", details: error.message });
    }
});
exports.default = router;
