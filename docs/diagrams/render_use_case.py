import os
from html2image import Html2Image

output_dir = os.path.abspath("docs/diagrams")

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1960 1150" width="1960" height="1150" style="background:#ffffff; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
  <defs>
    <style>
      .hdr-title { font-size: 26px; font-weight: 800; fill: #1e3a8a; text-anchor: middle; }
      .hdr-sub { font-size: 14px; font-weight: 500; fill: #475569; text-anchor: middle; }
      .legend { font-size: 12px; font-weight: 600; fill: #334155; }
      
      .actor-title { font-size: 13px; font-weight: 800; fill: #1e3a8a; text-anchor: middle; }
      .actor-sec { font-size: 13px; font-weight: 800; fill: #15803d; text-anchor: middle; }
      .uc-text { font-size: 12px; font-weight: 700; fill: #1e3a8a; text-anchor: middle; }
      .uc-sec { font-size: 12px; font-weight: 700; fill: #15803d; text-anchor: middle; }
      .uc-notif { font-size: 12px; font-weight: 700; fill: #7e22ce; text-anchor: middle; }
      .uc-admin { font-size: 12px; font-weight: 700; fill: #b45309; text-anchor: middle; }
      
      .stereo-text { font-size: 10px; font-weight: 700; fill: #1d4ed8; text-anchor: middle; }
    </style>

    <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="1960" height="1150" fill="#ffffff"/>

  <!-- Header Banner -->
  <rect x="40" y="30" width="1880" height="80" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="980" y="65" class="hdr-title">AGRIRENT — ENTERPRISE UML 2.5 USE CASE DIAGRAM</text>
  <text x="980" y="92" class="hdr-sub">Primary &amp; Secondary Actor Interaction Boundaries | Capstone Architecture</text>

  <!-- Legend Bar -->
  <rect x="40" y="125" width="1880" height="35" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
  <text x="60" y="147" class="legend">Legend:  <tspan fill="#1e40af" font-weight="800">Blue Ellipses</tspan> Completed Use Cases  |  <tspan fill="#16a34a" font-weight="800">Green Ellipses</tspan> Payment Subsystem  |  <tspan fill="#9333ea" font-weight="800">Purple</tspan> Notification Subsystem  |  <tspan fill="#d97706">Amber</tspan> Admin Management  |  <tspan font-weight="700">&lt;&lt;include&gt;&gt;</tspan> Mandatory Dependency  |  <tspan font-weight="700">&lt;&lt;extend&gt;&gt;</tspan> Optional Trigger</text>

  <!-- SYSTEM BOUNDARY -->
  <rect x="320" y="180" width="1360" height="930" rx="16" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <rect x="340" y="195" width="280" height="30" rx="6" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="480" y="215" font-size="13" font-weight="800" fill="#1e3a8a" text-anchor="middle">AgriRent System Boundary</text>

  <!-- ================= PRIMARY ACTORS ================= -->

  <!-- Farmer -->
  <g transform="translate(100, 360)">
    <circle cx="25" cy="20" r="16" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="25" y1="36" x2="25" y2="70" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="0" y1="48" x2="50" y2="48" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="25" y1="70" x2="5" y2="100" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="25" y1="70" x2="45" y2="100" stroke="#1d4ed8" stroke-width="2"/>
    <text x="25" y="120" class="actor-title">👨‍🌾 Farmer</text>
  </g>

  <!-- Owner -->
  <g transform="translate(100, 640)">
    <circle cx="25" cy="20" r="16" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="25" y1="36" x2="25" y2="70" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="0" y1="48" x2="50" y2="48" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="25" y1="70" x2="5" y2="100" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="25" y1="70" x2="45" y2="100" stroke="#1d4ed8" stroke-width="2"/>
    <text x="25" y="120" class="actor-title">🚜 Owner</text>
  </g>

  <!-- Admin -->
  <g transform="translate(100, 920)">
    <circle cx="25" cy="20" r="16" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <line x1="25" y1="36" x2="25" y2="70" stroke="#d97706" stroke-width="2"/>
    <line x1="0" y1="48" x2="50" y2="48" stroke="#d97706" stroke-width="2"/>
    <line x1="25" y1="70" x2="5" y2="100" stroke="#d97706" stroke-width="2"/>
    <line x1="25" y1="70" x2="45" y2="100" stroke="#d97706" stroke-width="2"/>
    <text x="25" y="120" class="actor-title" fill="#b45309">🛡️ Admin</text>
  </g>

  <!-- SECONDARY ACTORS -->
  <g transform="translate(1780, 460)">
    <circle cx="25" cy="20" r="16" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
    <line x1="25" y1="36" x2="25" y2="70" stroke="#16a34a" stroke-width="2"/>
    <line x1="0" y1="48" x2="50" y2="48" stroke="#16a34a" stroke-width="2"/>
    <line x1="25" y1="70" x2="5" y2="100" stroke="#16a34a" stroke-width="2"/>
    <line x1="25" y1="70" x2="45" y2="100" stroke="#16a34a" stroke-width="2"/>
    <text x="25" y="120" class="actor-sec">💳 Payment API</text>
  </g>

  <g transform="translate(1780, 760)">
    <circle cx="25" cy="20" r="16" fill="#f3e8ff" stroke="#9333ea" stroke-width="2"/>
    <line x1="25" y1="36" x2="25" y2="70" stroke="#9333ea" stroke-width="2"/>
    <line x1="0" y1="48" x2="50" y2="48" stroke="#9333ea" stroke-width="2"/>
    <line x1="25" y1="70" x2="5" y2="100" stroke="#9333ea" stroke-width="2"/>
    <line x1="25" y1="70" x2="45" y2="100" stroke="#9333ea" stroke-width="2"/>
    <text x="25" y="120" class="actor-sec" fill="#7e22ce">✉️ Email Service</text>
  </g>

  <!-- ================= USE CASES ================= -->

  <!-- Auth -->
  <g transform="translate(380, 250)">
    <ellipse cx="90" cy="30" rx="90" ry="30" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="90" y="35" class="uc-text">Register Account</text>
  </g>

  <g transform="translate(380, 320)">
    <ellipse cx="90" cy="30" rx="90" ry="30" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="90" y="35" class="uc-text">Login to System</text>
  </g>

  <g transform="translate(660, 320)">
    <ellipse cx="85" cy="28" rx="85" ry="28" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
    <text x="85" y="33" font-size="11" font-weight="600" fill="#334155" text-anchor="middle">JWT Authentication</text>
  </g>

  <!-- Equipment -->
  <g transform="translate(380, 400)">
    <ellipse cx="90" cy="30" rx="90" ry="30" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="90" y="35" class="uc-text">Browse Equipment</text>
  </g>

  <g transform="translate(380, 620)">
    <ellipse cx="90" cy="30" rx="90" ry="30" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="90" y="35" class="uc-text">Add New Equipment</text>
  </g>

  <g transform="translate(380, 700)">
    <ellipse cx="90" cy="30" rx="90" ry="30" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="90" y="35" class="uc-text">Edit Equipment</text>
  </g>

  <!-- Booking -->
  <g transform="translate(380, 480)">
    <ellipse cx="90" cy="30" rx="90" ry="30" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="90" y="35" class="uc-text">Create Booking</text>
  </g>

  <g transform="translate(660, 480)">
    <ellipse cx="95" cy="28" rx="95" ry="28" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
    <text x="95" y="33" font-size="11" font-weight="600" fill="#334155" text-anchor="middle">Validate Availability</text>
  </g>

  <g transform="translate(380, 780)">
    <ellipse cx="95" cy="30" rx="95" ry="30" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="95" y="35" class="uc-text">Approve Request</text>
  </g>

  <g transform="translate(380, 860)">
    <ellipse cx="95" cy="30" rx="95" ry="30" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="95" y="35" class="uc-text">Reject Request</text>
  </g>

  <!-- Payment -->
  <g transform="translate(1060, 460)">
    <ellipse cx="95" cy="30" rx="95" ry="30" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
    <text x="95" y="35" class="uc-sec">Make Payment</text>
  </g>

  <g transform="translate(1370, 460)">
    <ellipse cx="90" cy="28" rx="90" ry="28" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
    <text x="90" y="33" font-size="11" font-weight="600" fill="#15803d" text-anchor="middle">Verify Payment Token</text>
  </g>

  <!-- Notification -->
  <g transform="translate(1060, 760)">
    <ellipse cx="95" cy="30" rx="95" ry="30" fill="#faf5ff" stroke="#9333ea" stroke-width="2"/>
    <text x="95" y="35" class="uc-notif">Send Email Alert</text>
  </g>

  <!-- Admin -->
  <g transform="translate(380, 960)">
    <ellipse cx="95" cy="30" rx="95" ry="30" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <text x="95" y="35" class="uc-admin">Manage Users &amp; Roles</text>
  </g>

  <g transform="translate(380, 1030)">
    <ellipse cx="95" cy="30" rx="95" ry="30" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <text x="95" y="35" class="uc-admin">View Admin Dashboard</text>
  </g>

  <!-- CONNECTOR LINES -->
  <line x1="560" y1="350" x2="660" y2="350" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4 4" marker-end="url(#arrow-blue)"/>
  <text x="610" y="342" class="stereo-text">&lt;&lt;include&gt;&gt;</text>

  <line x1="560" y1="510" x2="660" y2="510" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4 4" marker-end="url(#arrow-blue)"/>
  <text x="610" y="502" class="stereo-text">&lt;&lt;include&gt;&gt;</text>

  <line x1="1250" y1="490" x2="1370" y2="490" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4 4" marker-end="url(#arrow-blue)"/>

  <!-- Actor lines -->
  <line x1="150" y1="420" x2="380" y2="280" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="150" y1="420" x2="380" y2="430" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="150" y1="420" x2="380" y2="510" stroke="#94a3b8" stroke-width="1.5"/>

  <line x1="150" y1="700" x2="380" y2="650" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="150" y1="700" x2="380" y2="730" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="150" y1="700" x2="380" y2="810" stroke="#94a3b8" stroke-width="1.5"/>

  <line x1="150" y1="980" x2="380" y2="990" stroke="#d97706" stroke-width="1.5"/>
  <line x1="150" y1="980" x2="380" y2="1060" stroke="#d97706" stroke-width="1.5"/>

</svg>
"""

svg_path = os.path.join(output_dir, "use-case-diagram.svg")
with open(svg_path, "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Successfully created docs/diagrams/use-case-diagram.svg")

hti = Html2Image(
    browser_executable=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    output_path=output_dir,
    size=(1980, 1170),
    custom_flags=['--force-device-scale-factor=2', '--hide-scrollbars', '--disable-gpu']
)

html_str = f"<html><body style='margin:0;padding:0;background:#ffffff;'>{svg_content}</body></html>"
hti.screenshot(html_str=html_str, save_as="use-case-diagram.png")
print("Successfully generated docs/diagrams/use-case-diagram.png")
