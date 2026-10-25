# Functional Software Design (FSD) Document
## Project Name: iMovies — Online Movie Ticket Booking Platform
**Document Version:** 1.0.0  
**Prepared For:** Academic Capstone / B.Tech Major Project Submission  
**Author / Lead Architect:** Rehma Fatema Shaikh  
**Target Environment:** Full-Stack MERN (MongoDB Atlas, Express.js, React.js Vite, Node.js)  
**Security Framework:** JSON Web Tokens (JWT), bcryptjs Salt Hashing, Role-Based Access Control (RBAC)  
**Status:** Approved for Implementation & Production Deployment  

---

## 1. Document Overview & Metadata

### 1.1 Document Purpose
This Functional Software Design (FSD) specification establishes the architectural, operational, structural, and behavioral baseline for **iMovies** — a modern, full-stack cinema ticket booking web application. It translates academic and real-world cinema business requirements into technical design specifications for software engineers, database administrators, and project evaluators.

### 1.2 Technology Stack Summary
- **Client Tier:** React 19 SPA, TypeScript, Vite Bundler, Tailwind CSS, Lucide React, Canvas Confetti.
- **Server Tier:** Node.js (v18+ LTS), Express.js RESTful API, JSON Web Token (JWT) stateless session handling, bcryptjs cryptographic hashing.
- **Data Persistence Tier:** MongoDB Community / MongoDB Atlas Cluster, Mongoose Object Data Modeling (ODM) with strict schema validation and compound indexing.
- **API Architecture:** REST (Representational State Transfer) with standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `500 Internal Server Error`).

---

## 2. Executive Summary, System Purpose, and Scope

### 2.1 Executive Summary
**iMovies** is a high-performance web platform designed to streamline the discovery, scheduling, and reservation of movie tickets across multiplexes and boutique cinemas. By solving the classical cinema concurrency dilemma (simultaneous booking attempts for identical seats), iMovies guarantees zero double bookings through server-authoritative atomic seat reservation checks.

### 2.2 System Purpose
The primary purpose of iMovies is to replace obsolete manual counter ticketing and rigid desktop booking clients with a responsive, browser-accessible platform that offers:
1. Real-time visual seat selection across tiered seating categories (Silver, Gold, and Platinum Recliner).
2. Transparent price breakdowns including ticket base fares, per-seat convenience fees, and regional amusement taxes.
3. Instant digital pass issuance featuring unique alphanumeric booking references and scannable QR ticket tokens.
4. Comprehensive administrative visibility over revenue analytics, capacity utilization, screening schedules, and seat maintenance.

### 2.3 System Scope
- **In Scope:**
  - Public movie catalog discovery with live search, genre filters, and status separation (`now-showing` vs. `upcoming`).
  - Detailed feature film briefs with trailer embeds, cast, runtime, and MPAA/CBFC certification.
  - Multi-theatre and multi-day showtime selector with format indicators (IMAX 3D, Dolby Atmos, 4DX).
  - Stateful seat layout map with live status visualization (Available, Selected, Reserved/Sold, Blocked).
  - Atomic booking transaction engine with simulated multi-gateway checkout.
  - Customer booking history with one-click cancellation and automatic seat release back to the pool.
  - Role-protected administrator portal with live metrics, movie CRUD, showtime scheduler, and VIP/maintenance seat locking.
- **Out of Scope (Future Phases):**
  - Native hardware POS thermal printer integration.
  - Third-party food and beverage (F&B) delivery logistics tracking.

---

## 3. User Roles & Permission Matrix

The application strictly enforces **Role-Based Access Control (RBAC)** through server-side JWT verification middleware.

| Role Identifier | Description & Access Privileges |
|---|---|
| **Guest / Anonymous Patron** | Unauthenticated user. Can browse movie directory, watch trailers, inspect theatre showtimes, view seat maps, and initiate registration/login. Cannot finalize bookings. |
| **Customer (`user`)** | Authenticated moviegoer. Can select and reserve up to 8 seats per order, receive digital boarding passes, access personal booking history, and cancel eligible upcoming tickets. |
| **Cinema Administrator (`admin`)** | Elevated operations manager. Has unrestricted access to the Admin Dashboard, financial metrics, movie catalog CRUD, screening schedule creation, and seat maintenance tools. |

### Permission Matrix

