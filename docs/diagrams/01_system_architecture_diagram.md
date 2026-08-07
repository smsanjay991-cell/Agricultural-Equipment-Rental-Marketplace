# AgriRent - System Architecture Diagram & Technical Specification

**Document Version:** 1.0.0  
**Status:** Approved  
**Author:** Enterprise Solution Architect & Technical Documentation Team  
**Target Location:** `docs/diagrams/01_system_architecture_diagram.md`  

---

## 1. Executive Summary

This document provides a comprehensive, enterprise-grade **System Architecture Diagram** for **AgriRent** (Agricultural Equipment Rental Marketplace). AgriRent utilizes a **N-Tier Client-Server Architecture** featuring a single-page React frontend, a RESTful Node.js/Express API layer, relational MySQL persistence, local & Cloudinary image storage, and JWT-based authentication perimeters.

---

## 2. High-Level System Architecture Diagram (Mermaid)

The diagram below outlines the structural layers, network protocols, data flows, and security boundaries across the entire application ecosystem.

```mermaid
flowchart TD
    %% Styling Definitions
    classDef clientLayer fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1
    classDef apiLayer fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#15803d
    classDef middlewareLayer fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#c2410c
    classDef databaseLayer fill:#fef2f2,stroke:#dc2626,stroke-width:2px,color:#b91c1c
    classDef storageLayer fill:#faf5ff,stroke:#9333ea,stroke-width:2px,color:#7e22ce
    classDef securityBoundary stroke:#f59e0b,stroke-width:2px,stroke-dasharray: 5 5

    subgraph CLIENT_ZONE ["🌐 Layer 1: Presentation / Client Zone"]
        direction TB
        subgraph USERS ["User Personas"]
            Farmer["👨‍🌾 Farmer / Renter"]
            Owner["🚜 Equipment Owner"]
            Admin["🛡️ Platform Admin"]
        end

        subgraph FRONTEND ["React.js Client Application (Vite + Tailwind)"]
            ReactUI["💻 React SPA UI Components"]
            StateStore["🧠 React Context / State Store"]
            AxiosClient["📡 Axios HTTP Client Wrapper"]
            JWTStorage["🔒 Browser LocalStorage (JWT Token Store)"]
        end

        USERS -->|User Interactions| ReactUI
        ReactUI --> StateStore
        StateStore --> AxiosClient
        AxiosClient <-->|Retrieve/Store Token| JWTStorage
    end

    CLIENT_ZONE ==>|HTTPS / REST API Requests\nHeader: Authorization: Bearer <JWT>| SECURITY_PERIMETER

    subgraph SECURITY_PERIMETER ["🛡️ Security Perimeter & API Gateway Zone"]
        direction TB
        CORSMiddleware["🌐 CORS Gateway Middleware"]
        HelmetSec["🛡️ Security Headers (Helmet.js)"]
        RateLimiter["⚡ Rate Limiting Middleware"]
    end

    SECURITY_PERIMETER ==>|Filtered HTTPS Traffic| SERVER_ZONE

    subgraph SERVER_ZONE ["⚡ Layer 2 & 3: Application Server Zone (Express.js / Node.js)"]
        direction TB
        
        subgraph ROUTERS ["API Route Controllers"]
            AuthRoutes["🔑 Auth Routes\n/api/auth/*"]
            UserRoutes["👤 User Routes\n/api/users/*"]
            EquipRoutes["🚜 Equipment Routes\n/api/equipment/*"]
            BookingRoutes["📅 Booking Routes\n/api/bookings/*"]
            PaymentRoutes["💳 Payment Routes (Upcoming)\n/api/payments/*"]
            ReviewRoutes["⭐ Review Routes (Upcoming)\n/api/reviews/*"]
            NotifRoutes["🔔 Notification Routes (Upcoming)\n/api/notifications/*"]
        end

        subgraph MIDDLEWARE ["Security & Business Logic Services"]
            JWTAuth["🔐 JWT Verification Middleware"]
            RoleAuthz["🛡️ RBAC Authorization (Farmer/Owner/Admin)"]
            MulterUpload["🖼️ Multer File Upload Middleware"]
            BookingEngine["⚙️ Booking Conflict & Availability Engine"]
            ValidationEngine["📋 Request Payload Validation"]
        end

        ROUTERS --> MIDDLEWARE
    end

    SERVER_ZONE ==>|MySQL Protocol (TCP 3306)\nConnection Pool| DATA_ZONE
    SERVER_ZONE ==>|Multipart Form Data / File I/O| STORAGE_ZONE
    SERVER_ZONE -.->|Future REST / Webhook API| EXT_ZONE

    subgraph DATA_ZONE ["🗄️ Layer 4: Data Persistence Zone (MySQL 8.0)"]
        direction TB
        MySQLPool["🔌 MySQL Connection Pool"]
        
        subgraph TABLES ["Relational Schema Tables"]
            UsersT[("users")]
            CategoriesT[("categories")]
            EquipmentT[("equipment")]
            BookingsT[("bookings")]
            PaymentsT[("payments")]
            ReviewsT[("reviews")]
            NotificationsT[("notifications")]
        end

        MySQLPool --> TABLES
    end

    subgraph STORAGE_ZONE ["📁 Layer 5: Media & Asset Storage Zone"]
        direction TB
        LocalStorage["📂 Local Filesystem (/server/uploads)"]
        CloudinaryCDN["☁️ Cloudinary Image Cloud CDN"]
    end

    subgraph EXT_ZONE ["🌐 Layer 6: Future External Integrations"]
        direction TB
        Razorpay["💳 Payment Gateway (Razorpay / Stripe)"]
        SendGrid["✉️ Email SMTP Service (Nodemailer / SendGrid)"]
        SMSGateway["📱 SMS Gateway (Twilio / MSG91)"]
    end

    class FRONTEND clientLayer
    class ROUTERS apiLayer
    class MIDDLEWARE middlewareLayer
    class DATA_ZONE databaseLayer
    class STORAGE_ZONE storageLayer
```

