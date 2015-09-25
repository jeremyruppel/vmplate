var debug = require('debug')('vmplate');
var vm = require('vm');

module.exports = function vmplate(string, filename) {

  var script = vm.createScript(compile(string), filename || 'template.vm');

  return function render(locals) {
    return script.runInNewContext(locals);
  };

  function compile(string) {
    var regex = /<%=(.+?)%>/;
    var match;
    var code = 'var str = ""\n';

    function push(str) {
      code += 'str += ' + str + '\n';
    }

    while (match = regex.exec(string)) {
      debug('match', match);

      var pre = string.slice(0, match.index);

      if (pre.length) {
        push(quote(pre));
      }

      push(trim(match[1]));

      string = string.slice(match.index + match[0].length);
    }

    if (string.length) {
      push(quote(string));
    }

    debug('compiled\n' + code);

    return code;
  }

  function quote(str) {
    return JSON.stringify(str);
  }

  function trim(str) {
    return str.trim();
  }

};