| Feature / Action | Guest | Customer (`user`) | Admin (`admin`) |
|---|:---:|:---:|:---:|
| Browse Movies & Search Catalog | ✅ | ✅ | ✅ |
| View Movie Details & Trailer | ✅ | ✅ | ✅ |
| Check Real-time Seat Availability | ✅ | ✅ | ✅ |
| Reserve Seats & Complete Checkout | ❌ | ✅ | ✅ |
| View Personal Bookings & E-Tickets | ❌ | ✅ | ✅ |
| Cancel Owned Booking & Release Seats | ❌ | ✅ | ✅ |
| View Financial Revenue & Occupancy Analytics | ❌ | ❌ | ✅ |
| Add, Modify, or Delete Movie Titles | ❌ | ❌ | ✅ |
| Schedule Showtimes & Screen Formats | ❌ | ❌ | ✅ |
| Lock / Unlock Seats for Maintenance | ❌ | ❌ | ✅ |
| Reset System Seed Database | ❌ | ❌ | ✅ |

---

## 4. System Architecture & MERN Data Flow

### 4.1 Tiered Architectural Blueprint
```
+-------------------------------------------------------------------------+
|                          PRESENTATION LAYER                             |
|          React 19 SPA + Vite + Tailwind CSS + Context State             |
|   [Home Page]   [Catalog]   [SeatMap]   [Checkout]   [Admin Dashboard]  |
+-------------------------------------------------------------------------+
                                   |  ^
     HTTPS REST API (JSON Body)    |  |  JSON Response / JWT Token
                                   v  |
+-------------------------------------------------------------------------+
|                          APPLICATION LAYER                              |
|           Node.js Runtime & Express.js RESTful Controller               |
|   - Authentication Middleware (verifyToken, requireAdmin)               |
|   - Concurrency Engine (Atomic Seat Validation & 409 Conflict Guard)   |
|   - Financial Billing Calculator (Subtotal + Convenience Fee + Tax)     |
|   - Controllers: Auth, Movie, Theatre, Show, Booking, Admin             |
+-------------------------------------------------------------------------+
                                   |  ^
           Mongoose ODM Driver     |  |  BSON Documents / Cursor Streams
                                   v  |
+-------------------------------------------------------------------------+
|                            DATA LAYER                                   |
|                MongoDB Community / MongoDB Atlas                        |
|   Collections: users | movies | theatres | shows | bookings             |
+-------------------------------------------------------------------------+
```

### 4.2 End-to-End Booking Data Flow
```
[User Browser]                  [Express Server]                 [MongoDB]
      |                                |                             |
      | 1. Selects seats ['C4', 'C5']  |                             |
      | 2. Submits POST /api/bookings  |                             |
      |------------------------------->|                             |
      |                                | 3. Query show seat inventory|
      |                                |---------------------------->|
      |                                |<----------------------------|
      |                                |    Returns current seats    |
      |                                |                             |
      |                                | 4. Check status === 'avail' |
      |                                |    IF booked: Return 409    |
      |                                |    ELSE: Compute prices     |
      |                                |                             |
      |                                | 5. Atomically mark 'booked' |
      |                                |    & insert booking record  |
      |                                |---------------------------->|
      |                                |<----------------------------|
      | 6. HTTP 201 Confirmed Pass     |                             |
      |<-------------------------------|                             |
      | 7. Displays QR E-Ticket & Pass |                             |
```

---

## 5. Functional Requirements & Core Workflows

### 5.1 Module 1: User Authentication & Profile Management
- **FR-1.1:** System shall provide user registration requiring `name`, unique `email`, `password` (minimum 6 characters), and optional `phone`.
- **FR-1.2:** Passwords must be hashed using `bcryptjs` with 10 salt rounds prior to persistence. Plaintext passwords must never be stored or logged.
- **FR-1.3:** Upon successful authentication, the server generates a signed JSON Web Token (JWT) with a 7-day validity containing `_id`, `email`, `name`, and `role`.
- **FR-1.4:** Client application securely stores the JWT in browser storage and injects it into the HTTP `Authorization: Bearer <token>` header for protected endpoints.
- **FR-1.5:** Pre-seeded demonstration credentials (`admin@imovies.com` / `Admin@123` and `user@imovies.com` / `User@123`) must be accessible via one-click demo triggers for review and viva defense.

### 5.2 Module 2: Movie Catalog & Discovery
- **FR-2.1:** System provides a searchable and filterable movie catalog.
- **FR-2.2:** Real-time search query matching across title, director, and cast members with debounce optimization.
- **FR-2.3:** Filtering by genre (`Action`, `Sci-Fi`, `Drama`, `Animation`, `Adventure`, `Biography`, `Crime`) and status (`now-showing` vs. `upcoming`).
- **FR-2.4:** Sorting criteria by rating (descending), release date (newest first), or title (alphabetical A-Z).
- **FR-2.5:** Movie details view rendering high-resolution backdrop banner, poster, duration, rating, synopsis, full cast, certificate, and trailer embed modal.

