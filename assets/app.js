// the rows currently in the table
var rows = [];

// who is being edited. this should be in the format "user/<uuid>" or "group/<group name>"
// or empty, if the data loaded at the start of the session didn't contain the attribute
var who = "";

// the command alias used to open the editor page
var cmdAlias = "lp";

var permsListObject = document.getElementById("permissions-list")

// Clipboard instance
var clipboard

function addAutoCompletePermission(perm) {
    var option = document.createElement("option");
    option.value = perm;
    permsListObject.appendChild(option);
}

// makes a minimal node object from the given parameters.
function makeNode(perm, value, server, world, expiry, contexts) {
    var node = {};

    node["permission"] = perm;

    if (!value) {
        node["value"] = false
    }

    if (server.toLowerCase() !== "global") {
        node["server"] = server
    }

    if (world.toLowerCase() !== "global") {
        node["world"] = world
    }

    if (expiry > 1) {
        node["expiry"] = expiry
    }

    var hasContexts = false;
    for (var key in contexts) {
        if (contexts.hasOwnProperty(key)) {
            hasContexts = true
        }
    }

    if (hasContexts) {
        node["contexts"] = contexts
    }

    return node
}

// reads data from a web address, and passes the result to the callback
function readPage(link, callback) {
    console.log("Loading from url: " + link)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(xhr.responseText);
        }
    };

    xhr.send(null);
}

// posts a string to GitHub's gist service, and returns the raw url of the content to the callback
function postGist(data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.github.com/gists');

    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            var data = JSON.parse(this.responseText);
            callback(data.files["luckperms-data.json"]["raw_url"])
        }
    };

    // construct the payload for the gist API
    var post = {
        "description": "LuckPerms Web Permissions Editor Data",
        "public": false,
        "files": {
            "luckperms-data.json": {
                "content": data
            }
        }
    };

    // post the data to the API
    xhr.send(JSON.stringify(post))
}

function contains(haystack, needle) {
    return haystack && haystack.indexOf(needle) !== -1
}

