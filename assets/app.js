// the rows currently in the table
var rows = [];

// permissionHistory of the data for undo/redo
var permissionHistory = [];
var permissionHistoryPos = -1;

// who is being edited. this should be in the format "user/<uuid>" or "group/<group name>"
// or empty, if the data loaded at the start of the session didn't contain the attribute
var whoType = "";
var who = "";
var whoFriendly = "";

// the command alias used to open the editor page
var cmdAlias = "lp";

// if the initial editor token was a "legacy" token.
// the legacy tokens contain two codes, separated by a "/" character
// the newer tokens only contain one code element
var legacy = false;

var permsListObject = document.getElementById("permissions-list");

// Clipboard instance
var clipboard;
const classesRegex = / ?(cell|clickable|editable) ?/gi;

// loads optional stylesheets async
function loadCss() {
    const stylesheet =
        /<link(?:\s[^.-\d][^\/\]'"[!#$%&()*+,;<=>?@^`{|}~ ]*(?:=(?:"[^"]*"|'[^']*'|[^'"<\s]*))?)*\s?\/?>/gi;
    var head = $("head");
    var css = $("#css-defer").text();
    var matches;

    while ((matches = stylesheet.exec(css)) !== null) {
        head.append(matches[0]);
    }
}

// try to load the page from the url parameters when the page loads
function loadContent() {
    var params = document.location.search;
    if (params) {
        console.log("Found location parameters to load from");

        if (params.startsWith("?")) {
            params = params.substring(1);
        }

        // update status
        $("#prompt").html("Loading...");

        if (params === "dev") {
            // just the load the table
            console.log("Creating empty table for development & testing purposes");

            whoType = "dev";
            who = "test";
            whoFriendly = "Developer Test";

            populateIdentifier();
            hidePanel();
            reloadTable();
            pushHistory();
        } else {
            console.log("Got params: " + params);
            loadFromParams(params);
        }
    }
}

// pulls the latest production version of the editor and displays it
function loadVersion() {
    readPage("https://api.github.com/repos/lucko/LuckPermsWeb/branches/production", function(data) {
        var version = $("#version");
        version.html(data.commit.sha.substring(0, 7));
        version.attr("href", data.commit.html_url);
    });
}

function canUndo() {
    return permissionHistoryPos > 0;
}

function canRedo() {
    return (permissionHistoryPos + 1) < permissionHistory.length;
}

function isUnchanged() {
    return JSON.stringify(rows) == JSON.stringify(permissionHistory[permissionHistoryPos]);
}

function pushHistory() {
    if (isUnchanged()) {
        return;
    } else if (canRedo()) {
        // Shorten the array
        permissionHistory = permissionHistory.slice(0, (permissionHistoryPos + 1));
    }

    permissionHistory.push(deepClone(rows));
    permissionHistoryPos++;

    updateHistoryButtons();
}

function updateHistoryButtons() {
    setButtonClickable($("#undo-button"), canUndo());
    setButtonClickable($("#redo-button"), canRedo());
}

function setButtonClickable(button, clickable) {
    if (clickable) {
        button.removeClass("unclickable").addClass("clickable");
    } else {
        button.removeClass("clickable").addClass("unclickable");
    }
}

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

// reads data from a web address, and passes the result JSON object to the callback
function readPage(link, callback) {
    $.getJSON(link, callback);
}

// posts a string to GitHub's gist service, and returns the raw url of the content to the callback
function postGist(data, callback) {
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

    $.ajax("https://api.github.com/gists", {
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(post),
        method: "POST",
        success: callback
    });
}

function contains(haystack, needle) {
    return haystack && haystack.indexOf(needle) !== -1
}

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
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
    s.split(" ").forEach(function(part) {
        var kv = part.split("=", 2);
        if (kv && kv.length === 2) {
            var key = kv[0];
            contexts[key] = kv[1]
        }
    });
    return contexts;
}

// callback for when a record in the table is deleted
function handleDelete() {
    var id = $(this).parents(".row").attr("id").substring(1);

    rows.splice(id, 1);
    pushHistory();
    reloadTable();
}

function handleCopy() {
    var id = $(this).parents(".row").attr("id").substring(1);

    var node = rows[id];

    var inputs = $("#inpform > input");
    var permission = inputs.filter("[name=permission]");
    var expiry = inputs.filter("[name=expiry]");
    var server = inputs.filter("[name=server]");
    var world = inputs.filter("[name=world]");
    var contexts = inputs.filter("[name=contexts]");

    permission.val(node.permission);

    if (node.hasOwnProperty("expiry")) {
        expiry.val(node.expiry);
    } else {
        expiry.val(null);
    }
    if (node.hasOwnProperty("server")) {
        server.val(node.server);
    } else {
        server.val(null);
    }
    if (node.hasOwnProperty("world")) {
        world.val(node.world);
    } else {
        world.val(null);
    }
    if (node.hasOwnProperty("contexts")) {
        var contextsStr = "";
        for (var key in node.contexts) {
            if (node.contexts.hasOwnProperty(key)) {
                var value = node.contexts[key];
                contextsStr += (key + "=" + value + " ")
            }
        }
        contexts.val(contextsStr);
    } else {
        contexts.val(null);
    }
}

function handleAddEnter(event) {
    if (event.key == "Enter") {
        handleAdd();
        return false;
    }

    return true;
}

function handleAdd() {
    var inputs = $("#inpform input");

    var permission = inputs.filter("[name=permission]").val();

    // don't process the add if the permission field is left empty
    if (!permission) {
        return;
    }

    var expiry = inputs.filter("[name=expiry]").val();
    var server = inputs.filter("[name=server]").val();
    var world = inputs.filter("[name=world]").val();
    var contexts = inputs.filter("[name=contexts]").val();

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
    pushHistory();
    reloadTable();
}

// called when the value tag is clicked
function handleValueSwap() {
    var id = $(this).parents(".row").attr("id").substring(1);

    rows[id].value = !((rows[id].value == null) || rows[id].value);
    pushHistory();
    reloadTable();
}

function handleEditStart() {
    var value = $(this).text();
    var type = $(this).attr("class").replace(classesRegex, "");
    $(this).html('<input ' + ((type == "permission") ? 'list="permissions-list" ' : '') + '>');
    var input = $(this).find("input");
    input.focus();
    input.val(value);
}

function handleEditStop(e) {
    var id = e.parents(".row").attr("id").substring(1);
    var cell = e.parents(".cell");
    var type = cell.attr("class").replace(classesRegex, "");
    var value = e.val();

    if (type == "permission") {
        if (value == "") {
            value = rows[id].permission;
        } else {
            rows[id].permission = value;
        }
    } else if (type == "expiry") {
        var now = Math.round((new Date()).getTime() / 1000);
        var expiryTime;

        if ((value == "") || (value == "never")) {
            expiryTime = 0;
        } else {
            var t = Number(value);

            if (t) {
                if (t < now) {
                    expiryTime = 0;
                } else {
                    expiryTime = t - now;
                }
            } else {
                var duration = parseDuration(value);

                if (!duration) {
                    expiryTime = 0;
                } else {
                    expiryTime = duration;
                }
            }
        }

        if (expiryTime == 0) {
            delete rows[id].expiry;
            value = "never";
        } else {
            rows[id].expiry = now + expiryTime;
            value = expressDuration(expiryTime);
        }
    } else if ((type == "server") || (type == "world")) {
        if ((value == "") || (value == "global")) {
            value = "global";
            delete rows[id][type];
        } else {
            rows[id][type] = value;
        }
    } else if (type == "contexts") {
        if ((value == "") || (value == "none")) {
            value = "none";
            delete rows[id].contexts;
        } else {
            rows[id].contexts = parseContexts(value);
        }
    }

    cell.html(value);
    pushHistory();
}

function handleEditBlur() {
    handleEditStop($(this));
}

function handleEditKeypress(event) {
    var key = event.key;

    if (key == "Escape") {
        reloadTable();
    } else if (key == "Enter") {
        handleEditStop($(this));
    }
}

function handleUndo() {
    if (!canUndo()) return;

    permissionHistoryPos--;
    applyUndoRedo();
}

function handleRedo() {
    if (!canRedo()) return;

    permissionHistoryPos++;
    applyUndoRedo();
}

function applyUndoRedo() {
    rows = deepClone(permissionHistory[permissionHistoryPos]);

    reloadTable();
    updateHistoryButtons();
}

function handleSave() {
    console.log("Saving data to gist");

    // construct the data object to send back to gist
    var data = {};
    data.who = `${whoType}/${who}`;
    data.nodes = rows;

    // Change save button to Loading
    $("#save-button").removeClass("save").addClass("loading").text("loop")

    // post the data, and then send a popup when the save is complete
    postGist(JSON.stringify(data, null, 2), function(data) {
        var id;

        if (legacy) {
            var rawUrl = data.files["luckperms-data.json"].raw_url
            // parse the tag from the returned url
            var split = rawUrl.split("/");
            id = split[4] + "/" + split[6];
        } else {
            id = data.id
        }

        console.log("Save id: " + id);

        // display the popup
        var content = "";
        content += '<div class="alert">';
        content += '<span class="closebtn">&times;</span>';
        content +=
            '<strong>Success!</strong> Data was saved to gist. Run <code id="apply_command" class="clickable" data-clipboard-target="#apply_command" title="Copy to clipboard">/' +
            cmdAlias + ' applyedits ' + id + '</code> to apply your changes.</div>';
        $("#popup").append(content);
        $("#popup .alert").last().hide().slideDown();

        // Change save button back
        $("#save-button").removeClass("loading").addClass("save").text("save")

        if (!clipboard) {
            var copiedTimer;
            clipboard = new Clipboard("#apply_command")

            clipboard.on("success", function(e) {
                e.clearSelection();
                var trigger = $(e.trigger);

                if (trigger.hasClass("copied")) {
                    var clone = trigger.clone(true);
                    trigger.replaceWith(trigger.clone(true));
                    trigger = clone;

                    clearTimeout(copiedTimer);
                } else {
                    trigger.addClass("copied");
                }

                copiedTimer = setTimeout(function() {
                    trigger.removeClass("copied");
                }, 4000)
            })
        }
    })
}

function handleAlertClose() {
    $(this).parents(".alert").slideUp(function() {
        $(this).remove();
    });
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
        rows.forEach(function(node) {
            i++;
            content += nodeToHtml(i, node)
        });

        content += '</div>';
    }

    // set the data
    $("#table-section").html(content);
}

function getContentDiv(type) {
    return '<div class="cell ' + type + ' clickable editable">'
}

function nodeToHtml(id, node) {
    var content = "";

    // start div
    content += '<div id="e' + id + '" class="row">';

    // variable content
    content += '<div list="permissions-list" class="cell permission clickable editable">' + node.permission +
        '</div>';

    if (!node.hasOwnProperty("value") || node.value) {
        content += '<div class="cell"><code class="code-true clickable">true</code></div>'
    } else {
        content += '<div class="cell"><code class="code-false clickable">false</code></div>'
    }

    if (!node.hasOwnProperty("expiry") || node.expiry === 0) {
        content += getContentDiv("expiry") + 'never</div>'
    } else {
        var now = Math.round((new Date()).getTime() / 1000);
        var left = node.expiry - now;
        if (left <= 0) {
            content += getContentDiv("expiry") + 'now</div>'
        } else {
            content += getContentDiv("expiry") + expressDuration(left) + '</div>'
        }
    }

    if (node.hasOwnProperty("server")) {
        content += getContentDiv("server") + node.server + '</div>'
    } else {
        content += getContentDiv("server") + 'global</div>'
    }

    if (node.hasOwnProperty("world")) {
        content += getContentDiv("world") + node.world + '</div>'
    } else {
        content += getContentDiv("world") + 'global</div>'
    }

    if (node.hasOwnProperty("contexts")) {
        var contextsStr = "";
        for (var key in node.contexts) {
            if (node.contexts.hasOwnProperty(key)) {
                var value = node.contexts[key];
                contextsStr += (key + "=" + value + " ")
            }
        }

        content += getContentDiv("contexts") + contextsStr.trim() + '</div>'
    } else {
        content += getContentDiv("contexts") + 'none</div>'
    }

    // static copy and delete button
    content += '<div class="cell buttons">';
    content += '<i class="clickable material-icons delete" title="Delete">delete</i>';
    content += '<i class="clickable material-icons copy" title="Copy">content_copy</i>';
    content += '</div>';
    content += '</div>';

    return content
}

// populate identifier
function populateIdentifier() {
    var identifier = $("#identifier");
    identifier.text(whoFriendly);
    identifier.attr("data-type", whoType);
    identifier.attr("title", `Editing ${whoType} "${whoFriendly}" (${who})`);
}

// hides the welcome panel from view
function hidePanel() {
    $("#panel").hide()
    $("#bar").show()
    $("#table-content").show()
}

// unhides the welcome panel
function showPanel() {
    $("#panel").show()
    $("#bar").hide()
    $("#table-content").hide()
}

function loadData(data) {
    // replace the local node array with the json data
    rows = data.nodes;
    who = data.who.split("/");
    whoType = who[0];
    who = who[1];
    whoFriendly = (data.whoFriendly == null) ? who : data.whoFriendly;
    cmdAlias = data.cmdAlias;
    if (!cmdAlias) {
        cmdAlias = "lp"
    }

    // populate autocomplete options
    perms = data.knownPermissions;
    if (perms) {
        perms.forEach(addAutoCompletePermission)
    }

    populateIdentifier();
    hidePanel();
    reloadTable();
    pushHistory();
}

function loadFromParams(params) {
    // get data
    var parts = params.split("/");

    if (parts.length === 2) {
        legacy = true; // mark as a legacy code
        var url = "https://gist.githubusercontent.com/anonymous/" + parts[0] + "/raw/" + parts[1] +
            "/luckperms-data.json";
        console.log("Loading from legacy URL: " + url)
        readPage(url, function(data) {
            loadData(data)
        })
    } else {
        // single token??
        var url = "https://api.github.com/gists/" + params;
        console.log("Loading from URL: " + url)
        readPage(url, function(data) {
            var fileObject = data.files["luckperms-data.json"];
            if (fileObject.truncated) {
                var rawUrl = fileObject.raw_url
                readPage(rawUrl, function(permsData) {
                    loadData(permsData)
                })
            } else {
                var permsData = JSON.parse(fileObject.content)
                loadData(permsData);
            }
        })
    }
}

function showHelp() {
    $("#help-section").fadeIn();
}

function hideHelp(e) {
    if (e.target != this)
        return false;

    $("#help-section").fadeOut();
}

// Register events
$(document).on("click", "#undo-button.clickable", handleUndo);
$(document).on("click", "#redo-button.clickable", handleRedo);
$(document).on("click", "#save-button.save", handleSave);
$(document).on("click", "#popup .closebtn", handleAlertClose);
$(document).on("click", "#help-button", showHelp);
$(document).on("click", "#help-section", hideHelp);

$(document).on("click", "#inpform > .add", handleAdd);
$(document).on("keypress", "#inpform > input", handleAddEnter);

$(document).on("click", "#table-section .editable:not(:has(input))", handleEditStart);
$(document).on("click", "#table-section .code-false, #table-section .code-true", handleValueSwap);
$(document).on("blur", "#table-section .editable input", handleEditBlur);
$(document).on("keypress", "#table-section .editable input", handleEditKeypress);

$(document).on("click", "#table-section .buttons > .delete", handleDelete);
$(document).on("click", "#table-section .buttons > .copy", handleCopy);

// Do things when page has loaded
$(loadCss);
$(loadContent);
$(loadVersion);
