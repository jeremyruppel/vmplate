var debug = require('debug')('vmplate');
var vm = require('vm');

module.exports = function vmplate(string, filename) {

  var script = vm.createScript(compile(string), filename || 'template.vm');

  return function render(locals) {
    return script.runInNewContext(locals);
  };

  function compile(string) {
    var token = '<%=';
    var index = 0;
    var start = 0;
    var match;
    var script = 'var str = ""\n';

    function push(str) {
      script += 'str += ' + str + '\n';
    }

    function code(str) {
      debug('code %j', str);
      push(trim(str));
    }

    function text(str) {
      debug('text %j', str);
      push(quote(str));
    }

    while ((index = string.indexOf(token, start)) > -1) {
      debug('token=%j start=%s index=%d', token, start, index);

      match = string.slice(start, index);
      start = index + token.length

      switch (token) {
      case '<%=':
        text(match);
        token = '%>';
        break;
      case '%>':
        code(match);
        token = '<%=';
        break;
      }
    }

    if (start < string.length) {
      text(string.slice(start));
    }

    debug('compiled\n' + script);

    return script;
  }

  function quote(str) {
    return JSON.stringify(str);
  }

  function trim(str) {
    return str.trim();
  }

};
