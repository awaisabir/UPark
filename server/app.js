const express  = require('express');

const Crawler = require('./models/Crawler');
const mainRoute = require('./routes/index.js');
const PORT = process.env.PORT || 3000;
const app = express();
app.use('/',mainRoute)
app.listen(PORT, err => {
  if (err) console.error(err);

  console.log(`Server started on port ${PORT}`);
});