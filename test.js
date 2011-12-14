var l = console.log
  , d = console.dir

var hidden = true
function I(o) { return require('util').inspect(o, hidden, 100) }

//function TracebackError (message) {
//  l('New traceback: ' + message)
//
//  this.name = TracebackError
//  this.message = message || 'TracebackError'
//  //this.prepareStackTrace = prep
//}
//
//TracebackError.prototype = new Error
//TracebackError.prototype.constructor = TracebackError

if(Error.prepareStackTrace)
  throw new Error('Sorry, Error.prepareStackTrace is already defined')

var getting_the_stack = null;
function return_stack(er, stack) {
  if(getting_the_stack && er === getting_the_stack)
    l('Getting the stack')
  if(getting_the_stack && er === getting_the_stack)
    return stack;

  l('XXX WHATs going on Not getting the stack')
  delete Error.prepareStackTrace
  l('returning .stack a second time')
  return er.stack

  throw new Error(er)
  throw er
  throw new Error('Stuff')
  return er.stack
  return 'Stack unknown'
  return er.stack
}

function getstack() {
  //var tb = new TracebackError('getting the stack')
  //l('Getting stack for: ' + getstack.caller)
  //var result = stack_getter = {}

  if(Error.prepareStackTrace)
    throw new Error('getstack() refusing to overwrite Error.prepareStackTrace')

  l('Assigning')
  getting_the_stack = {}

  var stack = null;
  try {
    l('Beginning capture')
    getting_the_stack = {}
    Error.prepareStackTrace = return_stack
    Error.captureStackTrace(getting_the_stack, getstack.caller)
    l('Captured: ' + I(getting_the_stack))
    stack = getting_the_stack.stack
  } catch (capture_err) {
    l('= Capture error =')
    delete Error.prepareStackTrace
    getting_the_stack = null
    throw capture_er
  }

  getting_the_stack = null
  if(Error.prepareStackTrace)
    ;//delete Error.prepareStackTrace

  l('Returning .stack')
  return stack
}

function a() { b_obj.b() }
var b_obj = { name:'B object', b: function() { c() } }
function c() { d_obj.d() }
var d_obj = { name:'D object', d: function() { e() } }
function e() { foo() }

function foo() {
  l('Displaying normal error')
  var er = new Error('Normal error')
  l('Error stack: ' + er.stack)

  var stack = getstack()
  l('foo() stack:')
  stack.forEach(function(frame, i) {
    //l('  ' + i + ': ' + I(frame.getThis()))
    l('  ' + i + ': ' + I(frame.getFunctionName()))
  })

  l('Calling nonexistent')
  noexist()
}

a()
//SetUpLockedPrototype(CallSite, $Array("receiver", "fun", "pos"), $Array(
//  "getThis", CallSiteGetThis,
//  "getTypeName", CallSiteGetTypeName,
//  "isToplevel", CallSiteIsToplevel,
//  "isEval", CallSiteIsEval,
//  "getEvalOrigin", CallSiteGetEvalOrigin,
//  "getScriptNameOrSourceURL", CallSiteGetScriptNameOrSourceURL,
//  "getFunction", CallSiteGetFunction,
//  "getFunctionName", CallSiteGetFunctionName,
//  "getMethodName", CallSiteGetMethodName,
//  "getFileName", CallSiteGetFileName,
//  "getLineNumber", CallSiteGetLineNumber,
//  "getColumnNumber", CallSiteGetColumnNumber,
//  "isNative", CallSiteIsNative,
//  "getPosition", CallSiteGetPosition,
//  "isConstructor", CallSiteIsConstructor
//
//));
  //notthere()
