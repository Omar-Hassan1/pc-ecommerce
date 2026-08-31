# NEXORA COMPUTERS — E-Commerce & Repair Service Platform

NEXORA COMPUTERS is a full-stack international computer retailer and repair management platform built with **TypeScript, Node.js, Express.js, PostgreSQL/SQLite, Sequelize ORM, Pino Logging, Argon2id, and Zod**.

---

## Key Features

- **E-Commerce Shop & Hardware Catalog**:
  - Gaming PCs, Laptops, CPUs, GPUs, Motherboards, RAM, NVMe SSDs, Power Supplies, Accessories.
  - Multi-field filtering (Category, Brand, Price Range, In Stock, Rating), sorting, search, pagination, grid/list view toggle.
  - Product page with image gallery zoom, specifications matrix, and verified customer reviews.
- **Custom PC Builder Compatibility Engine**:
  - Interactive component selector.
  - Real-time compatibility checks (CPU socket match, RAM DDR4/DDR5 match, system wattage draw vs PSU capacity).
  - One-click "Add Build to Cart".
- **Computer Repair Management System**:
  - Online Repair Request submission form with file upload support.
  - Unique tracking code generation (`REP-2026-XXXXXX`).
  - Visual progress timeline tracker.
  - **Quotation System**: Itemized diagnostic quotes (Parts list, labor, shipping, tax, discount). Customers review and click **APPROVE REPAIR** or **REJECT REPAIR**.
  - Integrated customer-technician support message thread.
- **Multi-Step Checkout & Orders**:
  - Worldwide shipping address support and courier selection.
  - Payment Service Abstraction layer (Stripe placeholder + built-in Dev Sandbox fallback).
  - Atomic database transactions for stock reduction and inventory management.
- **Role-Based Portals**:
  - **Customer Dashboard**: Track orders, active repair tickets, wishlist, and account settings.
  - **Technician Dashboard**: Ticket queue, status updater, quotation generator, internal diagnostic comments.
  - **Admin Dashboard**: Executive KPI cards, monthly revenue/sales SVG charts, Product CRUD manager, Coupon manager.
- **Enterprise Error Handling & Security**:
  - Hierarchy of custom application errors (`AppError`, `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`, `ValidationError`).
  - Centralized Express error-handling middleware.
  - Production-safe error sanitization (no leaked SQL queries, stack traces, or credentials).
  - High-performance Pino logging for server-side error traceabilities.
  - Password hashing via **Argon2id**.

---

## Technology Stack

- **Backend**: TypeScript, Node.js, Express.js, PostgreSQL / SQLite3, Sequelize ORM, Umzug Migrations, Pino Logging, Argon2id, JWT Authentication, Zod Validation, Multer, Helmet, CORS, express-rate-limit.
- **Frontend**: React, Vite, JavaScript, Tailwind CSS, Lucide Icons, Axios, React Router DOM.

---

## Installation & Commands Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- PostgreSQL (or automated SQLite fallback during development)

### 1. Installation

Change into the `server` directory and install all backend dependencies:

```bash
cd server
npm install
```

### 2. Environment Variables Setup

Create a `.env` file in the `server` directory based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nexora_computers
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=nexora_super_secret_jwt_key_2026_computers_platform
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Available npm Scripts

Run the following commands inside the `server` directory:

| Task | Command | Description |
| :--- | :--- | :--- |
| **Development Server** | `npm run dev` | Starts server using `tsx watch server.ts` |
| **Build Project** | `npm run build` | Compiles TypeScript source files to `dist/` |
| **Production Start** | `npm run start` | Runs compiled server code via `node dist/server.js` |
| **Run Migrations** | `npm run db:migrate` | Runs database migrations using Umzug |
| **Rollback Migration** | `npm run db:migrate:undo` | Rolls back the last applied migration |
| **Seed Database** | `npm run seedDatabase` (or `npm run seed`) | Manually seeds database with sample products & users |
| **Lint Codebase** | `npm run lint` | Runs ESLint type checks across `.ts` files |
| **Fix Lint Issues** | `npm run lint:fix` | Automatically fixes ESLint rule violations |

---

## Default Development Accounts

Use these pre-seeded credentials for testing:

| Role | Name | Email | Password | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Omar Admin | `admin@nexora.com` | `Password123!` | Full Admin Panel, Product CRUD, Coupons, Stats |
| **Technician** | Omar Tech | `tech@nexora.com` | `Password123!` | Tech Portal, Repair Queue, Quotation Builder |
| **Customer** | Omar Customer | `customer@nexora.com` | `Password123!` | Customer Dashboard, Orders, Active Repairs, Wishlist |

---

## Project Directory Structure

```
pc-ecommerce/
├── server/
│   ├── src/
│   │   ├── config/        # Database, Pino Logger, and Site configuration
│   │   ├── controllers/   # Auth, Admin, Products, Cart, Orders, Repairs, Technicians, etc.
│   │   ├── errors/        # Custom AppError hierarchy & specialized HTTP errors
│   │   ├── middleware/    # Auth (JWT), Role Authorization, Zod Validation, Error Middleware
│   │   ├── migrations/    # Umzug Sequelize migration definitions & runner script
│   │   ├── models/        # 28 Sequelize Database Models & Relational Associations
│   │   ├── routes/        # Express REST API routes
│   │   ├── seeders/       # Manual seed script for products, categories, brands, test accounts
│   │   ├── types/         # TypeScript type extensions
│   │   ├── utils/         # Helpers & response handlers
│   │   └── app.ts         # Express pipeline setup
│   ├── server.ts          # Server entry point
│   ├── tsconfig.json      # TypeScript compiler options
│   └── .eslintrc.cjs      # ESLint configuration
└── README.md
```
