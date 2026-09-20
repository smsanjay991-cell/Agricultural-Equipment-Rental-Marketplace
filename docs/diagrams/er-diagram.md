# Entity Relationship (ER) Diagram

## Overview

The Entity Relationship diagram presents the database structure of the **AgriRent** application. It maps the 7 relational tables in the MySQL `agrirent` database, showing primary keys, foreign keys, key attributes, and relationship cardinalities derived directly from `server/config/schema.sql`.

---

## Mermaid ER Diagram

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email UK
        string password
        string phone
        enum role "farmer, owner, admin"
        string location
        string avatar
        datetime created_at
    }

    CATEGORIES {
        int id PK
        string name UK
        string description
        datetime created_at
    }

    EQUIPMENT {
        int id PK
        int owner_id FK
        int category_id FK
        string name
        string category
        string description
        decimal daily_rate
        string location
        boolean is_driver_available
        decimal driver_rate_per_day
        boolean is_available
        decimal average_rating
        int num_reviews
        datetime created_at
    }

    BOOKINGS {
        int id PK
        int equipment_id FK
        int farmer_id FK
        int owner_id FK
        date start_date
        date end_date
        int total_days
        decimal daily_rate
        boolean include_driver
        decimal driver_cost
        decimal total_price
        enum booking_status "pending, approved, rejected, cancelled, completed"
        enum payment_status "pending, paid, refunded"
        datetime created_at
    }

    PAYMENTS {
        int id PK
        int booking_id FK
        int farmer_id FK
        decimal amount
        enum payment_status "Pending, Completed, Failed, Refunded"
        string payment_method
        string transaction_id UK
        datetime created_at
    }

    REVIEWS {
        int id PK
        int equipment_id FK
        int farmer_id FK
        int booking_id FK
        int rating "1-5 stars"
        string comment
        datetime created_at
    }

    NOTIFICATIONS {
        int id PK
        int user_id FK
        string title
        string message
        boolean is_read
        datetime created_at
    }

    %% Relationship Definitions
    USERS ||--o{ EQUIPMENT : "owns (owner_id)"
    CATEGORIES ||--o{ EQUIPMENT : "contains (category_id)"
    USERS ||--o{ BOOKINGS : "places booking (farmer_id)"
    USERS ||--o{ BOOKINGS : "manages request (owner_id)"
    EQUIPMENT ||--o{ BOOKINGS : "rented in (equipment_id)"
    BOOKINGS ||--o{ PAYMENTS : "generates (booking_id)"
    USERS ||--o{ PAYMENTS : "makes payment (farmer_id)"
    EQUIPMENT ||--o{ REVIEWS : "receives (equipment_id)"
    USERS ||--o{ REVIEWS : "writes (farmer_id)"
    BOOKINGS ||--o{ REVIEWS : "reviewed in (booking_id)"
    USERS ||--o{ NOTIFICATIONS : "receives (user_id)"
```

---

## Relationship Explanations

1. **USERS to EQUIPMENT (1:N):** One equipment owner can list multiple pieces of agricultural equipment (`equipment.owner_id` → `users.id`).
2. **CATEGORIES to EQUIPMENT (1:N):** A category can contain multiple equipment items (`equipment.category_id` → `categories.id`).
3. **EQUIPMENT to BOOKINGS (1:N):** An equipment item can have multiple rental booking requests over time (`bookings.equipment_id` → `equipment.id`).
4. **USERS to BOOKINGS (1:N):**
   - As a **Farmer**: A farmer can create multiple rental bookings (`bookings.farmer_id` → `users.id`).
   - As an **Owner**: An owner receives and responds to multiple booking requests for their equipment (`bookings.owner_id` → `users.id`).
5. **BOOKINGS to PAYMENTS (1:N / 1:1):** A booking generates payment transaction logs (`payments.booking_id` → `bookings.id`).
6. **USERS to PAYMENTS (1:N):** A farmer makes payments associated with their account (`payments.farmer_id` → `users.id`).
7. **EQUIPMENT / USERS / BOOKINGS to REVIEWS (1:N):** A farmer writes reviews for completed bookings of specific equipment (`reviews.equipment_id`, `reviews.farmer_id`, `reviews.booking_id`).
8. **USERS to NOTIFICATIONS (1:N):** System notifications are addressed to a specific user (`notifications.user_id` → `users.id`).
