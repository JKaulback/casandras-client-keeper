const logger = require('./logger');

function validateEnv() {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    logger.error('❌ Missing required environment variables:', missing);
    logger.error('Please check your .env file or environment configuration');
    process.exit(1);
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET.length < 32) {
    logger.warn('⚠️  JWT_SECRET is too short. Use at least 32 characters for security.');
  }

  logger.info('✅ All required environment variables are set');
}

module.exports = validateEnv;
