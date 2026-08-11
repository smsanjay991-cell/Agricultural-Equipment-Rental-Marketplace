# AGRIRENT: SYSTEM MODULE & CLASS DIAGRAM SPECIFICATION
**Project Title:** Agricultural Equipment Rental Marketplace  
**Capstone Stage:** Capstone Review-I (Day 11)  
**Target File Path:** `docs/diagrams/module-diagram.md`  

---

## 1. LAYERED MODULE & ARCHITECTURE DIAGRAM

```mermaid
graph TD
    subgraph Layer1 ["1. USER / PRESENTATION LAYER"]
        User_Farmer["🌾 Farmer Renter"]
        User_Owner["🚜 Equipment Owner"]
        User_Admin["🛡️ System Admin"]
    end

    subgraph Layer2 ["2. FRONTEND MODULES TIER (React.js + Vite)"]
        FE_Auth["Authentication Module
        (Login, Register, Profile, AuthContext)"]
        FE_Equipment["Equipment Catalog & Management Module
        (Equipment, EquipmentDetails, EquipmentForm, SearchBar, EquipmentCard)"]
        FE_Booking["Booking & Reservation Module
        (Booking, FarmerDashboard, OwnerDashboard, AdminDashboard)"]
        FE_Category["Category Component (CategoryCard)"]
        FE_Layouts["Layouts & Guards (AppRoutes, ProtectedRoute, MainLayout, DashboardLayout)"]
        
        FE_Payment["Payment Module (PLANNED / FUTURE)"]:::future
        FE_Review["Review Module (PARTIAL / FUTURE)"]:::future
        FE_Notif["Notification Module (PLANNED / FUTURE)"]:::future
    end

    subgraph Layer3 ["3. CLIENT SERVICE / API LAYER"]
        Service_API["API Client Gateway (api.js - fetchWithAuth)"]
        Service_Auth["authService.js & userService.js"]
        Service_Equip["equipmentService.js"]
        Service_Book["bookingService.js"]
    end

    subgraph Layer4 ["4. BACKEND ROUTING & MIDDLEWARE TIER (Express.js)"]
        MW_Auth["authMiddleware.js (protect, authorizeRoles)"]
        MW_Upload["uploadMiddleware.js (Multer Image Storage)"]
        MW_Error["errorMiddleware.js (notFound, errorHandler)"]
        
        Route_Auth["authRoutes.js & userRoutes.js"]
        Route_Equip["equipmentRoutes.js"]
        Route_Book["bookingRoutes.js"]
    end

    subgraph Layer5 ["5. CONTROLLERS & BUSINESS LOGIC TIER"]
        Ctrl_Auth["authController.js & userController.js"]
        Ctrl_Equip["equipmentController.js"]
        Ctrl_Book["bookingController.js"]
        
        Domain_BookingService["bookingService.js (calculateBookingCost, hasBookingConflict)"]
        Domain_Validator["validator.js (validateDateRange)"]
    end

    subgraph Layer6 ["6. DOMAIN MODELS TIER"]
        Model_User["UserModel (User.js)"]
        Model_Equip["EquipmentModel (Equipment.js)"]
        Model_Cat["CategoryModel (Category.js)"]
        Model_Book["BookingModel (Booking.js)"]
        
        Model_Pay["PaymentModel (Payment.js - PLANNED)"]:::future
        Model_Rev["ReviewModel (Review.js - PARTIAL)"]:::future
        Model_Notif["NotificationModel (Notification.js - PLANNED)"]:::future
    end

    subgraph Layer7 ["7. DATABASE PERSISTENCE TIER (MySQL 8 RDBMS)"]
        DB_Users[("users table (Active)")]
        DB_Equip[("equipment table (Active)")]
        DB_Cat[("categories table (Active)")]
        DB_Book[("bookings table (Active)")]
        
        DB_Pay[("payments table (PLANNED / FUTURE)")]:::future
        DB_Rev[("reviews table (PARTIAL / FUTURE)")]:::future
        DB_Notif[("notifications table (PLANNED / FUTURE)")]:::future
    end

    classDef future fill:#f3f4f6,stroke:#9ca3af,stroke-dasharray: 5 5,color:#6b7280;

    %% User to Frontend Connections
    User_Farmer --> FE_Auth
    User_Farmer --> FE_Equipment
    User_Farmer --> FE_Booking
    User_Owner --> FE_Auth
    User_Owner --> FE_Equipment
    User_Owner --> FE_Booking
    User_Admin --> FE_Auth
    User_Admin --> FE_Booking

    %% Frontend to Service Layer
    FE_Auth --> Service_Auth
    FE_Equipment --> Service_Equip
    FE_Booking --> Service_Book
    FE_Layouts --> Service_API
    Service_Auth --> Service_API
    Service_Equip --> Service_API
    Service_Book --> Service_API

    %% Service Layer to Backend Routes
    Service_API --> MW_Auth
    MW_Auth --> Route_Auth
    MW_Auth --> Route_Equip
    MW_Auth --> Route_Book

    %% Middleware Interceptors
    MW_Upload --> Route_Equip

    %% Backend Routes to Controllers
    Route_Auth --> Ctrl_Auth
    Route_Equip --> Ctrl_Equip
    Route_Book --> Ctrl_Book

    %% Controllers to Domain Logic & Models
    Ctrl_Auth --> Model_User
    Ctrl_Equip --> Model_Equip
    Ctrl_Equip --> Model_Cat
    Ctrl_Book --> Domain_BookingService
    Ctrl_Book --> Domain_Validator
    Domain_BookingService --> Model_Book
    Ctrl_Book --> Model_Book

    %% Models to Database Tables
    Model_User --> DB_Users
    Model_Equip --> DB_Equip
    Model_Cat --> DB_Cat
    Model_Book --> DB_Book
    
    Model_Pay -.-> DB_Pay
    Model_Rev -.-> DB_Rev
    Model_Notif -.-> DB_Notif
```

