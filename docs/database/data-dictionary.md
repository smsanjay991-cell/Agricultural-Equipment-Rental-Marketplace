# Data Dictionary

## Overview

This Data Dictionary describes the 7 tables in the **AgriRent** database (`agrirent`), detailing the column names, data types, constraints, default values, and functional purpose of each attribute.

---

## 1. `users` Table
**Purpose:** Stores user account credentials, contact information, and role assignments (`farmer`, `owner`, `admin`).

| Column Name | Data Type | Constraints | Default | Purpose / Description |
|---|---|---|---|---|
| `id` | `INT` | `PRIMARY KEY, AUTO_INCREMENT` | *None* | Unique user identifier |
| `name` | `VARCHAR(100)` | `NOT NULL` | *None* | Full name of the user |
| `email` | `VARCHAR(100)` | `NOT NULL, UNIQUE, INDEX` | *None* | Login email address |
| `password` | `VARCHAR(255)` | `NOT NULL` | *None* | Bcrypt password hash |
| `phone` | `VARCHAR(20)` | `NOT NULL` | *None* | Contact phone number |
| `role` | `ENUM` | `NOT NULL, INDEX` | `'farmer'` | User role (`farmer`, `owner`, `admin`) |
| `location` | `VARCHAR(255)` | `NULLABLE` | `''` | User address/location |
| `avatar` | `VARCHAR(255)` | `NULLABLE` | `''` | Profile avatar image URL/path |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | `CURRENT_TIMESTAMP` | Account creation timestamp |
| `updated_at` | `TIMESTAMP` | `ON UPDATE CURRENT_TIMESTAMP` | `CURRENT_TIMESTAMP` | Account update timestamp |

---

## 2. `categories` Table
**Purpose:** Stores categories for organizing agricultural machinery listings (e.g., Tractors, Harvesters, Tillage, Irrigation).

| Column Name | Data Type | Constraints | Default | Purpose / Description |
|---|---|---|---|---|
| `id` | `INT` | `PRIMARY KEY, AUTO_INCREMENT` | *None* | Unique category identifier |
| `name` | `VARCHAR(50)` | `NOT NULL, UNIQUE` | *None* | Name of the equipment category |
| `description` | `TEXT` | `NULLABLE` | *None* | Detailed category description |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | `CURRENT_TIMESTAMP` | Category creation timestamp |
| `updated_at` | `TIMESTAMP` | `ON UPDATE CURRENT_TIMESTAMP` | `CURRENT_TIMESTAMP` | Category update timestamp |

---

## 3. `equipment` Table
**Purpose:** Stores agricultural machinery listed by owners for rental.

| Column Name | Data Type | Constraints | Default | Purpose / Description |
|---|---|---|---|---|
| `id` | `INT` | `PRIMARY KEY, AUTO_INCREMENT` | *None* | Unique equipment identifier |
| `owner_id` | `INT` | `NOT NULL, FK (users.id)` | *None* | Foreign Key linking to equipment owner |
| `category_id` | `INT` | `NULLABLE, FK (categories.id)` | `NULL` | Foreign Key linking to category |
| `name` | `VARCHAR(150)` | `NOT NULL` | *None* | Equipment title / name |
| `category` | `VARCHAR(50)` | `NOT NULL, INDEX` | `'General'` | Text category representation |
| `description` | `TEXT` | `NOT NULL` | *None* | Technical specifications & usage terms |
| `brand` | `VARCHAR(100)` | `NULLABLE` | `''` | Brand / Manufacturer |
| `model` | `VARCHAR(100)` | `NULLABLE` | `''` | Model number / name |
| `daily_rate` | `DECIMAL(10,2)` | `NOT NULL, CHECK (daily_rate >= 0)` | `0.00` | Rental rate per day (in currency) |
| `location` | `VARCHAR(255)` | `NOT NULL, INDEX` | *None* | Location where equipment is stored |
| `image` | `VARCHAR(255)` | `NULLABLE` | `''` | Primary image file path/URL |
| `horsepower` | `INT` | `NULLABLE` | `0` | Horsepower rating (HP) |
| `fuel_type` | `VARCHAR(50)` | `NULLABLE` | `'Diesel'` | Engine fuel requirement |
| `is_driver_available` | `TINYINT(1)` | `NULLABLE` | `0` | Boolean flag (1 = driver option available) |
| `driver_rate_per_day` | `DECIMAL(10,2)` | `NULLABLE` | `0.00` | Optional driver cost per day |
| `is_available` | `TINYINT(1)` | `NULLABLE` | `1` | Availability flag (1 = listed for rent) |
| `images` | `JSON` | `NULLABLE` | *None* | JSON array of additional image paths |
| `average_rating` | `DECIMAL(3,2)` | `NULLABLE` | `0.00` | Calculated average rating (1.00 - 5.00) |
| `num_reviews` | `INT` | `NULLABLE` | `0` | Total review count received |

