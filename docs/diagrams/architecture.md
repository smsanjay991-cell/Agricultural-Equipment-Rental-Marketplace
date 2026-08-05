# AgriRent System Architecture Specification

## Architecture Overview

AgriRent follows a decoupled Client-Server RESTful architecture:

```mermaid
graph TD
    subgraph Client Tier ["Frontend (Client - React + Vite)"]
        UI["React SPA Components"]
        AuthCtx["Auth Context (JWT State)"]
        AxiosClient["Axios HTTP Service"]
    end

    subgraph API Tier ["Backend (Server - Node.js + Express)"]
        App["Express Router / App"]
        JWTMiddleware["JWT Authentication Middleware"]
        UploadMiddleware["Multer Image Upload Middleware"]
        AuthCtrl["Auth Controller"]
        EqCtrl["Equipment Controller"]
        UserCtrl["User Controller"]
    end

    subgraph Data & Storage Tier ["Data & File Storage"]
        MySQL[("MySQL Database Pool (mysql2)")]
        UploadsDir["Local File System (/server/uploads)"]
    end

    UI --> AuthCtx
    UI --> AxiosClient
    AxiosClient -->|HTTP / REST JSON| App
    App --> JWTMiddleware
    JWTMiddleware --> AuthCtrl
    JWTMiddleware --> EqCtrl
    JWTMiddleware --> UserCtrl
    EqCtrl --> UploadMiddleware
    UploadMiddleware -->|Write Images| UploadsDir
    AuthCtrl -->|SQL Queries| MySQL
    EqCtrl -->|SQL Queries| MySQL
    UserCtrl -->|SQL Queries| MySQL
```

## Core Completed Modules & Data Flow

1. **Authentication & Authorization**:
   - Client sends registration/login payload to Express server (`/api/auth/register`, `/api/auth/login`).
   - Passwords encrypted with `bcrypt`.
   - JWT tokens generated with user identity (`id`, `role`) signed via `JWT_SECRET`.
   - `authMiddleware` validates Bearer token on protected routes and attaches user metadata to `req.user`.

2. **Equipment Management & Image Upload**:
   - Equipment Owners manage equipment listings (`GET /api/equipment`, `POST /api/equipment`, `PUT /api/equipment/:id`, `DELETE /api/equipment/:id`).
   - Image upload handled via `multer` storing files in `server/uploads/` directory and returning relative URL paths.
   - Equipment queried by category, location, and price ranges with pagination support from MySQL `equipment` table.
