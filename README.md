    # Findly — Lost & Found Platform

A production-ready full-stack MERN application built as an internship project. Findly helps people recover lost items by connecting owners with finders through smart matching, secure messaging, and a community-driven platform.

---

## Tech Stack

| Layer        | Technology                                                    |
|--------------|---------------------------------------------------------------|
| Frontend     | React 18, Vite, Tailwind CSS, React Router v6                 |
| Backend      | Node.js, Express.js                                           |
| Database     | MongoDB, Mongoose ODM                                         |
| Auth         | JWT (jsonwebtoken) + bcryptjs                                 |
| Validation   | express-validator (server) + custom useForm hook (client)     |
| Security     | Helmet, CORS, express-rate-limit, mongo-sanitize              |
| File Uploads | Multer (local disk, images up to 5MB)                         |
| Logging      | Winston                                                       |
| HTTP Client  | Axios with request/response interceptors                      |
| Fonts        | Plus Jakarta Sans + DM Serif Display (Google Fonts)           |

---

## Features

- **JWT Authentication** — Register, login, logout, protected routes
- **Lost Item Reporting** — Full form with photo upload (up to 5 images), location, category
- **Found Item Reporting** — Same form flow with found-specific fields
- **Smart Matching** — Auto-suggests potential matches on item creation (opposite type, same category)
- **Browse & Filter** — Filter by type, category, search text; paginated results
- **Secure Messaging** — Per-item chat between owner and finder (anonymous until recovery)
- **Item Lifecycle** — Active → Matched → Recovered → Closed
- **User Dashboard** — View/manage all personal reports with tabs
- **Profile Management** — Update name, phone, city, avatar, change password
- **Rating System** — Rate users after successful item recovery
- **Admin Panel** — Platform stats, manage users (suspend/activate), manage items (delete)
- **QR Code Ready** — QR code field in item model (integration-ready)
- **Responsive** — Mobile-first design, works on all screen sizes

---

## Project Structure

```
findly/
├── backend/
│   ├── config/
│   │   ├── database.js         Mongoose connection + pool
│   │   ├── jwt.js              Token generate & verify
│   │   └── multer.js           File upload config (5MB, images only)
│   ├── controllers/
│   │   ├── auth.controller.js  Register, login, me, logout
│   │   ├── user.controller.js  Profile, updateProfile, changePassword, rate
│   │   ├── item.controller.js  Full CRUD + recover + match
│   │   ├── message.controller.js  Inbox, send, get messages
│   │   └── admin.controller.js Stats, users, items management
│   ├── middlewares/
│   │   ├── auth.middleware.js  protect + restrictTo (RBAC)
│   │   ├── error.middleware.js Global error handler + 404
│   │   └── validate.middleware.js express-validator runner
│   ├── models/
│   │   ├── user.model.js       Schema, bcrypt hook, toPublicJSON()
│   │   ├── item.model.js       Lost/found item schema with indexes
│   │   ├── message.model.js    Per-item conversation messages
│   │   └── rating.model.js     User ratings after recovery
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── item.routes.js
│   │   ├── message.routes.js
│   │   └── admin.routes.js
│   ├── services/
│   │   ├── auth.service.js     Auth business logic
│   │   ├── item.service.js     Item CRUD + matching + stats
│   │   └── message.service.js  Messaging + inbox grouping
│   ├── utils/
│   │   ├── AppError.js         Custom operational error class
│   │   ├── apiResponse.js      sendSuccess / sendError helpers
│   │   ├── logger.js           Winston logger
│   │   └── seed.js             Demo database seeder
│   ├── validations/
│   │   ├── auth.validation.js  express-validator rules
│   │   └── item.validation.js
│   ├── uploads/                Uploaded images stored here
│   ├── app.js                  Express setup + middleware pipeline
│   ├── server.js               Entry point + graceful shutdown
│   └── .env
│
└── frontend/
    ├── index.html
    ├── vite.config.js           Path aliases + backend proxy
    ├── tailwind.config.js       Custom brand colors + animations
    ├── postcss.config.js
    └── src/
        ├── main.jsx             React root + Toaster
        ├── App.jsx
        ├── index.css            Full Tailwind design system
        ├── context/
        │   └── AuthContext.jsx  useReducer auth state
        ├── hooks/
        │   └── useForm.js       Form state + validation + server errors
        ├── services/
        │   ├── api.js           Axios instance + interceptors
        │   ├── auth.service.js
        │   ├── item.service.js
        │   ├── message.service.js
        │   └── user.service.js
        ├── utils/
        │   ├── constants.js     Categories, status meta, API base
        │   └── helpers.js       cn, formatDate, timeAgo, getInitials
        ├── components/
        │   ├── ItemCard.jsx     Reusable item card with image + badges
        │   ├── ui/
        │   │   ├── Alert.jsx    Error/success/info/warning alerts
        │   │   ├── Avatar.jsx   Image or initials fallback
        │   │   ├── Badge.jsx    TypeBadge, StatusBadge, CategoryBadge
        │   │   ├── Button.jsx   Loading state + variants
        │   │   ├── Input.jsx    Label + error + left/right icons
        │   │   ├── Modal.jsx    Accessible overlay modal
        │   │   └── Spinner.jsx  Accessible loading spinner
        │   └── layout/
        │       └── Navbar.jsx   Responsive nav + dropdown + mobile
        ├── layouts/
        │   ├── MainLayout.jsx   Navbar + footer wrapper
        │   └── AuthLayout.jsx   Centered card for auth pages
        ├── routes/
        │   └── index.jsx        ProtectedRoute + PublicRoute + AdminRoute
        └── pages/
            ├── Home.jsx         Landing, stats, recent items, features
            ├── NotFound.jsx     404 page
            ├── auth/
            │   ├── Login.jsx    Show/hide password, demo accounts
            │   └── Register.jsx Password strength meter
            ├── items/
            │   ├── Browse.jsx   Filters, search, pagination
            │   ├── ItemDetail.jsx  Image gallery, messaging, owner card
            │   └── ReportItem.jsx  Multi-section report form + image upload
            ├── dashboard/
            │   ├── Dashboard.jsx   Welcome banner, stats, quick actions
            │   ├── MyItems.jsx     Tabbed item list with actions
            │   ├── Messages.jsx    Inbox + real-time-style chat UI
            │   └── Profile.jsx     Update profile + change password
            └── admin/
                └── AdminPanel.jsx  Stats, user table, item table
```

