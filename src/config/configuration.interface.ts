export interface IAppConfig {
  NODE_ENV: string;
  PORT: number;
  PG_DB_HOST: string;
  PG_DB_PORT: string;
  PG_DB_DATABASE: string;
  PG_DB_USERNAME: string;
  PG_DB_PASSWORD: string;
  MONGO_URI: string;
  MONGO_DB_NAME: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRATION_TIME_MS: number;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION_TIME_MS: number;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USERNAME: string;
  EMAIL_PASSWORD: string;
  RESEND_API_KEY: string;
  OPENAI_API_KEY: string;
  TWITTER_API_KEY: string;
  TWITTER_API_SECRET: string;
  TWITTER_ACCESS_TOKEN: string;
  TWITTER_ACCESS_SECRET: string;
  RABBITMQ_HOST: string;
  RABBITMQ_PORT: number;
}
