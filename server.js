const express = require('express');
const app = express();

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello Uploader');
});

app.listen(port, function () {
  console.log(`Uploader server listening on port ${port}!`);
});
