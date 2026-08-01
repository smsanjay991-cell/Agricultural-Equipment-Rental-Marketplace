# Database Design & Schemas

AgriRent uses MongoDB document collections with Mongoose schemas:

- **`users`**: Contains user credentials, hashed passwords, role (`farmer`, `owner`, `admin`), phone, and location.
- **`equipment`**: Contains machinery metadata, category, daily rental rate, driver rates, location, owner reference (`User._id`), ratings, and image URLs.
- **`bookings`**: Tracks rental reservations, start/end dates, total pricing, status (`Pending`, `Approved`, `Rejected`, `Completed`, `Cancelled`), and references to `Equipment` and `User`.
- **`reviews`**: Post-rental 1-5 star ratings and feedback comments.
