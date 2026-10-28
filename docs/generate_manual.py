import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FORGE Loom LMS — Architecture, Modules & Operational Guide</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4 portrait;
      margin: 14mm 12mm 14mm 12mm;
      @bottom-right {
        content: counter(page);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 8pt;
        color: #94a3b8;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.5;
      font-size: 9.5pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Page & Layout utilities */
    .page-break {
      page-break-after: always;
      break-after: page;
    }

    .no-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Headers and typography */
    h1, h2, h3, h4 {
      color: #0f172a;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    h1 { font-size: 20pt; line-height: 1.2; }
    h2 { font-size: 14pt; margin-bottom: 8px; color: #1e3a8a; display: flex; align-items: center; gap: 8px; }
    h3 { font-size: 11pt; margin-top: 10px; margin-bottom: 6px; color: #1e293b; }
    p { margin-bottom: 8px; color: #334155; text-align: justify; }

    /* Cover Page */
    .cover {
      height: 250mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20mm 15mm 15mm 15mm;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: linear-gradient(145deg, #f8fafc 0%, #eff6ff 50%, #ffffff 100%);
      position: relative;
      overflow: hidden;
    }

    .cover::before {
      content: "";
      position: absolute;
      top: -100px;
      right: -100px;
      width: 340px;
      height: 340px;
      background: radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0) 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .brand-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #2563eb;
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 8.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .cover-title {
      font-size: 26pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
      margin-top: 15px;
      margin-bottom: 10px;
    }

    .cover-subtitle {
      font-size: 12pt;
      color: #475569;
      font-weight: 500;
      line-height: 1.4;
      max-width: 90%;
    }

    .meta-box {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(8px);
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px 16px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      font-size: 8.5pt;
    }

    .meta-item strong {
      color: #1e293b;
      display: block;
      font-size: 7.5pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2px;
    }

    /* Cards & Grids */
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }

    .card-header {
      font-weight: 700;
      font-size: 10pt;
      color: #1e293b;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 14px 0;
      font-size: 8.5pt;
    }

    th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      text-align: left;
      padding: 7px 10px;
      border: 1px solid #cbd5e1;
    }

    td {
      padding: 6px 10px;
      border: 1px solid #e2e8f0;
      color: #334155;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      background: #f1f5f9;
      padding: 2px 5px;
      border-radius: 4px;
      color: #0369a1;
      border: 1px solid #e2e8f0;
    }

    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: 600;
    }

    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-purple { background: #f3e8ff; color: #6b21a8; }
    .badge-amber { background: #fef3c7; color: #92400e; }
    .badge-slate { background: #f1f5f9; color: #475569; }

    /* Visual Diagram containers */
    .diagram-container {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px;
      margin: 10px 0 14px 0;
      text-align: center;
    }

    .diagram-caption {
      font-size: 7.5pt;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 6px;
    }

    /* Section badges */
    .sec-num {
      background: #2563eb;
      color: white;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 8.5pt;
      font-weight: 700;
    }

    /* Wireframe mock box */
    .wireframe-box {
      border: 1.5px dashed #94a3b8;
      border-radius: 6px;
      background: #ffffff;
      padding: 8px;
      margin-top: 6px;
    }

    .wf-topbar {
      height: 24px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      font-size: 7pt;
      font-weight: 600;
      color: #475569;
      margin-bottom: 6px;
    }

    .wf-body {
      display: flex;
      gap: 6px;
      height: 90px;
    }

    .wf-sidebar {
      width: 28%;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 5px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .wf-nav-item {
      height: 10px;
      background: #e2e8f0;
      border-radius: 2px;
    }

    .wf-nav-item.active {
      background: #bfdbfe;
      border: 1px solid #3b82f6;
    }

    .wf-content {
      flex: 1;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .wf-row {
      display: flex;
      gap: 4px;
    }

    .wf-card {
      flex: 1;
      height: 20px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 3px;
    }

    .wf-banner {
      height: 22px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 3px;
    }

    .wf-list {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 3px;
    }

    ul, ol {
      margin-left: 18px;
      margin-bottom: 8px;
      color: #334155;
    }

    li {
      margin-bottom: 3px;
    }
  </style>
</head>
<body>

  <!-- ==================== COVER PAGE ==================== -->
  <div class="cover">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="brand-tag">FORGE LOOM LMS</span>
        <span style="font-size: 8.5pt; font-weight: 600; color: #64748b;">Enterprise Technical Documentation</span>
      </div>
      <div style="margin-top: 35mm;">
        <h1 class="cover-title">Full Platform System Architecture, Wireframes & Operational Guide</h1>
        <p class="cover-subtitle">
          A definitive, production-accurate manual detailing the active technology stack, multi-tenant college isolation, role journeys, UI wireframes, seed credentials, and backend API endpoints.
        </p>
      </div>
    </div>

    <!-- Cover Architecture Diagram Snapshot -->
    <div style="margin: 20px 0; background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px;">
      <svg width="100%" height="110" viewBox="0 0 650 110" xmlns="http://www.w3.org/2000/svg">
        <!-- Client Layer -->
        <rect x="10" y="15" width="130" height="80" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="75" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="#1e3a8a" text-anchor="middle">Frontend SPA</text>
        <text x="75" y="60" font-family="'JetBrains Mono', monospace" font-size="8.5" fill="#2563eb" text-anchor="middle">React 18 + Vite</text>
        <text x="75" y="76" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" fill="#64748b" text-anchor="middle">Tailwind CSS 4.0</text>

        <!-- Connector Arrow -->
        <line x1="140" y1="55" x2="190" y2="55" stroke="#94a3b8" stroke-width="2" stroke-dasharray="3,3"/>
        <polygon points="190,55 182,50 182,60" fill="#94a3b8"/>
        <text x="165" y="48" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#64748b" text-anchor="middle">REST / JWT</text>

        <!-- Backend Layer -->
        <rect x="195" y="15" width="150" height="80" rx="6" fill="#f0fdf4" stroke="#22c55e" stroke-width="1.5"/>
        <text x="270" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="#14532d" text-anchor="middle">API Server</text>
        <text x="270" y="60" font-family="'JetBrains Mono', monospace" font-size="8.5" fill="#16a34a" text-anchor="middle">Express 4.21 (TS)</text>
        <text x="270" y="76" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" fill="#64748b" text-anchor="middle">22 Active Routers</text>

        <!-- Connector Arrow -->
        <line x1="345" y1="55" x2="395" y2="55" stroke="#94a3b8" stroke-width="2" stroke-dasharray="3,3"/>
        <polygon points="395,55 387,50 387,60" fill="#94a3b8"/>
        <text x="370" y="48" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#64748b" text-anchor="middle">Prisma ORM</text>

        <!-- Database Layer -->
        <rect x="400" y="15" width="115" height="80" rx="6" fill="#fefce8" stroke="#eab308" stroke-width="1.5"/>
        <text x="457" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="#713f12" text-anchor="middle">PostgreSQL</text>
        <text x="457" y="60" font-family="'JetBrains Mono', monospace" font-size="8.5" fill="#ca8a04" text-anchor="middle">Multi-Tenant DB</text>
        <text x="457" y="76" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" fill="#64748b" text-anchor="middle">College Scoped</text>

        <!-- Redis & S3 Layer -->
        <rect x="525" y="15" width="115" height="36" rx="6" fill="#faf5ff" stroke="#a855f7" stroke-width="1.5"/>
        <text x="582" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#581c87" text-anchor="middle">Redis & BullMQ</text>
        <text x="582" y="44" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#7e22ce" text-anchor="middle">Port 6379 / Queues</text>

        <rect x="525" y="58" width="115" height="37" rx="6" fill="#fff1f2" stroke="#f43f5e" stroke-width="1.5"/>
        <text x="582" y="75" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#881337" text-anchor="middle">AWS S3 / PDFKit</text>
        <text x="582" y="87" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#be123c" text-anchor="middle">Certs & Attachments</text>

        <line x1="345" y1="35" x2="525" y2="35" stroke="#cbd5e1" stroke-width="1.5"/>
        <line x1="345" y1="75" x2="525" y2="75" stroke="#cbd5e1" stroke-width="1.5"/>
      </svg>
    </div>

    <div>
      <div class="meta-box">
        <div class="meta-item">
          <strong>Official Repository</strong>
          <span style="font-family:'JetBrains Mono'; color:#2563eb;">github.com/Winnovationforge/Forge-loom</span>
        </div>
        <div class="meta-item">
          <strong>Architecture Model</strong>
          <span>Monorepo (Client, Server, Shared Types)</span>
        </div>
        <div class="meta-item">
          <strong>Runtime Verification</strong>
          <span>API: Port 4000 | Client: Port 5173 | DB: 5433</span>
        </div>
        <div class="meta-item">
          <strong>Default Seed Password</strong>
          <code style="font-weight:700;">test1234</code> (Universal Across All 11 Roles)
        </div>
      </div>
      <div style="margin-top: 15px; font-size: 8pt; color: #94a3b8; display: flex; justify-content: space-between;">
        <span>Published by Forge Engineering</span>
        <span>Version 1.0.0 &bull; October 2026</span>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 1: TECH STACK ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">1</span> Active Technology Stack</h2>
    <p>
      The <strong>FORGE Loom LMS</strong> platform is structured as a cohesive, high-performance monorepo with three interconnected packages: <code>apps/client</code>, <code>apps/server</code>, and <code>packages/shared-types</code>. The stack eliminates obsolete dependencies and focuses entirely on production-active modules.
    </p>

    <div class="grid-2" style="margin-top: 10px;">
      <!-- Frontend Stack Card -->
      <div class="card">
        <div class="card-header">
          <span>Frontend Client (<code>apps/client</code>)</span>
          <span class="badge badge-blue">Port 5173</span>
        </div>
        <p style="font-size: 8.5pt; margin-bottom: 6px;">Modern single-page application built for responsive, low-latency micro-interactions:</p>
        <table style="margin: 0; font-size: 8pt;">
          <tr>
            <th style="width: 32%;">Component</th>
            <th>Implementation & Scope</th>
          </tr>
          <tr>
            <td><strong>Core Engine</strong></td>
            <td><code>React 18.3.1</code> with <code>TypeScript 5.6.3</code> for strict end-to-end type safety.</td>
          </tr>
          <tr>
            <td><strong>Build Tool</strong></td>
            <td><code>Vite 5.4.8</code> with Instant Hot Module Replacement (HMR).</td>
          </tr>
          <tr>
            <td><strong>Styling & Design</strong></td>
            <td><code>Tailwind CSS v4.0</code> with custom glassmorphism design tokens, royal blue accent, and responsive flex/grid layouts.</td>
          </tr>
          <tr>
            <td><strong>Routing</strong></td>
            <td><code>React Router DOM 6.27.0</code> with dynamic <code>RequireAuth</code>, role-guarded nesting (<code>RequireRole</code>), and <code>ROLE_HOME_PATH</code> redirection.</td>
          </tr>
          <tr>
            <td><strong>Data Caching</strong></td>
            <td><code>@tanstack/react-query 5.59.16</code> handling server cache, refetching, and optimistic mutations.</td>
          </tr>
          <tr>
            <td><strong>Asset Suite</strong></td>
            <td><code>Lucide React 0.454.0</code> icons combined with custom flat 2D vector graphic illustrations (<code>.svg</code>).</td>
          </tr>
        </table>
      </div>

      <!-- Backend Stack Card -->
      <div class="card">
        <div class="card-header">
          <span>Backend API Server (<code>apps/server</code>)</span>
          <span class="badge badge-green">Port 4000</span>
        </div>
        <p style="font-size: 8.5pt; margin-bottom: 6px;">Enterprise REST service layered with strict validation, security headers, and relational isolation:</p>
        <table style="margin: 0; font-size: 8pt;">
          <tr>
            <th style="width: 32%;">Component</th>
            <th>Implementation & Scope</th>
          </tr>
          <tr>
            <td><strong>Runtime</strong></td>
            <td><code>Node.js v22 (ESM)</code> executed natively using <code>tsx watch</code> for development and <code>tsc</code> production build.</td>
          </tr>
          <tr>
            <td><strong>HTTP Framework</strong></td>
            <td><code>Express 4.21.1</code> with <code>helmet</code> security headers, <code>cors</code> with credentials, <code>cookie-parser</code>, and <code>morgan</code> dev logger.</td>
          </tr>
          <tr>
            <td><strong>ORM & Database</strong></td>
            <td><code>Prisma ORM 5.22.0</code> querying a multi-tenant <code>PostgreSQL</code> database (Port 5433).</td>
          </tr>
          <tr>
            <td><strong>Caching & Queues</strong></td>
            <td><code>ioredis 5.4.1</code> connecting to Redis (Port 6379) and <code>BullMQ 5.21.2</code> for asynchronous event/email processing.</td>
          </tr>
          <tr>
            <td><strong>Authentication</strong></td>
            <td><code>jsonwebtoken (JWT) 9.0.2</code>, <code>bcryptjs 2.4.3</code> password hashing, and cookie session transport.</td>
          </tr>
          <tr>
            <td><strong>Validation</strong></td>
            <td><code>Zod 3.23.8</code> request body, param, and query schemas.</td>
          </tr>
          <tr>
            <td><strong>Media & Certs</strong></td>
            <td><code>@aws-sdk/client-s3</code> + <code>PDFKit 0.20.1</code> & <code>qrcode 1.5.4</code> for on-the-fly certificate rendering.</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Monorepo Core Box -->
    <div class="card no-break" style="margin-top: 4px; background: #faf5ff; border-color: #e9d5ff;">
      <div class="card-header" style="color: #6b21a8;">
        <span>Shared Monorepo Domain Package (<code>packages/shared-types</code>)</span>
        <span class="badge badge-purple">Zero Duplication</span>
      </div>
      <p style="font-size: 8.5pt; margin: 0; color: #4a044e;">
        Ensures perfect compile-time harmony between frontend UI models and backend Prisma schemas. Defines 11 distinct user roles (<code>Role</code> enum: Student, Mentor, Trainer, Speaker, Hr, Sponsor, CollegeAdmin, CommunityLeader, MediaPartner, Member, ForgeAdmin, CourseAdmin), Course Progress structures, Booking statuses, Sprint models, and Certificate verification payloads.
      </p>
    </div>
  </div>

  <!-- ==================== SECTION 2: ACTIVE MODULES ==================== -->
  <div style="margin-top: 8mm;" class="no-break">
    <h2><span class="sec-num">2</span> Active Platform Modules (Production Features Only)</h2>
    <p>
      Per architectural guidelines, only currently implemented, functional modules mounted in <code>apps/server/src/app.ts</code> and configured in client routes are listed. Unused legacy stubs have been excluded.
    </p>

    <table>
      <thead>
        <tr>
          <th style="width: 22%;">Active Module</th>
          <th style="width: 28%;">Mounted API Route</th>
          <th style="width: 50%;">Core Capability & Business Logic</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Authentication & Identity</strong></td>
          <td><code>/api/auth</code></td>
          <td>User login, registration with automatic college provisioning (for College Admin), JWT cookie generation, session verification, and logout.</td>
        </tr>
        <tr>
          <td><strong>Course & Curriculum</strong></td>
          <td><code>/api/courses</code><br><code>/api/catalog</code></td>
          <td>Course creation/editing by Course Admins, public catalog browsing, module/topic syllabus hierarchies, and prerequisite checks.</td>
        </tr>
        <tr>
          <td><strong>Enrollments & Billing</strong></td>
          <td><code>/api/enrollments</code></td>
          <td>Batch enrollments, student course registration, college cohort allocation, and optional Razorpay integration client hooks.</td>
        </tr>
        <tr>
          <td><strong>Video & Course Progress</strong></td>
          <td><code>/api/video-progress</code><br><code>/api/students</code></td>
          <td>Timestamp-accurate YouTube/video playback tracking, completed lesson flags, student progress rollups, and weekly learning velocity tracker.</td>
        </tr>
        <tr>
          <td><strong>Sessions & Attendance</strong></td>
          <td><code>/api/sessions</code><br><code>/api/students/attendance</code></td>
          <td>Live trainer/mentor lectures, batch session scheduling, student attendance check-ins, and aggregate attendance percentage calculations.</td>
        </tr>
        <tr>
          <td><strong>Citadel Incubator & Sprints</strong></td>
          <td><code>/api/sprints</code><br><code>/api/problem-statements</code><br><code>/api/teams</code></td>
          <td>Core innovation engine: 3-stage sprint lifecycles (Sprint 1, 2, 3), student team grouping, industry challenge assignment, milestone submissions, and mentor reviews.</td>
        </tr>
        <tr>
          <td><strong>Mentor Booking Engine</strong></td>
          <td><code>/api/bookings</code></td>
          <td>1-on-1 expert advisory bookings, available time slot querying, glassmorphic scheduling modal, session confirmation, and feedback logging.</td>
        </tr>
        <tr>
          <td><strong>Certificates & Verification</strong></td>
          <td><code>/api/certificates</code></td>
          <td>Automated dynamic PDF certificate generation with embedded cryptographic verification QR codes and public lookup endpoint (<code>/verify/:token</code>).</td>
        </tr>
        <tr>
          <td><strong>Events & Workshops</strong></td>
          <td><code>/api/events</code></td>
          <td>Hackathons, masterclasses, and guest lectures. Supports attendee registration, event capacity constraints, and community RSVP.</td>
        </tr>
        <tr>
          <td><strong>HR Talent Pool Pipeline</strong></td>
          <td><code>/api/talent-pool</code><br><code>/api/hr-profile</code></td>
          <td>Corporate recruiter dashboard, company profile builder, student skill filtering, portfolio explorer, and interview shortlisting.</td>
        </tr>
        <tr>
          <td><strong>Multi-Tenant College Admin</strong></td>
          <td><code>/api/colleges</code><br><code>/api/cohorts</code></td>
          <td>Institution-level tenant isolation: student rosters, faculty/trainer tracking, department benchmarks, and cohort management.</td>
        </tr>
        <tr>
          <td><strong>Forge Global Admin</strong></td>
          <td><code>/api/admin</code></td>
          <td>Super-admin controls: platform-wide KPIs, college onboarding, cross-institutional user management, and system health metrics.</td>
        </tr>
        <tr>
          <td><strong>Real-Time Notifications</strong></td>
          <td><code>/api/notifications</code></td>
          <td>User notification feed, unread bell count badge, milestone status updates, and session booking alerts.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 3: WIREFRAME STRUCTURE ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">3</span> Complete LMS Wireframe & Layout Architecture</h2>
    <p>
      The LMS follows a unified <strong>Global Shell Architecture</strong> across all 11 user roles. This ensures visual consistency while dynamically swapping the sidebar navigation and content region based on authenticated role permissions.
    </p>

    <!-- Global Shell Architecture Diagram -->
    <div class="diagram-container no-break">
      <svg width="100%" height="150" viewBox="0 0 680 150" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer Frame -->
        <rect x="10" y="10" width="660" height="130" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
        
        <!-- Topbar -->
        <rect x="10" y="10" width="660" height="32" rx="8" fill="#1e3a8a"/>
        <rect x="10" y="32" width="660" height="10" fill="#1e3a8a"/>
        <circle cx="28" cy="26" r="7" fill="#3b82f6"/>
        <text x="42" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="800" fill="#ffffff">FORGE LOOM</text>
        <rect x="130" y="18" width="80" height="16" rx="4" fill="#3b82f6"/>
        <text x="170" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#ffffff" text-anchor="middle">ROLE BADGE</text>
        
        <!-- Topbar Right -->
        <circle cx="610" cy="26" r="6" fill="#f8fafc"/>
        <text x="610" y="29" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#1e3a8a" text-anchor="middle">3</text>
        <circle cx="640" cy="26" r="9" fill="#93c5fd"/>
        
        <!-- Sidebar -->
        <rect x="10" y="42" width="160" height="98" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
        <rect x="20" y="52" width="140" height="14" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1"/>
        <text x="30" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#1e40af">&bull; Dashboard (Active)</text>
        
        <rect x="20" y="70" width="140" height="12" rx="3" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="30" y="79" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#64748b">&bull; My Courses / Sprints</text>
        
        <rect x="20" y="86" width="140" height="12" rx="3" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="30" y="95" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#64748b">&bull; Mentor Advisory</text>
        
        <rect x="20" y="102" width="140" height="12" rx="3" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="30" y="111" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#64748b">&bull; Certifications / Events</text>

        <rect x="20" y="118" width="140" height="12" rx="3" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="30" y="127" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#ef4444">&bull; Sign Out</text>

        <!-- Content Area -->
        <rect x="175" y="46" width="490" height="88" fill="#ffffff"/>
        
        <!-- Header row -->
        <rect x="180" y="50" width="220" height="12" rx="3" fill="#f1f5f9"/>
        <text x="185" y="59" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#334155">Welcome Back, Student &bull; B.Tech Computer Science</text>
        
        <!-- 4 KPI Cards -->
        <rect x="180" y="68" width="115" height="26" rx="4" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
        <text x="186" y="79" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" fill="#1e40af">Builder Score</text>
        <text x="186" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" fill="#1e3a8a">845 XP</text>

        <rect x="302" y="68" width="115" height="26" rx="4" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1"/>
        <text x="308" y="79" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" fill="#166534">Active Courses</text>
        <text x="308" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" fill="#14532d">3 Enrolled</text>

        <rect x="424" y="68" width="115" height="26" rx="4" fill="#fefce8" stroke="#fef08a" stroke-width="1"/>
        <text x="430" y="79" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" fill="#854d0e">Attendance Rate</text>
        <text x="430" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" fill="#713f12">94.2%</text>

        <rect x="546" y="68" width="115" height="26" rx="4" fill="#faf5ff" stroke="#e9d5ff" stroke-width="1"/>
        <text x="552" y="79" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" fill="#6b21a8">Upcoming Sessions</text>
        <text x="552" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" fill="#581c87">2 Scheduled</text>

        <!-- Lower Split: Course Banner + Mentor Card -->
        <rect x="180" y="100" width="310" height="30" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
        <text x="190" y="112" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#1e293b">In Progress: Full-Stack Web Development</text>
        <rect x="190" y="118" width="220" height="5" rx="2.5" fill="#e2e8f0"/>
        <rect x="190" y="118" width="145" height="5" rx="2.5" fill="#3b82f6"/>
        <text x="420" y="123" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="700" fill="#2563eb">68%</text>

        <rect x="498" y="100" width="163" height="30" rx="4" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
        <text x="506" y="112" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#1e40af">Mentor: Dr. Sarah Vance</text>
        <rect x="506" y="116" width="70" height="11" rx="3" fill="#2563eb"/>
        <text x="541" y="124" font-family="'Plus Jakarta Sans', sans-serif" font-size="6" font-weight="700" fill="#ffffff" text-anchor="middle">Book Session</text>
      </svg>
      <div class="diagram-caption">Figure 3.1: Global Application Shell & Student Dashboard Wireframe Architecture</div>
    </div>

    <!-- Wireframes breakdown for core roles -->
    <div class="grid-2" style="margin-top: 10px;">
      <!-- Wireframe 1: Student Portal -->
      <div class="card no-break">
        <div class="card-header">
          <span>Student Portal (<code>/student/*</code>)</span>
          <span class="badge badge-blue">Core Learner</span>
        </div>
        <ul style="font-size: 8pt; margin-left: 14px; margin-bottom: 4px;">
          <li><strong>Home Dashboard (<code>/student</code>):</strong> Personal greeting, Builder Score counter, 4 KPI cards, active course progress bars, upcoming mentor sessions, and next events.</li>
          <li><strong>Course Player (<code>/student/courses/:id</code>):</strong> Interactive syllabus navigation tree, timestamp-synced video player, lesson completion checkbox, and downloadable resources.</li>
          <li><strong>Citadel Hub (<code>/student/citadel</code>):</strong> Innovation incubator: 3-Sprint horizontal progress stepper, Problem Statement challenge viewer, milestone submission forms, and mentor review threads.</li>
          <li><strong>Book a Mentor (<code>/student/mentor</code>):</strong> Glassmorphic mentor profile modal, date/time slot picker, topic definition, and booking confirmation.</li>
        </ul>
      </div>

      <!-- Wireframe 2: Mentor Portal -->
      <div class="card no-break">
        <div class="card-header">
          <span>Mentor Portal (<code>/mentor/*</code>)</span>
          <span class="badge badge-green">Advisory & Evaluation</span>
        </div>
        <ul style="font-size: 8pt; margin-left: 14px; margin-bottom: 4px;">
          <li><strong>Mentor Dashboard (<code>/mentor</code>):</strong> Pending 1-on-1 booking requests, assigned mentee rosters, upcoming sessions calendar, and sprint review queues.</li>
          <li><strong>Assigned Mentees (<code>/mentor/students</code>):</strong> Drill-in student profiles, course completion rates, attendance history, and direct notes.</li>
          <li><strong>Citadel Teams (<code>/mentor/teams</code>):</strong> Innovation teams milestone grading, feedback submission box, and investor readiness approvals.</li>
          <li><strong>Availability Manager (<code>/mentor/sessions</code>):</strong> Weekly calendar slot configuration, accept/reject booking requests.</li>
        </ul>
      </div>

      <!-- Wireframe 3: HR & Talent Pool -->
      <div class="card no-break">
        <div class="card-header">
          <span>HR & Talent Portal (<code>/hr/*</code>)</span>
          <span class="badge badge-purple">Recruitment Pipeline</span>
        </div>
        <ul style="font-size: 8pt; margin-left: 14px; margin-bottom: 4px;">
          <li><strong>Recruiter Home (<code>/hr</code>):</strong> Active job opportunities, shortlisting stats, campus hiring event attendance.</li>
          <li><strong>Talent Pool (<code>/hr/talent-pool</code>):</strong> Full-text student candidate search, multi-skill selection tags, Builder Score range slider, and portfolio links.</li>
          <li><strong>Builder Profile Drill-down:</strong> Detailed verified resume: completed projects, GitHub links, sprint evaluations, and interview scheduling action.</li>
        </ul>
      </div>

      <!-- Wireframe 4: College & Forge Admin -->
      <div class="card no-break">
        <div class="card-header">
          <span>College & Forge Admin (<code>/college</code> & <code>/admin</code>)</span>
          <span class="badge badge-amber">Institutional Control</span>
        </div>
        <ul style="font-size: 8pt; margin-left: 14px; margin-bottom: 4px;">
          <li><strong>College Admin (<code>/college</code>):</strong> Institution-isolated dashboard (Forge Institute vs Riverside College), student enrollment counts, faculty rosters, and placement metrics.</li>
          <li><strong>Course Admin (<code>/course-admin</code>):</strong> Rich course editor, curriculum builder, lesson module creator, and batch assignments.</li>
          <li><strong>Forge Super Admin (<code>/admin</code>):</strong> Cross-college global analytics, new college onboarding, system health, and database metrics.</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 4: SEED ACCOUNTS & CREDENTIALS ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">4</span> Seed Passwords, User Directory & Multi-Tenant Clusters</h2>
    <p>
      The platform includes automated deterministic database fixtures seeded via <code>apps/server/src/scripts/seed.ts</code>. All seed accounts share a single, universal development password.
    </p>

    <!-- Key Password Callout Box -->
    <div class="card no-break" style="background: #eff6ff; border: 1.5px solid #3b82f6; padding: 10px 14px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 7.5pt; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 0.05em;">Universal Seed Credentials</span>
          <div style="font-size: 13pt; font-weight: 800; color: #1e3a8a; margin-top: 2px;">
            Password: <code style="font-size: 13pt; background: #ffffff; padding: 2px 8px; color: #2563eb;">test1234</code>
          </div>
        </div>
        <div style="text-align: right; font-size: 8pt; color: #475569;">
          Applies to all 11 user roles across both multi-tenant college clusters.<br>
          Bcrypt hashed & salted at seed time.
        </div>
      </div>
    </div>

    <h3>4.1 Multi-Tenant College Clusters (Tenant Isolation Testing)</h3>
    <p>
      Two isolated colleges are seeded in PostgreSQL. Users in <strong>Cluster 1</strong> (Forge Institute) are strictly isolated from users in <strong>Cluster 2</strong> (Riverside College), verifying the multi-tenant security barrier.
    </p>

    <table>
      <thead>
        <tr>
          <th>College / Tenant</th>
          <th>Role</th>
          <th>Display Name</th>
          <th>Login Email</th>
          <th>Landing Route</th>
        </tr>
      </thead>
      <tbody>
        <!-- College 1 -->
        <tr>
          <td rowspan="4" style="vertical-align: middle; background: #f8fafc; font-weight: 700; color: #1e3a8a;">
            College Cluster 1<br>
            <span style="font-size: 7.5pt; font-weight: normal; color: #64748b;">Forge Institute of Technology</span>
          </td>
          <td><span class="badge badge-amber">CollegeAdmin</span></td>
          <td>Forge Institute of Technology</td>
          <td><code>college1@forgeloom.dev</code></td>
          <td><code>/college</code></td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">Student</span></td>
          <td>Student One</td>
          <td><code>student1@forgeloom.dev</code></td>
          <td><code>/student</code></td>
        </tr>
        <tr>
          <td><span class="badge badge-green">Mentor</span></td>
          <td>Mentor One</td>
          <td><code>mentor1@forgeloom.dev</code></td>
          <td><code>/mentor</code></td>
        </tr>
        <tr>
          <td><span class="badge badge-purple">Trainer</span></td>
          <td>Trainer One</td>
          <td><code>trainer1@forgeloom.dev</code></td>
          <td><code>/trainer</code></td>
        </tr>

        <!-- College 2 -->
        <tr>
          <td rowspan="4" style="vertical-align: middle; background: #ffffff; font-weight: 700; color: #047857;">
            College Cluster 2<br>
            <span style="font-size: 7.5pt; font-weight: normal; color: #64748b;">Riverside College of Engineering</span>
          </td>
          <td><span class="badge badge-amber">CollegeAdmin</span></td>
          <td>Riverside College of Engineering</td>
          <td><code>college2@forgeloom.dev</code></td>
          <td><code>/college</code></td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">Student</span></td>
          <td>Student Two</td>
          <td><code>student2@forgeloom.dev</code></td>
          <td><code>/student</code></td>
        </tr>
        <tr>
          <td><span class="badge badge-green">Mentor</span></td>
          <td>Mentor Two</td>
          <td><code>mentor2@forgeloom.dev</code></td>
          <td><code>/mentor</code></td>
        </tr>
        <tr>
          <td><span class="badge badge-purple">Trainer</span></td>
          <td>Trainer Two</td>
          <td><code>trainer2@forgeloom.dev</code></td>
          <td><code>/trainer</code></td>
        </tr>
      </tbody>
    </table>

    <h3 style="margin-top: 10px;">4.2 Global & Cross-Ecosystem Accounts</h3>
    <p>
      Platform-wide roles governing curriculum authoring, corporate placement, industry keynotes, and administrative governance:
    </p>

    <table>
      <thead>
        <tr>
          <th>Role</th>
          <th>Designation / Entity</th>
          <th>Login Email</th>
          <th>Universal Password</th>
          <th>Landing Route</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="badge badge-purple">ForgeAdmin</span></td>
          <td>Forge Platform Super Admin</td>
          <td><code>admin1@forgeloom.dev</code></td>
          <td><code>test1234</code></td>
          <td><code>/admin</code></td>
        </tr>
        <tr>
          <td><span class="badge badge-purple">CourseAdmin</span></td>
          <td>Lead Curriculum Creator</td>
          <td><code>course_admin1@forgeloom.dev</code></td>
          <td><code>test1234</code></td>
          <td><code>/course-admin</code></td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">Hr</span></td>
          <td>Corporate Hiring Partner</td>
          <td><code>hr1@forgeloom.dev</code></td>
          <td><code>test1234</code></td>
          <td><code>/hr</code></td>
        </tr>
        <tr>
          <td><span class="badge badge-green">Speaker</span></td>
          <td>Guest Industry Keynote</td>
          <td><code>speaker1@forgeloom.dev</code></td>
          <td><code>test1234</code></td>
          <td><code>/speaker</code></td>
        </tr>
        <tr>
          <td><span class="badge badge-amber">Sponsor</span></td>
          <td>Corporate Innovation Sponsor</td>
          <td><code>sponsor1@forgeloom.dev</code></td>
          <td><code>test1234</code></td>
          <td><code>/sponsor</code></td>
        </tr>
        <tr>
          <td><span class="badge badge-slate">CommunityLeader</span></td>
          <td>Tech Chapter Organizer</td>
          <td><code>community1@forgeloom.dev</code></td>
          <td><code>test1234</code></td>
          <td><code>/community</code></td>
        </tr>
        <tr>
          <td><span class="badge badge-slate">MediaPartner</span></td>
          <td>Media Coverage Representative</td>
          <td><code>media1@forgeloom.dev</code></td>
          <td><code>test1234</code></td>
          <td><code>/media</code></td>
        </tr>
        <tr>
          <td><span class="badge badge-slate">Member</span></td>
          <td>General Ecosystem Member</td>
          <td><code>member1@forgeloom.dev</code></td>
          <td><code>test1234</code></td>
          <td><code>/member</code></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 5: FLOW DIAGRAMS ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">5</span> Operational Flow Diagrams & User Journeys</h2>
    <p>
      The following diagrams illustrate the core lifecycle operations of FORGE Loom LMS, from role authentication and dynamic landing resolution to the Citadel innovation sprint reviews and mentor scheduling.
    </p>

    <!-- Diagram 5.1: Authentication & Dynamic Role-Based Landing Resolution -->
    <div class="card no-break" style="margin-top: 8px;">
      <div class="card-header">
        <span>Diagram 5.1: Authentication & Dynamic Role-Based Routing Flow</span>
        <span class="badge badge-blue">Security Layer</span>
      </div>
      <div class="diagram-container" style="background: white; border: none; padding: 4px 0;">
        <svg width="100%" height="150" viewBox="0 0 660 150" xmlns="http://www.w3.org/2000/svg">
          <!-- Step 1: User Login Input -->
          <rect x="10" y="45" width="100" height="60" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="60" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#1e40af" text-anchor="middle">User Login</text>
          <text x="60" y="85" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#64748b" text-anchor="middle">Email + Pass</text>

          <!-- Arrow 1 -->
          <line x1="110" y1="75" x2="145" y2="75" stroke="#94a3b8" stroke-width="1.5"/>
          <polygon points="145,75 138,71 138,79" fill="#94a3b8"/>

          <!-- Step 2: Express /api/auth/login -->
          <rect x="150" y="35" width="125" height="80" rx="6" fill="#f0fdf4" stroke="#22c55e" stroke-width="1.5"/>
          <text x="212" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#14532d" text-anchor="middle">Express Server</text>
          <text x="212" y="72" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#16a34a" text-anchor="middle">POST /api/auth/login</text>
          <text x="212" y="86" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b" text-anchor="middle">Bcrypt Check &bull; JWT Sign</text>
          <text x="212" y="99" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b" text-anchor="middle">Set HTTP Cookie</text>

          <!-- Arrow 2 -->
          <line x1="275" y1="75" x2="310" y2="75" stroke="#94a3b8" stroke-width="1.5"/>
          <polygon points="310,75 303,71 303,79" fill="#94a3b8"/>

          <!-- Step 3: Client AuthContext -->
          <rect x="315" y="45" width="115" height="60" rx="6" fill="#fefce8" stroke="#eab308" stroke-width="1.5"/>
          <text x="372" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#854d0e" text-anchor="middle">Client AuthContext</text>
          <text x="372" y="85" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#ca8a04" text-anchor="middle">User State Stored</text>

          <!-- Arrow 3 Split -->
          <line x1="430" y1="75" x2="465" y2="75" stroke="#94a3b8" stroke-width="1.5"/>
          <polygon points="465,75 458,71 458,79" fill="#94a3b8"/>

          <!-- Step 4: ROLE_HOME_PATH Resolver -->
          <rect x="470" y="20" width="180" height="110" rx="6" fill="#faf5ff" stroke="#a855f7" stroke-width="1.5"/>
          <text x="560" y="40" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#6b21a8" text-anchor="middle">ROLE_HOME_PATH Resolver</text>
          
          <rect x="480" y="48" width="75" height="16" rx="3" fill="#dbeafe"/>
          <text x="517" y="59" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#1e40af" text-anchor="middle">Student &rarr; /student</text>

          <rect x="565" y="48" width="75" height="16" rx="3" fill="#dcfce7"/>
          <text x="602" y="59" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#166534" text-anchor="middle">Mentor &rarr; /mentor</text>

          <rect x="480" y="70" width="75" height="16" rx="3" fill="#fef3c7"/>
          <text x="517" y="81" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#92400e" text-anchor="middle">Trainer &rarr; /trainer</text>

          <rect x="565" y="70" width="75" height="16" rx="3" fill="#fce7f3"/>
          <text x="602" y="81" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#9d174d" text-anchor="middle">HR &rarr; /hr</text>

          <rect x="480" y="92" width="75" height="16" rx="3" fill="#e0e7ff"/>
          <text x="517" y="103" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#3730a3" text-anchor="middle">College &rarr; /college</text>

          <rect x="565" y="92" width="75" height="16" rx="3" fill="#fee2e2"/>
          <text x="602" y="103" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#991b1b" text-anchor="middle">Admin &rarr; /admin</text>
        </svg>
      </div>
      <p style="font-size: 8pt; margin: 4px 0 0 0; color: #64748b;">
        On successful login, the frontend receives the user's role and immediately redirects them to their specialized portal via <code>roleHome.ts</code>. Direct deep-link navigation is guarded by <code>RequireRole</code> to prevent unauthorized privilege escalation.
      </p>
    </div>

    <!-- Diagram 5.2: Student Citadel Innovation & Sprint Cycle Journey -->
    <div class="card no-break" style="margin-top: 10px;">
      <div class="card-header">
        <span>Diagram 5.2: Student Citadel Innovation Sprint & Mentorship Journey</span>
        <span class="badge badge-green">Learning Lifecycle</span>
      </div>
      <div class="diagram-container" style="background: white; border: none; padding: 4px 0;">
        <svg width="100%" height="135" viewBox="0 0 660 135" xmlns="http://www.w3.org/2000/svg">
          <!-- Step 1: Course Enrollment -->
          <rect x="10" y="35" width="105" height="65" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="62" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#1e40af" text-anchor="middle">1. Course Enrollment</text>
          <text x="62" y="72" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b" text-anchor="middle">Batch / College Scope</text>
          <text x="62" y="85" font-family="'JetBrains Mono', monospace" font-size="7" fill="#2563eb" text-anchor="middle">/api/enrollments</text>

          <!-- Arrow 1 -->
          <line x1="115" y1="67" x2="140" y2="67" stroke="#94a3b8" stroke-width="1.5"/>
          <polygon points="140,67 133,63 133,71" fill="#94a3b8"/>

          <!-- Step 2: Learning & Video Progress -->
          <rect x="145" y="35" width="115" height="65" rx="6" fill="#f0fdf4" stroke="#22c55e" stroke-width="1.5"/>
          <text x="202" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#14532d" text-anchor="middle">2. Video Progress</text>
          <text x="202" y="72" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b" text-anchor="middle">Timestamp Tracking</text>
          <text x="202" y="85" font-family="'JetBrains Mono', monospace" font-size="7" fill="#16a34a" text-anchor="middle">Builder Score Accrual</text>

          <!-- Arrow 2 -->
          <line x1="260" y1="67" x2="285" y2="67" stroke="#94a3b8" stroke-width="1.5"/>
          <polygon points="285,67 278,63 278,71" fill="#94a3b8"/>

          <!-- Step 3: Citadel Innovation Incubator -->
          <rect x="290" y="35" width="125" height="65" rx="6" fill="#fefce8" stroke="#eab308" stroke-width="1.5"/>
          <text x="352" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#854d0e" text-anchor="middle">3. Citadel Sprints</text>
          <text x="352" y="72" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b" text-anchor="middle">Sprint 1 &bull; 2 &bull; 3</text>
          <text x="352" y="85" font-family="'JetBrains Mono', monospace" font-size="7" fill="#ca8a04" text-anchor="middle">Milestone Submission</text>

          <!-- Arrow 3 -->
          <line x1="415" y1="67" x2="440" y2="67" stroke="#94a3b8" stroke-width="1.5"/>
          <polygon points="440,67 433,63 433,71" fill="#94a3b8"/>

          <!-- Step 4: Mentor Evaluation -->
          <rect x="445" y="35" width="105" height="65" rx="6" fill="#faf5ff" stroke="#a855f7" stroke-width="1.5"/>
          <text x="497" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#6b21a8" text-anchor="middle">4. Mentor Review</text>
          <text x="497" y="72" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b" text-anchor="middle">Feedback & Grading</text>
          <text x="497" y="85" font-family="'JetBrains Mono', monospace" font-size="7" fill="#7e22ce" text-anchor="middle">1-on-1 Advisory</text>

          <!-- Arrow 4 -->
          <line x1="550" y1="67" x2="575" y2="67" stroke="#94a3b8" stroke-width="1.5"/>
          <polygon points="575,67 568,63 568,71" fill="#94a3b8"/>

          <!-- Step 5: Certification & Talent Pool -->
          <rect x="580" y="35" width="70" height="65" rx="6" fill="#fff1f2" stroke="#f43f5e" stroke-width="1.5"/>
          <text x="615" y="55" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#881337" text-anchor="middle">5. Certify</text>
          <text x="615" y="68" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" fill="#64748b" text-anchor="middle">QR PDF Cert</text>
          <text x="615" y="80" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" fill="#be123c" text-anchor="middle">HR Talent</text>
        </svg>
      </div>
      <p style="font-size: 8pt; margin: 4px 0 0 0; color: #64748b;">
        Progressing through course modules increases the student's Builder Score. In parallel, team-based Citadel Sprints test practical problem-solving. Completing milestones unlocks mentor review feedback, automated certificate issuance, and exposure to corporate recruiters in the HR Talent Pool.
      </p>
    </div>

    <!-- Diagram 5.3: Mentor Booking Engine Lifecycle -->
    <div class="card no-break" style="margin-top: 10px;">
      <div class="card-header">
        <span>Diagram 5.3: 1-on-1 Mentor Booking Lifecycle</span>
        <span class="badge badge-purple">Advisory Pipeline</span>
      </div>
      <div style="font-size: 8pt; color: #334155; line-height: 1.5;">
        <ol style="margin-left: 18px;">
          <li><strong>Slot Discovery:</strong> Student opens the Mentor Booking Modal on <code>/student/mentor</code>. Frontend queries available slots for assigned mentors via <code>GET /api/bookings/available-slots</code>.</li>
          <li><strong>Booking Request:</strong> Student specifies meeting agenda, topic, and preferred time slot. Submits <code>POST /api/bookings</code>, which creates a pending booking record.</li>
          <li><strong>Notification Trigger:</strong> Backend issues an in-app notification via <code>/api/notifications</code> alerting the mentor to the new booking request.</li>
          <li><strong>Mentor Confirmation:</strong> Mentor logs into <code>/mentor/sessions</code>, reviews the student's current Builder Score and project status, and approves or reschedules the session.</li>
          <li><strong>Session Execution & Feedback:</strong> Post-session, the mentor submits session notes and evaluation metrics, updating the student's advisory log.</li>
        </ol>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 6: RUNTIME COMMANDS & VALIDATION ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">6</span> System Operations, Verification & Maintenance</h2>
    <p>
      Essential command-line operations for starting services, re-seeding fixtures, executing database migrations, and validating compile-time TypeScript integrity across the entire monorepo.
    </p>

    <div class="card no-break" style="margin-top: 10px;">
      <div class="card-header">
        <span>Development Startup & Service Commands</span>
        <span class="badge badge-blue">Local Environment</span>
      </div>
      <table style="margin: 0; font-size: 8pt;">
        <tr>
          <th style="width: 25%;">Task</th>
          <th style="width: 40%;">Command</th>
          <th>Description</th>
        </tr>
        <tr>
          <td><strong>Full Stack Dev Run</strong></td>
          <td><code>npm run dev</code></td>
          <td>Builds <code>@forge-loom/shared-types</code> and executes both <code>apps/client</code> (Vite: 5173) and <code>apps/server</code> (Express: 4000) concurrently.</td>
        </tr>
        <tr>
          <td><strong>Seed Database</strong></td>
          <td><code>npm run seed --workspace=@forge-loom/server</code></td>
          <td>Seeds all 11 user roles across Forge Institute and Riverside College with password <code>test1234</code>. Safe to re-run (idempotent).</td>
        </tr>
        <tr>
          <td><strong>Typecheck Entire Repo</strong></td>
          <td><code>npm run typecheck</code></td>
          <td>Executes <code>tsc --noEmit</code> across client, server, and shared types ensuring zero type errors.</td>
        </tr>
        <tr>
          <td><strong>Database Migrations</strong></td>
          <td><code>npx prisma migrate dev --schema=apps/server/src/prisma/schema.prisma</code></td>
          <td>Applies schema updates to PostgreSQL and regenerates the Prisma Client.</td>
        </tr>
        <tr>
          <td><strong>Docker Services</strong></td>
          <td><code>docker compose -f infra/docker-compose.yml up -d</code></td>
          <td>Launches PostgreSQL (port 5433) and Redis (port 6379) background containers.</td>
        </tr>
      </table>
    </div>

    <!-- Summary Box -->
    <div class="card no-break" style="margin-top: 15px; background: #f8fafc; border-left: 4px solid #2563eb;">
      <div style="font-weight: 700; color: #1e3a8a; font-size: 9.5pt; margin-bottom: 4px;">Summary & Repository Verification</div>
      <p style="font-size: 8.5pt; margin-bottom: 6px; color: #334155;">
        This document represents the complete, verified state of the <strong>FORGE Loom LMS</strong> platform. The entire codebase is stored and tracked under the official repository:
      </p>
      <div style="font-family:'JetBrains Mono'; font-size: 9pt; color:#2563eb; background:#ffffff; padding:6px 10px; border-radius:4px; border:1px solid #cbd5e1; display:inline-block;">
        https://github.com/Winnovationforge/Forge-loom.git
      </div>
      <p style="font-size: 8pt; color: #64748b; margin-top: 8px; margin-bottom: 0;">
        All visual assets conform to the 2D flat modern aesthetic, free of emojis, and optimized for scalable institutional deployment across colleges, universities, and enterprise skill centers.
      </p>
    </div>
  </div>

</body>
</html>
"""

html_path = "/Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_LMS_ARCHITECTURE_MANUAL.html"
pdf_path = "/Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_LMS_ARCHITECTURE_MANUAL.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML written to {html_path}")

cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file://{html_path}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome return code:", res.returncode)
if os.path.exists(pdf_path):
    print(f"Success! PDF generated at {pdf_path} (Size: {os.path.getsize(pdf_path)} bytes)")
else:
    print("PDF generation failed:", res.stderr)
