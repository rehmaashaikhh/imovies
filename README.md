# 🎬 IMovies – Online Movie Ticket Booking Web Application
> A modern, full-stack, college-project-ready movie ticket booking platform built with React, Node.js, Express, MongoDB (Mongoose), and Tailwind CSS.

---

## 🌟 Key Features
- **Cinematic Dark UI:** High-contrast cinema aesthetics with black/charcoal backgrounds and gold/crimson accents.
- **Movie Catalog & Discovery:** Browse now-showing and upcoming titles, filter by genre, language, and search by title or cast.
- **Showtime & Theatre Selection:** Select dates, multiplex locations (IMAX 3D, Dolby Atmos), and showtime slots.
- **Interactive Cinema Seat Map:** Glowing screen layout, tiered pricing (Silver, Gold, Platinum Recliner), and real-time seat availability.
- **Atomic Double-Booking Prevention:** Server-authoritative concurrency validation rejecting conflicting reservations with HTTP 409 Conflict.
- **Digital Boarding Pass / E-Ticket:** High-resolution printable pass with unique reference code (`IMV-YYYY-XXXX`) and QR scanner verification.
- **My Bookings & Cancellation:** Inspect booking history and cancel tickets with automatic seat release.
- **Administrator Control Panel:** Metrics for total revenue, occupancy rate, tickets sold, movie CRUD, showtime scheduler, and seat maintenance blocking.
- **College Viva & Architecture Dossier:** In-app modal and markdown files covering ER diagrams, DFDs, schemas, and viva voce questions.

---

## 🛠️ Technology Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend:** Node.js (v18+ LTS), Express.js, JWT (`jsonwebtoken`), `bcryptjs`, RESTful APIs
- **Database:** MongoDB Community Server / MongoDB Atlas, Mongoose ODM (with automatic fallback persistence for zero-config sandboxes)
- **Tooling:** Vite, TSX, Postman Collection included

---

## 📋 Software & Hardware Requirements
### Software Requirements:
- **Node.js:** v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm:** v8.0.0 or higher (comes bundled with Node.js)
- **MongoDB:** Community Server ([Download MongoDB](https://www.mongodb.com/try/download/community)) or free [MongoDB Atlas Cluster](https://www.mongodb.com/cloud/atlas)
- **Code Editor:** Visual Studio Code ([Download VS Code](https://code.visualstudio.com/))
- **API Testing:** Postman ([Download Postman](https://www.postman.com/downloads/))
- **Browser:** Google Chrome, Firefox, or Microsoft Edge

### Hardware Recommendations:
- **Processor:** Intel Core i5 / AMD Ryzen 5 or higher
- **RAM:** 8 GB minimum (16 GB recommended)
- **Storage:** 1 GB free disk space

---

## 🚀 Quick Start Guide

### 1. Clone or Extract the Project
```bash
git clone <repository_url>
cd imovies
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/Imovies
JWT_SECRET=imovies_super_secure_production_secret_key_2026
CLIENT_URL=http://localhost:3000
```

### 4. Start MongoDB (Optional for Local MongoDB)
- **Windows:** Start the `MongoDB` service from Windows Services or run:
  ```cmd
  "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
  ```
- **macOS (Homebrew):**
  ```bash
  brew services start mongodb/brew/mongodb-community
  ```
- **Linux (Ubuntu/Debian):**
  ```bash
  sudo systemctl start mongod
  ```
*(Note: If MongoDB is not installed locally, IMovies will automatically utilize its built-in persistence engine so you can run and test the application immediately without errors!)*

### 5. Seed Initial Data (Movies, Theatres, Shows & Users)
```bash
npm run seed
```

### 6. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to: **`http://localhost:3000`**

---

## 🔑 Default Demo Accounts
For rapid evaluation, grading, and presentation, default accounts are pre-seeded:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Cinema Admin** | `admin@imovies.com` | `Admin@123` | Full access to Admin Dashboard, revenue, movies, shows, and seat blocking |
| **Moviegoer** | `user@imovies.com` | `User@123` | Standard booking, seat selection, and my bookings access |

*(You can also use the one-click **"Admin Demo"** and **"Moviegoer Demo"** buttons directly on the Sign In page!)*

---

## 🧪 Testing with Postman
1. Open Postman.
2. Click **Import** and select the file `POSTMAN_COLLECTION.json` in the project root.
3. The collection is pre-configured with endpoints for:
   - `Auth` (Register, Login, Get Current Profile)
   - `Movies` (Get All, Get by ID, Create Movie)
   - `Shows & Seats` (Get Shows, Get Real-time Seat Availability)
   - `Bookings` (Create Atomic Booking, Get My Bookings, Cancel Booking)
   - `Admin` (Dashboard Metrics, Reset Seed)

---

## 📂 Project Directory Structure
```
imovies/
├── .env.example              # Environment configuration template
├── COLLEGE_DOCUMENTATION.md  # Detailed B.Tech viva & architecture dossier
├── POSTMAN_COLLECTION.json   # Postman collection for REST API testing
├── README.md                 # Complete setup and user guide
├── index.html                # Main HTML entry point
├── package.json              # Project dependencies and scripts
├── server.ts                 # Full-stack Express server with Vite middleware
├── server/
│   ├── config/               # Database connection and configuration
│   ├── controllers/          # Express route controllers (Auth, Movie, Show, Booking, Admin)
│   ├── middleware/           # JWT authentication and Admin authorization guards
│   ├── models/               # Mongoose schemas (User, Movie, Theatre, Show, Booking)
│   ├── routes/               # Express REST API routes
│   ├── scripts/              # Seed runner and demo dataset
│   └── services/             # Atomic database store and concurrency engine
└── src/
    ├── App.tsx               # Root component wiring navigation and modals
    ├── components/           # Reusable UI (Navbar, Footer, SeatMap, TicketModal, etc.)
    ├── context/              # AuthContext for session management
    ├── pages/                # Pages (Home, Movies, MovieDetails, Booking, Admin, etc.)
    ├── services/             # Frontend API client
    └── types/                # TypeScript interface definitions
```

---

## 🎓 College Viva Voce Defense Checklist
- **ER Diagram & DFDs:** View in `COLLEGE_DOCUMENTATION.md` or click **"Viva & System Docs"** in the navigation bar.
- **Double-Booking Proof:** Select seats in two separate browser tabs/windows and try booking them; observe the HTTP 409 Conflict validation on the second attempt.
- **Role-based Guard:** Normal users attempting to open `/admin` or call administrative endpoints will be blocked with HTTP 403 Forbidden.
