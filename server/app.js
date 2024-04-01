const express = require('express');
const userRoutes = require('./routes/userRoutes');
const tourRoutes = require('./routes/tourRoutes');
const guideRoutes = require('./routes/guideRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const app = express();

app.enable('trust proxy');

// ! Serve static files Middleware
app.use('/public', express.static('public'));

// ! Express Middleware - Body parse - reading data from the body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

// ! Compression Middleware
app.use(compression());

// ! Cookie-parser Middleware
app.use(cookieParser());

// !CORS Middleware
app.use(cors());
app.options('*', cors());

// ** Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/guides', guideRoutes);

module.exports = app;