---

## Setup & Installation

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally **or** a MongoDB Atlas URI
- npm or yarn

---

### 1 — Backend

```bash
cd findly/backend

# Install dependencies
npm install

# Edit environment variables
# Open .env and update MONGO_URI and JWT_SECRET

# Seed demo data (optional but recommended)
npm run seed

# Start development server
npm run dev
# → API running at http://localhost:5000
```

---

### 2 — Frontend

```bash
cd findly/frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
# → App running at http://localhost:5173
```

---

### 3 — Open the App

Visit `http://localhost:5173`

**Demo Credentials (after running seed):**

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | admin@findly.com     | Admin@123  |
| User  | rahul@demo.com       | User@1234  |
| User  | priya@demo.com       | User@1234  |

---

## API Reference

### Auth `POST /api/auth/register`
```json
{ "name": "Rahul Sharma", "email": "rahul@example.com", "password": "Pass@123" }
```

### Auth `POST /api/auth/login`
```json
{ "email": "rahul@example.com", "password": "Pass@123" }
```

### Standard Success Response
```json
{ "success": true, "message": "...", "data": { ... } }
```

### Standard Error Response
```json
{ "success": false, "message": "...", "errors": [...] }
```

### All Endpoints

| Method | Endpoint                          | Auth  | Description              |
|--------|-----------------------------------|-------|--------------------------|
| POST   | /api/auth/register                | No    | Register user            |
| POST   | /api/auth/login                   | No    | Login                    |
| GET    | /api/auth/me                      | Yes   | Get current user         |
| POST   | /api/auth/logout                  | Yes   | Logout                   |
| GET    | /api/users/profile                | Yes   | Get profile              |
| PUT    | /api/users/profile                | Yes   | Update profile           |
| PUT    | /api/users/change-password        | Yes   | Change password          |
| POST   | /api/users/rate                   | Yes   | Rate a user              |
| GET    | /api/items                        | No    | Browse items (+ filters) |
| GET    | /api/items/stats                  | No    | Platform statistics      |
| GET    | /api/items/my                     | Yes   | My items                 |
| GET    | /api/items/:id                    | No    | Item detail              |
| POST   | /api/items                        | Yes   | Create item (multipart)  |
| PUT    | /api/items/:id                    | Yes   | Update item              |
| DELETE | /api/items/:id                    | Yes   | Delete item              |
| POST   | /api/items/:id/recover            | Yes   | Mark recovered           |
| POST   | /api/items/:id/match              | Yes   | Match two items          |
| GET    | /api/messages/inbox               | Yes   | Get inbox                |
| GET    | /api/messages/:itemId             | Yes   | Item conversation        |
| POST   | /api/messages                     | Yes   | Send message             |
| GET    | /api/admin/stats                  | Admin | Platform stats           |
| GET    | /api/admin/users                  | Admin | All users                |
| PUT    | /api/admin/users/:id/toggle       | Admin | Suspend / activate       |
| GET    | /api/admin/items                  | Admin | All items                |
| DELETE | /api/admin/items/:id              | Admin | Delete item              |

---

## Environment Variables

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/findly
JWT_SECRET=findly_jwt_secret_change_in_production_min32chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Findly
```

---

## Security Checklist

- [x] Helmet — 11 secure HTTP headers
- [x] CORS — restricted to CLIENT_URL
- [x] Rate limiting — 15/15min on auth, 200/15min on API
- [x] MongoDB sanitisation — strips NoSQL injection operators
- [x] bcrypt — cost factor 12
- [x] JWT — verified on every protected request
- [x] Password field — `select: false` by default (never leaked)
- [x] express-async-errors — no uncaught promise rejections
- [x] Graceful shutdown — SIGTERM handled cleanly

---

## Future Enhancements (from project report)

- **Socket.io** — Real-time notifications and live messaging
- **Google Maps API** — Visual map picker for item location
- **QR Code Generation** — `qrcode` npm package for item tags
- **AI Image Matching** — TensorFlow.js or cloud Vision API
- **Smart Device Integration** — AirTag, Tile webhook support
- **Blockchain Ownership** — Tamper-proof recovery records
- **Push Notifications** — Firebase Cloud Messaging
- **Multi-language Support** — i18n for regional expansion

---

**Built as a production-ready MERN internship project demonstrating full-stack development best practices.**
