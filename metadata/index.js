const express = require('express');
const axios = require('axios');
const { Router } = require('express');

const app = express();

const data = {
  version: null,
  downloads: {},
  extensions: {},
  wiki: {},
  discordUserCount: null,
  patreonCount: null,
};
const wikiPages = [
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
  'Syncing-data-between-servers',
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

app.get('/all', (req, res) => { res.send(data) });
app.get('/version', (req, res) => { res.send({ version: data.version }) });
app.get('/downloads', (req, res) => { res.send(data.downloads) });
app.get('/extensions', (req, res) => { res.send(data.extensions) });
app.get('/discord-count', (req, res) => { res.send({ discordUserCount: data.discordUserCount }) });
app.get('/patreon-count', (req, res) => { res.send({ patreonCount: data.patreonCount }) });
app.get('/wiki', (req, res) => { res.send({ pages: data.wiki }) });
app.get('/wiki/:page', (req, res) => { res.send({page: data.wiki[req.params['page']]}) });


getData().then(() => {
  setInterval(async () => {
    await getJenkinsData();
  }, 30000);
  setInterval(async () => {
    await getDiscordUserCount();
    await getPatreonCount();
  }, 300000)
  setInterval(async () => {
    await getWikiData();
  }, 7200000);
});

async function getData() {
  await getJenkinsData();
  await getDiscordUserCount();
  await getPatreonCount();
  await getWikiData();
};
 
async function getJenkinsData() {
  try {
    // Get LuckPerms files and version data
    const jenkinsData = await axios.get('https://ci.lucko.me/job/LuckPerms/lastSuccessfulBuild/api/json?tree=url,artifacts[fileName,relativePath]');
    const fileName = jenkinsData.data.artifacts[0].fileName;
    data.version = fileName.split('-').pop().slice(0, -4);
    jenkinsData.data.artifacts.forEach((artifact) => {
      const download = artifact.relativePath.split('/')[0];
      data.downloads[download] = `${jenkinsData.data.url}artifact/${artifact.relativePath}`;
    });

    // Get extensions
    const extensionIds = [
        'extension-legacy-api',
        'extension-default-assignments',
    ];
    extensionIds.forEach((extensionId) => {
      getExtensionData(extensionId);
    });
  } catch (error) {
    console.error(error);
  }
}
async function getExtensionData(extensionId) {
  try {
    const extensionData = await axios.get(`https://ci.lucko.me/job/${extensionId}/lastSuccessfulBuild/api/json?tree=url,artifacts[fileName,relativePath]`);
    extensionData.data.artifacts.forEach((artifact) => {
      const extension = `${extensionData.data.url.split('/')[4]}`;
      data.extensions[extension] = `${extensionData.data.url}artifact/${artifact.relativePath}`;
    });
  } catch (error) {
    console.error(error);
  }
}

async function getWikiData() {
  try {
    wikiPages.forEach(async (page) => {
      data.wiki[page] = (await axios.get(`https://raw.githubusercontent.com/LuckPerms/wiki/master/${page}.md`)).data;
    });
  } catch (error) {
    console.error(error);
  }
}

async function getDiscordUserCount() {
  try {
    const discordData = await axios.get('https://discordapp.com/api/invites/luckperms?with_counts=true');
    data.discordUserCount = discordData.data.approximate_member_count;
  } catch (error) {
    console.error('getDiscordUserCount error:', error.response.status, error.response.statusText);
  }
}
async function getPatreonCount() {
  try {
    const patreonData = await axios.get('https://www.patreon.com/api/campaigns/2298876?include=patron_count&fields[campaign]=patron_count');
    data.patreonCount = patreonData.data.data.attributes.patron_count;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  path: '/metadata',
  handler: app,
};
