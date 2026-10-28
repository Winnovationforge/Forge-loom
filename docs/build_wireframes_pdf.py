import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FORGE Loom LMS — Wireframe & Screen Specification</title>
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
      width: 320px;
      height: 320px;
      background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0) 70%);
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
    .badge-slate { background: #f1f5f9; color: #475569; }

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
        <span style="font-size: 8.5pt; font-weight: 600; color: #64748b;">UI/UX Architectural Specification</span>
      </div>
      <div style="margin-top: 35mm;">
        <h1 class="cover-title">Complete Wireframe & Screen Specification</h1>
        <p class="cover-subtitle">
          Comprehensive blueprint defining layout regions, data bindings, interactive micro-states, and visual wireframes across all 11 role portals—from Student and Citadel Incubator to Mentor Advisory and Corporate HR.
        </p>
      </div>
    </div>

    <!-- Cover Wireframe Miniature -->
    <div style="margin: 20px 0; background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px;">
      <svg width="100%" height="110" viewBox="0 0 650 110" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="640" height="100" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
        <rect x="5" y="5" width="640" height="24" rx="6" fill="#1e3a8a"/>
        <rect x="5" y="22" width="640" height="7" fill="#1e3a8a"/>
        <text x="20" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#ffffff">FORGE LOOM &bull; GLOBAL FRAME</text>
        <rect x="5" y="29" width="130" height="76" fill="#ffffff" stroke="#e2e8f0"/>
        <rect x="12" y="38" width="115" height="10" rx="2" fill="#dbeafe"/>
        <rect x="12" y="52" width="115" height="8" rx="2" fill="#f1f5f9"/>
        <rect x="12" y="64" width="115" height="8" rx="2" fill="#f1f5f9"/>
        <rect x="12" y="76" width="115" height="8" rx="2" fill="#f1f5f9"/>
        <rect x="145" y="35" width="115" height="26" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
        <rect x="270" y="35" width="115" height="26" rx="4" fill="#f0fdf4" stroke="#bbf7d0"/>
        <rect x="395" y="35" width="115" height="26" rx="4" fill="#fefce8" stroke="#fef08a"/>
        <rect x="520" y="35" width="115" height="26" rx="4" fill="#faf5ff" stroke="#e9d5ff"/>
        <rect x="145" y="68" width="310" height="30" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
        <rect x="465" y="68" width="170" height="30" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
      </svg>
    </div>

    <div>
      <div class="meta-box">
        <div class="meta-item">
          <strong>Application Base</strong>
          <span>React 18 + Tailwind CSS v4.0 + Lucide Icons</span>
        </div>
        <div class="meta-item">
          <strong>Navigation Model</strong>
          <span>Role-Guarded Dynamic Routing (11 Distinct Portals)</span>
        </div>
        <div class="meta-item">
          <strong>Responsive Spec</strong>
          <span>Desktop Canvas + Collapsible Mobile Drawer (&lt;768px)</span>
        </div>
        <div class="meta-item">
          <strong>Default Credentials</strong>
          <code>test1234</code> (Universal Across All Roles)
        </div>
      </div>
      <div style="margin-top: 15px; font-size: 8pt; color: #94a3b8; display: flex; justify-content: space-between;">
        <span>Forge Systems Design Group</span>
        <span>October 2026 &bull; Publication Specification</span>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 0: GLOBAL SHELL ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">0</span> Global Shell Architecture (Universal Frame)</h2>
    <p>
      All 11 user roles share an identical, high-efficiency application frame. Only the sidebar navigation items and the primary content viewport change dynamically according to the authenticated user's role.
    </p>

    <!-- Global Shell SVG Wireframe -->
    <div class="diagram-container no-break">
      <svg width="100%" height="150" viewBox="0 0 680 150" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="660" height="130" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
        <rect x="10" y="10" width="660" height="32" rx="8" fill="#1e3a8a"/>
        <rect x="10" y="32" width="660" height="10" fill="#1e3a8a"/>
        <circle cx="28" cy="26" r="7" fill="#3b82f6"/>
        <text x="42" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="800" fill="#ffffff">FORGE LOOM</text>
        <rect x="135" y="18" width="85" height="16" rx="4" fill="#3b82f6"/>
        <text x="177" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#ffffff" text-anchor="middle">ROLE BADGE</text>
        <circle cx="610" cy="26" r="6" fill="#f8fafc"/>
        <text x="610" y="29" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#1e3a8a" text-anchor="middle">3</text>
        <circle cx="640" cy="26" r="9" fill="#93c5fd"/>
        
        <rect x="10" y="42" width="165" height="98" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
        <rect x="20" y="52" width="145" height="14" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1"/>
        <text x="30" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#1e40af">&bull; Active Module</text>
        <rect x="20" y="70" width="145" height="12" rx="3" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="30" y="79" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#64748b">&bull; Secondary Module</text>
        <rect x="20" y="86" width="145" height="12" rx="3" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="30" y="95" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#64748b">&bull; Tertiary Module</text>
        <rect x="20" y="102" width="145" height="12" rx="3" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="30" y="111" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#64748b">&bull; Tools & Settings</text>
        <rect x="20" y="118" width="145" height="12" rx="3" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="30" y="127" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#ef4444">&bull; Sign Out</text>

        <rect x="180" y="46" width="480" height="88" fill="#ffffff"/>
        <rect x="185" y="50" width="220" height="12" rx="3" fill="#f1f5f9"/>
        <text x="190" y="59" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#334155">Module Header &bull; Context Breadcrumb</text>
        <rect x="185" y="68" width="112" height="26" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
        <rect x="303" y="68" width="112" height="26" rx="4" fill="#f0fdf4" stroke="#bbf7d0"/>
        <rect x="421" y="68" width="112" height="26" rx="4" fill="#fefce8" stroke="#fef08a"/>
        <rect x="539" y="68" width="112" height="26" rx="4" fill="#faf5ff" stroke="#e9d5ff"/>
        <rect x="185" y="100" width="310" height="30" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
        <rect x="502" y="100" width="150" height="30" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
      </svg>
      <div class="diagram-caption">Figure 0.1: Universal Application Shell (Topbar, Nav Sidebar, and Viewport Canvas)</div>
    </div>

    <div class="grid-2">
      <div class="card no-break">
        <div class="card-header">
          <span>Sticky Topbar Region</span>
          <span class="badge badge-blue">Global</span>
        </div>
        <ul>
          <li><strong>Branding:</strong> FORGE Loom logotype with home redirection link.</li>
          <li><strong>Role Badge:</strong> Royal-blue pill displaying current active authority (e.g., <code>Student</code>, <code>Mentor</code>, <code>College Admin</code>).</li>
          <li><strong>Notification Bell:</strong> Unread count badge querying <code>/api/notifications</code>. Clicking opens a dropdown feed.</li>
          <li><strong>User Menu:</strong> User avatar, profile settings modal trigger, and secure sign-out.</li>
        </ul>
      </div>

      <div class="card no-break">
        <div class="card-header">
          <span>Sidebar & Mobile Drawer</span>
          <span class="badge badge-green">Responsive</span>
        </div>
        <ul>
          <li><strong>Route-Scoped Navigation:</strong> Automatically populated from <code>ROLE_HOME_PATH</code> mappings.</li>
          <li><strong>Active State:</strong> Highlighted pill with 2D flat SVG icon and royal-blue accent.</li>
          <li><strong>Breakpoints:</strong> Above 768px: fixed 240px sidebar. Below 768px: collapses into a sliding drawer triggered by a topbar hamburger button.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- ==================== SECTION 1: STUDENT DASHBOARD ==================== -->
  <div style="margin-top: 6mm;" class="no-break">
    <h2><span class="sec-num">1</span> Student Portal (<code>/student/*</code>)</h2>
    <p>
      The Student Portal is the centerpiece of learning velocity and builder capability. It combines course completion metrics with the Citadel Innovation Incubator and 1-on-1 mentor booking.
    </p>

    <!-- Student Dashboard SVG Wireframe -->
    <div class="diagram-container no-break">
      <svg width="100%" height="160" viewBox="0 0 680 160" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="660" height="140" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        
        <!-- Header -->
        <rect x="20" y="18" width="640" height="24" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
        <text x="32" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#1e40af">Student Details: Student One &bull; Forge Institute of Technology &bull; B.Tech Computer Science</text>
        <rect x="560" y="22" width="90" height="16" rx="3" fill="#2563eb"/>
        <text x="605" y="33" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#ffffff" text-anchor="middle">Edit Profile</text>

        <!-- 4 Stat Cards -->
        <rect x="20" y="48" width="150" height="34" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="30" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b">Builder Score</text>
        <text x="30" y="76" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#2563eb">845 XP</text>

        <rect x="183" y="48" width="150" height="34" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="193" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b">Active Courses</text>
        <text x="193" y="76" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#16a34a">3 Enrolled</text>

        <rect x="346" y="48" width="150" height="34" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="356" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b">Attendance Rate</text>
        <text x="356" y="76" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#ca8a04">94.2%</text>

        <rect x="510" y="48" width="150" height="34" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="520" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b">Upcoming Sessions</text>
        <text x="520" y="76" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#9333ea">2 Scheduled</text>

        <!-- Bottom Row: Course Progress + Citadel Stepper Preview -->
        <rect x="20" y="88" width="400" height="54" rx="4" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="30" y="103" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#1e293b">Active Course: Full-Stack Web Development</text>
        <rect x="30" y="110" width="300" height="6" rx="3" fill="#f1f5f9"/>
        <rect x="30" y="110" width="204" height="6" rx="3" fill="#3b82f6"/>
        <text x="340" y="116" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#2563eb">68%</text>
        <text x="30" y="132" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b">Next Lesson: REST API Architecture & Express Middleware</text>

        <rect x="430" y="88" width="230" height="54" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
        <text x="440" y="103" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#1e40af">Assigned Mentor: Mentor One</text>
        <text x="440" y="116" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b">Domain: Distributed Systems & Cloud</text>
        <rect x="440" y="122" width="110" height="14" rx="3" fill="#2563eb"/>
        <text x="495" y="132" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#ffffff" text-anchor="middle">Book 1-on-1 Session</text>
      </svg>
      <div class="diagram-caption">Figure 1.1: Student Dashboard Landing View (`/student`)</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 20%;">Student Sub-Route</th>
          <th style="width: 35%;">Component Layout</th>
          <th>Data Bindings & Interactive State</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Home (<code>/student</code>)</strong></td>
          <td>Personal info header, 4-stat cards row, active course progress cards, upcoming events widget, and mentor advisory card.</td>
          <td>Bound to <code>studentProfiles</code>, <code>events</code>, and <code>bookings</code>. Clicking "Book Session" triggers the glassmorphic modal.</td>
        </tr>
        <tr>
          <td><strong>Course Player (<code>/student/courses/:id</code>)</strong></td>
          <td>Split view: interactive video player on left, collapsible syllabus navigation tree on right, lesson checklist, and resource downloads.</td>
          <td>Bound to <code>/api/courses/:id</code> and <code>/api/video-progress</code>. Automatically syncs playback timestamps and updates course percentage.</td>
        </tr>
        <tr>
          <td><strong>Citadel Hub (<code>/student/citadel</code>)</strong></td>
          <td>3-sprint horizontal progress stepper (Sprint 1, 2, 3), Problem Statement challenge card, milestone logs, and mentor review thread.</td>
          <td>Bound to <code>sprints</code>, <code>teams</code>, and <code>problemStatements</code>. Displays "Investor Access Unlocked" banner when Sprint 3 passes.</td>
        </tr>
        <tr>
          <td><strong>Mentor Sessions (<code>/student/mentor</code>)</strong></td>
          <td>Assigned mentor card, slot picker calendar, upcoming sessions roster, and past feedback archives.</td>
          <td>Bound to <code>/api/bookings</code>. Post-session notes from mentors appear here automatically.</td>
        </tr>
        <tr>
          <td><strong>Certificates (<code>/student/certifications</code>)</strong></td>
          <td>Completed course credentials cards with issue dates, QR code thumbnail, PDF download, and public verification link.</td>
          <td>Bound to <code>/api/certificates</code> and public route <code>/verify/:token</code>.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 2: MENTOR & TRAINER ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">2</span> Mentor & Trainer Portals (<code>/mentor</code> & <code>/trainer</code>)</h2>
    <p>
      Mentors and Trainers drive student success. Mentors focus on 1-on-1 advisory and Citadel team sprint reviews, while Trainers manage batch lecture schedules, module tests, and attendance tracking.
    </p>

    <!-- Mentor Wireframe SVG -->
    <div class="diagram-container no-break">
      <svg width="100%" height="150" viewBox="0 0 680 150" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="660" height="130" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <rect x="20" y="18" width="640" height="20" rx="4" fill="#f0fdf4" stroke="#bbf7d0"/>
        <text x="32" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#14532d">Mentor Portal &bull; Dr. Sarah Vance &bull; 14 Assigned Mentees &bull; 3 Active Citadel Teams</text>
        
        <!-- Assigned Students Table Preview -->
        <rect x="20" y="44" width="370" height="88" rx="4" fill="#ffffff" stroke="#e2e8f0"/>
        <rect x="20" y="44" width="370" height="18" fill="#f1f5f9"/>
        <text x="30" y="56" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#334155">Mentee Name</text>
        <text x="140" y="56" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#334155">Course</text>
        <text x="250" y="56" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#334155">Score</text>
        <text x="310" y="56" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#334155">Action</text>

        <text x="30" y="74" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#1e293b">Student One</text>
        <text x="140" y="74" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#64748b">Full-Stack Dev</text>
        <text x="250" y="74" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#2563eb">845 XP</text>
        <rect x="310" y="66" width="55" height="11" rx="2" fill="#dbeafe"/>
        <text x="337" y="74" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="700" fill="#1e40af" text-anchor="middle">View Profile</text>

        <text x="30" y="94" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#1e293b">Student Two</text>
        <text x="140" y="94" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#64748b">Cloud Computing</text>
        <text x="250" y="94" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#2563eb">790 XP</text>
        <rect x="310" y="86" width="55" height="11" rx="2" fill="#dbeafe"/>
        <text x="337" y="94" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="700" fill="#1e40af" text-anchor="middle">View Profile</text>

        <!-- Citadel Team Review Backlog -->
        <rect x="400" y="44" width="260" height="88" rx="4" fill="#faf5ff" stroke="#e9d5ff"/>
        <text x="410" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#6b21a8">Citadel Sprint Review Queue</text>
        
        <rect x="410" y="66" width="240" height="28" rx="3" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="416" y="78" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#1e293b">Team Alpha &bull; Sprint 2 Prototype</text>
        <text x="416" y="88" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" fill="#64748b">Submitted 2h ago &bull; Needs Evaluation</text>
        <rect x="590" y="73" width="52" height="14" rx="2" fill="#7e22ce"/>
        <text x="616" y="83" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="700" fill="#ffffff" text-anchor="middle">Review</text>

        <rect x="410" y="98" width="240" height="26" rx="3" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="416" y="110" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#1e293b">Team Titan &bull; Sprint 1 Wireframes</text>
        <text x="416" y="118" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" fill="#166534">Approved &bull; Grade: 92/100</text>
      </svg>
      <div class="diagram-caption">Figure 2.1: Mentor Dashboard View (`/mentor`)</div>
    </div>

    <div class="grid-2">
      <div class="card no-break">
        <div class="card-header">
          <span>Mentor Capabilities</span>
          <span class="badge badge-green">/mentor/*</span>
        </div>
        <ul>
          <li><strong>Assigned Students (<code>/mentor/students</code>):</strong> Read-only student profile drill-down, attendance log, course progress, and advisory notes.</li>
          <li><strong>Teams Assigned (<code>/mentor/teams</code>):</strong> Citadel sprint milestone grading, feedback threads, and investor readiness unlock toggle.</li>
          <li><strong>Schedule (<code>/mentor/sessions</code>):</strong> Weekly calendar slot picker, accept/reschedule booking requests.</li>
        </ul>
      </div>

      <div class="card no-break">
        <div class="card-header">
          <span>Trainer Capabilities</span>
          <span class="badge badge-purple">/trainer/*</span>
        </div>
        <ul>
          <li><strong>Batch Sessions (<code>/trainer/courses/:id</code>):</strong> Live class scheduling, attendance check-in matrix, and lecture logs.</li>
          <li><strong>Assignments:</strong> Homework assignment creator, S3 file submissions, and grading with marks and comments.</li>
          <li><strong>Module Tests:</strong> Post-module assessment creator with pass threshold controls.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- ==================== SECTION 3: HR TALENT POOL ==================== -->
  <div style="margin-top: 6mm;" class="no-break">
    <h2><span class="sec-num">3</span> HR Recruiter Portal & Talent Pool (<code>/hr/*</code>)</h2>
    <p>
      The corporate recruitment pipeline. HR partners filter pre-screened students based on verified builder scores, completed Citadel projects, and mentor endorsements.
    </p>

    <!-- HR Talent Pool Wireframe SVG -->
    <div class="diagram-container no-break">
      <svg width="100%" height="150" viewBox="0 0 680 150" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="660" height="130" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        
        <!-- Search and Filter Bar -->
        <rect x="20" y="18" width="280" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="32" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" fill="#94a3b8">Search candidates by skill, domain, or name...</text>

        <rect x="310" y="18" width="100" height="24" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
        <text x="320" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" fill="#334155">Domain: Web &or;</text>

        <rect x="420" y="18" width="130" height="24" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
        <text x="430" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" fill="#334155">Min Score: 800+ XP</text>

        <rect x="560" y="18" width="100" height="24" rx="4" fill="#2563eb"/>
        <text x="610" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="700" fill="#ffffff" text-anchor="middle">Find Candidates</text>

        <!-- Candidate Cards Row -->
        <rect x="20" y="52" width="205" height="80" rx="4" fill="#ffffff" stroke="#e2e8f0"/>
        <circle cx="42" cy="74" r="14" fill="#dbeafe"/>
        <text x="64" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#1e293b">Student One</text>
        <text x="64" y="80" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b">Forge Institute of Tech</text>
        <rect x="64" y="86" width="45" height="12" rx="2" fill="#dcfce7"/>
        <text x="86" y="95" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#166534" text-anchor="middle">845 XP</text>
        <text x="28" y="116" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" fill="#475569">React &bull; Node &bull; PostgreSQL &bull; AWS</text>
        <rect x="135" y="108" width="80" height="16" rx="2" fill="#2563eb"/>
        <text x="175" y="119" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#ffffff" text-anchor="middle">View Profile</text>

        <rect x="235" y="52" width="205" height="80" rx="4" fill="#ffffff" stroke="#e2e8f0"/>
        <circle cx="257" cy="74" r="14" fill="#fef3c7"/>
        <text x="279" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#1e293b">Student Two</text>
        <text x="279" y="80" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b">Riverside Engineering</text>
        <rect x="279" y="86" width="45" height="12" rx="2" fill="#dcfce7"/>
        <text x="301" y="95" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#166534" text-anchor="middle">790 XP</text>
        <text x="243" y="116" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" fill="#475569">Python &bull; Docker &bull; Redis &bull; TS</text>
        <rect x="350" y="108" width="80" height="16" rx="2" fill="#2563eb"/>
        <text x="390" y="119" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#ffffff" text-anchor="middle">View Profile</text>

        <rect x="450" y="52" width="210" height="80" rx="4" fill="#ffffff" stroke="#e2e8f0"/>
        <circle cx="472" cy="74" r="14" fill="#f3e8ff"/>
        <text x="494" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#1e293b">Student Three</text>
        <text x="494" y="80" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b">Forge Institute of Tech</text>
        <rect x="494" y="86" width="45" height="12" rx="2" fill="#dcfce7"/>
        <text x="516" y="95" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#166534" text-anchor="middle">910 XP</text>
        <text x="458" y="116" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" fill="#475569">Kubernetes &bull; Go &bull; Kafka &bull; Rust</text>
        <rect x="565" y="108" width="85" height="16" rx="2" fill="#2563eb"/>
        <text x="607" y="119" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#ffffff" text-anchor="middle">View Profile</text>
      </svg>
      <div class="diagram-caption">Figure 3.1: HR Talent Pool Search & Filter Canvas (`/hr/talent-pool`)</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 4: COLLEGE & SUPER ADMIN ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">4</span> College Admin & Forge Super Admin (<code>/college</code> & <code>/admin</code>)</h2>
    <p>
      Multi-tenant institutional administration. College Admins govern their campus cohorts and faculty, while Forge Super Admins monitor global platform health and onboard partner institutions.
    </p>

    <!-- Admin Wireframe SVG -->
    <div class="diagram-container no-break">
      <svg width="100%" height="150" viewBox="0 0 680 150" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="660" height="130" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        
        <rect x="20" y="18" width="640" height="22" rx="4" fill="#fefce8" stroke="#fef08a"/>
        <text x="32" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#713f12">Institution: Forge Institute of Technology &bull; Tenant ID: FIT-2026 &bull; Status: Active Accredited</text>

        <!-- KPI Metrics -->
        <rect x="20" y="46" width="150" height="34" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="30" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b">Total Enrolled Students</text>
        <text x="30" y="73" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#1e3a8a">1,240</text>

        <rect x="183" y="46" width="150" height="34" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="193" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b">Active Faculty & Mentors</text>
        <text x="193" y="73" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#166534">48 Staff</text>

        <rect x="346" y="46" width="150" height="34" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="356" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b">Citadel Sprint Teams</text>
        <text x="356" y="73" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#ca8a04">32 Teams</text>

        <rect x="510" y="46" width="150" height="34" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="520" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#64748b">Campus Placement Rate</text>
        <text x="520" y="73" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#9333ea">88.4%</text>

        <!-- Lower Cohorts breakdown -->
        <rect x="20" y="86" width="640" height="46" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
        <rect x="20" y="86" width="640" height="16" fill="#f1f5f9"/>
        <text x="30" y="98" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#334155">Department / Cohort</text>
        <text x="220" y="98" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#334155">Students</text>
        <text x="340" y="98" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#334155">Course Completion</text>
        <text x="480" y="98" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#334155">Avg Builder Score</text>

        <text x="30" y="116" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#1e293b">CSE - 2026 Batch A</text>
        <text x="220" y="116" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#64748b">120 Students</text>
        <text x="340" y="116" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#166534">92%</text>
        <text x="480" y="116" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#2563eb">820 XP</text>

        <text x="30" y="127" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#1e293b">ECE - 2026 Batch B</text>
        <text x="220" y="127" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#64748b">95 Students</text>
        <text x="340" y="127" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#ca8a04">84%</text>
        <text x="480" y="127" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#2563eb">775 XP</text>
      </svg>
      <div class="diagram-caption">Figure 4.1: College Admin Institutional Dashboard (`/college`)</div>
    </div>

    <!-- Wireframes Table for other ecosystem roles -->
    <h3 style="margin-top: 10px;">Other Ecosystem Roles</h3>
    <table>
      <thead>
        <tr>
          <th>Role</th>
          <th>Landing Route</th>
          <th>Key Screen Modules</th>
          <th>Primary Interactions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>CourseAdmin</strong></td>
          <td><code>/course-admin</code></td>
          <td>Course Catalog, Curriculum Builder, Lesson Editor, Module Sorter.</td>
          <td>Publish new courses, add video links, configure quiz tests.</td>
        </tr>
        <tr>
          <td><strong>Speaker</strong></td>
          <td><code>/speaker</code></td>
          <td>Sessions Roster, Upload Slides (S3), Post Topics, Connect HR.</td>
          <td>Upload presentation decks, review audience feedback, propose topics.</td>
        </tr>
        <tr>
          <td><strong>Sponsor</strong></td>
          <td><code>/sponsor</code></td>
          <td>Sponsored Events, Innovation Sprints, Brand Analytics.</td>
          <td>Sponsor student hackathons, view funded team milestone demos.</td>
        </tr>
        <tr>
          <td><strong>CommunityLeader</strong></td>
          <td><code>/community</code></td>
          <td>Chapter Hub, Meetup Manager, Volunteer Network, Discussions.</td>
          <td>Organize local tech meetups, manage student campus ambassadors.</td>
        </tr>
        <tr>
          <td><strong>MediaPartner</strong></td>
          <td><code>/media</code></td>
          <td>Press Releases, Media Kit, Interview Requests, Event Access Pass.</td>
          <td>Download high-res brand assets, schedule student innovator interviews.</td>
        </tr>
        <tr>
          <td><strong>Member</strong></td>
          <td><code>/member</code></td>
          <td>Community Discussion Feed, Open Webinars, Event RSVP.</td>
          <td>Participate in open tech discussions, attend public workshops.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 5: MODAL SPECIFICATIONS ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">5</span> Interactive Modal Specifications</h2>
    <p>
      In accordance with FORGE design standards, modals utilize a lightweight, minimal glassmorphism style with <code>backdrop-blur-md</code>, royal-blue primary accents, and responsive keyboard escape listeners.
    </p>

    <div class="grid-2" style="margin-top: 10px;">
      <!-- Modal 1: Book Mentor -->
      <div class="card no-break">
        <div class="card-header">
          <span>Book a Mentor Session Modal</span>
          <span class="badge badge-blue">Modal</span>
        </div>
        <p style="font-size: 8.5pt; margin-bottom: 6px;">Triggered from Student Dashboard and Citadel Hub:</p>
        <ul style="font-size: 8pt; margin-left: 14px;">
          <li><strong>Mentor Profile Card:</strong> Name, avatar, specialty tags, and rating.</li>
          <li><strong>Date Picker:</strong> Interactive calendar highlighting available slots from <code>/api/bookings/available-slots</code>.</li>
          <li><strong>Time Slot Pills:</strong> Radio-styled pill selectors for 30-min and 45-min slots.</li>
          <li><strong>Agenda / Topic:</strong> Textarea input for meeting goals and GitHub repo link.</li>
          <li><strong>Action Buttons:</strong> "Cancel" and "Confirm Booking" with optimistic mutation.</li>
        </ul>
      </div>

      <!-- Modal 2: Add New Event -->
      <div class="card no-break">
        <div class="card-header">
          <span>Add New Event Modal</span>
          <span class="badge badge-green">Modal</span>
        </div>
        <p style="font-size: 8.5pt; margin-bottom: 6px;">Triggered by College Admins and Trainers:</p>
        <ul style="font-size: 8pt; margin-left: 14px;">
          <li><strong>Event Title & Type:</strong> Workshop, Hackathon, Masterclass, or Sprint Review.</li>
          <li><strong>Date & Time Range:</strong> Start and end datetime inputs.</li>
          <li><strong>Speaker / Host:</strong> Dropdown querying registered Speakers and Mentors.</li>
          <li><strong>Capacity & Cohort:</strong> Limit seats or restrict to specific college batches.</li>
          <li><strong>Validation:</strong> Enforced by Zod schema before <code>POST /api/events</code>.</li>
        </ul>
      </div>
    </div>

    <!-- Modal 3: Certificate Verification -->
    <div class="card no-break" style="margin-top: 8px;">
      <div class="card-header">
        <span>Public Certificate Verification Screen (<code>/verify/:token</code>)</span>
        <span class="badge badge-purple">Public Endpoint</span>
      </div>
      <p style="font-size: 8.5pt; margin-bottom: 6px;">
        Accessible without login by scanning the QR code on any generated PDF certificate:
      </p>
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; font-size: 8.5pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-weight: 700; color: #166534;">Verified Certificate: Active & Authenticated</span>
          <code style="font-size: 7.5pt;">TOKEN: forge-cert-8491-fit</code>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 8pt; color: #334155;">
          <div><strong>Recipient:</strong> Student One</div>
          <div><strong>Institution:</strong> Forge Institute of Technology</div>
          <div><strong>Course:</strong> Full-Stack Web Development</div>
          <div><strong>Issue Date:</strong> October 2026</div>
          <div><strong>Grade / Honors:</strong> Distinction (94%)</div>
          <div><strong>Credential Hash:</strong> SHA256 Verified</div>
        </div>
      </div>
    </div>
  </div>

</body>
</html>
"""

html_path = "/Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_WIREFRAMES_SPECIFICATION.html"
pdf_path = "/Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_WIREFRAMES_SPECIFICATION.pdf"

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
