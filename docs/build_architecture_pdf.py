import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FORGE Loom LMS — System Architecture & Infrastructure Guide</title>
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

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.5;
      font-size: 9.5pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page-break { page-break-after: always; break-after: page; }
    .no-break { page-break-inside: avoid; break-inside: avoid; }

    h1, h2, h3, h4 { color: #0f172a; font-weight: 700; letter-spacing: -0.02em; }
    h1 { font-size: 20pt; line-height: 1.2; }
    h2 { font-size: 13.5pt; margin-bottom: 8px; color: #1e3a8a; display: flex; align-items: center; gap: 8px; }
    h3 { font-size: 10.5pt; margin-top: 10px; margin-bottom: 6px; color: #1e293b; }
    p { margin-bottom: 8px; color: #334155; text-align: justify; }

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
      font-size: 25pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
      margin-top: 15px;
      margin-bottom: 10px;
    }

    .cover-subtitle {
      font-size: 11.5pt;
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

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 12px 0;
      font-size: 8.5pt;
    }

    th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      text-align: left;
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
    }

    td {
      padding: 6px 10px;
      border: 1px solid #e2e8f0;
      color: #334155;
      vertical-align: top;
    }

    tr:nth-child(even) td { background: #f8fafc; }

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

    .diagram-container {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px;
      margin: 8px 0 12px 0;
      text-align: center;
    }

    .diagram-caption {
      font-size: 7.5pt;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 4px;
    }

    ul, ol { margin-left: 18px; margin-bottom: 8px; color: #334155; font-size: 8.5pt; }
    li { margin-bottom: 3px; }
  </style>
</head>
<body>

  <!-- ==================== COVER PAGE ==================== -->
  <div class="cover">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="brand-tag">FORGE LOOM LMS</span>
        <span style="font-size: 8.5pt; font-weight: 600; color: #64748b;">System Architecture Reference</span>
      </div>
      <div style="margin-top: 35mm;">
        <h1 class="cover-title">Full Platform System Architecture & Infrastructure Guide</h1>
        <p class="cover-subtitle">
          The engineering backbone for the FORGE Program (Winnovation). Comprehensive reference detailing the PERN stack, multi-tenant isolation, asynchronous score computation, Redis queues, and horizontal scaling.
        </p>
      </div>
    </div>

    <!-- Cover Architecture SVG -->
    <div style="margin: 20px 0; background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px;">
      <svg width="100%" height="100" viewBox="0 0 650 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="130" height="80" rx="6" fill="#eff6ff" stroke="#3b82f6"/>
        <text x="75" y="40" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" fill="#1e3a8a" text-anchor="middle">Client Layer</text>
        <text x="75" y="55" font-family="'JetBrains Mono', monospace" font-size="8" fill="#2563eb" text-anchor="middle">React 18 + TS</text>
        <text x="75" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#64748b" text-anchor="middle">Role Shells</text>

        <line x1="140" y1="50" x2="190" y2="50" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
        <polygon points="190,50 183,46 183,54" fill="#94a3b8"/>

        <rect x="195" y="10" width="140" height="80" rx="6" fill="#f0fdf4" stroke="#22c55e"/>
        <text x="265" y="40" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" fill="#14532d" text-anchor="middle">API Cluster</text>
        <text x="265" y="55" font-family="'JetBrains Mono', monospace" font-size="8" fill="#16a34a" text-anchor="middle">Express (Stateless)</text>
        <text x="265" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#64748b" text-anchor="middle">JWT Verification</text>

        <line x1="335" y1="50" x2="385" y2="50" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
        <polygon points="385,50 378,46 378,54" fill="#94a3b8"/>

        <rect x="390" y="10" width="120" height="80" rx="6" fill="#fefce8" stroke="#eab308"/>
        <text x="450" y="40" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" fill="#713f12" text-anchor="middle">Database</text>
        <text x="450" y="55" font-family="'JetBrains Mono', monospace" font-size="8" fill="#ca8a04" text-anchor="middle">PostgreSQL (Prisma)</text>
        <text x="450" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#64748b" text-anchor="middle">Multi-Tenant</text>

        <rect x="525" y="10" width="115" height="38" rx="6" fill="#faf5ff" stroke="#a855f7"/>
        <text x="582" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#6b21a8" text-anchor="middle">Redis & BullMQ</text>
        <text x="582" y="39" font-family="'JetBrains Mono', monospace" font-size="7" fill="#7e22ce" text-anchor="middle">Port 6379</text>

        <rect x="525" y="52" width="115" height="38" rx="6" fill="#fff1f2" stroke="#f43f5e"/>
        <text x="582" y="69" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#881337" text-anchor="middle">S3 Storage</text>
        <text x="582" y="81" font-family="'JetBrains Mono', monospace" font-size="7" fill="#be123c" text-anchor="middle">Media & Certs</text>
      </svg>
    </div>

    <div>
      <div class="meta-box">
        <div class="meta-item">
          <strong>Stack Baseline</strong>
          <span>PostgreSQL + Express + React + Node.js (PERN)</span>
        </div>
        <div class="meta-item">
          <strong>Concurrency Target</strong>
          <span>5,000 &ndash; 50,000 Concurrent Users</span>
        </div>
        <div class="meta-item">
          <strong>Asynchronous Tasks</strong>
          <span>BullMQ Job Queue (Score Engine, PDF Certs, Notifs)</span>
        </div>
        <div class="meta-item">
          <strong>Tenancy Model</strong>
          <span>College-Scoped Row-Level Security</span>
        </div>
      </div>
      <div style="margin-top: 15px; font-size: 8pt; color: #94a3b8; display: flex; justify-content: space-between;">
        <span>Winnovation Systems Engineering</span>
        <span>October 2026 &bull; Architectural Blueprint</span>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 1: CORE DESIGN PRINCIPLES ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">1</span> Core Architectural Principles</h2>
    <p>
      The architecture of FORGE Loom is governed by five non-negotiable engineering principles designed to guarantee stability, horizontal scalability, and data integrity under high concurrent loads:
    </p>

    <div class="card no-break">
      <div class="card-header">
        <span>1. One Identity System, Distinct Role Shells</span>
        <span class="badge badge-blue">Identity</span>
      </div>
      <p style="font-size: 8.5pt; margin: 0; color: #334155;">
        Every stakeholder (Student, Mentor, Trainer, HR, College Admin) logs into the exact same application. The moment authentication resolves, the app renders a dedicated dashboard shell specifically tailored for their role. Role is a first-class enum (<code>Role</code>) on the <code>User</code> record, not a fragile permission flag.
      </p>
    </div>

    <div class="card no-break">
      <div class="card-header">
        <span>2. Strict Separation: Write-Heavy vs. Read-Heavy Paths</span>
        <span class="badge badge-green">Performance</span>
      </div>
      <p style="font-size: 8.5pt; margin: 0; color: #334155;">
        Attendance logging, video timestamp updates, and sprint milestone submissions are write-heavy, append-only streams. In contrast, the HR Talent Pool candidate search (filtering by skill, domain, and score) is read-heavy. These paths receive distinct indexing and caching treatment in PostgreSQL and Redis.
      </p>
    </div>

    <div class="card no-break">
      <div class="card-header">
        <span>3. Derived Scoring Engine (Asynchronous Recomputation)</span>
        <span class="badge badge-purple">Calculation</span>
      </div>
      <p style="font-size: 8.5pt; margin: 0; color: #334155;">
        A student's Builder Score is strictly computed—never manually typed in. It is derived from four weighted inputs: <strong>Events (20%)</strong>, <strong>Projects (40%)</strong>, <strong>Mentor Reviews (30%)</strong>, and <strong>Team Collaboration (10%)</strong>. Recomputations are dispatched asynchronously via BullMQ to avoid blocking HTTP request cycles.
      </p>
    </div>

    <div class="card no-break">
      <div class="card-header">
        <span>4. Citadel Innovation Incubator as an Explicit State Machine</span>
        <span class="badge badge-amber">State Machine</span>
      </div>
      <p style="font-size: 8.5pt; margin: 0; color: #334155;">
        Citadel is a formalized state machine bolted onto Student and Mentor data. Sprint cycle progression (Sprint 1, 2, 3), milestone submission states (<code>not_started</code>, <code>in_progress</code>, <code>submitted</code>, <code>reviewed</code>, <code>approved</code>), and investor unlock gates are explicitly modeled as discrete states.
      </p>
    </div>

    <div class="card no-break">
      <div class="card-header">
        <span>5. Zero Synchronous Heavy Lifting in Request Cycles</span>
        <span class="badge badge-blue">Asynchronous</span>
      </div>
      <p style="font-size: 8.5pt; margin: 0; color: #334155;">
        Certificate generation, notification fan-out, report exports, and score recomputation are processed via Redis-backed BullMQ queues. The API confirms receipt immediately, ensuring response times remain sub-50ms.
      </p>
    </div>
  </div>

  <!-- ==================== SECTION 2: SCORING ENGINE & QUEUES ==================== -->
  <div style="margin-top: 6mm;" class="no-break">
    <h2><span class="sec-num">2</span> Builder Score Engine & Queue Architecture</h2>
    <p>
      The Builder Score is the central gamification and talent discovery metric. The flowchart below outlines the event-driven scoring pipeline:
    </p>

    <!-- Scoring Engine SVG -->
    <div class="diagram-container no-break">
      <svg width="100%" height="150" viewBox="0 0 680 150" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="15" width="130" height="120" rx="6" fill="#eff6ff" stroke="#3b82f6"/>
        <text x="75" y="35" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#1e40af" text-anchor="middle">Score Triggers</text>
        <text x="75" y="55" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#334155" text-anchor="middle">&bull; Event Attendance (20%)</text>
        <text x="75" y="75" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#334155" text-anchor="middle">&bull; Project Sprints (40%)</text>
        <text x="75" y="95" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#334155" text-anchor="middle">&bull; Mentor Reviews (30%)</text>
        <text x="75" y="115" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#334155" text-anchor="middle">&bull; Team Peer Eval (10%)</text>

        <line x1="140" y1="75" x2="185" y2="75" stroke="#94a3b8" stroke-width="1.5"/>
        <polygon points="185,75 178,71 178,79" fill="#94a3b8"/>

        <rect x="190" y="35" width="135" height="80" rx="6" fill="#f0fdf4" stroke="#22c55e"/>
        <text x="257" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#14532d" text-anchor="middle">Express Service</text>
        <text x="257" y="75" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#16a34a" text-anchor="middle">scoreEvent.service</text>
        <text x="257" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b" text-anchor="middle">Dispatches Job to BullMQ</text>

        <line x1="325" y1="75" x2="370" y2="75" stroke="#94a3b8" stroke-width="1.5"/>
        <polygon points="370,75 363,71 363,79" fill="#94a3b8"/>

        <rect x="375" y="35" width="130" height="80" rx="6" fill="#faf5ff" stroke="#a855f7"/>
        <text x="440" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#6b21a8" text-anchor="middle">Redis / BullMQ Queue</text>
        <text x="440" y="75" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#7e22ce" text-anchor="middle">Queue: "score-recalc"</text>
        <text x="440" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b" text-anchor="middle">Concurrency: 5 workers</text>

        <line x1="505" y1="75" x2="550" y2="75" stroke="#94a3b8" stroke-width="1.5"/>
        <polygon points="550,75 543,71 543,79" fill="#94a3b8"/>

        <rect x="555" y="35" width="115" height="80" rx="6" fill="#fefce8" stroke="#eab308"/>
        <text x="612" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#713f12" text-anchor="middle">PostgreSQL Store</text>
        <text x="612" y="75" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#ca8a04" text-anchor="middle">studentProfiles.score</text>
        <text x="612" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b" text-anchor="middle">Indexed for HR Pool</text>
      </svg>
      <div class="diagram-caption">Figure 2.1: Asynchronous Score Calculation Pipeline via BullMQ & Redis</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 3: MULTI-TENANT ISOLATION ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">3</span> Multi-Tenant College Isolation Model</h2>
    <p>
      FORGE Loom enforces strict multi-tenancy at the data layer. College Admins, Students, Mentors, and Trainers belonging to <strong>College 1</strong> (Forge Institute of Technology) are completely partitioned from <strong>College 2</strong> (Riverside College of Engineering).
    </p>

    <!-- Multi-Tenant SVG -->
    <div class="diagram-container no-break">
      <svg width="100%" height="150" viewBox="0 0 680 150" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="320" height="130" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="170" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="700" fill="#1e40af" text-anchor="middle">Tenant Cluster 1: Forge Institute of Tech</text>
        <rect x="25" y="42" width="290" height="22" rx="3" fill="#ffffff" stroke="#bfdbfe"/>
        <text x="35" y="56" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" fill="#1e3a8a">College Admin: college1@forgeloom.dev</text>
        <rect x="25" y="68" width="140" height="20" rx="3" fill="#ffffff" stroke="#bfdbfe"/>
        <text x="35" y="81" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#166534">Student: student1</text>
        <rect x="175" y="68" width="140" height="20" rx="3" fill="#ffffff" stroke="#bfdbfe"/>
        <text x="185" y="81" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#ca8a04">Mentor: mentor1</text>
        <rect x="25" y="92" width="290" height="38" rx="3" fill="#ffffff" stroke="#bfdbfe"/>
        <text x="35" y="106" font-family="'JetBrains Mono', monospace" font-size="7" fill="#64748b">WHERE collegeId = 'fit-tenant-id'</text>
        <text x="35" y="120" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#1e40af">Zero cross-visibility with Riverside College</text>

        <rect x="350" y="10" width="320" height="130" rx="8" fill="#f0fdf4" stroke="#22c55e" stroke-width="1.5"/>
        <text x="510" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="700" fill="#14532d" text-anchor="middle">Tenant Cluster 2: Riverside Engineering</text>
        <rect x="365" y="42" width="290" height="22" rx="3" fill="#ffffff" stroke="#bbf7d0"/>
        <text x="375" y="56" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" fill="#14532d">College Admin: college2@forgeloom.dev</text>
        <rect x="365" y="68" width="140" height="20" rx="3" fill="#ffffff" stroke="#bbf7d0"/>
        <text x="375" y="81" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#166534">Student: student2</text>
        <rect x="515" y="68" width="140" height="20" rx="3" fill="#ffffff" stroke="#bbf7d0"/>
        <text x="525" y="81" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#ca8a04">Mentor: mentor2</text>
        <rect x="365" y="92" width="290" height="38" rx="3" fill="#ffffff" stroke="#bbf7d0"/>
        <text x="375" y="106" font-family="'JetBrains Mono', monospace" font-size="7" fill="#64748b">WHERE collegeId = 'riverside-tenant-id'</text>
        <text x="375" y="120" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#14532d">Isolated student roster & course cohorts</text>
      </svg>
      <div class="diagram-caption">Figure 3.1: Multi-Tenant Data Scoping Architecture in PostgreSQL via Prisma</div>
    </div>

    <!-- Tenancy Table -->
    <table>
      <thead>
        <tr>
          <th>Entity</th>
          <th>Tenant Scoping Column</th>
          <th>Isolation Rule</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>User</code></td>
          <td><code>collegeId (Nullable String)</code></td>
          <td>Null for global roles (ForgeAdmin, HR, Speaker). Populated for college-scoped users.</td>
        </tr>
        <tr>
          <td><code>StudentProfile</code></td>
          <td><code>collegeId (String)</code></td>
          <td>Query filter guarantees student rosters only display to authorized campus administrators.</td>
        </tr>
        <tr>
          <td><code>Cohort</code></td>
          <td><code>collegeId (String)</code></td>
          <td>Batch schedules and course access are locked to institutional cohorts.</td>
        </tr>
        <tr>
          <td><code>Team</code></td>
          <td><code>collegeId (String)</code></td>
          <td>Citadel teams are formed within college boundaries to preserve cohort dynamics.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 4: HORIZONTAL SCALING ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">4</span> Production Deployment & Horizontal Scaling</h2>
    <p>
      To support the target scale of <strong>50,000 concurrent active users</strong>, FORGE Loom separates the stateless API nodes from the stateful database and queue tiers.
    </p>

    <div class="card no-break" style="margin-top: 8px;">
      <div class="card-header">
        <span>Stateless API Cluster Behind Load Balancer</span>
        <span class="badge badge-blue">Production Setup</span>
      </div>
      <ul>
        <li><strong>Stateless Express API Nodes:</strong> Multiple Node.js instances behind an AWS ALB or Cloudflare CDN. Any node can handle any request since sessions are stored in JWT tokens and Redis.</li>
        <li><strong>Database Connection Pooling:</strong> Prisma Client with PgBouncer connection pooling to prevent PostgreSQL connection saturation under peak spike loads.</li>
        <li><strong>Redis Socket.IO Adapter:</strong> Enables real-time sprint updates and instant notification broadcasts across all distributed API containers.</li>
        <li><strong>Object Storage CDN:</strong> Student uploaded assignments, certificates, and video streaming assets are served directly through Cloudflare R2 / AWS S3 presigned URLs.</li>
      </ul>
    </div>

    <div class="card no-break" style="margin-top: 10px; background: #f8fafc; border-left: 4px solid #2563eb;">
      <div style="font-weight: 700; color: #1e3a8a; font-size: 9.5pt; margin-bottom: 4px;">Repository & Architectural Verification</div>
      <p style="font-size: 8.5pt; margin-bottom: 6px; color: #334155;">
        The system architecture is maintained in the official GitHub repository:
      </p>
      <div style="font-family:'JetBrains Mono'; font-size: 9pt; color:#2563eb; background:#ffffff; padding:6px 10px; border-radius:4px; border:1px solid #cbd5e1; display:inline-block;">
        https://github.com/Winnovationforge/Forge-loom.git
      </div>
    </div>
  </div>

</body>
</html>
"""

html_path = "/Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_SYSTEM_ARCHITECTURE.html"
pdf_path = "/Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_SYSTEM_ARCHITECTURE.pdf"

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
