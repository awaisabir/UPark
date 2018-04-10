const express  = require('express');

const Crawler = require('./models/Crawler');

const PORT = process.env.PORT || 3000;
const app = express();

app.listen(PORT, err => {
  if (err) console.error(err);

  console.log(`Server started on port ${PORT}`);
});