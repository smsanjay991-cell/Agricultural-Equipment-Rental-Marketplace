# Authentication & Authorization Flow

## Overview

In **AgriRent**, access control is divided into two core concepts:
- **Authentication ("Who are you?"):** Verifying the user's identity when they log in using their email and password.
- **Authorization ("What are you allowed to do?"):** Checking if the logged-in user has the required role (`farmer`, `owner`, or `admin`) to perform a specific action (e.g., adding equipment, approving a booking, or viewing all users).

Authentication and state persistence between HTTP requests are handled using **JSON Web Tokens (JWT)**.

---

## Authentication & Request Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React Frontend
    participant AuthAPI as Auth Controller (/api/auth/login)
    participant DB as MySQL Database
    participant JWT as JWT Service
    participant Protect as protect Middleware
    participant Authz as authorizeRoles Middleware
    participant Route as Target Route Handler

    %% Step 1: Login Process
    User->>Client: Enter Email & Password
    Client->>AuthAPI: POST /api/auth/login { email, password }
    AuthAPI->>DB: Query User by email
    DB-->>AuthAPI: User record (with bcrypt password hash)
    AuthAPI->>AuthAPI: Compare password using bcrypt.compare()
    alt Invalid Credentials
        AuthAPI-->>Client: 401 Unauthorized { success: false, message: "Invalid credentials" }
        Client-->>User: Display login error message
    else Valid Credentials
        AuthAPI->>JWT: Generate JWT payload { id: user.id } signed with JWT_SECRET
        JWT-->>AuthAPI: Signed JWT String
        AuthAPI-->>Client: 200 OK { token, user: { id, name, email, role } }
        Client->>Client: Store user & token in AuthContext / localStorage
        Client-->>User: Redirect to Role Dashboard (Farmer / Owner / Admin)
    end

    %% Step 2: Protected API Request Flow
    User->>Client: Perform Action (e.g., Create Equipment / Approve Booking)
    Client->>Protect: HTTP Request with Header "Authorization: Bearer <token>"
    Protect->>JWT: Verify Token signature & expiration
    alt Token Missing or Invalid
        JWT-->>Protect: Token Verification Error
        Protect-->>Client: 401 Unauthorized { message: "Token failed validation" }
    else Token Valid
        Protect->>DB: Fetch User by decoded.id
        DB-->>Protect: User record
        Protect->>Authz: Pass request with req.user attached
        Authz->>Authz: Check if req.user.role matches allowed roles
        alt Role Not Allowed
            Authz-->>Client: 403 Forbidden { message: "Role not authorized" }
        else Role Allowed
            Authz->>Route: Execute Route Controller Logic
            Route->>DB: Perform SQL Operation
            DB-->>Route: Query Result
            Route-->>Client: 200 OK { success: true, data: [...] }
            Client-->>User: Update UI with result
        end
    end
```

---

## Concept Breakdown

### 1. JSON Web Token (JWT)
A JWT is a compact, URL-safe string sent by the server after a user successfully logs in. The token contains encoded user identification details (such as `user.id`). On subsequent API requests, the client attaches this token in the `Authorization` HTTP header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Because the token is digitally signed using a server-side secret key (`JWT_SECRET`), the server can verify the user's identity without needing to store session data in memory.

### 2. Authentication Middleware (`protect`)
Located in `server/middleware/authMiddleware.js`:
- Extracts the token from the `Authorization` header.
- Decodes and verifies the token signature.
- Queries the database for the matching user ID and attaches the user object to `req.user`.
- Rejects requests without a valid token with a `401 Unauthorized` HTTP status code.

### 3. Role Authorization Middleware (`authorizeRoles`)
Located in `server/middleware/authMiddleware.js`:
- Accepts allowed roles as arguments (e.g., `authorizeRoles('owner', 'admin')`).
- Inspects `req.user.role`.
- Allows the request to proceed to the controller if the user's role matches.
- Returns a `403 Forbidden` status code if the user does not have permission.
