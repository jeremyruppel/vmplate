# vmplate

Simple templates for node programs.

[![Build Status](https://travis-ci.org/jeremyruppel/vmplate.svg?branch=master)](https://travis-ci.org/jeremyruppel/vmplate)

vmplate templates depend on the [vm][1] module to create a reusable template context. They're great for command-line programs or templating files, but they don't do any escaping and they won't work in the browser, so they're a _bad choice for HTML_.

# Install

```
$ npm install vmplate
```

# Usage

``` js
var vmplate = require('vmplate');

var render = vmplate('hello <%= name %>!')

console.log(render({ name: 'world' })); // hello world!
```

### vmplate(string[, locals[, filename]])

Compiles a new vmplate function for `string`.

If you pass in a `locals` hash, this will be used as the render function's locals hash. Otherwise, it's an empty hash that you can modify after the fact.

``` js
var render = vmplate('hello <%= name %>!', { name: 'world' });

console.log(render()); // hello world!
console.log(render({ name: 'beer' })); // hello beer!

render.locals.name = 'nasty';

console.log(render()); // hello nasty!
```

If you provide a `filename`, it will be used as the filename of the vm script and only really shows up in error messages.

### templating

vmplate uses [ejs][2]-style delimiters, but there are only two supported operations.

`<%= foo %>` (note the *=*) will add the value of `foo` to the buffer. The program will throw if `foo` is not defined.

`<% var foo = "bar"; %>` will evaluate the expression but will _not_ add it to the buffer. This makes any expression that's also valid javascript usable in your template.

For example, here's how to iterate over an array:

``` js
var render = subject('<% for(var i = 0; i < arr.length; i++){ %><%= arr[i] %><% } %>');

console.log(render({ arr: [1, 2, 3] })); // 123
```

The program will throw if there is a syntax error in your javascript.

### vmplate.locals → render.locals → locals

There are four ways to provide locals to your vmplate:

The locals hash on vmplate itself:

``` js
var vmplate = require('vmplate');
var render = vmplate('<%= foo %>');

vmplate.locals.foo = 'yay';

console.log(render()); // yay
```

The locals hash on the vmplate instance:

``` js
var render = vmplate('<%= foo %>');

render.locals.foo = 'yay';

console.log(render()); // yay
```

The locals hash passed to the vmplate factory:

``` js
var render = vmplate('<%= foo %>', { foo: 'yay' });

console.log(render()); // yay
```

Or the locals hash passed to the render function:

``` js
var render = vmplate('<%= foo %>');

console.log(render({ foo: 'yay' })); // yay
```

Render locals inherit from instance locals, which in turn inherit from the vmplate factory locals.

## License

[ISC License](https://github.com/jeremyruppel/vmplate/blob/master/LICENSE)

[1]: https://nodejs.org/api/vm.html
[2]: https://github.com/mde/ejs
