
define('traceback', function () {
	// TODO
	return function () {
		return [{
			name: null, // | The function name
			path: null, // | The absolute path of the file defining the function
			file: null, // | The basename of the path file ("example.js")
			line: null, // | The line number in the file
			col: null, // | The column number in the file
			pos: null, // | The byte position in the file
			fun: null, // | The function itself
			method: null, // | If this function was called as a method, the name it is stored as
			this: null, // | The object bound to the label this in the function
			type: null, // | The type of this; the name of the constructor function (Object, ReadStream, etc.)
			origin: null, // | The CallSite that ran eval(), if this frame is an eval
			is_top: null, // | Boolean indicating whether the function was called with a global this
			is_eval: null, // | Boolean indicating whether the function comes from an eval() call
			is_native: null, // | Boolean indicating whether the function is native
			is_ctor: null // | Boolean indicating whether this is a constructor (new) call
		}];
	};
});