---

## 2. CLASS & MODULE INTERACTION CATALOG

### 2.1 Active Core Modules (Review-I Verified)

#### 1. Authentication & User Management
- **Frontend Components**: `Login.jsx`, `Register.jsx`, `Profile.jsx`, `AuthContext.jsx` (`AuthProvider`, `useAuth`), `authService.js`, `userService.js`
- **Backend Infrastructure**: `authRoutes.js`, `userRoutes.js`, `authController.js`, `userController.js`
- **Model**: `UserModel` (`User.js` - `findByEmail`, `findById`, `create`, `updateProfile`, `getAll`, `matchPassword`)
- **Middleware Guard**: `authMiddleware.js` (`protect` - JWT token validation)
- **Database Entity**: `users`

#### 2. Equipment Management
- **Frontend Components**: `Equipment.jsx`, `EquipmentDetails.jsx`, `EquipmentForm.jsx`, `EquipmentCard.jsx`, `SearchBar.jsx`, `equipmentService.js`
- **Backend Infrastructure**: `equipmentRoutes.js`, `equipmentController.js`
- **Model**: `EquipmentModel` (`Equipment.js` - `findAll`, `findById`, `findByOwner`, `create`, `update`, `delete`)
- **Middleware Guards**: `authMiddleware.js` (`protect`, `authorizeRoles('owner', 'admin')`), `uploadMiddleware.js` (Multer disk storage)
- **Database Entities**: `equipment`, `categories`

#### 3. Booking & Reservation Management
- **Frontend Components**: `Booking.jsx`, `FarmerDashboard.jsx`, `OwnerDashboard.jsx`, `AdminDashboard.jsx`, `bookingService.js`
- **Backend Infrastructure**: `bookingRoutes.js`, `bookingController.js`
- **Business Logic Services**: `services/bookingService.js` (`calculateBookingCost`, `hasBookingConflict`), `utils/validator.js` (`validateDateRange`)
- **Model**: `BookingModel` (`Booking.js` - `create`, `findAll`, `findById`, `findByFarmer`, `findByOwner`, `updateStatus`, `cancelBooking`, `delete`)
- **Middleware Guard**: `authMiddleware.js` (`protect`, `authorizeRoles`)
- **Database Entity**: `bookings`

#### 4. Category & Classification
- **Frontend Component**: `CategoryCard.jsx`
- **Backend Integration**: Integrated equipment filter logic
- **Model**: `CategoryModel` (`Category.js` - `getAll`, `create`)
- **Database Entity**: `categories`

#### 5. Core Infrastructure & Security
- **Frontend Components**: `AppRoutes.jsx` (`ProtectedRoute`), `api.js` (`fetchWithAuth`, `getImageUrl`), `MainLayout.jsx`, `DashboardLayout.jsx`
- **Backend Middleware**: `authMiddleware.js`, `uploadMiddleware.js`, `errorMiddleware.js`, `db.js` (mysql2 pool)
- **Entry Points**: `app.js` / `server.js`

---

### 2.2 Future / Planned Modules (Explicitly Labelled)

| Module Name | Status | Components / Files | Planned Functionality |
| :--- | :---: | :--- | :--- |
| **Payment Module** | **PLANNED / FUTURE** | `Payment.js` model (`payments` table) | Stripe / Razorpay escrow gateway webhooks & automated invoices |
| **Review & Rating Module** | **PARTIAL / FUTURE** | `Review.js` model (`reviews` table), rendered on `EquipmentDetails.jsx` | Post-rental rating submission & feedback submission form |
| **Notification Module** | **PLANNED / FUTURE** | `Notification.js` model (`notifications` table) | In-app notification drawer & automated email alert dispatch |

---

## 3. CLASS DIRECTORY & RELATIONSHIP MATRIX

```mermaid
classDiagram
    class AuthContext {
        +User user
        +login(email, password)
        +register(userData)
        +logout()
        +switchDemoRole(role)
    }

    class AppRoutes {
        +ProtectedRoute(children)
        +Routes()
    }

    class UserModel {
        +findByEmail(email)
        +findById(id)
        +create(data)
        +updateProfile(id, data)
        +matchPassword(entered, hashed)
    }

    class EquipmentModel {
        +findAll(filters)
        +findById(id)
        +findByOwner(ownerId)
        +create(data)
        +update(id, data)
        +delete(id)
    }

    class BookingModel {
        +create(data)
        +findAll(filters)
        +findById(id)
        +findByFarmer(farmerId)
        +findByOwner(ownerId)
        +updateStatus(id, status)
        +cancelBooking(id, userId)
    }

    class CategoryModel {
        +getAll()
        +create(name, description)
    }

    class AuthMiddleware {
        +protect(req, res, next)
        +authorizeRoles(...roles)
    }

    class UploadMiddleware {
        +uploadSingleImage(field)
    }

    class BookingDomainService {
        +calculateBookingCost(params)
        +hasBookingConflict(equipmentId, start, end)
    }

    AppRoutes ..> AuthContext : uses
    AuthMiddleware ..> AppRoutes : guards routes
    UploadMiddleware ..> EquipmentModel : processes images
    BookingDomainService ..> BookingModel : validates & calculates
    
    UserModel "1" -- "*" EquipmentModel : owns
    CategoryModel "1" -- "*" EquipmentModel : classifies
    EquipmentModel "1" -- "*" BookingModel : reserved_in
    UserModel "1" -- "*" BookingModel : creates/manages
```
