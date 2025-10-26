require('dotenv').config();

const config = {
  // Application
  app: {
    name: process.env.APP_NAME || 'FundHub',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '8000', 10),
    debug: process.env.DEBUG === 'true',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/fundhub',
    logging: process.env.DB_LOGGING === 'true',
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379/0',
  },

  // Security
  security: {
    secretKey: process.env.SECRET_KEY || 'your-secret-key-change-in-production',
    jwtExpiration: parseInt(process.env.JWT_EXPIRATION || '1800', 10), // 30 minutes
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  },

  // CORS
  cors: {
    origins: process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:8080'],
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX || '60', 10),
    message: 'Too many requests from this IP, please try again later.',
  },

  // Stellar
  stellar: {
    network: process.env.STELLAR_NETWORK || 'testnet',
    horizonUrl: process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org',
    networkPassphrase: process.env.NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
    friendbotUrl: process.env.FRIENDBOT_URL || 'https://friendbot.stellar.org',
    platformWalletPublic: process.env.PLATFORM_WALLET_PUBLIC || '',
    platformWalletSecret: process.env.PLATFORM_WALLET_SECRET || '',
  },

  // Payment Providers
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  // Storage
  storage: {
    minioEndpoint: process.env.MINIO_ENDPOINT || 'localhost:9000',
    minioAccessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    minioSecretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    minioBucket: process.env.MINIO_BUCKET_NAME || 'fundhub-media',
  },

  // Monitoring
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN || '',
  },
};

module.exports = config;
