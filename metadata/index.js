const express = require('express');
const axios = require('axios');

const app = express();

const data = {
  wiki: {},
};
const wikiPages = [
  'Home',
  '_Sidebar',
];

getData().then(() => {
  setInterval(async () => {
    await getWikiData();
  }, 30000);
});

async function getData() {
  await getWikiData();
};

async function getWikiData() {
  try {
    wikiPages.forEach(async (page) => {
      const result = await axios.get(`https://raw.githubusercontent.com/LuckPerms/wiki/master/${page}.md`);
      data.wiki[page] = result.data;
    });
  } catch (error) {
    console.error(error);
  }
};

app.get('/wiki/:page', (req, res) => {
  res.json({page: data.wiki[req.params['page']]});
});

module.exports = {
  path: '/metadata',
  handler: app,
};
