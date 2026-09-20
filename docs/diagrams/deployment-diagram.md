# Deployment Diagram

## Overview

The Deployment diagram illustrates the physical and runtime deployment setup of the **AgriRent** application. Designed as a practical student capstone deployment topology, it shows how software components are hosted across user client devices, the web server host, and the database server instance.

---

## Mermaid Deployment Diagram

```mermaid
graph TD
    subgraph ClientNode [User Device - PC / Mobile / Tablet]
        subgraph BrowserEnv [Web Browser - Chrome / Firefox / Edge]
            ReactApp[React.js Frontend Artifact<br/>Static Bundle - Vite / Webpack]
        end
    end

    subgraph ServerNode [Application Server Host - Node.js Environment]
        subgraph NodeRuntime [Node.js v18+ Runtime Engine]
            ExpressServer[Express.js Web Application Server<br/>Port: 5000 / Environment Variables]
            UploadStorage[Static Uploads Storage<br/>/uploads/ Directory]
        end
    end

    subgraph DBNode [Database Server Host - MySQL 8 Engine]
        subgraph DBRuntime [MySQL Server 8.0 Instance]
            AgriRentDB[(MySQL Database: agrirent<br/>Port: 3306 - InnoDB Engine)]
        end
    end

    %% Network Connections
    ReactApp -->|HTTP / HTTPS<br/>REST API Calls / JSON Payloads| ExpressServer
    ExpressServer -->|Local File I/O| UploadStorage
    ExpressServer -->|TCP / IP Connection<br/>mysql2 Protocol - Port 3306| AgriRentDB
```

---

## Deployment Node Details

### 1. User Device (Client Node)
- **Hardware:** Desktop computers, laptops, tablets, or smartphones.
- **Runtime Environment:** Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
- **Artifact:** Renders the React client application single-page application (SPA).

### 2. Application Server (Backend Server Node)
- **Host Environment:** Local workstation or web server running Node.js (v18+).
- **Runtime Process:** Listens for HTTP requests on a designated port (e.g., `http://localhost:5000` or production host).
- **Execution Component:** Express.js framework handling routing, JWT authentication, and image file storage in the local `/uploads/` directory.

### 3. Database Server (MySQL Node)
- **Host Environment:** Local or dedicated MySQL Server 8.0 instance.
- **Service Configuration:** Listens on standard MySQL TCP port `3306`.
- **Database Engine:** MySQL InnoDB engine managing 7 relational tables with Foreign Keys and transactional integrity.
