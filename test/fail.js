var tap = require('tap')
  , test = tap.test
  , util = require('util')

test('Failure to import', function(t) {
  t.notOk(Error.prepareStackTrace, 'Nothing in Error.prepareStackTrace yet')

  var ran;
  Error.prepareStackTrace = function(er, stack) {
    ran = true
    return 'one\ntwo'
  }

  t.throws(function() { require('../api') }, 'Traceback will not import if Error.prepareStackTrace is set')
  t.ok(ran, 'The custom prepareStackTrace ran')

  t.end()
})

test('Failure to make a trace', function(t) {
  delete Error.prepareStackTrace
  t.notOk(Error.prepareStackTrace, 'Nothing in Error.prepareStackTrace anymore')

  var traceback
  t.doesNotThrow(function() { traceback = require('../api') }, 'No problem importing after deletion')
  t.type(traceback, 'function', 'Imported the traceback API')

  var prep_ran = false
  Error.prepareStackTrace = my_prep
  function my_prep(er, stack) {
    if(er.message != '') // These are produce by node-tap itself.
      prep_ran = true
    return 'three\nfour'
  }

  var stack, err
  try { stack = traceback() }
  catch(er) { err = er }

  t.ok(stack, 'traceback() did not return after Error.prepareStackTrace was set')
  t.notOk(err, 'traceback() successfully runs even if Error.prepareStackTrace is set')

  t.notOk(prep_ran, 'Custom prepareStackTrace never ran')
  t.is(Error.prepareStackTrace, my_prep, 'Error.prepareStackTrace is still set to its original value')

  var a_stack = new Error('Making a stack').stack
  t.ok(prep_ran, 'prepareStackTrace function still runs normally')

  delete Error.prepareStackTrace

  t.end()
})
