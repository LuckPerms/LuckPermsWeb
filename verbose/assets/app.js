// the data currently in the editor
let metadata = {};
let log = [];


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

function formatContext(context) {
    const formatted = [];
    for (const c of context) {
        formatted.push('<span class="inline-code">' + escapeHtml(c.key) + "=" + escapeHtml(c.value) + '</span>');
    }
    return formatted.join(", ");
}

function reloadTable() {
    let content = "";

    content += '<table class="table">';
    content += '<tr class="row header">';
    for (const col of ["Target", "Permission", "Result", ""]) {
        content += '<th class="cell">' + col + '</th>';
    }
    content += '</tr>';

    let i = 0;
    for (const entry of log) {
        const target = entry.who.identifier;
        const permission = entry.permission;
        const result = entry.result;

        // begin row
        content += '<tr id="e' + i + '" class="row clickable">';
        content += '<th class="cell target">' + escapeHtml(target) + '</th>';
        content += '<th class="cell permission">' + escapeHtml(permission) + '</th>';

        if (result === "true") {
            content += '<th class="cell result"><span class="value" data-type="true">true</span></th>';
        } else if (result === "false") {
            content += '<th class="cell result"><span class="value" data-type="false">false</span></th>';
        } else {
            content += '<th class="cell result"><span class="value" data-type="undefined">undefined</span></th>';
        }

        content += '<th class="cell buttons">';
        content += '<i class="clickable material-icons" title="Expand">expand_more</i>';
        content += '</th>';
        content += '</tr>';
        // end row

        const context = entry.context;
        const origin = entry.origin;
        const trace = entry.trace;

        // begin extra row
        content += '<tr id="e' + i + '-extra" class="row extra" style="display: none">';
        content += '<td class="extra-cell" colspan="4">';
        content += '<p><b>Context: </b>' + formatContext(context) + '</p>';
        content += '<p><b>Origin: &nbsp; &nbsp;</b><span>' + escapeHtml(origin.toUpperCase()) + '</span></p>';
        content += '<b>Trace: </b>';
        content += '<br>';
        content += '<div class="trace">';
        for (const line of trace) {
            content += escapeHtml(line) + '<br>';
        }
        content += '</div>';
        content += '</td>';
        content += '</tr>';
        // end extra row
        i++;
    }

    content += '</table>';

    // set the data
    $("#table-content").html(content);
}

// hides the welcome panel from view
function hidePanel() {
    $("#panel").hide();
    $("#bar").show();
    $("#table-content").show();
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
    log = data["data"];
    hidePanel();
    reloadTable();
}

function handleExpand() {
    const extra = $("#" + $(this).attr("id") + "-extra");
    if (extra.is(":visible")) {
        $(this).find(".material-icons").text("expand_more").prop("title", "Expand");
        extra.hide();
    } else {
        $(this).find(".material-icons").text("expand_less").prop("title", "Hide");
        extra.show();
    }
}

// Register events
$(document).on("click", "#table-content tr.clickable", handleExpand);

// Do things when page has loaded
$(loadCss);
$(loadContent);
