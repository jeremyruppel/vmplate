var debug = require('debug')('vmplate');
var vm = require('vm');

module.exports = function vmplate(string, filename) {
  var SCRIPT = /<%=/;
  var STRING = /%>/;
  var script = vm.createScript(compile(string), filename || 'template.vm');

  return function render(locals) {
    return script.runInNewContext(locals);
  };

  function compile(string) {
    var output = 'var str = ""\n';
    var token = SCRIPT;
    var start = 0;
    var input;
    var match;

    function push(str) {
      output += 'str += ' + str + '\n';
    }

    function code(str) {
      debug('code %j', str);
      push(trim(str));
    }

    function text(str) {
      debug('text %j', str);
      push(quote(str));
    }

    function scan(input) {
      debug('input %j', input);
      return token.exec(input);
    }

    while (match = scan(string.substr(start))) {
      debug('token=%s start=%s match=%s', token, start, match);

      input = string.substr(start, match.index);
      start = start + match.index + match[0].length;

      switch (match[0]) {
      case '<%=':
        text(input);
        token = STRING;
        break;
      case '%>':
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

};
