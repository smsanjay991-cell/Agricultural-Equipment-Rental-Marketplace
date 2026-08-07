import os
from html2image import Html2Image

output_dir = os.path.abspath("docs/diagrams")

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000" style="background:#ffffff; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
  <defs>
    <style>
      .hdr-title { font-size: 26px; font-weight: 800; fill: #1e3a8a; text-anchor: middle; }
      .hdr-sub { font-size: 14px; font-weight: 500; fill: #475569; text-anchor: middle; }
      .legend { font-size: 12px; font-weight: 600; fill: #334155; }
      
      .tbl-header { font-size: 13px; font-weight: 800; fill: #ffffff; }
      .col-pk { font-size: 11px; font-weight: 800; fill: #1e40af; }
      .col-fk { font-size: 11px; font-weight: 700; fill: #2563eb; }
      .col-uq { font-size: 11px; font-weight: 700; fill: #d97706; }
      .col-name { font-size: 11px; font-weight: 600; fill: #0f172a; }
      .col-type { font-size: 11px; font-weight: 400; fill: #64748b; }
      
      .rel-label { font-size: 11px; font-weight: 700; fill: #1d4ed8; text-anchor: middle; background: #ffffff; }
    </style>

    <marker id="crows-foot" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 6 L 0 12 M 10 0 L 10 12" fill="none" stroke="#2563eb" stroke-width="2"/>
    </marker>
    <marker id="one-one" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 4 0 L 4 12 M 8 0 L 8 12" fill="none" stroke="#16a34a" stroke-width="2"/>
    </marker>
  </defs>

  <!-- Canvas Background -->
  <rect width="1600" height="1000" fill="#ffffff"/>

  <!-- Header Banner -->
  <rect x="40" y="30" width="1520" height="80" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="800" y="65" class="hdr-title">AGRIRENT — ENTERPRISE ENTITY RELATIONSHIP (ER) DIAGRAM</text>
  <text x="800" y="92" class="hdr-sub">Database Relational Model &amp; Crow's Foot Cardinality Notation | Capstone Architecture</text>

  <!-- Legend Bar -->
  <rect x="40" y="125" width="1520" height="35" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
  <text x="60" y="147" class="legend">Legend:  <tspan fill="#1e40af" font-weight="800">PK</tspan> = Primary Key  |  <tspan fill="#2563eb" font-weight="700">FK</tspan> = Foreign Key  |  <tspan fill="#d97706" font-weight="700">UQ</tspan> = Unique Key  |  <tspan fill="#64748b">IDX</tspan> = Indexed Column  |  Crow's Foot Lines = 1:N &amp; 1:1 Relationships</text>

  <!-- ================= ENTITIES ================= -->

  <!-- 1. USERS TABLE -->
  <g transform="translate(60, 190)">
    <rect width="320" height="270" rx="10" fill="#ffffff" stroke="#1e40af" stroke-width="2"/>
    <rect width="320" height="35" rx="9" fill="#1e40af"/>
    <text x="15" y="23" class="tbl-header">👤 USERS (User Accounts)</text>
    
    <g transform="translate(15, 50)">
      <text y="0" class="col-pk">PK</text><text x="35" y="0" class="col-name">id</text><text x="170" y="0" class="col-type">INT AUTO_INCREMENT</text>
      <text y="22" class="col-uq">UQ</text><text x="35" y="22" class="col-name">email</text><text x="170" y="22" class="col-type">VARCHAR(255)</text>
      <text x="35" y="44" class="col-name">name</text><text x="170" y="44" class="col-type">VARCHAR(100)</text>
      <text x="35" y="66" class="col-name">password</text><text x="170" y="66" class="col-type">VARCHAR(255) [bcrypt]</text>
      <text y="88" class="col-name" fill="#64748b">IDX</text><text x="35" y="88" class="col-name">role</text><text x="170" y="88" class="col-type">ENUM('farmer','owner','admin')</text>
      <text x="35" y="110" class="col-name">phone</text><text x="170" y="110" class="col-type">VARCHAR(20)</text>
      <text x="35" y="132" class="col-name">address</text><text x="170" y="132" class="col-type">TEXT</text>
      <text x="35" y="154" class="col-name">created_at</text><text x="170" y="154" class="col-type">DATETIME</text>
      <text x="35" y="176" class="col-name">updated_at</text><text x="170" y="176" class="col-type">DATETIME</text>
    </g>
  </g>

  <!-- 2. CATEGORIES TABLE -->
  <g transform="translate(460, 190)">
    <rect width="280" height="190" rx="10" fill="#ffffff" stroke="#1e40af" stroke-width="2"/>
    <rect width="280" height="35" rx="9" fill="#1e40af"/>
    <text x="15" y="23" class="tbl-header">🏷️ CATEGORIES (Machinery Types)</text>
    
    <g transform="translate(15, 50)">
      <text y="0" class="col-pk">PK</text><text x="35" y="0" class="col-name">id</text><text x="140" y="0" class="col-type">INT AUTO_INCREMENT</text>
      <text y="22" class="col-uq">UQ</text><text x="35" y="22" class="col-name">name</text><text x="140" y="22" class="col-type">VARCHAR(100)</text>
      <text x="35" y="44" class="col-name">description</text><text x="140" y="44" class="col-type">TEXT</text>
      <text x="35" y="66" class="col-name">image_url</text><text x="140" y="66" class="col-type">VARCHAR(255)</text>
      <text x="35" y="88" class="col-name">created_at</text><text x="140" y="88" class="col-type">DATETIME</text>
    </g>
  </g>

  <!-- 3. EQUIPMENT TABLE -->
  <g transform="translate(800, 190)">
    <rect width="340" height="310" rx="10" fill="#ffffff" stroke="#1e40af" stroke-width="2"/>
    <rect width="340" height="35" rx="9" fill="#1e40af"/>
    <text x="15" y="23" class="tbl-header">🚜 EQUIPMENT (Listings)</text>
    
    <g transform="translate(15, 50)">
      <text y="0" class="col-pk">PK</text><text x="35" y="0" class="col-name">id</text><text x="175" y="0" class="col-type">INT AUTO_INCREMENT</text>
      <text y="22" class="col-fk">FK</text><text x="35" y="22" class="col-name">owner_id</text><text x="175" y="22" class="col-type">INT -> users(id)</text>
      <text y="44" class="col-fk">FK</text><text x="35" y="44" class="col-name">category_id</text><text x="175" y="44" class="col-type">INT -> categories(id)</text>
      <text x="35" y="66" class="col-name">title</text><text x="175" y="66" class="col-type">VARCHAR(150)</text>
      <text x="35" y="88" class="col-name">description</text><text x="175" y="88" class="col-type">TEXT</text>
      <text x="35" y="110" class="col-name">daily_rate</text><text x="175" y="110" class="col-type">DECIMAL(10,2)</text>
      <text x="35" y="132" class="col-name">location</text><text x="175" y="132" class="col-type">VARCHAR(255)</text>
      <text x="35" y="154" class="col-name">condition_status</text><text x="175" y="154" class="col-type">ENUM('excellent',...)</text>
      <text y="176" class="col-name" fill="#64748b">IDX</text><text x="35" y="176" class="col-name">is_available</text><text x="175" y="176" class="col-type">BOOLEAN DEFAULT TRUE</text>
      <text x="35" y="198" class="col-name">image_url</text><text x="175" y="198" class="col-type">VARCHAR(255)</text>
      <text x="35" y="220" class="col-name">created_at</text><text x="175" y="220" class="col-type">DATETIME</text>
    </g>
  </g>

  <!-- 4. BOOKINGS TABLE -->
  <g transform="translate(1200, 190)">
    <rect width="340" height="290" rx="10" fill="#ffffff" stroke="#1e40af" stroke-width="2"/>
    <rect width="340" height="35" rx="9" fill="#1e40af"/>
    <text x="15" y="23" class="tbl-header">📅 BOOKINGS (Reservations)</text>
    
    <g transform="translate(15, 50)">
      <text y="0" class="col-pk">PK</text><text x="35" y="0" class="col-name">id</text><text x="175" y="0" class="col-type">INT AUTO_INCREMENT</text>
      <text y="22" class="col-fk">FK</text><text x="35" y="22" class="col-name">equipment_id</text><text x="175" y="22" class="col-type">INT -> equipment(id)</text>
      <text y="44" class="col-fk">FK</text><text x="35" y="44" class="col-name">farmer_id</text><text x="175" y="44" class="col-type">INT -> users(id)</text>
      <text x="35" y="66" class="col-name">start_date</text><text x="175" y="66" class="col-type">DATE</text>
      <text x="35" y="88" class="col-name">end_date</text><text x="175" y="88" class="col-type">DATE</text>
      <text x="35" y="110" class="col-name">total_days</text><text x="175" y="110" class="col-type">INT</text>
      <text x="35" y="132" class="col-name">total_price</text><text x="175" y="132" class="col-type">DECIMAL(10,2)</text>
      <text y="154" class="col-name" fill="#64748b">IDX</text><text x="35" y="154" class="col-name">status</text><text x="175" y="154" class="col-type">ENUM('pending',...)</text>
      <text x="35" y="176" class="col-name">created_at</text><text x="175" y="176" class="col-type">DATETIME</text>
      <text x="35" y="198" class="col-name">updated_at</text><text x="175" y="198" class="col-type">DATETIME</text>
    </g>
  </g>

  <!-- 5. PAYMENTS TABLE -->
  <g transform="translate(1200, 580)">
    <rect width="340" height="240" rx="10" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
    <rect width="340" height="35" rx="9" fill="#16a34a"/>
    <text x="15" y="23" class="tbl-header">💳 PAYMENTS (Transactions)</text>
    
    <g transform="translate(15, 50)">
      <text y="0" class="col-pk">PK</text><text x="35" y="0" class="col-name">id</text><text x="175" y="0" class="col-type">INT AUTO_INCREMENT</text>
      <text y="22" class="col-fk">FK</text><text x="35" y="22" class="col-name">booking_id</text><text x="175" y="22" class="col-type">INT (UQ) -> bookings(id)</text>
      <text y="44" class="col-uq">UQ</text><text x="35" y="44" class="col-name">transaction_id</text><text x="175" y="44" class="col-type">VARCHAR(100)</text>
      <text x="35" y="66" class="col-name">amount</text><text x="175" y="66" class="col-type">DECIMAL(10,2)</text>
      <text x="35" y="88" class="col-name">payment_method</text><text x="175" y="88" class="col-type">ENUM('card','upi',...)</text>
      <text y="110" class="col-name" fill="#64748b">IDX</text><text x="35" y="110" class="col-name">payment_status</text><text x="175" y="110" class="col-type">ENUM('pending',...)</text>
      <text x="35" y="132" class="col-name">payment_date</text><text x="175" y="132" class="col-type">DATETIME</text>
    </g>
  </g>

  <!-- 6. NOTIFICATIONS TABLE -->
  <g transform="translate(60, 580)">
    <rect width="320" height="240" rx="10" fill="#ffffff" stroke="#1e40af" stroke-width="2"/>
    <rect width="320" height="35" rx="9" fill="#1e40af"/>
    <text x="15" y="23" class="tbl-header">🔔 NOTIFICATIONS (Alerts)</text>
    
    <g transform="translate(15, 50)">
      <text y="0" class="col-pk">PK</text><text x="35" y="0" class="col-name">id</text><text x="170" y="0" class="col-type">INT AUTO_INCREMENT</text>
      <text y="22" class="col-fk">FK</text><text x="35" y="22" class="col-name">user_id</text><text x="170" y="22" class="col-type">INT -> users(id)</text>
      <text y="44" class="col-fk">FK</text><text x="35" y="44" class="col-name">booking_id</text><text x="170" y="44" class="col-type">INT (NULL) -> bookings</text>
      <text x="35" y="66" class="col-name">title</text><text x="170" y="66" class="col-type">VARCHAR(150)</text>
      <text x="35" y="88" class="col-name">message</text><text x="170" y="88" class="col-type">TEXT</text>
      <text x="35" y="110" class="col-name">type</text><text x="170" y="110" class="col-type">ENUM('booking',...)</text>
      <text y="132" class="col-name" fill="#64748b">IDX</text><text x="35" y="132" class="col-name">is_read</text><text x="170" y="132" class="col-type">BOOLEAN DEFAULT FALSE</text>
      <text x="35" y="154" class="col-name">created_at</text><text x="170" y="154" class="col-type">DATETIME</text>
    </g>
  </g>

  <!-- 7. REVIEWS TABLE -->
  <g transform="translate(800, 580)">
    <rect width="340" height="240" rx="10" fill="#ffffff" stroke="#1e40af" stroke-width="2"/>
    <rect width="340" height="35" rx="9" fill="#1e40af"/>
    <text x="15" y="23" class="tbl-header">⭐ REVIEWS (Feedback &amp; Ratings)</text>
    
    <g transform="translate(15, 50)">
      <text y="0" class="col-pk">PK</text><text x="35" y="0" class="col-name">id</text><text x="175" y="0" class="col-type">INT AUTO_INCREMENT</text>
      <text y="22" class="col-fk">FK</text><text x="35" y="22" class="col-name">equipment_id</text><text x="175" y="22" class="col-type">INT -> equipment(id)</text>
      <text y="44" class="col-fk">FK</text><text x="35" y="44" class="col-name">farmer_id</text><text x="175" y="44" class="col-type">INT -> users(id)</text>
      <text x="35" y="66" class="col-name">rating</text><text x="175" y="66" class="col-type">INT (CHECK 1..5)</text>
      <text x="35" y="88" class="col-name">comment</text><text x="175" y="88" class="col-type">TEXT</text>
      <text y="110" class="col-uq">UQ</text><text x="35" y="110" class="col-name">(farmer_id, equip_id)</text><text x="175" y="110" class="col-type">UNIQUE KEY Constraint</text>
      <text x="35" y="132" class="col-name">created_at</text><text x="175" y="132" class="col-type">DATETIME</text>
    </g>
  </g>

  <!-- ================= RELATIONSHIPS ================= -->

  <!-- Rel 1: User (Owner) -> Equipment (1 : N) -->
  <line x1="380" y1="250" x2="800" y2="250" stroke="#2563eb" stroke-width="2" marker-end="url(#crows-foot)"/>
  <rect x="540" y="235" width="100" height="20" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="590" y="249" class="rel-label">1 : N (Owns)</text>

  <!-- Rel 2: Category -> Equipment (1 : N) -->
  <line x1="740" y1="280" x2="800" y2="280" stroke="#2563eb" stroke-width="2" marker-end="url(#crows-foot)"/>

  <!-- Rel 3: Equipment -> Booking (1 : N) -->
  <line x1="1140" y1="280" x2="1200" y2="280" stroke="#2563eb" stroke-width="2" marker-end="url(#crows-foot)"/>
  <rect x="1145" y="265" width="50" height="20" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="1170" y="279" class="rel-label">1 : N</text>

  <!-- Rel 4: User (Farmer) -> Bookings (1 : N) -->
  <path d="M 220 190 L 220 170 L 1370 170 L 1370 190" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#crows-foot)"/>
  <rect x="750" y="160" width="140" height="20" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="820" y="174" class="rel-label">1 : N (Farmer Bookings)</text>

  <!-- Rel 5: Booking -> Payment (1 : 1) -->
  <line x1="1370" y1="480" x2="1370" y2="580" stroke="#16a34a" stroke-width="2" marker-end="url(#one-one)"/>
  <rect x="1320" y="520" width="100" height="20" rx="4" fill="#f0fdf4" stroke="#bbf7d0"/>
  <text x="1370" y="534" class="rel-label" fill="#15803d">1 : 1 (Settles)</text>

  <!-- Rel 6: User -> Notifications (1 : N) -->
  <line x1="220" y1="460" x2="220" y2="580" stroke="#2563eb" stroke-width="2" marker-end="url(#crows-foot)"/>
  <rect x="170" y="510" width="100" height="20" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="220" y="524" class="rel-label">1 : N (Receives)</text>

  <!-- Rel 7: Equipment -> Reviews (1 : N) -->
  <line x1="970" y1="500" x2="970" y2="580" stroke="#2563eb" stroke-width="2" marker-end="url(#crows-foot)"/>

  <!-- Rel 8: User (Farmer) -> Reviews (1 : N) -->
  <path d="M 380 380 L 780 380 L 780 640 L 800 640" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#crows-foot)"/>

</svg>
"""

svg_path = os.path.join(output_dir, "er-diagram.svg")
with open(svg_path, "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Successfully created docs/diagrams/er-diagram.svg")

# Render PNG via Html2Image
hti = Html2Image(
    browser_executable=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    output_path=output_dir,
    size=(1620, 1020),
    custom_flags=['--force-device-scale-factor=2', '--hide-scrollbars', '--disable-gpu']
)

html_str = f"<html><body style='margin:0;padding:0;background:#ffffff;'>{svg_content}</body></html>"
hti.screenshot(html_str=html_str, save_as="er-diagram.png")
print("Successfully generated docs/diagrams/er-diagram.png")
