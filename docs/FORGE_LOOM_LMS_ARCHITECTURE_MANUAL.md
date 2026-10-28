# FORGE Loom LMS — Platform Architecture, Wireframes & Operational Guide

> **Enterprise Technical Documentation & Specification**  
> **Repository:** [https://github.com/Winnovationforge/Forge-loom](https://github.com/Winnovationforge/Forge-loom)  
> **Generated PDF Manual:** [`docs/FORGE_LOOM_LMS_ARCHITECTURE_MANUAL.pdf`](file:///Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_LMS_ARCHITECTURE_MANUAL.pdf)  
> **Universal Seed Password:** `test1234`

---

## 1. Executive Overview & System Architecture

**FORGE Loom LMS** is a dual-engine Learning Management System (LMS) and Career Launchpad. Beyond traditional video and syllabus delivery, FORGE Loom integrates the **Citadel Innovation Incubator**—a 3-stage sprint lifecycle (Problem Statement selection, prototype milestones, mentor evaluation, and investor access) linked directly into a corporate **HR Talent Pool**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   FORGE LOOM LMS ARCHITECTURE                          │
├─────────────────────┬──────────────────────────┬───────────────────────────────────────┤
│    CLIENT SPA       │        REST API          │           PERSISTENCE & SERVICES      │
│  (Port 5173 / Vite) │   (Port 4000 / Express)  │                                       │
│                     │                          │ ┌───────────────────────────────────┐ │
│  React 18 + TS      │   Helmet + CORS + JWT    │ │ PostgreSQL (Prisma ORM - Pt 5433) │ │
│  Tailwind CSS 4.0   │   Cookie Authentication  │ │ Multi-tenant College-scoped DB    │ │
│  TanStack Query     │   22 Active Routers      │ └───────────────────────────────────┘ │
│  React Router DOM   │   Zod Schema Validation  │ ┌───────────────────────────────────┐ │
│  Flat 2D Vector UI  │   PDFKit + QR Code Gen   │ │ Redis & BullMQ (Port 6379 Queues) │ │
│                     │                          │ │ AWS S3 Attachments & Certs Storage│ │
└─────────────────────┴──────────────────────────┴───────────────────────────────────────┘
```

---

## 2. Active Technology Stack

### 2.1 Frontend Client (`apps/client`)
- **Framework & Language:** React 18.3.1 with TypeScript 5.6.3 for compile-time type safety across client and server.
- **Build Engine & Dev Server:** Vite 5.4.8 providing instant Hot Module Replacement (HMR). Runs on `http://localhost:5173`.
- **Design System & Styling:** Tailwind CSS v4.0 with customized royal-blue identity tokens, glassmorphic card overlays, and responsive mobile-drawer breakpoints.
- **Client Routing & Guards:** React Router DOM 6.27.0 implementing `RequireAuth` session barriers and role-specific nested route isolation (`RequireRole`).
- **Server State & Caching:** `@tanstack/react-query 5.59.16` for asynchronous caching, query invalidation, and optimistic mutations.
- **Iconography & Visual Assets:** `lucide-react 0.454.0` accompanied by a dedicated custom suite of flat 2D vector illustrations (`.svg`) replacing all legacy 3D/emoji assets.

### 2.2 Backend API Server (`apps/server`)
- **Runtime:** Node.js v22 (ECMAScript Modules) running with `tsx watch` in development. Runs on `http://localhost:4000`.
- **Web Framework:** Express 4.21.1 hardened with `helmet`, `cors` (with credentials), `cookie-parser`, and `morgan` HTTP logger.
- **ORM & Relational Database:** Prisma ORM 5.22.0 querying a multi-tenant PostgreSQL database running on port `5433`.
- **Queue & In-Memory Cache:** `ioredis 5.4.1` connecting to Redis on port `6379` alongside `bullmq 5.21.2` for background tasks.
- **Authentication & Encryption:** `jsonwebtoken 9.0.2` (JWT session tokens stored in HTTP-only cookies) and `bcryptjs 2.4.3` (salted password hashing).
- **Validation Engine:** `zod 3.23.8` enforcing strict request body, parameter, and query constraints.
- **Document Rendering & Storage:** `pdfkit 0.20.1` and `qrcode 1.5.4` generating dynamic, verifiable course completion certificates; `@aws-sdk/client-s3` for media assets.

### 2.3 Shared Core Package (`packages/shared-types`)
- Eliminates code duplication across frontend and backend.
- Declares the 11-role `Role` enum, course progress types, Citadel sprint schemas, booking status types, and API contract payloads.

---

## 3. Active Platform Modules (Production Endpoints Only)

| Active Module | Mounted Route | Business Logic & Capabilities |
| :--- | :--- | :--- |
| **Authentication & Identity** | `/api/auth` | Login, multi-role registration, automated college provisioning, JWT session cookies, and logout. |
| **Courses & Curriculum** | `/api/courses`, `/api/catalog` | Course management for Course Admins, public catalog discovery, and module/topic hierarchies. |
| **Enrollments** | `/api/enrollments` | Student course registrations, college batch allocations, and payment hooks. |
| **Progress & Video Player** | `/api/video-progress`, `/api/students` | Real-time YouTube playback timestamp tracking, lesson checks, and student velocity calculations. |
| **Sessions & Attendance** | `/api/sessions`, `/api/students/attendance` | Lecture schedules, mentor sessions, student check-in, and aggregate attendance rates. |
| **Citadel Innovation Incubator** | `/api/sprints`, `/api/teams`, `/api/problem-statements` | 3-stage sprint lifecycles (Sprint 1/2/3), industry challenge selection, team submissions, and mentor reviews. |
| **Mentor Booking Engine** | `/api/bookings` | 1-on-1 expert advisory bookings, slot discovery, glassmorphic scheduling modal, and confirmations. |
| **Certificates & Verification** | `/api/certificates` | Dynamic PDF certificate generation with embedded verification QR code and public lookup (`/verify/:token`). |
| **Events & Workshops** | `/api/events` | Hackathons, masterclasses, and community webinars with seat capacity management and RSVP tracking. |
| **HR Talent Pool** | `/api/talent-pool`, `/api/hr-profile` | Recruiter company profile, student skill filtering, Builder Score queries, and candidate shortlists. |
| **Multi-Tenant College Admin** | `/api/colleges`, `/api/cohorts` | College tenant isolation: student rosters, faculty management, and departmental analytics. |
| **Forge Super Admin** | `/api/admin` | Cross-institutional analytics, new college onboarding, system health, and database metrics. |
| **Real-Time Notifications** | `/api/notifications` | Unread notifications feed, bell badge counter, milestone alerts, and session booking reminders. |

---

## 4. LMS Wireframe & Layout Architecture

### 4.1 Global Shell Frame
All 11 user roles share a consistent layout frame:
- **Sticky Topbar:** Platform logo, active role badge, notification bell with unread counter, and user profile avatar / logout action.
- **Dynamic Navigation Sidebar:** Filters module navigation links according to authenticated permissions. Highlights the active view. Collapses to a mobile-responsive drawer under 768px.
- **Main Viewport Canvas:** Role-specific glassmorphic cards, stat grids, action tables, and modals.

### 4.2 Key Role Wireframe Breakdowns

#### 1. Student Portal (`/student/*`)
- **Dashboard (`/student`):** Personal greeting header, 4 KPI cards (Builder Score, Active Courses, Attendance Rate, Upcoming Sessions), enrolled courses progress bars, next 3 upcoming events, and mentor card with "Book Session" trigger.
- **Course Player (`/student/courses/:id`):** Sticky video player, collapsible syllabus tree, module lesson checklist, and downloadable resources.
- **Citadel Hub (`/student/citadel`):** 3-stage horizontal sprint stepper (Sprint 1 / 2 / 3), problem statement details, milestone submission log, mentor feedback thread, and investor unlock banner.
- **Book a Mentor (`/student/mentor`):** Interactive directory of assigned experts, glassmorphic slot picker, topic selector, and booking confirmation.
- **Certificates (`/student/certifications`):** Grid of earned credentials with instant PDF download and public verification link.

#### 2. Mentor Portal (`/mentor/*`)
- **Dashboard (`/mentor`):** Pending 1-on-1 student booking requests, assigned mentees, weekly session calendar, and Citadel sprint grading backlog.
- **Assigned Mentees (`/mentor/students`):** Student progress drill-down, course completion statistics, attendance history, and private notes.
- **Teams (`/mentor/teams`):** Citadel innovation teams, milestone evaluation rubric, feedback submission, and investor readiness approvals.
- **Availability (`/mentor/sessions`):** Weekly availability slot manager, accept/reject booking requests.

#### 3. HR Recruiter Portal (`/hr/*`)
- **Company Profile (`/hr`):** Employer branding, industry domain, active hiring tracks.
- **Talent Pool (`/hr/talent-pool`):** Full-text student candidate search, skill multi-select tags, Builder Score range slider, and verified project portfolios.

#### 4. College Admin (`/college`) & Forge Super Admin (`/admin`)
- **College Admin (`/college`):** Institution-isolated dashboard displaying student rosters, faculty assignments, course throughput, and placement tracking.
- **Forge Admin (`/admin`):** Global metrics across all colleges, college tenant onboarding, global user directory, and platform performance.

---

## 5. Seed Passwords & User Credentials Directory

> **Universal Development Password:** `test1234`  
> *All seeded accounts utilize this identical password.*

### 5.1 Multi-Tenant College Clusters (Institution-Isolated Fixtures)

| College / Tenant | Role | Display Name | Login Email | Landing Route |
| :--- | :--- | :--- | :--- | :--- |
| **College Cluster 1**<br>(Forge Institute of Technology) | **CollegeAdmin** | Forge Institute of Technology | `college1@forgeloom.dev` | `/college` |
| | **Student** | Student One | `student1@forgeloom.dev` | `/student` |
| | **Mentor** | Mentor One | `mentor1@forgeloom.dev` | `/mentor` |
| | **Trainer** | Trainer One | `trainer1@forgeloom.dev` | `/trainer` |
| **College Cluster 2**<br>(Riverside College of Engineering) | **CollegeAdmin** | Riverside College of Engineering | `college2@forgeloom.dev` | `/college` |
| | **Student** | Student Two | `student2@forgeloom.dev` | `/student` |
| | **Mentor** | Mentor Two | `mentor2@forgeloom.dev` | `/mentor` |
| | **Trainer** | Trainer Two | `trainer2@forgeloom.dev` | `/trainer` |

### 5.2 Global Platform Accounts

| Role | Designation / Entity | Login Email | Landing Route |
| :--- | :--- | :--- | :--- |
| **ForgeAdmin** | Forge Platform Super Admin | `admin1@forgeloom.dev` | `/admin` |
| **CourseAdmin** | Lead Curriculum Creator | `course_admin1@forgeloom.dev` | `/course-admin` |
| **Hr** | Corporate Hiring Partner | `hr1@forgeloom.dev` | `/hr` |
| **Speaker** | Guest Industry Keynote | `speaker1@forgeloom.dev` | `/speaker` |
| **Sponsor** | Corporate Innovation Sponsor | `sponsor1@forgeloom.dev` | `/sponsor` |
| **CommunityLeader** | Tech Chapter Organizer | `community1@forgeloom.dev` | `/community` |
| **MediaPartner** | Media Coverage Representative | `media1@forgeloom.dev` | `/media` |
| **Member** | General Community Member | `member1@forgeloom.dev` | `/member` |

---

## 6. Operational Flow Diagrams

### 6.1 Authentication & Dynamic Role-Based Landing Resolution

```
[User Submits Email + Password]
            │
            ▼
[Express POST /api/auth/login] ──► [Bcrypt Password Validation & JWT Issuance]
            │
            ▼
[Client AuthContext Receives User Data]
            │
            ▼
[roleHome.ts (ROLE_HOME_PATH)]
 ├── Student          ──► /student
 ├── Mentor           ──► /mentor
 ├── Trainer          ──► /trainer
 ├── HR               ──► /hr
 ├── College Admin    ──► /college
 ├── Course Admin     ──► /course-admin
 └── Forge Super Admin──► /admin
```

### 6.2 Student Learning & Citadel Sprint Journey

```
1. Course Enrollment (/api/enrollments)
       │
       ▼
2. Video & Lesson Progress (/api/video-progress) ──► Builder Score Accrual
       │
       ▼
3. Citadel Innovation Sprints (/api/sprints)
    ├── Sprint 1: Problem Definition & Wireframing
    ├── Sprint 2: Interactive Prototype Implementation
    └── Sprint 3: Testing, Packaging & Demo Day
       │
       ▼
4. Mentor Milestone Review & Advisory (/api/bookings)
       │
       ▼
5. Automated Certificate Generation (/api/certificates) + HR Talent Pool Visibility
```

---

## 7. Developer & DevOps Commands

```bash
# 1. Start full-stack monorepo (Client on :5173 + Server on :4000)
npm run dev

# 2. Seed all 11 user roles across both college clusters (Password: test1234)
npm run seed --workspace=@forge-loom/server

# 3. Full-workspace typecheck (zero type errors)
npm run typecheck

# 4. Generate & apply database migrations
npx prisma migrate dev --schema=apps/server/src/prisma/schema.prisma

# 5. Start Docker infrastructure services (PostgreSQL & Redis)
docker compose -f infra/docker-compose.yml up -d
```

---
*Document automatically compiled and verified for the FORGE Loom LMS platform.*
