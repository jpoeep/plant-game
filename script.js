var object = Object.prototype;

object.chunk = function(pos1, pos2) {
    if(!pos2) {
        pos2 = pos1;
    }
    pos1 -= 1;
    pos2 -= 1;
    var string = "";
    for(var i = pos1; i < this.length; i++) {
        if(i >= pos1 && i <= pos2) {
            string += this[i];
        }
    }
    return string;
};

object.$ = function(targetName) {
    var query;
    if(this.tagName) {
        query = this.querySelectorAll(targetName);
    }
    else if(this == (window || document)) {
        query = document.querySelectorAll(targetName);
    }
    if(query.length == 1) {
        return query[0];
    }
    else {
        return query;
    }
};

object.in = function(parentString) {
    if(parentString.indexOf(this) > -1) {
        return true;
    }
    else {
        return false;
    }
};

object.create = function(element, props) {
  if(this.tagName) {
    var obj = document.createElement(element);
    this.appendChild(obj);

    if(props && typeof props === "object") {
      for(var i = 0; i < Object.getOwnPropertyNames(props).length; i++) {
        var prop = Object.getOwnPropertyNames(props)[i];
        obj[prop] = props[prop];
      }
    }

    return obj;
  }
};

object.startAfter = function(string, pos) { // a function to break down a string in segments based off of string arg
    var curString = this;
    var curPos = 0;
    if(!pos) {
        pos = "last";
    }

    function strCheck() {
        if(string.within(curString) == true) {
            if(pos === "last") {
                curString = curString.chunk(curString.indexOf(string) + 2, curString.length);
                strCheck();
            }
            else if(pos != "last" && typeof pos === "number" && pos != 0) {
                curString = curString.chunk(curString.indexOf(string) + 2, curString.length);
                curPos += 1;
                if(curPos != pos) {
                    strCheck();
                }
            }
        }
    }

    strCheck();

    return curString;
};

function loop(func, delay) {
    if(!delay) {
        delay = 0;
    }
    function action() {
        func();

        setTimeout(action, delay);
    };

    action();

    this.stop = function() {
        action = null;
    };
}

function ElementNode(tagName, func) {
    var tagCheck = loop(function() {
        var tag = $(tagName);
        if(tag) {
            for(var i = 0; i < tag.length; i++) {
                func(tag[i]);
            }
        }
    });
}

object.revert = function() {
    return this.split("").reverse().join("");
}

function pull(url) {
    var rev = url.revert();
    var ext = rev.substring(0, rev.indexOf(".")).revert();
    var pullEnt;

    if(ext === "js") {
        pullEnt = $("body").create("script");
        pullEnt.src = url;
    }
    else if(ext === "css") {
        pullEnt = $("head").create("link");
        pullEnt.rel = "stylesheet";
        pullEnt.href = url;
    }

    return pullEnt;
}

object.strike = function() {
    var target = this;
    if(!this.tagName) {
        target = this.parentNode;
    }

    target.outerHTML = "<strike>" + target.outerHTML + "</strike>";
}

object.bold = function() {
    var target = this;
    if(!this.tagName) {
        target = this.parentNode;
    }

    target.outerHTML = "<b>" + target.outerHTML + "</b>";
}

object.toElement = function() {
    var div = this.parentNode.create("div");
    div.textContent = this.textContent;
    this.textContent = null;
    return div;
}

object.dataURL = function(callback) {
    var read = new FileReader();

    read.onload = function() {
        callback(read.result);
    }

    read.readAsDataURL(this);
}

var allElements = [];

object.addAll = function(arr) {
    if(!arr) {
        arr = allElements;
    }

    for(var i = 0; i < this.childNodes.length; i++) {
        var child = this.childNodes[i];
        if(child.tagName) {
            arr.push(child);
        }
        if(child.childNodes) {
            child.addAll();
        }
    }
}

function XHR(path, callback, config) {
  var openType, responseType, response, sendInput;

  if(config) {
    openType = config.openType, responseType = config.responseType, response = config.response, sendInput = config.sendInput;
    if(!config.openType) {
      openType = "OPEN";
    }

    openType = openType.toUpperCase();

    if(!config.responseType) {
      responseType = "text";
    }

    if(!config.response) {
      response = "response";
    }
  }
  else if(!config) {
    openType = "OPEN", responseType = "text", response = "response";
  }

    var rValue;
    var xhr = new XMLHttpRequest();
    xhr.responseType = responseType;

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            if(typeof callback === "function") {
              callback(xhr[response]);
            }
        }
    };

    xhr.open(openType, path, true);
    xhr.send(sendInput);
}

