const express  = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
const Crawler = require('./models/Crawler');
const mainRoute = require('./routes/index.js');

app.use('/', mainRoute);

app.listen(PORT, err => {
  if (err) console.error(err);

  console.log(`Server started on port ${PORT}`);
});