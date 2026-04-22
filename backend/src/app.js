const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compsRouter = require('./routes/comps');

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json());
app.use(limiter);

app.use('/comps', compsRouter);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = app;
