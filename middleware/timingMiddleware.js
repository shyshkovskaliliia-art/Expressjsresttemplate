const requestCounts = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

const timingMiddleware = (eventEmitter) => (req, res, next) => {
  const start = process.hrtime.bigint();
  const ip = req.ip || req.connection.remoteAddress;
  
  // Rate limiting logic
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < WINDOW_MS);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return res.status(429).json({ success: false, message: 'Too many requests' });
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  
  // Clean up old entries periodically (simplified)
  if (recentRequests.length === 1) {
    setTimeout(() => {
      const current = requestCounts.get(ip) || [];
      if (current.length === 0) requestCounts.delete(ip);
    }, WINDOW_MS);
  }
  
  // Capture response finish
  res.on('finish', () => {
    // Only log for successful responses (2xx)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;
      res.setHeader('X-Response-Time', `${durationMs.toFixed(2)}ms`);
      
      // Emit event for Part E
      eventEmitter.emit('requestCompleted', {
        timestamp: new Date().toISOString(),
        ip,
        method: req.method,
        path: req.path,
        responseTime: durationMs,
        statusCode: res.statusCode,
        userAgent: req.get('User-Agent')
      });
    }
  });
  
  next();
};

module.exports = timingMiddleware;