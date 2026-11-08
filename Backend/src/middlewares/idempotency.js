const crypto = require('crypto');
const redis = require('../config/redis');

const checkIdempotency = (ttlSeconds = 300) => {
  return async (req, res, next) => {
    try {
      const secretKey = req.headers['x-secret-key'] || req.body?.secretKey;
      if (!secretKey) {
        return res.status(400).json({ error: 'Secret key is required' });
      }

      const providedKey = req.headers['idempotency-key'] || req.headers['x-idempotency-key'] || req.body?.idempotencyKey;
      
      let idempotencyKey;
      if (providedKey) {
        idempotencyKey = `idemp:${secretKey}:${providedKey}`;
      } else {
        const payloadHash = crypto
          .createHash('sha256')
          .update(JSON.stringify(req.body?.payload || req.body))
          .digest('hex');
        idempotencyKey = `idemp:${secretKey}:${payloadHash}`;
      }

      const isNew = await redis.set(idempotencyKey, 'processing', 'EX', ttlSeconds, 'NX');

      if (!isNew) {
        return res.status(409).json({
          status: 'duplicate',
          message: 'Duplicate request detected. This payload has already been received recently.',
        });
      }

      req.idempotencyKey = idempotencyKey;
      next();
    } catch (error) {
      console.error('Idempotency check error:', error.message);
      next();
    }
  };
};

module.exports = checkIdempotency;
