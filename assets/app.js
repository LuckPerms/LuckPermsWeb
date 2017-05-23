// the rows currently in the table
var rows = []

// who is being edited. this should be in the format "user/<uuid>" or "group/<group name>"
// or empty, if the data loaded at the start of the session didn't contain the attribute
var who = ""

// makes a minimal node object from the given parameters.
function makeNode(perm, value, server, world, expiry, contexts) {
  var node = {}

  node["permission"] = perm

  if (!value) {
    node["value"] = false
  }

  if (server != "global") {
    node["server"] = server
  }

  if (world != "global") {
    node["world"] = world
  }

  if (expiry > 1) {
    node["expiry"] = expiry
  }

  var hasContexts = false
  for (var key in contexts) {
    if (contexts.hasOwnProperty(key)) {
      hasContexts = true
    }
  }

  if (hasContexts) {
    code["contexts"] = contexts
  }

  return node
}

// reads data from a web address, and passes the result to the callback
function readPage(link, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", link, true);

  xhr.onreadystatechange = function() {
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

  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      var data = JSON.parse(this.responseText)
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
  }

  // post the data to the API
  xhr.send(JSON.stringify(post))
}

// callback for when a record in the table is deleted
function handleDelete(e) {
  var id = e.parentElement.parentElement.id
  var i = parseInt(id.substring(1))

  rows.splice(i, 1)
  reloadTable()
}

function handleAdd(e) {
  var parent = e.parentElement
  var children = parent.getElementsByTagName("input")

  var permission = children[0].value

  // don't process the add if the permission field is left empty
  if (permission == "") {
    return
  }

  var expiry = children[1].value
  var server = children[2].value
  var world = children[3].value
  var contexts = children[4].value

  var now = Math.round((new Date()).getTime() / 1000);
  var expiryVal = parseInt(expiry) || 0

  if ((expiryVal > 1) && (expiryVal < now)) {
    return // don't allow dates in the past
  }

  if (expiryVal <= 1) {
    expiryVal = 0
  }

  if (server == "") {
    server = "global"
  }

  if (world == "") {
    world = "global"
  }

  var contextsObj = {}
  if (contexts == "" || contexts == "{}") {
    contextsObj = JSON.parse(contexts)
  }

  rows.push(makeNode(permission, true, server, world, expiryVal, contextsObj))
  reloadTable()
}

// called when the value tag is clicked
function handleValueSwap(e) {
  var id = e.parentElement.parentElement.id
  var i = parseInt(id.substring(1))

  rows[i].value = !rows[i].value
  reloadTable()
}

function handleSave(e) {
  console.log("Saving data to gist")

  // construct the data object to send back to gist
  var data = {}
  data.who = who
  data.nodes = rows
  
  // post the data, and then send a popup when the save is complete
  postGist(JSON.stringify(data), function(ret) {
  	// parse the tag from the returned url
    var split = ret.split("/")
    var id = split[4] + "/" + split[6]

    // display the popup
    var popup = document.getElementById("popup")
    content = ""
    content += '<div class="alert">'
    content += '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span>'
    content += '<strong>Success!</strong> Data was saved to gist. Run <code>/lp applyedits ' + id + '</code> to apply your changes.</div>'
    popup.innerHTML = content
  })
}

