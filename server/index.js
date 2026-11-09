import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import healthRouter from './routes/health.js';
import membersRouter from './routes/members.js';
import contentRouter from './routes/content.js';
import analyticsRouter from './routes/analytics.js';
import thumbnailsRouter from './routes/thumbnails.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
// Thumbnails carry base64 images, so it gets a bigger body limit before the global parser.
app.use('/api/thumbnails', express.json({ limit: '40mb' }), thumbnailsRouter);
app.use(express.json());

// Health check — handy for deploys and uptime monitors.
app.use('/health', healthRouter);

// Placeholder API. Swap these out for real Supabase queries
// when you wire up the database (see CLAUDE.md).
app.use('/api/members', membersRouter);
app.use('/api/content', contentRouter);
app.use('/api/analytics', analyticsRouter);

// -----------------------------------------------------------------------------
// In production, serve the built frontend from /dist so everything runs on one
// port. In dev, Vite handles the frontend and proxies /api here.
// -----------------------------------------------------------------------------
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n  API server listening on http://localhost:${PORT}\n`);
});
