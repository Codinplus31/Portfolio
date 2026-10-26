const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const contactHandler = require('./contact');

// Local-only environment loading. Vercel provides these variables itself.
dotenv.config({ path: path.join(__dirname, '.env'), quiet: true });

const PORT = Number(process.env.API_PORT) || 3001;
const MAX_BODY_SIZE = 1024 * 1024;

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (url.pathname !== '/api/contact') {
    return sendJson(res, 404, { success: false, error: 'Endpoint not found.' });
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