// reloads the data in the table from the values stored in the rows array
function reloadTable() {
  var content = ""

  // new input header at the top of the table
  content += '<div class="newentry">'
  content += '<div class="inpform">'
  content += '<i onclick="handleAdd(this)" class="clickable material-icons" style="font-size: 35px; vertical-align: middle;">add_box</i>'
  content += '<input type="text" name="id" placeholder="Permission" style="width: 175px; margin-left: 20px;"></input>'
  content += '<input type="number" name="id" placeholder="Expiry"></input>'
  content += '<input type="text" name="id" placeholder="Server"></input>'
  content += '<input type="text" name="id" placeholder="World"></input>'
  content += '<input type="text" name="id" placeholder="Contexts"></input>'
  content += '<i onclick="handleSave(this)" class="clickable material-icons" style="font-size: 35px; vertical-align: middle; float: right; padding-right: 10px;">save</i>'
  content += '</div>'
  content += '</div>'

  // begin the table
  content += '<div class="table">'

  // field headings
  content += '<div class="row header">'
  content += '<div class="cell">Permission</div>'
  content += '<div class="cell">Value</div>'
  content += '<div class="cell">Expiry</div>'
  content += '<div class="cell">Server</div>'
  content += '<div class="cell">World</div>'
  content += '<div class="cell">Contexts</div>'
  content += '<div class="cell"></div>'
  content += '</div>'

  // add each row
  var i = -1
  rows.forEach(function(node) {
    i++
    content += nodeToHtml(i, node)
  })

  content += '</div>'

  // set the data
  var element = document.getElementById("table-content")
  element.innerHTML = content
}

function nodeToHtml(id, node) {
  var content = ""

  // start div
  content += '<div id="e' + id + '" class="row">'

  // variable content
  content += '<div class="cell">' + node.permission + '</div>'

  if (!node.hasOwnProperty("value") || node.value) {
    content += '<div class="cell"><code onclick="handleValueSwap(this)" class="code-true clickable">true</code></div>'
  } else {
    content += '<div class="cell"><code onclick="handleValueSwap(this)" class="code-false clickable">false</code></div>'
  }

  if (!node.hasOwnProperty("expiry") || node.expiry == 0) {
    content += '<div class="cell">never</div>'
  } else {
    content += '<div class="cell">' + node.expiry + '</div>'
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
    content += '<div class="cell">' + JSON.stringify(node.contexts) + '</div>'
  } else {
    content += '<div class="cell">none</div>'
  }

  // static delete button
  content += '<div class="cell">'
  content += '<i onclick="handleDelete(this)" class="clickable material-icons md-18">delete</i>'
  content += '</div>'
  content += '</div>'

  return content
}

function removeTable() {
  var content = document.getElementById("table-content")
  content.innerHTML = ""
}

// hides the welcome panel from view
function hidePanel() {
  document.getElementsByClassName("panel")[0].style.display = "none"
}

// unhides the welcome panel
function showPanel() {
  document.getElementsByClassName("panel")[0].style.display = "initial"
}

// callback function for when a data token is entered manually into the welcome form
function idFormEnter(e) {
  // listen for the enter key
  if (e.which == 13 || e.keyCode == 13) {
    var element = document.getElementById("data-id")
    var id = element.value
    if (id == "") {
      return false
    }

    // remove the input box
    element.parentElement.removeChild(element)

    // update status
    document.getElementById("prompt").innerHTML = "Loading..."

    // get data
    var parts = id.split("/")
    console.log(parts)

    if (parts.length == 2) {
      var url = "https://gist.githubusercontent.com/anonymous/" + parts[0] + "/raw/" + parts[1] + "/luckperms-data.json"
      readPage(url, function(ret) {
        var data = JSON.parse(ret)

        // replace the local node array with the json data
        rows = data.nodes
        who = data.who
        hidePanel()
        reloadTable()
      })
    } else {
      // just the load the table
      hidePanel()
      reloadTable()
    }

    return false
  }

  return true
}

// try to load the page from the url parameters when the page loads
var params = document.location.search
if (params != "") {
  if (params.startsWith("?")) {
    params = params.substring(1)
  }

  // get data
  var parts = params.split("/")
  if (parts.length == 2) {
    console.log("Loading from URL params")

    // remove the input box
    var element = document.getElementById("data-id")
    element.parentElement.removeChild(element)

    // update status
    document.getElementById("prompt").innerHTML = "Loading..."

    var url = "https://gist.githubusercontent.com/anonymous/" + parts[0] + "/raw/" + parts[1] + "/luckperms-data.json"
    readPage(url, function(ret) {
      var data = JSON.parse(ret)

      // replace the local node array with the json data
      rows = data.nodes
      who = data.who
      hidePanel()
      reloadTable()
    })
  }
}