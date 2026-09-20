# System Architecture

## Overview

The **AgriRent** system is built using a classic 3-tier architecture: Presentation Tier (React.js), Application/API Tier (Node.js & Express.js), and Data Tier (MySQL 8). The architecture provides separation of concerns, role-based security, and efficient interaction between farmers, equipment owners, and system administrators.

---

## System Architecture Diagram

```mermaid
graph TD
    Users[Users / Browsers<br/>Farmer | Owner | Admin] -->|HTTP / JSON Requests| Frontend[React.js Frontend<br/>React Router & Context API]
    Frontend -->|REST API Calls<br/>Bearer JWT Headers| API Gateway[REST API / Express Router]
    
    subgraph Backend [Node.js + Express.js Backend Server]
        API Gateway --> Auth[Authentication & Authorization Middleware]
        
        Auth --> UserMod[User Module<br/>User Management]
        Auth --> EquipMod[Equipment Module<br/>Listings & Availability]
        Auth --> BookMod[Booking Module<br/>Rental Requests & Approval]
        Auth --> PayMod[Payment Module<br/>Transaction Records]
        Auth --> RevMod[Review Module<br/>Ratings & Feedback]
        Auth --> NotifMod[Notification Module<br/>System Alerts]
    end
    
    UserMod -->|mysql2 Pool| Database[(MySQL 8 Database<br/>agrirent DB)]
    EquipMod -->|mysql2 Pool| Database
    BookMod -->|mysql2 Pool| Database
    PayMod -->|mysql2 Pool| Database
    RevMod -->|mysql2 Pool| Database
    NotifMod -->|mysql2 Pool| Database
```

---

## Layer Descriptions

### 1. Presentation Tier (React Frontend)
- **Role:** Renders the user interface and handles user interactions.
- **Technologies:** React.js, React Router, CSS, HTML5.
- **Functionality:** Provides dedicated interfaces for Farmers (catalog browsing, booking creation, review submission), Equipment Owners (listing creation, booking approval/rejection), and Admins (user and platform monitoring). It maintains authentication state locally via React Context (`AuthContext`).

### 2. Application & API Tier (Node.js + Express Backend)
- **Role:** Hosts the business logic, API endpoints, route protection, and request handling.
- **Technologies:** Node.js, Express.js, JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`), Multer (image uploads).
- **Core Components:**
  - **REST API Gateway:** Maps incoming HTTP requests to target controllers (`/api/auth`, `/api/equipment`, `/api/bookings`, `/api/users`).
  - **Authentication / Authorization Middleware:** Verifies JWT signatures from incoming request headers (`Bearer <token>`) and enforces role-based access control (`farmer`, `owner`, `admin`).
  - **Feature Modules:** Individual controllers and models handling domain-specific operations such as calculating total rental prices, handling driver fees, approving requests, and generating notifications.

### 3. Data Tier (MySQL 8 Database)
- **Role:** Persists platform data with full relational integrity.
- **Technologies:** MySQL 8, `mysql2` connection pool with async/await promises.
- **Storage:** Stores user credentials, equipment listings, category definitions, booking records, payment logs, reviews, and notifications across 7 relational tables.
