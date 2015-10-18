var subject = require(__dirname);
var assert = require('assert');

/* jshint mocha:true */

describe('vmplate', function() {
  it('throws on an unclosed code section', function() {
    assert.throws(function() { subject('<%= oops'); }, /SyntaxError/);
  });
  it('throws on syntax error', function() {
    assert.throws(function() { subject('<%= ) %>'); }, /SyntaxError/);
  });
  it('interpolates one value', function() {
    var render = subject('me <%= one %> and I');

    assert.equal(render({ one: 'myself' }), 'me myself and I');
  });
  it('interpolates multiple values', function() {
    var render = subject('<%= one %> <%= two %> and <%= three %>');
    var output = render({ one: 'me', two: 'myself', three: 'I' });

    assert.equal(output, 'me myself and I');
  });
  it('evaluates code without output', function() {
    var render = subject('<% var who = "george"; %>by <%= who %>!');

    assert.equal(render(), 'by george!');
  });
  it('evaluates any valid javascript', function() {
    var render = subject('<% for(var i = 0; i < 3; i++){ %>hey<% } %>!');

    assert.equal(render(), 'heyheyhey!');
  });
  it('does not evaluate empty code blocks', function() {
    var render = subject('o<%= %>hai');

    assert.equal(render(), 'ohai');
  });
  it('iterates over an array in the locals context', function() {
    var render = subject(
      '<% for(var i = 0; i < arr.length; i++){ %>' +
      '<%= arr[i] %>' +
      '<% } %>'
    );

    assert.equal(render({ arr: [1, 2, 3] }), '123');
  });
  it('calls a function in the locals context', function() {
    var render = subject('<%= upcase(yell) %>!');

    render.locals.upcase = function(str) {
      return str.toUpperCase();
    };

    assert.equal(render({ yell: 'yay' }), 'YAY!');
  });
  it('inherits locals from the instance', function() {
    var render = subject('<%= foo %> <%= bar %>');

    render.locals.foo = 'omg';
    render.locals.bar = 'wow';

    assert.equal(render({ foo: 'yay' }), 'yay wow');
  });
  it('can pass in instance locals', function() {
    var render = subject('<%= foo %> <%= bar %>', {
      foo: 'omg',
      bar: 'wow'
    });

    assert.equal(render({ foo: 'yay' }), 'yay wow');
  });
  it('inherits locals from the factory', function() {
    var render = subject('<%= foo %> <%= bar %> <%= baz %>');

    subject.locals.foo = 'omg';
    subject.locals.bar = 'wow';
    render.locals.baz = 'amaze';

    assert.equal(render({ foo: 'yay' }), 'yay wow amaze');
  });
});
