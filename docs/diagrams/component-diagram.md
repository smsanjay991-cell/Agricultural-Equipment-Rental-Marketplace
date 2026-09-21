# Component Diagram

## Overview

The Component diagram illustrates the structural organization of the **AgriRent** software system. It shows how the modular frontend user interfaces, backend Spring Boot controllers, security filters, services, JPA repositories, and the relational MySQL database interact.

---

## Mermaid Component Diagram

```mermaid
graph TD
    subgraph ClientComponent [React Frontend Application]
        AuthUI[Authentication UI<br/>Login / Register]
        FarmerUI[Farmer UI<br/>Catalog, Details, Booking Form]
        OwnerUI[Owner UI<br/>Add Equipment, Manage Requests]
        AdminUI[Admin UI<br/>User, Category & System Monitor]
        AuthCtx[Auth Context & Services<br/>JWT Storage & Axios Calls]

        AuthUI --> AuthCtx
        FarmerUI --> AuthCtx
        OwnerUI --> AuthCtx
        AdminUI --> AuthCtx
    end

    subgraph ServerComponent [Spring Boot Backend Engine]
        API_Route[Spring REST Controllers<br/>/api/auth, /api/equipment, /api/bookings, /api/users, etc.]
        Auth_MW[Spring Security Filter<br/>JwtAuthenticationFilter & PreAuthorize]
        
        subgraph Services [Services Tier]
            AuthSvc[AuthService]
            EquipSvc[EquipmentService]
            BookSvc[BookingService]
            UserSvc[UserService]
            PaySvc[PaymentService]
            RevSvc[ReviewService]
            NotifSvc[NotificationService]
            CatSvc[CategoryService]
        end

        subgraph Repositories [JPA Repositories Tier]
            UserRepo[UserRepository]
            EquipRepo[EquipmentRepository]
            BookRepo[BookingRepository]
            PayRepo[PaymentRepository]
            RevRepo[ReviewRepository]
            NotifRepo[NotificationRepository]
            CatRepo[CategoryRepository]
        end
    end

    subgraph DatabaseComponent [Database Storage Tier]
        MySQL[(MySQL 8 Database<br/>HikariCP Connection Pool)]
    end

    %% Interactions
    AuthCtx -->|HTTPS / JSON Calls| API_Route
    API_Route --> Auth_MW
    Auth_MW --> Services
    
    AuthSvc --> UserRepo
    EquipSvc --> EquipRepo
    EquipSvc --> CatRepo
    BookSvc --> BookRepo
    BookSvc --> NotifRepo
    BookSvc --> PayRepo
    BookSvc --> EquipRepo
    UserSvc --> UserRepo
    PaySvc --> PayRepo
    RevSvc --> RevRepo

    UserRepo -->|JPA / Hibernate query| MySQL
    EquipRepo -->|JPA / Hibernate query| MySQL
    BookRepo -->|JPA / Hibernate query| MySQL
    PayRepo -->|JPA / Hibernate query| MySQL
    RevRepo -->|JPA / Hibernate query| MySQL
    NotifRepo -->|JPA / Hibernate query| MySQL
    CatRepo -->|JPA / Hibernate query| MySQL
```

---

## Component Roles & Interactions

### 1. Frontend Components (`client/src/`)
- **Authentication UI (`Login.jsx`, `Register.jsx`):** Captures user credentials and dispatches auth requests.
- **Farmer UI (`Equipment.jsx`, `EquipmentDetails.jsx`, `Booking.jsx`, `FarmerDashboard.jsx`):** Enables farmers to browse machinery, view pricing/driver rates, submit rental requests, and view booking status.
- **Owner UI (`EquipmentForm.jsx`, `OwnerDashboard.jsx`):** Allows owners to list new equipment, update specifications, and approve or reject incoming rental requests.
- **Admin UI (`AdminDashboard.jsx`):** Provides system oversight for managing platform categories, monitoring users, and viewing all platform bookings.
- **Auth Context (`AuthContext.jsx`):** Encapsulates JWT storage in local memory and attaches authorization headers to outgoing API calls.

### 2. Backend Server Components (`server/springboot-backend/`)
- **Spring REST Controllers (`com.agrirent.controller`):** Map incoming REST request endpoints to service calls.
- **Spring Security Filter (`com.agrirent.security`):** Intercepts requests to verify JWT signature and check user roles via `JwtAuthenticationFilter`.
- **Services (`com.agrirent.service`):** Execute business logic, compute prices, handle driver costs, and validate input parameters.
- **JPA Repositories (`com.agrirent.repository`):** Standard Spring Data JPA interfaces for database operations (`save`, `findById`, `findAll`, `deleteById`).

### 3. Database Components (`agrirent` MySQL DB)
- **HikariCP Connection Pool:** Manages high-performance persistent connections to MySQL 8 on port 3306.
