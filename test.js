var subject = require(__dirname);
var assert = require('assert');

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

    assert.equal(render({ one: 'me', two: 'myself', three: 'I' }), 'me myself and I');
  });
});
