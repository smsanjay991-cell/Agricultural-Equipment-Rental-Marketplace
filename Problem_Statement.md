# AgriRent - Problem Statement & System Design

## 1. Executive Summary & Problem Overview
Agricultural mechanization is a pivotal driver of modern farming productivity, yield optimization, and food security. However, smallholder and medium-scale farmers in developing and emerging agricultural economies face significant financial barriers to owning modern heavy machinery. High capital expenditures, seasonal usage cycles, maintenance costs, and rapid depreciation make acquiring equipment like tractors, combine harvesters, rotavators, and precision seeders financially unviable for individual small-scale farms.

Conversely, commercial farmers and local machinery owners often possess expensive equipment that sits idle for substantial portions of the off-peak agricultural season.

**AgriRent** bridges this divide by providing an end-to-end digital equipment rental marketplace. It connects agricultural machinery owners directly with farmers seeking short-term or seasonal equipment rentals, optimizing resource utilization, lowering operational entry barriers for farmers, and unlocking new income streams for equipment owners.

---

## 2. Key Challenges Targeted
- **High Capital Barriers**: Inability of small farmers to purchase expensive modern equipment outright.
- **Underutilized Capital Assets**: Idle equipment owned by larger farms during non-peak farming weeks.
- **Fragmented Rental Information**: Dependence on informal, unverified local agents with non-transparent pricing and unpredictable availability.
- **Logistics & Scheduling Conflicts**: Lack of real-time scheduling, leading to double-bookings during critical sowing or harvesting windows.
- **Trust & Quality Assurance**: Absence of review mechanisms, operator driver options, or transparent booking status tracking.

---

## 3. AgriRent Platform Solution
AgriRent operates as a role-aware full-stack web platform catering to three primary user personas:
1. **Farmers (Renters)**: Search nearby equipment, filter by category/price/location, check real-time availability, select optional trained operators (drivers), calculate transparent rental quotes, track booking status, and leave ratings/reviews.
2. **Equipment Owners (Lenders)**: List equipment with operational specs, daily rates, photos, manage incoming booking requests (accept/reject), track equipment schedule, and view earnings metrics.
3. **Platform Administrators**: Supervise user accounts, verify listed equipment, audit transactions, resolve disputes, and analyze platform-wide usage metrics.

---

## 4. Key Functional Requirements

### User Management & Authentication
- Secure JWT-based authentication with bcrypt password hashing.
- Role-based authorization: `Farmer`, `Owner`, `Admin`.
- Profile management with contact details and farm/fleet location.

### Equipment Management
- Dynamic catalog supporting categories: Tractors, Combine Harvesters, Tillers & Cultivators, Seeders & Planters, Sprayers & Irrigation.
- Detailed specifications: Horsepower (HP), fuel type, attachment support, location, pricing per day, operator availability.

### Booking & Reservation Engine
- Date range collision prevention and real-time total cost estimation.
- Driver add-on fees option.
- Multi-stage lifecycle: `Pending` -> `Approved` / `Rejected` -> `Completed` / `Cancelled`.

### Review & Rating System
- Post-rental feedback loops with 5-star ratings and written reviews to maintain trust.

---

## 5. Architectural High-Level Design

```
+-------------------------------------------------------+
|                   Client (React + Vite)              |
|   +-------------------+  +------------------------+   |
|   |  Farmer Dashboard |  |   Owner Dashboard      |   |
|   +-------------------+  +------------------------+   |
|   |  Admin Dashboard  |  | Equipment Search & Rent|   |
|   +-------------------+  +------------------------+   |
+---------------------------+---------------------------+
                            | HTTP / REST API (JSON)
                            v
+-------------------------------------------------------+
|             Backend Server (Express API)              |
|   +-------------------+  +------------------------+   |
|   |  Auth Controller  |  | Equipment Controller   |   |
|   +-------------------+  +------------------------+   |
|   | Booking Service   |  |   User & Review Ctrl   |   |
|   +-------------------+  +------------------------+   |
+---------------------------+---------------------------+
                            | Mongoose ODM
                            v
+-------------------------------------------------------+
|                 Database (MongoDB)                    |
|   [Users]   [Equipment]   [Bookings]   [Reviews]      |
+-------------------------------------------------------+
```