object.simKey = function(key, type) {
    var evt = new Event("keydown");

    if(type === ("keyCode" || null)) {
      evt.keyCode = key;
    }

    else if(type === "charCode") {
      evt.charCode = key;
    }

    this.dispatchEvent(evt);
};

object.properties = function() {
  return Object.getOwnPropertyNames(this);
};

object.s = function(obj) {
  if(obj) {
    for(var i = 0; i < obj.properties().length; i++) {
      this.style[obj.properties()[i]] = obj[obj.properties()[i]];
    }
  }
};

String.prototype.extension = function() {
  return this.revert().substring(0, this.revert().indexOf(".")).revert();
};

object.css = function(prop) {
  return getComputedStyle(this).getPropertyValue(prop).split(", ");
};

object.ready = function(callback) {
  this.onload = callback;
};

/*object.toggle = function(tog1, tog2) {
  this = tog1;
};*/

object.toggleClass = function(cls) {
  if(!this.className || this.className !== cls) {
    if(this.className !== cls) {
      this.prevClass = this.className;
    }

    this.className = cls;
  }

  else if(this.className === cls) {
    if(this.prevClass) {
      this.className = this.prevClass;
    }

    else {
      this.className = null;
    }
  }
};

function blob(obj) {
  return URL.createObjectURL(obj);
}

object.arrToBase64 = function(type) {
  var bin = "";
  var bytes = new Uint8Array(this);

  for(var i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }

  return "data:" + type + ";base64," + btoa(bin);
};

Element.prototype.delete = function() {
  this.parentNode.removeChild(this);
};

Object.prototype.toArray = function() {
  let arr = [];

  for(let i = 0; i < this.length; i++) {
    arr.push(this[i]);
  }

  return arr;
};

Object.prototype.each = function(cb, then) {
  for(let i = 0; i < this.length; i++) {
    cb(this[i])
  }

  if(then) {
    then()
  }
};

String.prototype.countOf = function(str) {
  let counter = 0;
  this.each(function(l) {
    if(l == str) {
      counter++;
    }
  });

  return counter;
};

window.onload = function() {
  document.all.each(function(element) {
    element.focused = false;

    element.onfocus = function() {
      element.focused = true;
    };

    element.onblur = function() {
      element.focused = false;
    };

    element.onkeypress = function(e) {
      if(e.key == "Enter" && element.focused == true && element.onsubmit) {
        e.noNewLine = e.preventDefault;
        element.onsubmit(e);
      }
    };
  });
};

Element.prototype.move = function(x, y) {
  this.s({
    transform: "translate(" + (-this.offsetLeft + x) + "px, " + (-this.offsetTop + y) + "px)"
  });
};

Function.prototype.repeat = function(times) {
  for(let i = 0; i < times; i++) {
    this();
  }
};

Object.prototype.fileToBase64 = function(cb) {
  var file = this
  var read = new FileReader()

  read.onload = function() {
    cb(read.result.arrToBase64(file.type))
  }

  read.readAsArrayBuffer(this)
}

String.prototype.splitEvery = function(n) {
  var arr = []

  for(var i = 0; i < Math.ceil(this.length / n); i++) {
    arr.push(this.substring(i * n, i * n + n))
  }

  return arr
}

function transitionColorArr(obj) {
  this.c1 = obj.c1
  this.c2 = obj.c2
  this.steps = obj.steps
  function convert(val) {
    if(typeof val == "string") {
      var arr = val.splitEvery(2)
      
      for(let i in arr) {
        arr[i] = parseInt(arr[i], 16)
      }
      
      return arr
    }
    
    else if(Array.isArray(val) === true) {
      for(let i in val) {
        val[i] = Math.round(Math.pow(16, 2) * (val[i] / 255)).toString(16)
        if(String(val[i]).length == 1) {
          val[i] = "0" + val[i]
        }
      }
      
      return val.join("")
    }
  }

  if(obj.steps >= 2) {
    var arr = []
    arr[0] = obj.c1
    arr[obj.steps - 1] = obj.c2

    for(let i = 1; i < obj.steps - 1; i++) {
      var prev = arr[i - 1]

      var dif = {
        r: (convert(obj.c2)[0] - convert(obj.c1)[0]) / obj.steps,
        g: (convert(obj.c2)[1] - convert(obj.c1)[1]) / obj.steps,
        b: (convert(obj.c2)[2] - convert(obj.c1)[2]) / obj.steps
      }

      var r = convert(prev)[0] + dif.r
      var g = convert(prev)[1] + dif.g
      var b = convert(prev)[2] + dif.b

      arr[i] = convert([r, g, b])
    }

    return arr
  }
}
