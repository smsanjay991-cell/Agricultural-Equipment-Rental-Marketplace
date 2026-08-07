import os
from html2image import Html2Image

output_dir = os.path.abspath("docs/diagrams")

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2080 1320" width="2080" height="1320" style="background:#ffffff; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
  <defs>
    <style>
      .hdr-title { font-size: 26px; font-weight: 800; fill: #1e3a8a; text-anchor: middle; }
      .hdr-sub { font-size: 14px; font-weight: 500; fill: #475569; text-anchor: middle; }
      .legend { font-size: 12px; font-weight: 600; fill: #334155; }
      
      .subsys-title { font-size: 13px; font-weight: 800; fill: #1e3a8a; }
      .subsys-future { font-size: 13px; font-weight: 800; fill: #6b21a8; }
      .subsys-ext { font-size: 13px; font-weight: 800; fill: #065f46; }

      .comp-bg { fill: #ffffff; stroke: #2563eb; stroke-width: 1.5; rx: 6px; }
      .comp-bg-fut { fill: #faf5ff; stroke: #9333ea; stroke-width: 1.5; stroke-dasharray: 4 3; rx: 6px; }
      .comp-bg-ext { fill: #ecfdf5; stroke: #059669; stroke-width: 1.5; rx: 6px; }

      .comp-header { font-size: 9px; font-weight: 700; fill: #64748b; text-anchor: middle; letter-spacing: 0.5px; }
      .comp-header-fut { font-size: 9px; font-weight: 700; fill: #9333ea; text-anchor: middle; letter-spacing: 0.5px; }
      .comp-header-ext { font-size: 9px; font-weight: 700; fill: #059669; text-anchor: middle; letter-spacing: 0.5px; }

      .comp-name { font-size: 12px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
      .comp-name-fut { font-size: 12px; font-weight: 700; fill: #6b21a8; text-anchor: middle; }
      .comp-name-ext { font-size: 12px; font-weight: 700; fill: #065f46; text-anchor: middle; }

      .comp-sub { font-size: 10px; font-weight: 500; fill: #475569; text-anchor: middle; }

      .conn-label { font-size: 10px; font-weight: 700; fill: #1d4ed8; text-anchor: middle; background: #ffffff; }
      .conn-label-fut { font-size: 10px; font-weight: 700; fill: #7e22ce; text-anchor: middle; }
    </style>

    <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/>
    </marker>

    <marker id="arrow-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9333ea"/>
    </marker>

    <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="2080" height="1320" fill="#ffffff"/>

  <!-- Header Banner -->
  <rect x="40" y="30" width="2000" height="80" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="1040" y="65" class="hdr-title">AGRIRENT — ENTERPRISE UML 2.5 COMPONENT DIAGRAM</text>
  <text x="1040" y="92" class="hdr-sub">Subsystem Boundaries, Component Specifications, Interface Dependencies &amp; Data Flow Architecture</text>

  <!-- Legend Bar -->
  <rect x="40" y="125" width="2000" height="35" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
  <text x="60" y="147" class="legend">Legend:  <tspan fill="#2563eb" font-weight="800">■ Solid Blue Box</tspan> Active Completed Component  |  <tspan fill="#9333ea" font-weight="800">╍ Dashed Purple Box</tspan> [Future Phase / Planned Module]  |  <tspan fill="#059669" font-weight="800">■ Green Box</tspan> External Infrastructure  |  <tspan fill="#2563eb" font-weight="700">──▶</tspan> Provided REST Call</text>

  <!-- ================= TIER 1: FRONTEND PRESENTATION SUBSYSTEM ================= -->
  <rect x="40" y="180" width="1460" height="180" rx="12" fill="#ffffff" stroke="#1d4ed8" stroke-width="2"/>
  <rect x="55" y="192" width="460" height="26" rx="5" fill="#dbeafe"/>
  <text x="70" y="210" class="subsys-title">«subsystem» Frontend Presentation Layer (React.js SPA)</text>

  <!-- Frontend Components (8 Components) -->
  <!-- 1. Login Module (Active) -->
  <g transform="translate(60, 235)">
    <rect width="160" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="80" y="20" class="comp-header">«component» [Active]</text>
    <text x="80" y="38" class="comp-name">Login Module</text>
    <text x="80" y="52" class="comp-sub">Login.jsx / Axios</text>
  </g>

  <!-- 2. Registration Module (Active) -->
  <g transform="translate(235, 235)">
    <rect width="160" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="80" y="20" class="comp-header">«component» [Active]</text>
    <text x="80" y="38" class="comp-name">Registration Module</text>
    <text x="80" y="52" class="comp-sub">Register.jsx / Axios</text>
  </g>

  <!-- 3. Dashboard Module (Active) -->
  <g transform="translate(410, 235)">
    <rect width="160" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="80" y="20" class="comp-header">«component» [Active]</text>
    <text x="80" y="38" class="comp-name">Dashboard Module</text>
    <text x="80" y="52" class="comp-sub">Owner/Farmer Views</text>
  </g>

  <!-- 4. Equipment Module (Active) -->
  <g transform="translate(585, 235)">
    <rect width="160" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="80" y="20" class="comp-header">«component» [Active]</text>
    <text x="80" y="38" class="comp-name">Equipment Module</text>
    <text x="80" y="52" class="comp-sub">Catalog &amp; Form</text>
  </g>

  <!-- 5. Booking Module (Active) -->
  <g transform="translate(760, 235)">
    <rect width="160" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="80" y="20" class="comp-header">«component» [Active]</text>
    <text x="80" y="38" class="comp-name">Booking Module</text>
    <text x="80" y="52" class="comp-sub">Reservation UI</text>
  </g>

  <!-- 6. Payment Module (Future Phase) -->
  <g transform="translate(935, 235)">
    <rect width="160" height="65" class="comp-bg-fut"/>
    <rect x="-6" y="10" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="80" y="20" class="comp-header-fut">«component» [Future Phase]</text>
    <text x="80" y="38" class="comp-name-fut">Payment Module</text>
    <text x="80" y="52" class="comp-sub">Checkout UI (Planned)</text>
  </g>

  <!-- 7. Notification Module (Future Phase) -->
  <g transform="translate(1110, 235)">
    <rect width="160" height="65" class="comp-bg-fut"/>
    <rect x="-6" y="10" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="80" y="20" class="comp-header-fut">«component» [Future Phase]</text>
    <text x="80" y="38" class="comp-name-fut">Notification Module</text>
    <text x="80" y="52" class="comp-sub">Alerts UI (Planned)</text>
  </g>

  <!-- 8. Review Module (Future Phase) -->
  <g transform="translate(1285, 235)">
    <rect width="160" height="65" class="comp-bg-fut"/>
    <rect x="-6" y="10" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="80" y="20" class="comp-header-fut">«component» [Future Phase]</text>
    <text x="80" y="38" class="comp-name-fut">Review Module</text>
    <text x="80" y="52" class="comp-sub">Rating UI (Planned)</text>
  </g>

  <!-- Connector Line from Presentation to API Routing Tier -->
  <line x1="770" y1="360" x2="770" y2="405" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
  <rect x="680" y="372" width="180" height="20" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="770" y="386" class="conn-label">HTTP REST / JSON (Axios)</text>

  <!-- ================= TIER 2: BACKEND API ROUTING SUBSYSTEM ================= -->
  <rect x="40" y="405" width="1460" height="175" rx="12" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
  <rect x="55" y="417" width="460" height="26" rx="5" fill="#dcfce7"/>
  <text x="70" y="435" class="subsys-title" fill="#15803d">«subsystem» Backend API Routing Tier (Express Router)</text>

  <!-- API Route Components (6 Components) -->
  <!-- 1. Auth Routes -->
  <g transform="translate(70, 460)">
    <rect width="210" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="105" y="20" class="comp-header">«component» [Active]</text>
    <text x="105" y="38" class="comp-name">Auth Routes</text>
    <text x="105" y="52" class="comp-sub">/api/auth/*</text>
  </g>

  <!-- 2. Equipment Routes -->
  <g transform="translate(305, 460)">
    <rect width="210" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="105" y="20" class="comp-header">«component» [Active]</text>
    <text x="105" y="38" class="comp-name">Equipment Routes</text>
    <text x="105" y="52" class="comp-sub">/api/equipment/*</text>
  </g>

  <!-- 3. Booking Routes -->
  <g transform="translate(540, 460)">
    <rect width="210" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="105" y="20" class="comp-header">«component» [Active]</text>
    <text x="105" y="38" class="comp-name">Booking Routes</text>
    <text x="105" y="52" class="comp-sub">/api/bookings/*</text>
  </g>

  <!-- 4. Payment Routes (Future Phase) -->
  <g transform="translate(775, 460)">
    <rect width="210" height="65" class="comp-bg-fut"/>
    <rect x="-6" y="10" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="105" y="20" class="comp-header-fut">«component» [Future Phase]</text>
    <text x="105" y="38" class="comp-name-fut">Payment Routes</text>
    <text x="105" y="52" class="comp-sub">/api/payments/* (Planned)</text>
  </g>

  <!-- 5. Notification Routes (Future Phase) -->
  <g transform="translate(1010, 460)">
    <rect width="210" height="65" class="comp-bg-fut"/>
    <rect x="-6" y="10" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="105" y="20" class="comp-header-fut">«component» [Future Phase]</text>
    <text x="105" y="38" class="comp-name-fut">Notification Routes</text>
    <text x="105" y="52" class="comp-sub">/api/notifications/* (Planned)</text>
  </g>

  <!-- 6. Review Routes (Future Phase) -->
  <g transform="translate(1245, 460)">
    <rect width="210" height="65" class="comp-bg-fut"/>
    <rect x="-6" y="10" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="105" y="20" class="comp-header-fut">«component» [Future Phase]</text>
    <text x="105" y="38" class="comp-name-fut">Review Routes</text>
    <text x="105" y="52" class="comp-sub">/api/reviews/* (Planned)</text>
  </g>

  <!-- Connector Line from API Routes to Controller Tier -->
  <line x1="770" y1="580" x2="770" y2="625" stroke="#16a34a" stroke-width="2" marker-end="url(#arrow-green)"/>
  <rect x="680" y="592" width="180" height="20" rx="4" fill="#f0fdf4" stroke="#bbf7d0"/>
  <text x="770" y="606" class="conn-label" fill="#16a34a">Route Dispatcher (express.Router)</text>

  <!-- ================= TIER 3: APPLICATION CONTROLLERS SUBSYSTEM ================= -->
  <rect x="40" y="625" width="1460" height="175" rx="12" fill="#ffffff" stroke="#ea580c" stroke-width="2"/>
  <rect x="55" y="637" width="460" height="26" rx="5" fill="#ffedd5"/>
  <text x="70" y="655" class="subsys-title" fill="#c2410c">«subsystem» Controller Layer (Express Controllers)</text>

  <!-- Controller Components (6 Components) -->
  <!-- 1. Auth Controller -->
  <g transform="translate(70, 680)">
    <rect width="210" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="105" y="20" class="comp-header">«component» [Active]</text>
    <text x="105" y="38" class="comp-name">Auth Controller</text>
    <text x="105" y="52" class="comp-sub">authController.js</text>
  </g>

  <!-- 2. Equipment Controller -->
  <g transform="translate(305, 680)">
    <rect width="210" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="105" y="20" class="comp-header">«component» [Active]</text>
    <text x="105" y="38" class="comp-name">Equipment Controller</text>
    <text x="105" y="52" class="comp-sub">equipmentController.js</text>
  </g>

  <!-- 3. Booking Controller -->
  <g transform="translate(540, 680)">
    <rect width="210" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="105" y="20" class="comp-header">«component» [Active]</text>
    <text x="105" y="38" class="comp-name">Booking Controller</text>
    <text x="105" y="52" class="comp-sub">bookingController.js</text>
  </g>

  <!-- 4. Payment Controller (Future Phase) -->
  <g transform="translate(775, 680)">
    <rect width="210" height="65" class="comp-bg-fut"/>
    <rect x="-6" y="10" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="105" y="20" class="comp-header-fut">«component» [Future Phase]</text>
    <text x="105" y="38" class="comp-name-fut">Payment Controller</text>
    <text x="105" y="52" class="comp-sub">paymentController.js (Planned)</text>
  </g>

  <!-- 5. Notification Controller (Future Phase) -->
  <g transform="translate(1010, 680)">
    <rect width="210" height="65" class="comp-bg-fut"/>
    <rect x="-6" y="10" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="105" y="20" class="comp-header-fut">«component» [Future Phase]</text>
    <text x="105" y="38" class="comp-name-fut">Notification Controller</text>
    <text x="105" y="52" class="comp-sub">notificationController.js (Planned)</text>
  </g>

  <!-- 6. Review Controller (Future Phase) -->
  <g transform="translate(1245, 680)">
    <rect width="210" height="65" class="comp-bg-fut"/>
    <rect x="-6" y="10" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="105" y="20" class="comp-header-fut">«component» [Future Phase]</text>
    <text x="105" y="38" class="comp-name-fut">Review Controller</text>
    <text x="105" y="52" class="comp-sub">reviewController.js (Planned)</text>
  </g>

  <!-- Connector Line from Controllers to Business Logic -->
  <line x1="770" y1="800" x2="770" y2="845" stroke="#ea580c" stroke-width="2" marker-end="url(#arrow-blue)"/>
  <rect x="670" y="812" width="200" height="20" rx="4" fill="#fff7ed" stroke="#fed7aa"/>
  <text x="770" y="826" class="conn-label" fill="#c2410c">Service Invocations &amp; Auth Guards</text>

  <!-- ================= TIER 4: BUSINESS LOGIC & SERVICES SUBSYSTEM ================= -->
  <rect x="40" y="845" width="1460" height="175" rx="12" fill="#ffffff" stroke="#9333ea" stroke-width="2"/>
  <rect x="55" y="857" width="460" height="26" rx="5" fill="#f3e8ff"/>
  <text x="70" y="875" class="subsys-title" fill="#7e22ce">«subsystem» Business Services &amp; Middleware Tier</text>

  <!-- Business Components (4 Components) -->
  <!-- 1. JWT Authentication Service -->
  <g transform="translate(70, 900)">
    <rect width="320" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="160" y="20" class="comp-header">«component» [Active]</text>
    <text x="160" y="38" class="comp-name">JWT Authentication Service</text>
    <text x="160" y="52" class="comp-sub">jsonwebtoken / Sign &amp; Verify Token</text>
  </g>

  <!-- 2. Authorization Guard -->
  <g transform="translate(425, 900)">
    <rect width="320" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="160" y="20" class="comp-header">«component» [Active]</text>
    <text x="160" y="38" class="comp-name">Authorization Guard</text>
    <text x="160" y="52" class="comp-sub">authMiddleware.js / Role Verification</text>
  </g>

  <!-- 3. Validation Service -->
  <g transform="translate(780, 900)">
    <rect width="320" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="160" y="20" class="comp-header">«component» [Active]</text>
    <text x="160" y="38" class="comp-name">Input Validation Service</text>
    <text x="160" y="52" class="comp-sub">bcrypt / Express Validation &amp; Hashing</text>
  </g>

  <!-- 4. File Upload Service -->
  <g transform="translate(1135, 900)">
    <rect width="320" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="160" y="20" class="comp-header">«component» [Active]</text>
    <text x="160" y="38" class="comp-name">File Upload Service</text>
    <text x="160" y="52" class="comp-sub">Multer / Storage Engine (/uploads)</text>
  </g>

  <!-- Connector Line from Business Logic to Database Tier -->
  <line x1="770" y1="1020" x2="770" y2="1065" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
  <rect x="670" y="1032" width="200" height="20" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="770" y="1046" class="conn-label">SQL Query Execution (mysql2 Pool)</text>

  <!-- ================= TIER 5: DATA ACCESS & DATABASE SUBSYSTEM ================= -->
  <rect x="40" y="1065" width="1460" height="175" rx="12" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
  <rect x="55" y="1077" width="460" height="26" rx="5" fill="#fee2e2"/>
  <text x="70" y="1095" class="subsys-title" fill="#b91c1c">«subsystem» Relational Database Layer (MySQL Engine)</text>

  <!-- Database Components (7 Entities) -->
  <!-- 1. Users -->
  <g transform="translate(60, 1120)">
    <rect width="180" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="90" y="20" class="comp-header">«component» [Active]</text>
    <text x="90" y="38" class="comp-name">Users</text>
    <text x="90" y="52" class="comp-sub">Table: users</text>
  </g>

  <!-- 2. Categories -->
  <g transform="translate(265, 1120)">
    <rect width="180" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="90" y="20" class="comp-header">«component» [Active]</text>
    <text x="90" y="38" class="comp-name">Categories</text>
    <text x="90" y="52" class="comp-sub">Table: categories</text>
  </g>

  <!-- 3. Equipment -->
  <g transform="translate(470, 1120)">
    <rect width="180" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="90" y="20" class="comp-header">«component» [Active]</text>
    <text x="90" y="38" class="comp-name">Equipment</text>
    <text x="90" y="52" class="comp-sub">Table: equipment</text>
  </g>

  <!-- 4. Bookings -->
  <g transform="translate(675, 1120)">
    <rect width="180" height="65" class="comp-bg"/>
    <rect x="-6" y="10" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="90" y="20" class="comp-header">«component» [Active]</text>
    <text x="90" y="38" class="comp-name">Bookings</text>
    <text x="90" y="52" class="comp-sub">Table: bookings</text>
  </g>

  <!-- 5. Payments (Future Phase) -->
  <g transform="translate(880, 1120)">
    <rect width="180" height="65" class="comp-bg-fut"/>
    <rect x="-6" y="10" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="90" y="20" class="comp-header-fut">«component» [Future Phase]</text>
    <text x="90" y="38" class="comp-name-fut">Payments</text>
    <text x="90" y="52" class="comp-sub">Table: payments (Planned)</text>
  </g>

  <!-- 6. Notifications (Future Phase) -->
  <g transform="translate(1085, 1120)">
    <rect width="180" height="65" class="comp-bg-fut"/>
    <rect x="-6" y="10" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="90" y="20" class="comp-header-fut">«component» [Future Phase]</text>
    <text x="90" y="38" class="comp-name-fut">Notifications</text>
    <text x="90" y="52" class="comp-sub">Table: notifications (Planned)</text>
  </g>

  <!-- 7. Reviews (Future Phase) -->
  <g transform="translate(1290, 1120)">
    <rect width="180" height="65" class="comp-bg-fut"/>
    <rect x="-6" y="10" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="22" width="12" height="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="90" y="20" class="comp-header-fut">«component» [Future Phase]</text>
    <text x="90" y="38" class="comp-name-fut">Reviews</text>
    <text x="90" y="52" class="comp-sub">Table: reviews (Planned)</text>
  </g>

  <!-- ================= EXTERNAL INTEGRATIONS TIER (RIGHT SIDE) ================= -->
  <rect x="1540" y="180" width="500" height="1060" rx="12" fill="#ffffff" stroke="#059669" stroke-width="2"/>
  <rect x="1555" y="192" width="470" height="26" rx="5" fill="#d1fae5"/>
  <text x="1570" y="210" class="subsys-ext">«subsystem» External Integrations &amp; Infrastructure</text>

  <!-- External Component 1: Razorpay Payment Gateway (Future Phase) -->
  <g transform="translate(1570, 250)">
    <rect width="440" height="130" class="comp-bg-fut"/>
    <rect x="-6" y="20" width="12" height="12" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="40" width="12" height="12" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="220" y="26" class="comp-header-fut">«external component» [Future Phase / Planned Module]</text>
    <text x="220" y="52" class="comp-name-fut" font-size="14">Razorpay Payment Gateway</text>
    <text x="220" y="74" class="comp-sub">REST API / Escrow Webhook Integration (Planned)</text>
    <text x="220" y="92" class="comp-sub">UPI, NetBanking, Credit Card Processing</text>
  </g>

  <!-- External Component 2: Email Notification Service (Future Phase) -->
  <g transform="translate(1570, 440)">
    <rect width="440" height="130" class="comp-bg-fut"/>
    <rect x="-6" y="20" width="12" height="12" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <rect x="-6" y="40" width="12" height="12" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
    <text x="220" y="26" class="comp-header-fut">«external component» [Future Phase / Planned Module]</text>
    <text x="220" y="52" class="comp-name-fut" font-size="14">Email Notification Service</text>
    <text x="220" y="74" class="comp-sub">SMTP / SendGrid Transactional API (Planned)</text>
    <text x="220" y="92" class="comp-sub">Booking Alert &amp; Invoice Email Dispatch</text>
  </g>

  <!-- External Component 3: GitHub Repository -->
  <g transform="translate(1570, 630)">
    <rect width="440" height="130" class="comp-bg-ext"/>
    <rect x="-6" y="20" width="12" height="12" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
    <rect x="-6" y="40" width="12" height="12" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
    <text x="220" y="26" class="comp-header-ext">«external infrastructure» [Active SCM]</text>
    <text x="220" y="52" class="comp-name-ext" font-size="14">GitHub Repository</text>
    <text x="220" y="74" class="comp-sub">Git Version Control &amp; SCM Repository</text>
    <text x="220" y="92" class="comp-sub">Continuous Integration &amp; Deployment Pipeline</text>
  </g>

  <!-- Dynamic Service Connectivity Lines to External Services -->
  <!-- Booking Controller -> Payment Service (Future Phase) -->
  <path d="M 750 712 C 1200 712, 1400 315, 1570 315" fill="none" stroke="#9333ea" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#arrow-purple)"/>
  <rect x="1100" y="480" width="230" height="20" rx="4" fill="#faf5ff" stroke="#e9d5ff"/>
  <text x="1215" y="494" class="conn-label-fut">Booking Controller ──▶ Payment API [Future Phase]</text>

  <!-- Booking Controller -> Notification Service (Future Phase) -->
  <path d="M 750 725 C 1150 725, 1380 505, 1570 505" fill="none" stroke="#9333ea" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#arrow-purple)"/>
  <rect x="1110" y="590" width="240" height="20" rx="4" fill="#faf5ff" stroke="#e9d5ff"/>
  <text x="1230" y="604" class="conn-label-fut">Booking Controller ──▶ Email Service [Future Phase]</text>

</svg>
"""

# Save SVG
svg_path = os.path.join(output_dir, "component-diagram.svg")
with open(svg_path, "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Successfully updated docs/diagrams/component-diagram.svg with explicit Future Phase labels")

# Save Draw.io XML
drawio_xml = """<mxfile host="Electron" modified="2026-08-07T09:52:00.000Z" agent="Mozilla/5.0" version="21.6.8" type="device">
  <diagram id="agrirent-component-diagram" name="AgriRent Enterprise Component Diagram">
    <mxGraphModel dx="1800" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="2100" pageHeight="1400" background="#FFFFFF">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <!-- Title Banner -->
        <mxCell id="title-bg" value="" style="rounded=1;fillColor=#EFF6FF;strokeColor=#1D4ED8;strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="40" y="30" width="2000" height="80" as="geometry" />
        </mxCell>
        <mxCell id="title-text" value="AGRIRENT - ENTERPRISE UML 2.5 COMPONENT DIAGRAM" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=24;fontStyle=1;fontColor=#1E3A8A;" vertex="1" parent="1">
          <mxGeometry x="60" y="45" width="1960" height="30" as="geometry" />
        </mxCell>
        <mxCell id="subtitle-text" value="Subsystem Boundaries, Component Specifications, Interface Dependencies &amp; Data Flow Architecture | Capstone Architecture" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=13;fontStyle=0;fontColor=#475569;" vertex="1" parent="1">
          <mxGeometry x="60" y="80" width="1960" height="25" as="geometry" />
        </mxCell>

        <!-- Legend Bar -->
        <mxCell id="legend-bg" value="Legend:   ■ Active Completed Component   |   ╍ Dashed Purple Box [Future Phase / Planned Module]   |   ■ Green Box (External Infrastructure)   |   ──▶ Provided REST Call" style="text;html=1;rounded=1;fillColor=#F8FAFC;strokeColor=#CBD5E1;strokeWidth=1;align=left;verticalAlign=middle;spacingLeft=15;fontSize=12;fontStyle=1;fontColor=#334155;" vertex="1" parent="1">
          <mxGeometry x="40" y="125" width="2000" height="35" as="geometry" />
        </mxCell>

        <!-- SUBSYSTEM 1: FRONTEND PRESENTATION LAYER -->
        <mxCell id="subsys-frontend" value="«subsystem» Frontend Presentation Layer (React.js SPA)" style="shape=rect;fillColor=#FFFFFF;strokeColor=#1D4ED8;strokeWidth=2;fontSize=13;fontStyle=1;fontColor=#1E3A8A;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="180" width="1460" height="180" as="geometry" />
        </mxCell>

        <mxCell id="c-login" value="«component» [Active]&#xa;&lt;b&gt;Login Module&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Login.jsx / Axios&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="60" y="235" width="160" height="65" as="geometry" />
        </mxCell>

        <mxCell id="c-register" value="«component» [Active]&#xa;&lt;b&gt;Registration Module&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Register.jsx / Axios&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="235" y="235" width="160" height="65" as="geometry" />
        </mxCell>

        <mxCell id="c-dash" value="«component» [Active]&#xa;&lt;b&gt;Dashboard Module&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Owner/Farmer Views&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="410" y="235" width="160" height="65" as="geometry" />
        </mxCell>

        <mxCell id="c-equip" value="«component» [Active]&#xa;&lt;b&gt;Equipment Module&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Catalog &amp; Form&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="585" y="235" width="160" height="65" as="geometry" />
        </mxCell>

        <mxCell id="c-booking" value="«component» [Active]&#xa;&lt;b&gt;Booking Module&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Reservation UI&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="760" y="235" width="160" height="65" as="geometry" />
        </mxCell>

        <mxCell id="c-pay-fe" value="«component» [Future Phase]&#xa;&lt;b&gt;Payment Module&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Checkout UI (Planned)&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="935" y="235" width="160" height="65" as="geometry" />
        </mxCell>

        <mxCell id="c-notif-fe" value="«component» [Future Phase]&#xa;&lt;b&gt;Notification Module&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Alerts UI (Planned)&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="1110" y="235" width="160" height="65" as="geometry" />
        </mxCell>

        <mxCell id="c-rev-fe" value="«component» [Future Phase]&#xa;&lt;b&gt;Review Module&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Rating UI (Planned)&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="1285" y="235" width="160" height="65" as="geometry" />
        </mxCell>

        <!-- SUBSYSTEM 2: BACKEND API ROUTING LAYER -->
        <mxCell id="subsys-api" value="«subsystem» Backend API Routing Tier (Express Router)" style="shape=rect;fillColor=#FFFFFF;strokeColor=#16A34A;strokeWidth=2;fontSize=13;fontStyle=1;fontColor=#15803D;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="405" width="1460" height="175" as="geometry" />
        </mxCell>

        <mxCell id="r-auth" value="«component» [Active]&#xa;&lt;b&gt;Auth Routes&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;/api/auth/*&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="70" y="460" width="210" height="65" as="geometry" />
        </mxCell>

        <mxCell id="r-equip" value="«component» [Active]&#xa;&lt;b&gt;Equipment Routes&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;/api/equipment/*&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="305" y="460" width="210" height="65" as="geometry" />
        </mxCell>

        <mxCell id="r-booking" value="«component» [Active]&#xa;&lt;b&gt;Booking Routes&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;/api/bookings/*&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="540" y="460" width="210" height="65" as="geometry" />
        </mxCell>

        <mxCell id="r-pay" value="«component» [Future Phase]&#xa;&lt;b&gt;Payment Routes&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;/api/payments/* (Planned)&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="775" y="460" width="210" height="65" as="geometry" />
        </mxCell>

        <mxCell id="r-notif" value="«component» [Future Phase]&#xa;&lt;b&gt;Notification Routes&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;/api/notifications/* (Planned)&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="1010" y="460" width="210" height="65" as="geometry" />
        </mxCell>

        <mxCell id="r-rev" value="«component» [Future Phase]&#xa;&lt;b&gt;Review Routes&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;/api/reviews/* (Planned)&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="1245" y="460" width="210" height="65" as="geometry" />
        </mxCell>

        <!-- SUBSYSTEM 3: CONTROLLER LAYER -->
        <mxCell id="subsys-ctrl" value="«subsystem» Controller Layer (Express Controllers)" style="shape=rect;fillColor=#FFFFFF;strokeColor=#EA580C;strokeWidth=2;fontSize=13;fontStyle=1;fontColor=#C2410C;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="625" width="1460" height="175" as="geometry" />
        </mxCell>

        <mxCell id="ctrl-auth" value="«component» [Active]&#xa;&lt;b&gt;Auth Controller&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;authController.js&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="70" y="680" width="210" height="65" as="geometry" />
        </mxCell>

        <mxCell id="ctrl-equip" value="«component» [Active]&#xa;&lt;b&gt;Equipment Controller&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;equipmentController.js&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="305" y="680" width="210" height="65" as="geometry" />
        </mxCell>

        <mxCell id="ctrl-booking" value="«component» [Active]&#xa;&lt;b&gt;Booking Controller&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;bookingController.js&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="540" y="680" width="210" height="65" as="geometry" />
        </mxCell>

        <mxCell id="ctrl-pay" value="«component» [Future Phase]&#xa;&lt;b&gt;Payment Controller&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;paymentController.js (Planned)&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="775" y="680" width="210" height="65" as="geometry" />
        </mxCell>

        <mxCell id="ctrl-notif" value="«component» [Future Phase]&#xa;&lt;b&gt;Notification Controller&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;notificationController.js (Planned)&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="1010" y="680" width="210" height="65" as="geometry" />
        </mxCell>

        <mxCell id="ctrl-rev" value="«component» [Future Phase]&#xa;&lt;b&gt;Review Controller&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;reviewController.js (Planned)&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="1245" y="680" width="210" height="65" as="geometry" />
        </mxCell>

        <!-- SUBSYSTEM 4: BUSINESS SERVICES & MIDDLEWARE LAYER -->
        <mxCell id="subsys-biz" value="«subsystem» Business Services &amp; Middleware Tier" style="shape=rect;fillColor=#FFFFFF;strokeColor=#9333EA;strokeWidth=2;fontSize=13;fontStyle=1;fontColor=#7E22CE;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="845" width="1460" height="175" as="geometry" />
        </mxCell>

        <mxCell id="b-jwt" value="«component» [Active]&#xa;&lt;b&gt;JWT Authentication Service&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;jsonwebtoken / Sign &amp; Verify Token&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="70" y="900" width="320" height="65" as="geometry" />
        </mxCell>

        <mxCell id="b-auth-guard" value="«component» [Active]&#xa;&lt;b&gt;Authorization Guard&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;authMiddleware.js / Role Verification&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="425" y="900" width="320" height="65" as="geometry" />
        </mxCell>

        <mxCell id="b-val" value="«component» [Active]&#xa;&lt;b&gt;Input Validation Service&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;bcrypt / Express Validation &amp; Hashing&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="780" y="900" width="320" height="65" as="geometry" />
        </mxCell>

        <mxCell id="b-multer" value="«component» [Active]&#xa;&lt;b&gt;File Upload Service&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Multer / Storage Engine (/uploads)&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="1135" y="900" width="320" height="65" as="geometry" />
        </mxCell>

        <!-- SUBSYSTEM 5: MYSQL DATABASE LAYER -->
        <mxCell id="subsys-db" value="«subsystem» Relational Database Layer (MySQL Engine)" style="shape=rect;fillColor=#FFFFFF;strokeColor=#DC2626;strokeWidth=2;fontSize=13;fontStyle=1;fontColor=#B91C1C;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="1065" width="1460" height="175" as="geometry" />
        </mxCell>

        <mxCell id="db-users" value="«component» [Active]&#xa;&lt;b&gt;Users&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Table: users&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="60" y="1120" width="180" height="65" as="geometry" />
        </mxCell>

        <mxCell id="db-cat" value="«component» [Active]&#xa;&lt;b&gt;Categories&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Table: categories&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="265" y="1120" width="180" height="65" as="geometry" />
        </mxCell>

        <mxCell id="db-equip" value="«component» [Active]&#xa;&lt;b&gt;Equipment&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Table: equipment&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="470" y="1120" width="180" height="65" as="geometry" />
        </mxCell>

        <mxCell id="db-booking" value="«component» [Active]&#xa;&lt;b&gt;Bookings&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Table: bookings&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="675" y="1120" width="180" height="65" as="geometry" />
        </mxCell>

        <mxCell id="db-pay" value="«component» [Future Phase]&#xa;&lt;b&gt;Payments&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Table: payments (Planned)&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="880" y="1120" width="180" height="65" as="geometry" />
        </mxCell>

        <mxCell id="db-notif" value="«component» [Future Phase]&#xa;&lt;b&gt;Notifications&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Table: notifications (Planned)&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="1085" y="1120" width="180" height="65" as="geometry" />
        </mxCell>

        <mxCell id="db-rev" value="«component» [Future Phase]&#xa;&lt;b&gt;Reviews&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Table: reviews (Planned)&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="1290" y="1120" width="180" height="65" as="geometry" />
        </mxCell>

        <!-- SUBSYSTEM 6: EXTERNAL INTEGRATIONS LAYER -->
        <mxCell id="subsys-ext" value="«subsystem» External Integrations &amp; Infrastructure" style="shape=rect;fillColor=#FFFFFF;strokeColor=#059669;strokeWidth=2;fontSize=13;fontStyle=1;fontColor=#065F46;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="1540" y="180" width="500" height="1060" as="geometry" />
        </mxCell>

        <mxCell id="ext-pay" value="«external component» [Future Phase / Planned Module]&#xa;&lt;b&gt;Razorpay Payment Gateway&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;REST API / Escrow Webhook Integration (Planned)&#xa;UPI, NetBanking, Credit Card Processing&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=12;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="1570" y="250" width="440" height="130" as="geometry" />
        </mxCell>

        <mxCell id="ext-email" value="«external component» [Future Phase / Planned Module]&#xa;&lt;b&gt;Email Notification Service&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;SMTP / SendGrid Transactional API (Planned)&#xa;Booking Alert &amp; Invoice Email Dispatch&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=12;fontColor=#6B21A8;" vertex="1" parent="1">
          <mxGeometry x="1570" y="440" width="440" height="130" as="geometry" />
        </mxCell>

        <mxCell id="ext-github" value="«external infrastructure» [Active SCM]&#xa;&lt;b&gt;GitHub Repository&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Git Version Control &amp; SCM Repository&#xa;Continuous Integration &amp; Deployment Pipeline&lt;/font&gt;" style="shape=component;whiteSpace=wrap;html=1;fillColor=#ECFDF5;strokeColor=#059669;strokeWidth=1.5;fontSize=12;fontColor=#065F46;" vertex="1" parent="1">
          <mxGeometry x="1570" y="630" width="440" height="130" as="geometry" />
        </mxCell>

        <!-- CONNECTORS / INTERFACES -->
        <mxCell id="conn-fe-api" value="HTTP REST / JSON (Axios)" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#2563EB;strokeWidth=2;fontSize=11;fontStyle=1;fontColor=#1D4ED8;" edge="1" parent="1" source="subsys-frontend" target="subsys-api">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="conn-api-ctrl" value="Route Dispatcher (express.Router)" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#16A34A;strokeWidth=2;fontSize=11;fontStyle=1;fontColor=#15803D;" edge="1" parent="1" source="subsys-api" target="subsys-ctrl">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="conn-ctrl-biz" value="Service Invocations &amp; Auth Guards" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#EA580C;strokeWidth=2;fontSize=11;fontStyle=1;fontColor=#C2410C;" edge="1" parent="1" source="subsys-ctrl" target="subsys-biz">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="conn-biz-db" value="SQL Query Execution (mysql2 Pool)" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#2563EB;strokeWidth=2;fontSize=11;fontStyle=1;fontColor=#1D4ED8;" edge="1" parent="1" source="subsys-biz" target="subsys-db">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="conn-booking-pay" value="Booking Controller ──▶ Payment API [Future Phase]" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#9333EA;strokeWidth=2;dashed=1;fontSize=11;fontStyle=1;fontColor=#7E22CE;" edge="1" parent="1" source="ctrl-booking" target="ext-pay">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="conn-booking-email" value="Booking Controller ──▶ Email Service [Future Phase]" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#9333EA;strokeWidth=2;dashed=1;fontSize=11;fontColor=#7E22CE;" edge="1" parent="1" source="ctrl-booking" target="ext-email">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
"""

drawio_path = os.path.join(output_dir, "component-diagram.drawio")
with open(drawio_path, "w", encoding="utf-8") as f:
    f.write(drawio_xml)

print("Successfully updated docs/diagrams/component-diagram.drawio with Future Phase labels")

# Render PNG via Html2Image
hti = Html2Image(
    browser_executable=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    output_path=output_dir,
    size=(2100, 1350),
    custom_flags=['--force-device-scale-factor=2', '--hide-scrollbars', '--disable-gpu']
)

html_str = f"<html><body style='margin:0;padding:0;background:#ffffff;'>{svg_content}</body></html>"
hti.screenshot(html_str=html_str, save_as="component-diagram.png")
print("Successfully generated docs/diagrams/component-diagram.png with Future Phase labels")
