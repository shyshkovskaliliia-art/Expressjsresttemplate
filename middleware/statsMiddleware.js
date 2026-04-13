const SENSITIVE_KEYS = ['password', 'token', 'email'];

const obfuscateValue = (key, value) => {
  const lowerKey = key.toLowerCase();
  return SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive)) ? '***' : value;
};

const collectParams = (params) => {
  if (!params) return {};
  return Object.entries(params).reduce((acc, [key, value]) => {
    acc[key] = obfuscateValue(key, value);
    return acc;
  }, {});
};

const statsMiddleware = (eventEmitter) => (req, res, next) => {
  res.on('finish', () => {
    const stats = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      pathParams: collectParams(req.params),
      queryParams: collectParams(req.query),
      bodyKeys: req.body ? Object.keys(req.body).map(k => ({ [k]: obfuscateValue(k, req.body[k]) })) : [],
      userAgent: req.get('User-Agent') || 'Unknown',
      ip: req.ip || req.connection.remoteAddress
    };
    
    // Emit event instead of direct logging (Part E)
    eventEmitter.emit('statsCollected', stats);
  });
  next();
};

module.exports = statsMiddleware;