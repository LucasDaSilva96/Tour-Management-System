require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./app');

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    autoIndex: true,
  })
  .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 8000;

const SERVER = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
