const path = require('path');
const express = require('express');
const app = express();
const port = 8080;
const htmlUrl = __dirname + '/public/index.html';

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  console.log('A new connection has arrived!');
  res.sendFile(htmlUrl);
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
