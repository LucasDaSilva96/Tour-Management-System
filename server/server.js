require('dotenv').config();
const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => console.log('DB connection successful'));

const app = require('./app');
const port = process.env.PORT || 8000;

const SERVER = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
