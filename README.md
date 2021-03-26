![](https://i.imgur.com/ToguFkQ.png "Banner")
# LuckPermsWeb
[![Netlify Status](https://api.netlify.com/api/v1/badges/da5df752-4c7d-4a2b-8634-3eb376fd80d8/deploy-status)](https://app.netlify.com/sites/luckperms/deploys)
[![Discord](https://img.shields.io/discord/241667244927483904.svg?logo=discord&label=)](https://discord.gg/luckperms)

[LuckPerms](https://github.com/lucko/LuckPerms) is a permission plugin for Minecraft servers, written in Java.

LuckPermsWeb (this repository) contains the website for the project and a number of web apps which supplement the plugin, all written in HTML/JavaScript using the [Vue](https://vuejs.org/) framework.

### Branches

* Development takes place on the `master` branch.
* The production site at [luckperms.net](https://luckperms.net/) is automatically built from the `production` branch.
* An older (pre Vue rewrite) version of the site is on the `v1` branch.

### Development

Contributions are greatly appreciated! Just make a pull request with your changes. 

#### Cloning
Use the following command to clone (and include the wiki submodule):
```sh
git clone --recursive https://github.com/lucko/LuckPermsWeb.git
```

#### Setup
Once it is cloned, move into the new directory and install the dependencies:
```sh
cd LuckPermsWeb
npm install
```

#### Compile and setup hot-reloads for development
When making changes to the app, you can run a local copy with the following command:
```sh
npm run serve
```

This will automatically open a new tab in your default browser with the app running on a local server. When you make changes to the files, the app will "hot-reload" with the new updates.

#### Compile for production
To build the project to a folder that can be accessed via a webserver, run this command (output is in the `/dist` directory):
```sh
npm run build
```

### Self hosting
There is a convenient installation script provided for self hosting the web apps.

For more details, see [here](https://github.com/LuckPerms/web-installer).
