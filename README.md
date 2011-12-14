# Easy access to the call stack, for Node.js

Writing a Node app? Need to know functions that called you? `Error` objects can do it. Why can't you?

Traceback provides a normal JavaScript array of the execution stack frames. You can see function names, line numbers, and other useful stuff.

Traceback is available from NPM.

    $ npm install traceback

## Example

**example.js**

```javascript
var traceback = require('../traceback');

function start() { first() }
function first() { second() }
var second = function() { last() }

function last() {
  var stack = traceback();
  console.log('I am ' + stack[0].name + ' from file ' + stack[0].file)

  for(var i = 1; i <= 3; i++)
    console.log('  ' + i + ' above me: ' + stack[i].name + ' at line ' + stack[i].line);
}

start();
```

Output:

    I am last from file test.js
      1 above me: second at line 5
      2 above me: first at line 4
      3 above me: start at line 3

## Usage

API docs, TODO.

## Tests

Tests use [node-tap][tap]. If you clone this Git repository, tap is included.

    $ tap test

## License

Apache 2.0
