# Authentication & Authorization Flow

## Overview

In **AgriRent**, access control is divided into two core concepts:
- **Authentication ("Who are you?"):** Verifying the user's identity when they log in using their email and password.
- **Authorization ("What are you allowed to do?"):** Checking if the logged-in user has the required role (`farmer`, `owner`, or `admin`) to perform a specific action (e.g., adding equipment, approving a booking, or viewing all users).

Authentication and state persistence between HTTP requests are handled using **JSON Web Tokens (JWT)** via **Spring Security**.

---

## Authentication & Request Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React Frontend
    participant AuthAPI as Auth Controller (/api/auth/login)
    participant DB as MySQL Database
    participant JwtProvider as JwtTokenProvider
    participant JwtFilter as JwtAuthenticationFilter
    participant SecContext as SecurityContext / PreAuthorize
    participant Controller as Target RestController

    %% Step 1: Login Process
    User->>Client: Enter Email & Password
    Client->>AuthAPI: POST /api/auth/login { email, password }
    AuthAPI->>DB: Query User by email via UserRepository
    DB-->>AuthAPI: User entity (with BCrypt password hash)
    AuthAPI->>AuthAPI: Verify password using PasswordEncoder.matches()
    alt Invalid Credentials
        AuthAPI-->>Client: 401 Unauthorized { success: false, message: "Invalid credentials" }
        Client-->>User: Display login error message
    else Valid Credentials
        AuthAPI->>JwtProvider: Generate JWT token with userId & role
        JwtProvider-->>AuthAPI: Signed JWT String
        AuthAPI-->>Client: 200 OK { token, user: { id, name, email, role } }
        Client->>Client: Store user & token in AuthContext / localStorage
        Client-->>User: Redirect to Role Dashboard (Farmer / Owner / Admin)
    end

    %% Step 2: Protected API Request Flow
    User->>Client: Perform Action (e.g., Create Equipment / Approve Booking)
    Client->>JwtFilter: HTTP Request with Header "Authorization: Bearer <token>"
    JwtFilter->>JwtProvider: Validate Token signature & expiration
    alt Token Missing or Invalid
        JwtProvider-->>JwtFilter: Token Verification Failed
        JwtFilter-->>Client: 401 Unauthorized { message: "Token failed validation" }
    else Token Valid
        JwtFilter->>DB: Load UserDetails by User ID
        DB-->>JwtFilter: UserDetails / User entity
        JwtFilter->>SecContext: Set UsernamePasswordAuthenticationToken in SecurityContextHolder
        SecContext->>SecContext: Check @PreAuthorize / SecurityFilterChain role matching
        alt Role Not Allowed
            SecContext-->>Client: 403 Forbidden { message: "Role not authorized" }
        else Role Allowed
            SecContext->>Controller: Execute Controller Method
            Controller->>DB: Perform JPA / Hibernate Operation
            DB-->>Controller: Query Result / Saved Entity
            Controller-->>Client: 200 OK { success: true, data: [...] }
            Client-->>User: Update UI with result
        end
    end
```

---

## Concept Breakdown

### 1. JSON Web Token (JWT)
A JWT is a compact, URL-safe string sent by the server after a user successfully logs in. The token contains encoded user identification details (such as `user.id` and `user.role`). On subsequent API requests, the client attaches this token in the `Authorization` HTTP header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Because the token is digitally signed using a server-side secret key (`JWT_SECRET`), the server can verify the user's identity without needing to store session data in memory.

### 2. JwtAuthenticationFilter
Located in `com.agrirent.security.JwtAuthenticationFilter`:
- Intercepts incoming HTTP requests.
- Extracts the token from the `Authorization` header.
- Decodes and verifies the token signature via `JwtTokenProvider`.
- Loads `UserDetails` via `CustomUserDetailsService`.
- Populates `SecurityContextHolder.getContext().setAuthentication(...)`.
- Rejects unauthenticated requests with HTTP status `401 Unauthorized`.

### 3. Role Authorization (`@PreAuthorize` & SecurityFilterChain)
Located in `com.agrirent.config.SecurityConfig` and RestControllers:
- Enforces endpoint level role restrictions (e.g., `@PreAuthorize("hasAnyRole('owner', 'admin')")`).
- Evaluates the authenticated user's role against required authorities.
- Allows request execution if authorized.
- Returns a `403 Forbidden` status code if the user does not have permission.
