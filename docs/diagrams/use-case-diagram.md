# Use Case Diagram

## Overview

The Use Case diagram illustrates the functional requirements of the **AgriRent** system from the perspective of three primary actors: **Farmer**, **Equipment Owner**, and **Admin**.

---

## Mermaid Use Case Diagram

```mermaid
graph LR
    %% Actors
    subgraph Actors
        Farmer((Farmer))
        Owner((Equipment Owner))
        Admin((System Admin))
    end

    %% Use Cases Boundary
    subgraph AgriRent Platform
        %% Common Auth Use Cases
        UC_Reg[Register Account]
        UC_Log[Login / Authenticate]
        UC_Prof[Manage Profile]

        %% Farmer Use Cases
        UC_Browse[Browse Equipment Catalog]
        UC_Search[Search & Filter Equipment]
        UC_ViewDetail[View Equipment Details]
        UC_CheckAvail[Check Availability & Pricing]
        UC_CreateBook[Create Rental Booking]
        UC_ViewBook[View Booking Status]
        UC_ViewPay[View Payment Status]
        UC_SubRev[Submit Rating & Review]

        %% Owner Use Cases
        UC_AddEq[Add Equipment Listing]
        UC_UpdateEq[Update Equipment Details]
        UC_ManageAvail[Manage Availability Status]
        UC_ViewReq[View Booking Requests]
        UC_ApproveBook[Approve Booking Request]
        UC_RejectBook[Reject Booking Request]

        %% Admin Use Cases
        UC_ManageUsers[Manage Users & Roles]
        UC_ManageCat[Manage Categories]
        UC_MonEquip[Monitor Equipment Listings]
        UC_MonBook[Monitor Platform Bookings]
    end

    %% Actor Relationships - Farmer
    Farmer --> UC_Reg
    Farmer --> UC_Log
    Farmer --> UC_Prof
    Farmer --> UC_Browse
    Farmer --> UC_Search
    Farmer --> UC_ViewDetail
    Farmer --> UC_CheckAvail
    Farmer --> UC_CreateBook
    Farmer --> UC_ViewBook
    Farmer --> UC_ViewPay
    Farmer --> UC_SubRev

    %% Actor Relationships - Owner
    Owner --> UC_Reg
    Owner --> UC_Log
    Owner --> UC_Prof
    Owner --> UC_AddEq
    Owner --> UC_UpdateEq
    Owner --> UC_ManageAvail
    Owner --> UC_ViewReq
    Owner --> UC_ApproveBook
    Owner --> UC_RejectBook

    %% Actor Relationships - Admin
    Admin --> UC_Log
    Admin --> UC_ManageUsers
    Admin --> UC_ManageCat
    Admin --> UC_MonEquip
    Admin --> UC_MonBook
```

---

## Use Case Descriptions

### 1. Farmer Use Cases
- **Browse & Search Equipment:** Search by category, name, or location to find agricultural machinery.
- **Check Availability:** View equipment rates, driver availability, and calendar availability.
- **Create Rental Booking:** Select start/end dates, choose optional driver, and submit booking request.
- **View Booking & Payment Status:** Track request status (`pending`, `approved`, `rejected`, `completed`) and view payment status.
- **Submit Review:** Submit ratings (1–5 stars) and comments after completing a rental.

### 2. Equipment Owner Use Cases
- **Add & Update Equipment:** Upload equipment details, daily rental rate, driver availability, horsepower, and location.
- **Manage Availability:** Toggle equipment status between available and unavailable.
- **Respond to Requests:** Review incoming rental requests from farmers and either **Approve** or **Reject** them.

### 3. System Admin Use Cases
- **Manage Users:** Monitor user accounts, update roles, or suspend access.
- **Manage Categories:** Create and edit equipment classification categories.
- **Monitor System Data:** Review all platform equipment listings and rental bookings for operational governance.