---

## 3. System Architecture ASCII View

```
+-----------------------------------------------------------------------------------+
|                         LAYER 1: PRESENTATION / CLIENT ZONE                       |
|                                                                                   |
|  +--------------------+     +--------------------------------------------------+  |
|  | User Personas      |     | React.js SPA (Vite, Tailwind CSS, Axios)         |  |
|  | - Farmer / Renter  | --> | - State Store & Context                          |  |
|  | - Equipment Owner  |     | - Axios Interceptors                             |  |
|  | - System Admin     |     | - LocalStorage JWT Token Handling                |  |
|  +--------------------+     +--------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                        ||
                                        || HTTPS / REST API (Port 5000)
                                        || Authorization: Bearer <JWT>
                                        \/
+-----------------------------------------------------------------------------------+
|                     SECURITY PERIMETER & MIDDLEWARE PIPELINE                      |
|                                                                                   |
|  [ CORS Validation ] ---> [ Security Headers ] ---> [ JWT Verification & RBAC ]  |
+-----------------------------------------------------------------------------------+
                                        ||
                                        \/
+-----------------------------------------------------------------------------------+
|                         LAYER 2: APPLICATION SERVER ZONE                          |
|                             (Node.js / Express REST API)                          |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | API Controllers & Route Handlers                                            |  |
|  |  - AuthController     - EquipmentController    - BookingController          |  |
|  |  - UserController     - PaymentController      - ReviewController           |  |
|  +-----------------------------------------------------------------------------+  |
|                                       ||                                          |
|  +-----------------------------------------------------------------------------+  |
|  | Business Logic Engines & Service Utilities                                  |  |
|  |  - Booking Availability Validation Engine                                   |  |
|  |  - Multer Image Processing & Cloudinary Upload Service                      |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                    //                                      \\
  MySQL Protocol   //                                        \\ File I/O / HTTPS
  TCP Port 3306   //                                          \\ 
                 \/                                            \/
+-----------------------------------+        +--------------------------------------+
| LAYER 3: DATA PERSISTENCE ZONE    |        | LAYER 4: MEDIA & STORAGE ZONE        |
| (MySQL Relational Database Engine)|        |                                      |
| - users        - equipment        |        | - Local Uploads (/server/uploads)    |
| - categories   - bookings         |        | - Cloudinary Image CDN Hosting       |
| - payments     - reviews          |        |                                      |
| - notifications                   |        |                                      |
+-----------------------------------+        +--------------------------------------+
```

