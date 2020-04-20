![](https://i.imgur.com/ToguFkQ.png "Banner")
# LuckPermsWeb
[![Netlify Status](https://api.netlify.com/api/v1/badges/1858b23b-5dcb-49e3-ad54-45ca005de4e0/deploy-status)](https://app.netlify.com/sites/luckpermseditor/deploys)
[![Discord](https://img.shields.io/discord/241667244927483904.svg?logo=discord&label=)](https://discord.gg/luckperms)

[LuckPerms](https://github.com/lucko/LuckPerms) is a permission plugin for Minecraft servers, written in Java.

LuckPermsWeb (this repository) contains the website for the project and a number of web apps which supplement the plugin, all written in HTML/JavaScript using the [Vue](https://vuejs.org/) framework.

### Branches

* Development takes place on the `master` branch.
* The production site at [luckperms.net](https://luckperms.net/) is automatically built from the `production` branch.
* An older (pre Vue rewrite) version of the site is on the `v1` branch.

### Status

The current master branch is a full re-write and not complete.

**To do:**
- [ ] Home page
- [ ] Download page
- [ ] Wiki
- [x] Web editor (in beta)
- [ ] Verbose report
- [ ] Debug report
- [ ] Tree report

## Setup

### Project setup
Setting up the project locally is simple, all you need is Node installed on your computer, then you can clone the repo and run:
```
npm install
```

### Compile and setup hot-reloads for development
Once you've installed the dependencies, you can run the project locally easily by running:
```
npm run serve
```

### Compile and minify for production
If you want to build the project to a folder that can be access via a webserver, running this command will build the project in the `dist` folder:
```
npm run build
```
