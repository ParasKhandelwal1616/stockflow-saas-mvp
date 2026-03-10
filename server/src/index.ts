import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth';
import productRouter from './routes/products';

dotenv.config();

const app = express();
const prisma = new PrismaClient(); 

// Export the prisma instance for use in routes
export { prisma };

app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send({ status: "StockFlow API is online" });
});

// Authentication routes
app.use('/api/auth', authRouter);

// Product routes
app.use('/api/products', productRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
