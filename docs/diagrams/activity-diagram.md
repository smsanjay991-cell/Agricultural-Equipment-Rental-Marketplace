# Activity Diagram

## Overview

The Activity diagram models the end-to-end workflow of the main rental process in **AgriRent**, starting from farmer authentication, browsing and selecting equipment, to booking submission, owner approval/rejection, payment status tracking, and final review submission.

---

## Mermaid Activity Diagram

```mermaid
flowchart TD
    Start([Start]) --> Login[Farmer Login]
    Login --> Browse[Browse Equipment Catalog]
    Browse --> Select[Select Equipment Item]
    Select --> CheckAvail[Check Availability & Rates]
    CheckAvail --> Dates[Select Rental Start & End Dates]
    Dates --> EnterDetails[Enter Booking Details & Optional Driver Choice]
    EnterDetails --> Submit[Submit Booking Request]
    
    Submit --> Receive[Owner Receives Booking Request]
    Receive --> Decision{Owner Approves Request?}
    
    %% Rejected Branch
    Decision -->|No| RejectBooking[Booking Status Set to Rejected]
    RejectBooking --> NotifFarmerReject[System Sends Rejection Notification to Farmer]
    NotifFarmerReject --> EndRejected([End - Booking Rejected])
    
    %% Approved Branch
    Decision -->|Yes| ApproveBooking[Booking Status Set to Approved]
    ApproveBooking --> NotifFarmerApprove[System Sends Approval Notification to Farmer]
    NotifFarmerApprove --> PayStatus[Payment Status Updated / Recorded]
    PayStatus --> Confirmed[Booking Status Confirmed]
    Confirmed --> RentalPeriod[Rental Execution Period Starts & Ends]
    RentalPeriod --> CompleteBooking[Booking Marked as Completed]
    CompleteBooking --> SubmitReview[Farmer Submits Rating & Review]
    SubmitReview --> UpdateStats[System Recalculates Average Equipment Rating]
    UpdateStats --> EndSuccess([End - Rental Completed Successfully])
```

---

## Process Steps Description

1. **Farmer Authentication & Selection:** The farmer logs in, searches the equipment catalog, and selects target equipment.
2. **Date & Rate Calculation:** The farmer checks available dates, selects total rental days, chooses whether a driver is needed, and views the calculated total price.
3. **Booking Submission:** Submitting the booking creates a record in the database with status `pending`.
4. **Owner Approval Decision:**
   - **Reject:** The owner rejects the request. The booking status changes to `rejected`, the farmer is notified, and the workflow terminates.
   - **Approve:** The owner approves the request. The booking status updates to `approved`, and an approval notification is dispatched.
5. **Rental Completion & Payment:** Upon approval, payment details are updated, the rental period proceeds, and after completion, the booking status is set to `completed`.
6. **Feedback Loop:** The farmer submits a rating (1–5 stars) and review, triggering an automatic recalculation of the equipment's average rating.
