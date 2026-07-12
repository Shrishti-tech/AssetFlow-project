# AssetFlow-project
Team members: Shrishti Dixit
              ,Tanishka Mishra



**Enterprise Asset & Resource Management System**

AssetFlow is a centralized ERP platform for tracking, allocating, and maintaining physical assets and shared resources — equipment, furniture, vehicles, rooms — across any organization. It replaces spreadsheets and paper logs with structured asset lifecycles, conflict-checked allocation, overlap-free resource booking, approval-gated maintenance, and scheduled audit cycles, all with role-based access.

Built for the Odoo hackathon by **Shrishti Dixit** and **Tanishka Mishra**.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Vite), React Router |
| Backend | Node.js, Express (ESM) |
| Database | MongoDB (Mongoose) |
| Auth | JWT in HttpOnly cookies, bcrypt password hashing, role-based middleware |
| Extras | QR code generation (`qrcode`), report export (`exceljs`, `pdfkit`) |

## Features

- **Auth** — employee-only self-signup (no self-assigned roles), login/logout, forgot/reset password, session validation. Admins promote employees to Department Head / Asset Manager from the Employee Directory — the only place roles are ever assigned.
- **Dashboard** — real-time KPI cards, overdue returns highlighted separately, quick actions (Register Asset, Book Resource, Raise Maintenance Request).
- **Organization Setup** (Admin only) — Department management with optional parent-department hierarchy, Asset Category management with category-specific fields (e.g. Warranty Period for Electronics, Registration Number for Vehicles, Material for Furniture), and the Employee Directory.
- **Asset Registration & Directory** — register assets with an auto-generated Asset Tag, searchable/filterable directory, full lifecycle status (Available, Allocated, Reserved, Maintenance, Lost, Disposed, Retired), a real scannable QR code per asset with a Download QR button, and per-asset history.
- **Asset Allocation & Transfer** — allocate assets to employees with an expected return date; the system blocks double-allocation, shows who currently holds the asset, and offers a one-click Transfer Request instead. Transfers flow through Requested → Approved → Re-allocated, and overdue allocations are auto-flagged.
- **Resource Booking** — calendar-based booking of shared resources with time-slot overlap validation, Upcoming/Ongoing/Completed/Cancelled status, and cancel/reschedule support.
- **Maintenance Management** — raise a request with priority and description; it routes through Pending → Approved/Rejected → Technician Assigned → In Progress → Resolved, auto-flipping the asset to Maintenance and back to Available.
- **Asset Audit** — create scoped audit cycles, assign auditors, verify assets as Verified/Missing/Damaged, auto-generate a discrepancy report, and close the cycle (which locks it and marks confirmed-missing assets Lost).
- **Reports & Analytics** — asset utilization trends, maintenance frequency, department-wise allocation summary, booking heatmap, and exportable reports.
- **Notifications & Activity Log** — real-time alerts for overdue returns, approvals, bookings, and transfers, plus a unified activity log of who did what, when.
- **Help & Support** — searchable FAQ, user guide, issue reporting, and a contact form backed by a support ticket model.

## User roles

| Role | Capabilities |
|---|---|
| **Admin** | Manages departments, categories, audit cycles, and role assignment; views org-wide analytics |
| **Asset Manager** | Registers/allocates assets; approves transfers, maintenance requests, and audit discrepancies |
| **Department Head** | Views/approves allocations within their department; books shared resources |
| **Employee** | Views their own assets; books resources; raises maintenance and return/transfer requests |

## Getting started

**Prerequisites:** Node.js, MongoDB (local or Atlas).

```bash
# 1. Install dependencies for both workspaces
npm install

# 2. Configure the server
cp server/.env.example server/.env
# then edit server/.env with your MongoDB URI and a long JWT secret

# 3. Start MongoDB (only needed if running it locally on Windows)
npm run mongo

# 4. Start the backend (http://localhost:5000)
npm run server

# 5. Start the frontend (http://localhost:5173)
npm run client
```

The client talks to `http://localhost:5000/api` by default — override with a `VITE_API_URL` env var in `client/` if needed.

## Project structure

```
client/   React app — one feature folder per module (asset, allocation, organization, etc.),
          each with its own pages/components/services
server/
  models/, controllers/, routes/    — auth, assets, organization (departments/categories/employees), help
  src/                              — allocation, booking, maintenance, audit, reports (service-layer pattern)
```
