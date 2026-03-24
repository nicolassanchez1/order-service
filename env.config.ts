export const EnvConfiguration = () => ({
  host: process.env.DB_HOST,
  port: process.env.PORT || 3002,
  dbPort: process.env.DB_PORT || 5432,
  apiGateway: process.env.API_GATEWAY_URL || 'http://localhost:8080',
  dbUserName: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET || 'secret',
});
