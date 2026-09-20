# Component Diagram

## Overview

The Component diagram illustrates the structural organization of the **AgriRent** software system. It shows how the modular frontend user interfaces, backend API services/controllers, security middleware, data models, and the relational MySQL database interact.

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

    subgraph ServerComponent [Node.js + Express Backend Engine]
        API_Route[Express REST Routers<br/>/api/auth, /api/equipment, /api/bookings, /api/users]
        Auth_MW[Auth Middleware<br/>protect & authorizeRoles]
        
        subgraph Controllers [Controllers Tier]
            AuthCtrl[authController]
            EquipCtrl[equipmentController]
            BookCtrl[bookingController]
            UserCtrl[userController]
        end

        subgraph Models [Models Tier]
            UserMdl[User Model]
            EquipMdl[Equipment Model]
            BookMdl[Booking Model]
            PayMdl[Payment Model]
            RevMdl[Review Model]
            NotifMdl[Notification Model]
            CatMdl[Category Model]
        end
    end

    subgraph DatabaseComponent [Database Storage Tier]
        MySQL[(MySQL 8 Database<br/>agrirent Connection Pool)]
    end

    %% Interactions
    AuthCtx -->|HTTPS / JSON Calls| API_Route
    API_Route --> Auth_MW
    Auth_MW --> Controllers
    
    AuthCtrl --> UserMdl
    EquipCtrl --> EquipMdl
    EquipCtrl --> CatMdl
    BookCtrl --> BookMdl
    BookCtrl --> NotifMdl
    BookCtrl --> PayMdl
    BookCtrl --> EquipMdl
    UserCtrl --> UserMdl

    UserMdl -->|mysql2 pool query| MySQL
    EquipMdl -->|mysql2 pool query| MySQL
    BookMdl -->|mysql2 pool query| MySQL
    PayMdl -->|mysql2 pool query| MySQL
    RevMdl -->|mysql2 pool query| MySQL
    NotifMdl -->|mysql2 pool query| MySQL
    CatMdl -->|mysql2 pool query| MySQL
```

---

## Component Roles & Interactions

### 1. Frontend Components (`client/src/`)
- **Authentication UI (`Login.jsx`, `Register.jsx`):** Captures user credentials and dispatches auth requests.
- **Farmer UI (`Equipment.jsx`, `EquipmentDetails.jsx`, `Booking.jsx`, `FarmerDashboard.jsx`):** Enables farmers to browse machinery, view pricing/driver rates, submit rental requests, and view booking status.
- **Owner UI (`EquipmentForm.jsx`, `OwnerDashboard.jsx`):** Allows owners to list new equipment, update specifications, and approve or reject incoming rental requests.
- **Admin UI (`AdminDashboard.jsx`):** Provides system oversight for managing platform categories, monitoring users, and viewing all platform bookings.
- **Auth Context (`AuthContext.jsx`):** Encapsulates JWT storage in local memory and attaches authorization headers to outgoing API calls.

### 2. Backend Server Components (`server/`)
- **Express REST Routers (`server/routes/`):** Route incoming request paths to their corresponding controller methods.
- **Auth Middleware (`authMiddleware.js`):** Intercepts requests to verify JWT signature and check user roles.
- **Controllers (`server/controllers/`):** Execute business logic, compute prices, and validate input parameters.
- **Models (`server/models/`):** Abstract MySQL queries into JavaScript methods (`find`, `create`, `update`, `delete`).

### 3. Database Components (`agrirent` MySQL DB)
- **`mysql2` Connection Pool:** Manages persistent pool connections to MySQL 8 on port 3306 for optimal performance.
