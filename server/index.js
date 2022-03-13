const path = require('path');
const express = require('express');
const App = express();
const port = 8080;
const htmlUrl = path.join(__dirname, '../public', 'index.html')
const publicUrl = (path.join(__dirname, '../public'));

App.use(express.static(publicUrl));

App.get('/', (req, res) => {
  console.log('A new connection has arrived!');
  res.sendFile(htmlUrl);
});

App.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
