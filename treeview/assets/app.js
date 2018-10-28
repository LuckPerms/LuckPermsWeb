// the data currently in the editor
let metadata = {};
let tree = {};
let checkResults = {};

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
    let params = document.location.search || window.location.hash;
    if (params) {
        console.log("Found params to load from");

        if (params.startsWith("?") || params.startsWith("#")) {
            params = params.substring(1);
        }

        // update status
        $("#prompt").html("Loading...");

        console.log("Got params: " + params);
        loadFromParams(params);
    }
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

function walkTree(level, children, consumer) {
    for (const perm in children) {
        let line;
        if (checkResults) {
            let result = checkResults[perm];
            if (!result) {
                result = "undefined";
            }
            line = '<span class="highlight-' + result + '">' + ("│  ".repeat(level)) + "├── " + perm + '</span>';
        } else {
            line = ("│  ".repeat(level)) + "├── " + perm;
        }
        consumer(line);

        walkTree(level + 1, children[perm], consumer);
    }
}

function reloadTree() {
    let content = "";

    const consumer = function(string) {
        content += (string + "\n");
    };

    walkTree(0, tree, consumer);

    $("#tree-content").html(content);
}

// hides the welcome panel from view
function hidePanel() {
    $("#panel").hide();
    $("#bar").show();
    $("#tree-content").show();
}

function loadFromParams(params) {
    // get data
    const url = "https://bytebin.lucko.me/" + params;
    console.log("Loading from URL: " + url);
    $.getJSON(url, loadData).fail(showLoadingError)
}

function showLoadingError() {
    $("#prompt").html('<h3 class="loading-error"><b>Loading error</b>' +
        '<br><br>Either the URL was copied incorrectly or the session has expired.<br><br>Please try again.</h3>');
}

function loadData(data) {
    metadata = data["metadata"];
    tree = data["data"]["tree"];
    checkResults = data["data"]["checkResults"];

    hidePanel();
    reloadTree();
}

// Do things when page has loaded
$(loadCss);
$(loadContent);
