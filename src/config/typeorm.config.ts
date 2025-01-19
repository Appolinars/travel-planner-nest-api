import { config } from 'dotenv';
import { DataSource } from 'typeorm';
config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_DB_HOST || 'localhost',
  port: parseInt(process.env.PG_DB_PORT, 10) || 5432,
  username: process.env.PG_DB_USERNAME || 'postgres',
  password: process.env.PG_DB_PASSWORD || 'password',
  database: process.env.PG_DB_DATABASE || 'my_database',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, // Always use migrations for schema changes
});

export default AppDataSource;