### 5.3 Module 3: Theatre Scheduling & Showtime Selection
- **FR-3.1:** Display theatres screening the selected movie across a rolling 4-day scheduling window (`Today`, `Tomorrow`, `Day +2`, `Day +3`).
- **FR-3.2:** Display auditorium format badges (`IMAX 3D`, `Dolby Atmos`, `4DX`, `Standard 2D`) and starting ticket price per show.
- **FR-3.3:** Shows must decouple seat inventories so that reserving a seat in a 2:00 PM show does not affect subsequent shows at 6:00 PM in the same hall.

### 5.4 Module 4: Visual Seat Selection & Concurrency Guard
- **FR-4.1:** Render an interactive cinema auditorium layout with a curved, glowing cinema screen indicator at the top.
- **FR-4.2:** Seating rows are tiered: Rows A & B (Silver Tier), Rows C & D (Gold Tier), Rows E & F (Platinum Recliner Tier).
- **FR-4.3:** Center aisle spacing between columns 5 and 6 to emulate physical cinema architecture.
- **FR-4.4:** Enforce a maximum transaction cap of 8 seats per booking to prevent hoarding.
- **FR-4.5 (Double-Booking Prevention):** During checkout, the server authoritatively validates that all requested seat codes have `status === 'available'`. If any seat has already been reserved by a concurrent user, the transaction aborts immediately, returning `HTTP 409 Conflict` with the list of conflicting seat identifiers.

### 5.5 Module 5: Checkout & E-Ticket Boarding Pass
- **FR-5.1:** Server-authoritative computation of financial figures:
  $$\text{Subtotal} = \sum \text{Seat Tier Prices}$$
  $$\text{Convenience Fee} = \$2.50 \times \text{Number of Tickets}$$
  $$\text{Amusement Tax} = \text{Subtotal} \times 8\%$$
  $$\text{Total Amount} = \text{Subtotal} + \text{Convenience Fee} + \text{Tax}$$
- **FR-5.2:** Generates a unique, standardized booking reference formatted as `IMV-YYYY-XXXX` (e.g., `IMV-2026-8942`).
- **FR-5.3:** Generates a verifiable QR code token encoding the reference, customer name, and seat allocation.
- **FR-5.4:** Printable ticket pass view compatible with standard browser `window.print()` stylesheets.

### 5.6 Module 6: Booking Cancellation & Inventory Release
- **FR-6.1:** Customers can inspect their booking history, segmented into Confirmed and Cancelled tickets.
- **FR-6.2:** A customer can cancel any eligible booking owned by their user ID.
- **FR-6.3:** Upon cancellation, the booking status transitions to `cancelled`, payment status updates to `refunded`, and all allocated seats are atomically released back to `status: 'available'` in the corresponding showtime document.

### 5.7 Module 7: Cinema Administrative Control Center
- **FR-7.1:** Executive metric counters computing total revenue, confirmed ticket volume, overall auditorium occupancy percentage, and total scheduled screenings.
- **FR-7.2:** Movie catalog management: Add new movie with poster/banner URLs, edit existing movie metadata, delete movie (with cascading show removal).
- **FR-7.3:** Showtime scheduling tool: Select movie, theatre, date, start time, format, and custom tier prices.
- **FR-7.4:** Seat maintenance tool: Privileged ability to lock/block specific seats (e.g., `A1`, `F10`) for damaged equipment or VIP reservations, or unlock them back to available status.
- **FR-7.5:** Database reset tool: Single-click utility restoring the application back to the standard demonstration seed state.

---

## 6. Data Architecture & Mongoose Database Schemas

