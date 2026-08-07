import os
from html2image import Html2Image

output_dir = os.path.abspath("docs/diagrams")

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1960 1100" width="1960" height="1100" style="background:#ffffff; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
  <defs>
    <style>
      .hdr-title { font-size: 26px; font-weight: 800; fill: #1e3a8a; text-anchor: middle; }
      .hdr-sub { font-size: 14px; font-weight: 500; fill: #475569; text-anchor: middle; }
      .legend { font-size: 12px; font-weight: 600; fill: #334155; }
      
      .cls-header { font-size: 13px; font-weight: 800; fill: #ffffff; text-anchor: middle; }
      .attr-text { font-size: 11px; font-weight: 500; fill: #0f172a; }
      .meth-text { font-size: 11px; font-weight: 600; fill: #1e3a8a; }
      .rel-text { font-size: 11px; font-weight: 700; fill: #1d4ed8; text-anchor: middle; }
    </style>

    <marker id="assoc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1d4ed8"/>
    </marker>
    <marker id="dep-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="1960" height="1100" fill="#ffffff"/>

  <!-- Header Banner -->
  <rect x="40" y="30" width="1880" height="80" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="980" y="65" class="hdr-title">AGRIRENT — ENTERPRISE UML 2.5 CLASS DIAGRAM</text>
  <text x="980" y="92" class="hdr-sub">Object-Oriented System Architecture | Models, Controllers, Middlewares, Database Interfaces &amp; Associations</text>

  <!-- Legend Bar -->
  <rect x="40" y="125" width="1880" height="35" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
  <text x="60" y="147" class="legend">Legend:  <tspan fill="#1e40af" font-weight="800">+</tspan> Public Attribute/Method  |  <tspan fill="#dc2626" font-weight="800">-</tspan> Private Field  |  <tspan fill="#1e40af">Blue Header</tspan> Model Classes  |  <tspan fill="#16a34a">Green Header</tspan> Controller Modules  |  <tspan fill="#ea580c">Orange Header</tspan> Middleware  |  <tspan fill="#1d4ed8">Solid Line</tspan> Association  |  <tspan fill="#16a34a">Dashed Line</tspan> Dependency</text>

  <!-- ================= MODEL CLASSES ================= -->

  <!-- 1. User Model -->
  <g transform="translate(60, 190)">
    <rect width="260" height="290" rx="8" fill="#ffffff" stroke="#1e40af" stroke-width="2"/>
    <rect width="260" height="32" rx="7" fill="#1e40af"/>
    <text x="130" y="21" class="cls-header">User</text>
    <line x1="0" y1="32" x2="260" y2="32" stroke="#1e40af" stroke-width="1"/>
    
    <g transform="translate(12, 48)">
      <text y="0" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> id : int</text>
      <text y="18" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> name : string</text>
      <text y="36" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> email : string</text>
      <text y="54" class="attr-text"><tspan fill="#dc2626" font-weight="700">-</tspan> password : string</text>
      <text y="72" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> role : string</text>
      <text y="90" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> phone : string</text>
      <text y="108" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> address : string</text>
    </g>

    <line x1="0" y1="170" x2="260" y2="170" stroke="#e2e8f0" stroke-width="1.5"/>

    <g transform="translate(12, 188)">
      <text y="0" class="meth-text">+ create() : int</text>
      <text y="18" class="meth-text">+ findByEmail(email) : User</text>
      <text y="36" class="meth-text">+ findById(id) : User</text>
      <text y="54" class="meth-text">+ comparePassword(pwd) : bool</text>
    </g>
  </g>

  <!-- 2. Category Model -->
  <g transform="translate(360, 190)">
    <rect width="240" height="230" rx="8" fill="#ffffff" stroke="#1e40af" stroke-width="2"/>
    <rect width="240" height="32" rx="7" fill="#1e40af"/>
    <text x="120" y="21" class="cls-header">Category</text>

    <g transform="translate(12, 48)">
      <text y="0" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> id : int</text>
      <text y="18" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> name : string</text>
      <text y="36" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> description : string</text>
      <text y="54" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> image_url : string</text>
    </g>

    <line x1="0" y1="120" x2="240" y2="120" stroke="#e2e8f0" stroke-width="1.5"/>

    <g transform="translate(12, 138)">
      <text y="0" class="meth-text">+ create() : int</text>
      <text y="18" class="meth-text">+ findAll() : Category[]</text>
      <text y="36" class="meth-text">+ findById(id) : Category</text>
    </g>
  </g>

  <!-- 3. Equipment Model -->
  <g transform="translate(640, 190)">
    <rect width="280" height="330" rx="8" fill="#ffffff" stroke="#1e40af" stroke-width="2"/>
    <rect width="280" height="32" rx="7" fill="#1e40af"/>
    <text x="140" y="21" class="cls-header">Equipment</text>

    <g transform="translate(12, 48)">
      <text y="0" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> id : int</text>
      <text y="18" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> owner_id : int</text>
      <text y="36" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> category_id : int</text>
      <text y="54" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> title : string</text>
      <text y="72" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> description : string</text>
      <text y="90" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> daily_rate : float</text>
      <text y="108" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> location : string</text>
      <text y="126" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> condition_status : string</text>
      <text y="144" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> is_available : bool</text>
      <text y="162" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> image_url : string</text>
    </g>

    <line x1="0" y1="220" x2="280" y2="220" stroke="#e2e8f0" stroke-width="1.5"/>

    <g transform="translate(12, 238)">
      <text y="0" class="meth-text">+ create() : int</text>
      <text y="18" class="meth-text">+ findAll(filters) : Equipment[]</text>
      <text y="36" class="meth-text">+ findById(id) : Equipment</text>
      <text y="54" class="meth-text">+ update(id, data) : bool</text>
      <text y="72" class="meth-text">+ delete(id) : bool</text>
    </g>
  </g>

  <!-- 4. Booking Model -->
  <g transform="translate(960, 190)">
    <rect width="280" height="330" rx="8" fill="#ffffff" stroke="#1e40af" stroke-width="2"/>
    <rect width="280" height="32" rx="7" fill="#1e40af"/>
    <text x="140" y="21" class="cls-header">Booking</text>

    <g transform="translate(12, 48)">
      <text y="0" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> id : int</text>
      <text y="18" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> equipment_id : int</text>
      <text y="36" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> farmer_id : int</text>
      <text y="54" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> start_date : Date</text>
      <text y="72" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> end_date : Date</text>
      <text y="90" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> total_days : int</text>
      <text y="108" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> total_price : float</text>
      <text y="126" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> status : string</text>
    </g>

    <line x1="0" y1="180" x2="280" y2="180" stroke="#e2e8f0" stroke-width="1.5"/>

    <g transform="translate(12, 198)">
      <text y="0" class="meth-text">+ create() : int</text>
      <text y="18" class="meth-text">+ findById(id) : Booking</text>
      <text y="36" class="meth-text">+ findByFarmer(farmer_id) : Booking[]</text>
      <text y="54" class="meth-text">+ findByOwner(owner_id) : Booking[]</text>
      <text y="72" class="meth-text">+ updateStatus(id, status) : bool</text>
      <text y="90" class="meth-text">+ checkAvailability() : bool</text>
    </g>
  </g>

  <!-- 5. Payment Model -->
  <g transform="translate(1280, 190)">
    <rect width="280" height="260" rx="8" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
    <rect width="280" height="32" rx="7" fill="#16a34a"/>
    <text x="140" y="21" class="cls-header">Payment</text>

    <g transform="translate(12, 48)">
      <text y="0" class="attr-text"><tspan fill="#16a34a" font-weight="700">+</tspan> id : int</text>
      <text y="18" class="attr-text"><tspan fill="#16a34a" font-weight="700">+</tspan> booking_id : int</text>
      <text y="36" class="attr-text"><tspan fill="#16a34a" font-weight="700">+</tspan> transaction_id : string</text>
      <text y="54" class="attr-text"><tspan fill="#16a34a" font-weight="700">+</tspan> amount : float</text>
      <text y="72" class="attr-text"><tspan fill="#16a34a" font-weight="700">+</tspan> payment_method : string</text>
      <text y="90" class="attr-text"><tspan fill="#16a34a" font-weight="700">+</tspan> payment_status : string</text>
    </g>

    <line x1="0" y1="150" x2="280" y2="150" stroke="#e2e8f0" stroke-width="1.5"/>

    <g transform="translate(12, 168)">
      <text y="0" class="meth-text">+ create() : int</text>
      <text y="18" class="meth-text">+ findByBooking(booking_id) : Payment</text>
      <text y="36" class="meth-text">+ updateStatus(id, status) : bool</text>
    </g>
  </g>

  <!-- 6. Notification Model -->
  <g transform="translate(1600, 190)">
    <rect width="280" height="260" rx="8" fill="#ffffff" stroke="#1e40af" stroke-width="2"/>
    <rect width="280" height="32" rx="7" fill="#1e40af"/>
    <text x="140" y="21" class="cls-header">Notification</text>

    <g transform="translate(12, 48)">
      <text y="0" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> id : int</text>
      <text y="18" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> user_id : int</text>
      <text y="36" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> booking_id : int</text>
      <text y="54" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> title : string</text>
      <text y="72" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> message : string</text>
      <text y="90" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> type : string</text>
      <text y="108" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> is_read : bool</text>
    </g>

    <line x1="0" y1="160" x2="280" y2="160" stroke="#e2e8f0" stroke-width="1.5"/>

    <g transform="translate(12, 178)">
      <text y="0" class="meth-text">+ create() : int</text>
      <text y="18" class="meth-text">+ findByUser(user_id) : Notification[]</text>
      <text y="36" class="meth-text">+ markAsRead(id) : bool</text>
    </g>
  </g>

  <!-- 7. Review Model -->
  <g transform="translate(640, 580)">
    <rect width="280" height="230" rx="8" fill="#ffffff" stroke="#1e40af" stroke-width="2"/>
    <rect width="280" height="32" rx="7" fill="#1e40af"/>
    <text x="140" y="21" class="cls-header">Review</text>

    <g transform="translate(12, 48)">
      <text y="0" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> id : int</text>
      <text y="18" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> equipment_id : int</text>
      <text y="36" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> user_id : int</text>
      <text y="54" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> rating : int</text>
      <text y="72" class="attr-text"><tspan fill="#1e40af" font-weight="700">+</tspan> comment : string</text>
    </g>

    <line x1="0" y1="130" x2="280" y2="130" stroke="#e2e8f0" stroke-width="1.5"/>

    <g transform="translate(12, 148)">
      <text y="0" class="meth-text">+ create() : int</text>
      <text y="18" class="meth-text">+ findByEquipment() : Review[]</text>
      <text y="36" class="meth-text">+ getAverageRating() : float</text>
    </g>
  </g>

  <!-- ================= CONTROLLER MODULES ================= -->

  <!-- AuthController -->
  <g transform="translate(60, 580)">
    <rect width="260" height="150" rx="8" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
    <rect width="260" height="32" rx="7" fill="#16a34a"/>
    <text x="130" y="21" class="cls-header">AuthController</text>
    <g transform="translate(12, 50)">
      <text y="0" class="meth-text">+ registerUser(req, res, next)</text>
      <text y="20" class="meth-text">+ loginUser(req, res, next)</text>
      <text y="40" class="meth-text">+ getMe(req, res, next)</text>
    </g>
  </g>

  <!-- EquipmentController -->
  <g transform="translate(360, 580)">
    <rect width="240" height="170" rx="8" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
    <rect width="240" height="32" rx="7" fill="#16a34a"/>
    <text x="120" y="21" class="cls-header">EquipmentController</text>
    <g transform="translate(12, 50)">
      <text y="0" class="meth-text">+ getAllEquipment(req, res)</text>
      <text y="20" class="meth-text">+ getEquipmentById(req, res)</text>
      <text y="40" class="meth-text">+ createEquipment(req, res)</text>
      <text y="60" class="meth-text">+ updateEquipment(req, res)</text>
      <text y="80" class="meth-text">+ deleteEquipment(req, res)</text>
    </g>
  </g>

  <!-- BookingController -->
  <g transform="translate(960, 580)">
    <rect width="280" height="190" rx="8" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
    <rect width="280" height="32" rx="7" fill="#16a34a"/>
    <text x="140" y="21" class="cls-header">BookingController</text>
    <g transform="translate(12, 50)">
      <text y="0" class="meth-text">+ createBooking(req, res)</text>
      <text y="20" class="meth-text">+ getMyBookings(req, res)</text>
      <text y="40" class="meth-text">+ getOwnerBookings(req, res)</text>
      <text y="60" class="meth-text">+ approveBooking(req, res)</text>
      <text y="80" class="meth-text">+ rejectBooking(req, res)</text>
      <text y="100" class="meth-text">+ cancelBooking(req, res)</text>
    </g>
  </g>

  <!-- Middlewares & DB -->
  <g transform="translate(60, 800)">
    <rect width="260" height="130" rx="8" fill="#ffffff" stroke="#ea580c" stroke-width="2"/>
    <rect width="260" height="32" rx="7" fill="#ea580c"/>
    <text x="130" y="21" class="cls-header">AuthMiddleware</text>
    <g transform="translate(12, 50)">
      <text y="0" class="meth-text">+ protect(req, res, next)</text>
      <text y="20" class="meth-text">+ authorizeRoles(...roles)</text>
    </g>
  </g>

  <g transform="translate(360, 800)">
    <rect width="240" height="130" rx="8" fill="#ffffff" stroke="#ea580c" stroke-width="2"/>
    <rect width="240" height="32" rx="7" fill="#ea580c"/>
    <text x="120" y="21" class="cls-header">UploadMiddleware</text>
    <g transform="translate(12, 50)">
      <text y="0" class="meth-text">+ uploadSingle(fieldName)</text>
      <text y="20" class="meth-text">+ uploadToCloudinary(file)</text>
    </g>
  </g>

  <g transform="translate(960, 800)">
    <rect width="280" height="140" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <rect width="280" height="32" rx="7" fill="#0284c7"/>
    <text x="140" y="21" class="cls-header">DBConnection</text>
    <g transform="translate(12, 50)">
      <text y="0" class="attr-text"><tspan fill="#dc2626" font-weight="700">-</tspan> pool : mysql2.Pool</text>
      <text y="24" class="meth-text">+ query(sql, params) : Promise</text>
      <text y="44" class="meth-text">+ getConnection() : Connection</text>
    </g>
  </g>

  <!-- CONNECTORS -->
  <line x1="320" y1="250" x2="640" y2="250" stroke="#1d4ed8" stroke-width="2" marker-end="url(#assoc-arrow)"/>
  <line x1="600" y1="280" x2="640" y2="280" stroke="#1d4ed8" stroke-width="2" marker-end="url(#assoc-arrow)"/>
  <line x1="920" y1="280" x2="960" y2="280" stroke="#1d4ed8" stroke-width="2" marker-end="url(#assoc-arrow)"/>
  <line x1="1240" y1="280" x2="1280" y2="280" stroke="#16a34a" stroke-width="2" marker-end="url(#assoc-arrow)"/>
  <line x1="1240" y1="310" x2="1600" y2="310" stroke="#1d4ed8" stroke-width="2" marker-end="url(#assoc-arrow)"/>
  <line x1="780" y1="520" x2="780" y2="580" stroke="#1d4ed8" stroke-width="2" marker-end="url(#assoc-arrow)"/>

</svg>
"""

svg_path = os.path.join(output_dir, "uml-class-diagram.svg")
with open(svg_path, "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Successfully created docs/diagrams/uml-class-diagram.svg")

hti = Html2Image(
    browser_executable=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    output_path=output_dir,
    size=(1980, 1120),
    custom_flags=['--force-device-scale-factor=2', '--hide-scrollbars', '--disable-gpu']
)

html_str = f"<html><body style='margin:0;padding:0;background:#ffffff;'>{svg_content}</body></html>"
hti.screenshot(html_str=html_str, save_as="uml-class-diagram.png")
print("Successfully generated docs/diagrams/uml-class-diagram.png")
