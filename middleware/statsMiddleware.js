// middleware/statsMiddleware.js
const SENSITIVE = ['password', 'token', 'email'];

const obfuscate = (key, value) => 
  SENSITIVE.some(s => key.toLowerCase().includes(s)) ? '***' : value;

const cleanObj = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.entries(obj).reduce((acc, [k, v]) => {
    acc[k] = (typeof v === 'object') ? cleanObj(v) : obfuscate(k, v);
    return acc;
  }, {});
};

module.exports = (eventEmitter) => (req, res, next) => {
  res.on('finish', () => {
    const stats = {
      timestamp: new Date().toISOString(),
      method: req.method, path: req.path,
      pathVariables: cleanObj(req.params),
      queryString: cleanObj(req.query),
      userAgent: req.get('User-Agent') || 'Unknown',
      ip: req.ip || req.connection.remoteAddress,
      statusCode: res.statusCode
    };
    eventEmitter?.emit('statsCollected', stats);
  });
  next();
};