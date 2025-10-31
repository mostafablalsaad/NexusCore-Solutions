const serverless = require('serverless-http');
const app = require('../src/app');

// Export the serverless handler for Vercel
module.exports = serverless(app);

// For local development
if (process.env.NODE_ENV  == "development" ) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`
TPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPW
Q                                                           Q
Q   =� NexusCore Solutions API Server                      Q
Q                                                           Q
Q   Environment: ${process.env.NODE_ENV || 'development'}                              Q
Q   Port: ${PORT}                                             Q
Q   Status:  Running                                      Q
Q                                                           Q
Q   Health Check: http://localhost:${PORT}/api/health        Q
Q                                                           Q
ZPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP]
    `);
  });
}
