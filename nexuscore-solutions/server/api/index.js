const serverless = require('serverless-http');
const app = require('../src/app');

// Configure serverless-http for Vercel
const handler = serverless(app, {
  binary: ['image/*', 'application/pdf'],
});

// Export for Vercel
module.exports = handler;

// For local development only
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 NexusCore Solutions API Server                      ║
║                                                           ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(39)}║
║   Port: ${String(PORT).padEnd(50)}║
║   Status: ✅ Running                                      ║
║                                                           ║
║   Health Check: http://localhost:${PORT}/api/health        ║
║   API Base URL: http://localhost:${PORT}/api              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
  });
}
