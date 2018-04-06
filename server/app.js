const express = require('express');
const PORT = process.env.PORT || 3000;

const app = express();

app.listen(err => {
  if (err) console.error(err);

  console.log(`Server started on port ${PORT}`);
});