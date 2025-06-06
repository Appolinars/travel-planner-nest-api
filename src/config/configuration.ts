export default () => ({
  PORT: process.env.PORT || 5000,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6380,
  RABBITMQ_HOST: process.env.RABBITMQ_HOST || 'localhost',
  RABBITMQ_PORT: Number(process.env.RABBITMQ_PORT) || 5672,
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 2525,
  // JWT_ACCESS_EXPIRATION_TIME_MS: 10000,
  JWT_ACCESS_EXPIRATION_TIME_MS: 3600000,
  // JWT_REFRESH_EXPIRATION_TIME_MS: 15000,
  JWT_REFRESH_EXPIRATION_TIME_MS: 604800000,
});
