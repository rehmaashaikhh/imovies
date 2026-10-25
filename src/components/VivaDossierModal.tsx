import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Database,
  Layers,
  HelpCircle,
  ShieldCheck,
  Code2,
  FileText,
  Copy,
  Check,
} from 'lucide-react';

interface VivaDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaDossierModal: React.FC<VivaDossierModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'er' | 'dfd' | 'schemas' | 'viva'>('overview');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#111317] border border-zinc-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>IMovies Project Dossier & Viva Defense Guide</span>
                <span className="text-[10px] font-semibold bg-rose-600/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded">
                  B.Tech Capstone Ready
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Software Architecture, ER Diagrams, DFDs, Mongoose Schemas & Viva Answers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-6 py-2 bg-zinc-950 border-b border-zinc-800/80 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'Architecture & Objectives', icon: Layers },
            { id: 'er', label: 'ER Diagram & Relations', icon: Database },
            { id: 'dfd', label: 'DFD Level 0 & 1', icon: FileText },
            { id: 'schemas', label: 'Mongoose Schemas', icon: Code2 },
            { id: 'viva', label: 'Top 10 Viva Voce Q&A', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-zinc-300">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Abstract & Problem Statement
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Traditional movie ticketing systems frequently suffer from race conditions, double booking during high concurrency, lack of real-time seat status synchronization, and complex administrative controls. <strong>IMovies</strong> addresses these hurdles through a decoupled client-server architecture utilizing a React frontend, Node.js/Express RESTful backend, and MongoDB with Mongoose Object Data Modeling. The application enforces server-authoritative seat validation, temporary reservation safety, role-based JWT authorization, and an administrative panel for theatre and schedule orchestration.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Frontend Tier</h4>
                  <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                    <li>React 19 Functional Architecture</li>
                    <li>Stateful Seat Grid Map & Pricing Engine</li>
                    <li>JWT Authentication Context</li>
                    <li>Tailwind CSS Responsive Cinema Dark Theme</li>
                  </ul>
                </div>
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Backend Controller Tier</h4>
                  <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                    <li>Express.js RESTful API Endpoints</li>
                    <li>Atomic Double-Booking Concurrency Guards</li>
                    <li>Bcrypt Password Hashing & JWT Verification</li>
                    <li>Centralized Error Handling & HTTP 409 Conflict Logic</li>
                  </ul>
                </div>
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Data Persistence Tier</h4>
                  <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                    <li>MongoDB Collections with Mongoose Schemas</li>
                    <li>Independent Show-Level Seat Inventories</li>
                    <li>Referential Integrity via ObjectId References</li>
                    <li>State Persistence Engine for Sandbox & Localhost</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'er' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                Entity-Relationship (ER) Architecture
              </h3>

              <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
                <pre>{`+-----------------+       1:N        +-------------------+
|      USER       | <--------------- |      BOOKING      |
+-----------------+                  +-------------------+
| _id (PK)        |                  | _id (PK)          |
| name            |                  | bookingReference  |
| email (Unique)  |                  | userId (FK->User) |
| passwordHash    |                  | showId (FK->Show) |
| role [user|adm] |                  | movieId (FK->Mov) |
| createdAt       |                  | theatreId (FK->Th)|
+-----------------+                  | selectedSeats[]   |
        |                            | totalAmount       |
        |                            | bookingStatus     |
        |                            +-------------------+
        |                                      |
        | N:1                                  | N:1
        v                                      v
+-----------------+       1:N        +-------------------+       N:1        +-----------------+
|      MOVIE      | <--------------- |       SHOW        | ---------------> |     THEATRE     |
+-----------------+                  +-------------------+                  +-----------------+
| _id (PK)        |                  | _id (PK)          |                  | _id (PK)        |
| title           |                  | movieId (FK)      |                  | name            |
| genre[]         |                  | theatreId (FK)    |                  | location        |
| duration        |                  | showDate          |                  | address         |
| rating          |                  | startTime         |                  | totalSeats (60) |
| status          |                  | tierPrices {}     |                  | seatLayout {}   |
| posterUrl       |                  | seatInventory[]   |                  | screens[]       |
+-----------------+                  +-------------------+                  +-----------------+`}</pre>
              </div>

              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-zinc-200">Key Relationship Insights for Viva:</h4>
                <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                  <li><strong>Show to Seat Inventory:</strong> Notice that seat availability is explicitly decoupled from Theatre and held per <strong>Show</strong>. A seat booked in a 2:00 PM show remains completely free for a 6:00 PM show at the same theatre!</li>
                  <li><strong>User to Bookings (1:N):</strong> A registered user can make multiple bookings; each booking is owned by a single user verified via JWT middleware.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'dfd' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Data Flow Diagrams (DFD)
              </h3>

              {/* DFD Level 0 */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide">Level 0: Context Diagram</h4>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 overflow-x-auto">
                  <pre>{`[ User / Customer ]
       |
       |-- (1) Credentials (Register/Login) ------------> [ 0.0 IMOVIES PLATFORM ]
       |<-- (2) JWT Bearer Token & User Profile -----------|
       |                                                    |
       |-- (3) Search & Filter Movies -------------------->|
       |<-- (4) Movie List, Shows & Realtime Seats --------|
       |                                                    |
       |-- (5) Reserve Seats & Payment Submission -------->|
       |<-- (6) E-Ticket Pass & QR Reference --------------|
       |                                                    |
[ Administrator ]                                           |
       |-- (7) Manage Shows, Theatres, Movies & Blocks ---->|
       |<-- (8) Revenue Metrics & Occupancy Stats ----------|
                                                            |
                                             <====== CRUD Queries ======> [ MongoDB Database ]`}</pre>
                </div>
              </div>

              {/* DFD Level 1 */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wide">Level 1: Operational Flow</h4>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 overflow-x-auto">
                  <pre>{`1.1 User Auth Process: Accepts (email, password) -> Validates with Users Collection -> Issues JWT.
1.2 Catalog Process: Queries Movies Collection -> Filters by (genre, status, search).
1.3 Showtime & Seat Process: Queries Shows by (movieId, date) -> Delivers Seat Inventory.
1.4 Seat Booking Engine: 
    a. Locks requested seats for transaction.
    b. Validates status == 'available'. If any seat is booked -> Returns HTTP 409 Conflict.
    c. Calculates authoritative server prices, taxes, and fees.
    d. Writes to Bookings Collection and updates seat status in Shows Collection.
1.5 Cancellation Engine: Verifies user ownership -> Changes Booking status to 'cancelled' -> Releases seats.`}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schemas' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-rose-400" />
                  <span>Assignment Specification: MongoDB Connection & Schemas</span>
                </h3>
                <span className="text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded">
                  Assignment Required Code
                </span>
              </div>

              {/* Exact Assignment Code & Explanation */}
              <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>1. MongoDB Connection Code (Mongoose ODM)</span>
                </h4>

                <div className="p-3.5 bg-black/80 border border-zinc-800 rounded-lg font-mono text-xs text-emerald-400 overflow-x-auto">
                  <pre>{`const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Imovies', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));`}</pre>
                </div>

                <div className="space-y-3 pt-2 text-xs border-t border-zinc-800/80">
                  <h5 className="font-bold text-zinc-200">Line-by-Line Breakdown & Viva Defense:</h5>

                  <div className="space-y-2 text-zinc-300">
                    <div className="p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800">
                      <p className="font-mono text-amber-300 font-bold">1. const mongoose = require('mongoose');</p>
                      <p className="text-zinc-400 mt-1">
                        <strong>Purpose:</strong> Loads the Mongoose library so you can use it in your application. Mongoose is a powerful Object Data Modeling (ODM) tool that helps interact with MongoDB using JavaScript objects.
                      </p>
                    </div>

                    <div className="p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800 space-y-1.5">
                      <p className="font-mono text-amber-300 font-bold">2. mongoose.connect('mongodb://127.0.0.1:27017/Imovies', ...)</p>
                      <ul className="text-zinc-400 space-y-1 pl-3 list-disc">
                        <li><code className="text-rose-300">mongodb://</code>: Specifies the standard MongoDB communication protocol.</li>
                        <li><code className="text-rose-300">127.0.0.1</code>: Localhost IP address – indicates the database server is running on your local machine.</li>
                        <li><code className="text-rose-300">27017</code>: Default TCP port for MongoDB daemon process.</li>
                        <li><code className="text-rose-300">Imovies</code>: Name of the application database. If this database does not exist, MongoDB creates it automatically once data is inserted.</li>
                        <li><code className="text-rose-300">useNewUrlParser: true</code>: Uses MongoDB driver's updated URL connection string parser.</li>
                        <li><code className="text-rose-300">useUnifiedTopology: true</code>: Enables MongoDB's connection management engine for connection stability and performance.</li>
                      </ul>
                    </div>

                    <div className="p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800">
                      <p className="font-mono text-amber-300 font-bold">3. .then(() =&gt; console.log('Connected to MongoDB'))</p>
                      <p className="text-zinc-400 mt-1">
                        If the connection is successful, this Promise callback executes and prints a confirmation message: <span className="text-emerald-400">"Connected to MongoDB"</span>.
                      </p>
                    </div>

                    <div className="p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800">
                      <p className="font-mono text-amber-300 font-bold">4. .catch((err) =&gt; console.error('MongoDB connection error:', err));</p>
                      <p className="text-zinc-400 mt-1">
                        If the connection fails (e.g. MongoDB service offline or port blocked), the error is caught here for safe logging and debugging.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

                <div>
                  <h4 className="text-xs font-bold text-zinc-200 mb-1">Show Schema with Independent Seat Inventory:</h4>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-xs text-zinc-300">
                    <pre>{`const ShowSchema = new Schema({
  movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatreId: { type: Schema.Types.ObjectId, ref: 'Theatre', required: true },
  showDate: { type: String, required: true },
  startTime: { type: String, required: true },
  screenFormat: { type: String, default: 'IMAX 3D' },
  seatInventory: [{
    seatNumber: { type: String, required: true },
    row: { type: String, required: true },
    col: { type: Number, required: true },
    tier: { type: String, enum: ['Silver', 'Gold', 'Platinum'] },
    price: { type: Number, required: true },
    status: { type: String, enum: ['available', 'booked', 'blocked'], default: 'available' }
  }],
  status: { type: String, default: 'active' }
}, { timestamps: true });`}</pre>
                  </div>
                </div>
              </div>
            )}

          {activeTab === 'viva' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                Top Viva Voce Questions & Answers for Students
              </h3>

              <div className="space-y-3">
                {[
                  {
                    q: '1. How does your system prevent two users from booking the same seat at the exact same moment?',
                    a: 'The server executes an atomic validation check in the booking controller. Before writing a booking, it validates that all requested seat codes have status === "available". If even one seat has been booked or locked by a parallel request, the server aborts the transaction, rejects the request with HTTP 409 Conflict, and tells the user exactly which seat collided.',
                  },
                  {
                    q: '2. Why did you use JWT (JSON Web Tokens) instead of traditional server-side sessions?',
                    a: 'JWT is stateless and ideal for RESTful architectures. The server does not need to maintain session state in memory or Redis across multiple instances. The token is cryptographically signed with a secret key, contains the user ID and role, and can be verified quickly by the authentication middleware on every request.',
                  },
                  {
                    q: '3. Why is seat inventory stored in the Show document rather than the Theatre document?',
                    a: 'A theatre has a static physical layout (e.g. 6 rows of 10 seats). However, seat occupancy changes for every distinct showtime. If seats were marked booked on the Theatre model, booking a seat for a 2:00 PM show would incorrectly block that seat for the 9:00 PM show.',
                  },
                  {
                    q: '4. Why should prices and totals never be trusted from the frontend payload?',
                    a: 'Malicious clients could tamper with the HTTP request body and send totalAmount: 1.00. Our Express backend ignores client prices and computes subtotal, convenience fees, and taxes directly from the database tier prices before finalizing the record.',
                  },
                  {
                    q: '5. How does password security work in IMovies?',
                    a: 'Passwords are never stored in plaintext. When a user registers, the password is encrypted using bcryptjs with 10 salt rounds. During login, bcrypt.compare verifies the hash without ever exposing the real password.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-1.5">
                    <p className="text-xs font-bold text-rose-400">{item.q}</p>
                    <p className="text-xs text-zinc-300 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>IMovies Technical Documentation & System Specifications</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
