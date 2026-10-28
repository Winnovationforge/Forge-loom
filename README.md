# FORGE Loom LMS

> **Enterprise Multi-Tenant Learning Management System, Innovation Incubator & Career Launchpad**  
> **Official Repository:** [https://github.com/Winnovationforge/Forge-loom](https://github.com/Winnovationforge/Forge-loom)  
> **Universal Development Password:** `test1234`

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Multi--Tenant-336791.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2d3748.svg)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-6379-dc382d.svg)](https://redis.io/)

---

## 📚 Essential PDF Documentation & Specifications

The repository includes publication-ready, beautifully styled PDF technical documents featuring embedded SVG flowcharts, architectural diagrams, wireframe mockups, and database schemas:

| Document | Format | Description |
| :--- | :---: | :--- |
| **[Master Architecture & Operational Manual](file:///Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_LMS_ARCHITECTURE_MANUAL.pdf)** | `PDF` | Definitive system manual covering the active tech stack, 13 production modules, multi-role seed credentials, flow diagrams, and operational commands. |
| **[Wireframe & Screen Specification](file:///Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_WIREFRAMES_SPECIFICATION.pdf)** | `PDF` | Visual wireframe blueprints, layout regions, responsive drawer rules, and data bindings for all 11 user portals and glassmorphic modals. |
| **[System Architecture & Scaling Guide](file:///Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_SYSTEM_ARCHITECTURE.pdf)** | `PDF` | Engineering guide detailing the PERN stack, BullMQ asynchronous score recomputation, multi-tenant row isolation, and horizontal scaling to 50k users. |
| **[Master Architecture Manual (Markdown)](file:///Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_LMS_ARCHITECTURE_MANUAL.md)** | `MD` | Direct markdown version of the master platform manual. |
| **[Wireframes Specification (Markdown)](file:///Users/winnovation/Downloads/loom-main/docs/forge-loom-wireframes.md)** | `MD` | Original screen-by-screen component and data binding specifications. |
| **[PostgreSQL Database Design (Markdown)](file:///Users/winnovation/Downloads/loom-main/docs/postgres-database-design.md)** | `MD` | Detailed Prisma schema, foreign key relations, indexing strategy, and college scoping. |

---

## 🌟 Platform Highlights

* **Dual-Engine Learning Experience**: Seamlessly pairs structured video syllabus delivery with the **Citadel Innovation Incubator** (Sprint 1, 2, and 3 project cycles).
* **Multi-Tenant College Isolation**: Strict campus boundaries ensure student rosters, cohort schedules, and faculty assignments remain private between institutions (e.g., Forge Institute vs Riverside College).
* **Asynchronous Builder Score Engine**: Dynamic student XP algorithm derived from Attendance (20%), Projects (40%), Mentor Reviews (30%), and Peer Teamwork (10%) calculated via BullMQ and Redis.
* **1-on-1 Mentor Advisory**: Real-time slot availability queries, glassmorphic booking modals, calendar integration, and post-session milestone grading.
* **Corporate HR Talent Pool**: Pre-screened student profiles with skill tags, Builder Score range sliders, verified GitHub project portfolios, and interview scheduling.
* **Dynamic Verifiable PDF Certificates**: On-the-fly certificate generation with cryptographically signed tokens and public QR code verification (`/verify/:token`).
* **100% 2D Flat Vector Visuals**: Clean, modern SVG iconography across all student, mentor, college, and admin dashboards (free of dated 3D or emoji artifacts).

---

## 🛠️ Active Technology Stack

### Frontend Client (`apps/client` — Port `5173`)
* **Core Framework**: React 18.3.1 with TypeScript 5.6.3
* **Build Engine**: Vite 5.4.8 with Hot Module Replacement (HMR)
* **Styling**: Tailwind CSS v4.0 with custom glassmorphism design tokens and royal-blue brand palette
* **Routing**: React Router DOM 6.27.0 with dynamic role-guarded nesting (`RequireAuth`, `RequireRole`, `ROLE_HOME_PATH`)
* **Data Caching**: `@tanstack/react-query 5.59.16` for optimistic updates and caching
* **Visuals**: `lucide-react 0.454.0` icons and dedicated flat 2D vector illustrations (`.svg`)

### Backend API Server (`apps/server` — Port `4000`)
* **Runtime**: Node.js v22 (native ESM) executed via `tsx watch`
* **Web Framework**: Express 4.21.1 with `helmet`, `cors`, `cookie-parser`, and `morgan`
* **Database & ORM**: PostgreSQL (Port `5433`) queried via Prisma ORM 5.22.0
* **Cache & Queues**: Redis (Port `6379`) via `ioredis 5.4.1` and `bullmq 5.21.2`
* **Authentication**: `jsonwebtoken 9.0.2` (JWT session cookies) and `bcryptjs 2.4.3` password hashing
* **Validation**: `zod 3.23.8` schema validation for all endpoints
* **Documents & Media**: `pdfkit 0.20.1` + `qrcode 1.5.4` for automated certificates; AWS S3 SDK for uploads

### Shared Core (`packages/shared-types`)
* Unified TypeScript interfaces shared between client and server for all 11 roles, sprint states, and API contracts.

---

## 🔑 Seed User Directory & Credentials

All test accounts across all 11 roles use the **universal development password**:

```
Password: test1234
```

### Multi-Tenant College Clusters (Institution-Scoped Fixtures)

| College Cluster | Role | Display Name | Login Email | Default Route |
| :--- | :--- | :--- | :--- | :--- |
| **Cluster 1**<br>*(Forge Institute of Technology)* | **CollegeAdmin** | Forge Institute of Technology | `college1@forgeloom.dev` | `/college` |
| | **Student** | Student One | `student1@forgeloom.dev` | `/student` |
| | **Mentor** | Mentor One | `mentor1@forgeloom.dev` | `/mentor` |
| | **Trainer** | Trainer One | `trainer1@forgeloom.dev` | `/trainer` |
| **Cluster 2**<br>*(Riverside College of Engineering)* | **CollegeAdmin** | Riverside College of Engineering | `college2@forgeloom.dev` | `/college` |
| | **Student** | Student Two | `student2@forgeloom.dev` | `/student` |
| | **Mentor** | Mentor Two | `mentor2@forgeloom.dev` | `/mentor` |
| | **Trainer** | Trainer Two | `trainer2@forgeloom.dev` | `/trainer` |

### Cross-Ecosystem & Platform Governance Accounts

| Role | Entity / Function | Login Email | Default Route |
| :--- | :--- | :--- | :--- |
| **ForgeAdmin** | Forge Super Admin | `admin1@forgeloom.dev` | `/admin` |
| **CourseAdmin** | Lead Curriculum Creator | `course_admin1@forgeloom.dev` | `/course-admin` |
| **Hr** | Corporate Hiring Partner | `hr1@forgeloom.dev` | `/hr` |
| **Speaker** | Guest Industry Speaker | `speaker1@forgeloom.dev` | `/speaker` |
| **Sponsor** | Corporate Sponsor | `sponsor1@forgeloom.dev` | `/sponsor` |
| **CommunityLeader** | Chapter Organizer | `community1@forgeloom.dev` | `/community` |
| **MediaPartner** | Media Coverage Partner | `media1@forgeloom.dev` | `/media` |
| **Member** | General Community Member | `member1@forgeloom.dev` | `/member` |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* Node.js v20+ or v22
* Docker Desktop (for PostgreSQL & Redis)

### 2. Start Infrastructure Containers
```bash
docker compose -f infra/docker-compose.yml up -d
```
* PostgreSQL running on port `5433`
* Redis running on port `6379`

### 3. Run Database Migrations & Seed Accounts
```bash
# Run Prisma migrations
npx prisma migrate dev --schema=apps/server/src/prisma/schema.prisma

# Seed all 11 user roles with password 'test1234'
npm run seed --workspace=@forge-loom/server
```

### 4. Start the Application
```bash
# Concurrently builds shared-types, starts backend API (:4000) and frontend client (:5173)
npm run dev
```

Visit the application in your browser:
* **Frontend Application**: `http://localhost:5173`
* **Backend API Health Check**: `http://localhost:4000/health`

### 5. Typecheck & Verification
```bash
npm run typecheck
```

---

## 📐 LMS Wireframe Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Topbar: [Logo] [Role Badge]                 [Notifications 3] [Avatar]  │
├───────────────────┬─────────────────────────────────────────────────────┤
│ Sidebar           │ Main Content Viewport                               │
│                   │                                                     │
│ • Dashboard       │  [Greeting Header & College Department Info]        │
│ • Courses         │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────┐ │
│ • Citadel Hub     │  │ Score XP  │ │ Courses   │ │ Attend %  │ │ Sess │ │
│ • Mentor Advisory │  └───────────┘ └───────────┘ └───────────┘ └──────┘ │
│ • Certifications  │                                                     │
│ • Events          │  [Active Course Banner]      [Mentor Advisory Card] │
│ • Sign Out        │  [Course Progress Bar 68%]   [Book 1-on-1 Session]  │
└───────────────────┴─────────────────────────────────────────────────────┘
```

* **Global Shell**: Shared header, responsive mobile drawer (`<768px`), and route-specific viewport canvas.
* **Student (`/student`)**: Stats cards, enrolled courses, Citadel 3-sprint stepper, and 1-on-1 mentor booking.
* **Mentor (`/mentor`)**: Student progress drill-down, Citadel team milestone grading, and weekly session availability.
* **Trainer (`/trainer`)**: Batch scheduling, attendance matrices, module assignments, and tests.
* **HR Recruiter (`/hr`)**: Searchable candidate talent pool with multi-skill filters and score range sliders.
* **College Admin (`/college`)**: Institutional student rosters, faculty counts, and department-level completion analytics.
* **Forge Super Admin (`/admin`)**: Cross-college registry, platform performance, and system health.

---

## 📦 Monorepo Directory Layout

```
loom-main/
├── apps/
│   ├── client/                  # React 18 + Vite + Tailwind CSS SPA
│   │   ├── public/images/       # Flat 2D vector assets (.svg)
│   │   └── src/
│   │       ├── auth/            # AuthContext, RequireAuth, RequireRole, roleHome
│   │       ├── components/      # Glassmorphic UI components, modals, charts
│   │       └── pages/           # 11 distinct role portal page suites
│   └── server/                  # Express 4.21 + Prisma API Server
│       ├── src/
│       │   ├── config/          # Prisma client, Redis connection, env config
│       │   ├── modules/         # 13 active production domain routers & services
│       │   ├── prisma/          # schema.prisma & PostgreSQL migrations
│       │   └── scripts/         # seed.ts idempotent database fixtures
├── packages/
│   └── shared-types/            # Unified TypeScript interfaces & Role enums
├── docs/                        # Complete technical specs and compiled PDFs
│   ├── FORGE_LOOM_LMS_ARCHITECTURE_MANUAL.pdf
│   ├── FORGE_LOOM_WIREFRAMES_SPECIFICATION.pdf
│   ├── FORGE_LOOM_SYSTEM_ARCHITECTURE.pdf
│   └── *.md
└── infra/
    └── docker-compose.yml       # Local PostgreSQL (5433) & Redis (6379)
```

---

## 🔒 Security & Architecture Integrity

* **Stateless Token Transport**: Session cookies are signed, HTTP-only, and verified per request.
* **Tenant Partitioning**: Prisma queries strictly filter on `collegeId` preventing cross-institution data leaks.
* **Rate Limiting & Helmet**: Hardened HTTP headers, CORS whitelisting, and brute-force protection.
* **Clean Git Hygiene**: Zero committed `.env` secrets, database dumps (`dump.rdb`), or build artifacts.

---
*Maintained by Forge Engineering &bull; [Winnovationforge/Forge-loom](https://github.com/Winnovationforge/Forge-loom)*
