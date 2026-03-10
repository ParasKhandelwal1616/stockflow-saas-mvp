# StockFlow SaaS MVP

A high-performance, multi-tenant Stock Management System built for modern retail and warehouse operations.

##  Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS (Zinc Dark Theme), Recharts, Lucide Icons.
- **Backend:** Node.js, Express.js, JWT Authentication.
- **Database:** Prisma ORM with SQLite (Single-Database, Shared-Schema model).
- **Communication:** Axios with interceptors for seamless auth handling.

##  Architectural Choices

### Multi-tenancy Model: Shared-Schema
We implemented a **"Single-Database, Shared-Schema"** multi-tenancy model. 
- **Performance:** Minimizes database connection overhead.
- **Cost-Efficiency:** Reduces infrastructure costs for early-stage SaaS.
- **Data Isolation:** Guaranteed via strict `orgId` row-level filtering in every Prisma query and JWT-scoped middleware.

### Security
- **JWT-Based Auth:** Stateless authentication with organization-scoped payloads.
- **Row-Level Filtering:** Middleware injects `orgId` into requests, ensuring users can *never* access data outside their own organization.
- **Password Hashing:** Industry-standard `bcryptjs` encryption.

##  Key Features

- **Inventory Intelligence:** Visual data distribution with Recharts.
- **Real-time Alerts:** Pulse-animated "Low Stock" notification center.
- **Data Portability:** Scoped CSV Export for offline reporting.
- **Modern UI:** Clean, responsive "Zinc" dark-themed interface.
- **Tenant Verification:** Read-only Organization ID visibility for developer-grade isolation proof.

##  Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file with DATABASE_URL="file:./dev.db"
npx prisma db push
npx prisma db seed # To populate test data
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
# Ensure .env.local has NEXT_PUBLIC_API_URL="http://localhost:5000/api"
npm run dev
```

## Database Seeding
To see the application in action immediately, run `npx prisma db seed` in the `server` directory. This creates a test organization, user, and a sample inventory.

---
*Built for the Senior Software Engineer Technical Assessment.*
