# System Architecture

## Overview

The **AgriRent** system is built using a classic 3-tier architecture: Presentation Tier (React.js), Application/API Tier (Spring Boot + Java 17), and Data Tier (MySQL 8). The architecture provides separation of concerns, role-based security, and efficient interaction between farmers, equipment owners, and system administrators.

---

## System Architecture Diagram

```mermaid
graph TD
    Users[Users / Browsers<br/>Farmer | Owner | Admin] -->|HTTP / JSON Requests| Frontend[React.js Frontend<br/>React Router & Context API]
    Frontend -->|REST API Calls<br/>Bearer JWT Headers| API Gateway[REST API / Spring Boot Controllers]
    
    subgraph Backend [Java 17 + Spring Boot 3.x Backend Server]
        API Gateway --> Auth[Spring Security & JwtAuthenticationFilter]
        
        Auth --> UserMod[User Module<br/>UserService & UserRepository]
        Auth --> EquipMod[Equipment Module<br/>EquipmentService & EquipmentRepository]
        Auth --> BookMod[Booking Module<br/>BookingService & BookingRepository]
        Auth --> PayMod[Payment Module<br/>PaymentService & PaymentRepository]
        Auth --> RevMod[Review Module<br/>ReviewService & ReviewRepository]
        Auth --> NotifMod[Notification Module<br/>NotificationService & NotificationRepository]
    end
    
    UserMod -->|HikariCP / JPA| Database[(MySQL 8 Database<br/>agrirent DB)]
    EquipMod -->|HikariCP / JPA| Database
    BookMod -->|HikariCP / JPA| Database
    PayMod -->|HikariCP / JPA| Database
    RevMod -->|HikariCP / JPA| Database
    NotifMod -->|HikariCP / JPA| Database
```

---

## Layer Descriptions

### 1. Presentation Tier (React Frontend)
- **Role:** Renders the user interface and handles user interactions.
- **Technologies:** React.js, React Router, Vite, CSS, Axios.
- **Functionality:** Provides dedicated interfaces for Farmers (catalog browsing, booking creation, review submission), Equipment Owners (listing creation, booking approval/rejection), and Admins (user and platform monitoring). It maintains authentication state locally via React Context (`AuthContext`).

### 2. Application & API Tier (Spring Boot 3.x Backend)
- **Role:** Hosts the business logic, REST API endpoints, security, route protection, and request handling.
- **Technologies:** Java 17+, Spring Boot 3.x, Spring Security, Spring Data JPA, Hibernate, Bean Validation, JJWT, Lombok.
- **Core Components:**
  - **REST API Gateway:** Maps incoming HTTP requests to target controllers (`/api/auth`, `/api/equipment`, `/api/bookings`, `/api/users`, `/api/categories`, `/api/payments`, `/api/reviews`, `/api/notifications`).
  - **Authentication / Authorization Security:** `JwtAuthenticationFilter` verifies JWT signatures from incoming request headers (`Bearer <token>`) and SecurityFilterChain / `@PreAuthorize` enforces role-based access control (`farmer`, `owner`, `admin`).
  - **Feature Modules:** Spring Services and JPA Repositories handling domain-specific operations such as calculating total rental prices, handling driver fees, approving requests, recalculating average ratings, and generating notifications.

### 3. Data Tier (MySQL 8 Database)
- **Role:** Persists platform data with full relational integrity.
- **Technologies:** MySQL 8, Spring Data JPA, Hibernate ORM with HikariCP connection pooling.
- **Storage:** Stores user credentials, equipment listings, category definitions, booking records, payment logs, reviews, and notifications across 7 relational tables.
