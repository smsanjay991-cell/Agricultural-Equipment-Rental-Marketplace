# Changelog

All notable changes to the **AgriRent** platform project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-01

### Added
- **Backend API**: Complete Node.js + Express backend REST API.
- **Database Schemas**: Mongoose models for `User`, `Equipment`, `Booking`, and `Review`.
- **JWT & RBAC**: Authentication middleware with granular role-based permissions (`Farmer`, `Owner`, `Admin`).
- **Booking Engine**: Date collision checks, driver fee calculation, and rental lifecycle state machine.
- **Frontend Architecture**: React + Vite SPA with Tailwind CSS design system.
- **UI Components**: Interactive Navbar, Footer, Hero search banner, Equipment Cards, Role-based Sidebars, and Loader animations.
- **Role Dashboards**: Customized views for Farmers, Equipment Owners, and System Admins.
- **Documentation**: DBML schema specification, architectural diagrams, ER diagram docs, and step-by-step setup guide.
