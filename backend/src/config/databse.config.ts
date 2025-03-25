export const databaseConfig = {
  type: 'mysql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '234565',
  database: process.env.DB_NAME || 'game_store',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
};
