require('dotenv').config();
const express = require('express');
const http = require('http');
const helmet = require('helmet'); // security headers
const cors = require('cors');
const rateLimit = require('express-rate-limit'); //Prevent DDoS, brute force
const connectDB = require('./config/database');
const { createHttpsServer } = require('./config/https');


// creates express application
const app = express();

// connect to Database
connectDB();

app.use(cors({
    origin: ['http://localhost:3000', 'https://localhost:3000'], // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// this sets important HTTP security headers
app.use(helmet());
app.use(helmet.hsts({ //forces HTTPS
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));
app.use(helmet.frameguard({ action: 'deny' })); // this prevents clickjacking
app.use(helmet.contentSecurityPolicy({ //prevents XSS attacks
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'https:'],
  }
}));

// CORS Configuration, for establishing communication of frontend with backend.
//this makes sure that the frontend requests are allowed.






// using rate limiting to protect against bots, spam, and hackers.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limiting each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true
});

// allows the server to read JSON reques
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Redirect HTTP to HTTPS (if SSL is enabled)
if (process.env.SSL_ENABLED === 'true') {
  app.use((req, res, next) => {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      const httpsUrl = `https://${req.headers.host.replace(/:\d+$/, '')}:${process.env.HTTPS_PORT || 5443}${req.url}`;
      return res.redirect(301, httpsUrl);
    }
    next();
  });
}

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    protocol: req.protocol,
    secure: req.secure,
    timestamp: new Date().toISOString()
  });
});


// shows the API information
app.get('/', (req, res) => {
  res.json({
    message: 'Customer International Payments Portal API',
    version: '1.0.0',
    status: 'Active'
  });
});


// API routes
const customerRoutes = require("./routes/customerRoutes");
app.use("/api/customer", customerRoutes);
app.use('/api/employee', require('./routes/employeeRoutes'));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});


app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(err.status || 500).json({
    success: false,
    message: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Servers
const HTTP_PORT = process.env.PORT || 5000;
const HTTPS_PORT = process.env.HTTPS_PORT || 5443;

// Create HTTP server
const httpServer = http.createServer(app);



// Start HTTP server
httpServer.listen(HTTP_PORT, () => {
  console.log(`\n🌐 HTTP Server running on port ${HTTP_PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 HTTP: http://localhost:${HTTP_PORT}`);
});

// Create and start HTTPS server (if SSL is enabled)
const httpsServer = createHttpsServer(app);
if (httpsServer) {
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`🔒 HTTPS Server running on port ${HTTPS_PORT}`);
    console.log(`🔗 HTTPS: https://localhost:${HTTPS_PORT}`);
    console.log(`💚 Health Check: https://localhost:${HTTPS_PORT}/health\n`);
  });
} else {
  console.log(`💚 Health Check: http://localhost:${HTTP_PORT}/health\n`);
}


process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // close server & exit process
  process.exit(1);
});