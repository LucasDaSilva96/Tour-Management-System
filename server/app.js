const express = require('express');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.enable('trust proxy');

// ! Express Middleware - Body parse - reading data from the body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

// ! Cookie-parser Middleware
app.use(cookieParser());

// !CORS Middleware
app.use(cors());
app.options('*', cors());

// ** Routes
app.use('/api/v1/users', userRoutes);

module.exports = app;
