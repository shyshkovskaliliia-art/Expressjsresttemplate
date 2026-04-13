// middleware/timingMiddleware.js
const requestStore = new Map();
const WINDOW_MS = 60 * 1000;  // 1 хвилина
const MAX_REQUESTS = 100;      // ліміт запитів

module.exports = (eventEmitter) => (req, res, next) => {
  const start = process.hrtime.bigint();
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // === RATE LIMITING ===
  let userRequests = requestStore.get(ip) || [];
  userRequests = userRequests.filter(t => now - t < WINDOW_MS);
  
  if (userRequests.length >= MAX_REQUESTS) {
    return res.status(429).json({ 
      success: false, 
      message: 'Too Many Requests',
      retryAfter: Math.ceil(WINDOW_MS / 1000)
    });
  }
  
  userRequests.push(now);
  requestStore.set(ip, userRequests);
  
  const originalEnd = res.end.bind(res);
  res.end = function(...args) {
    // Встановлюємо заголовок тільки для успішних відповідей (2xx)
    if (res.statusCode >= 200 && res.statusCode < 300 && !res.headersSent) {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;
      res.setHeader('X-Response-Time', `${durationMs.toFixed(2)}ms`);
      
      // Емітимо подію для Part E
      eventEmitter?.emit('requestCompleted', {
        timestamp: new Date().toISOString(),
        ip,
        method: req.method,
        path: req.path,
        responseTime: durationMs,
        statusCode: res.statusCode,
        userAgent: req.get('User-Agent')
      });
    }
    return originalEnd(...args);
  };
  
  next();
};