# AgriRent REST API Specification

## Base URL
`http://localhost:5000/api`

## Authentication Header
`Authorization: Bearer <JWT_TOKEN>`

---

## 🔐 Auth Endpoints

### 1. User Registration
`POST /auth/register`
- **Body**: `{ name, email, password, phone, role, location }`
- **Response**: User object with JWT token.

### 2. User Login
`POST /auth/login`
- **Body**: `{ email, password }`
- **Response**: User object with JWT token.

---

## 🚜 Equipment Endpoints

### 1. List / Search Equipment
`GET /equipment?category=Tractor&search=John+Deere&location=Punjab`
- **Response**: Array of equipment listings with populated owner info.

### 2. Create Listing
`POST /equipment` *(Auth Required: Owner / Admin)*
- **Body**: `{ name, category, description, dailyRate, location, horsepower, fuelType, isDriverAvailable, driverRatePerDay, images }`

---

## 📅 Booking Endpoints

### 1. Create Booking Request
`POST /bookings` *(Auth Required: Farmer)*
- **Body**: `{ equipmentId, startDate, endDate, includeDriver, notes }`

### 2. Update Booking Status
`PUT /bookings/:id/status` *(Auth Required)*
- **Body**: `{ status: "Approved" | "Rejected" | "Completed" | "Cancelled" }`
