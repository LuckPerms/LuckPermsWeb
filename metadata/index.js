const express = require('express');
const app = express();

app.get('/wiki/:page', (req, res) => {
  res.json(req.params);
});

module.exports = {
  path: '/metadata',
  handler: app,
};