### 6.1 Database Connection Configuration (Standard Assignment Syntax)
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Imovies', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));
```

### 6.2 User Schema (`users` collection)
```typescript
const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String, trim: true }
}, { timestamps: true });
```

### 6.3 Movie Schema (`movies` collection)
```typescript
const MovieSchema = new Schema({
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true },
  genre: { type: [String], required: true },
  language: { type: String, default: 'English' },
  duration: { type: Number, required: true }, // Minutes
  releaseDate: { type: String, required: true },
  posterUrl: { type: String, required: true },
  bannerUrl: { type: String, required: true },
  cast: { type: [String], default: [] },
  director: { type: String, required: true },
  rating: { type: Number, min: 0, max: 10, default: 8.0 },
  trailerUrl: { type: String, default: '' },
  certificate: { type: String, default: 'PG-13' },
  status: { type: String, enum: ['now-showing', 'upcoming'], default: 'now-showing', index: true }
}, { timestamps: true });
```

### 6.4 Theatre Schema (`theatres` collection)
```typescript
const TheatreSchema = new Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, default: 'Metro City' },
  screens: { type: [String], default: [] },
  totalSeats: { type: Number, default: 60 },
  seatLayout: {
    totalRows: { type: Number, default: 6 },
    seatsPerRow: { type: Number, default: 10 },
    tiers: [{ name: String, price: Number, rows: [String] }]
  },
  amenities: { type: [String], default: [] }
}, { timestamps: true });
```

### 6.5 Show Schema (`shows` collection)
```typescript
const ShowSchema = new Schema({
  movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
  theatreId: { type: Schema.Types.ObjectId, ref: 'Theatre', required: true, index: true },
  showDate: { type: String, required: true, index: true }, // Format: YYYY-MM-DD
  startTime: { type: String, required: true },
  screenFormat: { type: String, default: 'IMAX 3D' },
  screenName: { type: String, default: 'Screen 1' },
  basePrice: { type: Number, default: 16 },
  tierPrices: {
    Silver: { type: Number, default: 12 },
    Gold: { type: Number, default: 16 },
    Platinum: { type: Number, default: 22 }
  },
  seatInventory: [{
    seatNumber: { type: String, required: true },
    row: { type: String, required: true },
    col: { type: Number, required: true },
    tier: { type: String, enum: ['Silver', 'Gold', 'Platinum'] },
    price: { type: Number, required: true },
    status: { type: String, enum: ['available', 'booked', 'blocked'], default: 'available' }
  }],
  status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' }
}, { timestamps: true });

