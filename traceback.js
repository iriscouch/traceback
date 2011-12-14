// Traceback
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var util = require('util')
  , assert = require('assert')

var frame = require('./lib/frame')
  , v8 = require('./lib/v8')


if(Error.prepareStackTrace)
  throw new Error('Traceback does not support Error.prepareStackTrace being defined already')

// The module API
module.exports = traceback
module.exports.raw = raw


// The public API call takes no arguments.
function raw() {
  return raw_traceback(raw)
}

function traceback() {
  var stack = raw_traceback(traceback)
  //console.error('Returning easy stack')
  return stack.map(function(callsite) { return frame.make(callsite) })
}

var getting_the_stack = null

function raw_traceback(begin_func) {
  assert.ok(begin_func, 'Must supply begin_func')

  var stack = null
    , error = null

  if(Error.original_prepareStackTrace) // Should be quite rare
    console.error('Traceback error detected: Error.original_prepareStackTrace exists')
  else
    Error.original_prepareStackTrace = Error.prepareStackTrace

  getting_the_stack = {}

  try {
    //console.error('Beginning capture')
    Error.captureStackTrace(getting_the_stack, begin_func)
    Error.prepareStackTrace = return_raw_stack
    stack = getting_the_stack.stack // This actually calls the prepareStackTrace function
  } catch (capture_er) {
    //console.error('= Capture error =')
    error = capture_er
  } finally {
    getting_the_stack = null
    Error.prepareStackTrace = Error.original_prepareStackTrace // TODO could this ever fail?
    delete Error.original_prepareStackTrace
  }

  if(error)
    throw error
  else if(stack)
    return stack
  else
    throw new Error('Unknown result getting the stack')
}


function return_raw_stack(er, stack) {
  if(getting_the_stack && er === getting_the_stack)
    return stack;

  // At this point something has gone wrong. Try to recover the existing prep function.
  if(Error.original_prepareStackTrace) {
    //console.error('Restoring original prepareStackTrace')
    Error.prepareStackTrace = Error.original_prepareStackTrace
    delete Error.original_prepareStackTrace
    return Error.prepareStackTrace(er, stack)
  }

  //console.error('Returning to normal (deleted) Error.prepareStackTrace')
  delete Error.prepareStackTrace
  return v8.FormatStackTrace(er, stack)
}
