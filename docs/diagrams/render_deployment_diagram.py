import os
from html2image import Html2Image

output_dir = os.path.abspath("docs/diagrams")

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2080 1280" width="2080" height="1280" style="background:#ffffff; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
  <defs>
    <style>
      .hdr-title { font-size: 26px; font-weight: 800; fill: #1e3a8a; text-anchor: middle; }
      .hdr-sub { font-size: 14px; font-weight: 500; fill: #475569; text-anchor: middle; }
      .legend { font-size: 12px; font-weight: 600; fill: #334155; }
      
      .node-header { font-size: 13px; font-weight: 800; fill: #1e3a8a; }
      .node-header-db { font-size: 13px; font-weight: 800; fill: #991b1b; }
      .node-header-ext { font-size: 13px; font-weight: 800; fill: #065f46; }
      .node-header-fut { font-size: 13px; font-weight: 800; fill: #6b21a8; }

      .exec-header { font-size: 11px; font-weight: 700; fill: #1d4ed8; }
      .exec-header-db { font-size: 11px; font-weight: 700; fill: #dc2626; }

      .art-title { font-size: 11px; font-weight: 700; fill: #0f172a; }
      .art-sub { font-size: 10px; font-weight: 500; fill: #475569; }

      .conn-text { font-size: 11px; font-weight: 700; fill: #1d4ed8; text-anchor: middle; }
      .conn-text-db { font-size: 11px; font-weight: 700; fill: #dc2626; text-anchor: middle; }
      .conn-text-fut { font-size: 11px; font-weight: 700; fill: #9333ea; text-anchor: middle; }
    </style>

    <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/>
    </marker>
    <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626"/>
    </marker>
    <marker id="arrow-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9333ea"/>
    </marker>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="2080" height="1280" fill="#ffffff"/>

  <!-- Header Banner -->
  <rect x="40" y="30" width="2000" height="80" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="1040" y="65" class="hdr-title">AGRIRENT — ENTERPRISE UML 2.5 DEPLOYMENT DIAGRAM</text>
  <text x="1040" y="92" class="hdr-sub">Physical Nodes, Execution Environments, Artifact Topography &amp; Network Communication Protocols</text>

  <!-- Legend Bar -->
  <rect x="40" y="125" width="2000" height="35" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
  <text x="60" y="147" class="legend">Legend:  <tspan fill="#1e3a8a" font-weight="800">📦 Solid Box</tspan> Active Node  |  <tspan fill="#9333ea" font-weight="800">╍ Dashed Box</tspan> [Future Phase / Planned Module]  |  <tspan fill="#0f172a" font-weight="800">📄 File Box</tspan> Deployed Artifact  |  <tspan fill="#2563eb" font-weight="700">──▶</tspan> HTTPS Network Line</text>

  <!-- ================= NODE 1: CLIENT HARDWARE TIER (LEFT) ================= -->
  <g transform="translate(60, 180)">
    <path d="M 12 0 L 520 0 L 532 12 L 532 942 L 520 954 L 0 954 L 0 12 z" fill="#ffffff" stroke="#1d4ed8" stroke-width="2"/>
    <path d="M 0 12 L 520 12 L 520 954" fill="none" stroke="#93c5fd" stroke-width="1.5"/>
    <line x1="520" y1="0" x2="520" y2="12" stroke="#1d4ed8" stroke-width="2"/>

    <rect x="15" y="20" width="490" height="30" rx="5" fill="#dbeafe"/>
    <text x="30" y="40" class="node-header">«device» User Client Device (Farmer / Owner) [Active]</text>
    <text x="30" y="60" font-size="11" fill="#475569" font-weight="600">Hardware: Desktop Workstation, Laptop, Mobile Smartphone</text>

    <!-- Execution Environment: Web Browser -->
    <g transform="translate(20, 80)">
      <rect width="460" height="830" rx="8" fill="#f8fafc" stroke="#2563eb" stroke-width="1.5"/>
      <rect x="12" y="12" width="436" height="24" rx="4" fill="#eff6ff"/>
      <text x="24" y="29" class="exec-header">«execution environment» Web Browser Engine [Active]</text>
      <text x="24" y="46" font-size="10" fill="#64748b" font-weight="500">Google Chrome v115+, MS Edge, Mozilla Firefox, Apple Safari</text>

      <!-- Artifact 1: React SPA Bundle -->
      <g transform="translate(20, 60)">
        <rect width="420" height="150" rx="6" fill="#ffffff" stroke="#1d4ed8" stroke-width="1.5"/>
        <rect x="10" y="10" width="400" height="24" rx="4" fill="#dbeafe"/>
        <text x="20" y="27" class="art-title">«artifact» React SPA Application Bundle [Active]</text>
        <text x="20" y="48" class="art-sub">• Built Assets: HTML5, JavaScript ES6+, CSS3 (Tailwind)</text>
        <text x="20" y="66" class="art-sub">• Axios HTTP Client Instance (BaseURL: http://localhost:5000/api)</text>
        <text x="20" y="84" class="art-sub">• Client-Side State: React Hooks, Context API, LocalStorage (JWT Token)</text>
        <text x="20" y="102" class="art-sub">• Target Modules: Login, Register, Catalog, Booking UI</text>
      </g>

      <!-- Sub-node: Presentation UI Modules -->
      <g transform="translate(20, 230)">
        <rect width="420" height="570" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <rect x="10" y="10" width="400" height="24" rx="4" fill="#f1f5f9"/>
        <text x="20" y="27" class="art-title">Client-Side View Controllers &amp; Modules</text>

        <!-- Module list items -->
        <g transform="translate(20, 45)">
          <rect width="380" height="50" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
          <text x="15" y="20" font-size="11" font-weight="700" fill="#1e3a8a">🔐 Authentication Module [Active] (Login.jsx, Register.jsx)</text>
          <text x="15" y="36" font-size="10" fill="#475569">Captures email/password, dispatches auth requests, stores JWT</text>
        </g>

        <g transform="translate(20, 105)">
          <rect width="380" height="50" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
          <text x="15" y="20" font-size="11" font-weight="700" fill="#1e3a8a">🚜 Equipment Catalog Module [Active] (Equipment.jsx, AddEquipment.jsx)</text>
          <text x="15" y="36" font-size="10" fill="#475569">Fetches machinery list, category filters, handles multipart file forms</text>
        </g>

        <g transform="translate(20, 165)">
          <rect width="380" height="50" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
          <text x="15" y="20" font-size="11" font-weight="700" fill="#1e3a8a">📋 Booking Reservation Module [Active] (BookingModal.jsx)</text>
          <text x="15" y="36" font-size="10" fill="#475569">Calculates daily rental cost totals, date range picker, reservation submit</text>
        </g>

        <g transform="translate(20, 225)">
          <rect width="380" height="50" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
          <text x="15" y="20" font-size="11" font-weight="700" fill="#1e3a8a">📊 Dashboard Views [Active] (FarmerDashboard.jsx, OwnerDashboard.jsx)</text>
          <text x="15" y="36" font-size="10" fill="#475569">Role-based management views for equipment owners &amp; renters</text>
        </g>

        <g transform="translate(20, 285)">
          <rect width="380" height="50" rx="4" fill="#faf5ff" stroke="#e9d5ff" stroke-dasharray="4 3"/>
          <text x="15" y="20" font-size="11" font-weight="700" fill="#6b21a8">💳 Payment Module [Future Phase / Planned Module]</text>
          <text x="15" y="36" font-size="10" fill="#7e22ce">Razorpay SDK integration, payment gateway popups (Planned)</text>
        </g>

        <g transform="translate(20, 345)">
          <rect width="380" height="50" rx="4" fill="#faf5ff" stroke="#e9d5ff" stroke-dasharray="4 3"/>
          <text x="15" y="20" font-size="11" font-weight="700" fill="#6b21a8">🔔 Notification Bell Drawer [Future Phase / Planned Module]</text>
          <text x="15" y="36" font-size="10" fill="#7e22ce">In-app alert drawer for booking approvals (Planned)</text>
        </g>

        <g transform="translate(20, 405)">
          <rect width="380" height="50" rx="4" fill="#faf5ff" stroke="#e9d5ff" stroke-dasharray="4 3"/>
          <text x="15" y="20" font-size="11" font-weight="700" fill="#6b21a8">⭐ Review &amp; Rating Widget [Future Phase / Planned Module]</text>
          <text x="15" y="36" font-size="10" fill="#7e22ce">Star rating &amp; feedback submission (Planned)</text>
        </g>

      </g>
    </g>
  </g>

  <!-- Connection Line: Client -> Application Server (HTTPS) -->
  <path d="M 592 380 L 640 380" fill="none" stroke="#2563eb" stroke-width="3" marker-end="url(#arrow-blue)"/>
  <rect x="580" y="340" width="70" height="28" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="615" y="358" class="conn-text" font-size="10">HTTPS / TLS 1.3 (Port 443 / 5000)</text>

  <!-- ================= NODE 2: APPLICATION SERVER TIER (CENTER TOP) ================= -->
  <g transform="translate(640, 180)">
    <path d="M 12 0 L 760 0 L 772 12 L 772 490 L 760 502 L 0 502 L 0 12 z" fill="#ffffff" stroke="#1d4ed8" stroke-width="2"/>
    <path d="M 0 12 L 760 12 L 760 502" fill="none" stroke="#93c5fd" stroke-width="1.5"/>
    <line x1="760" y1="0" x2="760" y2="12" stroke="#1d4ed8" stroke-width="2"/>

    <rect x="15" y="20" width="730" height="30" rx="5" fill="#dbeafe"/>
    <text x="30" y="40" class="node-header">«device» Cloud Application Server Instance (Node.js Environment) [Active]</text>
    <text x="30" y="60" font-size="11" fill="#475569" font-weight="600">OS: Linux Ubuntu Server 22.04 LTS / AWS EC2 / Local Host Node</text>

    <g transform="translate(20, 80)">
      <rect width="720" height="390" rx="8" fill="#f8fafc" stroke="#2563eb" stroke-width="1.5"/>
      <rect x="12" y="12" width="696" height="24" rx="4" fill="#eff6ff"/>
      <text x="24" y="29" class="exec-header">«execution environment» Node.js Runtime Engine (v18.x+) &amp; Express Framework [Active]</text>

      <!-- Express Application Artifact -->
      <g transform="translate(20, 50)">
        <rect width="680" height="315" rx="6" fill="#ffffff" stroke="#1d4ed8" stroke-width="1.5"/>
        <rect x="10" y="10" width="660" height="24" rx="4" fill="#dbeafe"/>
        <text x="20" y="27" class="art-title">«artifact» Express REST API Server (server.js / app.js) [Active]</text>

        <!-- Nested Artifact Components Grid -->
        <g transform="translate(20, 45)">
          <rect width="310" height="75" rx="4" fill="#f0fdf4" stroke="#bbf7d0"/>
          <text x="12" y="20" font-size="11" font-weight="700" fill="#15803d">🔀 Active API Gateway &amp; Express Routers</text>
          <text x="12" y="38" font-size="10" fill="#166534">• AuthRoutes (/api/auth) [Active]</text>
          <text x="12" y="52" font-size="10" fill="#166534">• EquipmentRoutes (/api/equipment) [Active]</text>
          <text x="12" y="66" font-size="10" fill="#166534">• BookingRoutes (/api/bookings) [Active]</text>
        </g>

        <g transform="translate(350, 45)">
          <rect width="310" height="75" rx="4" fill="#fff7ed" stroke="#fed7aa"/>
          <text x="12" y="20" font-size="11" font-weight="700" fill="#c2410c">📅 Active Controller Handlers</text>
          <text x="12" y="38" font-size="10" fill="#9a3412">• authController.js (Login, Register) [Active]</text>
          <text x="12" y="52" font-size="10" fill="#9a3412">• equipmentController.js (CRUD) [Active]</text>
          <text x="12" y="66" font-size="10" fill="#9a3412">• bookingController.js (Reservations) [Active]</text>
        </g>

        <g transform="translate(20, 130)">
          <rect width="310" height="75" rx="4" fill="#f3e8ff" stroke="#e9d5ff"/>
          <text x="12" y="20" font-size="11" font-weight="700" fill="#7e22ce">🔐 Active Security &amp; Auth Services</text>
          <text x="12" y="38" font-size="10" fill="#6b21a8">• JWT Signing &amp; Verification (jsonwebtoken)</text>
          <text x="12" y="52" font-size="10" fill="#6b21a8">• Password Hashing Service (bcrypt.js)</text>
          <text x="12" y="66" font-size="10" fill="#6b21a8">• Role Guard Middleware (authMiddleware.js)</text>
        </g>

        <g transform="translate(350, 130)">
          <rect width="310" height="75" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
          <text x="12" y="20" font-size="11" font-weight="700" fill="#1e40af">🖼️ Active File Upload Storage Service</text>
          <text x="12" y="38" font-size="10" fill="#1e3a8a">• Multer Disk Storage Engine Config</text>
          <text x="12" y="52" font-size="10" fill="#1e3a8a">• Upload Directory: /server/uploads/</text>
          <text x="12" y="66" font-size="10" fill="#1e3a8a">• Static Middleware: express.static('uploads')</text>
        </g>

        <g transform="translate(20, 215)">
          <rect width="640" height="85" rx="4" fill="#faf5ff" stroke="#e9d5ff" stroke-dasharray="4 3"/>
          <text x="12" y="20" font-size="11" font-weight="700" fill="#6b21a8">⚡ Future Controllers &amp; Integration Services [Future Phase / Planned Module]</text>
          <text x="12" y="38" font-size="10" fill="#7e22ce">• paymentController.js (Razorpay Orders &amp; Webhooks) [Future Phase]</text>
          <text x="12" y="54" font-size="10" fill="#7e22ce">• notificationController.js (SendGrid SMTP Email Dispatches) [Future Phase]</text>
          <text x="12" y="70" font-size="10" fill="#7e22ce">• reviewController.js (Rating Submissions &amp; Average Calculations) [Future Phase]</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Node Local Storage: File System for Uploads -->
  <g transform="translate(640, 710)">
    <path d="M 12 0 L 370 0 L 382 12 L 382 410 L 370 422 L 0 422 L 0 12 z" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
    <path d="M 0 12 L 370 12 L 370 422" fill="none" stroke="#93c5fd" stroke-width="1.5"/>
    <line x1="370" y1="0" x2="370" y2="12" stroke="#2563eb" stroke-width="2"/>

    <rect x="15" y="18" width="340" height="28" rx="4" fill="#dbeafe"/>
    <text x="25" y="36" class="node-header">«storage» Local File System Volume [Active]</text>

    <g transform="translate(15, 60)">
      <rect width="340" height="340" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="15" y="25" font-size="12" font-weight="700" fill="#0f172a">📁 Local Upload Storage Path [Active]</text>
      <text x="15" y="45" font-size="10" font-weight="600" fill="#2563eb">Path: server/uploads/</text>
      
      <g transform="translate(15, 60)">
        <rect width="310" height="260" rx="4" fill="#ffffff" stroke="#bfdbfe"/>
        <text x="12" y="20" font-size="11" font-weight="700" fill="#1e40af">Stored Equipment Photos &amp; Assets</text>
        <text x="12" y="40" font-size="10" fill="#475569">• File Naming: image-1723000000000.png</text>
        <text x="12" y="58" font-size="10" fill="#475569">• Format Support: JPEG, PNG, WEBP</text>
        <text x="12" y="76" font-size="10" fill="#475569">• Maximum File Size Limit: 5 MB</text>
        <text x="12" y="94" font-size="10" fill="#475569">• Access Route: http://localhost:5000/uploads/</text>
        <text x="12" y="112" font-size="10" fill="#475569">• Permissions: Read/Write (Node.js Process)</text>
      </g>
    </g>
  </g>

  <!-- Connection: App Server -> File Storage -->
  <path d="M 830 682 L 830 710" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arrow-blue)"/>
  <rect x="800" y="688" width="60" height="18" rx="3" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="830" y="700" font-size="9" font-weight="700" fill="#1d4ed8" text-anchor="middle">File I/O</text>

  <!-- ================= NODE 3: DATABASE SERVER TIER (CENTER BOTTOM RIGHT) ================= -->
  <g transform="translate(1040, 710)">
    <path d="M 12 0 L 360 0 L 372 12 L 372 410 L 360 422 L 0 422 L 0 12 z" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
    <path d="M 0 12 L 360 12 L 360 422" fill="none" stroke="#fca5a5" stroke-width="1.5"/>
    <line x1="360" y1="0" x2="360" y2="12" stroke="#dc2626" stroke-width="2"/>

    <rect x="15" y="18" width="330" height="28" rx="4" fill="#fee2e2"/>
    <text x="25" y="36" class="node-header-db">«device» Relational Database Server (MySQL) [Active]</text>
    <text x="25" y="54" font-size="10" fill="#7f1d1d" font-weight="600">MySQL Enterprise Server 8.0 / Amazon RDS</text>

    <g transform="translate(15, 65)">
      <rect width="330" height="335" rx="6" fill="#fff5f5" stroke="#fca5a5" stroke-width="1.5"/>
      <rect x="10" y="10" width="310" height="24" rx="4" fill="#fee2e2"/>
      <text x="20" y="27" class="exec-header-db">«storage» Relational Schema (agrirent_db)</text>

      <g transform="translate(10, 45)">
        <rect width="310" height="270" rx="4" fill="#ffffff" stroke="#fca5a5"/>
        <text x="12" y="20" font-size="11" font-weight="700" fill="#991b1b">Database Tables &amp; Schema Relations</text>

        <g transform="translate(10, 30)">
          <text y="15" font-size="10" font-weight="700" fill="#0f172a">• users <tspan fill="#166534" font-weight="700">[Active]</tspan></text>
          <text y="32" font-size="10" font-weight="700" fill="#0f172a">• categories <tspan fill="#166534" font-weight="700">[Active]</tspan></text>
          <text y="49" font-size="10" font-weight="700" fill="#0f172a">• equipment <tspan fill="#166534" font-weight="700">[Active]</tspan></text>
          <text y="66" font-size="10" font-weight="700" fill="#0f172a">• bookings <tspan fill="#166534" font-weight="700">[Active]</tspan></text>

          <line x1="0" y1="80" x2="290" y2="80" stroke="#fee2e2" stroke-width="1"/>

          <text y="98" font-size="10" font-weight="700" fill="#6b21a8">• payments <tspan fill="#9333ea" font-weight="600">[Future Phase / Planned Module]</tspan></text>
          <text y="115" font-size="10" font-weight="700" fill="#6b21a8">• notifications <tspan fill="#9333ea" font-weight="600">[Future Phase / Planned Module]</tspan></text>
          <text y="132" font-size="10" font-weight="700" fill="#6b21a8">• reviews <tspan fill="#9333ea" font-weight="600">[Future Phase / Planned Module]</tspan></text>

          <line x1="0" y1="145" x2="290" y2="145" stroke="#fee2e2" stroke-width="1"/>

          <text y="165" font-size="10" font-weight="700" fill="#991b1b">Database Pool Engine Configuration</text>
          <text y="182" font-size="10" fill="#475569">• Connector: mysql2/promise Connection Pool</text>
          <text y="199" font-size="10" fill="#475569">• Host: localhost:3306 (or RDS Endpoint)</text>
          <text y="216" font-size="10" fill="#475569">• Transactions: InnoDB Engine / ACID Compliant</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Connection: App Server -> MySQL DB -->
  <path d="M 1220 682 L 1220 710" fill="none" stroke="#dc2626" stroke-width="2.5" marker-end="url(#arrow-red)"/>
  <rect x="1140" y="688" width="160" height="18" rx="3" fill="#fee2e2" stroke="#fca5a5"/>
  <text x="1220" y="700" class="conn-text-db" font-size="9">MySQL Protocol (TCP / IP 3306)</text>

  <!-- ================= NODE 4: EXTERNAL INTEGRATIONS TIER (RIGHT SIDE) ================= -->
  <g transform="translate(1440, 180)">
    <path d="M 12 0 L 580 0 L 592 12 L 592 942 L 580 954 L 0 954 L 0 12 z" fill="#ffffff" stroke="#059669" stroke-width="2"/>
    <path d="M 0 12 L 580 12 L 580 954" fill="none" stroke="#a7f3d0" stroke-width="1.5"/>
    <line x1="580" y1="0" x2="580" y2="12" stroke="#059669" stroke-width="2"/>

    <rect x="15" y="20" width="550" height="30" rx="5" fill="#d1fae5"/>
    <text x="30" y="40" class="node-header-ext">«device» External Integration Nodes &amp; Cloud Gateways</text>

    <!-- External Node 1: Razorpay Gateway (Future Phase) -->
    <g transform="translate(20, 80)">
      <rect width="535" height="260" rx="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5" stroke-dasharray="5 4"/>
      <rect x="12" y="12" width="510" height="24" rx="4" fill="#f3e8ff"/>
      <text x="24" y="29" class="node-header-fut">«external device» Razorpay Payment Gateway Server [Future Phase / Planned Module]</text>

      <g transform="translate(20, 50)">
        <rect width="495" height="185" rx="6" fill="#ffffff" stroke="#e9d5ff"/>
        <text x="15" y="25" font-size="12" font-weight="700" fill="#6b21a8">💳 Payment Gateway Integration Endpoint [Planned Module]</text>
        <text x="15" y="45" font-size="10" font-weight="600" fill="#7e22ce">Provider: Razorpay Infrastructure Cloud (https://api.razorpay.com/v1)</text>
        <text x="15" y="65" font-size="10" fill="#475569">• Protocols: HTTPS REST API / JSON Payload, Webhook Signatures</text>
        <text x="15" y="83" font-size="10" fill="#475569">• Payment Methods: UPI (Google Pay, PhonePe), Credit/Debit Cards, NetBanking</text>
        <text x="15" y="101" font-size="10" fill="#475569">• Escrow Logic: Holds funds until booking status changes to 'completed'</text>
        <text x="15" y="119" font-size="10" fill="#475569">• Webhook Callbacks: Automatic payment verification &amp; order status sync</text>
        <text x="15" y="137" font-size="10" fill="#475569">• Security: PCI-DSS Compliant, SHA-256 Signature Hash Verification</text>
      </g>
    </g>

    <!-- External Node 2: Email Gateway Server (Future Phase) -->
    <g transform="translate(20, 370)">
      <rect width="535" height="260" rx="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5" stroke-dasharray="5 4"/>
      <rect x="12" y="12" width="510" height="24" rx="4" fill="#f3e8ff"/>
      <text x="24" y="29" class="node-header-fut">«external device» SMTP / SendGrid Email Gateway Server [Future Phase / Planned Module]</text>

      <g transform="translate(20, 50)">
        <rect width="495" height="185" rx="6" fill="#ffffff" stroke="#e9d5ff"/>
        <text x="15" y="25" font-size="12" font-weight="700" fill="#6b21a8">✉️ Transactional Email Dispatch Infrastructure [Planned Module]</text>
        <text x="15" y="45" font-size="10" font-weight="600" fill="#7e22ce">Provider: SendGrid API / Nodemailer SMTP Gateway</text>
        <text x="15" y="65" font-size="10" fill="#475569">• Protocol: SMTP (Port 587 / 465) / HTTPS REST API</text>
        <text x="15" y="83" font-size="10" fill="#475569">• Booking Alerts: Email alerts sent to owners upon new rental request</text>
        <text x="15" y="101" font-size="10" fill="#475569">• Confirmation Notices: Approval email dispatch to farmers with PDF receipts</text>
        <text x="15" y="119" font-size="10" fill="#475569">• Account Verification: Password reset tokens &amp; email verification links</text>
        <text x="15" y="137" font-size="10" fill="#475569">• Security: TLS 1.3 / DKIM / SPF Domain Verification</text>
      </g>
    </g>

    <!-- External Node 3: GitHub Repository -->
    <g transform="translate(20, 660)">
      <rect width="535" height="260" rx="8" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
      <rect x="12" y="12" width="510" height="24" rx="4" fill="#d1fae5"/>
      <text x="24" y="29" class="node-header-ext">«external infrastructure» GitHub Code Repository &amp; SCM [Active]</text>

      <g transform="translate(20, 50)">
        <rect width="495" height="185" rx="6" fill="#ffffff" stroke="#a7f3d0"/>
        <text x="15" y="25" font-size="12" font-weight="700" fill="#065f46">🐙 Version Control System &amp; CI/CD Pipeline [Active]</text>
        <text x="15" y="45" font-size="10" font-weight="600" fill="#047857">Host: GitHub Cloud (https://github.com/smsanjay991-cell/Agricultural-Equipment-Rental-Marketplace)</text>
        <text x="15" y="65" font-size="10" fill="#475569">• Protocols: Git over SSH / HTTPS (Port 22 / 443)</text>
        <text x="15" y="83" font-size="10" fill="#475569">• Version Control: Main branch production builds, feature branch pull requests</text>
        <text x="15" y="101" font-size="10" fill="#475569">• CI Automation: GitHub Actions workflows for automated code testing</text>
        <text x="15" y="119" font-size="10" fill="#475569">• Deployment Triggers: Automated webhook triggers to production cloud instance</text>
        <text x="15" y="137" font-size="10" fill="#475569">• Documentation Host: Central repository for all architecture markdown files &amp; diagrams</text>
      </g>
    </g>

  </g>

  <!-- Connection: App Server -> External Gateways (Future Phase & GitHub) -->
  <path d="M 1412 300 C 1425 300, 1430 210, 1440 210" fill="none" stroke="#9333ea" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#arrow-purple)"/>
  <rect x="1340" y="250" width="130" height="20" rx="3" fill="#faf5ff" stroke="#e9d5ff"/>
  <text x="1405" y="264" class="conn-text-fut" font-size="9">HTTPS REST [Future Phase]</text>

  <path d="M 1412 430 C 1425 430, 1430 500, 1440 500" fill="none" stroke="#9333ea" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#arrow-purple)"/>
  <rect x="1340" y="460" width="130" height="20" rx="3" fill="#faf5ff" stroke="#e9d5ff"/>
  <text x="1405" y="474" class="conn-text-fut" font-size="9">SMTP / REST [Future Phase]</text>

  <path d="M 1412 600 C 1425 600, 1430 790, 1440 790" fill="none" stroke="#059669" stroke-width="2" marker-end="url(#arrow-green)"/>
  <rect x="1360" y="690" width="100" height="20" rx="3" fill="#ecfdf5" stroke="#a7f3d0"/>
  <text x="1410" y="704" font-size="9" font-weight="700" fill="#059669" text-anchor="middle">Git SCM Pipeline</text>

</svg>
"""

# Save SVG
svg_path = os.path.join(output_dir, "deployment-diagram.svg")
with open(svg_path, "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Successfully updated docs/diagrams/deployment-diagram.svg with Future Phase labels")

# Save Draw.io XML
drawio_xml = """<mxfile host="Electron" modified="2026-08-07T09:53:00.000Z" agent="Mozilla/5.0" version="21.6.8" type="device">
  <diagram id="agrirent-deployment-diagram" name="AgriRent Enterprise Deployment Diagram">
    <mxGraphModel dx="1800" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="2100" pageHeight="1300" background="#FFFFFF">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <!-- Title Banner -->
        <mxCell id="title-bg" value="" style="rounded=1;fillColor=#EFF6FF;strokeColor=#1D4ED8;strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="40" y="30" width="2000" height="80" as="geometry" />
        </mxCell>
        <mxCell id="title-text" value="AGRIRENT - ENTERPRISE UML 2.5 DEPLOYMENT DIAGRAM" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=24;fontStyle=1;fontColor=#1E3A8A;" vertex="1" parent="1">
          <mxGeometry x="60" y="45" width="1960" height="30" as="geometry" />
        </mxCell>
        <mxCell id="subtitle-text" value="Physical Nodes, Execution Environments, Artifact Topography &amp; Network Communication Protocols | Capstone Architecture" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=13;fontStyle=0;fontColor=#475569;" vertex="1" parent="1">
          <mxGeometry x="60" y="80" width="1960" height="25" as="geometry" />
        </mxCell>

        <!-- Legend Bar -->
        <mxCell id="legend-bg" value="Legend:   📦 Active Node Box   |   ╍ Dashed Purple Box [Future Phase / Planned Module]   |   📄 Deployed Artifact   |   ──▶ HTTPS Connection" style="text;html=1;rounded=1;fillColor=#F8FAFC;strokeColor=#CBD5E1;strokeWidth=1;align=left;verticalAlign=middle;spacingLeft=15;fontSize=12;fontStyle=1;fontColor=#334155;" vertex="1" parent="1">
          <mxGeometry x="40" y="125" width="2000" height="35" as="geometry" />
        </mxCell>

        <!-- CLIENT NODE -->
        <mxCell id="node-client" value="«device»&#xa;&lt;b&gt;User Client Device (Farmer / Owner) [Active]&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Hardware: Desktop, Laptop, Mobile Smartphone&lt;/font&gt;" style="shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#FFFFFF;strokeColor=#1D4ED8;strokeWidth=2;fontSize=12;fontColor=#1E3A8A;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;" vertex="1" parent="1">
          <mxGeometry x="60" y="180" width="520" height="950" as="geometry" />
        </mxCell>

        <mxCell id="exec-browser" value="«execution environment»&#xa;&lt;b&gt;Web Browser Engine [Active]&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#64748B&quot;&gt;Chrome, Edge, Firefox, Safari&lt;/font&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#1D4ED8;verticalAlign=top;align=left;spacingLeft=10;spacingTop=8;" vertex="1" parent="1">
          <mxGeometry x="80" y="260" width="480" height="840" as="geometry" />
        </mxCell>

        <mxCell id="art-react" value="«artifact»&#xa;&lt;b&gt;React SPA Application Bundle [Active]&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;HTML5, JS ES6+, CSS3 (Tailwind)&#xa;Axios HTTP Client Instance&#xa;Client State: Hooks, Context API, LocalStorage (JWT)&lt;/font&gt;" style="shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;size=15;fillColor=#FFFFFF;strokeColor=#1D4ED8;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;align=left;spacingLeft=10;" vertex="1" parent="1">
          <mxGeometry x="100" y="320" width="440" height="140" as="geometry" />
        </mxCell>

        <!-- APP SERVER NODE -->
        <mxCell id="node-app" value="«device»&#xa;&lt;b&gt;Cloud Application Server Instance (Node.js Environment) [Active]&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;OS: Linux Ubuntu Server 22.04 LTS / AWS EC2&lt;/font&gt;" style="shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#FFFFFF;strokeColor=#1D4ED8;strokeWidth=2;fontSize=12;fontColor=#1E3A8A;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;" vertex="1" parent="1">
          <mxGeometry x="640" y="180" width="760" height="500" as="geometry" />
        </mxCell>

        <mxCell id="exec-nodejs" value="«execution environment»&#xa;&lt;b&gt;Node.js Runtime Engine (v18.x+) &amp; Express Framework [Active]&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#2563EB;strokeWidth=1.5;fontSize=11;fontColor=#1D4ED8;verticalAlign=top;align=left;spacingLeft=10;spacingTop=8;" vertex="1" parent="1">
          <mxGeometry x="660" y="260" width="720" height="400" as="geometry" />
        </mxCell>

        <mxCell id="art-express" value="«artifact»&#xa;&lt;b&gt;Express REST API Server (server.js / app.js) [Active]&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Routers: AuthRoutes, EquipmentRoutes, BookingRoutes [Active]&#xa;Controllers: authController, equipmentController, bookingController [Active]&#xa;Future Handlers: paymentController, notificationController, reviewController [Future Phase]&lt;/font&gt;" style="shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;size=15;fillColor=#FFFFFF;strokeColor=#1D4ED8;strokeWidth=1.5;fontSize=11;fontColor=#0F172A;align=left;spacingLeft=10;" vertex="1" parent="1">
          <mxGeometry x="680" y="310" width="680" height="320" as="geometry" />
        </mxCell>

        <!-- FILE STORAGE NODE -->
        <mxCell id="node-storage" value="«storage»&#xa;&lt;b&gt;Local File System Volume [Active]&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Path: server/uploads/ (Machinery Photos)&lt;/font&gt;" style="shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=2;fontSize=12;fontColor=#1E3A8A;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;" vertex="1" parent="1">
          <mxGeometry x="640" y="710" width="370" height="420" as="geometry" />
        </mxCell>

        <!-- MYSQL DB NODE -->
        <mxCell id="node-db" value="«device»&#xa;&lt;b&gt;Relational Database Server (MySQL) [Active]&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#7F1D1D&quot;&gt;MySQL Enterprise Server 8.0 / Amazon RDS&lt;/font&gt;" style="shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#FFFFFF;strokeColor=#DC2626;strokeWidth=2;fontSize=12;fontColor=#991B1B;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;" vertex="1" parent="1">
          <mxGeometry x="1040" y="710" width="360" height="420" as="geometry" />
        </mxCell>

        <mxCell id="store-db" value="«storage»&#xa;&lt;b&gt;Relational Schema (agrirent_db)&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Active Tables: users, categories, equipment, bookings&#xa;Future Tables: payments, notifications, reviews [Future Phase]&#xa;Pool: mysql2/promise Connection Pool (TCP 3306)&lt;/font&gt;" style="shape=datastore;whiteSpace=wrap;html=1;fillColor=#FFF5F5;strokeColor=#FCA5A5;strokeWidth=1.5;fontSize=11;fontColor=#991B1B;align=left;spacingLeft=10;" vertex="1" parent="1">
          <mxGeometry x="1060" y="775" width="320" height="330" as="geometry" />
        </mxCell>

        <!-- EXTERNAL NODES -->
        <mxCell id="node-ext" value="«device»&#xa;&lt;b&gt;External Integration Nodes &amp; Cloud Gateways&lt;/b&gt;" style="shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#FFFFFF;strokeColor=#059669;strokeWidth=2;fontSize=12;fontColor=#065F46;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;" vertex="1" parent="1">
          <mxGeometry x="1440" y="180" width="580" height="950" as="geometry" />
        </mxCell>

        <mxCell id="ext-razorpay" value="«external device» [Future Phase / Planned Module]&#xa;&lt;b&gt;Razorpay Payment Gateway Server&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;HTTPS REST API / Webhooks Escrow Holding (Planned)&lt;/font&gt;" style="shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;align=left;spacingLeft=10;" vertex="1" parent="1">
          <mxGeometry x="1460" y="260" width="540" height="250" as="geometry" />
        </mxCell>

        <mxCell id="ext-sendgrid" value="«external device» [Future Phase / Planned Module]&#xa;&lt;b&gt;SMTP / SendGrid Email Gateway Server&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Transactional Emails &amp; Booking Alerts (Planned)&lt;/font&gt;" style="shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#FAF5FF;strokeColor=#9333EA;strokeWidth=1.5;dashed=1;fontSize=11;fontColor=#6B21A8;align=left;spacingLeft=10;" vertex="1" parent="1">
          <mxGeometry x="1460" y="550" width="540" height="250" as="geometry" />
        </mxCell>

        <mxCell id="ext-github" value="«external infrastructure» [Active SCM]&#xa;&lt;b&gt;GitHub Code Repository &amp; SCM&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#475569&quot;&gt;Git Version Control &amp; CI/CD Pipeline&lt;/font&gt;" style="shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#ECFDF5;strokeColor=#059669;strokeWidth=1.5;fontSize=11;fontColor=#065F46;align=left;spacingLeft=10;" vertex="1" parent="1">
          <mxGeometry x="1460" y="830" width="540" height="260" as="geometry" />
        </mxCell>

        <!-- CONNECTIONS -->
        <mxCell id="conn-client-app" value="HTTPS / TLS 1.3 (Port 443 / 5000)" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#2563EB;strokeWidth=2;fontSize=11;fontStyle=1;fontColor=#1D4ED8;" edge="1" parent="1" source="node-client" target="node-app">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="conn-app-db" value="MySQL Protocol (TCP / IP 3306)" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#DC2626;strokeWidth=2;fontSize=11;fontStyle=1;fontColor=#991B1B;" edge="1" parent="1" source="node-app" target="node-db">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="conn-app-storage" value="File I/O" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#2563EB;strokeWidth=2;fontSize=11;fontStyle=1;fontColor=#1D4ED8;" edge="1" parent="1" source="node-app" target="node-storage">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="conn-app-razorpay" value="HTTPS REST [Future Phase]" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#9333EA;strokeWidth=2;dashed=1;fontSize=11;fontStyle=1;fontColor=#6B21A8;" edge="1" parent="1" source="node-app" target="ext-razorpay">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="conn-app-sendgrid" value="SMTP / REST [Future Phase]" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#9333EA;strokeWidth=2;dashed=1;fontSize=11;fontStyle=1;fontColor=#6B21A8;" edge="1" parent="1" source="node-app" target="ext-sendgrid">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
"""

drawio_path = os.path.join(output_dir, "deployment-diagram.drawio")
with open(drawio_path, "w", encoding="utf-8") as f:
    f.write(drawio_xml)

print("Successfully updated docs/diagrams/deployment-diagram.drawio with Future Phase labels")

# Render PNG via Html2Image
hti = Html2Image(
    browser_executable=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    output_path=output_dir,
    size=(2100, 1300),
    custom_flags=['--force-device-scale-factor=2', '--hide-scrollbars', '--disable-gpu']
)

html_str = f"<html><body style='margin:0;padding:0;background:#ffffff;'>{svg_content}</body></html>"
hti.screenshot(html_str=html_str, save_as="deployment-diagram.png")
print("Successfully generated docs/diagrams/deployment-diagram.png with Future Phase labels")
