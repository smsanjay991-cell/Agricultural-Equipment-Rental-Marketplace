# Agricultural Equipment Rental Marketplace
## System Architecture Diagram & Technical Specification

> **Capstone Project Architecture Documentation**  
> **Target Path:** `docs/diagrams/architecture.png`  
> **Source Files:** [`architecture.svg`](file:///c:/Users/sanja/OneDrive/Desktop/AgriRent/docs/diagrams/architecture.svg) | [`architecture.mermaid`](file:///c:/Users/sanja/OneDrive/Desktop/AgriRent/docs/diagrams/architecture.mermaid) | [`architecture.html`](file:///c:/Users/sanja/OneDrive/Desktop/AgriRent/docs/diagrams/architecture.html)

---

### System Architecture Diagram

![System Architecture Diagram](file:///c:/Users/sanja/OneDrive/Desktop/AgriRent/docs/diagrams/architecture.png)

---

### Architectural Overview

The **Agricultural Equipment Rental Marketplace** system follows a 5-Layer Modular Architecture designed for high scalability, separation of concerns, and robust role-based access control.

#### Technology Stack Summary
- **Frontend:** React.js (Single Page Application, React Router, Axios REST Client, JWT Local Storage)
- **Backend:** Node.js + Express.js (Modular RESTful API Controllers & Middleware)
- **Database:** MySQL Relational Database
- **Authentication:** JWT (JSON Web Tokens with Bearer Auth Headers)
- **Password Hashing:** bcrypt
- **Image Upload Handling:** Multer Middleware (Disk Storage)
- **API Style:** REST API (JSON Payloads)
- **Version Control:** Git + GitHub

---

### Layer Specifications

#### 1. Client Layer
- **User Roles:**
  - 👨‍🌾 **Farmer:** Browses available machinery, filters by category/location, creates rental bookings, and tracks booking status.
  - 🚜 **Equipment Owner:** Posts machinery listings, manages equipment availability, updates rates, and accepts/rejects rental requests.
  - 🛡️ **Admin:** System administration, platform user management, equipment category oversight, and marketplace moderation.
- **Frontend Client:** React.js SPA providing responsive user interfaces, dynamic state management, client-side routing, and token handling.

#### 2. Backend Layer (Express REST API)
- **Authentication Controller (`Completed`):** Handles user registration, authentication, JWT token generation, and password validation via `bcrypt`.
- **Equipment Controller (`Completed`):** Manages equipment CRUD operations, category filtering, search queries, and photo attachment handlers.
- **Booking Controller (`Completed`):** Manages rental reservation workflows, availability date validation, and status transitions (`pending`, `confirmed`, `completed`, `cancelled`).
- **Payment Controller (`Future`):** Planned module to process online transactions, handle payment gateway webhooks, and issue digital invoices.
- **Notification Controller (`Future`):** Planned module to trigger email alerts and in-app notifications for rental events.

#### 3. Business Logic & Middleware Layer
- **JWT Authentication:** Middleware verifying incoming `Authorization: Bearer <token>` headers and extracting authenticated user credentials.
- **Authorization Middleware:** Enforces Role-Based Access Control (RBAC) ensuring farmers, owners, and admins access authorized endpoints.
- **Validation Middleware:** Sanitizes and validates request body parameters, date formats, and numeric inputs.
- **Booking Logic Engine:** Validates date range overlaps to prevent double-booking of machinery and calculates total rental pricing based on daily rates.
- **Payment Logic Engine (`Future`):** State machine managing payout calculations, platform fee deductions, and refund policies.

#### 4. Database Layer (MySQL Database)
Relational MySQL database containing tables:
- `users`: User identity, authentication credentials, role (`farmer`, `owner`, `admin`), contact info (`Completed`).
- `categories`: Equipment categories (Tractors, Harvesters, Implements, Irrigation) (`Completed`).
- `equipment`: Machinery listings, specifications, rates, location, availability status (`Completed`).
- `bookings`: Rental agreements, date ranges, total cost, booking status (`Completed`).
- `payments`: Financial transactions, transaction ID, payment status, payment method (`Future`).
- `notifications`: User notification messages, notification type, read status (`Future`).
- `reviews`: Equipment and owner ratings, user feedback comments (`Future`).

#### 5. File Storage & External Integrations
- **File Storage (`uploads/`):** Server-side disk directory structure handled by `Multer`:
  - `uploads/equipment/`: High-resolution photos of listed agricultural machinery.
  - `uploads/profiles/`: User avatar and identification profile images.
- **Future External Services:**
  - 💳 **Payment Gateway:** Integration with Stripe / Razorpay for secure online payment processing.
  - ✉️ **Email Service:** Integration with SendGrid / Nodemailer SMTP for automated transactional notifications.

---

### Editable Source Files Included

| File Format | Path | Purpose |
| :--- | :--- | :--- |
| **High-Res Image** | [`architecture.png`](file:///c:/Users/sanja/OneDrive/Desktop/AgriRent/docs/diagrams/architecture.png) | Final rendered PNG diagram artifact (White BG, Blue Theme) |
| **Vector Source** | [`architecture.svg`](file:///c:/Users/sanja/OneDrive/Desktop/AgriRent/docs/diagrams/architecture.svg) | Editable SVG Vector file for Figma / Illustrator / Draw.io |
| **Mermaid Source** | [`architecture.mermaid`](file:///c:/Users/sanja/OneDrive/Desktop/AgriRent/docs/diagrams/architecture.mermaid) | Editable Mermaid Markdown diagram code |
| **HTML Source** | [`architecture.html`](file:///c:/Users/sanja/OneDrive/Desktop/AgriRent/docs/diagrams/architecture.html) | Editable HTML5 & CSS3 layout template |
