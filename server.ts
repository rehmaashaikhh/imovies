import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB, isDBConnected, isUsingFallback } from './server/config/db.js';
import authRoutes from './server/routes/authRoutes.js';
import movieRoutes from './server/routes/movieRoutes.js';
import theatreRoutes from './server/routes/theatreRoutes.js';
import showRoutes from './server/routes/showRoutes.js';
import bookingRoutes from './server/routes/bookingRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Security & CORS Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// RESTful API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Health & Status Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'IMovies - Movie Ticket Booking System',
    timestamp: new Date().toISOString(),
    database: {
      mongoConnected: isDBConnected(),
      engine: isDBConnected() ? 'MongoDB (Mongoose ODM)' : 'IMovies Embedded Database Engine',
      mode: isUsingFallback() ? 'Sandbox High-Speed Persistence' : 'Production MongoDB',
    },
  });
});

// Start Server and Mount Frontend
async function startServer() {
  await connectDB();

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🍿 IMovies Cinema Server running at http://localhost:${PORT}`);
    console.log(`📡 REST API routes ready under /api/*`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting IMovies server:', err);
});
