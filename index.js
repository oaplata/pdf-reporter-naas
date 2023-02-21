// create a express server that listen on port 80

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(80, () => {
  console.log('Server started');
});
