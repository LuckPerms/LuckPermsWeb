let currId = 0,
  obfuscators = {},
  alreadyParsed = [],
  styleMap = {
    '§0': 'color:#000000',
    '§1': 'color:#0000AA',
    '§2': 'color:#00AA00',
    '§3': 'color:#00AAAA',
    '§4': 'color:#AA0000',
    '§5': 'color:#AA00AA',
    '§6': 'color:#FFAA00',
    '§7': 'color:#AAAAAA',
    '§8': 'color:#555555',
    '§9': 'color:#5555FF',
    '§a': 'color:#55FF55',
    '§b': 'color:#55FFFF',
    '§c': 'color:#FF5555',
    '§d': 'color:#FF55FF',
    '§e': 'color:#FFFF55',
    '§f': 'color:#FFFFFF',
    '§l': 'font-weight:bold',
    '§m': 'text-decoration:line-through',
    '§n': 'text-decoration:underline',
    '§o': 'font-style:italic'
  };

function obfuscate(elem, string) {
  let multiMagic,
    currNode,
    listLen,
    nodeI;

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function replaceRand(string, i) {
    let randChar = String.fromCharCode(randInt(64, 95));
    return string.substr(0, i) + randChar + string.substr(i + 1, string.length);
  }

  function initMagic(el, str) {
    let i = 0,
      obsStr = str || el.innerHTML,
      strLen = obsStr.length;
    if (!strLen) return;
    obfuscators[currId].push(
      window.setInterval(function () {
        if (i >= strLen) i = 0;
        obsStr = replaceRand(obsStr, i);
        el.innerHTML = obsStr;
        i++;
      }, 0)
    );
  }

  if (string.indexOf('<br>') > -1) {
    elem.innerHTML = string;
    listLen = elem.childNodes.length;
    for (nodeI = 0; nodeI < listLen; nodeI++) {
      currNode = elem.childNodes[nodeI];
      if (currNode.nodeType === 3) {
        multiMagic = document.createElement('span');
        multiMagic.innerHTML = currNode.nodeValue;
        elem.replaceChild(multiMagic, currNode);
        initMagic(multiMagic);
      }
    }
  } else {
    initMagic(elem, string);
  }
}

function applyCode(string, codes) {
  let elem = document.createElement('span'),
    obfuscated = false;

  string = string.replace(/\x00/g, '');

  codes.forEach(function (code) {
    elem.style.cssText += styleMap[code] + ';';
    if (code === '§k') {
      obfuscate(elem, string);
      obfuscated = true;
    }
  });

  if (!obfuscated) elem.innerHTML = string;

  return elem;
}

function parseStyle(string) {
  let finalPre = document.createElement('pre'),
    codes = string.match(/§.{1}/g) || [],
    codesLen = codes.length,
    indexes = [],
    indexDelta,
    apply = [],
    strSlice,
    i;

  if (!obfuscators[currId]) obfuscators[currId] = [];

  string = string.replace(/\n|\\n/g, '<br>');

  for (i = 0; i < codesLen; i++) {
    indexes.push(string.indexOf(codes[i]));
    string = string.replace(codes[i], '\x00\x00');
  }

  if (indexes[0] !== 0) {
    finalPre.appendChild(applyCode(string.substring(0, indexes[0]), []));
  }

  for (i = 0; i < codesLen; i++) {
    indexDelta = indexes[i + 1] - indexes[i];
    if (indexDelta === 2) {
      while (indexDelta === 2) {
        apply.push(codes[i]);
        i++;
        indexDelta = indexes[i + 1] - indexes[i];
      }
      apply.push(codes[i]);
    } else {
      apply.push(codes[i]);
    }
    if (apply.lastIndexOf('§r') > -1) {
      apply = apply.slice(apply.lastIndexOf('§r') + 1);
    }
    strSlice = string.substring(indexes[i], indexes[i + 1]);
    finalPre.appendChild(applyCode(strSlice, apply));
  }

  finalPre.className = 'pre_style';

  return finalPre;
}

function clearObfuscators(id) {
  obfuscators[id].forEach(function (interval) {
    clearInterval(interval);
  });
  alreadyParsed[id] = [];
  obfuscators[id] = [];
}

function initParser(input) {
  input = input.replaceAll('&', '§');
  console.log(input);
  let parsed,
    i = currId;
  if (i > 0) {
    while (i--) {
      if (alreadyParsed[i].nodeType) {
        if (!document.contains(alreadyParsed[i])) {
          clearObfuscators(i);
        }
      }
    }
  }
  parsed = parseStyle(input);
  alreadyParsed.push(parsed);
  currId++;
  return {
    parsed: parsed,
    raw: parsed.innerHTML,
    html: parsed.outerHTML
  };
};

export {
  initParser
};
