var debug = require('debug')('vmplate');
var vm = require('vm');

exports = module.exports = function vmplate(string, locals, filename) {
  var SCRIPT = /<%=?/;
  var STRING = /%>/;
  var script = vm.createScript(compile(string), filename || 'template.vm');

  function render(locals) {
    locals = locals || {};
    locals.__proto__ = render.locals;

    return script.runInNewContext(hoist(locals));
  }

  render.locals = locals || {};
  render.locals.__proto__ = exports.locals;

  return render;

  function compile(string) {
    var output = 'var str = ""\n';
    var token = SCRIPT;
    var start = 0;
    var previous;
    var match;

    function push(str, raw) {
      if (!str.length) {
        return;
      }
      if (raw) {
        output += str + '\n';
      } else {
        output += 'str += ' + str + '\n';
      }
    }

    function code(str) {
      debug('code %j', str, match.prev[0]);
      switch (match.prev[0]) {
      case '<%=':
        push(trim(str));
        break;
      case '<%':
        push(trim(str), true);
        break;
      }
    }

    function text(str) {
      debug('text %j', str);
      if (!str.length) {
        return;
      }
      push(quote(str));
    }

    function scan(input) {
      debug('input %j', input);
      var res;
      if (res = token.exec(input)) {
        res.prev = match;
      }
      return res;
    }

    while (match = scan(string.substr(start))) {
      debug('token=%s start=%s match=%s', token, start, match);

      input = string.substr(start, match.index);
      start = start + match.index + match[0].length;

      switch (token) {
      case SCRIPT:
        text(input);
        token = STRING;
        break;
      case STRING:
        code(input);
        token = SCRIPT;
        break;
      }
    }

    if (start < string.length) {
      if (token === STRING) {
        throw new SyntaxError('Unclosed code section');
      }
      text(string.substr(start));
    }

    debug('compiled\n' + output);

    return output;
  }

  function quote(str) {
    return JSON.stringify(str);
  }

  function trim(str) {
    return str.trim();
  }

  // node v0.10.x vm doesn't copy over __proto__
  function hoist(obj) {
    for (var key in obj) {
      obj[key] = obj[key];
    }
    return obj;
  }

};

exports.locals = {};
