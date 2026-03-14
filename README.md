# Nexus IMS: Next-Gen Odoo Inventory Bridge 🚀

Nexus IMS is a high-performance, React-based inventory management dashboard designed to bridge the gap between Odoo's powerful ERP backend and a modern, high-fidelity user experience. Built for the Odoo x Indus University Hackathon '26.

## 🏗️ The Architecture

We didn't just build a frontend; we engineered a full-stack synchronization layer:

- **Frontend**: React 18 + Vite + Tailwind CSS + GSAP (High-fidelity animations)
- **Backend**: Odoo 16 (Python) with a Custom API Controller (nexus_ims_api)
- **Infrastructure**: Dockerized environment (Odoo + PostgreSQL) for 100% offline reliability

## ✨ Key Features

- **Live Odoo Sync**: Real-time KPI tracking for Total Products, Low Stock, and Pending Moves
- **Odoo Controller Integration**: Custom-built Python endpoints (/api/dashboard, /api/products) utilizing the Odoo ORM
- **Electric UI**: A "Pitch Black & Electric Lime" design language featuring a GridMotion login and StaggeredMenu navigation
- **Robust State Management**: Skeleton loaders, toast notifications, and comprehensive offline error handling
- **Two-Way Communication**: Process inventory receipts directly from the React UI into the Odoo stock move system

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Framer Motion, GSAP, Tailwind CSS |
| Backend | Odoo 16, Python (Werkzeug) |
| Database | PostgreSQL 15 |
| DevOps | Docker, Docker Compose |

## 🚀 Installation & Setup

To run Nexus IMS locally, ensure you have Docker and Node.js installed.

### 1. Backend Setup (Odoo)

```bash
# Clone the repository
git clone https://github.com/AnanthaBhalan/Nexus-IMS.git

# Start the Odoo & Postgres containers
docker compose up -d

# Initialize the custom Nexus API module
docker exec -u root nexus-core-odoo-1 odoo -i nexus_ims_api -d odoo --stop-after-init
```

### 2. Frontend Setup (React)

```bash
cd nexus-core
npm install
npm run dev
```

Configure your `.env.local` with:
```
VITE_API_URL=http://localhost:8069
```

## 👥 The Team

- **AnanthaBhalan R (Team Lead)**: UI/UX Architecture & GSAP Implementation
- **Pallamala Venkata Hasika**: Odoo API Development & Backend-Frontend Integration
- **Logesh M**: Database Seeding, QA & Infrastructure Monitoring

## 📝 Compliance Highlights

- ✅ **Dynamic Data**: No static JSON; everything is fetched from the Odoo ORM
- ✅ **Responsive**: Fully tested on mobile and desktop viewports
- ✅ **Offline-Ready**: 100% local Docker-based solution
- ✅ **Advanced Odoo**: Built a native custom module instead of using external middleware
