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
    , old_prep = Error.prepareStackTrace

  //if(Error.prepareStackTrace)
  //  throw new Error('traceback: refusing to overwrite Error.prepareStackTrace')

  //console.error('traceback()')
  getting_the_stack = {}

  try {
    //console.error('Beginning capture')
    Error.captureStackTrace(getting_the_stack, begin_func)
    Error.prepareStackTrace = prepareStackTrace_raw_stack
    stack = getting_the_stack.stack
  } catch (capture_er) {
    //console.error('= Capture error =')
    error = capture_er
  } finally {
    Error.prepareStackTrace = old_prep // TODO could this ever fail?
    getting_the_stack = null
  }

  if(error)
    throw error
  else if(stack)
    return stack
  else
    throw new Error('Unknown result getting the stack')
}


function prepareStackTrace_raw_stack(er, stack) {
  if(getting_the_stack && er === getting_the_stack)
    return stack;

  console.error('TODO returning .stack a second time')
  return "Unknown stack trace";
}
