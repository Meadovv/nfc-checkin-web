// Environment configuration
const dotenv = require('dotenv');
dotenv.config();

// Initialize configuration
const config = require('./src/.configs');

// Database connection
const database = require('./src/databases');
database.mongodb.connect(config.databases.mongodb.url);

// Server initialization
const app = require('./src/app');
const server = app.listen(config.port, () => {
  console.log(`[app] Server is running on port ${config.port} in ${config.env} mode`);
});

// Careful shutdown
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});