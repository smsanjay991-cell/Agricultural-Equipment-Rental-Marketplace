# Agricultural Equipment Rental Marketplace
## Professional Architecture, Database Schema, Class & Directory Specifications

> **Capstone Project Documentation Suite**  
> All diagrams are generated in high-resolution PNG format, SVG vector format, and Mermaid code format.

---

### 1. System Architecture Diagram

![System Architecture Diagram](file:///c:/Users/sanja/OneDrive/Desktop/AgriRent/docs/diagrams/architecture.png)

```mermaid
graph TD
    subgraph Client Tier
        UI["React SPA (React.js + Vanilla CSS)"]
        Router["React Router v6"]
        Axios["Axios Client + JWT Interceptors"]
    end

    subgraph API Gateway / Security Layer
        CORS["CORS Configuration"]
        AuthMW["JWT Authentication Middleware"]
        RoleMW["Role-Based Access Control (RBAC)"]
        MulterMW["Multer Image Upload Middleware"]
    end

    subgraph Controller Layer
        AuthCtrl["AuthController"]
        EquipCtrl["EquipmentController"]
        BookingCtrl["BookingController"]
        PaymentCtrl["PaymentController"]
        NotifCtrl["NotificationController"]
        ReviewCtrl["ReviewController"]
    end

    subgraph Service Layer / Business Logic
        AuthSvc["AuthService / bcrypt"]
        EquipSvc["EquipmentService / Search"]
        BookingSvc["BookingService / Conflict Engine"]
        PaymentSvc["PaymentService / Gateways"]
        NotifSvc["NotificationService / Email"]
        ReviewSvc["ReviewService / Rating Calculator"]
    end

    subgraph Data Access Layer (Models)
        UserRepo["UserModel"]
        CatRepo["CategoryModel"]
        EquipRepo["EquipmentModel"]
        BookingRepo["BookingModel"]
        PaymentRepo["PaymentModel"]
        NotifRepo["NotificationModel"]
        ReviewRepo["ReviewModel"]
    end

    subgraph Database Tier & Storage
        DB[("MySQL Database")]
        Storage["Local File Storage (uploads/)"]
    end

    UI --> Router
    Router --> Axios
    Axios -->|HTTP Requests / Bearer JWT| CORS
    CORS --> AuthMW
    AuthMW --> RoleMW
    RoleMW --> MulterMW
    MulterMW --> AuthCtrl & EquipCtrl & BookingCtrl & PaymentCtrl & NotifCtrl & ReviewCtrl

    AuthCtrl --> AuthSvc
    EquipCtrl --> EquipSvc
    BookingCtrl --> BookingSvc
    PaymentCtrl --> PaymentSvc
    NotifCtrl --> NotifSvc
    ReviewCtrl --> ReviewSvc

    AuthSvc --> UserRepo
    EquipSvc --> EquipRepo & CatRepo
    BookingSvc --> BookingRepo & EquipRepo
    PaymentSvc --> PaymentRepo & BookingRepo
    NotifSvc --> NotifRepo & UserRepo
    ReviewSvc --> ReviewRepo & EquipRepo

    UserRepo --> DB
    CatRepo --> DB
    EquipRepo --> DB
    BookingRepo --> DB
    PaymentRepo --> DB
    NotifRepo --> DB
    ReviewRepo --> DB
    EquipSvc --> Storage
```

---

### 2. Database Schema Diagram (ERD)

![Database Schema Diagram](file:///c:/Users/sanja/OneDrive/Desktop/AgriRent/docs/diagrams/database_schema.png)

```mermaid
erDiagram
    USERS ||--o{ EQUIPMENT : "owns"
    USERS ||--o{ BOOKINGS : "makes as farmer"
    USERS ||--o{ PAYMENTS : "initiates"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ REVIEWS : "writes"

    CATEGORIES ||--o{ EQUIPMENT : "classifies"

    EQUIPMENT ||--o{ BOOKINGS : "reserved in"
    EQUIPMENT ||--o{ REVIEWS : "receives"

    BOOKINGS ||--o{ PAYMENTS : "generates"
    BOOKINGS ||--o{ REVIEWS : "reviewed via"

    USERS {
        int id PK
        string name
        string email UK
        string password
        string phone
        string role
        string location
        string avatar
        timestamp created_at
    }

    CATEGORIES {
        int id PK
        string name UK
        string image
        text description
    }

    EQUIPMENT {
        int id PK
        int owner_id FK
        int category_id FK
        string name
        string brand
        string model
        decimal daily_rent
        decimal deposit
        boolean is_available
        string location
        string image
        decimal average_rating
        int num_reviews
    }

    BOOKINGS {
        int id PK
        int equipment_id FK
        int farmer_id FK
        int owner_id FK
        date start_date
        date end_date
        int total_days
        decimal daily_rent
        boolean include_driver
        decimal driver_cost
        decimal total_amount
        decimal deposit_amount
        string booking_status
        string payment_status
        timestamp created_at
    }

    PAYMENTS {
        int id PK
        int booking_id FK
        int farmer_id FK
        decimal amount
        string payment_status
        string payment_method
        string transaction_id
        timestamp created_at
    }

    NOTIFICATIONS {
        int id PK
        int user_id FK
        string title
        text message
        boolean is_read
        timestamp created_at
    }

    REVIEWS {
        int id PK
        int equipment_id FK
        int farmer_id FK
        int booking_id FK
        int rating
        text comment
        timestamp created_at
    }
```

---

### 3. Class Diagram

![Class Diagram](file:///c:/Users/sanja/OneDrive/Desktop/AgriRent/docs/diagrams/class_diagram.png)

```mermaid
classDiagram
    class User {
        +Long id
        +String name
        +String email
        +String password
        +String phone
        +UserRole role
        +String location
        +String avatar
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }

    class Category {
        +Long id
        +String name
        +String image
        +String description
        +LocalDateTime createdAt
    }

    class Equipment {
        +Long id
        +Long ownerId
        +Long categoryId
        +String name
        +String brand
        +String model
        +Double dailyRent
        +Double deposit
        +Boolean availability
        +Double dailyRate
        +String location
        +String image
        +Integer horsepower
        +String fuelType
        +Boolean isDriverAvailable
        +Double driverRatePerDay
        +Boolean isAvailable
        +List~String~ images
        +Double averageRating
        +Integer numReviews
        +User owner
        +Category category
    }

    class Booking {
        +Long id
        +Long equipmentId
        +Long farmerId
        +Long ownerId
        +LocalDate startDate
        +LocalDate endDate
        +Integer totalDays
        +Double dailyRent
        +Boolean includeDriver
        +Double driverCost
        +Double totalAmount
        +Double depositAmount
        +BookingStatus bookingStatus
        +PaymentStatus paymentStatus
        +String remarks
        +Equipment equipment
        +User farmer
        +User owner
    }

    class Payment {
        +Long id
        +Long bookingId
        +Long farmerId
        +Double amount
        +PaymentStatus paymentStatus
        +String paymentMethod
        +String transactionId
        +Booking booking
        +User farmer
    }

    class Notification {
        +Long id
        +Long userId
        +String title
        +String message
        +Boolean isRead
        +LocalDateTime createdAt
        +User user
    }

    class Review {
        +Long id
        +Long equipmentId
        +Long farmerId
        +Long bookingId
        +Integer rating
        +String comment
        +LocalDateTime createdAt
        +User farmer
        +Equipment equipment
        +Booking booking
    }

    class UserRole {
        <<enumeration>>
        FARMER
        EQUIPMENT_OWNER
        ADMIN
    }

    class BookingStatus {
        <<enumeration>>
        PENDING
        APPROVED
        REJECTED
        CANCELLED
        COMPLETED
    }

    class PaymentStatus {
        <<enumeration>>
        PENDING
        COMPLETED
        FAILED
        REFUNDED
    }

    User "1" -- "*" Equipment : owns
    User "1" -- "*" Booking : requests
    User "1" -- "*" Payment : pays
    User "1" -- "*" Notification : receives
    User "1" -- "*" Review : writes
    Category "1" -- "*" Equipment : categorizes
    Equipment "1" -- "*" Booking : reserved in
    Equipment "1" -- "*" Review : rated in
    Booking "1" -- "0..1" Payment : has
    Booking "1" -- "0..1" Review : generates
    User --> UserRole
    Booking --> BookingStatus
    Booking --> PaymentStatus
    Payment --> PaymentStatus
```

---

### 4. Workspace Directory Structure

![Directory Structure](file:///c:/Users/sanja/OneDrive/Desktop/AgriRent/docs/diagrams/directory_structure.png)

```text
AgriRent/
├── client/                     # Frontend React.js Single Page Application
│   ├── src/
│   │   ├── components/         # Reusable UI Components (Navbar, Footer, Equipment Card)
│   │   ├── pages/              # Views (Home, Login, Register, Catalog, Dashboard)
│   │   ├── routes/             # App Navigation & Protected Route Wrappers
│   │   ├── services/           # Axios HTTP Client & API Service calls
│   │   ├── context/            # Global Auth Context State Management
│   │   ├── layouts/            # Page Container Layouts
│   │   ├── App.jsx             # Main React Router component
│   │   └── main.jsx            # Application Entrypoint
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Node.js & Express.js REST API
│   ├── config/                 # Database configuration (MySQL Pool)
│   ├── controllers/            # Request handlers (authController, equipmentController, bookingController)
│   ├── middleware/             # Express Middlewares (JWT Authentication, Multer Uploads)
│   ├── models/                 # MySQL Data Access Models (User, Category, Equipment, Booking)
│   ├── routes/                 # Express API Endpoint Routers
│   ├── validations/            # Request Body Sanitization & Validation Schemas
│   ├── uploads/                # Static Media File Storage
│   │   ├── equipment/          # Equipment Photo Storage
│   │   └── users/              # User Profile Avatar Storage
│   ├── app.js                  # Express Application Pipeline Configuration
│   ├── server.js               # HTTP Server Initialization
│   └── package.json
│
└── docs/                       # Project Technical Documentation & Architecture Artifacts
    ├── diagrams/               # High-Resolution Diagram Visuals & HTML/SVG Sources
    │   ├── architecture.png
    │   ├── database_schema.png
    │   ├── class_diagram.png
    │   └── directory_structure.png
    └── architecture/
        └── system_architecture.md
```
