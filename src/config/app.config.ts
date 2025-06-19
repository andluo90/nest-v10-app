export default () => {
  console.log(`process.env.NODE_ENV:`,process.env.NODE_ENV);
  
  return {
    environment: process.env.NODE_ENV || 'development',
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    },
  }
};
