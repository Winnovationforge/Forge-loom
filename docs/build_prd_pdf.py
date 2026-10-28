import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FORGE Loom LMS — Product Requirements Document (PRD)</title>
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
        <span style="font-size: 8.5pt; font-weight: 600; color: #64748b;">Product Management Document</span>
      </div>
      <div style="margin-top: 35mm;">
        <h1 class="cover-title">Product Requirements Document (PRD)</h1>
        <p class="cover-subtitle">
          Core strategic product specification detailing market vision, multi-role user journeys, the Citadel Innovation Incubator, algorithmic Builder Scoring, and enterprise HR placement integration.
        </p>
      </div>
    </div>

    <!-- Product Pillars SVG -->
    <div style="margin: 20px 0; background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px;">
      <svg width="100%" height="95" viewBox="0 0 650 95" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="145" height="75" rx="6" fill="#eff6ff" stroke="#3b82f6"/>
        <text x="82" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#1e3a8a" text-anchor="middle">1. Structured Learning</text>
        <text x="82" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#475569" text-anchor="middle">Video Sync &bull; Syllabus</text>
        <text x="82" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#475569" text-anchor="middle">Module Tests &bull; Certs</text>

        <rect x="170" y="10" width="145" height="75" rx="6" fill="#f0fdf4" stroke="#22c55e"/>
        <text x="242" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#14532d" text-anchor="middle">2. Citadel Incubator</text>
        <text x="242" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#475569" text-anchor="middle">3-Stage Sprint Cycles</text>
        <text x="242" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#475569" text-anchor="middle">Milestone Submissions</text>

        <rect x="330" y="10" width="145" height="75" rx="6" fill="#faf5ff" stroke="#a855f7"/>
        <text x="402" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#6b21a8" text-anchor="middle">3. Mentor Advisory</text>
        <text x="402" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#475569" text-anchor="middle">1-on-1 Session Booking</text>
        <text x="402" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#475569" text-anchor="middle">Feedback Evaluation</text>

        <rect x="490" y="10" width="150" height="75" rx="6" fill="#fefce8" stroke="#eab308"/>
        <text x="565" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#713f12" text-anchor="middle">4. HR Talent Pipeline</text>
        <text x="565" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#475569" text-anchor="middle">Pre-Screened Talent</text>
        <text x="565" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#475569" text-anchor="middle">Builder Score Filters</text>
      </svg>
    </div>

    <div>
      <div class="meta-box">
        <div class="meta-item">
          <strong>Document Purpose</strong>
          <span>Product Requirements Document (PRD)</span>
        </div>
        <div class="meta-item">
          <strong>Product Model</strong>
          <span>Dual-Engine LMS & Career Launchpad</span>
        </div>
        <div class="meta-item">
          <strong>Target Users</strong>
          <span>Students, Mentors, Trainers, Colleges, Recruiters</span>
        </div>
        <div class="meta-item">
          <strong>Release Version</strong>
          <span>v1.0.0 &bull; Production Certified</span>
        </div>
      </div>
      <div style="margin-top: 15px; font-size: 8pt; color: #94a3b8; display: flex; justify-content: space-between;">
        <span>Published by Forge Product Team</span>
        <span>October 2026</span>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 1: PRODUCT VISION ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">1</span> Product Vision & Strategic Objectives</h2>
    <p>
      Traditional Learning Management Systems are passive content repositories. They measure attendance and quiz completion rather than true builder capability. <strong>FORGE Loom LMS</strong> disrupts this paradigm by uniting technical coursework with real-world execution through the <strong>Citadel Innovation Incubator</strong>.
    </p>

    <div class="card no-break" style="margin-top: 10px;">
      <div class="card-header">
        <span>Strategic Value Proposition</span>
        <span class="badge badge-blue">Vision</span>
      </div>
      <p style="font-size: 8.5pt; color: #334155;">
        Students do not simply finish video courses; they form cross-functional teams, select real corporate problem statements, execute bi-weekly deliverables across 3 structured sprint cycles, receive qualitative grading from industry mentors, and get shortlisted by corporate HR recruiters based on a verified <strong>Builder Score</strong>.
      </p>
    </div>

    <h3 style="margin-top: 12px;">Core User Personas</h3>
    <div class="grid-2">
      <div class="card no-break">
        <div class="card-header">
          <span>The Student Builder</span>
          <span class="badge badge-green">Learner</span>
        </div>
        <ul style="font-size: 7.5pt; margin-left: 14px;">
          <li><strong>Needs:</strong> Practical skill building, portfolio creation, 1-on-1 industry guidance, and high-paying placement opportunities.</li>
          <li><strong>Key Jobs:</strong> Track video lesson progress, execute sprint milestones, book mentor sessions, and share verified credential QR codes.</li>
        </ul>
      </div>

      <div class="card no-break">
        <div class="card-header">
          <span>The College Administrator</span>
          <span class="badge badge-amber">Institution</span>
        </div>
        <ul style="font-size: 7.5pt; margin-left: 14px;">
          <li><strong>Needs:</strong> Accreditation compliance, student retention, faculty productivity, and campus placement percentage.</li>
          <li><strong>Key Jobs:</strong> Monitor department progress, oversee cohort enrollments, inspect faculty logs, and evaluate campus hiring.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- ==================== SECTION 2: FUNCTIONAL EPICS ==================== -->
  <div style="margin-top: 6mm;" class="no-break">
    <h2><span class="sec-num">2</span> Core Product Epics & Features</h2>

    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Product Epic</th>
          <th style="width: 35%;">User Stories</th>
          <th>Acceptance Criteria</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>EP-01: Course Engine & Video Progress</strong></td>
          <td>As a Student, I want to watch course videos with timestamp tracking so my progress is saved across sessions.</td>
          <td>Video resumes at last saved timestamp; lesson completion triggers progress bar recalculation; updates student velocity score.</td>
        </tr>
        <tr>
          <td><strong>EP-02: Citadel Incubator & Sprints</strong></td>
          <td>As a Student Team, we want to choose an industry problem statement and submit deliverables for Sprints 1, 2, and 3.</td>
          <td>Horizontal stepper reflects Sprint status (not started, in progress, submitted, reviewed); Sprint 3 approval unlocks Investor Access banner.</td>
        </tr>
        <tr>
          <td><strong>EP-03: 1-on-1 Mentor Advisory</strong></td>
          <td>As a Student, I want to book a 30-minute advisory slot with my mentor using an interactive glassmorphic modal.</td>
          <td>Queries available slots via <code>/api/bookings</code>; notifies mentor upon submission; mentor approves/reschedules; logs session notes.</td>
        </tr>
        <tr>
          <td><strong>EP-04: HR Talent Pool & Discovery</strong></td>
          <td>As an HR Recruiter, I want to filter candidates by Builder Score and skill tags so I can shortlist qualified candidates.</td>
          <td>Full-text search; domain tag multi-select; score slider; candidate profile drawer displays projects and mentor endorsements.</td>
        </tr>
        <tr>
          <td><strong>EP-05: Dynamic Certification</strong></td>
          <td>As a Graduate, I want to download an official PDF certificate with an embedded verification QR code.</td>
          <td>PDFKit generates a signed certificate; QR code links to public <code>/verify/:token</code> resolving student credentials without login.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 3: SCORING & SUCCESS METRICS ==================== -->
  <div style="margin-top: 6mm;">
    <h2><span class="sec-num">3</span> Builder Score Algorithm & Key Metrics</h2>
    <p>
      To eliminate subjective manual grading, student competency is represented by the <strong>Builder Score</strong>, calculated through a balanced multi-factor formula:
    </p>

    <!-- Score Formula Card -->
    <div class="card no-break" style="background: #eff6ff; border-color: #3b82f6; padding: 12px 16px;">
      <div style="font-size: 8pt; font-weight: 800; color: #1e40af; text-transform: uppercase;">Algorithmic Formula</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11pt; color: #1e3a8a; margin: 4px 0;">
        Builder Score = (Events &times; 0.20) + (Projects &times; 0.40) + (Mentor Reviews &times; 0.30) + (Teamwork &times; 0.10)
      </div>
      <p style="font-size: 8pt; color: #475569; margin: 0;">
        Jobs are processed in the background via BullMQ. As students attend workshops, complete sprint milestones, and receive mentor reviews, the score updates in near real-time without locking the UI.
      </p>
    </div>

    <h3 style="margin-top: 14px;">Key Performance Indicators (KPIs)</h3>
    <div class="grid-2">
      <div class="card no-break">
        <div class="card-header">
          <span>Student Engagement Metrics</span>
          <span class="badge badge-blue">Learner KPIs</span>
        </div>
        <ul style="font-size: 7.5pt; margin-left: 14px;">
          <li><strong>Course Completion Velocity:</strong> Average days to complete a foundational track (&lt;45 days target).</li>
          <li><strong>Sprint Milestone Throughput:</strong> % of student teams achieving Sprint 3 demo day (&gt;85% target).</li>
          <li><strong>Mentor Session Utilization:</strong> % of students conducting monthly 1-on-1 advisory sessions (&gt;90% target).</li>
        </ul>
      </div>

      <div class="card no-break">
        <div class="card-header">
          <span>Institutional & Placement Metrics</span>
          <span class="badge badge-green">Enterprise KPIs</span>
        </div>
        <ul style="font-size: 7.5pt; margin-left: 14px;">
          <li><strong>Campus Placement Rate:</strong> % of qualified students (Builder Score &gt;800 XP) receiving offers (&gt;80% target).</li>
          <li><strong>Recruiter Conversion Time:</strong> Median days from talent pool shortlisting to technical interview (&lt;7 days).</li>
          <li><strong>College Multi-Tenant Retention:</strong> Annual institutional renewal rate (&gt;95%).</li>
        </ul>
      </div>
    </div>
  </div>

</body>
</html>
"""

html_path = "/Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_PRD.html"
pdf_path = "/Users/winnovation/Downloads/loom-main/docs/FORGE_LOOM_PRD.pdf"

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
