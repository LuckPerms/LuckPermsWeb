const BYTEBIN_URL = "https://bytebin.lucko.me/";

// the metadata fields displayed by the viewer
const META_FIELDS = [
    {
        "name": "Start Time",
        "desc": "When the recording was started.",
        "value": function(meta) {
            return meta["startTime"];
        }
    },
    {
        "name": "End Time",
        "desc": "When the recording was ended.",
        "value": function(meta) {
            return meta["endTime"];
        }
    },
    {
        "name": "Duration",
        "desc": "How long the plugin was recording for.",
        "value": function(meta) {
            return meta["duration"];
        }
    },
    {
        "name": "Count",
        "desc": "How many values were matched and how many checks were made in total.",
        "value": function(meta) {
            const count = meta["count"];
            return count["matched"] + " / " + count["total"];
        }
    },
    {
        "name": "Filter",
        "desc": "The string used to filter the output.",
        "value": function(meta) {
            return '<span class="value" data-type="undefined">' + meta["filter"] + '</span>';
        }
    },
    {
        "name": "Truncated",
        "desc": "If the data was truncated (limited in size) when uploaded.",
        "value": function(meta) {
            if (meta["truncated"]) {
                return '<span class="value" data-type="true">true</span>';
            } else {
                return '<span class="value" data-type="false">false</span>';
            }
        }
    }
];

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

function formatContext(context) {
    if (context.length === 0) {
        return "global";
    }

    const formatted = [];
    for (const c of context) {
        formatted.push('<span class="inline-code">' + escapeHtml(c.key) + "=" + escapeHtml(c.value) + '</span>');
    }
    return formatted.join(", ");
}

function reloadTable() {
    let content = "";

    // append meta
    content += '<table class="table">';
    content += '<tr class="row header">';
    for (const col of ["Metadata Key", "Metadata Value", "Description"]) {
        content += '<th class="cell">' + col + '</th>';
    }
    content += '</tr>';

    for (const field of META_FIELDS) {
        content += '<tr class="meta-row">';
        content += '<td class="cell">' + field.name + '</td>';
        content += '<td class="cell">' + field.value(metadata) + '</td>';
        content += '<td class="cell">' + field.desc + '</td>';
        content += '</tr>';
    }

    content += '</table>';

    // append the content
    content += '<table class="table">';
    content += '<tr class="row header">';
    for (const col of ["Target", "Request", "Result", ""]) {
        content += '<th class="cell">' + col + '</th>';
    }
    content += '</tr>';

    let i = 0;
    for (const entry of log) {
        const type = entry.type || "permission";
        const target = entry.who.identifier;

        // begin row
        content += '<tr id="e' + i + '" class="row clickable">';
        content += '<td class="cell target">' + escapeHtml(target) + '</td>';

        if (type === "permission") {
            const permission = entry.permission;
            const result = entry.result || "undefined";

            content += '<td class="cell request">' + escapeHtml(permission) + '</td>';
            content += '<td class="cell result"><span class="value" data-type="' + result + '">' + result + '</span></td>';
        } else if (type === "meta") {
            const key = entry.key;
            const result = entry.result;

            content += '<td class="cell request">meta: ' + escapeHtml(key) + '</td>';
            content += '<td class="cell result"><span class="value" data-type="undefined">' + escapeHtml(result) + '</span></td>';
        }

        content += '<td class="cell buttons">';
        content += '<i class="clickable material-icons" title="Expand">expand_more</i>';
        content += '</td>';
        content += '</tr>';
        // end row

        const context = entry.context;
        const origin = entry.origin;
        const trace = entry.trace;

        // begin extra row
        content += '<tr id="e' + i + '-extra" class="row extra" style="display: none">';
        content += '<td class="extra-cell" colspan="4">';
        content += '<p><b>Context: </b>' + formatContext(context) + '</p>';
        content += '<p><b>Origin: </b><span>' + escapeHtml(origin.toUpperCase()) + '</span></p>';

        if (type === "permission" && entry["resultInfo"]) {
            if (entry["resultInfo"]["processorClass"]) {
                content += '<p><b>Processor: </b>' + entry["resultInfo"]["processorClass"] + '</p>';
            }
            if (entry["resultInfo"]["cause"]) {
                content += '<p><b>Cause: </b>' + entry["resultInfo"]["cause"] + '</p>';
            }
        }

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
    const url = BYTEBIN_URL + params;
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