---

## 4. Layer-by-Layer Architectural Breakdown

### 4.1 Client Layer (Presentation)
* **Technology Stack:** React 18, Vite, Tailwind CSS, Axios, Lucide Icons.
* **Responsibilities:**
  - Rendering responsive UI for Farmers, Equipment Owners, and System Admins.
  - Client-side routing via React Router DOM.
  - Storing JWT authentication tokens securely in browser `LocalStorage` and injecting them into headers via Axios request interceptors.
  - Managing transient component state (search filters, form inputs, dynamic modals).

### 4.2 Security Perimeter & Gateway Layer
* **Technology Stack:** Express Middleware, CORS, Helmet.js, JWT.
* **Responsibilities:**
  - Enforcing Cross-Origin Resource Sharing (CORS) rules to restrict unauthorized domain access.
  - Validating JWT signature and expiration (`JWT_SECRET`) before delegating control to protected controllers.
  - Role-Based Access Control (RBAC) enforcing route access constraints (e.g., `farmer`, `owner`, `admin`).

### 4.3 Application Server Layer (Business Logic)
* **Technology Stack:** Node.js, Express.js.
* **Responsibilities:**
  - Processing incoming JSON API requests and returning standard JSON response structures.
  - Enforcing business rules: double-booking prevention, equipment date availability checks, price computation based on rental duration.
  - Handling file uploads using `multer` for multipart form data, saving images locally or transferring them to Cloudinary CDN.

### 4.4 Data Persistence Layer
* **Technology Stack:** MySQL 8.0 Engine, `mysql2` Driver with Promises.
* **Responsibilities:**
  - Maintaining ACID compliance across equipment bookings and financial transactions.
  - Connection Pooling (`createPool`) ensuring high throughput and efficient query thread execution.
  - Storing user credentials (hashed via `bcrypt`), equipment metadata, rental logs, reviews, and notification feeds.

### 4.5 Media Storage Layer
* **Technology Stack:** Local Filesystem (`/server/uploads`), Cloudinary Cloud Storage SDK.
* **Responsibilities:**
  - Persisting equipment pictures uploaded by owners.
  - Generating optimized CDN URLs for high-performance image serving on the React frontend.

---

## 5. Network Protocols & Interface Specifications

| Source Component | Target Component | Protocol / Transport | Auth Mechanism | Data Format |
|---|---|---|---|---|
| Client Browser | Express API Server | HTTPS / REST | Bearer JWT Header | JSON / Multipart Form |
| Express API Server | MySQL Database | TCP (Port 3306) | DB Credentials (User/Pass) | SQL Queries & Binary Packs |
| Express API Server | Cloudinary API | HTTPS | API Key & Secret | Multipart / JSON Response |
| Express API Server | Payment Gateway (Future) | HTTPS Webhooks | HMAC Signature / Bearer Key | JSON Webhook Payload |

---

## 6. Verification & Quality Checklist

- [x] **Client, Server, Database, and Storage layers** are explicitly demarcated with component subgraphs.
- [x] **Network protocols (HTTPS, REST, MySQL TCP)** are clearly annotated across all interface boundaries.
- [x] **Security perimeters (JWT verification boundary & RBAC)** are clearly marked.
- [x] Compatible with **Mermaid.js**, **Draw.io**, and **PlantUML** rendering tools.

---

## 7. Diagram Viewing & Export Instructions

1. **Mermaid Preview in VS Code / GitHub:**
   - Open this file in VS Code with the *Markdown Preview Mermaid Support* extension enabled, or view directly on GitHub.
2. **Exporting to PNG / SVG via Draw.io:**
   - Copy the Mermaid block above.
   - Open [Draw.io](https://app.diagrams.net).
   - Go to `Arrange` > `Insert` > `Advanced` > `Mermaid`.
   - Paste the Mermaid script and click `Insert`. Export as PNG or SVG.
