# IMovies: Online Movie Ticket Booking Web Application
## Comprehensive Academic Project Report & Viva Voce Guide
**Course:** Bachelor of Technology (B.Tech) / Bachelor of Computer Applications (BCA)  
**Specialization:** Full-Stack Web Development & Software Architecture  
**Author / Lead Developer:** Rehma Fatema Shaikh  
**Technology Stack:** React.js, Node.js, Express.js, MongoDB (Mongoose ODM), JWT, Tailwind CSS

---

## 1. Abstract
The **IMovies** platform is an enterprise-grade, client-server web application designed to digitize and optimize the movie ticketing workflow for cinema chains and independent multiplexes. The platform provides real-time seat availability visualization, atomic seat reservation with strict concurrency control against double-booking, role-based user and administrative access, automated tax and fee calculations, digital barcode/QR boarding pass generation, and an administrator dashboard for screening management. Built with a decoupled three-tier architecture utilizing React 19, an Express REST API, and MongoDB with Mongoose, the system guarantees high performance, transactional safety, and responsive cross-device usability.

---

## 2. Problem Statement & Existing vs. Proposed System
### 2.1 Problem Statement
Traditional box office operations and rudimentary web portals frequently experience:
1. **Concurrency Race Conditions:** Simultaneous booking requests for the same seat result in double allocation and customer disputes.
2. **Coupled Seat Inventories:** Storing seat statuses on the physical theatre model rather than per individual showtime causes erroneous scheduling blockages.
3. **Insecure Client-Side Logic:** Computing ticket prices and totals in the browser client allows malicious tampering.
4. **Poor Administrative Observability:** Inability to inspect real-time occupancy rates, block maintenance seats, or schedule dynamic showtimes.

### 2.2 Comparative Analysis
| Metric / Feature | Existing / Legacy System | Proposed IMovies System |
|---|---|---|
| **Architecture** | Monolithic server-rendered or manual counter | Decoupled React SPA + Node/Express REST API |
| **Seat Availability** | Static or polling-delayed | Real-time showtime-specific seat inventory |
| **Double Booking Protection** | Prone to race conditions | Atomic server validation returning HTTP 409 Conflict |
| **Authentication** | Plaintext sessions / cookie lock-in | Stateless JWT with bcrypt password hashing |
| **Admin Control** | Manual database scripts | Interactive dashboard with revenue & occupancy metrics |
| **E-Ticket Delivery** | Physical paper tickets | Digital verifiable ticket pass with QR and print engine |

---

## 3. Project Objectives & Scope
- **User Discovery:** Allow users to explore now-showing and upcoming movies with genres, trailers, and certifications.
- **Showtime & Multiplex Selection:** Enable users to pick desired dates, multiplex screens (e.g., IMAX 3D, Dolby Atmos), and times.
- **Interactive Seat Reservation:** Visual seat grid with distinct tiers (Silver, Gold, Platinum Recliner) and live status.
- **Double-Booking Prevention:** Guaranteed server-side rejection of colliding reservations.
- **Booking Management:** Allow users to view booking histories, print tickets, or cancel bookings to release seats back to the public.
- **Cinema Administration:** Provide privileged administrators with revenue analytics, movie CRUD, showtime scheduler, and seat blocking tools.

---

## 4. System Architecture
```
               [ Browser / Mobile Client ]
                     (React 19 SPA)
                            |
                     HTTPS / JSON REST
                            |
                            v
               [ Express.js REST API Server ]
       +---------------------------------------------+
       | - Authentication & JWT Middleware           |
       | - Role Authorization (User vs Admin)        |
       | - Movie, Theatre, & Show Controllers        |
       | - Atomic Concurrency Booking Engine         |
       | - Centralized Error Handler (HTTP 400/409)  |
       +---------------------------------------------+
                            |
                  Mongoose ODM Queries
                            |
                            v
               [ MongoDB Data Store ]
       +---------------------------------------------+
       | - Users Collection                          |
       | - Movies Collection                         |
       | - Theatres Collection                       |
       | - Shows Collection (w/ Seat Inventories)    |
       | - Bookings Collection                       |
       +---------------------------------------------+
```

---

