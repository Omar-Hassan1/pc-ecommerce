# NEXORA COMPUTERS — E-Commerce & Repair Service Platform

NEXORA COMPUTERS is a full-stack international computer retailer and repair management platform built with **Node.js, Express.js, PostgreSQL, Sequelize ORM, React (Vite), and Tailwind CSS**.

---

## Key Features

- **E-Commerce Shop & Hardware Catalog**:
  - Gaming PCs, Laptops, CPUs, GPUs, Motherboards, RAM, NVMe SSDs, Power Supplies, Accessories.
  - Multi-field filtering (Category, Brand, Price Range, In Stock, Rating), sorting, search, pagination, grid/list view toggle.
  - Product page with image gallery zoom, specifications matrix, and verified customer reviews.
- **Custom PC Builder Compatibility Engine**:
  - Interactive 10-step component selector.
  - Real-time compatibility checks (CPU socket match, RAM DDR4/DDR5 match, system wattage draw vs PSU capacity).
  - One-click "Add Build to Cart".
- **Computer Repair Management System**:
  - Online Repair Request submission form with screenshot/photo file upload support.
  - Unique tracking code generation (`REP-2026-XXXXXX`).
  - 15-stage visual progress timeline tracker.
  - **Quotation System**: Technicians build itemized diagnostic quotes (Parts list, labor, shipping, tax, discount). Customers review and click **APPROVE REPAIR** or **REJECT REPAIR**.
  - Integrated customer-technician support message thread.
- **Multi-Step Checkout & Orders**:
  - Worldwide shipping address support and courier selection.
  - Payment Service Abstraction layer (Stripe placeholder + built-in Dev Sandbox fallback).
  - Atomic database transactions for stock reduction and inventory management.
- **Role-Based Portals**:
  - **Customer Dashboard**: Track orders, active repair tickets, wishlist, and account settings.
  - **Technician Dashboard**: Ticket queue, 15-stage status updater, quotation generator, internal diagnostic comments.
  - **Admin Dashboard**: Executive KPI cards, monthly revenue/sales SVG charts, Product CRUD manager, Coupon manager.

---

## Technology Stack

- **Backend**: Node.js, Express.js, PostgreSQL, Sequelize ORM, JWT Authentication, bcrypt, express-validator, Multer, Helmet, CORS, express-rate-limit.
- **Frontend**: React, Vite, JavaScript, Tailwind CSS, Lucide Icons, Axios, React Router DOM.

---

## Quick Start & Installation Guide

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (or automated SQLite fallback during development)

### 1. Backend Server Setup

```bash
cd server
npm install
```

Ensure `server/.env` is configured (or use default parameters):

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
```

Seed database with realistic sample products, accounts, and repair tickets:

```bash
npm run seed
```

Start backend dev server:

```bash
npm run dev
```

### 2. Frontend Client Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The frontend application will run at: `http://localhost:5173`

---

## Default Development Accounts

Use these pre-seeded credentials for immediate testing:

| Role | Name | Email | Password | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Site Admin | `admin@nexora.com` | `Password123!` | Full Admin Panel, Product CRUD, Coupons, Stats |
| **Technician** | Site Tech | `tech@nexora.com` | `Password123!` | Tech Portal, Repair Queue, Quotation Builder |
| **Customer** | Site Customer | `customer@nexora.com` | `Password123!` | Customer Dashboard, Orders, Active Repairs, Wishlist |

---

## Directory Structure

```
my-node-app/
├── server/
│   ├── src/
│   │   ├── config/        # DB, JWT, Site & Payment configurations
│   │   ├── controllers/   # Auth, Products, Cart, Orders, Repairs, Technicians, Admin
│   │   ├── middleware/    # Auth (JWT), Admin/Tech Role Guards, Multer Upload, Error Handling
│   │   ├── models/        # 28 Sequelize Database Models & Relational Associations
│   │   ├── routes/        # REST API Routes
│   │   ├── seeders/       # Seed script for products, categories, brands, test accounts
│   │   └── app.js         # Express pipeline & middleware
│   └── server.js          # Entry point
└── client/
    ├── src/
    │   ├── api/           # Axios instance with JWT interceptors
    │   ├── components/    # Navbar, Footer, ProductCard, QuickViewModal, Timeline, CartDrawer
    │   ├── context/       # AuthContext, CartContext, WishlistContext, ToastContext
    │   ├── pages/         # Home, Shop, ProductDetail, CustomPCBuilder, RepairService, Trackers, Dashboards
    │   └── App.jsx        # Router setup
    └── vite.config.js
```
