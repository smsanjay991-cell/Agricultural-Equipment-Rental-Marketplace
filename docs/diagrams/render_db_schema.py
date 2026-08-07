import os
from html2image import Html2Image

output_dir = os.path.abspath("docs/diagrams")

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000" style="background:#ffffff; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
  <defs>
    <style>
      .hdr-title { font-size: 26px; font-weight: 800; fill: #0369a1; text-anchor: middle; }
      .hdr-sub { font-size: 14px; font-weight: 500; fill: #475569; text-anchor: middle; }
      .legend { font-size: 12px; font-weight: 600; fill: #334155; }
      
      .tbl-header { font-size: 13px; font-weight: 800; fill: #ffffff; }
      .col-pk { font-size: 11px; font-weight: 800; fill: #0369a1; }
      .col-fk { font-size: 11px; font-weight: 700; fill: #0284c7; }
      .col-uq { font-size: 11px; font-weight: 700; fill: #d97706; }
      .col-name { font-size: 11px; font-weight: 600; fill: #0f172a; }
      .col-type { font-size: 11px; font-weight: 400; fill: #64748b; }
      
      .rel-label { font-size: 11px; font-weight: 700; fill: #0284c7; text-anchor: middle; }
    </style>

    <marker id="crows-foot-blue" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 6 L 0 12 M 10 0 L 10 12" fill="none" stroke="#0284c7" stroke-width="2"/>
    </marker>
    <marker id="one-one-green" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 4 0 L 4 12 M 8 0 L 8 12" fill="none" stroke="#16a34a" stroke-width="2"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="1600" height="1000" fill="#ffffff"/>

  <!-- Header Banner -->
  <rect x="40" y="30" width="1520" height="80" rx="12" fill="#f0f9ff" stroke="#bae6fd" stroke-width="2"/>
  <text x="800" y="65" class="hdr-title">AGRIRENT — MYSQL 8.0 PHYSICAL DATABASE SCHEMA DIAGRAM</text>
  <text x="800" y="92" class="hdr-sub">MySQL Workbench Style Physical Relational Schema | Data Types, Constraints &amp; Indexing Strategy</text>

  <!-- Legend Bar -->
  <rect x="40" y="125" width="1520" height="35" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
  <text x="60" y="147" class="legend">Legend:  <tspan fill="#0369a1" font-weight="800">[PK]</tspan> Primary Key  |  <tspan fill="#0284c7" font-weight="700">[FK]</tspan> Foreign Key  |  <tspan fill="#d97706" font-weight="700">[UQ]</tspan> Unique Constraint  |  <tspan fill="#64748b">[IDX]</tspan> B-Tree Index Pointer  |  Engine: InnoDB (utf8mb4)</text>

  <!-- ================= TABLES ================= -->

  <!-- 1. USERS TABLE -->
  <g transform="translate(60, 190)">
    <rect width="320" height="270" rx="10" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <rect width="320" height="35" rx="9" fill="#0284c7"/>
    <text x="15" y="23" class="tbl-header">👤 users (User Accounts)</text>
    
    <g transform="translate(15, 50)">
      <text y="0" class="col-pk">PK</text><text x="35" y="0" class="col-name">id</text><text x="170" y="0" class="col-type">INT AUTO_INCREMENT</text>
      <text y="22" class="col-uq">UQ</text><text x="35" y="22" class="col-name">email</text><text x="170" y="22" class="col-type">VARCHAR(255)</text>
      <text x="35" y="44" class="col-name">name</text><text x="170" y="44" class="col-type">VARCHAR(100)</text>
      <text x="35" y="66" class="col-name">password</text><text x="170" y="66" class="col-type">VARCHAR(255) [bcrypt]</text>
      <text y="88" class="col-name" fill="#64748b">IDX</text><text x="35" y="88" class="col-name">role</text><text x="170" y="88" class="col-type">ENUM('farmer','owner','admin')</text>
      <text x="35" y="110" class="col-name">phone</text><text x="170" y="110" class="col-type">VARCHAR(20) [NULL]</text>
      <text x="35" y="132" class="col-name">address</text><text x="170" y="132" class="col-type">TEXT [NULL]</text>
      <text x="35" y="154" class="col-name">created_at</text><text x="170" y="154" class="col-type">DATETIME DEFAULT NOW</text>
      <text x="35" y="176" class="col-name">updated_at</text><text x="170" y="176" class="col-type">DATETIME DEFAULT NOW</text>
    </g>
  </g>

  <!-- 2. CATEGORIES TABLE -->
  <g transform="translate(460, 190)">
    <rect width="280" height="190" rx="10" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <rect width="280" height="35" rx="9" fill="#0284c7"/>
    <text x="15" y="23" class="tbl-header">🏷️ categories (Machinery Types)</text>
    
    <g transform="translate(15, 50)">
      <text y="0" class="col-pk">PK</text><text x="35" y="0" class="col-name">id</text><text x="140" y="0" class="col-type">INT AUTO_INCREMENT</text>
      <text y="22" class="col-uq">UQ</text><text x="35" y="22" class="col-name">name</text><text x="140" y="22" class="col-type">VARCHAR(100)</text>
      <text x="35" y="44" class="col-name">description</text><text x="140" y="44" class="col-type">TEXT [NULL]</text>
      <text x="35" y="66" class="col-name">image_url</text><text x="140" y="66" class="col-type">VARCHAR(255) [NULL]</text>
      <text x="35" y="88" class="col-name">created_at</text><text x="140" y="88" class="col-type">DATETIME DEFAULT NOW</text>
    </g>
  </g>

  <!-- 3. EQUIPMENT TABLE -->
  <g transform="translate(800, 190)">
    <rect width="340" height="310" rx="10" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <rect width="340" height="35" rx="9" fill="#0284c7"/>
    <text x="15" y="23" class="tbl-header">🚜 equipment (Listings)</text>
    
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
      <text x="35" y="198" class="col-name">image_url</text><text x="175" y="198" class="col-type">VARCHAR(255) [NULL]</text>
      <text x="35" y="220" class="col-name">created_at</text><text x="175" y="220" class="col-type">DATETIME DEFAULT NOW</text>
    </g>
  </g>

  <!-- 4. BOOKINGS TABLE -->
  <g transform="translate(1200, 190)">
    <rect width="340" height="290" rx="10" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <rect width="340" height="35" rx="9" fill="#0284c7"/>
    <text x="15" y="23" class="tbl-header">📅 bookings (Reservations)</text>
    
    <g transform="translate(15, 50)">
      <text y="0" class="col-pk">PK</text><text x="35" y="0" class="col-name">id</text><text x="175" y="0" class="col-type">INT AUTO_INCREMENT</text>
      <text y="22" class="col-fk">FK</text><text x="35" y="22" class="col-name">equipment_id</text><text x="175" y="22" class="col-type">INT -> equipment(id)</text>
      <text y="44" class="col-fk">FK</text><text x="35" y="44" class="col-name">farmer_id</text><text x="175" y="44" class="col-type">INT -> users(id)</text>
      <text x="35" y="66" class="col-name">start_date</text><text x="175" y="66" class="col-type">DATE</text>
      <text x="35" y="88" class="col-name">end_date</text><text x="175" y="88" class="col-type">DATE</text>
      <text x="35" y="110" class="col-name">total_days</text><text x="175" y="110" class="col-type">INT</text>
      <text x="35" y="132" class="col-name">total_price</text><text x="175" y="132" class="col-type">DECIMAL(10,2)</text>
      <text y="154" class="col-name" fill="#64748b">IDX</text><text x="35" y="154" class="col-name">status</text><text x="175" y="154" class="col-type">ENUM('pending',...)</text>
      <text x="35" y="176" class="col-name">created_at</text><text x="175" y="176" class="col-type">DATETIME DEFAULT NOW</text>
      <text x="35" y="198" class="col-name">updated_at</text><text x="175" y="198" class="col-type">DATETIME DEFAULT NOW</text>
    </g>
  </g>

  <!-- 5. PAYMENTS TABLE -->
  <g transform="translate(1200, 580)">
    <rect width="340" height="240" rx="10" fill="#ffffff" stroke="#16a34a" stroke-width="2"/>
    <rect width="340" height="35" rx="9" fill="#16a34a"/>
    <text x="15" y="23" class="tbl-header">💳 payments (Transactions)</text>
    
    <g transform="translate(15, 50)">
      <text y="0" class="col-pk">PK</text><text x="35" y="0" class="col-name">id</text><text x="175" y="0" class="col-type">INT AUTO_INCREMENT</text>
      <text y="22" class="col-fk">FK</text><text x="35" y="22" class="col-name">booking_id</text><text x="175" y="22" class="col-type">INT (UQ) -> bookings(id)</text>
      <text y="44" class="col-uq">UQ</text><text x="35" y="44" class="col-name">transaction_id</text><text x="175" y="44" class="col-type">VARCHAR(100)</text>
      <text x="35" y="66" class="col-name">amount</text><text x="175" y="66" class="col-type">DECIMAL(10,2)</text>
      <text x="35" y="88" class="col-name">payment_method</text><text x="175" y="88" class="col-type">ENUM('card','upi',...)</text>
      <text y="110" class="col-name" fill="#64748b">IDX</text><text x="35" y="110" class="col-name">payment_status</text><text x="175" y="110" class="col-type">ENUM('pending',...)</text>
      <text x="35" y="132" class="col-name">payment_date</text><text x="175" y="132" class="col-type">DATETIME DEFAULT NOW</text>
    </g>
  </g>

  <!-- 6. NOTIFICATIONS TABLE -->
  <g transform="translate(60, 580)">
    <rect width="320" height="240" rx="10" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <rect width="320" height="35" rx="9" fill="#0284c7"/>
    <text x="15" y="23" class="tbl-header">🔔 notifications (System Alerts)</text>
    
    <g transform="translate(15, 50)">
      <text y="0" class="col-pk">PK</text><text x="35" y="0" class="col-name">id</text><text x="170" y="0" class="col-type">INT AUTO_INCREMENT</text>
      <text y="22" class="col-fk">FK</text><text x="35" y="22" class="col-name">user_id</text><text x="170" y="22" class="col-type">INT -> users(id)</text>
      <text y="44" class="col-fk">FK</text><text x="35" y="44" class="col-name">booking_id</text><text x="170" y="44" class="col-type">INT (NULL) -> bookings</text>
      <text x="35" y="66" class="col-name">title</text><text x="170" y="66" class="col-type">VARCHAR(150)</text>
      <text x="35" y="88" class="col-name">message</text><text x="170" y="88" class="col-type">TEXT</text>
      <text x="35" y="110" class="col-name">type</text><text x="170" y="110" class="col-type">ENUM('booking',...)</text>
      <text y="132" class="col-name" fill="#64748b">IDX</text><text x="35" y="132" class="col-name">is_read</text><text x="170" y="132" class="col-type">BOOLEAN DEFAULT FALSE</text>
      <text x="35" y="154" class="col-name">created_at</text><text x="170" y="154" class="col-type">DATETIME DEFAULT NOW</text>
    </g>
  </g>

  <!-- 7. REVIEWS TABLE -->
  <g transform="translate(800, 580)">
    <rect width="340" height="240" rx="10" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <rect width="340" height="35" rx="9" fill="#0284c7"/>
    <text x="15" y="23" class="tbl-header">⭐ reviews (Feedback &amp; Ratings)</text>
    
    <g transform="translate(15, 50)">
      <text y="0" class="col-pk">PK</text><text x="35" y="0" class="col-name">id</text><text x="175" y="0" class="col-type">INT AUTO_INCREMENT</text>
      <text y="22" class="col-fk">FK</text><text x="35" y="22" class="col-name">equipment_id</text><text x="175" y="22" class="col-type">INT -> equipment(id)</text>
      <text y="44" class="col-fk">FK</text><text x="35" y="44" class="col-name">user_id</text><text x="175" y="44" class="col-type">INT -> users(id)</text>
      <text x="35" y="66" class="col-name">rating</text><text x="175" y="66" class="col-type">INT (CHECK 1..5)</text>
      <text x="35" y="88" class="col-name">comment</text><text x="175" y="88" class="col-type">TEXT [NULL]</text>
      <text y="110" class="col-uq">UQ</text><text x="35" y="110" class="col-name">(user_id, equip_id)</text><text x="175" y="110" class="col-type">UNIQUE KEY Constraint</text>
      <text x="35" y="132" class="col-name">created_at</text><text x="175" y="132" class="col-type">DATETIME DEFAULT NOW</text>
    </g>
  </g>

  <!-- CONNECTORS -->
  <line x1="380" y1="250" x2="800" y2="250" stroke="#0284c7" stroke-width="2" marker-end="url(#crows-foot-blue)"/>
  <line x1="740" y1="280" x2="800" y2="280" stroke="#0284c7" stroke-width="2" marker-end="url(#crows-foot-blue)"/>
  <line x1="1140" y1="280" x2="1200" y2="280" stroke="#0284c7" stroke-width="2" marker-end="url(#crows-foot-blue)"/>
  <path d="M 220 190 L 220 170 L 1370 170 L 1370 190" fill="none" stroke="#0284c7" stroke-width="2" marker-end="url(#crows-foot-blue)"/>
  <line x1="1370" y1="480" x2="1370" y2="580" stroke="#16a34a" stroke-width="2" marker-end="url(#one-one-green)"/>
  <line x1="220" y1="460" x2="220" y2="580" stroke="#0284c7" stroke-width="2" marker-end="url(#crows-foot-blue)"/>
  <line x1="970" y1="500" x2="970" y2="580" stroke="#0284c7" stroke-width="2" marker-end="url(#crows-foot-blue)"/>
  <path d="M 380 380 L 780 380 L 780 640 L 800 640" fill="none" stroke="#0284c7" stroke-width="2" marker-end="url(#crows-foot-blue)"/>

</svg>
"""

svg_path = os.path.join(output_dir, "database-schema.svg")
with open(svg_path, "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Successfully created docs/diagrams/database-schema.svg")

hti = Html2Image(
    browser_executable=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    output_path=output_dir,
    size=(1620, 1020),
    custom_flags=['--force-device-scale-factor=2', '--hide-scrollbars', '--disable-gpu']
)

html_str = f"<html><body style='margin:0;padding:0;background:#ffffff;'>{svg_content}</body></html>"
hti.screenshot(html_str=html_str, save_as="database-schema.png")
print("Successfully generated docs/diagrams/database-schema.png")