ShowSchema.index({ movieId: 1, showDate: 1, theatreId: 1 });
```

### 6.6 Booking Schema (`bookings` collection)
```typescript
const BookingSchema = new Schema({
  bookingReference: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  showId: { type: Schema.Types.ObjectId, ref: 'Show', required: true, index: true },
  movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatreId: { type: Schema.Types.ObjectId, ref: 'Theatre', required: true },
  selectedSeats: { type: [String], required: true },
  seatsDetail: [{
    seatNumber: String,
    tier: String,
    price: Number
  }],
  numberOfTickets: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
  convenienceFee: { type: Number, default: 2.5 },
  tax: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  bookingStatus: { type: String, enum: ['confirmed', 'cancelled', 'pending'], default: 'confirmed' },
  paymentStatus: { type: String, enum: ['paid', 'refunded', 'failed'], default: 'paid' },
  paymentMethod: { type: String, default: 'Credit Card (Simulated Gateway)' },
  bookedAt: { type: Date, default: Date.now },
  cancelledAt: { type: Date },
  qrCodeData: { type: String, required: true },
  customerName: String,
  customerEmail: String
}, { timestamps: true });
```

---

## 7. REST API Specifications Table

All endpoints reside under the `/api` route prefix. Protected endpoints require the HTTP header `Authorization: Bearer <token>`.

| Route / Endpoint | Method | Access Level | Description | Status Codes |
|---|:---:|:---:|---|:---:|
| `/api/auth/register` | `POST` | Public | Register new user account with hashed password | `201`, `400`, `409` |
| `/api/auth/login` | `POST` | Public | Authenticate user credentials & issue JWT token | `200`, `400`, `401` |
| `/api/auth/me` | `GET` | Authenticated | Retrieve currently signed-in user profile | `200`, `401` |
| `/api/movies` | `GET` | Public | List movies with optional `genre`, `status`, `search` | `200`, `500` |
| `/api/movies/:id` | `GET` | Public | Retrieve detailed metadata for a single movie | `200`, `404` |
| `/api/movies` | `POST` | Admin Only | Add a new feature movie to the catalog | `201`, `400`, `403` |
| `/api/movies/:id` | `PUT` | Admin Only | Update existing movie information | `200`, `404`, `403` |
| `/api/movies/:id` | `DELETE` | Admin Only | Delete movie and cascade associated shows | `200`, `404`, `403` |
| `/api/theatres` | `GET` | Public | Retrieve registered cinema multiplexes & amenities | `200`, `500` |
| `/api/theatres/:id` | `GET` | Public | Retrieve single theatre layout configuration | `200`, `404` |
| `/api/shows` | `GET` | Public | Query shows filtered by `movieId`, `theatreId`, `date`| `200`, `500` |
| `/api/shows/:id` | `GET` | Public | Retrieve specific showtime details and pricing | `200`, `404` |
| `/api/shows/:id/seats`| `GET` | Public | Fetch real-time seat inventory for this showtime | `200`, `404` |
| `/api/shows` | `POST` | Admin Only | Schedule a new showtime and populate seats | `201`, `400`, `403` |
| `/api/shows/:id` | `DELETE` | Admin Only | Remove showtime from the schedule | `200`, `404`, `403` |
| `/api/shows/:id/seats/block` | `PATCH` | Admin Only | Block / unblock seats for maintenance/VIP | `200`, `400`, `403` |
| `/api/bookings` | `POST` | Authenticated | Atomically book seats with concurrency verification | `201`, `400`, `409` |
| `/api/bookings/my` | `GET` | Authenticated | Retrieve caller's personal booking history | `200`, `401` |
| `/api/bookings/:id` | `GET` | Authenticated | Retrieve single booking pass (ownership checked) | `200`, `403`, `404` |
| `/api/bookings/:id/cancel` | `PATCH` | Authenticated | Cancel booking and release seats back to show | `200`, `400`, `403` |
| `/api/admin/dashboard`| `GET` | Admin Only | Aggregate revenue, occupancy, and inventory stats | `200`, `403` |
| `/api/admin/bookings` | `GET` | Admin Only | View full list of all system reservations | `200`, `403` |
| `/api/admin/reset-database` | `POST` | Admin Only | Re-seed database with clean demonstration data | `200`, `403` |
| `/api/health` | `GET` | Public | Operational health check & active DB engine status | `200` |

---

## 8. Non-Functional Requirements (NFR)

### 8.1 Security & Protection (NFR-1)
- **Password Protection:** Cryptographic salt hashing using `bcryptjs` with a work factor of 10. Passwords are never returned in JSON responses.
- **Stateless Authorization:** Tokens signed using HMAC SHA-256 with a private secret (`JWT_SECRET`). Expiration enforced at 7 days.
- **Ownership Verification:** A user cannot view or cancel bookings belonging to another customer (`req.user._id === booking.userId`).
- **Input Sanitization:** Express body parsers and strict Mongoose schema types mitigate NoSQL injection vectors.

### 8.2 Performance & Concurrency (NFR-2)
- **Response Latency:** Server API response time is targeted under 150ms for catalog queries and under 250ms for atomic reservation transactions.
- **Seat Race Condition Handling:** When 2+ concurrent requests contend for identical seats, the first request to lock and commit reserves the seats; subsequent requests receive an immediate `HTTP 409 Conflict` containing the conflicting seat codes without modifying data.
- **Database Indexing:** Compound indexes on `shows (movieId, showDate, theatreId)` and unique indexes on `users.email` and `bookings.bookingReference` ensure $O(\log n)$ search efficiency.

### 8.3 Reliability & Resilience (NFR-3)
- **Zero-Config Dual-Mode Persistence:** If a local MongoDB daemon or Atlas instance is active, the app connects natively via Mongoose. If running in a cloud preview container or network-restricted sandbox, it activates a built-in memory/JSON persistence engine so the application remains 100% operational without crashing.
- **Graceful Error Handling:** Centralized error-handling middleware intercepts runtime exceptions, prevents server process crashes, and returns sanitized error responses without leaking stack traces.

### 8.4 Usability & Responsive UI (NFR-4)
- **Cinema-Inspired Aesthetic:** High-contrast palette (`#090b0e` deep black, `#12151b` charcoal, crimson `#e11d48` accents, and amber `#f59e0b` highlights).
- **Responsive Layout:** WCAG AA contrast compliance, responsive flex/grid layouts supporting viewports from 375px mobile screens up to 4K ultra-wide monitors.
- **Print Optimization:** Dedicated `@media print` CSS selectors ensure that clicking "Print E-Ticket" isolates the digital boarding pass while suppressing navigation bars and extraneous UI elements.

---

## 9. Conclusion
This Functional Software Design (FSD) document outlines the architectural and engineering specifications for **iMovies**. By coupling a modern React frontend with a secure Express backend and an independent, showtime-level MongoDB data model, iMovies satisfies all academic capstone criteria while presenting an industry-grade commercial solution for modern cinema ticketing.
