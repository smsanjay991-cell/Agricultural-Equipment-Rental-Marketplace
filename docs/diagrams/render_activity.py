import os
from html2image import Html2Image

output_dir = os.path.abspath("docs/diagrams")

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2160 1250" width="2160" height="1250" style="background:#ffffff; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
  <defs>
    <style>
      .hdr-title { font-size: 26px; font-weight: 800; fill: #1e3a8a; text-anchor: middle; }
      .hdr-sub { font-size: 14px; font-weight: 500; fill: #475569; text-anchor: middle; }
      .legend { font-size: 12px; font-weight: 600; fill: #334155; }
      
      .lane-title { font-size: 14px; font-weight: 800; text-anchor: middle; }
      .act-text { font-size: 11px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
      .dec-text { font-size: 10px; font-weight: 700; fill: #1e3a8a; text-anchor: middle; }
      .guard-text { font-size: 10px; font-weight: 700; fill: #2563eb; }
    </style>

    <marker id="act-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7"/>
    </marker>
    <marker id="act-arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a"/>
    </marker>
    <marker id="act-arrow-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9333ea"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="2160" height="1250" fill="#ffffff"/>

  <!-- Header Banner -->
  <rect x="40" y="30" width="2080" height="80" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="1080" y="65" class="hdr-title">AGRIRENT — ENTERPRISE UML 2.5 ACTIVITY DIAGRAM</text>
  <text x="1080" y="92" class="hdr-sub">Multi-Swimlane End-to-End Workflow | Farmer, Owner, Admin &amp; System Gateway Execution</text>

  <!-- Legend Bar -->
  <rect x="40" y="125" width="2080" height="35" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
  <text x="60" y="147" class="legend">Legend:  <tspan fill="#0f172a">● Initial Node</tspan>  |  <tspan fill="#0f172a">☉ Final State</tspan>  |  <tspan fill="#0284c7" font-weight="700">Farmer Lane</tspan>  |  <tspan fill="#16a34a" font-weight="700">Owner Lane</tspan>  |  <tspan fill="#d97706" font-weight="700">Admin Lane</tspan>  |  <tspan fill="#9333ea" font-weight="700">System Gateway</tspan>  |  <tspan font-weight="700">Rhombus = Decision Point</tspan></text>

  <!-- SWIMLANES -->
  
  <!-- Lane 1: Farmer -->
  <rect x="40" y="180" width="500" height="1030" rx="12" fill="#f0f9ff" stroke="#0284c7" stroke-width="2"/>
  <rect x="40" y="180" width="500" height="35" rx="11" fill="#0284c7"/>
  <text x="290" y="203" class="lane-title" fill="#ffffff">👨‍🌾 FARMER / RENTER SWIMLANE</text>

  <!-- Lane 2: Owner -->
  <rect x="560" y="180" width="500" height="1030" rx="12" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
  <rect x="560" y="180" width="500" height="35" rx="11" fill="#16a34a"/>
  <text x="810" y="203" class="lane-title" fill="#ffffff">🚜 EQUIPMENT OWNER SWIMLANE</text>

  <!-- Lane 3: Admin -->
  <rect x="1080" y="180" width="480" height="1030" rx="12" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <rect x="1080" y="180" width="480" height="35" rx="11" fill="#d97706"/>
  <text x="1320" y="203" class="lane-title" fill="#ffffff">🛡️ SYSTEM ADMIN SWIMLANE</text>

  <!-- Lane 4: System -->
  <rect x="1580" y="180" width="540" height="1030" rx="12" fill="#faf5ff" stroke="#9333ea" stroke-width="2"/>
  <rect x="1580" y="180" width="540" height="35" rx="11" fill="#9333ea"/>
  <text x="1850" y="203" class="lane-title" fill="#ffffff">⚡ SYSTEM &amp; DATABASE GATEWAY</text>

  <!-- ================= ACTIVITIES & NODES ================= -->

  <!-- Start Node -->
  <circle cx="290" cy="250" r="12" fill="#0f172a"/>

  <!-- Open App -->
  <g transform="translate(200, 290)">
    <rect width="180" height="45" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <text x="90" y="27" class="act-text">Open Application</text>
  </g>

  <!-- Register/Login -->
  <g transform="translate(200, 360)">
    <rect width="180" height="45" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <text x="90" y="27" class="act-text">Register / Login</text>
  </g>

  <!-- System: Validate JWT -->
  <g transform="translate(1760, 360)">
    <rect width="180" height="45" rx="8" fill="#ffffff" stroke="#9333ea" stroke-width="2"/>
    <text x="90" y="27" class="act-text" fill="#7e22ce">Validate JWT Token</text>
  </g>

  <!-- Role Decision -->
  <g transform="translate(240, 440)">
    <polygon points="50,0 100,30 50,60 0,30" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="50" y="34" class="dec-text">User Role?</text>
  </g>

  <!-- Farmer Activities -->
  <g transform="translate(200, 540)">
    <rect width="180" height="45" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <text x="90" y="27" class="act-text">Browse Equipment</text>
  </g>

  <g transform="translate(200, 610)">
    <rect width="180" height="45" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <text x="90" y="27" class="act-text">View Details &amp; Select Dates</text>
  </g>

  <g transform="translate(200, 680)">
    <rect width="180" height="45" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <text x="90" y="27" class="act-text">Submit Booking Request</text>
  </g>

  <!-- System: Check Availability -->
  <g transform="translate(1760, 680)">
    <rect width="180" height="45" rx="8" fill="#ffffff" stroke="#9333ea" stroke-width="2"/>
    <text x="90" y="27" class="act-text" fill="#7e22ce">Check Date Overlap in DB</text>
  </g>

  <!-- Owner Activities -->
  <g transform="translate(720, 540)">
    <rect width="180" height="45" rx="8" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
    <text x="90" y="27" class="act-text" fill="#15803d">Manage Equipment</text>
  </g>

  <g transform="translate(720, 760)">
    <rect width="180" height="45" rx="8" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
    <text x="90" y="27" class="act-text" fill="#15803d">View Booking Request</text>
  </g>

  <g transform="translate(710, 830)">
    <polygon points="100,0 200,30 100,60 0,30" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
    <text x="100" y="34" class="dec-text" fill="#15803d">Approve or Reject?</text>
  </g>

  <!-- Admin Activities -->
  <g transform="translate(1230, 540)">
    <rect width="180" height="45" rx="8" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
    <text x="90" y="27" class="act-text" fill="#b45309">Manage Users &amp; Equipment</text>
  </g>

  <g transform="translate(1230, 610)">
    <rect width="180" height="45" rx="8" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
    <text x="90" y="27" class="act-text" fill="#b45309">View Analytics Dashboard</text>
  </g>

  <!-- System: Update DB & Dispatch -->
  <g transform="translate(1760, 830)">
    <rect width="180" height="45" rx="8" fill="#ffffff" stroke="#9333ea" stroke-width="2"/>
    <text x="90" y="27" class="act-text" fill="#7e22ce">Update Booking Status DB</text>
  </g>

  <g transform="translate(1760, 930)">
    <rect width="180" height="45" rx="8" fill="#f3e8ff" stroke="#9333ea" stroke-width="2"/>
    <text x="90" y="27" class="act-text" fill="#7e22ce">Dispatch Email / Notification</text>
  </g>

  <!-- Approval Decision in Farmer Lane -->
  <g transform="translate(240, 920)">
    <polygon points="50,0 100,30 50,60 0,30" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="50" y="34" class="dec-text">Approved?</text>
  </g>

  <!-- Payment (Upcoming) & Rejected -->
  <g transform="translate(100, 1010)">
    <rect width="160" height="45" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
    <text x="80" y="27" class="act-text" fill="#15803d">Process Escrow Pay ⏳</text>
  </g>

  <g transform="translate(320, 1010)">
    <rect width="160" height="45" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
    <text x="80" y="27" class="act-text" fill="#991b1b">Booking Rejected ❌</text>
  </g>

  <!-- Final Node -->
  <circle cx="290" cy="1120" r="14" fill="#0f172a"/>
  <circle cx="290" cy="1120" r="8" fill="#ffffff"/>
  <circle cx="290" cy="1120" r="5" fill="#0f172a"/>

  <!-- FLOW LINES -->
  <line x1="290" y1="262" x2="290" y2="290" stroke="#0284c7" stroke-width="2" marker-end="url(#act-arrow-blue)"/>
  <line x1="290" y1="335" x2="290" y2="360" stroke="#0284c7" stroke-width="2" marker-end="url(#act-arrow-blue)"/>
  <line x1="380" y1="382" x2="1760" y2="382" stroke="#9333ea" stroke-width="2" marker-end="url(#act-arrow-purple)"/>
  <line x1="1850" y1="405" x2="1850" y2="470" stroke="#9333ea" stroke-width="2"/>
  <line x1="1850" y1="470" x2="290" y2="470" stroke="#0284c7" stroke-width="2"/>
  <line x1="290" y1="470" x2="290" y2="440" stroke="#0284c7" stroke-width="2" marker-end="url(#act-arrow-blue)"/>

</svg>
"""

svg_path = os.path.join(output_dir, "activity-diagram.svg")
with open(svg_path, "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Successfully created docs/diagrams/activity-diagram.svg")

hti = Html2Image(
    browser_executable=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    output_path=output_dir,
    size=(2180, 1270),
    custom_flags=['--force-device-scale-factor=2', '--hide-scrollbars', '--disable-gpu']
)

html_str = f"<html><body style='margin:0;padding:0;background:#ffffff;'>{svg_content}</body></html>"
hti.screenshot(html_str=html_str, save_as="activity-diagram.png")
print("Successfully generated docs/diagrams/activity-diagram.png")
