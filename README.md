# LuckPerms Web Editor
An online web editor for permission data stored by the [LuckPerms plugin](https://github.com/lucko/LuckPerms).

## Live copy
An official version of this site is hosted [**here**](https://lpedit.lucko.me/). However, you are free to host your own version, or even just clone this repository locally and open the page.

## How does it work
The site is very simple in design, but probably doesn't work how you think it does.

All of the data handling code is written in JavaScript and is totally client side. There is no PHP or NodeJS backend required, and anyone with the LuckPerms plugin can make use of this editor without having to host their own version. The site is not linked directly to any storage backend, and all communication with the server is done using GitHub's GIST service.

#### Effectively, this is how the process works
1. You run `/lp group default editor`, or equivalent on the server. The plugin on the server takes all of the data on the server and serializes it into a JSON format.
2. The server uploads this data to GIST, and parses the id of the content out of the url, into the format `<gist id>/<content id>`
3. A link is sent back in the chat, directing the user to the web editor. The URL of the gist is added to the parameters at the end of the URL.
4. When the user opens the page, client side javascript parses the gist URL out of the parameters.
5. The client side JS code reads in the data from the gist url, and populates the editor table.

Now, the data which was previously sitting on the server is stored in javascript form in your web browser. This all happened without any direct communication between the server, your browser, or even the web server hosting the editor.

You go ahead and make any changes to the data in the web client. When you're finished, you hit the save button, and the whole GIST process happens again. This time, the web client posts the data to GIST, and returns a command you can type into the server. The server then reads the modified data back from GIST, and applies it in-game.

## Contributions
Web dev certainly isn't one of my strong points, and this project is far from perfect. I'd really appreciate any contributions! Just make changes in your own fork and PR them back. :smile: