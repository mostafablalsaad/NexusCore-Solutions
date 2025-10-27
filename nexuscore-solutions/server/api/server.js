// api/server.js
const serverless = require('serverless-http');
const app = require('../src/app'); // path to the express app


if(process.env.NODE_ENV !== 'deployment') {
  
const PORT = process.env.PORT || 5000;
// if server is not running in serverless mode, start the server

  app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   🚀 NexusCore Solutions Server Running  ║
║   📡 Port: ${PORT}                        ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}            ║
║   📅 ${new Date().toLocaleString()}       ║
╚═══════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
  
});
}else
{
module.exports = serverless(app);
}