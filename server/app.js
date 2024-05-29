// Import required modules
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const tourRoutes = require('./routes/tourRoutes');
const guideRoutes = require('./routes/guideRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');

// Create Express application
const app = express();

// Trust proxy for secure deployment environments
app.enable('trust proxy');

// Serve static files from the 'public' directory
// ! Serve static files Middleware
app.use('/public', express.static('public'));

// Parse incoming JSON data into req.body
// ! Express Middleware - Body parse - reading data from the body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

// Compress responses for improved performance
// ! Compression Middleware
app.use(compression());

// Parse cookies from incoming requests
// ! Cookie-parser Middleware
app.use(cookieParser());

// Enable CORS for all routes
// !CORS Middleware

const whitelist = [
  'https://tour-management-system-frontend.onrender.com',
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(
  // cors({
  //   origin: 'https://tour-management-system-frontend.onrender.com',
  //   optionsSuccessStatus: 200,
  // })
  cors(corsOptions)
);
// app.options('*', cors());

// Parse URL-encoded data into req.body
// !Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Define application routes
// ** Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/guides', guideRoutes);

// Export the configured Express application
module.exports = app;
