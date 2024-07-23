const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const middleware = require('./middleware/middleware');
const db = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

module.exports = app;