## 5. Entity-Relationship (ER) Architecture
```
+------------------+         1:N          +--------------------+
|      USER        | <------------------- |      BOOKING       |
+------------------+                      +--------------------+
| _id (PK)         |                      | _id (PK)           |
| name             |                      | bookingReference   |
| email (Unique)   |                      | userId (FK->User)  |
| passwordHash     |                      | showId (FK->Show)  |
| role [user|admin]|                      | movieId (FK->Movie)|
| phone            |                      | selectedSeats[]    |
| createdAt        |                      | subtotal           |
+------------------+                      | totalAmount        |
         |                                | bookingStatus      |
         |                                | qrCodeData         |
         | 1:N                            +--------------------+
         v                                          |
+------------------+         1:N                    | N:1
|      MOVIE       | <--------------------+         v
+------------------+                      | +--------------------+         N:1         +------------------+
| _id (PK)         |                      +-|       SHOW         | ------------------> |     THEATRE      |
| title            |                        +--------------------+                     +------------------+
| description      |                        | _id (PK)           |                     | _id (PK)         |
| genre[]          |                        | movieId (FK)       |                     | name             |
| duration         |                        | theatreId (FK)     |                     | location         |
| rating           |                        | showDate           |                     | address          |
| status           |                        | startTime          |                     | totalSeats (60)  |
| posterUrl        |                        | tierPrices {}      |                     | seatLayout {}    |
| bannerUrl        |                        | seatInventory[]    |                     | amenities[]      |
+------------------+                        +--------------------+                     +------------------+
```

---

## 6. Data Flow Diagrams (DFD)
### 6.1 Level 0: Context Diagram
```
           +-------------------------------------------------------------+
           |                                                             |
[ Patron ] |  1. Credentials (Login/Register)                           |
           |============================================================>|
           |  2. Token + Catalog + Shows + Seats                         |
           |<------------------------------------------------------------|  [ IMOVIES ]
           |  3. Reserve Seats + Payment                                 |  [ PLATFORM]
           |============================================================>|
           |  4. Confirmed E-Ticket & Reference                          |
           |<------------------------------------------------------------|
           |                                                             |
           |  5. Manage Movies, Shows, & Maintenance Blocks              |
 [ Admin ] |============================================================>|
           |  6. Real-time Revenue & Occupancy Analytics                 |
           |<------------------------------------------------------------|
           +-------------------------------------------------------------+
                                         ||
                                         || Mongoose Queries
                                         \/
                                [ MongoDB Database ]
```

### 6.2 Level 1: Operational Flow
1. **Authentication Process:** Receives email/password; validates against `users` collection using `bcrypt.compare`; returns JWT bearer token.
2. **Movie Catalog Process:** Queries `movies` collection filtered by genre, search keyword, and status (`now-showing` vs `upcoming`).
3. **Showtime Query Process:** Retrieves `shows` indexed by `(movieId, showDate, theatreId)`. Attaches full seat layout and real-time seat inventory.
4. **Atomic Booking Transaction:**
   - Locks requested seat array (`['C4', 'C5']`).
   - Verifies each seat has `status === 'available'`. If any seat is booked or blocked, throws HTTP 409 Conflict.
   - Authoritatively computes subtotal from show tier prices, adds convenience fee ($2.50/seat) and tax (8%).
   - Generates unique reference `IMV-YYYY-XXXX` and digital QR code payload.
   - Updates seat inventory to `booked` and creates `booking` record.
5. **Cancellation & Seat Release:** Verifies customer identity, marks booking as `cancelled`, and marks seats back to `available`.

---

## 7. Mongoose Database Schema Specifications
### 7.1 MongoDB Connection Code & Technical Explanation (Assignment Specification)
```javascript
// 1. Load the Mongoose ODM library
const mongoose = require('mongoose');

// 2. Establish connection to local MongoDB instance
mongoose.connect('mongodb://127.0.0.1:27017/Imovies', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
// 3. Success Promise Callback
.then(() => console.log('Connected to MongoDB'))
// 4. Error Catch Callback
.catch((err) => console.error('MongoDB connection error:', err));
```

#### Detailed Line-by-Line Breakdown:
1. **`const mongoose = require('mongoose');`**
   - **Purpose:** Loads the Mongoose library so you can use it in your application. Mongoose is a powerful Object Data Modeling (ODM) tool that helps interact with MongoDB using JavaScript objects.
2. **`mongoose.connect('mongodb://127.0.0.1:27017/Imovies', { useNewUrlParser: true, useUnifiedTopology: true })`**
   - **`mongodb://`**: Specifies the standard MongoDB protocol.
   - **`127.0.0.1`**: Localhost IP address – indicates that the database is running on your local machine.
   - **`27017`**: Default network port for MongoDB daemon.
   - **`Imovies`**: Name of the database you want to use. If this database does not exist, MongoDB creates it automatically once data is inserted.
   - **`useNewUrlParser: true`**: Uses MongoDB's updated URL string parser.
   - **`useUnifiedTopology: true`**: Enables the new connection engine, which improves connection stability and performance.
3. **`.then(() => console.log('Connected to MongoDB'))`**
   - If the connection is successful, this code runs. It prints a confirmation message to your console: `"Connected to MongoDB"`.
