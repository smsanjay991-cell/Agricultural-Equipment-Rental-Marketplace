# Sequence Diagram: Farmer Creates a Rental Booking

## Overview

This Sequence diagram documents the exact interactions between system components during the core scenario: **"Farmer creates a rental booking"**. It shows HTTP request calls, JWT authentication checks, database persistence, notification triggers, and response payloads.

---

## Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Farmer
    participant React as React Frontend
    participant API as Booking API (/api/bookings)
    participant Auth as Authentication / JWT
    participant DB as MySQL Database
    actor Owner

    %% 1. Fetch Details
    Farmer->>React: Select equipment item from catalog
    React->>API: GET /api/equipment/:id
    API->>DB: SELECT * FROM equipment WHERE id = :id
    DB-->>API: Equipment details record
    API-->>React: Return JSON { success: true, data: equipment }
    React-->>Farmer: Render equipment details & booking form

    %% 2. Submit Booking
    Farmer->>React: Select dates, driver preference & submit booking
    React->>API: POST /api/bookings (Header: Authorization Bearer <token>, Body: { equipmentId, startDate, endDate, includeDriver })
    
    %% 3. Auth Check
    API->>Auth: Validate JWT token & verify role ('farmer')
    alt Token Invalid / Expired
        Auth-->>API: Authentication Error
        API-->>React: 401 Unauthorized { success: false, message: "Invalid Token" }
        React-->>Farmer: Display session error / prompt login
    else Token Valid
        Auth-->>API: Decoded User Payload (farmer_id)
        
        %% 4. Price Calculation & DB Insert
        API->>API: Calculate total_days, driver_cost & total_price
        API->>DB: INSERT INTO bookings (equipment_id, farmer_id, owner_id, start_date, end_date, total_days, daily_rate, include_driver, driver_cost, total_price, booking_status) VALUES (...)
        DB-->>API: Booking inserted successfully (insertId)
        
        %% 5. Notification Dispatch
        API->>DB: INSERT INTO notifications (user_id, title, message) VALUES (owner_id, "New Booking Request", ...)
        DB-->>API: Notification logged
        API-->>Owner: Booking notification alert generated in owner dashboard
        
        %% 6. Confirmation Response
        API-->>React: 201 Created { success: true, booking: { id, status: "pending", total_price } }
        React-->>Farmer: Render booking confirmation screen with "Pending Approval" status
    end
```

---

## Sequence Execution Steps

1. **Equipment Details Request:** When a farmer clicks on an equipment listing, the frontend sends a `GET /api/equipment/:id` request. The backend retrieves the listing from MySQL and renders the details page.
2. **Booking Submission:** The farmer inputs rental start/end dates and submits the form. The frontend constructs a JSON payload and dispatches a `POST /api/bookings` request accompanied by the farmer's Bearer JWT in the request headers.
3. **JWT Authorization Guard:** The backend passes the request through the `protect` and `authorizeRoles('farmer')` middlewares to verify the token signature and identity.
4. **Calculations & Database Insertion:** The `bookingController` computes total rental days, applies daily rates and driver fees (if requested), and executes an `INSERT INTO bookings` query in MySQL.
5. **Notification Creation:** The server inserts an owner notification into the `notifications` table (`user_id = owner_id`).
6. **Frontend Confirmation:** The backend returns a `201 Created` HTTP response. The React client updates the UI to show the new booking status as `pending`.