// parses a duration from a string to a duration in seconds
function parseDuration(s) {
    var spaceRgx = new RegExp(" ", 'g');

    var seconds = 0;
    var minutes = 0;
    var hours = 0;
    var days = 0;

    if (contains(s, "d")) {
        days = Number(s.split("d")[0].replace(spaceRgx, ""));
        if (contains(s, "h") || contains(s, "m") || contains(s, "s")) {
            s = s.split("d")[1];
        }
    }

    if (contains(s, "h")) {
        hours = Number(s.split("h")[0].replace(spaceRgx, ""));
        if (contains(s, "m") || contains(s, "s")) {
            s = s.split("h")[1];
        }
    }

    if (contains(s, "m")) {
        minutes = Number(s.split("m")[0].replace(spaceRgx, ""));
        if (contains(s, "s")) {
            s = s.split("m")[1];
        }
    }

    if (contains(s, "s")) {
        seconds = Number(s.split("s")[0].replace(spaceRgx, ""));
    }

    if (!seconds) {
        seconds = 0;
    }
    if (!minutes) {
        minutes = 0
    }
    if (!hours) {
        hours = 0
    }
    if (!days) {
        days = 0;
    }

    if (seconds === 0 && minutes === 0 && hours === 0 && days === 0) {
        return null
    }

    return (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;
}

function expressDuration(s) {
    if (s === 0) {
        return "0s";
    }

    var days = Math.floor(s / 86400);
    var hours = Math.floor(((s % 86400) / 3600));
    var minutes = Math.floor((((s % 86400) % 3600) / 60));
    var seconds = (((s % 86400) % 3600) % 60);

    var ret = "";
    if (days !== 0) {
        ret += (days + "d ");
    }
    if (hours !== 0) {
        ret += (hours + "h ");
    }
    if (minutes !== 0) {
        ret += (minutes + "m ");
    }
    if (seconds !== 0) {
        ret += (seconds + "s")
    }
    return ret.trim();
}

function parseContexts(s) {
    var contexts = {};
    s.split(" ").forEach(function (part) {
        var kv = part.split("=", 2);
        if (kv && kv.length === 2) {
            var key = kv[0];
            contexts[key] = kv[1]
        }
    });
    return contexts;
}

// callback for when a record in the table is deleted
function handleDelete(e) {
    var id = e.parentElement.parentElement.id;
    var i = parseInt(id.substring(1));

    rows.splice(i, 1);
    reloadTable()
}

function handlePull(e) {
    var id = e.parentElement.parentElement.id;
    var i = parseInt(id.substring(1));

    var node = rows[i];

    var inputMenu = document.getElementsByClassName("inpform")[0];
    var children = inputMenu.getElementsByTagName("input");

    children[0].value = node.permission;

    if (node.hasOwnProperty("expiry")) {
        children[1].value = node.expiry;
    } else {
        children[1].value = null;
    }
    if (node.hasOwnProperty("server")) {
        children[2].value = node.server;
    } else {
        children[2].value = null;
    }
    if (node.hasOwnProperty("world")) {
        children[3].value = node.world;
    } else {
        children[3].value = null;
    }
    if (node.hasOwnProperty("contexts")) {
        var contextsStr = "";
        for (var key in node.contexts) {
            if (node.contexts.hasOwnProperty(key)) {
                var value = node.contexts[key];
                contextsStr += (key + "=" + value + " ")
            }
        }
        children[4].value = contextsStr;
    } else {
        children[4].value = null;
    }
}

function handleAddEnter(element, event) {
    // listen for the enter key
    if (event.which === 13 || event.keyCode === 13) {
        handleAdd(element);
        return false
    }

    return true
}

function handleAdd(e) {
    var parent = e.parentElement;
    var children = parent.getElementsByTagName("input");

    var permission = children[0].value;

    // don't process the add if the permission field is left empty
    if (!permission) {
        return
    }

    var expiry = children[1].value;
    var server = children[2].value;
    var world = children[3].value;
    var contexts = children[4].value;

    var now = Math.round((new Date()).getTime() / 1000);
    var expiryTime;

    if (!expiry) {
        expiryTime = 0
    } else {
        var t = Number(expiry);
        if (t) {
            if (t < now) {
                expiryTime = 0
            } else {
                expiryTime = t
            }
        } else {
            var duration = parseDuration(expiry);
            if (!duration) {
                expiryTime = 0;
            } else {
                expiryTime = now + duration
            }
        }
    }

    if (expiryTime <= 1) {
        expiryTime = 0
    }

    if (!server) {
        server = "global"
    }

    if (!world) {
        world = "global"
    }

    var contextsObj = {};
    if (contexts) {
        contextsObj = parseContexts(contexts)
    }

    rows.push(makeNode(permission, true, server, world, expiryTime, contextsObj));
    reloadTable()
}

// called when the value tag is clicked
function handleValueSwap(e) {
    var id = e.parentElement.parentElement.id;
    var i = parseInt(id.substring(1));

    rows[i].value = !((rows[i].value == null) || rows[i].value);
    reloadTable()
}

function handleSave(e) {
    console.log("Saving data to gist");

    // construct the data object to send back to gist
    var data = {};
    data.who = who;
    data.nodes = rows;

    // post the data, and then send a popup when the save is complete
    postGist(JSON.stringify(data), function (ret) {
        console.log("Save URL: " + ret);

        // parse the tag from the returned url
        var split = ret.split("/");
        var id = split[4] + "/" + split[6];

        // display the popup
        var popup = document.getElementById("popup");

        var content = "";
        content += '<div class="alert">';
        content += '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span>';
        content += '<strong>Success!</strong> Data was saved to gist. Run <code id="apply_command" class="clickable" data-clipboard-target="#apply_command" title="Click, to copy to Clipboard">/'
            + cmdAlias + ' applyedits ' + id + '</code> to apply your changes.</div>';
        popup.innerHTML = content

        if (!clipboard) {
            var copiedTimer;
            clipboard = new Clipboard("#apply_command")

            clipboard.on("success", function(e) {
                e.clearSelection()

                if (e.trigger.classList.contains("copied")) {
                    var copy = e.trigger.cloneNode(true);
                    e.trigger.parentNode.replaceChild(copy, e.trigger);

                    clearTimeout(copiedTimer)
                } else {
                    e.trigger.classList.add("copied");
                }

                copiedTimer = setTimeout(function() {
                    e.trigger.classList.remove("copied");
                }, 4000)
            })
        }
    })
}

// reloads the data in the table from the values stored in the rows array
function reloadTable() {
    var content = "";

    if (rows.length) {
        // begin the table
        content += '<div class="table">';

        // field headings
        content += '<div class="row header">';
        content += '<div class="cell">Permission</div>';
        content += '<div class="cell">Value</div>';
        content += '<div class="cell">Expiry</div>';
        content += '<div class="cell">Server</div>';
        content += '<div class="cell">World</div>';
        content += '<div class="cell">Contexts</div>';
        content += '<div class="cell"></div>';
        content += '</div>';

        // add each row
        var i = -1;
        rows.forEach(function (node) {
            i++;
            content += nodeToHtml(i, node)
        });

        content += '</div>';
    }

    // set the data
    var element = document.getElementById("table-section");
    element.innerHTML = content
}

function nodeToHtml(id, node) {
    var content = "";

    // start div
    content += '<div id="e' + id + '" class="row">';

    // variable content
    content += '<div class="cell">' + node.permission + '</div>';

    if (!node.hasOwnProperty("value") || node.value) {
        content += '<div class="cell"><code onclick="handleValueSwap(this)" class="code-true clickable">true</code></div>'
    } else {
        content += '<div class="cell"><code onclick="handleValueSwap(this)" class="code-false clickable">false</code></div>'
    }

    if (!node.hasOwnProperty("expiry") || node.expiry === 0) {
        content += '<div class="cell">never</div>'
    } else {
        var now = Math.round((new Date()).getTime() / 1000);
        var left = node.expiry - now;
        if (left <= 0) {
            content += '<div class="cell">now</div>'
        } else {
            content += '<div class="cell">' + expressDuration(left) + '</div>'
        }
    }

    if (node.hasOwnProperty("server")) {
        content += '<div class="cell">' + node.server + '</div>'
    } else {
        content += '<div class="cell">global</div>'
    }

    if (node.hasOwnProperty("world")) {
        content += '<div class="cell">' + node.world + '</div>'
    } else {
        content += '<div class="cell">global</div>'
    }

    if (node.hasOwnProperty("contexts")) {
        var contextsStr = "";
        for (var key in node.contexts) {
            if (node.contexts.hasOwnProperty(key)) {
                var value = node.contexts[key];
                contextsStr += (key + "=" + value + " ")
            }
        }

        content += '<div class="cell">' + contextsStr.trim() + '</div>'
    } else {
        content += '<div class="cell">none</div>'
    }

    // static delete button
    content += '<div class="cell">';
    content += '<i onclick="handleDelete(this)" class="clickable material-icons md-18">delete</i>';
    content += '<i onclick="handlePull(this)" class="clickable material-icons md-18" style="padding-left: 8px;font-size: 22px;">content_copy</i>';
    content += '</div>';
    content += '</div>';

    return content
}

// hides the welcome panel from view
function hidePanel() {
    document.getElementsByClassName("panel")[0].style.display = "none"
    document.getElementsByClassName("bar")[0].style.display = "inherit"
    document.getElementsByClassName("wrapper")[0].style.display = "inherit"
}

// unhides the welcome panel
function showPanel() {
    document.getElementsByClassName("panel")[0].style.display = "initial"
    document.getElementsByClassName("bar")[0].style.display = "none"
    document.getElementsByClassName("wrapper")[0].style.display = "none"
}

// pulls the latest production version of the editor and displays it
setTimeout(function () {
	readPage("https://api.github.com/repos/lucko/LuckPermsWeb/branches/production", function (ret) {
	    var data = JSON.parse(ret);
	    var version = document.getElementById("version");
	    version.innerHTML = data.commit.sha.substring(0,7);
	    version.href = data.commit.html_url;
	});
}, 0)

// try to load the page from the url parameters when the page loads
var params = document.location.search;
if (params) {
    console.log("Trying to load from URL params");

    if (params.startsWith("?")) {
        params = params.substring(1)
    }

    // update status
    document.getElementById("prompt").innerHTML = "Loading...";

    // get data
    var parts = params.split("/");
    console.log(parts);

    if (parts.length === 2) {
        var url = "https://gist.githubusercontent.com/anonymous/" + parts[0] + "/raw/" + parts[1] + "/luckperms-data.json";
        readPage(url, function (ret) {
            var data = JSON.parse(ret);

            console.log("Loaded from: ")
            console.log(url)

            // replace the local node array with the json data
            rows = data.nodes;
            who = data.who;
            cmdAlias = data.cmdAlias;
            if (!cmdAlias) {
                cmdAlias = "lp"
            }

            // populate autocomplete options
            perms = data.knownPermissions;
            if (perms) {
                perms.forEach(addAutoCompletePermission)
            }

            hidePanel();
            reloadTable()
        })
    } else {
        // just the load the table
        console.log("Creating empty table for test purposes.")
        hidePanel();
        reloadTable()
    }
}
