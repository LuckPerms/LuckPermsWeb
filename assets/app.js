// the rows currently in the table
let rows = [];

// permissionHistory of the data for undo/redo
let permissionHistory = [];
let permissionHistoryPos = -1;

// the sorting properties
const sort = {
    on: null,
    mode: "asc"
};

// who is being edited. this should be in the format "user/<uuid>" or "group/<group name>"
// or empty, if the data loaded at the start of the session didn't contain the attribute
let whoType = "";
let who = "";
let whoFriendly = "";

// the command alias used to open the editor page
let cmdAlias = "lp";

// if the initial editor token was a "legacy" token.
// the legacy tokens contain two codes, separated by a "/" character
// the newer tokens only contain one code element
let legacy = false;

const permsListObject = document.getElementById("permissions-list");

// Clipboard instance
let clipboard;
const classesRegex = / ?(cell|clickable|editable) ?/gi;

// loads optional stylesheets async
function loadCss() {
    const stylesheet = /<link(?:\s[^.-\d][^\/\]'"[!#$%&()*+,;<=>?@^`{|}~ ]*(?:=(?:"[^"]*"|'[^']*'|[^'"<\s]*))?)*\s?\/?>/gi;
    const head = $("head");
    const css = $("#css-defer").text();
    let matches;
    while ((matches = stylesheet.exec(css)) !== null) {
        head.append(matches[0]);
    }
}

// try to load the page from the url parameters when the page loads
function loadContent() {
    let params = document.location.search;
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

function canUndo() {
    return permissionHistoryPos > 0;
}

function canRedo() {
    return (permissionHistoryPos + 1) < permissionHistory.length;
}

function isUnchanged() {
    return JSON.stringify(rows) === JSON.stringify(permissionHistory[permissionHistoryPos]);
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
    const option = document.createElement("option");
    option.value = perm;
    permsListObject.appendChild(option);
}

// makes a minimal node object from the given parameters.
function makeNode(perm, value, server, world, expiry, contexts) {
    const node = {};

    node.permission = perm;

    if (!value) {
        node.value = false;
    }

    if (server.toLowerCase() !== "global") {
        node.server = server
    }

    if (world.toLowerCase() !== "global") {
        node.world = world
    }

    if (expiry > 1) {
        node.expiry = expiry
    }

    let hasContexts = false;
    for (const key in contexts) {
        if (contexts.hasOwnProperty(key)) {
            hasContexts = true;
            break;
        }
    }

    if (hasContexts) {
        node.context = contexts
    }

    return node
}

// posts a string to GitHub's gist service, and returns the raw url of the content to the callback
function postGist(data, callback) {
    // construct the payload for the gist API
    const post = {
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
    const spaceRgx = new RegExp(" ", 'g');
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let days = 0;

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

    const days = Math.floor(s / 86400);
    const hours = Math.floor(((s % 86400) / 3600));
    const minutes = Math.floor((((s % 86400) % 3600) / 60));
    const seconds = (((s % 86400) % 3600) % 60);

    let ret = "";
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
    const contexts = {};
    s.split(" ").forEach(function(part) {
        const kv = part.split("=", 2);
        if (kv && kv.length === 2) {
            const key = kv[0];
            contexts[key] = kv[1]
        }
    });
    return contexts;
}

function escapeHtml(text) {
    return text.replace(/[\"&'\/<>]/g, function(a) {
        return {
            '"': '&quot;',
            '&': '&amp;',
            "'": '&#39;',
            '/': '&#47;',
            '<': '&lt;',
            '>': '&gt;'
        }[a];
    });
}

// callback for when a record in the table is deleted
function handleDelete() {
    const id = $(this).parents(".row").attr("id").substring(1);
    rows.splice(id, 1);
    pushHistory();
    reloadTable();
}

function handleCopy() {
    const id = $(this).parents(".row").attr("id").substring(1);
    const node = rows[id];

    const inputs = $("#inpform").find("> input");
    const permission = inputs.filter("[name=permission]");
    const expiry = inputs.filter("[name=expiry]");
    const server = inputs.filter("[name=server]");
    const world = inputs.filter("[name=world]");
    const contexts = inputs.filter("[name=contexts]");

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
        let contextStr = "";
        for (const key in node.context) {
            if (node.context.hasOwnProperty(key)) {
                const value = node.context[key];
                contextStr += (key + "=" + value + " ")
            }
        }
        contexts.val(contextStr);
    } else {
        contexts.val(null);
    }
}

function handleAddEnter(event) {
    if (event.key === "Enter") {
        handleAdd();
        return false;
    }
    return true;
}

function handleAdd() {
    const inputs = $("#inpform").find("input");
    let permission = inputs.filter("[name=permission]").val();

    // don't process the add if the permission field is left empty
    if (!permission) {
        return;
    }

    let expiry = inputs.filter("[name=expiry]").val();
    let server = inputs.filter("[name=server]").val();
    let world = inputs.filter("[name=world]").val();
    let contexts = inputs.filter("[name=contexts]").val();

    let now = Math.round((new Date()).getTime() / 1000);
    let expiryTime;

    if (!expiry) {
        expiryTime = 0
    } else {
        let t = Number(expiry);
        if (t) {
            if (t < now) {
                expiryTime = 0
            } else {
                expiryTime = t
            }
        } else {
            let duration = parseDuration(expiry);
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

    let contextsObj = {};
    if (contexts) {
        contextsObj = parseContexts(contexts)
    }

    rows.push(makeNode(permission, true, server, world, expiryTime, contextsObj));
    pushHistory();
    reloadTable();
}

// called when the value tag is clicked
function handleValueSwap() {
    const id = $(this).parents(".row").attr("id").substring(1);

    rows[id].value = !((rows[id].value == null) || rows[id].value);
    pushHistory();
    reloadTable();
}

function handleEditStart() {
    const value = $(this).text();
    const type = $(this).attr("class").replace(classesRegex, "");
    $(this).html('<input ' + ((type === "permission") ? 'list="permissions-list" ' : '') + '>');
    const input = $(this).find("input");
    input.focus();
    input.val(value);
}

function handleEditStop(e) {
    const id = e.parents(".row").attr("id").substring(1);
    const cell = e.parents(".cell");
    const type = cell.attr("class").replace(classesRegex, "");
    let value = e.val();

    if (type === "permission") {
        if (value === "") {
            value = rows[id].permission;
        } else {
            rows[id].permission = value;
        }
    } else if (type === "expiry") {
        const now = Math.round((new Date()).getTime() / 1000);
        let expiryTime;

        if (!value || (value === "never")) {
            expiryTime = 0;
        } else {
            const t = Number(value);
            if (t) {
                if (t < now) {
                    expiryTime = 0;
                } else {
                    expiryTime = t - now;
                }
            } else {
                let duration = parseDuration(value);
                if (!duration) {
                    expiryTime = 0;
                } else {
                    expiryTime = duration;
                }
            }
        }

        if (expiryTime === 0) {
            delete rows[id].expiry;
            value = "never";
        } else {
            rows[id].expiry = now + expiryTime;
            value = expressDuration(expiryTime);
        }
    } else if ((type === "server") || (type === "world")) {
        if ((value === "") || (value === "global")) {
            value = "global";
            delete rows[id][type];
        } else {
            rows[id][type] = value;
        }
    } else if (type === "contexts") {
        if ((value === "") || (value === "none")) {
            value = "none";
            delete rows[id].context;
        } else {
            rows[id].context = parseContexts(value);
        }
    }

    cell.text(value);
    pushHistory();
}

function handleEditBlur() {
    handleEditStop($(this));
}

function handleEditKeypress(event) {
    const key = event.key;
    if (key === "Escape") {
        reloadTable();
    } else if (key === "Enter") {
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

function handleSort(event) {
    const element = event.currentTarget;
    if (element.innerHTML.charAt(0) === "↓") {
        // asc --> desc
        sort.on = element.innerHTML.toLowerCase().substring(2);
        sort.mode = "desc";
    } else if (element.innerHTML.charAt(0) === "↑") {
        // desc --> nothing
        sort.on = null;
    } else {
        // nothing --> asc
        sort.on = element.innerHTML.toLowerCase();
        sort.mode = "asc";
    }
    reloadTable();
}

function handleSave() {
    const saveButton = $("#save-button");
    if (saveButton.hasClass("loading"))
        return;

    console.log("Saving data to gist");

    // construct the data object to send back to gist
    const data = {};
    data.who = `${whoType}/${who}`;
    data.nodes = rows;

    // Change save button to Loading
    saveButton.removeClass("save").addClass("loading").text("loop");

    // post the data, and then send a popup when the save is complete
    postGist(JSON.stringify(data, null, 2), function(data) {
        let id;
        if (legacy) {
            const rawUrl = data.files["luckperms-data.json"].raw_url;
            // parse the tag from the returned url
            const split = rawUrl.split("/");
            id = split[4] + "/" + split[6];
        } else {
            id = data.id
        }

        console.log("Save id: " + id);

        // display the popup
        let content = "";
        content += '<div class="alert">';
        content += '<span class="closebtn">&times;</span>';
        content +=
            '<strong>Success!</strong> Data was saved to gist. Run <code class="apply_command" class="clickable" title="Copy to clipboard">/' +
            cmdAlias + ' applyedits ' + id + '</code> to apply your changes.</div>';

        const popup = $("#popup");
        popup.append(content);
        popup.find(".alert").last().hide().slideDown();

        // Change save button back
        $("#save-button").removeClass("loading").addClass("save").text("save");

        if (!clipboard) {
            clipboard = new Clipboard(".apply_command", {
                target: function(trigger) {
                    return trigger;
                }
            });

            clipboard.on("success", function(e) {
                e.clearSelection();
                let trigger = $(e.trigger);

                if (trigger.hasClass("copied")) {
                    const clone = trigger.clone(true);
                    trigger.replaceWith(trigger.clone(true));
                    trigger = clone;

                    clearTimeout(trigger.copiedTimer);
                } else {
                    trigger.addClass("copied");
                }

                trigger.copiedTimer = setTimeout(function() {
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

function handleShortcuts(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
            case 's':
                event.preventDefault();

                handleSave();

                break;
            case 'h':
                event.preventDefault();

                showHelp();

                break;
            case 'z':
                event.preventDefault();

                handleUndo();

                break;
            case 'y':
                event.preventDefault();

                handleRedo();

                break;
        }
    }
}

// reloads the data in the table from the values stored in the rows array
function reloadTable() {
    const entries = [];

    // form an array of entries
    let i = -1;
    rows.forEach(function(node) {
        i++;
        entries.push({
            id: i,
            value: node
        });
    });

    // apply sorting
    if (sort.on) {
        entries.sort(function(a, b) {
            const ax = a.value.hasOwnProperty(sort.on) ? a.value[sort.on] : "";
            const bx = b.value.hasOwnProperty(sort.on) ? b.value[sort.on] : "";
            if (ax < bx) {
                return -1;
            }
            if (ax > bx) {
                return 1;
            }
            return 0;
        });
        if (sort.mode === "desc") {
            entries.reverse();
        }
    }

    let content = "";
    if (rows.length) {
        // begin the table
        content += '<div class="table">';

        // field headings
        content += '<div class="row header">';

        for (let col of ["Permission", "Value", "Expiry", "Server", "World"]) {
            if (sort.on === col.toLowerCase()) {
                if (sort.mode === "desc") {
                    col = "↑ " + col;
                } else {
                    col = "↓ " + col;
                }
            }

            content += '<div class="cell clickable">' + col + '</div>';
        }

        content += '<div class="cell">Contexts</div>';
        content += '<div class="cell"></div>';
        content += '</div>';

        // add each row
        entries.forEach(function(entry) {
            content += nodeToHtml(entry.id, entry.value);
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
    let content = "";

    // start div
    content += '<div id="e' + id + '" class="row">';

    // variable content
    content += '<div list="permissions-list" class="cell permission clickable editable">' + escapeHtml(node.permission) +
        '</div>';

    if (!node.hasOwnProperty("value") || node.value) {
        content += '<div class="cell"><code class="code-true clickable">true</code></div>'
    } else {
        content += '<div class="cell"><code class="code-false clickable">false</code></div>'
    }

    if (!node.hasOwnProperty("expiry") || node.expiry === 0) {
        content += getContentDiv("expiry") + 'never</div>'
    } else {
        const now = Math.round((new Date()).getTime() / 1000);
        const left = node.expiry - now;
        if (left <= 0) {
            content += getContentDiv("expiry") + 'now</div>'
        } else {
            content += getContentDiv("expiry") + expressDuration(left) + '</div>'
        }
    }

    if (node.hasOwnProperty("server")) {
        content += getContentDiv("server") + escapeHtml(node.server) + '</div>'
    } else {
        content += getContentDiv("server") + 'global</div>'
    }

    if (node.hasOwnProperty("world")) {
        content += getContentDiv("world") + escapeHtml(node.world) + '</div>'
    } else {
        content += getContentDiv("world") + 'global</div>'
    }

    if (node.hasOwnProperty("context")) {
        let contextStr = "";
        for (const key in node.context) {
            if (node.context.hasOwnProperty(key)) {
                const value = node.context[key];
                contextStr += (key + "=" + value + " ")
            }
        }

        content += getContentDiv("contexts") + escapeHtml(contextStr.trim()) + '</div>'
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
    const identifier = $("#identifier");
    identifier.text(whoFriendly);
    identifier.attr("data-type", whoType);
    identifier.attr("title", `Editing ${whoType} "${whoFriendly}" (${who})`);
}

// hides the welcome panel from view
function hidePanel() {
    $("#panel").hide();
    $("#bar").show();
    $("#table-content").show();
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

    // populate auto-complete options
    let perms = data.knownPermissions;
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
    const parts = params.split("/");
    if (parts.length === 2) {
        legacy = true; // mark as a legacy code
        const url = "https://gist.githubusercontent.com/anonymous/" + parts[0] + "/raw/" + parts[1] + "/luckperms-data.json";
        console.log("Loading from legacy URL: " + url);
        $.getJSON(url, function(data) {
            loadData(data)
        }).fail(showLoadingError)
    } else {
        // single token??
        const url = "https://api.github.com/gists/" + params;
        console.log("Loading from URL: " + url);
        $.getJSON(url, function(data) {
            const fileObject = data.files["luckperms-data.json"];
            if (fileObject.truncated) {
                const rawUrl = fileObject.raw_url;
                $.getJSON(rawUrl, function(permsData) {
                    loadData(permsData)
                }).fail(showLoadingError)
            } else {
                const permsData = JSON.parse(fileObject.content);
                loadData(permsData);
            }
        }).fail(showLoadingError)
    }
}

function showHelp() {
    $("#help-section").fadeIn();
}

function hideHelp(e) {
    if (e.target !== this) {
        return false;
    }

    $("#help-section").fadeOut();
}

function showLoadingError() {
    $("#prompt").html('<h3 class="loading-error"><b>Error loading data!</b>' +
        '<br><br>Please check the url was copied correctly.</h3>');
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

$(document).on("click", "#table-section .header > .clickable", handleSort);

$(window).bind("keydown", handleShortcuts);

// Do things when page has loaded
$(loadCss);
$(loadContent);
