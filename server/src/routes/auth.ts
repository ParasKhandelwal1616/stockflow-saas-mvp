import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.id, orgId: user.orgId }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user.id, email: user.email, orgId: user.orgId } });
  } catch (error: any) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
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
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Registration failed", details: error.message });
  }
});

export default router;