4. **`.catch((err) => console.error('MongoDB connection error:', err));`**
   - If the connection fails, the error is caught here. Helps with debugging by printing the error details.

---

## 8. RESTful API Endpoint Matrix
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account with hashed password |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and return JWT |
| `GET` | `/api/auth/me` | Authenticated | Fetch current user profile |
| `GET` | `/api/movies` | Public | Get movie directory with search & genre filtering |
| `GET` | `/api/movies/:id` | Public | Get movie details, cast, director, and banner |
| `POST` | `/api/movies` | Admin | Create new movie record |
| `PUT` | `/api/movies/:id` | Admin | Update existing movie details |
| `DELETE` | `/api/movies/:id` | Admin | Delete movie and cascade show removal |
| `GET` | `/api/theatres` | Public | List theatres and seating layouts |
| `GET` | `/api/shows` | Public | Query shows filtered by movie, theatre, and date |
| `GET` | `/api/shows/:id/seats` | Public | Fetch live seat availability for specific show |
| `POST` | `/api/shows` | Admin | Schedule a new showtime and generate seat layout |
| `PATCH` | `/api/shows/:id/seats/block`| Admin | Block or unblock seats for maintenance |
| `POST` | `/api/bookings` | Authenticated | Atomically book seats with concurrency check |
| `GET` | `/api/bookings/my` | Authenticated | Retrieve customer's personal bookings |
| `GET` | `/api/bookings/:id` | Authenticated | Get booking details (with ownership check) |
| `PATCH` | `/api/bookings/:id/cancel` | Authenticated | Cancel booking and release seats back to show |
| `GET` | `/api/admin/dashboard` | Admin | Aggregate revenue, occupancy, and summary stats |
| `POST` | `/api/admin/reset-database` | Admin | Reset database to clean demonstration seed |

---

## 9. Comprehensive Testing & Validation Scenarios
| Test ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| **TC-01** | Register user with existing email | Return HTTP 409 "Account already exists" | Handled with HTTP 409 conflict | Pass |
| **TC-02** | Login with incorrect password | Return HTTP 401 "Invalid email or password" | Handled with HTTP 401 | Pass |
| **TC-03** | Access `/api/admin/dashboard` as regular user | Return HTTP 403 Forbidden | Blocked with HTTP 403 | Pass |
| **TC-04** | Normal booking flow for available seats | Status 201, reference generated, seats marked booked | Seats reserved atomically | Pass |
| **TC-05** | Concurrent attempt to book same seat | Return HTTP 409 Conflict with conflict list | Handled with HTTP 409 | Pass |
| **TC-06** | Booking cancellation by owner | Booking marked cancelled, seats returned to available | Seats released back to show | Pass |
| **TC-07** | Tampering with prices in request | Server recalculates price from database tier prices | Client price ignored | Pass |
| **TC-08** | Booking more than 8 seats in one order | Return HTTP 400 "Max 8 seats allowed" | Enforced on server & client | Pass |

---

## 10. Top 10 Viva Voce Questions & Answers for B.Tech Defense
1. **Q: Why did you choose MongoDB over a traditional relational database (RDBMS)?**  
   *A:* MongoDB provides document flexibility with nested schemas, allowing us to store dynamic seat inventories directly within show documents without complex multi-table joins. Mongoose ensures strict schema validation and type safety.

2. **Q: How does the system handle the double-booking problem?**  
   *A:* When a booking request arrives, the server performs an atomic validation step where it verifies that all requested seat IDs are strictly in the `'available'` state. If any seat is already booked or held, the transaction is rejected with HTTP 409 Conflict and no seats are modified.

3. **Q: Why is seat inventory kept at the Show level rather than Theatre level?**  
   *A:* Physical theatre layouts are static (60 seats), but seat occupancy changes for every showtime. If seats were booked on the Theatre model, booking a 2:00 PM show would improperly block the 6:00 PM show.

4. **Q: How are user passwords secured?**  
   *A:* Passwords are never stored in plaintext. We use `bcryptjs` with 10 salt rounds to generate a cryptographic one-way hash.

5. **Q: How is role-based authorization implemented?**  
   *A:* We implement Express middleware (`requireAdmin`) that inspects the decoded JWT token payload. If `req.user.role !== 'admin'`, the request is immediately rejected with HTTP 403 Forbidden.

---

## 11. Conclusion & Future Enhancements
The **IMovies** web application successfully demonstrates a scalable, production-grade architecture for cinema ticket booking. Future enhancements include:
1. Integration with real payment gateways (Stripe / Razorpay).
2. Live WebSocket seat lock notifications using Socket.io.
3. Push notification reminders 2 hours before showtime.
4. Cinema loyalty reward points and concession combo ordering.
