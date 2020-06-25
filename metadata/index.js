const express = require('express');
const axios = require('axios');

const app = express();

const data = {
  wiki: {},
};
var wikiPages = [
  'Advanced-Setup',
  'Argument-based-command-permissions',
  'Bulk-Editing',
  'Command-Usage',
  'Configuration',
  'Context',
  'Credits',
  'Default-Groups',
  'Developer-API-Usage',
  'Developer-API',
  'Extensions',
  'External-connections',
  'FAQ',
  'GM-&-PEX-Command-Equivalents',
  'General-Commands',
  'Group-Commands',
  'Home',
  'Installation',
  'Locale-and-Translations',
  'Log-Commands',
  'Meta-Commands',
  'Migration',
  'Network-Installation',
  'Parent-Commands',
  'Permission-Commands',
  'Permissions',
  'Placeholders',
  'Prefix-&-Suffix-Stacking',
  'Prefixes,-Suffixes-&-Meta',
  'Self-hosting-the-web-interfaces',
  'Storage-system-errors',
  'Storage-types',
  'Switching-storage-types',
  'Track-Commands',
  'Tracks',
  'Upgrading-from-v4-to-v5',
  'Usage',
  'User-Commands',
  'Verbose',
  'Web-Editor',
  'Weight',
  'Why-LuckPerms',
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
      data.wiki[page] = (await axios.get(`https://raw.githubusercontent.com/LuckPerms/wiki/master/${page}.md`)).data;
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
