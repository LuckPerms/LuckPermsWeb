# LuckPerms Web Editor
An online web editor for permission data stored by the [LuckPerms plugin](https://github.com/lucko/LuckPerms).

## Live copy
An official version of this site is hosted [**here**](https://lpedit.lucko.me/). However, you are free to host your own version, or even just clone this repository locally and open the page.

## How does it work
The site is very simple in design, but probably doesn't work how you think it does.

All of the data handling code is written in JavaScript and is totally client side. There is no complex backend system required, and anyone with the LuckPerms plugin can make use of this editor without having to host their own version. The site is not linked directly to any storage backend, and all communication with the server is done using GitHub's Gist service.

The Minecraft server never makes any direct communication with the web server hosting the permission editor, and the web editor never communicates directly with the backend server. All data transfer is completed using data tokens. Data is stored anonymously and is not searchable or viewable by others unless they have the link.

The web editor and the MC server communicate with each other using isolated data payloads, which are saved on and hosted by GitHub.

#### MC Server -> Web Editor

1. A user on the MC server runs one of the editor commands. (`/lp group <group> edtior` or `/lp user <user> editor`)
2. The LuckPerms plugin gathers all of the data it has about the user/group, and forms a payload object, serialised as JSON.
3. The plugin posts this payload to GitHub's Gist API, and retrieves the id of the resultant gist. The id is appended as a parameter to the web editors url.
4. A link to the web editor, including the payload id is returned to the user in the MC chat.
5. The user clicks the link, and opens the editor page in their browser.
6. The web editor extracts the id of the payload from the request URI, and reads the payload from GitHub's Gist service. 
7. The web editor table is populated with the data from the server.

This process transfers permissions data from the MC server to your browser, without ever requiring communication of any sort between the web server hosting the editor and the MC server itself. GitHub is used as a middle man, and simply accepts and stores the data payload, and then supplies it when the data is requested. The web editor knows the id of the payload as it is included in the URI.

#### Web Editor --> MC Server

1. Once you've finished editing things in the editor, you hit the save button at the top of the page, and the whole process happens again in reverse. The web editor gathers the modified data and forms a payload object, serialised as JSON.
2. The web editor posts this payload to GitHub's Gist API, and retrieves the id of the resultant gist. The id is appended as an argument within a command string.
3. The command string is displayed at the top of the editor page. The user (that's you) is told to run the command in-game to have their changes apply. 
4. The command is ran on the MC server - the server extracts the payload id out of the command string, and reads the payload object back from GitHub.
5. The data is deserialised, and applied to the storage backend. The user/group's permissions are updated, and any changes that were made are saved. 

This process is effectively the same as the communication between the server -> web editor. Again, a direct connection between the editor and the MC server is never established. (in fact, the web editor doesn't even know the IP, location or nature of the MC server)

As well as being convienient for end-users (as they don't have to host the editor themselves), this approach also has a number of other benefits:

* All permissions data is stored by and hosted by GitHub, a huge corporation with lots of resources. (I don't have to pay for it!)
* The official version of the editor at https://lpedit.lucko.me is published using GitHub Pages. (I don't have to pay for it!)
* There is no security risk, as all changes have to be applied using the `/lp applyedits` command. You can freely give out the URL of editor sessions to other people, and although they will be able to make changes, said changes won't apply to your server unless you run the apply command.

## Contributions
Web dev certainly isn't one of my strong points, and this project is far from perfect. I'd really appreciate any contributions! Just make changes in your own fork and PR them back. :smile:
