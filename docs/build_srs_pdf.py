import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FORGE Loom LMS — Software Requirements Specification (SRS)</title>
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
      font-size: 8pt;
    }

    th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
    }

    td {
      padding: 5px 8px;
      border: 1px solid #e2e8f0;
      color: #334155;
      vertical-align: top;
    }

    tr:nth-child(even) td { background: #f8fafc; }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      background: #f1f5f9;
      padding: 2px 4px;
      border-radius: 4px;
      color: #0369a1;
      border: 1px solid #e2e8f0;
    }

    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7pt;
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
        <span style="font-size: 8.5pt; font-weight: 600; color: #64748b;">IEEE 830 Standard Compliance</span>
      </div>
      <div style="margin-top: 35mm;">
        <h1 class="cover-title">Software Requirements Specification (SRS)</h1>
        <p class="cover-subtitle">
          Formal engineering specification defining functional requirements, external system interfaces, non-functional quality attributes, and data constraints for the FORGE Loom multi-tenant enterprise LMS.
        </p>
      </div>
    </div>

    <!-- Architectural Interface Diagram SVG -->
    <div style="margin: 20px 0; background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px;">
      <svg width="100%" height="95" viewBox="0 0 650 95" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="130" height="75" rx="6" fill="#eff6ff" stroke="#3b82f6"/>
        <text x="75" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#1e3a8a" text-anchor="middle">UI / Client Layer</text>
        <text x="75" y="50" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#2563eb" text-anchor="middle">React 18 + Vite</text>
        <text x="75" y="64" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b" text-anchor="middle">Tailwind v4.0</text>

        <line x1="140" y1="47" x2="190" y2="47" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
        <polygon points="190,47 183,43 183,51" fill="#94a3b8"/>

        <rect x="195" y="10" width="140" height="75" rx="6" fill="#f0fdf4" stroke="#22c55e"/>
        <text x="265" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#14532d" text-anchor="middle">API Interface</text>
        <text x="265" y="50" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#16a34a" text-anchor="middle">Express 4.21 REST</text>
        <text x="265" y="64" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b" text-anchor="middle">JWT Cookie Auth</text>

        <line x1="335" y1="47" x2="385" y2="47" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
        <polygon points="385,47 378,43 378,51" fill="#94a3b8"/>

        <rect x="390" y="10" width="120" height="75" rx="6" fill="#fefce8" stroke="#eab308"/>
        <text x="450" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#713f12" text-anchor="middle">Relational DB</text>
        <text x="450" y="50" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#ca8a04" text-anchor="middle">PostgreSQL 16</text>
        <text x="450" y="64" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b" text-anchor="middle">Prisma ORM 5.22</text>

        <rect x="525" y="10" width="115" height="35" rx="6" fill="#faf5ff" stroke="#a855f7"/>
        <text x="582" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#6b21a8" text-anchor="middle">Redis & BullMQ</text>
        <text x="582" y="38" font-family="'JetBrains Mono', monospace" font-size="6.5" fill="#7e22ce" text-anchor="middle">Port 6379</text>

        <rect x="525" y="50" width="115" height="35" rx="6" fill="#fff1f2" stroke="#f43f5e"/>
        <text x="582" y="67" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#881337" text-anchor="middle">AWS S3 / PDFKit</text>
        <text x="582" y="78" font-family="'JetBrains Mono', monospace" font-size="6.5" fill="#be123c" text-anchor="middle">Certs & Media</text>
      </svg>
    </div>

    <div>
      <div class="meta-box">
        <div class="meta-item">
          <strong>Specification Standard</strong>
          <span>IEEE Std 830-1998 Conformance</span>
        </div>
        <div class="meta-item">
          <strong>System Target</strong>
          <span>50,000 Concurrent Active Users</span>
        </div>
        <div class="meta-item">
          <strong>Security Compliance</strong>
          <span>Zero-Trust Multi-Tenant Partitioning</span>
        </div>
        <div class="meta-item">
          <strong>Backend Endpoints</strong>
          <span>22 Active Routers (Express 4.21)</span>
        </div>
      </div>
      <div style="margin-top: 15px; font-size: 8pt; color: #94a3b8; display: flex; justify-content: space-between;">
        <span>Published by Forge Engineering</span>
        <span>Version 1.0.0 &bull; October 2026</span>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 1: SYSTEM OVERVIEW ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">1</span> System Overview & Scope</h2>
    <p>
      The <strong>FORGE Loom LMS</strong> is a distributed, web-based Learning Management System designed to orchestrate educational tracks, innovation incubator sprints, mentor advisories, and career placements across higher-education institutions and enterprise partners.
    </p>

    <div class="card no-break" style="margin-top: 8px;">
      <div class="card-header">
        <span>Operating Environment & Hardware Interfaces</span>
        <span class="badge badge-blue">Environment</span>
      </div>
      <ul style="font-size: 8pt; margin-left: 14px;">
        <li><strong>Server OS:</strong> Linux (Ubuntu 22.04 LTS / Alpine containerized) or macOS Darwin.</li>
        <li><strong>Runtime:</strong> Node.js v20.x or v22.x LTS (ESM modules).</li>
        <li><strong>Database Engines:</strong> PostgreSQL 15+ (Port 5433) and Redis 7+ (Port 6379).</li>
        <li><strong>Client Support:</strong> Modern evergreen web browsers (Chromium 115+, Firefox 115+, Safari 16+). Responsive from 360px mobile to 4K ultra-wide monitors.</li>
      </ul>
    </div>

    <h3 style="margin-top: 12px;">Core Functional Requirements (IEEE Functional Breakdown)</h3>
    <table>
      <thead>
        <tr>
          <th>Req ID</th>
          <th>Feature Name</th>
          <th>Requirement Specification</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FR-01</strong></td>
          <td>Authentication & JWT Transport</td>
          <td>The system shall authenticate users via email and bcrypt-hashed password, issuing a signed JWT stored inside an HTTP-only, secure cookie.</td>
          <td><span class="badge badge-purple">Critical</span></td>
        </tr>
        <tr>
          <td><strong>FR-02</strong></td>
          <td>College Tenant Scoping</td>
          <td>The system shall enforce row-level scoping via <code>collegeId</code> for students, mentors, trainers, and college administrators, preventing cross-tenant reads or writes.</td>
          <td><span class="badge badge-purple">Critical</span></td>
        </tr>
        <tr>
          <td><strong>FR-03</strong></td>
          <td>Video Timestamp Sync</td>
          <td>The client shall persist video playback progress every 5 seconds via <code>POST /api/video-progress</code>, resuming automatically on subsequent sessions.</td>
          <td><span class="badge badge-blue">High</span></td>
        </tr>
        <tr>
          <td><strong>FR-04</strong></td>
          <td>Citadel Sprint State Machine</td>
          <td>The system shall transition student team sprints through states: <code>not_started &rarr; in_progress &rarr; submitted &rarr; reviewed &rarr; approved</code>. Sprint 3 approval unlocks Investor Access.</td>
          <td><span class="badge badge-purple">Critical</span></td>
        </tr>
        <tr>
          <td><strong>FR-05</strong></td>
          <td>1-on-1 Mentor Booking</td>
          <td>The system shall allow students to query available mentor slots and submit bookings. Mentors shall accept, reschedule, or cancel bookings via <code>/api/bookings</code>.</td>
          <td><span class="badge badge-blue">High</span></td>
        </tr>
        <tr>
          <td><strong>FR-06</strong></td>
          <td>Asynchronous Score Queue</td>
          <td>The scoring service shall dispatch recalculation jobs to Redis/BullMQ whenever attendance, milestones, or evaluations change, computing: <code>(Events*0.2) + (Projects*0.4) + (Mentor*0.3) + (Team*0.1)</code>.</td>
          <td><span class="badge badge-purple">Critical</span></td>
        </tr>
        <tr>
          <td><strong>FR-07</strong></td>
          <td>Verifiable Dynamic Certs</td>
          <td>Upon course completion, the server shall generate a PDF certificate with embedded QR code. Scanning the QR shall resolve public endpoint <code>/verify/:token</code> without authentication.</td>
          <td><span class="badge badge-blue">High</span></td>
        </tr>
        <tr>
          <td><strong>FR-08</strong></td>
          <td>HR Talent Pool Search</td>
          <td>The system shall provide full-text search and multi-facet filtering (domain tags, skill sets, Builder Score slider) across pre-screened student profiles.</td>
          <td><span class="badge badge-blue">High</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 2: NON-FUNCTIONAL REQUIREMENTS ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">2</span> Non-Functional Requirements (NFRs)</h2>
    <p>
      The platform enforces strict performance, reliability, security, and maintainability benchmarks:
    </p>

    <div class="grid-2">
      <div class="card no-break">
        <div class="card-header">
          <span>Performance & Throughput</span>
          <span class="badge badge-blue">Latency</span>
        </div>
        <ul style="font-size: 7.5pt; margin-left: 14px;">
          <li><strong>API Latency:</strong> 95th percentile response time &lt; 50ms for cached reads; &lt; 150ms for transactional writes.</li>
          <li><strong>Concurrent Capacity:</strong> Architected to support 5,000 to 50,000 concurrent active users via stateless horizontal API replication.</li>
          <li><strong>Asynchronous Processing:</strong> BullMQ queue workers process certificate generation and score recomputations within 3 seconds of trigger.</li>
        </ul>
      </div>

      <div class="card no-break">
        <div class="card-header">
          <span>Security & Data Integrity</span>
          <span class="badge badge-green">Hardening</span>
        </div>
        <ul style="font-size: 7.5pt; margin-left: 14px;">
          <li><strong>Cryptographic Password Storage:</strong> Passwords hashed using bcrypt with salt rounds &ge; 10.</li>
          <li><strong>HTTP Hardening:</strong> Helmet middleware sets Content-Security-Policy, X-Frame-Options, and Strict-Transport-Security headers.</li>
          <li><strong>SQL Injection Immunity:</strong> Prisma ORM utilizes parameterized prepared queries exclusively.</li>
        </ul>
      </div>
    </div>

    <div class="grid-2" style="margin-top: 10px;">
      <div class="card no-break">
        <div class="card-header">
          <span>Reliability & Fault Tolerance</span>
          <span class="badge badge-purple">Uptime</span>
        </div>
        <ul style="font-size: 7.5pt; margin-left: 14px;">
          <li><strong>Service Availability:</strong> Designed for 99.9% uptime with health check endpoints at <code>GET /health</code>.</li>
          <li><strong>Database Resilience:</strong> PostgreSQL foreign key cascading rules and unique constraints maintain referential integrity.</li>
          <li><strong>Graceful Shutdown:</strong> Server traps <code>SIGTERM</code>/<code>SIGINT</code> to close Prisma pools and BullMQ connections cleanly.</li>
        </ul>
      </div>

      <div class="card no-break">
        <div class="card-header">
          <span>Maintainability & Code Hygiene</span>
          <span class="badge badge-amber">Standards</span>
        </div>
        <ul style="font-size: 7.5pt; margin-left: 14px;">
          <li><strong>Strict TypeScript:</strong> Zero implicit <code>any</code>; strict typecheck passes across all three workspaces.</li>
          <li><strong>Shared Domain:</strong> Zero model divergence between frontend React views and backend Prisma database schemas.</li>
          <li><strong>Clean Repository:</strong> Git repository strictly excludes database dumps, logs, and secret files.</li>
        </ul>
      </div>
    </div>

    <div class="card no-break" style="margin-top: 15px; background: #f8fafc; border-left: 4px solid #2563eb;">
      <div style="font-weight: 700; color: #1e3a8a; font-size: 9pt; margin-bottom: 2px;">Engineering Compliance Sign-off</div>
      <p style="font-size: 8pt; margin: 0; color: #475569;">
        This Software Requirements Specification represents the verified implementation in the official repository: <code>github.com/Winnovationforge/Forge-loom</code>.
      </p>
    </div>
  </div>

</body>
</html>
"""

html_path = "/Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_SRS.html"
pdf_path = "/Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_SRS.pdf"

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
