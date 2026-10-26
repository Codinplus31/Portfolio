const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const contactHandler = require('./contact');

// Local-only environment loading. Vercel provides these variables itself.
dotenv.config({ path: path.join(__dirname, '.env'), quiet: true });

const PORT = Number(process.env.API_PORT) || 3001;
const MAX_BODY_SIZE = 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = Number(process.env.CONTACT_RATE_WINDOW_MS) || 15 * 60 * 1000;
const RATE_LIMIT_MAX = Number(process.env.CONTACT_RATE_LIMIT) || 5;
const requestCounts = new Map();

function getClientAddress(req) {
  return req.socket.remoteAddress || 'unknown';
}

function isAllowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;

  const configuredOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000,https://codinplus.vercel.app')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return configuredOrigins.includes(origin);
}

function isRateLimited(req) {
  const now = Date.now();
  const address = getClientAddress(req);
  const recent = (requestCounts.get(address) || []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestCounts.set(address, recent);

  // Keep expired client entries from accumulating indefinitely.
  if (requestCounts.size > 1000) {
    for (const [key, times] of requestCounts) {
      if (!times.some((time) => now - time < RATE_LIMIT_WINDOW_MS)) requestCounts.delete(key);
    }
  }

  return recent.length > RATE_LIMIT_MAX;
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (url.pathname !== '/api/contact') {
    return sendJson(res, 404, { success: false, error: 'Endpoint not found.' });
  }

  if (!isAllowedOrigin(req)) {
    return sendJson(res, 403, { success: false, error: 'Origin is not allowed.' });
  }

  if (req.method === 'POST' && !String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    return sendJson(res, 415, { success: false, error: 'Content-Type must be application/json.' });
  }

  if (req.method === 'POST' && isRateLimited(req)) {
    res.setHeader('Retry-After', String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)));
    return sendJson(res, 429, { success: false, error: 'Too many requests. Please try again later.' });
  }

  let rawBody = '';
  let bodyTooLarge = false;

  req.on('data', (chunk) => {
    if (bodyTooLarge) return;
    rawBody += chunk;
    if (Buffer.byteLength(rawBody) > MAX_BODY_SIZE) {
      bodyTooLarge = true;
      sendJson(res, 413, { success: false, error: 'Request body is too large.' });
      req.destroy();
    }
  });

  req.on('end', async () => {
    if (bodyTooLarge) return;

    if (rawBody) {
      try {
        req.body = JSON.parse(rawBody);
      } catch (_) {
        return sendJson(res, 400, { success: false, error: 'Request body must be valid JSON.' });
      }
    } else {
      req.body = {};
    }

    try {
      await contactHandler(req, res);
    } catch (error) {
      console.error('Unhandled local API error:', error);
      if (!res.headersSent) {
        sendJson(res, 500, { success: false, error: 'Internal server error.' });
      }
    }
  });
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Contact API port ${PORT} is already in use.`);
  } else {
    console.error('Contact API failed to start:', error);
  }
  process.exit(1);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Contact API running at http://localhost:${PORT}/api/contact`);
});