---

## 4. `bookings` Table
**Purpose:** Stores equipment rental booking requests submitted by farmers and managed by equipment owners.

| Column Name | Data Type | Constraints | Default | Purpose / Description |
|---|---|---|---|---|
| `id` | `INT` | `PRIMARY KEY, AUTO_INCREMENT` | *None* | Unique booking identifier |
| `equipment_id` | `INT` | `NOT NULL, FK (equipment.id)` | *None* | Rented equipment item ID |
| `farmer_id` | `INT` | `NOT NULL, FK (users.id)` | *None* | User ID of the requesting farmer |
| `owner_id` | `INT` | `NOT NULL, FK (users.id)` | *None* | User ID of the equipment owner |
| `start_date` | `DATE` | `NOT NULL` | *None* | Rental start date |
| `end_date` | `DATE` | `NOT NULL` | *None* | Rental end date |
| `total_days` | `INT` | `NOT NULL, CHECK (total_days > 0)` | *None* | Total calculated duration in days |
| `daily_rate` | `DECIMAL(10,2)` | `NOT NULL` | `0.00` | Equipment rate per day applied |
| `include_driver` | `TINYINT(1)` | `NULLABLE` | `0` | Flag indicating if driver requested |
| `driver_cost` | `DECIMAL(10,2)` | `NULLABLE` | `0.00` | Total calculated driver cost |
| `total_price` | `DECIMAL(10,2)` | `NOT NULL` | `0.00` | Grand total rental price |
| `booking_status` | `ENUM` | `NOT NULL, INDEX` | `'pending'` | Status (`pending`, `approved`, `rejected`, `cancelled`, `completed`) |
| `payment_status` | `ENUM` | `NOT NULL, INDEX` | `'pending'` | Payment status (`pending`, `paid`, `refunded`) |
| `remarks` | `TEXT` | `NULLABLE` | *None* | Optional notes / rejection remarks |

---

## 5. `payments` Table
**Purpose:** Stores payment records associated with equipment rental bookings.

| Column Name | Data Type | Constraints | Default | Purpose / Description |
|---|---|---|---|---|
| `id` | `INT` | `PRIMARY KEY, AUTO_INCREMENT` | *None* | Unique payment log identifier |
| `booking_id` | `INT` | `NOT NULL, FK (bookings.id)` | *None* | Associated booking ID |
| `farmer_id` | `INT` | `NOT NULL, FK (users.id)` | *None* | Farmer who made the payment |
| `amount` | `DECIMAL(10,2)` | `NOT NULL, CHECK (amount >= 0)` | *None* | Payment amount |
| `payment_status` | `ENUM` | `NOT NULL` | `'Pending'` | Status (`Pending`, `Completed`, `Failed`, `Refunded`) |
| `payment_method` | `VARCHAR(50)` | `NOT NULL` | `'Cash/Manual'` | Payment channel used |
| `transaction_id` | `VARCHAR(100)` | `UNIQUE, NULLABLE` | *None* | Transaction reference ID |

---

## 6. `reviews` Table
**Purpose:** Stores ratings and feedback comments submitted by farmers for completed bookings.

| Column Name | Data Type | Constraints | Default | Purpose / Description |
|---|---|---|---|---|
| `id` | `INT` | `PRIMARY KEY, AUTO_INCREMENT` | *None* | Unique review identifier |
| `equipment_id` | `INT` | `NOT NULL, FK (equipment.id)` | *None* | Reviewed equipment item ID |
| `farmer_id` | `INT` | `NOT NULL, FK (users.id)` | *None* | Farmer writing the review |
| `booking_id` | `INT` | `NOT NULL, FK (bookings.id)` | *None* | Associated completed booking ID |
| `rating` | `INT` | `NOT NULL, CHECK (1..5)` | *None* | Star rating given (1 to 5) |
| `comment` | `TEXT` | `NOT NULL` | *None* | Review feedback comment |

---

## 7. `notifications` Table
**Purpose:** Stores system alerts and booking notifications sent to users.

| Column Name | Data Type | Constraints | Default | Purpose / Description |
|---|---|---|---|---|
| `id` | `INT` | `PRIMARY KEY, AUTO_INCREMENT` | *None* | Unique notification identifier |
| `user_id` | `INT` | `NOT NULL, FK (users.id)` | *None* | Target recipient user ID |
| `title` | `VARCHAR(150)` | `NOT NULL` | *None* | Notification header / title |
| `message` | `TEXT` | `NOT NULL` | *None* | Detailed notification message |
| `is_read` | `TINYINT(1)` | `NULLABLE` | `0` | Read indicator (0 = unread, 1 = read) |
