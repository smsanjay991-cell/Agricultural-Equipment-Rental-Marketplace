# Class Diagram

## Overview

The Conceptual Class diagram models the primary domain entities, data attributes, controller/model methods, and relationships within the **AgriRent** application. It reflects the object-oriented structure implemented across `server/models/` and `server/controllers/`.

---

## Mermaid Class Diagram

```mermaid
classDiagram
    class User {
        +int id
        +string name
        +string email
        +string password
        +string phone
        +string role
        +string location
        +string avatar
        +register(userData)
        +login(email, password)
        +findById(id)
        +updateProfile(id, profileData)
    }

    class Category {
        +int id
        +string name
        +string description
        +getAll()
        +create(name, description)
    }

    class Equipment {
        +int id
        +int ownerId
        +int categoryId
        +string name
        +string category
        +string description
        +decimal dailyRate
        +string location
        +boolean isDriverAvailable
        +decimal driverRatePerDay
        +boolean isAvailable
        +decimal averageRating
        +int numReviews
        +getAllEquipment(filters)
        +getEquipmentById(id)
        +addEquipment(equipmentData)
        +updateEquipment(id, equipmentData)
        +deleteEquipment(id)
    }

    class Booking {
        +int id
        +int equipmentId
        +int farmerId
        +int ownerId
        +date startDate
        +date endDate
        +int totalDays
        +decimal dailyRate
        +boolean includeDriver
        +decimal driverCost
        +decimal totalPrice
        +string bookingStatus
        +string paymentStatus
        +createBooking(bookingData)
        +getBookingById(id)
        +getMyBookings(farmerId)
        +getOwnerBookings(ownerId)
        +approveBooking(id)
        +rejectBooking(id)
        +cancelBooking(id)
    }

    class Payment {
        +int id
        +int bookingId
        +int farmerId
        +decimal amount
        +string paymentStatus
        +string paymentMethod
        +string transactionId
        +createPayment(paymentData)
        +findByBooking(bookingId)
    }

    class Review {
        +int id
        +int equipmentId
        +int farmerId
        +int bookingId
        +int rating
        +string comment
        +create(reviewData)
        +find(query)
    }

    class Notification {
        +int id
        +int userId
        +string title
        +string message
        +boolean isRead
        +create(userId, title, message)
        +findByUser(userId)
    }

    %% Relationships
    User "1" -- "0..*" Equipment : owns
    Category "1" -- "0..*" Equipment : classifies
    User "1" -- "0..*" Booking : creates (Farmer)
    User "1" -- "0..*" Booking : receives (Owner)
    Equipment "1" -- "0..*" Booking : includes
    Booking "1" -- "0..1" Payment : generates
    User "1" -- "0..*" Payment : pays
    Equipment "1" -- "0..*" Review : receives
    User "1" -- "0..*" Review : writes
    Booking "1" -- "0..1" Review : evaluates
    User "1" -- "0..*" Notification : receives
```

---

## Class Responsibilities

1. **`User` Class:** Manages user authentication, password comparison via bcrypt, JWT token generation, role verification (`farmer`, `owner`, `admin`), and profile updates.
2. **`Category` Class:** Provides classification lookup functions for organizing equipment listings.
3. **`Equipment` Class:** Handles creation, filtering, editing, availability toggling, and average rating updates for machinery.
4. **`Booking` Class:** Encapsulates core business rules for rentals including rental duration calculation, total cost estimation (rates + driver fees), and status transitions (`pending` → `approved`/`rejected` → `completed`/`cancelled`).
5. **`Payment` Class:** Records transaction logs associated with confirmed rental bookings.
6. **`Review` Class:** Captures user ratings (1 to 5 stars) and feedback text, recalculating equipment average ratings upon creation.
7. **`Notification` Class:** Dispatches in-app notifications to users when relevant booking events occur.
