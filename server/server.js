// Load environment variables from .env file
require('dotenv').config();

// Import mongoose for database operations
const mongoose = require('mongoose');

// Get database connection URI from environment variables
const DB = process.env.DATABASE;

// Connect to the MongoDB database using mongoose
mongoose.connect(DB).then(() => console.log('DB connection successful'));

// Import the main application
const app = require('./app');

// Define the port number for the server to listen on
const port = process.env.PORT || 8000;

// Start the server and listen for incoming requests on the specified port
const SERVER = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
