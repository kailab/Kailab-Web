/*!
 * jQuery JavaScript Library v1.6.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu May 12 15:04:36 2011 -0400
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.6.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.done( fn );

		return this;
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery._Deferred();

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return (new Function( "return " + data ))();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	// (xml & tmp used internally)
	parseXML: function( data , xml , tmp ) {

		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}

		tmp = xml.documentElement;

		if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
			jQuery.error( "Invalid XML: " + data );
		}

		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {

		if ( indexOf ) {
			return indexOf.call( array, elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can be optionally by executed if its a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

// Expose jQuery to the global object
return jQuery;

})();


var // Promise methods
	promiseMethods = "done fail isResolved isRejected promise then always pipe".split( " " ),
	// Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({
	// Create a simple deferred (one callbacks list)
	_Deferred: function() {
		var // callbacks list
			callbacks = [],
			// stored [ context , args ]
			fired,
			// to avoid firing when already doing so
			firing,
			// flag to know if the deferred has been cancelled
			cancelled,
			// the deferred itself
			deferred  = {

				// done( f1, f2, ...)
				done: function() {
					if ( !cancelled ) {
						var args = arguments,
							i,
							length,
							elem,
							type,
							_fired;
						if ( fired ) {
							_fired = fired;
							fired = 0;
						}
						for ( i = 0, length = args.length; i < length; i++ ) {
							elem = args[ i ];
							type = jQuery.type( elem );
							if ( type === "array" ) {
								deferred.done.apply( deferred, elem );
							} else if ( type === "function" ) {
								callbacks.push( elem );
							}
						}
						if ( _fired ) {
							deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
						}
					}
					return this;
				},

				// resolve with given context and args
				resolveWith: function( context, args ) {
					if ( !cancelled && !fired && !firing ) {
						// make sure args are available (#8421)
						args = args || [];
						firing = 1;
						try {
							while( callbacks[ 0 ] ) {
								callbacks.shift().apply( context, args );
							}
						}
						finally {
							fired = [ context, args ];
							firing = 0;
						}
					}
					return this;
				},

				// resolve with this as context and given arguments
				resolve: function() {
					deferred.resolveWith( this, arguments );
					return this;
				},

				// Has this deferred been resolved?
				isResolved: function() {
					return !!( firing || fired );
				},

				// Cancel
				cancel: function() {
					cancelled = 1;
					callbacks = [];
					return this;
				}
			};

		return deferred;
	},

	// Full fledged deferred (two callbacks list)
	Deferred: function( func ) {
		var deferred = jQuery._Deferred(),
			failDeferred = jQuery._Deferred(),
			promise;
		// Add errorDeferred methods, then and promise
		jQuery.extend( deferred, {
			then: function( doneCallbacks, failCallbacks ) {
				deferred.done( doneCallbacks ).fail( failCallbacks );
				return this;
			},
			always: function() {
				return deferred.done.apply( deferred, arguments ).fail.apply( this, arguments );
			},
			fail: failDeferred.done,
			rejectWith: failDeferred.resolveWith,
			reject: failDeferred.resolve,
			isRejected: failDeferred.isResolved,
			pipe: function( fnDone, fnFail ) {
				return jQuery.Deferred(function( newDefer ) {
					jQuery.each( {
						done: [ fnDone, "resolve" ],
						fail: [ fnFail, "reject" ]
					}, function( handler, data ) {
						var fn = data[ 0 ],
							action = data[ 1 ],
							returned;
						if ( jQuery.isFunction( fn ) ) {
							deferred[ handler ](function() {
								returned = fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise().then( newDefer.resolve, newDefer.reject );
								} else {
									newDefer[ action ]( returned );
								}
							});
						} else {
							deferred[ handler ]( newDefer[ action ] );
						}
					});
				}).promise();
			},
			// Get a promise for this deferred
			// If obj is provided, the promise aspect is added to the object
			promise: function( obj ) {
				if ( obj == null ) {
					if ( promise ) {
						return promise;
					}
					promise = obj = {};
				}
				var i = promiseMethods.length;
				while( i-- ) {
					obj[ promiseMethods[i] ] = deferred[ promiseMethods[i] ];
				}
				return obj;
			}
		});
		// Make sure only one callback list will be used
		deferred.done( failDeferred.cancel ).fail( deferred.cancel );
		// Unexpose cancel
		delete deferred.cancel;
		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = arguments,
			i = 0,
			length = args.length,
			count = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					// Strange bug in FF4:
					// Values changed onto the arguments object sometimes end up as undefined values
					// outside the $.when method. Cloning the object into a fresh array solves the issue
					deferred.resolveWith( deferred, sliceDeferred.call( args, 0 ) );
				}
			};
		}
		if ( length > 1 ) {
			for( ; i < length; i++ ) {
				if ( args[ i ] && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return deferred.promise();
	}
});



jQuery.support = (function() {

	var div = document.createElement( "div" ),
		documentElement = document.documentElement,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		support,
		fragment,
		body,
		bodyStyle,
		tds,
		events,
		eventName,
		i,
		isSupported;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName( "tbody" ).length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName( "link" ).length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute( "href" ) === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
			div.detachEvent( "onclick", click );
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains it's value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	div.innerHTML = "";

	// Figure out if the W3C box model works as expected
	div.style.width = div.style.paddingLeft = "1px";

	// We use our own, invisible, body
	body = document.createElement( "body" );
	bodyStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		// Set background to avoid IE crashes when removing (#9028)
		background: "none"
	};
	for ( i in bodyStyle ) {
		body.style[ i ] = bodyStyle[ i ];
	}
	body.appendChild( div );
	documentElement.insertBefore( body, documentElement.firstChild );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	support.boxModel = div.offsetWidth === 2;

	if ( "zoom" in div.style ) {
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		// (IE < 8 does this)
		div.style.display = "inline";
		div.style.zoom = 1;
		support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

		// Check if elements with layout shrink-wrap their children
		// (IE 6 does this)
		div.style.display = "";
		div.innerHTML = "<div style='width:4px;'></div>";
		support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
	}

	div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
	tds = div.getElementsByTagName( "td" );

	// Check if table cells still have offsetWidth/Height when they are set
	// to display:none and there are still other visible table cells in a
	// table row; if so, offsetWidth/Height are not reliable for use when
	// determining if an element has been hidden directly using
	// display:none (it is still safe to use offsets if a parent element is
	// hidden; don safety goggles and see bug #4512 for more information).
	// (only IE 8 fails this test)
	isSupported = ( tds[ 0 ].offsetHeight === 0 );

	tds[ 0 ].style.display = "";
	tds[ 1 ].style.display = "none";

	// Check if empty table cells still have offsetWidth/Height
	// (IE < 8 fail this test)
	support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( document.defaultView && document.defaultView.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( document.defaultView.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Remove the body element we added
	body.innerHTML = "";
	documentElement.removeChild( body );

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		} ) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	return support;
})();

// Keep track of boxModel
jQuery.boxModel = jQuery.support.boxModel;




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([a-z])([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
			} else {
				cache[ id ] = jQuery.extend(cache[ id ], name);
			}
		}

		thisCache = cache[ id ];

		// Internal jQuery data is stored in a separate object inside the object's data
		// cache in order to avoid key collisions between internal data and user-defined
		// data
		if ( pvt ) {
			if ( !thisCache[ internalKey ] ) {
				thisCache[ internalKey ] = {};
			}

			thisCache = thisCache[ internalKey ];
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
		// not attempt to inspect the internal events object using jQuery.data, as this
		// internal data object is undocumented and subject to change.
		if ( name === "events" && !thisCache[name] ) {
			return thisCache[ internalKey ] && thisCache[ internalKey ].events;
		}

		return getByName ? thisCache[ jQuery.camelCase( name ) ] : thisCache;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {
			var thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

			if ( thisCache ) {
				delete thisCache[ name ];

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !isEmptyDataObject(thisCache) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( pvt ) {
			delete cache[ id ][ internalKey ];

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		var internalCache = cache[ id ][ internalKey ];

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		if ( jQuery.support.deleteExpando || cache != window ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the entire user cache at once because it's faster than
		// iterating through each key, but we need to continue to persist internal
		// data if it existed
		if ( internalCache ) {
			cache[ id ] = {};
			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}

			cache[ id ][ internalKey ] = internalCache;

		// Otherwise, we need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		} else if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 ) {
			    var attr = this[0].attributes, name;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		var name = "data-" + key.replace( rmultiDash, "$1-$2" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
// property to be considered empty objects; this property always exists in
// order to make sure JSON.stringify does not expose internal metadata
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery.data( elem, deferDataKey, undefined, true );
	if ( defer &&
		( src === "queue" || !jQuery.data( elem, queueDataKey, undefined, true ) ) &&
		( src === "mark" || !jQuery.data( elem, markDataKey, undefined, true ) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery.data( elem, queueDataKey, undefined, true ) &&
				!jQuery.data( elem, markDataKey, undefined, true ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.resolve();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = (type || "fx") + "mark";
			jQuery.data( elem, type, (jQuery.data(elem,type,undefined,true) || 0) + 1, true );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery.data( elem, key, undefined, true) || 1 ) - 1 );
			if ( count ) {
				jQuery.data( elem, key, count, true );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		if ( elem ) {
			type = (type || "fx") + "queue";
			var q = jQuery.data( elem, type, undefined, true );
			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery.data( elem, type, jQuery.makeArray(data), true );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			defer;

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery._Deferred(), true ) )) {
				count++;
				tmp.done( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	rinvalidChar = /\:/,
	formHook, boolHook;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},
	
	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},
	
	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class") || "") );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspace );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ",
							setClass = elem.className;

						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split( rspace );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret,
			elem = this[0];
		
		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				return (elem.value || "").replace(rreturn, "");
			}

			return undefined;
		}

		var isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
					var option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},
	
	attrFix: {
		// Always normalize to ensure hook usage
		tabindex: "tabIndex"
	},
	
	attr: function( elem, name, value, pass ) {
		var nType = elem.nodeType;
		
		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( !("getAttribute" in elem) ) {
			return jQuery.prop( elem, name, value );
		}

		var ret, hooks,
			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// Normalize the name if needed
		name = notxml && jQuery.attrFix[ name ] || name;

		hooks = jQuery.attrHooks[ name ];

		if ( !hooks ) {
			// Use boolHook for boolean attributes
			if ( rboolean.test( name ) &&
				(typeof value === "boolean" || value === undefined || value.toLowerCase() === name.toLowerCase()) ) {

				hooks = boolHook;

			// Use formHook for forms and if the name contains certain characters
			} else if ( formHook && (jQuery.nodeName( elem, "form" ) || rinvalidChar.test( name )) ) {
				hooks = formHook;
			}
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return undefined;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml ) {
			return hooks.get( elem, name );

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, name ) {
		var propName;
		if ( elem.nodeType === 1 ) {
			name = jQuery.attrFix[ name ] || name;
		
			if ( jQuery.support.getSetAttribute ) {
				// Use removeAttribute in browsers that support it
				elem.removeAttribute( name );
			} else {
				jQuery.attr( elem, name, "" );
				elem.removeAttributeNode( elem.getAttributeNode( name ) );
			}

			// Set corresponding property to false for boolean attributes
			if ( rboolean.test( name ) && (propName = jQuery.propFix[ name ] || name) in elem ) {
				elem[ propName ] = false;
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabIndex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},
	
	prop: function( elem, name, value ) {
		var nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		var ret, hooks,
			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// Try to normalize/fix the name
		name = notxml && jQuery.propFix[ name ] || name;
		
		hooks = jQuery.propHooks[ name ];

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return (elem[ name ] = value);
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== undefined ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},
	
	propHooks: {}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		return elem[ jQuery.propFix[ name ] || name ] ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = value;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// Use the value property for back compat
// Use the formHook for button elements in IE6/7 (#1954)
jQuery.attrHooks.value = {
	get: function( elem, name ) {
		if ( formHook && jQuery.nodeName( elem, "button" ) ) {
			return formHook.get( elem, name );
		}
		return elem.value;
	},
	set: function( elem, value, name ) {
		if ( formHook && jQuery.nodeName( elem, "button" ) ) {
			return formHook.set( elem, value, name );
		}
		// Does not return so that setAttribute is also used
		elem.value = value;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !jQuery.support.getSetAttribute ) {

	// propFix is more comprehensive and contains all fixes
	jQuery.attrFix = jQuery.propFix;
	
	// Use this for any attribute on a form in IE6/7
	formHook = jQuery.attrHooks.name = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			// Return undefined if nodeValue is empty string
			return ret && ret.nodeValue !== "" ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Check form objects in IE (multiple bugs related)
			// Only use nodeValue if the attribute node exists on the form
			var ret = elem.getAttributeNode( name );
			if ( ret ) {
				ret.nodeValue = value;
				return value;
			}
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return (elem.style.cssText = "" + value);
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	});
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return (elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0);
			}
		}
	});
});




var hasOwn = Object.prototype.hasOwnProperty,
	rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspaces = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function( nm ) {
		return nm.replace(rescape, "\\$&");
	};

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		} else if ( !handler ) {
			// Fixes bug #7229. Fix recommended by jdalton
			return;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery._data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events,
			eventHandle = elemData.handle;

		if ( !events ) {
			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" +
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem, undefined, true );
			}
		}
	},
	
	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			exclusive;

		if ( type.indexOf("!") >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.exclusive = exclusive;
		event.namespace = namespaces.join(".");
		event.namespace_re = new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");
		
		// triggerHandler() and global events don't bubble or run the default action
		if ( onlyHandlers || !elem ) {
			event.preventDefault();
			event.stopPropagation();
		}

		// Handle a global trigger
		if ( !elem ) {
			// TODO: Stop taunting the data cache; remove global events and always attach to document
			jQuery.each( jQuery.cache, function() {
				// internalKey variable is just used to make it easier to find
				// and potentially change this stuff later; currently it just
				// points to jQuery.expando
				var internalKey = jQuery.expando,
					internalCache = this[ internalKey ];
				if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
					jQuery.event.trigger( event, data, internalCache.handle.elem );
				}
			});
			return;
		}

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		event.target = elem;

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		var cur = elem,
			// IE doesn't like method names with a colon (#3533, #8272)
			ontype = type.indexOf(":") < 0 ? "on" + type : "";

		// Fire event on the current element, then bubble up the DOM tree
		do {
			var handle = jQuery._data( cur, "handle" );

			event.currentTarget = cur;
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Trigger an inline bound script
			if ( ontype && jQuery.acceptData( cur ) && cur[ ontype ] && cur[ ontype ].apply( cur, data ) === false ) {
				event.result = false;
				event.preventDefault();
			}

			// Bubble up to document, then to window
			cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
		} while ( cur && !event.isPropagationStopped() );

		// If nobody prevented the default action, do it now
		if ( !event.isDefaultPrevented() ) {
			var old,
				special = jQuery.event.special[ type ] || {};

			if ( (!special._default || special._default.call( elem.ownerDocument, event ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction)() check here because IE6/7 fails that test.
				// IE<9 dies on focus to hidden element (#1486), may want to revisit a try/catch.
				try {
					if ( ontype && elem[ type ] ) {
						// Don't re-trigger an onFOO event when we call its FOO() method
						old = elem[ ontype ];

						if ( old ) {
							elem[ ontype ] = null;
						}

						jQuery.event.triggered = type;
						elem[ type ]();
					}
				} catch ( ieError ) {}

				if ( old ) {
					elem[ ontype ] = old;
				}

				jQuery.event.triggered = undefined;
			}
		}
		
		return event.result;
	},

	handle: function( event ) {
		event = jQuery.event.fix( event || window.event );
		// Snapshot the handlers list since a called handler may add/remove events.
		var handlers = ((jQuery._data( this, "events" ) || {})[ event.type ] || []).slice(0),
			run_all = !event.exclusive && !event.namespace,
			args = Array.prototype.slice.call( arguments, 0 );

		// Use the fix-ed Event rather than the (read-only) native event
		args[0] = event;
		event.currentTarget = this;

		for ( var j = 0, l = handlers.length; j < l; j++ ) {
			var handleObj = handlers[ j ];

			// Triggered event must 1) be non-exclusive and have no namespace, or
			// 2) have namespace(s) a subset or equal to those in the bound event.
			if ( run_all || event.namespace_re.test( handleObj.namespace ) ) {
				// Pass in a reference to the handler function itself
				// So that we can later remove it
				event.handler = handleObj.handler;
				event.data = handleObj.data;
				event.handleObj = handleObj;

				var ret = handleObj.handler.apply( this, args );

				if ( ret !== undefined ) {
					event.result = ret;
					if ( ret === false ) {
						event.preventDefault();
						event.stopPropagation();
					}
				}

				if ( event.isImmediatePropagationStopped() ) {
					break;
				}
			}
		}
		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			// Fixes #1925 where srcElement might not be defined either
			event.target = event.srcElement || document;
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var eventDocument = event.target.ownerDocument || document,
				doc = eventDocument.documentElement,
				body = eventDocument.body;

			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			event.which = event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this,
					liveConvert( handleObj.origType, handleObj.selector ),
					jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
			},

			remove: function( handleObj ) {
				jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
			}
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// set the correct event type
	event.type = event.data;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {

		// Chrome does something similar, the parentNode property
		// can be accessed but is null.
		if ( parent && parent !== document && !parent.parentNode ) {
			return;
		}

		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( !jQuery.nodeName( this, "form" ) ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						trigger( "submit", this, arguments );
					}
				});

				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( jQuery.nodeName( elem, "select" ) ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery._data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery._data( elem, "_change_data", val );
		}

		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			e.liveFired = undefined;
			jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange,

			beforedeactivate: testChange,

			click: function( e ) {
				var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

				if ( type === "radio" || type === "checkbox" || jQuery.nodeName( elem, "select" ) ) {
					testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

				if ( (e.keyCode === 13 && !jQuery.nodeName( elem, "textarea" ) ) ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery._data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return rformElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return rformElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;

	// Handle when the input is .focus()'d
	changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
	// Piggyback on a donor event to simulate a different one.
	// Fake originalEvent to avoid donor's stopPropagation, but if the
	// simulated event prevents default then we do the same on the donor.
	// Don't pass args or remember liveFired; they apply to the donor event.
	var event = jQuery.extend( {}, args[ 0 ] );
	event.type = type;
	event.originalEvent = {};
	event.liveFired = undefined;
	jQuery.event.handle.call( elem, event );
	if ( event.isDefaultPrevented() ) {
		args[ 0 ].preventDefault();
	}
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0;

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};

		function handler( donor ) {
			// Donor event is always a native one; fix it and switch its type.
			// Let focusin/out handler cancel the donor focus/blur event.
			var e = jQuery.event.fix( donor );
			e.type = fix;
			e.originalEvent = {};
			jQuery.event.trigger( e, null, e.target );
			if ( e.isDefaultPrevented() ) {
				donor.preventDefault();
			}
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		var handler;

		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}

		if ( arguments.length === 2 || data === false ) {
			fn = data;
			data = undefined;
		}

		if ( name === "one" ) {
			handler = function( event ) {
				jQuery( this ).unbind( event, handler );
				return fn.apply( this, arguments );
			};
			handler.guid = fn.guid || jQuery.guid++;
		} else {
			handler = fn;
		}

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},

	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
			return this.unbind( "live" );

		} else {
			return this.die( types, null, fn, selector );
		}
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( typeof types === "object" && !types.preventDefault ) {
			for ( var key in types ) {
				context[ name ]( key, data, types[key], selector );
			}

			return this;
		}

		if ( name === "die" && !types &&
					origSelector && origSelector.charAt(0) === "." ) {

			context.unbind( origSelector );

			return this;
		}

		if ( data === false || jQuery.isFunction( data ) ) {
			fn = data || returnFalse;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( liveMap[ type ] ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				for ( var j = 0, l = context.length; j < l; j++ ) {
					jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				}

			} else {
				// unbind live handler
				context.unbind( "live." + liveConvert( type, selector ), fn );
			}
		}

		return this;
	};
});

function liveHandler( event ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery._data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
	if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
		return;
	}

	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];

					// Make sure not to accidentally match a child element with the same selector
					if ( related && jQuery.contains( elem, related ) ) {
						related = elem;
					}
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspaces, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( typeof selector === "string" ?
			jQuery.filter( selector, this ).length > 0 :
			this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array
		if ( jQuery.isArray( selectors ) ) {
			var match, selector,
				matches = {},
				level = 1;

			if ( cur && selectors.length ) {
				for ( i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[ selector ] ) {
						matches[ selector ] = POS.test( selector ) ?
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[ selector ];

						if ( match.jquery ? match.index( cur ) > -1 : jQuery( cur ).is( match ) ) {
							ret.push({ selector: selector, elem: cur, level: level });
						}
					}

					cur = cur.parentNode;
					level++;
				}
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until ),
			// The variable 'args' was introduced in
			// https://github.com/jquery/jquery/commit/52a0238
			// to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
			// http://code.google.com/p/v8/issues/detail?id=1050
			args = slice.call(arguments);

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, args.join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
}




var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<(?:script|object|embed|option|style)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || (l > 1 && i < lastIndex) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var internalKey = jQuery.expando,
		oldData = jQuery.data( src ),
		curData = jQuery.data( dest, oldData );

	// Switch to use the internal data object, if it exists, for the next
	// stage of data copying
	if ( (oldData = oldData[ internalKey ]) ) {
		var events = oldData.events;
				curData = curData[ internalKey ] = jQuery.extend({}, oldData);

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
				}
			}
		}
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults,
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		args[0].charAt(0) === "<" && !rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( "getElementsByTagName" in elem ) {
		return elem.getElementsByTagName( "*" );

	} else if ( "querySelectorAll" in elem ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	if ( jQuery.nodeName( elem, "input" ) ) {
		fixDefaultChecked( elem );
	} else if ( elem.getElementsByTagName ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var clone = elem.cloneNode(true),
				srcElements,
				destElements,
				i;

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName
			// instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				cloneFixAttributes( srcElements[i], destElements[i] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ] && cache[ id ][ internalKey ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rdashAlpha = /-([a-z])/ig,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^[+\-]=/,
	rrelNumFilter = /[^+\-\.\de]+/g,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle,

	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"zIndex": true,
		"fontWeight": true,
		"opacity": true,
		"zoom": true,
		"lineHeight": true,
		"widows": true,
		"orphans": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Make sure that NaN and null values aren't set. See: #7116
			if ( type === "number" && isNaN( value ) || value == null ) {
				return;
			}

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && rrelNum.test( value ) ) {
				value = +value.replace( rrelNumFilter, "" ) + parseFloat( jQuery.css( elem, name ) );
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	},

	camelCase: function( string ) {
		return string.replace( rdashAlpha, fcamelCase );
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					val = getWH( elem, name, extra );

				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				if ( val <= 0 ) {
					val = curCSS( elem, name, name );

					if ( val === "0px" && currentStyle ) {
						val = currentStyle( elem, name, name );
					}

					if ( val != null ) {
						// Should return "auto" instead of 0, use 0 for
						// temporary backwards-compat
						return val === "" || val === "auto" ? "0px" : val;
					}
				}

				if ( val < 0 || val == null ) {
					val = elem.style[ name ];

					// Should return "auto" instead of 0, use 0 for
					// temporary backwards-compat
					return val === "" || val === "auto" ? "0px" : val;
				}

				return typeof val === "string" ? val : val + "px";
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat(value);

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle;

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// Set the alpha filter to set the opacity
			var opacity = jQuery.isNaN( value ) ?
				"" :
				"alpha(opacity=" + value * 100 + ")",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( !(defaultView = elem.ownerDocument.defaultView) ) {
			return undefined;
		}

		if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			rsLeft = elem.runtimeStyle && elem.runtimeStyle[ name ],
			style = elem.style;

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
			// Remember the original values
			left = style.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : (ret || 0);
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {
	var which = name === "width" ? cssWidth : cssHeight,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

	if ( extra === "border" ) {
		return val;
	}

	jQuery.each( which, function() {
		if ( !extra ) {
			val -= parseFloat(jQuery.css( elem, "padding" + this )) || 0;
		}

		if ( extra === "margin" ) {
			val += parseFloat(jQuery.css( elem, "margin" + this )) || 0;

		} else {
			val -= parseFloat(jQuery.css( elem, "border" + this + "Width" )) || 0;
		}
	});

	return val;
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts;

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for(; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for(; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.bind( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function ( target, settings ) {
		if ( !settings ) {
			// Only one parameter, we extend ajaxSettings
			settings = target;
			target = jQuery.extend( true, jQuery.ajaxSettings, settings );
		} else {
			// target was provided, we extend into it
			jQuery.extend( true, target, jQuery.ajaxSettings, settings );
		}
		// Flatten fields we don't want deep extended
		for( var field in { context: 1, url: 1 } ) {
			if ( field in settings ) {
				target[ field ] = settings[ field ];
			} else if( field in jQuery.ajaxSettings ) {
				target[ field ] = jQuery.ajaxSettings[ field ];
			}
		}
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": "*/*"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery._Deferred(),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, statusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status ? 4 : 0;

			var isSuccess,
				success,
				error,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = statusText;

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.resolveWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.done;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( (ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", */*; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( status < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					jQuery.error( e );
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for( key in s.converters ) {
				if( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow,
	requestAnimationFrame = window.webkitRequestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.oRequestAnimationFrame;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[i];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
						jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[i];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data(elem, "olddisplay") || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				if ( this[i].style ) {
					var display = jQuery.css( this[i], "display" );

					if ( display !== "none" && !jQuery._data( this[i], "olddisplay" ) ) {
						jQuery._data( this[i], "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p,
				display, e,
				parts, start, end, unit;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height
					// animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {
						if ( !jQuery.support.inlineBlockNeedsLayout ) {
							this.style.display = "inline-block";

						} else {
							display = defaultDisplay( this.nodeName );

							// inline-level elements accept inline-block;
							// block-level elements need to be inline with layout
							if ( display === "inline" ) {
								this.style.display = "inline-block";

							} else {
								this.style.display = "inline";
								this.style.zoom = 1;
							}
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]();

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ((end || 1) / e.cur()) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			var timers = jQuery.timers,
				i = timers.length;
			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}
			while ( i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function( noUnmark ) {
			if ( opt.queue !== false ) {
				jQuery.dequeue( this );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}

			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx,
			raf;

		this.startTime = fxNow || createFxNow();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );
		this.now = this.start;
		this.pos = this.state = 0;

		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			// Use requestAnimationFrame instead of setInterval if available
			if ( requestAnimationFrame ) {
				timerId = 1;
				raf = function() {
					// When timerId gets set to null at any point, this stops
					if ( timerId ) {
						requestAnimationFrame( raf );
						fx.tick();
					}
				};
				requestAnimationFrame( raf );
			} else {
				timerId = setInterval( fx.tick, fx.interval );
			}
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options,
			i, n;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( i in options.animatedProperties ) {
				if ( options.animatedProperties[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function (index, value) {
						elem.style[ "overflow" + value ] = options.overflow[index];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery(elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( var p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[p] );
					}
				}

				// Execute the complete function
				options.complete.call( elem );
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[ this.prop ] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ((this.end - this.start) * this.pos);
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		for ( var timers = jQuery.timers, i = 0 ; i < timers.length ; ++i ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var elem = jQuery( "<" + nodeName + ">" ).appendTo( "body" ),
			display = elem.css( "display" );

		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			document.body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake html
			// document to it, Webkit & Firefox won't allow reusing the iframe document
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( "<!doctype><html><body></body></html>" );
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );

			document.body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed";
		checkDiv.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden";
		innerDiv.style.position = "relative";

		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if (options.top != null) {
			props.top = (options.top - curOffset.top) + curTop;
		}
		if (options.left != null) {
			props.left = (options.left - curOffset.left) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function() {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, "padding" ) ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function( margin ) {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, margin ? "margin" : "border" ) ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ];
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				elem.document.body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNaN( ret ) ? orig : ret;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});


window.jQuery = window.$ = jQuery;
})(window);

/*****************************************************************

typeface.js, version 0.15 | typefacejs.neocracy.org

Copyright (c) 2008 - 2009, David Chester davidchester@gmx.net 

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*****************************************************************/

(function() {

var _typeface_js = {

	faces: {},

	loadFace: function(typefaceData) {

		var familyName = typefaceData.familyName.toLowerCase();
		
		if (!this.faces[familyName]) {
			this.faces[familyName] = {};
		}
		if (!this.faces[familyName][typefaceData.cssFontWeight]) {
			this.faces[familyName][typefaceData.cssFontWeight] = {};
		}

		var face = this.faces[familyName][typefaceData.cssFontWeight][typefaceData.cssFontStyle] = typefaceData;
		face.loaded = true;
	},

	log: function(message) {
		
		if (this.quiet) {
			return;
		}
		
		message = "typeface.js: " + message;
		
		if (this.customLogFn) {
			this.customLogFn(message);

		} else if (window.console && window.console.log) {
			window.console.log(message);
		}
		
	},
	
	pixelsFromPoints: function(face, style, points, dimension) {
		var pixels = points * parseInt(style.fontSize) * 72 / (face.resolution * 100);
		if (dimension == 'horizontal' && style.fontStretchPercent) {
			pixels *= style.fontStretchPercent;
		}
		return pixels;
	},

	pointsFromPixels: function(face, style, pixels, dimension) {
		var points = pixels * face.resolution / (parseInt(style.fontSize) * 72 / 100);
		if (dimension == 'horizontal' && style.fontStretchPrecent) {
			points *= style.fontStretchPercent;
		}
		return points;
	},

	cssFontWeightMap: {
		normal: 'normal',
		bold: 'bold',
		400: 'normal',
		700: 'bold'
	},

	cssFontStretchMap: {
		'ultra-condensed': 0.55,
		'extra-condensed': 0.77,
		'condensed': 0.85,
		'semi-condensed': 0.93,
		'normal': 1,
		'semi-expanded': 1.07,
		'expanded': 1.15,
		'extra-expanded': 1.23,
		'ultra-expanded': 1.45,
		'default': 1
	},
	
	fallbackCharacter: '.',

	configure: function(args) {
		var configurableOptionNames = [ 'customLogFn',  'customClassNameRegex', 'customTypefaceElementsList', 'quiet', 'verbose', 'disableSelection' ];
		
		for (var i = 0; i < configurableOptionNames.length; i++) {
			var optionName = configurableOptionNames[i];
			if (args[optionName]) {
				if (optionName == 'customLogFn') {
					if (typeof args[optionName] != 'function') {
						throw "customLogFn is not a function";
					} else {
						this.customLogFn = args.customLogFn;
					}
				} else {
					this[optionName] = args[optionName];
				}
			}
		}
	},

	getTextExtents: function(face, style, text) {
		var extentX = 0;
		var extentY = 0;
		var horizontalAdvance;
	
		var textLength = text.length;
		for (var i = 0; i < textLength; i++) {
			var glyph = face.glyphs[text.charAt(i)] ? face.glyphs[text.charAt(i)] : face.glyphs[this.fallbackCharacter];
			var letterSpacingAdjustment = this.pointsFromPixels(face, style, style.letterSpacing);

			// if we're on the last character, go with the glyph extent if that's more than the horizontal advance
			extentX += i + 1 == textLength ? Math.max(glyph.x_max, glyph.ha) : glyph.ha;
			extentX += letterSpacingAdjustment;

			horizontalAdvance += glyph.ha + letterSpacingAdjustment;
		}
		return { 
			x: extentX, 
			y: extentY,
			ha: horizontalAdvance
			
		};
	},

	pixelsFromCssAmount: function(cssAmount, defaultValue, element) {

		var matches = undefined;

		if (cssAmount == 'normal') {
			return defaultValue;

		} else if (matches = cssAmount.match(/([\-\d+\.]+)px/)) {
			return matches[1];

		} else {
			// thanks to Dean Edwards for this very sneaky way to get IE to convert 
			// relative values to pixel values
			
			var pixelAmount;
			
			var leftInlineStyle = element.style.left;
			var leftRuntimeStyle = element.runtimeStyle.left;

			element.runtimeStyle.left = element.currentStyle.left;

			if (!cssAmount.match(/\d(px|pt)$/)) {
				element.style.left = '1em';
			} else {
				element.style.left = cssAmount || 0;
			}

			pixelAmount = element.style.pixelLeft;
		
			element.style.left = leftInlineStyle;
			element.runtimeStyle.left = leftRuntimeStyle;
			
			return pixelAmount || defaultValue;
		}
	},

	capitalizeText: function(text) {
		return text.replace(/(^|\s)[a-z]/g, function(match) { return match.toUpperCase() } ); 
	},

	getElementStyle: function(e) {
		if (window.getComputedStyle) {
			return window.getComputedStyle(e, '');
		
		} else if (e.currentStyle) {
			return e.currentStyle;
		}
	},

	getRenderedText: function(e) {

		var browserStyle = this.getElementStyle(e.parentNode);

		var inlineStyleAttribute = e.parentNode.getAttribute('style');
		if (inlineStyleAttribute && typeof(inlineStyleAttribute) == 'object') {
			inlineStyleAttribute = inlineStyleAttribute.cssText;
		}

		if (inlineStyleAttribute) {

			var inlineStyleDeclarations = inlineStyleAttribute.split(/\s*\;\s*/);

			var inlineStyle = {};
			for (var i = 0; i < inlineStyleDeclarations.length; i++) {
				var declaration = inlineStyleDeclarations[i];
				var declarationOperands = declaration.split(/\s*\:\s*/);
				inlineStyle[declarationOperands[0]] = declarationOperands[1];
			}
		}

		var style = { 
			color: browserStyle.color, 
			fontFamily: browserStyle.fontFamily.split(/\s*,\s*/)[0].replace(/(^"|^'|'$|"$)/g, '').toLowerCase(), 
			fontSize: this.pixelsFromCssAmount(browserStyle.fontSize, 12, e.parentNode),
			fontWeight: this.cssFontWeightMap[browserStyle.fontWeight],
			fontStyle: browserStyle.fontStyle ? browserStyle.fontStyle : 'normal',
			fontStretchPercent: this.cssFontStretchMap[inlineStyle && inlineStyle['font-stretch'] ? inlineStyle['font-stretch'] : 'default'],
			textDecoration: browserStyle.textDecoration,
			lineHeight: this.pixelsFromCssAmount(browserStyle.lineHeight, 'normal', e.parentNode),
			letterSpacing: this.pixelsFromCssAmount(browserStyle.letterSpacing, 0, e.parentNode),
			textTransform: browserStyle.textTransform
		};

		var face;
		if (
			this.faces[style.fontFamily]  
			&& this.faces[style.fontFamily][style.fontWeight]
		) {
			face = this.faces[style.fontFamily][style.fontWeight][style.fontStyle];
		}

		var text = e.nodeValue;
		
		if (
			e.previousSibling 
			&& e.previousSibling.nodeType == 1 
			&& e.previousSibling.tagName != 'BR' 
			&& this.getElementStyle(e.previousSibling).display.match(/inline/)
		) {
			text = text.replace(/^\s+/, ' ');
		} else {
			text = text.replace(/^\s+/, '');
		}
		
		if (
			e.nextSibling 
			&& e.nextSibling.nodeType == 1 
			&& e.nextSibling.tagName != 'BR' 
			&& this.getElementStyle(e.nextSibling).display.match(/inline/)
		) {
			text = text.replace(/\s+$/, ' ');
		} else {
			text = text.replace(/\s+$/, '');
		}
		
		text = text.replace(/\s+/g, ' ');
	
		if (style.textTransform && style.textTransform != 'none') {
			switch (style.textTransform) {
				case 'capitalize':
					text = this.capitalizeText(text);
					break;
				case 'uppercase':
					text = text.toUpperCase();
					break;
				case 'lowercase':
					text = text.toLowerCase();
					break;
			}
		}

		if (!face) {
			var excerptLength = 12;
			var textExcerpt = text.substring(0, excerptLength);
			if (text.length > excerptLength) {
				textExcerpt += '...';
			}
		
			var fontDescription = style.fontFamily;
			if (style.fontWeight != 'normal') fontDescription += ' ' + style.fontWeight;
			if (style.fontStyle != 'normal') fontDescription += ' ' + style.fontStyle;
		
			this.log("couldn't find typeface font: " + fontDescription + ' for text "' + textExcerpt + '"');
			return;
		}
	
		var words = text.split(/\b(?=\w)/);

		var containerSpan = document.createElement('span');
		containerSpan.className = 'typeface-js-vector-container';
		
		var wordsLength = words.length;
		for (var i = 0; i < wordsLength; i++) {
			var word = words[i];
			
			var vector = this.renderWord(face, style, word);
			
			if (vector) {
				containerSpan.appendChild(vector.element);

				if (!this.disableSelection) {
					var selectableSpan = document.createElement('span');
					selectableSpan.className = 'typeface-js-selected-text';

					var wordNode = document.createTextNode(word);
					selectableSpan.appendChild(wordNode);

					if (this.vectorBackend != 'vml') {
						selectableSpan.style.marginLeft = -1 * (vector.width + 1) + 'px';
					}
					selectableSpan.targetWidth = vector.width;
					//selectableSpan.style.lineHeight = 1 + 'px';

					if (this.vectorBackend == 'vml') {
						vector.element.appendChild(selectableSpan);
					} else {
						containerSpan.appendChild(selectableSpan);
					}
				}
			}
		}

		return containerSpan;
	},

	renderDocument: function(callback) { 
		
		if (!callback)
			callback = function(e) { e.style.visibility = 'visible' };

		var elements = document.getElementsByTagName('*');
		
		var elementsLength = elements.length;
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].className.match(/(^|\s)typeface-js(\s|$)/) || elements[i].tagName.match(/^(H1|H2|H3|H4|H5|H6)$/)) {
				this.replaceText(elements[i]);
				if (typeof callback == 'function') {
					callback(elements[i]);
				}
			}
		}

		if (this.vectorBackend == 'vml') {
			// lamely work around IE's quirky leaving off final dynamic shapes
			var dummyShape = document.createElement('v:shape');
			dummyShape.style.display = 'none';
			document.body.appendChild(dummyShape);
		}
	},

	replaceText: function(e) {

		var childNodes = [];
		var childNodesLength = e.childNodes.length;

		for (var i = 0; i < childNodesLength; i++) {
			this.replaceText(e.childNodes[i]);
		}

		if (e.nodeType == 3 && e.nodeValue.match(/\S/)) {
			var parentNode = e.parentNode;

			if (parentNode.className == 'typeface-js-selected-text') {
				return;
			}

			var renderedText = this.getRenderedText(e);
			
			if (
				parentNode.tagName == 'A' 
				&& this.vectorBackend == 'vml'
				&& this.getElementStyle(parentNode).display == 'inline'
			) {
				// something of a hack, use inline-block to get IE to accept clicks in whitespace regions
				parentNode.style.display = 'inline-block';
				parentNode.style.cursor = 'pointer';
			}

			if (this.getElementStyle(parentNode).display == 'inline') {
				parentNode.style.display = 'inline-block';
			}

			if (renderedText) {	
				if (parentNode.replaceChild) {
					parentNode.replaceChild(renderedText, e);
				} else {
					parentNode.insertBefore(renderedText, e);
					parentNode.removeChild(e);
				}
				if (this.vectorBackend == 'vml') {
					renderedText.innerHTML = renderedText.innerHTML;
				}

				var childNodesLength = renderedText.childNodes.length
				for (var i; i < childNodesLength; i++) {
					
					// do our best to line up selectable text with rendered text

					var e = renderedText.childNodes[i];
					if (e.hasChildNodes() && !e.targetWidth) {
						e = e.childNodes[0];
					}
					
					if (e && e.targetWidth) {
						var letterSpacingCount = e.innerHTML.length;
						var wordSpaceDelta = e.targetWidth - e.offsetWidth;
						var letterSpacing = wordSpaceDelta / (letterSpacingCount || 1);

						if (this.vectorBackend == 'vml') {
							letterSpacing = Math.ceil(letterSpacing);
						}

						e.style.letterSpacing = letterSpacing + 'px';
						e.style.width = e.targetWidth + 'px';
					}
				}
			}
		}
	},

	applyElementVerticalMetrics: function(face, style, e) {

		if (style.lineHeight == 'normal') {
			style.lineHeight = this.pixelsFromPoints(face, style, face.lineHeight);
		}

		var cssLineHeightAdjustment = style.lineHeight - this.pixelsFromPoints(face, style, face.lineHeight);

		e.style.marginTop = Math.round( cssLineHeightAdjustment / 2 ) + 'px';
		e.style.marginBottom = Math.round( cssLineHeightAdjustment / 2) + 'px';
	
	},

	vectorBackends: {

		canvas: {

			_initializeSurface: function(face, style, text) {

				var extents = this.getTextExtents(face, style, text);

				var canvas = document.createElement('canvas');
				if (this.disableSelection) {
					canvas.innerHTML = text;
				}

				canvas.height = Math.round(this.pixelsFromPoints(face, style, face.lineHeight));
				canvas.width = Math.round(this.pixelsFromPoints(face, style, extents.x, 'horizontal'));
	
				this.applyElementVerticalMetrics(face, style, canvas);

				if (extents.x > extents.ha) 
					canvas.style.marginRight = Math.round(this.pixelsFromPoints(face, style, extents.x - extents.ha, 'horizontal')) + 'px';

				var ctx = canvas.getContext('2d');

				var pointScale = this.pixelsFromPoints(face, style, 1);
				ctx.scale(pointScale * style.fontStretchPercent, -1 * pointScale);
				ctx.translate(0, -1 * face.ascender);
				ctx.fillStyle = style.color;

				return { context: ctx, canvas: canvas };
			},

			_renderGlyph: function(ctx, face, char, style) {

				var glyph = face.glyphs[char];

				if (!glyph) {
					//this.log.error("glyph not defined: " + char);
					return this.renderGlyph(ctx, face, this.fallbackCharacter, style);
				}

				if (glyph.o) {

					var outline;
					if (glyph.cached_outline) {
						outline = glyph.cached_outline;
					} else {
						outline = glyph.o.split(' ');
						glyph.cached_outline = outline;
					}

					var outlineLength = outline.length;
					for (var i = 0; i < outlineLength; ) {

						var action = outline[i++];

						switch(action) {
							case 'm':
								ctx.moveTo(outline[i++], outline[i++]);
								break;
							case 'l':
								ctx.lineTo(outline[i++], outline[i++]);
								break;

							case 'q':
								var cpx = outline[i++];
								var cpy = outline[i++];
								ctx.quadraticCurveTo(outline[i++], outline[i++], cpx, cpy);
								break;

							case 'b':
								var x = outline[i++];
								var y = outline[i++];
								ctx.bezierCurveTo(outline[i++], outline[i++], outline[i++], outline[i++], x, y);
								break;
						}
					}					
				}
				if (glyph.ha) {
					var letterSpacingPoints = 
						style.letterSpacing && style.letterSpacing != 'normal' ? 
							this.pointsFromPixels(face, style, style.letterSpacing) : 
							0;

					ctx.translate(glyph.ha + letterSpacingPoints, 0);
				}
			},

			_renderWord: function(face, style, text) {
				var surface = this.initializeSurface(face, style, text);
				var ctx = surface.context;
				var canvas = surface.canvas;
				ctx.beginPath();
				ctx.save();

				var chars = text.split('');
				var charsLength = chars.length;
				for (var i = 0; i < charsLength; i++) {
					this.renderGlyph(ctx, face, chars[i], style);
				}

				ctx.fill();

				if (style.textDecoration == 'underline') {

					ctx.beginPath();
					ctx.moveTo(0, face.underlinePosition);
					ctx.restore();
					ctx.lineTo(0, face.underlinePosition);
					ctx.strokeStyle = style.color;
					ctx.lineWidth = face.underlineThickness;
					ctx.stroke();
				}

				return { element: ctx.canvas, width: Math.floor(canvas.width) };
			
			}
		},

		vml: {

			_initializeSurface: function(face, style, text) {

				var shape = document.createElement('v:shape');

				var extents = this.getTextExtents(face, style, text);
				
				shape.style.width = shape.style.height = style.fontSize + 'px'; 
				shape.style.marginLeft = '-1px'; // this seems suspect...

				if (extents.x > extents.ha) {
					shape.style.marginRight = this.pixelsFromPoints(face, style, extents.x - extents.ha, 'horizontal') + 'px';
				}

				this.applyElementVerticalMetrics(face, style, shape);

				var resolutionScale = face.resolution * 100 / 72;
				shape.coordsize = (resolutionScale / style.fontStretchPercent) + "," + resolutionScale;
				
				shape.coordorigin = '0,' + face.ascender;
				shape.style.flip = 'y';

				shape.fillColor = style.color;
				shape.stroked = false;

				shape.path = 'hh m 0,' + face.ascender + ' l 0,' + face.descender + ' ';

				return shape;
			},

			_renderGlyph: function(shape, face, char, offsetX, style, vmlSegments) {

				var glyph = face.glyphs[char];

				if (!glyph) {
					this.log("glyph not defined: " + char);
					this.renderGlyph(shape, face, this.fallbackCharacter, offsetX, style);
					return;
				}
				
				vmlSegments.push('m');

				if (glyph.o) {
					
					var outline, outlineLength;
					
					if (glyph.cached_outline) {
						outline = glyph.cached_outline;
						outlineLength = outline.length;
					} else {
						outline = glyph.o.split(' ');
						outlineLength = outline.length;

						for (var i = 0; i < outlineLength;) {

							switch(outline[i++]) {
								case 'q':
									outline[i] = Math.round(outline[i++]);
									outline[i] = Math.round(outline[i++]);
								case 'm':
								case 'l':
									outline[i] = Math.round(outline[i++]);
									outline[i] = Math.round(outline[i++]);
									break;
							} 
						}	

						glyph.cached_outline = outline;
					}

					var prevX, prevY;
					
					for (var i = 0; i < outlineLength;) {

						var action = outline[i++];

						var x = Math.round(outline[i++]) + offsetX;
						var y = Math.round(outline[i++]);
	
						switch(action) {
							case 'm':
								vmlSegments.push('xm ', x, ',', y);
								break;
	
							case 'l':
								vmlSegments.push('l ', x, ',', y);
								break;

							case 'q':
								var cpx = outline[i++] + offsetX;
								var cpy = outline[i++];

								var cp1x = Math.round(prevX + 2.0 / 3.0 * (cpx - prevX));
								var cp1y = Math.round(prevY + 2.0 / 3.0 * (cpy - prevY));

								var cp2x = Math.round(cp1x + (x - prevX) / 3.0);
								var cp2y = Math.round(cp1y + (y - prevY) / 3.0);
								
								vmlSegments.push('c ', cp1x, ',', cp1y, ',', cp2x, ',', cp2y, ',', x, ',', y);
								break;

							case 'b':
								var cp1x = Math.round(outline[i++]) + offsetX;
								var cp1y = outline[i++];

								var cp2x = Math.round(outline[i++]) + offsetX;
								var cp2y = outline[i++];

								vmlSegments.push('c ', cp1x, ',', cp1y, ',', cp2x, ',', cp2y, ',', x, ',', y);
								break;
						}

						prevX = x;
						prevY = y;
					}					
				}

				vmlSegments.push('x e');
				return vmlSegments;
			},

			_renderWord: function(face, style, text) {
				var offsetX = 0;
				var shape = this.initializeSurface(face, style, text);
		
				var letterSpacingPoints = 
					style.letterSpacing && style.letterSpacing != 'normal' ? 
						this.pointsFromPixels(face, style, style.letterSpacing) : 
						0;

				letterSpacingPoints = Math.round(letterSpacingPoints);
				var chars = text.split('');
				var vmlSegments = [];
				for (var i = 0; i < chars.length; i++) {
					var char = chars[i];
					vmlSegments = this.renderGlyph(shape, face, char, offsetX, style, vmlSegments);
					offsetX += face.glyphs[char].ha + letterSpacingPoints ;	
				}

				if (style.textDecoration == 'underline') {
					var posY = face.underlinePosition - (face.underlineThickness / 2);
					vmlSegments.push('xm ', 0, ',', posY);
					vmlSegments.push('l ', offsetX, ',', posY);
					vmlSegments.push('l ', offsetX, ',', posY + face.underlineThickness);
					vmlSegments.push('l ', 0, ',', posY + face.underlineThickness);
					vmlSegments.push('l ', 0, ',', posY);
					vmlSegments.push('x e');
				}

				// make sure to preserve trailing whitespace
				shape.path += vmlSegments.join('') + 'm ' + offsetX + ' 0 l ' + offsetX + ' ' + face.ascender;
				
				return {
					element: shape,
					width: Math.floor(this.pixelsFromPoints(face, style, offsetX, 'horizontal'))
				};
			}

		}

	},

	setVectorBackend: function(backend) {

		this.vectorBackend = backend;
		var backendFunctions = ['renderWord', 'initializeSurface', 'renderGlyph'];

		for (var i = 0; i < backendFunctions.length; i++) {
			var backendFunction = backendFunctions[i];
			this[backendFunction] = this.vectorBackends[backend]['_' + backendFunction];
		}
	},
	
	initialize: function() {

		// quit if this function has already been called
		if (arguments.callee.done) return; 
		
		// flag this function so we don't do the same thing twice
		arguments.callee.done = true;

		// kill the timer
		if (window._typefaceTimer) clearInterval(_typefaceTimer);

		this.renderDocument( function(e) { e.style.visibility = 'visible' } );

	}
	
};

// IE won't accept real selectors...
var typefaceSelectors = ['.typeface-js', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

if (document.createStyleSheet) { 

	var styleSheet = document.createStyleSheet();
	for (var i = 0; i < typefaceSelectors.length; i++) {
		var selector = typefaceSelectors[i];
		styleSheet.addRule(selector, 'visibility: hidden');
	}

	styleSheet.addRule(
		'.typeface-js-selected-text', 
		'-ms-filter: \
			"Chroma(color=black) \
			progid:DXImageTransform.Microsoft.MaskFilter(Color=white) \
			progid:DXImageTransform.Microsoft.MaskFilter(Color=blue) \
			alpha(opacity=30)" !important; \
		color: black; \
		font-family: Modern; \
		position: absolute; \
		white-space: pre; \
		filter: alpha(opacity=0) !important;'
	);

	styleSheet.addRule(
		'.typeface-js-vector-container',
		'position: relative'
	);

} else if (document.styleSheets) {

	if (!document.styleSheets.length) { (function() {
		// create a stylesheet if we need to
		var styleSheet = document.createElement('style');
		styleSheet.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(styleSheet);
	})() }

	var styleSheet = document.styleSheets[0];
	document.styleSheets[0].insertRule(typefaceSelectors.join(',') + ' { visibility: hidden; }', styleSheet.cssRules.length); 

	document.styleSheets[0].insertRule(
		'.typeface-js-selected-text { \
			color: rgba(128, 128, 128, 0); \
			opacity: 0.30; \
			position: absolute; \
			font-family: Arial, sans-serif; \
			white-space: pre \
		}', 
		styleSheet.cssRules.length
	);

	try { 
		// set selection style for Mozilla / Firefox
		document.styleSheets[0].insertRule(
			'.typeface-js-selected-text::-moz-selection { background: blue; }', 
			styleSheet.cssRules.length
		); 

	} catch(e) {};

	try { 
		// set styles for browsers with CSS3 selectors (Safari, Chrome)
		document.styleSheets[0].insertRule(
			'.typeface-js-selected-text::selection { background: blue; }', 
			styleSheet.cssRules.length
		); 

	} catch(e) {};

	// most unfortunately, sniff for WebKit's quirky selection behavior
	if (/WebKit/i.test(navigator.userAgent)) {
		document.styleSheets[0].insertRule(
			'.typeface-js-vector-container { position: relative }',
			styleSheet.cssRules.length
		);
	}

}

var backend =  window.CanvasRenderingContext2D || document.createElement('canvas').getContext ? 'canvas' : !!(window.attachEvent && !window.opera) ? 'vml' : null;

if (backend == 'vml') {

	document.namespaces.add("v","urn:schemas-microsoft-com:vml","#default#VML");

	var styleSheet = document.createStyleSheet();
	styleSheet.addRule('v\\:shape', "display: inline-block;");
}

_typeface_js.setVectorBackend(backend);
window._typeface_js = _typeface_js;
	
if (/WebKit/i.test(navigator.userAgent)) {

	var _typefaceTimer = setInterval(function() {
		if (/loaded|complete/.test(document.readyState)) {
			_typeface_js.initialize(); 
		}
	}, 10);
}

if (document.addEventListener) {
	window.addEventListener('DOMContentLoaded', function() { _typeface_js.initialize() }, false);
} 

/*@cc_on @*/
/*@if (@_win32)

document.write("<script id=__ie_onload_typeface defer src=//:><\/script>");
var script = document.getElementById("__ie_onload_typeface");
script.onreadystatechange = function() {
	if (this.readyState == "complete") {
		_typeface_js.initialize(); 
	}
};

/*@end @*/

try { console.log('initializing typeface.js') } catch(e) {};

})();

if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace({"glyphs":{"S":{"x_min":40,"x_max":871.765625,"ha":926,"o":"m 871 275 q 767 60 871 134 q 462 -14 663 -14 q 174 51 278 -14 q 40 248 69 116 l 233 280 q 309 170 252 204 q 467 135 366 135 q 677 263 677 135 q 653 330 677 304 q 585 374 629 357 q 417 417 541 392 q 268 457 310 442 q 192 493 226 473 q 134 543 158 514 q 97 612 111 573 q 84 702 84 651 q 182 901 84 832 q 465 970 279 970 q 731 914 642 970 q 846 730 820 858 l 652 704 q 592 797 637 765 q 460 828 546 828 q 279 714 279 828 q 298 653 279 676 q 355 612 318 629 q 509 570 393 596 q 706 517 647 541 q 800 459 766 492 q 853 380 835 426 q 871 275 871 334 "},"¦":{"x_min":105.90625,"x_max":283.609375,"ha":389,"o":"m 105 458 l 105 986 l 283 986 l 283 458 l 105 458 m 105 -309 l 105 219 l 283 219 l 283 -309 l 105 -309 "},"/":{"x_min":13.5625,"x_max":372.4375,"ha":386,"o":"m 13 -28 l 210 1006 l 372 1006 l 178 -28 l 13 -28 "},"y":{"x_min":10.859375,"x_max":765.53125,"ha":773,"o":"m 192 -288 q 71 -279 123 -288 l 71 -143 q 137 -148 107 -148 q 205 -136 178 -148 q 253 -93 232 -123 q 301 7 274 -63 l 10 734 l 212 734 l 327 389 q 396 163 354 315 l 413 227 l 457 387 l 566 734 l 765 734 l 475 -39 q 353 -233 416 -179 q 192 -288 291 -288 "},"Á":{"x_min":34.59375,"x_max":966.375,"ha":1003,"o":"m 768 0 l 683 244 l 319 244 l 234 0 l 34 0 l 383 956 l 619 956 l 966 0 l 768 0 m 501 808 l 497 793 q 480 738 490 769 q 364 395 471 707 l 638 395 l 544 669 l 515 761 l 501 808 m 389 1038 l 389 1059 l 559 1231 l 734 1231 l 734 1201 l 504 1038 l 389 1038 "},"g":{"x_min":56.9375,"x_max":755.140625,"ha":848,"o":"m 404 -294 q 188 -242 269 -294 q 87 -96 106 -191 l 278 -74 q 321 -143 288 -118 q 409 -168 355 -168 q 525 -119 488 -168 q 561 25 561 -71 l 561 63 l 563 135 l 561 135 q 326 1 498 1 q 127 97 197 1 q 56 372 56 193 q 129 650 56 552 q 340 748 201 748 q 561 615 500 748 l 565 615 q 568 680 565 639 q 574 734 571 721 l 755 734 q 751 564 751 660 l 751 22 q 662 -213 751 -133 q 404 -294 573 -294 m 563 376 q 522 553 563 490 q 408 617 482 617 q 255 372 255 617 q 406 133 255 133 q 522 196 482 133 q 563 376 563 260 "},"²":{"x_min":34.625,"x_max":433.8125,"ha":463,"o":"m 35 471 l 34 552 q 90 629 54 594 q 188 705 126 665 q 268 768 247 743 q 290 819 290 792 q 235 880 290 880 q 170 814 177 880 l 39 817 q 99 925 48 884 q 235 967 151 967 q 374 929 324 967 q 424 824 424 891 q 321 673 424 740 q 224 607 251 628 q 187 564 198 586 l 433 564 l 433 471 l 35 471 "},"–":{"x_min":42.078125,"x_max":730.25,"ha":773,"o":"m 42 304 l 42 442 l 730 442 l 730 304 l 42 304 "},"ë":{"x_min":54.296875,"x_max":725.5,"ha":773,"o":"m 397 -14 q 143 84 232 -14 q 54 369 54 182 q 144 649 54 551 q 400 747 234 747 q 642 642 558 747 q 725 335 725 537 l 725 329 l 254 329 q 294 168 254 222 q 407 113 333 113 q 534 201 508 113 l 714 185 q 397 -14 636 -14 m 397 626 q 294 580 330 626 q 255 449 257 533 l 541 449 q 498 582 535 537 q 397 626 460 626 m 471 813 l 471 962 l 619 962 l 619 813 l 471 813 m 177 813 l 177 962 l 322 962 l 322 813 l 177 813 "},"Î":{"x_min":-57,"x_max":443,"ha":386,"o":"m 92 0 l 92 956 l 293 956 l 293 0 l 92 0 m 443 1057 l 443 1038 l 335 1038 l 197 1140 l 194 1140 l 51 1038 l -57 1038 l -57 1057 l 118 1245 l 273 1245 l 443 1057 "},"e":{"x_min":54.296875,"x_max":725.5,"ha":773,"o":"m 397 -14 q 143 84 232 -14 q 54 369 54 182 q 144 649 54 551 q 400 747 234 747 q 642 642 558 747 q 725 335 725 537 l 725 329 l 254 329 q 294 168 254 222 q 407 113 333 113 q 534 201 508 113 l 714 185 q 397 -14 636 -14 m 397 626 q 294 580 330 626 q 255 449 257 533 l 541 449 q 498 582 535 537 q 397 626 460 626 "},"Ã":{"x_min":34.59375,"x_max":966.375,"ha":1003,"o":"m 768 0 l 683 244 l 319 244 l 234 0 l 34 0 l 383 956 l 619 956 l 966 0 l 768 0 m 501 808 l 497 793 q 480 738 490 769 q 364 395 471 707 l 638 395 l 544 669 l 515 761 l 501 808 m 613 1038 q 553 1050 583 1038 q 495 1079 523 1063 q 441 1108 466 1095 q 395 1121 415 1121 q 352 1106 367 1121 q 328 1038 338 1090 l 236 1038 q 258 1153 241 1114 q 305 1214 274 1191 q 388 1237 337 1237 q 449 1224 419 1237 q 508 1195 480 1211 q 561 1166 537 1179 q 606 1153 586 1153 q 648 1169 633 1153 q 673 1237 663 1186 l 765 1237 q 721 1084 760 1130 q 613 1038 683 1038 "},"J":{"x_min":21.03125,"x_max":677.984375,"ha":773,"o":"m 355 -14 q 127 50 206 -14 q 21 258 47 114 l 219 288 q 265 178 231 213 q 356 142 298 142 q 447 182 416 142 q 478 297 478 222 l 478 799 l 287 799 l 287 956 l 677 956 l 677 302 q 593 69 677 152 q 355 -14 508 -14 "},"»":{"x_min":63.109375,"x_max":711.234375,"ha":773,"o":"m 63 95 l 63 119 l 236 364 l 64 612 l 64 637 l 225 637 l 399 388 l 399 340 l 226 95 l 63 95 m 374 95 l 374 119 l 548 364 l 375 612 l 375 637 l 536 637 l 711 388 l 711 340 l 536 95 l 374 95 "},"©":{"x_min":21.6875,"x_max":1001.984375,"ha":1023,"o":"m 1001 479 q 936 234 1001 348 q 756 54 871 119 q 511 -11 642 -11 q 263 57 378 -11 q 85 238 148 125 q 21 479 21 351 q 87 724 21 610 q 267 904 153 838 q 511 970 381 970 q 757 903 643 970 q 936 724 871 837 q 1001 479 1001 611 m 926 479 q 870 685 926 590 q 718 836 814 780 q 511 892 622 892 q 310 839 405 892 q 157 690 215 786 q 99 479 99 594 q 154 272 99 368 q 305 120 210 176 q 511 64 400 64 q 719 120 623 64 q 870 272 815 176 q 926 479 926 368 m 368 480 q 408 338 368 389 q 520 288 448 288 q 599 313 565 288 q 653 385 634 338 l 762 353 q 663 230 722 268 q 520 193 604 193 q 318 268 389 193 q 246 480 246 343 q 315 690 246 618 q 514 762 385 762 q 662 724 602 762 q 753 606 721 686 l 648 578 q 597 643 630 620 q 517 666 564 666 q 406 618 444 666 q 368 480 368 571 "},"ò":{"x_min":54.234375,"x_max":793.765625,"ha":848,"o":"m 793 367 q 694 87 793 188 q 420 -14 595 -14 q 151 87 249 -14 q 54 367 54 189 q 151 645 54 544 q 425 747 249 747 q 699 648 604 747 q 793 367 793 550 m 594 367 q 551 557 594 498 q 427 616 509 616 q 254 367 254 616 q 296 180 254 244 q 418 116 338 116 q 594 367 594 116 m 452 802 l 221 988 l 221 1018 l 396 1018 l 567 822 l 567 802 l 452 802 "},"^":{"x_min":30.515625,"x_max":780.484375,"ha":811,"o":"m 625 349 l 404 859 l 184 349 l 30 349 l 295 956 l 514 956 l 780 349 l 625 349 "},"«":{"x_min":62.4375,"x_max":710.5625,"ha":773,"o":"m 547 95 l 373 340 l 373 388 l 547 637 l 709 637 l 709 612 l 536 364 l 710 119 l 710 95 l 547 95 m 237 95 l 62 340 l 62 388 l 237 637 l 397 637 l 397 612 l 225 364 l 399 119 l 399 95 l 237 95 "},"D":{"x_min":92.90625,"x_max":944.671875,"ha":1003,"o":"m 944 485 q 886 226 944 337 q 722 58 828 116 q 479 0 616 0 l 92 0 l 92 956 l 438 956 q 812 834 680 956 q 944 485 944 712 m 743 485 q 663 720 743 639 q 434 801 583 801 l 292 801 l 292 154 l 462 154 q 667 243 591 154 q 743 485 743 332 "},"ÿ":{"x_min":10.859375,"x_max":765.53125,"ha":773,"o":"m 192 -288 q 71 -279 123 -288 l 71 -143 q 137 -148 107 -148 q 205 -136 178 -148 q 253 -93 232 -123 q 301 7 274 -63 l 10 734 l 212 734 l 327 389 q 396 163 354 315 l 413 227 l 457 387 l 566 734 l 765 734 l 475 -39 q 353 -233 416 -179 q 192 -288 291 -288 m 468 813 l 468 962 l 616 962 l 616 813 l 468 813 m 174 813 l 174 962 l 319 962 l 319 813 l 174 813 "},"í":{"x_min":77.0625,"x_max":422.96875,"ha":386,"o":"m 98 0 l 98 734 l 288 734 l 288 0 l 98 0 m 77 802 l 77 822 l 247 1018 l 422 1018 l 422 988 l 192 802 l 77 802 "},"ˆ":{"x_min":0,"x_max":499.84375,"ha":463,"o":"m 499 821 l 499 802 l 392 802 l 254 932 l 251 932 l 108 802 l 0 802 l 0 821 l 174 1037 l 330 1037 l 499 821 "},"w":{"x_min":-4.0625,"x_max":1082.71875,"ha":1080,"o":"m 890 0 l 688 0 l 572 447 q 540 598 564 478 l 505 446 l 387 0 l 185 0 l -4 734 l 174 734 l 295 172 l 305 223 l 322 302 l 437 734 l 641 734 l 753 302 q 781 172 763 267 l 800 262 l 906 734 l 1082 734 l 890 0 "},"$":{"x_min":18.328125,"x_max":753.3125,"ha":773,"o":"m 753 279 q 670 89 753 157 q 426 16 588 22 l 426 -102 l 352 -102 l 352 14 q 125 82 207 19 q 18 277 44 146 l 191 309 q 243 196 204 232 q 352 154 281 161 l 352 419 q 342 422 350 420 q 331 424 334 424 q 165 483 221 449 q 79 570 109 517 q 48 698 48 622 q 126 872 48 811 q 352 940 204 934 l 352 1030 l 426 1030 l 426 940 q 575 911 515 936 q 670 839 634 887 q 729 702 707 791 l 550 676 q 510 767 540 735 q 426 807 481 799 l 426 568 l 434 567 q 554 534 454 567 q 703 438 654 502 q 753 279 753 375 m 352 809 q 226 701 226 800 q 237 651 226 671 q 267 619 247 632 q 352 584 287 606 l 352 809 m 576 277 q 564 332 576 310 q 529 367 552 353 q 426 403 505 380 l 426 154 q 576 277 576 164 "},"\\":{"x_min":14.25,"x_max":373.109375,"ha":386,"o":"m 208 -28 l 14 1007 l 175 1007 l 373 -28 l 208 -28 "},"Ì":{"x_min":-27,"x_max":318.21875,"ha":386,"o":"m 92 0 l 92 956 l 293 956 l 293 0 l 92 0 m 203 1038 l -27 1201 l -27 1231 l 147 1231 l 318 1059 l 318 1038 l 203 1038 "},"µ":{"x_min":90.84375,"x_max":716.609375,"ha":800,"o":"m 534 0 q 526 97 526 67 l 524 97 q 471 12 501 38 q 387 -14 440 -14 q 324 2 351 -14 q 281 47 297 18 l 278 47 q 281 -30 281 17 l 281 -289 l 90 -289 l 90 734 l 281 734 l 281 323 q 310 175 281 221 q 400 130 339 130 q 490 182 460 130 q 520 341 520 233 l 520 734 l 711 734 l 711 164 q 716 0 711 75 l 534 0 "},"Ç":{"x_min":56.96875,"x_max":965.015625,"ha":1003,"o":"m 539 143 q 790 325 720 143 l 965 259 q 799 53 908 120 q 539 -14 691 -14 q 182 116 308 -14 q 56 482 56 247 q 178 843 56 717 q 530 970 299 970 q 804 902 698 970 q 952 704 910 835 l 776 656 q 688 770 754 727 q 534 812 623 812 q 328 728 398 812 q 258 482 258 644 q 330 230 258 317 q 539 143 402 143 m 670 -159 q 617 -255 670 -222 q 464 -288 564 -288 q 396 -283 434 -288 l 396 -203 q 453 -208 419 -208 q 546 -161 546 -208 q 527 -126 546 -138 q 463 -115 508 -115 q 427 -116 437 -115 l 470 0 l 567 0 l 544 -55 q 639 -86 608 -58 q 670 -159 670 -114 "},"’":{"x_min":94.296875,"x_max":291.671875,"ha":386,"o":"m 291 823 q 275 681 291 741 q 217 564 258 620 l 94 564 q 183 780 183 678 l 97 780 l 97 956 l 291 956 l 291 823 "},"-":{"x_min":54.3125,"x_max":407.328125,"ha":463,"o":"m 54 277 l 54 443 l 407 443 l 407 277 l 54 277 "},"Q":{"x_min":56.953125,"x_max":1021.6875,"ha":1080,"o":"m 1021 482 q 927 164 1021 291 q 666 3 833 36 q 731 -94 689 -64 q 848 -124 772 -124 q 928 -118 888 -124 l 927 -255 q 763 -274 842 -274 q 580 -212 652 -274 q 463 -7 507 -150 q 163 140 270 11 q 56 482 56 269 q 184 841 56 712 q 538 970 311 970 q 893 839 766 970 q 1021 482 1021 709 m 817 482 q 744 724 817 636 q 538 812 671 812 q 331 725 404 812 q 258 482 258 638 q 332 233 258 324 q 537 142 407 142 q 744 231 671 142 q 817 482 817 319 "},"M":{"x_min":92.90625,"x_max":1064.09375,"ha":1157,"o":"m 886 0 l 886 579 q 886 618 886 599 q 893 787 887 638 q 821 533 845 605 l 649 0 l 507 0 l 335 533 l 262 787 q 270 579 270 630 l 270 0 l 92 0 l 92 956 l 360 956 l 531 421 l 546 369 l 579 241 l 621 394 l 797 956 l 1064 956 l 1064 0 l 886 0 "},"C":{"x_min":56.96875,"x_max":965.015625,"ha":1003,"o":"m 539 143 q 790 325 720 143 l 965 259 q 799 53 908 120 q 539 -14 691 -14 q 182 116 308 -14 q 56 482 56 247 q 178 843 56 717 q 530 970 299 970 q 804 902 698 970 q 952 704 910 835 l 776 656 q 688 770 754 727 q 534 812 623 812 q 328 728 398 812 q 258 482 258 644 q 330 230 258 317 q 539 143 402 143 "},"!":{"x_min":131.03125,"x_max":330.4375,"ha":463,"o":"m 308 289 l 152 289 l 131 956 l 330 956 l 308 289 m 131 0 l 131 183 l 326 183 l 326 0 l 131 0 "},"ç":{"x_min":54.296875,"x_max":732.28125,"ha":773,"o":"m 403 -14 q 145 85 236 -14 q 54 362 54 184 q 145 645 54 544 q 405 747 237 747 q 620 681 535 747 q 726 502 705 616 l 534 493 q 494 582 526 549 q 401 616 461 616 q 254 369 254 616 q 404 116 254 116 q 495 150 458 116 q 541 253 532 184 l 732 244 q 678 109 722 168 q 563 18 634 50 q 403 -14 492 -14 m 537 -159 q 484 -255 537 -222 q 331 -288 431 -288 q 263 -283 301 -288 l 263 -203 q 320 -208 286 -208 q 413 -161 413 -208 q 394 -126 413 -138 q 330 -115 375 -115 q 294 -116 304 -115 l 337 0 l 434 0 l 411 -55 q 506 -86 475 -58 q 537 -159 537 -114 "},"È":{"x_min":92.875,"x_max":871.765625,"ha":926,"o":"m 92 0 l 92 956 l 843 956 l 843 801 l 292 801 l 292 561 l 802 561 l 802 406 l 292 406 l 292 154 l 871 154 l 871 0 l 92 0 m 499 1038 l 269 1201 l 269 1231 l 443 1231 l 614 1059 l 614 1038 l 499 1038 "},"{":{"x_min":22.40625,"x_max":511.8125,"ha":541,"o":"m 378 -288 q 232 -234 287 -288 q 177 -85 177 -181 l 177 136 q 140 252 177 213 q 22 291 103 290 l 22 424 q 141 465 104 427 q 177 580 177 504 l 177 803 q 231 954 177 902 q 378 1006 284 1006 l 511 1006 l 511 877 l 472 877 q 383 841 410 877 q 355 735 355 806 l 355 531 q 316 419 355 466 q 215 360 277 373 l 215 357 q 317 296 279 342 q 355 186 355 249 l 355 -16 q 383 -123 355 -88 q 472 -158 410 -158 l 511 -158 l 511 -288 l 378 -288 "},"X":{"x_min":12.203125,"x_max":913.796875,"ha":926,"o":"m 703 0 l 463 380 l 223 0 l 12 0 l 343 502 l 40 956 l 251 956 l 463 618 l 675 956 l 886 956 l 595 502 l 913 0 l 703 0 "},"ô":{"x_min":54.234375,"x_max":793.765625,"ha":848,"o":"m 793 367 q 694 87 793 188 q 420 -14 595 -14 q 151 87 249 -14 q 54 367 54 189 q 151 645 54 544 q 425 747 249 747 q 699 648 604 747 q 793 367 793 550 m 594 367 q 551 557 594 498 q 427 616 509 616 q 254 367 254 616 q 296 180 254 244 q 418 116 338 116 q 594 367 594 116 m 673 821 l 673 802 l 566 802 l 428 932 l 425 932 l 282 802 l 174 802 l 174 821 l 348 1037 l 504 1037 l 673 821 "},"¼":{"x_min":63.75,"x_max":1092.609375,"ha":1158,"o":"m 368 0 l 232 0 l 839 955 l 975 955 l 368 0 m 63 470 l 63 552 l 188 552 l 188 870 l 71 796 l 71 879 l 193 959 l 311 959 l 311 552 l 427 552 l 427 470 l 63 470 m 1022 95 l 1022 0 l 898 0 l 898 95 l 665 95 l 665 196 l 879 489 l 1022 489 l 1022 190 l 1092 190 l 1092 95 l 1022 95 m 901 395 l 893 382 q 857 322 876 350 l 761 190 l 898 190 l 898 322 l 901 395 "},"#":{"x_min":23.78125,"x_max":750.359375,"ha":773,"o":"m 616 584 l 569 359 l 715 359 l 715 257 l 548 257 l 493 0 l 387 0 l 441 257 l 233 257 l 179 0 l 75 0 l 128 257 l 23 257 l 23 359 l 151 359 l 198 584 l 58 584 l 58 685 l 219 685 l 276 946 l 380 946 l 324 685 l 533 685 l 590 946 l 696 946 l 639 685 l 750 685 l 750 584 l 616 584 m 304 584 l 255 359 l 465 359 l 512 584 l 304 584 "},"Ê":{"x_min":92.875,"x_max":871.765625,"ha":926,"o":"m 92 0 l 92 956 l 843 956 l 843 801 l 292 801 l 292 561 l 802 561 l 802 406 l 292 406 l 292 154 l 871 154 l 871 0 l 92 0 m 733 1057 l 733 1038 l 625 1038 l 487 1140 l 484 1140 l 341 1038 l 233 1038 l 233 1057 l 408 1245 l 563 1245 l 733 1057 "},")":{"x_min":1.359375,"x_max":393.75,"ha":463,"o":"m 1 -288 q 157 22 110 -129 q 205 359 205 173 q 156 699 205 545 q 1 1006 108 852 l 192 1006 q 346 699 299 852 q 393 360 393 547 q 346 19 393 171 q 192 -288 299 -133 l 1 -288 "},"Å":{"x_min":34.59375,"x_max":966.375,"ha":1003,"o":"m 768 0 l 683 244 l 319 244 l 234 0 l 34 0 l 383 956 l 619 956 l 966 0 l 768 0 m 501 808 l 497 793 q 480 738 490 769 q 364 395 471 707 l 638 395 l 544 669 l 515 761 l 501 808 m 673 1052 q 624 930 673 981 q 501 880 574 880 q 379 930 429 880 q 329 1052 329 981 q 379 1174 329 1123 q 501 1225 430 1225 q 623 1174 572 1225 q 673 1052 673 1123 m 587 1052 q 563 1112 587 1087 q 501 1137 538 1137 q 442 1113 467 1137 q 416 1052 416 1088 q 442 989 416 1014 q 501 965 467 965 q 562 990 537 965 q 587 1052 587 1015 "},"ø":{"x_min":0.640625,"x_max":841.921875,"ha":848,"o":"m 793 367 q 694 87 793 188 q 420 -14 595 -14 q 201 46 290 -14 l 124 -37 l 0 -37 l 134 108 q 54 367 54 207 q 151 645 54 544 q 425 747 249 747 q 648 690 559 747 l 717 768 l 841 768 l 717 628 q 793 367 793 531 m 254 367 q 265 256 254 304 l 541 569 q 427 616 500 616 q 254 367 254 616 m 594 367 q 583 477 594 430 l 307 165 q 418 116 349 116 q 594 367 594 116 "},"â":{"x_min":35.71875,"x_max":776.75,"ha":773,"o":"m 261 -14 q 95 44 155 -14 q 35 207 35 102 q 110 380 35 321 q 325 442 184 440 l 483 444 l 483 481 q 458 588 483 553 q 376 623 433 623 q 298 599 323 623 q 267 519 273 575 l 68 529 q 167 691 87 636 q 384 747 246 747 q 599 678 523 747 q 674 483 674 609 l 674 216 q 688 131 674 154 q 734 108 702 108 q 776 112 756 108 l 776 9 q 746 1 759 4 q 719 -3 732 -1 q 690 -7 705 -5 q 654 -8 675 -8 q 548 26 582 -8 q 507 130 514 61 l 503 130 q 261 -14 423 -14 m 483 339 l 385 338 q 291 323 319 335 q 249 287 263 311 q 234 222 234 262 q 258 144 234 169 q 322 118 282 118 q 404 143 367 118 q 462 210 441 167 q 483 302 483 254 l 483 339 m 635 821 l 635 802 l 528 802 l 390 932 l 387 932 l 244 802 l 136 802 l 136 821 l 310 1037 l 466 1037 l 635 821 "},"}":{"x_min":29.1875,"x_max":519.953125,"ha":541,"o":"m 29 -158 l 67 -158 q 157 -123 131 -158 q 184 -16 184 -88 l 184 186 q 223 295 184 249 q 325 357 261 342 l 325 360 q 224 419 263 373 q 184 531 184 466 l 184 735 q 157 841 184 806 q 67 877 131 877 l 29 877 l 29 1006 l 162 1006 q 309 954 256 1006 q 363 803 363 902 l 363 580 q 400 466 363 504 q 519 424 437 427 l 519 291 q 400 251 437 290 q 363 136 363 211 l 363 -85 q 308 -234 363 -180 q 162 -288 254 -288 l 29 -288 l 29 -158 "},"Ä":{"x_min":34.59375,"x_max":966.375,"ha":1003,"o":"m 768 0 l 683 244 l 319 244 l 234 0 l 34 0 l 383 956 l 619 956 l 966 0 l 768 0 m 501 808 l 497 793 q 480 738 490 769 q 364 395 471 707 l 638 395 l 544 669 l 515 761 l 501 808 m 588 1038 l 588 1187 l 722 1187 l 722 1038 l 588 1038 m 280 1038 l 280 1187 l 411 1187 l 411 1038 l 280 1038 "},"¸":{"x_min":65.109375,"x_max":339.109375,"ha":463,"o":"m 339 -159 q 286 -255 339 -222 q 133 -288 233 -288 q 65 -283 103 -288 l 65 -203 q 122 -208 88 -208 q 215 -161 215 -208 q 196 -126 215 -138 q 132 -115 177 -115 q 96 -116 106 -115 l 139 0 l 236 0 l 213 -55 q 308 -86 277 -58 q 339 -159 339 -114 "},"a":{"x_min":40.71875,"x_max":781.75,"ha":773,"o":"m 266 -14 q 100 44 160 -14 q 40 207 40 102 q 115 380 40 321 q 330 442 189 440 l 488 444 l 488 481 q 463 588 488 553 q 381 623 438 623 q 303 599 328 623 q 272 519 278 575 l 73 529 q 172 691 92 636 q 389 747 251 747 q 604 678 528 747 q 679 483 679 609 l 679 216 q 693 131 679 154 q 739 108 707 108 q 781 112 761 108 l 781 9 q 751 1 764 4 q 724 -3 737 -1 q 695 -7 710 -5 q 659 -8 680 -8 q 553 26 587 -8 q 512 130 519 61 l 508 130 q 266 -14 428 -14 m 488 339 l 390 338 q 296 323 324 335 q 254 287 268 311 q 239 222 239 262 q 263 144 239 169 q 327 118 287 118 q 409 143 372 118 q 467 210 446 167 q 488 302 488 254 l 488 339 "},"—":{"x_min":0,"x_max":1389,"ha":1389,"o":"m 0 304 l 0 442 l 1389 442 l 1389 304 l 0 304 "},"=":{"x_min":57.640625,"x_max":754.046875,"ha":811,"o":"m 57 570 l 57 722 l 754 722 l 754 570 l 57 570 m 57 197 l 57 346 l 754 346 l 754 197 l 57 197 "},"N":{"x_min":92.90625,"x_max":909.40625,"ha":1003,"o":"m 674 0 l 258 736 q 270 563 270 628 l 270 0 l 92 0 l 92 956 l 321 956 l 743 213 q 731 400 731 316 l 731 956 l 909 956 l 909 0 l 674 0 "},"˚":{"x_min":26.453125,"x_max":370.984375,"ha":463,"o":"m 370 942 q 321 820 370 871 q 198 770 271 770 q 76 820 126 770 q 26 942 26 871 q 76 1064 26 1013 q 198 1115 127 1115 q 320 1064 269 1115 q 370 942 370 1013 m 284 942 q 260 1002 284 977 q 198 1027 235 1027 q 139 1003 164 1027 q 113 942 113 978 q 139 879 113 904 q 198 855 164 855 q 259 880 234 855 q 284 942 284 905 "},"ú":{"x_min":86.09375,"x_max":756.484375,"ha":848,"o":"m 276 734 l 276 321 q 406 128 276 128 q 518 187 475 128 q 560 340 560 247 l 560 734 l 751 734 l 751 164 q 756 0 751 70 l 574 0 q 566 145 566 97 l 563 145 q 466 23 525 61 q 327 -14 408 -14 q 148 57 210 -14 q 86 267 86 129 l 86 734 l 276 734 m 314 802 l 314 822 l 484 1018 l 659 1018 l 659 988 l 429 802 l 314 802 "},"2":{"x_min":48.1875,"x_max":717.34375,"ha":773,"o":"m 48 0 l 48 132 q 154 292 85 214 q 327 455 223 370 q 468 589 428 536 q 509 693 509 642 q 383 818 509 818 q 290 785 322 818 q 248 687 257 752 l 56 697 q 155 900 72 830 q 382 970 238 970 q 619 899 536 970 q 702 701 702 828 q 675 579 702 634 q 608 479 649 525 q 516 394 566 434 q 417 316 465 354 q 331 239 370 278 q 273 156 292 200 l 717 156 l 717 0 l 48 0 "},"ü":{"x_min":86.09375,"x_max":756.484375,"ha":848,"o":"m 276 734 l 276 321 q 406 128 276 128 q 518 187 475 128 q 560 340 560 247 l 560 734 l 751 734 l 751 164 q 756 0 751 70 l 574 0 q 566 145 566 97 l 563 145 q 466 23 525 61 q 327 -14 408 -14 q 148 57 210 -14 q 86 267 86 129 l 86 734 l 276 734 m 496 813 l 496 962 l 644 962 l 644 813 l 496 813 m 202 813 l 202 962 l 347 962 l 347 813 l 202 813 "},"¯":{"x_min":-11.53125,"x_max":778.59375,"ha":767,"o":"m 778 985 l -11 985 l -11 1048 l 778 1048 l 778 985 "},"Z":{"x_min":41.34375,"x_max":808,"ha":848,"o":"m 808 0 l 41 0 l 41 141 l 557 799 l 92 799 l 92 956 l 780 956 l 780 816 l 263 156 l 808 156 l 808 0 "},"u":{"x_min":86.09375,"x_max":756.484375,"ha":848,"o":"m 276 734 l 276 321 q 406 128 276 128 q 518 187 475 128 q 560 340 560 247 l 560 734 l 751 734 l 751 164 q 756 0 751 70 l 574 0 q 566 145 566 97 l 563 145 q 466 23 525 61 q 327 -14 408 -14 q 148 57 210 -14 q 86 267 86 129 l 86 734 l 276 734 "},"˜":{"x_min":-9.5,"x_max":519.515625,"ha":463,"o":"m 368 802 q 308 814 338 802 q 249 843 278 827 q 195 872 221 859 q 149 885 170 885 q 107 870 122 885 q 83 802 92 854 l -9 802 q 12 917 -4 878 q 60 978 29 955 q 143 1001 91 1001 q 204 988 173 1001 q 263 959 234 975 q 316 930 291 943 q 360 917 341 917 q 403 933 387 917 q 427 1001 418 950 l 519 1001 q 476 848 514 894 q 368 802 438 802 "},"Ó":{"x_min":56.953125,"x_max":1021.6875,"ha":1080,"o":"m 1021 482 q 962 219 1021 332 q 793 46 903 106 q 537 -14 684 -14 q 184 118 312 -14 q 56 482 56 251 q 184 841 56 712 q 538 970 311 970 q 893 839 766 970 q 1021 482 1021 709 m 817 482 q 744 724 817 636 q 538 812 671 812 q 331 725 404 812 q 258 482 258 638 q 333 233 258 324 q 537 143 408 143 q 744 231 671 143 q 817 482 817 319 m 424 1038 l 424 1059 l 594 1231 l 769 1231 l 769 1201 l 539 1038 l 424 1038 "},"k":{"x_min":97.046875,"x_max":774.359375,"ha":773,"o":"m 565 0 l 369 332 l 287 275 l 287 0 l 97 0 l 97 1006 l 287 1006 l 287 430 l 549 734 l 754 734 l 496 447 l 774 0 l 565 0 "},"Ù":{"x_min":83.40625,"x_max":918.234375,"ha":1003,"o":"m 490 -14 q 188 82 292 -14 q 83 357 83 178 l 83 956 l 283 956 l 283 373 q 337 201 283 260 q 495 142 391 142 q 660 204 602 142 q 718 380 718 265 l 718 956 l 918 956 l 918 368 q 806 86 918 186 q 490 -14 693 -14 m 512 1038 l 282 1201 l 282 1231 l 456 1231 l 627 1059 l 627 1038 l 512 1038 "},"€":{"x_min":6.828125,"x_max":748.5625,"ha":773,"o":"m 446 134 q 524 165 495 134 q 560 253 553 197 l 748 242 q 649 50 727 114 q 443 -14 572 -14 q 202 76 290 -14 q 94 345 114 166 l 6 345 l 33 447 l 86 447 l 84 481 l 86 519 l 6 519 l 33 621 l 92 621 q 443 970 135 970 q 644 906 567 970 q 741 726 722 842 l 551 716 q 516 793 545 766 q 437 821 488 821 q 334 773 370 821 q 288 621 299 725 l 510 621 l 491 519 l 285 519 l 284 481 l 286 447 l 517 447 l 496 345 l 290 345 q 446 134 309 134 "},"¢":{"x_min":34.609375,"x_max":741.109375,"ha":773,"o":"m 399 230 q 499 267 458 230 q 549 372 539 304 l 741 363 q 650 191 726 260 q 453 108 574 122 l 453 -21 l 343 -21 l 343 107 q 116 213 197 121 q 34 465 34 305 q 114 718 34 622 q 343 831 194 814 l 343 956 l 453 956 l 453 831 q 641 754 568 818 q 735 588 715 691 l 543 579 q 495 674 533 640 q 397 708 457 708 q 270 645 313 708 q 226 472 226 583 q 271 292 226 353 q 399 230 316 230 "},"ß":{"x_min":96.9375,"x_max":808.6875,"ha":848,"o":"m 808 211 q 740 43 808 101 q 546 -14 672 -14 q 368 15 447 -14 l 368 154 q 448 127 402 139 q 525 114 494 114 q 605 138 580 114 q 630 200 630 161 q 605 265 630 235 q 516 337 579 295 q 401 514 401 411 q 420 583 401 551 q 477 649 439 615 q 536 713 519 685 q 553 771 553 740 q 521 841 553 815 q 430 868 490 868 q 324 825 360 868 q 287 686 287 782 l 287 0 l 96 0 l 96 682 q 183 923 96 841 q 432 1006 269 1006 q 652 944 572 1006 q 733 778 733 883 q 722 713 733 742 q 694 661 711 684 q 657 620 677 638 q 620 586 637 601 q 592 557 603 571 q 581 529 581 543 q 594 497 581 512 q 694 418 608 482 q 808 211 808 333 "},"é":{"x_min":54.296875,"x_max":725.5,"ha":773,"o":"m 397 -14 q 143 84 232 -14 q 54 369 54 182 q 144 649 54 551 q 400 747 234 747 q 642 642 558 747 q 725 335 725 537 l 725 329 l 254 329 q 294 168 254 222 q 407 113 333 113 q 534 201 508 113 l 714 185 q 397 -14 636 -14 m 397 626 q 294 580 330 626 q 255 449 257 533 l 541 449 q 498 582 535 537 q 397 626 460 626 m 284 802 l 284 822 l 454 1018 l 629 1018 l 629 988 l 399 802 l 284 802 "},"s":{"x_min":48.859375,"x_max":715.984375,"ha":773,"o":"m 715 213 q 628 46 715 107 q 387 -14 541 -14 q 155 33 236 -14 q 48 182 75 81 l 216 208 q 265 133 230 155 q 387 112 300 112 q 504 132 467 112 q 541 196 541 152 q 511 252 541 231 q 411 287 481 273 q 193 346 249 319 q 107 417 137 374 q 78 525 78 461 q 159 689 78 630 q 388 748 240 748 q 599 697 519 748 q 699 549 679 646 l 530 532 q 490 599 522 576 q 388 621 458 621 q 286 603 320 621 q 253 545 253 586 q 279 495 253 513 q 367 464 305 476 q 520 428 453 446 q 627 383 587 409 q 691 317 667 357 q 715 213 715 277 "},"B":{"x_min":92.90625,"x_max":939.9375,"ha":1003,"o":"m 939 272 q 842 71 939 142 q 571 0 744 0 l 92 0 l 92 956 l 530 956 q 795 895 705 956 q 885 716 885 834 q 839 578 885 634 q 702 503 794 522 q 879 430 818 489 q 939 272 939 370 m 683 688 q 642 780 683 753 q 520 807 601 807 l 292 807 l 292 571 l 522 571 q 645 600 606 571 q 683 688 683 629 m 739 288 q 546 423 739 423 l 292 423 l 292 148 l 554 148 q 694 183 650 148 q 739 288 739 218 "},"?":{"x_min":63.71875,"x_max":768.015625,"ha":848,"o":"m 768 695 q 738 577 768 630 q 628 468 709 525 l 576 430 q 508 363 530 397 q 483 289 485 329 l 302 289 q 341 412 306 358 q 443 514 376 466 q 546 602 516 564 q 576 687 576 641 q 537 782 576 747 q 426 816 498 816 q 311 776 357 816 q 257 671 265 736 l 63 679 q 176 893 82 816 q 423 970 271 970 q 676 897 584 970 q 768 695 768 824 m 296 0 l 296 183 l 492 183 l 492 0 l 296 0 "},"H":{"x_min":92.90625,"x_max":909.40625,"ha":1003,"o":"m 709 0 l 709 409 l 292 409 l 292 0 l 92 0 l 92 956 l 292 956 l 292 575 l 709 575 l 709 956 l 909 956 l 909 0 l 709 0 "},"î":{"x_min":-56,"x_max":443.84375,"ha":386,"o":"m 98 0 l 98 734 l 288 734 l 288 0 l 98 0 m 443 821 l 443 802 l 336 802 l 198 932 l 195 932 l 52 802 l -56 802 l -56 821 l 118 1037 l 274 1037 l 443 821 "},"c":{"x_min":54.296875,"x_max":732.28125,"ha":773,"o":"m 403 -14 q 145 85 236 -14 q 54 362 54 184 q 145 645 54 544 q 405 747 237 747 q 620 681 535 747 q 726 502 705 616 l 534 493 q 494 582 526 549 q 401 616 461 616 q 254 369 254 616 q 404 116 254 116 q 495 150 458 116 q 541 253 532 184 l 732 244 q 678 109 722 168 q 563 18 634 50 q 403 -14 492 -14 "},"¶":{"x_min":48.1875,"x_max":726.796875,"ha":773,"o":"m 637 859 l 637 -179 l 532 -179 l 532 859 l 399 859 l 399 -179 l 294 -179 l 294 471 q 114 533 179 471 q 48 711 48 596 q 115 891 48 826 q 299 956 181 956 l 726 956 l 726 859 l 637 859 "},"•":{"x_min":44.0625,"x_max":441.265625,"ha":486,"o":"m 441 458 q 382 317 441 376 q 241 258 323 258 q 102 316 160 258 q 44 458 44 375 q 102 598 44 540 q 241 657 159 657 q 382 598 324 657 q 441 458 441 540 "},"¥":{"x_min":5.421875,"x_max":766.890625,"ha":773,"o":"m 519 469 l 707 469 l 707 369 l 477 369 l 477 260 l 707 260 l 707 160 l 477 160 l 477 0 l 293 0 l 293 160 l 65 160 l 65 260 l 293 260 l 294 369 l 65 369 l 65 469 l 252 469 l 5 956 l 201 956 l 384 551 l 570 956 l 766 956 l 519 469 "},"(":{"x_min":69.25,"x_max":461.640625,"ha":463,"o":"m 270 -288 q 116 17 164 -134 q 69 360 69 170 q 116 701 69 549 q 270 1006 164 853 l 461 1006 q 305 698 354 851 q 257 359 257 545 q 305 22 257 174 q 461 -288 353 -130 l 270 -288 "},"U":{"x_min":83.40625,"x_max":918.234375,"ha":1003,"o":"m 490 -14 q 188 82 292 -14 q 83 357 83 178 l 83 956 l 283 956 l 283 373 q 337 201 283 260 q 495 142 391 142 q 660 204 602 142 q 718 380 718 265 l 718 956 l 918 956 l 918 368 q 806 86 918 186 q 490 -14 693 -14 "},"Ñ":{"x_min":92.90625,"x_max":909.40625,"ha":1003,"o":"m 674 0 l 258 736 q 270 563 270 628 l 270 0 l 92 0 l 92 956 l 321 956 l 743 213 q 731 400 731 316 l 731 956 l 909 956 l 909 0 l 674 0 m 614 1038 q 554 1050 584 1038 q 496 1079 524 1063 q 442 1108 467 1095 q 396 1121 416 1121 q 353 1106 368 1121 q 329 1038 339 1090 l 237 1038 q 259 1153 242 1114 q 306 1214 275 1191 q 389 1237 338 1237 q 450 1224 420 1237 q 509 1195 481 1211 q 562 1166 538 1179 q 607 1153 587 1153 q 649 1169 634 1153 q 674 1237 664 1186 l 766 1237 q 722 1084 761 1130 q 614 1038 684 1038 "},"F":{"x_min":92.859375,"x_max":797.15625,"ha":848,"o":"m 292 801 l 292 505 l 781 505 l 781 350 l 292 350 l 292 0 l 92 0 l 92 956 l 797 956 l 797 801 l 292 801 "},"­":{"x_min":54.3125,"x_max":407.328125,"ha":463,"o":"m 54 277 l 54 443 l 407 443 l 407 277 l 54 277 "},":":{"x_min":133.734375,"x_max":329.0625,"ha":463,"o":"m 133 510 l 133 701 l 329 701 l 329 510 l 133 510 m 133 0 l 133 191 l 329 191 l 329 0 l 133 0 "},"Û":{"x_min":83.40625,"x_max":918.234375,"ha":1003,"o":"m 490 -14 q 188 82 292 -14 q 83 357 83 178 l 83 956 l 283 956 l 283 373 q 337 201 283 260 q 495 142 391 142 q 660 204 602 142 q 718 380 718 265 l 718 956 l 918 956 l 918 368 q 806 86 918 186 q 490 -14 693 -14 m 750 1057 l 750 1038 l 642 1038 l 504 1140 l 501 1140 l 358 1038 l 250 1038 l 250 1057 l 425 1245 l 580 1245 l 750 1057 "},"*":{"x_min":4.078125,"x_max":539.640625,"ha":541,"o":"m 333 770 l 493 840 l 539 707 l 369 665 l 496 521 l 371 439 l 272 609 l 171 439 l 44 522 l 173 665 l 4 707 l 50 840 l 212 770 l 200 956 l 346 956 l 333 770 "},"°":{"x_min":60.984375,"x_max":495.359375,"ha":555,"o":"m 495 752 q 432 601 495 664 q 277 539 368 539 q 124 600 188 539 q 60 752 60 662 q 89 860 60 810 q 168 937 118 909 q 277 966 218 966 q 432 903 369 966 q 495 752 495 840 m 388 752 q 356 832 388 799 q 277 864 325 864 q 197 832 229 864 q 165 752 165 799 q 198 672 165 705 q 277 638 231 638 q 355 671 323 638 q 388 752 388 705 "},"V":{"x_min":9.484375,"x_max":916.515625,"ha":926,"o":"m 565 0 l 362 0 l 9 956 l 218 956 l 414 341 q 465 161 433 281 l 479 219 l 513 341 l 709 956 l 916 956 l 565 0 "},"å":{"x_min":35.71875,"x_max":776.75,"ha":773,"o":"m 261 -14 q 95 44 155 -14 q 35 207 35 102 q 110 380 35 321 q 325 442 184 440 l 483 444 l 483 481 q 458 588 483 553 q 376 623 433 623 q 298 599 323 623 q 267 519 273 575 l 68 529 q 167 691 87 636 q 384 747 246 747 q 599 678 523 747 q 674 483 674 609 l 674 216 q 688 131 674 154 q 734 108 702 108 q 776 112 756 108 l 776 9 q 746 1 759 4 q 719 -3 732 -1 q 690 -7 705 -5 q 654 -8 675 -8 q 548 26 582 -8 q 507 130 514 61 l 503 130 q 261 -14 423 -14 m 483 339 l 385 338 q 291 323 319 335 q 249 287 263 311 q 234 222 234 262 q 258 144 234 169 q 322 118 282 118 q 404 143 367 118 q 462 210 441 167 q 483 302 483 254 l 483 339 m 551 970 q 502 848 551 899 q 379 798 452 798 q 257 848 307 798 q 207 970 207 899 q 257 1092 207 1041 q 379 1143 308 1143 q 501 1092 450 1143 q 551 970 551 1041 m 465 970 q 441 1030 465 1005 q 379 1055 416 1055 q 320 1031 345 1055 q 294 970 294 1006 q 320 907 294 932 q 379 883 345 883 q 440 908 415 883 q 465 970 465 933 "}," ":{"x_min":0,"x_max":0,"ha":386},"0":{"x_min":54.96875,"x_max":715.984375,"ha":773,"o":"m 715 478 q 632 110 715 235 q 383 -14 549 -14 q 54 478 54 -14 q 90 758 54 649 q 198 918 126 866 q 388 970 270 970 q 637 847 558 970 q 715 478 715 724 m 524 478 q 511 683 524 610 q 470 788 498 756 q 387 820 441 820 q 300 788 329 820 q 258 683 270 756 q 245 478 245 610 q 258 273 245 347 q 300 167 272 199 q 384 135 329 135 q 468 169 439 135 q 511 277 498 203 q 524 478 524 351 "},"”":{"x_min":102.484375,"x_max":591.6875,"ha":695,"o":"m 591 825 q 574 680 591 743 q 517 564 557 618 l 392 564 q 483 780 483 678 l 397 780 l 397 956 l 591 956 l 591 825 m 299 825 q 282 680 299 741 q 225 564 265 619 l 102 564 q 191 780 191 678 l 105 780 l 105 956 l 299 956 l 299 825 "},"¾":{"x_min":69.859375,"x_max":1092.609375,"ha":1158,"o":"m 368 0 l 232 0 l 839 955 l 975 955 l 368 0 m 1022 95 l 1022 0 l 898 0 l 898 95 l 665 95 l 665 196 l 879 489 l 1022 489 l 1022 190 l 1092 190 l 1092 95 l 1022 95 m 901 395 l 893 382 q 857 322 876 350 l 761 190 l 898 190 l 898 322 l 901 395 m 472 607 q 421 501 472 539 q 277 463 370 463 q 132 499 185 463 q 69 604 78 534 l 198 613 q 275 550 204 550 q 344 615 344 550 q 250 678 344 678 l 212 678 l 212 763 l 246 763 q 311 779 289 763 q 333 824 333 795 q 317 866 333 851 q 272 881 301 881 q 206 820 212 881 l 80 828 q 139 929 87 892 q 276 967 191 967 q 411 932 362 967 q 459 839 459 897 q 435 765 459 796 q 356 723 410 734 l 356 722 q 442 685 413 716 q 472 607 472 653 "},"@":{"x_min":79.328125,"x_max":1273.3125,"ha":1354,"o":"m 1273 491 q 1230 266 1273 368 q 1111 107 1187 164 q 947 50 1035 50 q 851 80 884 50 q 817 166 817 111 q 821 212 817 191 l 817 212 q 716 95 783 140 q 580 50 650 50 q 415 118 473 50 q 356 311 356 187 q 400 518 356 421 q 521 670 444 615 q 695 726 599 726 q 874 607 827 726 l 878 607 l 905 711 l 1010 711 l 931 367 q 906 205 906 251 q 922 157 906 171 q 959 142 938 142 q 1063 190 1013 142 q 1141 316 1112 237 q 1170 490 1170 395 q 1118 700 1170 608 q 968 840 1066 791 q 741 890 871 890 q 454 819 579 890 q 260 613 330 747 q 189 312 189 479 q 243 80 189 180 q 394 -71 296 -19 q 623 -122 492 -122 q 1023 -17 823 -122 l 1065 -99 q 842 -192 951 -164 q 619 -220 733 -220 q 337 -155 459 -220 q 147 31 215 -90 q 79 312 79 154 q 165 659 79 504 q 402 900 250 815 q 740 986 553 986 q 1025 924 905 986 q 1209 751 1146 863 q 1273 491 1273 639 m 834 488 q 794 593 834 553 q 690 634 753 634 q 575 592 626 634 q 497 472 525 549 q 469 312 469 394 q 502 190 469 235 q 602 145 534 145 q 689 174 647 145 q 765 256 732 202 q 816 379 798 310 q 834 488 834 448 "},"ö":{"x_min":54.234375,"x_max":793.765625,"ha":848,"o":"m 793 367 q 694 87 793 188 q 420 -14 595 -14 q 151 87 249 -14 q 54 367 54 189 q 151 645 54 544 q 425 747 249 747 q 699 648 604 747 q 793 367 793 550 m 594 367 q 551 557 594 498 q 427 616 509 616 q 254 367 254 616 q 296 180 254 244 q 418 116 338 116 q 594 367 594 116 m 497 813 l 497 962 l 645 962 l 645 813 l 497 813 m 203 813 l 203 962 l 348 962 l 348 813 l 203 813 "},"i":{"x_min":97.015625,"x_max":287.59375,"ha":386,"o":"m 97 865 l 97 1006 l 287 1006 l 287 865 l 97 865 m 97 0 l 97 734 l 287 734 l 287 0 l 97 0 "},"Õ":{"x_min":56.953125,"x_max":1021.6875,"ha":1080,"o":"m 1021 482 q 962 219 1021 332 q 793 46 903 106 q 537 -14 684 -14 q 184 118 312 -14 q 56 482 56 251 q 184 841 56 712 q 538 970 311 970 q 893 839 766 970 q 1021 482 1021 709 m 817 482 q 744 724 817 636 q 538 812 671 812 q 331 725 404 812 q 258 482 258 638 q 333 233 258 324 q 537 143 408 143 q 744 231 671 143 q 817 482 817 319 m 647 1038 q 587 1050 617 1038 q 529 1079 557 1063 q 475 1108 500 1095 q 429 1121 449 1121 q 386 1106 401 1121 q 362 1038 372 1090 l 270 1038 q 292 1153 275 1114 q 339 1214 308 1191 q 422 1237 371 1237 q 483 1224 453 1237 q 542 1195 514 1211 q 595 1166 571 1179 q 640 1153 620 1153 q 682 1169 667 1153 q 707 1237 697 1186 l 799 1237 q 755 1084 794 1130 q 647 1038 717 1038 "},"þ":{"x_min":96.9375,"x_max":791.0625,"ha":848,"o":"m 96 1006 l 287 1006 l 287 692 l 284 579 l 287 579 q 522 714 351 714 q 721 618 651 714 q 791 352 791 523 q 717 82 791 178 q 509 -14 644 -14 q 375 19 432 -14 q 287 116 318 53 l 283 116 q 287 -7 287 95 l 287 -288 l 96 -288 l 96 1006 m 592 352 q 554 525 592 469 q 441 581 517 581 q 324 519 364 581 q 284 346 284 457 q 325 176 284 236 q 439 116 365 116 q 592 352 592 116 "},"]":{"x_min":16.96875,"x_max":384.921875,"ha":463,"o":"m 16 -288 l 16 -158 l 205 -158 l 205 877 l 16 877 l 16 1006 l 384 1006 l 384 -288 l 16 -288 "},"m":{"x_min":91.5625,"x_max":1148.875,"ha":1235,"o":"m 529 0 l 529 411 q 417 604 529 604 q 323 545 360 604 q 287 393 287 486 l 287 0 l 96 0 l 96 569 q 95 666 96 628 q 91 734 93 704 l 273 734 q 278 665 275 721 q 282 587 282 609 l 284 587 q 372 710 320 672 q 498 748 425 748 q 702 587 666 748 l 706 587 q 796 710 743 673 q 929 748 848 748 q 1092 675 1036 748 q 1148 465 1148 602 l 1148 0 l 959 0 l 959 411 q 848 604 959 604 q 757 550 792 604 q 718 402 721 497 l 718 0 l 529 0 "},"8":{"x_min":44.109375,"x_max":730.25,"ha":773,"o":"m 730 268 q 641 60 730 134 q 387 -14 552 -14 q 134 59 223 -14 q 44 267 44 133 q 97 421 44 359 q 238 499 149 484 l 238 502 q 114 578 161 519 q 66 716 66 638 q 149 902 66 834 q 384 970 232 970 q 623 903 540 970 q 706 715 706 837 q 659 578 706 637 q 532 503 612 519 l 532 500 q 677 425 625 485 q 730 268 730 364 m 510 705 q 479 804 510 773 q 384 836 447 836 q 261 705 261 836 q 386 568 261 568 q 479 599 448 568 q 510 705 510 631 m 532 284 q 383 434 532 434 q 277 395 314 434 q 240 281 240 355 q 276 158 240 197 q 388 120 313 120 q 497 158 462 120 q 532 284 532 197 "},"R":{"x_min":92.90625,"x_max":974.515625,"ha":1003,"o":"m 749 0 l 527 363 l 292 363 l 292 0 l 92 0 l 92 956 l 570 956 q 834 882 741 956 q 927 671 927 808 q 870 497 927 570 q 716 401 813 424 l 974 0 l 749 0 m 725 662 q 549 800 725 800 l 292 800 l 292 518 l 554 518 q 682 556 638 518 q 725 662 725 594 "},"á":{"x_min":35.71875,"x_max":776.75,"ha":773,"o":"m 261 -14 q 95 44 155 -14 q 35 207 35 102 q 110 380 35 321 q 325 442 184 440 l 483 444 l 483 481 q 458 588 483 553 q 376 623 433 623 q 298 599 323 623 q 267 519 273 575 l 68 529 q 167 691 87 636 q 384 747 246 747 q 599 678 523 747 q 674 483 674 609 l 674 216 q 688 131 674 154 q 734 108 702 108 q 776 112 756 108 l 776 9 q 746 1 759 4 q 719 -3 732 -1 q 690 -7 705 -5 q 654 -8 675 -8 q 548 26 582 -8 q 507 130 514 61 l 503 130 q 261 -14 423 -14 m 483 339 l 385 338 q 291 323 319 335 q 249 287 263 311 q 234 222 234 262 q 258 144 234 169 q 322 118 282 118 q 404 143 367 118 q 462 210 441 167 q 483 302 483 254 l 483 339 m 255 802 l 255 822 l 425 1018 l 600 1018 l 600 988 l 370 802 l 255 802 "},"×":{"x_min":58.25,"x_max":752.75,"ha":811,"o":"m 58 220 l 299 463 l 60 702 l 168 808 l 406 570 l 645 809 l 752 702 l 514 462 l 752 224 l 645 116 l 406 356 l 165 113 l 58 220 "},"o":{"x_min":54.234375,"x_max":793.765625,"ha":848,"o":"m 793 367 q 694 87 793 188 q 420 -14 595 -14 q 151 87 249 -14 q 54 367 54 189 q 151 645 54 544 q 425 747 249 747 q 699 648 604 747 q 793 367 793 550 m 594 367 q 551 557 594 498 q 427 616 509 616 q 254 367 254 616 q 296 180 254 244 q 418 116 338 116 q 594 367 594 116 "},"5":{"x_min":42.75,"x_max":734.3125,"ha":773,"o":"m 734 318 q 639 76 734 166 q 380 -14 544 -14 q 149 50 236 -14 q 42 238 63 115 l 233 254 q 286 165 248 192 q 382 137 324 137 q 495 182 453 137 q 538 314 538 228 q 498 434 538 389 q 386 480 458 480 q 256 418 306 480 l 70 418 l 103 956 l 678 956 l 678 814 l 276 814 l 261 572 q 434 634 330 634 q 652 549 570 634 q 734 318 734 464 "},"õ":{"x_min":54.234375,"x_max":793.765625,"ha":848,"o":"m 793 367 q 694 87 793 188 q 420 -14 595 -14 q 151 87 249 -14 q 54 367 54 189 q 151 645 54 544 q 425 747 249 747 q 699 648 604 747 q 793 367 793 550 m 594 367 q 551 557 594 498 q 427 616 509 616 q 254 367 254 616 q 296 180 254 244 q 418 116 338 116 q 594 367 594 116 m 537 802 q 477 814 507 802 q 418 843 447 827 q 364 872 390 859 q 318 885 339 885 q 276 870 291 885 q 252 802 261 854 l 159 802 q 181 917 164 878 q 229 978 198 955 q 312 1001 260 1001 q 373 988 342 1001 q 432 959 403 975 q 485 930 460 943 q 529 917 510 917 q 572 933 556 917 q 596 1001 587 950 l 688 1001 q 645 848 683 894 q 537 802 607 802 "},"7":{"x_min":59.71875,"x_max":711.921875,"ha":773,"o":"m 711 804 q 590 607 647 702 q 489 414 532 511 q 422 216 447 318 q 397 0 397 114 l 198 0 q 230 231 198 119 q 320 458 261 342 q 534 799 379 574 l 59 799 l 59 956 l 711 956 l 711 804 "},"K":{"x_min":92.90625,"x_max":990.109375,"ha":1003,"o":"m 754 0 l 410 438 l 292 348 l 292 0 l 92 0 l 92 956 l 292 956 l 292 522 l 723 956 l 956 956 l 548 551 l 990 0 l 754 0 "},",":{"x_min":94.296875,"x_max":293.03125,"ha":386,"o":"m 293 44 q 275 -98 293 -36 q 219 -215 258 -161 l 94 -215 q 159 -109 134 -166 q 184 0 184 -51 l 97 0 l 97 207 l 293 207 l 293 44 "},"d":{"x_min":56.9375,"x_max":756.484375,"ha":848,"o":"m 572 0 q 565 51 569 10 q 561 118 561 91 l 559 118 q 324 -14 497 -14 q 126 86 196 -14 q 56 365 56 186 q 130 647 56 548 q 338 747 204 747 q 473 714 416 747 q 560 617 529 681 l 561 617 l 560 738 l 560 1006 l 751 1006 l 751 159 q 756 0 751 92 l 572 0 m 563 370 q 523 553 563 489 q 406 617 483 617 q 292 555 330 617 q 255 365 255 493 q 405 116 255 116 q 521 182 480 116 q 563 370 563 248 "},"¨":{"x_min":11,"x_max":453,"ha":463,"o":"m 305 813 l 305 962 l 453 962 l 453 813 l 305 813 m 11 813 l 11 962 l 156 962 l 156 813 l 11 813 "},"Ô":{"x_min":56.953125,"x_max":1021.6875,"ha":1080,"o":"m 1021 482 q 962 219 1021 332 q 793 46 903 106 q 537 -14 684 -14 q 184 118 312 -14 q 56 482 56 251 q 184 841 56 712 q 538 970 311 970 q 893 839 766 970 q 1021 482 1021 709 m 817 482 q 744 724 817 636 q 538 812 671 812 q 331 725 404 812 q 258 482 258 638 q 333 233 258 324 q 537 143 408 143 q 744 231 671 143 q 817 482 817 319 m 789 1057 l 789 1038 l 681 1038 l 543 1140 l 540 1140 l 397 1038 l 289 1038 l 289 1057 l 464 1245 l 619 1245 l 789 1057 "},"E":{"x_min":92.875,"x_max":871.765625,"ha":926,"o":"m 92 0 l 92 956 l 843 956 l 843 801 l 292 801 l 292 561 l 802 561 l 802 406 l 292 406 l 292 154 l 871 154 l 871 0 l 92 0 "},"Y":{"x_min":23.515625,"x_max":903.859375,"ha":926,"o":"m 563 392 l 563 0 l 363 0 l 363 392 l 23 956 l 233 956 l 462 551 l 694 956 l 903 956 l 563 392 "},"\"":{"x_min":91.625,"x_max":567.25,"ha":659,"o":"m 547 609 l 399 609 l 380 956 l 567 956 l 547 609 m 258 609 l 109 609 l 91 956 l 276 956 l 258 609 "},"‹":{"x_min":62.453125,"x_max":399.1875,"ha":463,"o":"m 237 95 l 62 340 l 62 388 l 237 637 l 397 637 l 397 612 l 225 364 l 399 119 l 399 95 l 237 95 "},"ê":{"x_min":54.296875,"x_max":725.5,"ha":773,"o":"m 397 -14 q 143 84 232 -14 q 54 369 54 182 q 144 649 54 551 q 400 747 234 747 q 642 642 558 747 q 725 335 725 537 l 725 329 l 254 329 q 294 168 254 222 q 407 113 333 113 q 534 201 508 113 l 714 185 q 397 -14 636 -14 m 397 626 q 294 580 330 626 q 255 449 257 533 l 541 449 q 498 582 535 537 q 397 626 460 626 m 651 821 l 651 802 l 544 802 l 406 932 l 403 932 l 260 802 l 152 802 l 152 821 l 326 1037 l 482 1037 l 651 821 "},"Ï":{"x_min":-28,"x_max":414,"ha":386,"o":"m 92 0 l 92 956 l 293 956 l 293 0 l 92 0 m 280 1038 l 280 1187 l 414 1187 l 414 1038 l 280 1038 m -28 1038 l -28 1187 l 103 1187 l 103 1038 l -28 1038 "},"„":{"x_min":102.484375,"x_max":591.6875,"ha":695,"o":"m 591 44 q 574 -99 591 -36 q 517 -215 556 -162 l 392 -215 q 458 -109 432 -166 q 483 0 483 -51 l 397 0 l 397 176 l 591 176 l 591 44 m 299 44 q 282 -100 299 -39 q 225 -215 265 -160 l 102 -215 q 167 -105 144 -162 q 191 0 191 -48 l 105 0 l 105 176 l 299 176 l 299 44 "},"Â":{"x_min":34.59375,"x_max":966.375,"ha":1003,"o":"m 768 0 l 683 244 l 319 244 l 234 0 l 34 0 l 383 956 l 619 956 l 966 0 l 768 0 m 501 808 l 497 793 q 480 738 490 769 q 364 395 471 707 l 638 395 l 544 669 l 515 761 l 501 808 m 751 1057 l 751 1038 l 643 1038 l 505 1140 l 502 1140 l 359 1038 l 251 1038 l 251 1057 l 426 1245 l 581 1245 l 751 1057 "},"Í":{"x_min":70,"x_max":415.90625,"ha":386,"o":"m 92 0 l 92 956 l 293 956 l 293 0 l 92 0 m 70 1038 l 70 1059 l 240 1231 l 415 1231 l 415 1201 l 185 1038 l 70 1038 "},"´":{"x_min":59.0625,"x_max":404.96875,"ha":463,"o":"m 59 802 l 59 822 l 229 1018 l 404 1018 l 404 988 l 174 802 l 59 802 "},"ì":{"x_min":-43.1875,"x_max":302.359375,"ha":386,"o":"m 98 0 l 98 734 l 288 734 l 288 0 l 98 0 m 187 802 l -43 988 l -43 1018 l 131 1018 l 302 822 l 302 802 l 187 802 "},"±":{"x_min":33.109375,"x_max":729.640625,"ha":762,"o":"m 457 479 l 457 248 l 305 248 l 305 479 l 33 479 l 33 631 l 305 631 l 305 861 l 457 861 l 457 631 l 729 631 l 729 479 l 457 479 m 33 0 l 33 151 l 729 151 l 729 0 l 33 0 "},"Ú":{"x_min":83.40625,"x_max":918.234375,"ha":1003,"o":"m 490 -14 q 188 82 292 -14 q 83 357 83 178 l 83 956 l 283 956 l 283 373 q 337 201 283 260 q 495 142 391 142 q 660 204 602 142 q 718 380 718 265 l 718 956 l 918 956 l 918 368 q 806 86 918 186 q 490 -14 693 -14 m 401 1038 l 401 1059 l 571 1231 l 746 1231 l 746 1201 l 516 1038 l 401 1038 "},"|":{"x_min":105.90625,"x_max":283.609375,"ha":389,"o":"m 105 -309 l 105 1006 l 283 1006 l 283 -309 l 105 -309 "},"§":{"x_min":35.96875,"x_max":716.671875,"ha":773,"o":"m 390 968 q 601 920 521 968 q 699 781 681 872 l 537 765 q 490 829 528 807 q 390 852 451 852 q 278 832 314 852 q 242 768 242 812 q 261 721 242 740 q 313 687 279 702 q 435 653 346 673 q 604 599 549 627 q 687 530 658 571 q 716 430 716 489 q 679 318 716 367 q 582 251 642 270 q 705 78 705 198 q 620 -94 705 -34 q 377 -155 535 -155 q 144 -107 226 -155 q 35 39 62 -60 l 196 65 q 252 -14 210 10 q 377 -39 293 -39 q 502 -17 460 -39 q 545 58 545 4 q 529 111 545 91 q 478 147 513 131 q 317 192 443 162 q 119 278 177 225 q 61 407 61 331 q 99 513 61 470 q 206 580 136 557 q 111 652 145 606 q 78 755 78 698 q 158 912 78 856 q 390 968 238 968 m 555 407 q 514 481 555 455 q 357 529 474 506 q 225 425 225 513 q 244 379 225 397 q 296 346 262 360 q 422 310 330 331 q 555 407 555 317 "},"Ý":{"x_min":23.515625,"x_max":903.859375,"ha":926,"o":"m 563 392 l 563 0 l 363 0 l 363 392 l 23 956 l 233 956 l 462 551 l 694 956 l 903 956 l 563 392 m 355 1038 l 355 1059 l 525 1231 l 700 1231 l 700 1201 l 470 1038 l 355 1038 "},"b":{"x_min":91.515625,"x_max":791.0625,"ha":848,"o":"m 791 369 q 718 86 791 187 q 509 -14 645 -14 q 374 19 431 -14 q 287 117 318 53 l 286 117 q 283 52 286 93 q 276 0 280 11 l 91 0 q 96 167 96 63 l 96 1006 l 287 1006 l 287 725 l 284 605 l 287 605 q 522 747 351 747 q 721 648 652 747 q 791 369 791 549 m 592 369 q 555 554 592 494 q 442 614 519 614 q 325 549 365 614 q 284 363 284 485 q 324 181 284 246 q 441 116 364 116 q 592 369 592 116 "},"q":{"x_min":56.9375,"x_max":755.140625,"ha":848,"o":"m 56 365 q 131 647 56 547 q 340 748 205 748 q 561 615 500 748 q 565 685 561 647 q 572 734 569 723 l 755 734 q 751 565 751 660 l 751 -288 l 561 -288 l 561 16 l 565 121 l 563 121 q 324 -14 500 -14 q 126 86 196 -14 q 56 365 56 186 m 563 370 q 523 552 563 487 q 408 617 484 617 q 255 365 255 617 q 406 116 255 116 q 522 182 481 116 q 563 370 563 248 "},"Ö":{"x_min":56.953125,"x_max":1021.6875,"ha":1080,"o":"m 1021 482 q 962 219 1021 332 q 793 46 903 106 q 537 -14 684 -14 q 184 118 312 -14 q 56 482 56 251 q 184 841 56 712 q 538 970 311 970 q 893 839 766 970 q 1021 482 1021 709 m 817 482 q 744 724 817 636 q 538 812 671 812 q 331 725 404 812 q 258 482 258 638 q 333 233 258 324 q 537 143 408 143 q 744 231 671 143 q 817 482 817 319 m 626 1038 l 626 1187 l 760 1187 l 760 1038 l 626 1038 m 318 1038 l 318 1187 l 449 1187 l 449 1038 l 318 1038 "},"z":{"x_min":55.65625,"x_max":644.78125,"ha":695,"o":"m 55 0 l 55 134 l 401 596 l 83 596 l 83 734 l 611 734 l 611 597 l 267 139 l 644 139 l 644 0 l 55 0 "},"ã":{"x_min":35.71875,"x_max":776.75,"ha":773,"o":"m 261 -14 q 95 44 155 -14 q 35 207 35 102 q 110 380 35 321 q 325 442 184 440 l 483 444 l 483 481 q 458 588 483 553 q 376 623 433 623 q 298 599 323 623 q 267 519 273 575 l 68 529 q 167 691 87 636 q 384 747 246 747 q 599 678 523 747 q 674 483 674 609 l 674 216 q 688 131 674 154 q 734 108 702 108 q 776 112 756 108 l 776 9 q 746 1 759 4 q 719 -3 732 -1 q 690 -7 705 -5 q 654 -8 675 -8 q 548 26 582 -8 q 507 130 514 61 l 503 130 q 261 -14 423 -14 m 483 339 l 385 338 q 291 323 319 335 q 249 287 263 311 q 234 222 234 262 q 258 144 234 169 q 322 118 282 118 q 404 143 367 118 q 462 210 441 167 q 483 302 483 254 l 483 339 m 488 802 q 428 814 458 802 q 369 843 398 827 q 315 872 341 859 q 269 885 290 885 q 227 870 242 885 q 203 802 212 854 l 110 802 q 132 917 115 878 q 180 978 149 955 q 263 1001 211 1001 q 324 988 293 1001 q 383 959 354 975 q 436 930 411 943 q 480 917 461 917 q 523 933 507 917 q 547 1001 538 950 l 639 1001 q 596 848 634 894 q 488 802 558 802 "},"æ":{"x_min":44.765625,"x_max":1177.359375,"ha":1235,"o":"m 849 -14 q 555 141 639 -14 q 275 -14 465 -14 q 105 44 166 -14 q 44 207 44 102 q 120 379 44 319 q 343 442 195 438 l 505 444 l 505 481 q 478 589 505 555 q 392 623 451 623 q 308 598 334 623 q 276 520 282 573 l 78 529 q 176 691 95 635 q 397 747 256 747 q 623 674 544 747 q 852 747 711 747 q 1093 642 1010 747 q 1177 335 1177 537 l 1177 322 l 706 322 q 746 168 706 223 q 859 113 786 113 q 986 201 960 113 l 1166 185 q 849 -14 1088 -14 m 336 118 q 422 145 383 118 q 483 216 461 171 q 505 309 505 260 l 505 339 l 402 338 q 303 323 332 335 q 258 287 274 311 q 243 222 243 262 q 268 144 243 169 q 336 118 294 118 m 849 626 q 746 580 782 626 q 708 449 710 533 l 992 449 q 950 582 987 537 q 849 626 912 626 "},"®":{"x_min":21.6875,"x_max":1001.984375,"ha":1023,"o":"m 1001 479 q 936 234 1001 348 q 756 54 871 119 q 511 -11 642 -11 q 263 57 378 -11 q 85 238 148 125 q 21 479 21 351 q 87 724 21 610 q 267 904 153 838 q 511 970 381 970 q 757 903 643 970 q 936 724 871 837 q 1001 479 1001 611 m 926 479 q 870 685 926 590 q 718 836 814 780 q 511 892 622 892 q 310 839 405 892 q 157 690 215 786 q 99 479 99 594 q 154 272 99 368 q 305 120 210 176 q 511 64 400 64 q 719 120 623 64 q 870 272 815 176 q 926 479 926 368 m 625 201 l 505 413 l 425 413 l 425 201 l 305 201 l 305 754 l 528 754 q 684 710 632 754 q 735 589 735 666 q 703 486 735 526 q 617 429 670 446 l 762 201 l 625 201 m 613 588 q 588 647 613 627 q 515 667 562 667 l 425 667 l 425 501 l 523 501 q 590 525 568 501 q 613 588 613 549 "},"É":{"x_min":92.875,"x_max":871.765625,"ha":926,"o":"m 92 0 l 92 956 l 843 956 l 843 801 l 292 801 l 292 561 l 802 561 l 802 406 l 292 406 l 292 154 l 871 154 l 871 0 l 92 0 m 350 1038 l 350 1059 l 520 1231 l 695 1231 l 695 1201 l 465 1038 l 350 1038 "},"~":{"x_min":54.921875,"x_max":758.78125,"ha":811,"o":"m 577 350 q 477 364 526 350 q 377 396 428 378 q 227 428 286 428 q 139 413 179 428 q 54 368 99 398 l 54 512 q 238 569 131 569 q 402 537 309 569 q 526 498 492 506 q 590 490 560 490 q 758 552 681 490 l 758 404 q 675 362 715 374 q 577 350 636 350 "},"³":{"x_min":29.875,"x_max":433.125,"ha":463,"o":"m 433 607 q 382 502 433 540 q 237 464 331 464 q 92 499 145 464 q 29 604 38 534 l 158 613 q 235 550 164 550 q 304 615 304 550 q 210 678 304 678 l 172 678 l 172 764 l 207 764 q 271 779 249 764 q 293 824 293 795 q 277 866 293 851 q 232 880 262 880 q 166 821 173 880 l 40 829 q 99 929 47 892 q 236 967 151 967 q 371 932 323 967 q 420 839 420 897 q 395 765 420 796 q 317 723 370 734 l 317 722 q 403 685 373 716 q 433 607 433 654 "},"¡":{"x_min":131.71875,"x_max":331.109375,"ha":463,"o":"m 135 551 l 135 734 l 331 734 l 331 551 l 135 551 m 131 -222 l 153 444 l 309 444 l 331 -222 l 131 -222 "},"[":{"x_min":78.078125,"x_max":446.03125,"ha":463,"o":"m 78 -288 l 78 1006 l 446 1006 l 446 877 l 258 877 l 258 -158 l 446 -158 l 446 -288 l 78 -288 "},"L":{"x_min":92.859375,"x_max":805.296875,"ha":848,"o":"m 92 0 l 92 956 l 292 956 l 292 154 l 805 154 l 805 0 l 92 0 "}," ":{"x_min":0,"x_max":0,"ha":386},"%":{"x_min":34.59375,"x_max":1198.375,"ha":1235,"o":"m 1198 292 q 1137 66 1198 144 q 958 -11 1076 -11 q 778 66 838 -11 q 718 292 718 143 q 776 520 718 444 q 961 597 834 597 q 1140 520 1083 597 q 1198 292 1198 443 m 374 0 l 234 0 l 858 956 l 1000 956 l 374 0 m 276 966 q 456 889 398 966 q 515 662 515 812 q 454 436 515 514 q 273 358 392 358 q 94 435 155 358 q 34 662 34 513 q 92 891 34 816 q 276 966 151 966 m 1052 292 q 1031 446 1052 400 q 961 492 1011 492 q 886 445 906 492 q 865 292 865 399 q 887 139 865 184 q 959 95 908 95 q 1030 141 1009 95 q 1052 292 1052 187 m 368 662 q 347 814 368 768 q 276 860 326 860 q 201 815 222 860 q 180 662 180 769 q 202 509 180 555 q 275 463 224 463 q 346 509 325 463 q 368 662 368 555 "},"P":{"x_min":92.875,"x_max":878.546875,"ha":926,"o":"m 878 653 q 836 488 878 561 q 716 376 794 416 q 530 337 637 337 l 292 337 l 292 0 l 92 0 l 92 956 l 521 956 q 786 877 693 956 q 878 653 878 798 m 677 650 q 499 800 677 800 l 292 800 l 292 490 l 505 490 q 632 531 587 490 q 677 650 677 572 "},"À":{"x_min":34.59375,"x_max":966.375,"ha":1003,"o":"m 768 0 l 683 244 l 319 244 l 234 0 l 34 0 l 383 956 l 619 956 l 966 0 l 768 0 m 501 808 l 497 793 q 480 738 490 769 q 364 395 471 707 l 638 395 l 544 669 l 515 761 l 501 808 m 522 1038 l 292 1201 l 292 1231 l 466 1231 l 637 1059 l 637 1038 l 522 1038 "},"_":{"x_min":-13.5625,"x_max":785.203125,"ha":773,"o":"m -13 -169 l -13 -117 l 785 -117 l 785 -169 l -13 -169 "},"ñ":{"x_min":91.515625,"x_max":761.90625,"ha":848,"o":"m 572 0 l 572 411 q 441 604 572 604 q 329 545 372 604 q 287 393 287 486 l 287 0 l 96 0 l 96 569 q 95 666 96 628 q 91 734 93 704 l 273 734 q 278 665 275 721 q 282 587 282 609 l 284 587 q 381 710 323 672 q 520 748 440 748 q 699 676 637 748 q 761 465 761 604 l 761 0 l 572 0 m 548 802 q 488 814 518 802 q 429 843 458 827 q 375 872 401 859 q 329 885 350 885 q 287 870 302 885 q 263 802 272 854 l 170 802 q 192 917 175 878 q 240 978 209 955 q 323 1001 271 1001 q 384 988 353 1001 q 443 959 414 975 q 496 930 471 943 q 540 917 521 917 q 583 933 567 917 q 607 1001 598 950 l 699 1001 q 656 848 694 894 q 548 802 618 802 "},"+":{"x_min":58.265625,"x_max":754.796875,"ha":811,"o":"m 482 386 l 482 109 l 328 109 l 328 386 l 58 386 l 58 538 l 328 538 l 328 814 l 482 814 l 482 538 l 754 538 l 754 386 l 482 386 "},"‚":{"x_min":93.625,"x_max":292.34375,"ha":386,"o":"m 292 44 q 275 -99 292 -36 q 219 -215 257 -161 l 93 -215 q 160 -106 136 -163 q 184 0 184 -49 l 97 0 l 97 176 l 292 176 l 292 44 "},"½":{"x_min":63.75,"x_max":1093.296875,"ha":1158,"o":"m 355 0 l 219 0 l 826 955 l 962 955 l 355 0 m 63 470 l 63 552 l 188 552 l 188 870 l 71 796 l 71 879 l 193 959 l 311 959 l 311 552 l 427 552 l 427 470 l 63 470 m 695 0 l 694 81 q 750 158 714 122 q 847 233 786 193 q 928 296 906 271 q 950 347 950 321 q 895 409 950 409 q 830 343 837 409 l 699 346 q 759 454 708 413 q 895 495 811 495 q 1034 458 984 495 q 1084 353 1084 420 q 980 202 1084 268 q 884 136 910 157 q 847 92 858 115 l 1093 92 l 1093 0 l 695 0 "},"Æ":{"x_min":3,"x_max":1334.75,"ha":1389,"o":"m 631 0 l 631 244 l 326 244 l 209 0 l 3 0 l 477 956 l 1306 956 l 1306 802 l 831 802 l 831 561 l 1264 561 l 1264 411 l 831 411 l 831 153 l 1334 153 l 1334 0 l 631 0 m 631 808 l 590 808 q 395 395 557 733 l 631 395 l 631 808 "},"Ë":{"x_min":92.875,"x_max":871.765625,"ha":926,"o":"m 92 0 l 92 956 l 843 956 l 843 801 l 292 801 l 292 561 l 802 561 l 802 406 l 292 406 l 292 154 l 871 154 l 871 0 l 92 0 m 570 1038 l 570 1187 l 704 1187 l 704 1038 l 570 1038 m 262 1038 l 262 1187 l 393 1187 l 393 1038 l 262 1038 "},"'":{"x_min":73.859375,"x_max":258.34375,"ha":330,"o":"m 240 609 l 91 609 l 73 956 l 258 956 l 240 609 "},"ª":{"x_min":30.515625,"x_max":514.015625,"ha":514,"o":"m 174 492 q 69 527 108 492 q 30 628 30 563 q 223 771 30 768 l 322 773 l 322 801 q 252 881 322 881 q 176 818 183 881 l 47 824 q 112 926 59 890 q 251 962 166 962 q 395 920 345 962 q 446 802 446 879 l 446 642 q 452 593 446 609 q 480 576 458 576 l 514 580 l 514 506 q 433 494 469 494 q 357 518 385 494 q 326 584 330 543 l 324 584 q 174 492 276 492 m 222 580 q 293 613 263 580 q 322 689 322 645 l 322 707 l 260 706 q 179 688 200 704 q 158 638 158 672 q 222 580 158 580 "},"ð":{"x_min":54.234375,"x_max":793.765625,"ha":848,"o":"m 580 858 q 793 367 793 641 l 793 364 q 695 87 793 187 q 422 -12 597 -12 q 153 78 252 -12 q 54 325 54 168 q 152 571 54 482 q 424 660 250 660 q 535 638 496 660 q 433 797 492 730 l 235 715 l 235 839 l 348 886 q 173 1006 288 934 l 372 1006 q 480 942 437 973 l 662 1019 l 662 891 l 580 858 m 594 323 q 551 480 594 432 q 427 529 509 529 q 254 323 254 529 q 296 170 254 223 q 418 116 338 116 q 548 165 503 116 q 594 323 594 214 "},"T":{"x_min":15.59375,"x_max":833.09375,"ha":848,"o":"m 524 801 l 524 0 l 324 0 l 324 801 l 15 801 l 15 956 l 833 956 l 833 801 l 524 801 "},"Þ":{"x_min":92.875,"x_max":878.546875,"ha":926,"o":"m 878 500 q 837 339 878 409 q 717 230 796 269 q 530 192 638 192 l 292 192 l 292 0 l 92 0 l 92 956 l 292 956 l 292 798 l 522 798 q 786 721 694 798 q 878 500 878 644 m 677 497 q 632 614 677 572 q 499 656 588 656 l 292 656 l 292 334 l 505 334 q 632 377 587 334 q 677 497 677 420 "},"j":{"x_min":-21.6875,"x_max":288.265625,"ha":386,"o":"m 97 865 l 97 1006 l 288 1006 l 288 865 l 97 865 m 93 -288 q -21 -281 25 -288 l -21 -147 l 12 -150 q 79 -128 61 -150 q 97 -40 97 -107 l 97 734 l 288 734 l 288 -86 q 239 -235 288 -183 q 93 -288 189 -288 "},"1":{"x_min":87.703125,"x_max":734.0625,"ha":773,"o":"m 87 0 l 87 141 l 324 141 l 324 793 l 95 651 l 95 800 l 334 956 l 514 956 l 514 141 l 734 141 l 734 0 l 87 0 "},"›":{"x_min":63.140625,"x_max":399.859375,"ha":463,"o":"m 63 95 l 63 119 l 237 364 l 64 612 l 64 637 l 225 637 l 399 388 l 399 340 l 225 95 l 63 95 "},"ı":{"x_min":98.359375,"x_max":288.9375,"ha":386,"o":"m 98 0 l 98 734 l 288 734 l 288 0 l 98 0 "},"ä":{"x_min":35.71875,"x_max":776.75,"ha":773,"o":"m 261 -14 q 95 44 155 -14 q 35 207 35 102 q 110 380 35 321 q 325 442 184 440 l 483 444 l 483 481 q 458 588 483 553 q 376 623 433 623 q 298 599 323 623 q 267 519 273 575 l 68 529 q 167 691 87 636 q 384 747 246 747 q 599 678 523 747 q 674 483 674 609 l 674 216 q 688 131 674 154 q 734 108 702 108 q 776 112 756 108 l 776 9 q 746 1 759 4 q 719 -3 732 -1 q 690 -7 705 -5 q 654 -8 675 -8 q 548 26 582 -8 q 507 130 514 61 l 503 130 q 261 -14 423 -14 m 483 339 l 385 338 q 291 323 319 335 q 249 287 263 311 q 234 222 234 262 q 258 144 234 169 q 322 118 282 118 q 404 143 367 118 q 462 210 441 167 q 483 302 483 254 l 483 339 m 452 813 l 452 962 l 600 962 l 600 813 l 452 813 m 158 813 l 158 962 l 303 962 l 303 813 l 158 813 "},"<":{"x_min":58.3125,"x_max":754.71875,"ha":811,"o":"m 58 350 l 58 568 l 754 834 l 754 679 l 189 459 l 754 238 l 754 85 l 58 350 "},"£":{"x_min":14.265625,"x_max":758.75,"ha":773,"o":"m 758 246 q 666 64 737 129 q 492 0 595 0 l 21 0 l 21 139 q 116 227 90 178 q 141 347 141 276 l 141 409 l 14 409 l 14 525 l 135 525 l 135 693 q 207 899 135 829 q 424 970 280 970 q 604 923 538 970 q 700 772 670 876 l 542 741 q 500 816 528 793 q 427 840 472 840 q 338 801 365 840 q 311 677 311 762 l 311 525 l 505 525 l 505 409 l 311 409 l 311 348 q 283 229 311 278 q 187 141 255 179 l 445 141 q 552 175 516 141 q 600 273 589 209 l 758 246 "},"¹":{"x_min":55.78125,"x_max":419.3125,"ha":463,"o":"m 55 471 l 55 553 l 180 553 l 180 870 l 63 797 l 63 879 l 185 959 l 304 959 l 304 553 l 419 553 l 419 471 l 55 471 "},"t":{"x_min":17.0625,"x_max":445.703125,"ha":463,"o":"m 284 -12 q 155 33 200 -12 q 109 172 109 79 l 109 605 l 17 605 l 17 734 l 119 734 l 179 906 l 298 906 l 298 734 l 437 734 l 437 605 l 298 605 l 298 224 q 318 145 298 170 q 381 119 339 119 q 445 129 404 119 l 445 11 q 284 -12 375 -12 "},"¬":{"x_min":56.953125,"x_max":753.359375,"ha":811,"o":"m 601 96 l 601 386 l 56 386 l 56 538 l 753 538 l 753 96 l 601 96 "},"ù":{"x_min":86.09375,"x_max":756.484375,"ha":848,"o":"m 276 734 l 276 321 q 406 128 276 128 q 518 187 475 128 q 560 340 560 247 l 560 734 l 751 734 l 751 164 q 756 0 751 70 l 574 0 q 566 145 566 97 l 563 145 q 466 23 525 61 q 327 -14 408 -14 q 148 57 210 -14 q 86 267 86 129 l 86 734 l 276 734 m 422 802 l 191 988 l 191 1018 l 366 1018 l 537 822 l 537 802 l 422 802 "},"W":{"x_min":1.359375,"x_max":1309.640625,"ha":1311,"o":"m 1062 0 l 825 0 l 695 552 q 655 757 672 650 q 629 621 639 668 q 484 0 619 575 l 247 0 l 1 956 l 204 956 l 342 338 l 373 189 q 410 369 392 283 q 545 956 428 455 l 769 956 l 890 447 q 938 189 904 390 l 955 268 l 991 424 l 1106 956 l 1309 956 l 1062 0 "},"ï":{"x_min":-27,"x_max":415,"ha":386,"o":"m 98 0 l 98 734 l 288 734 l 288 0 l 98 0 m 267 813 l 267 962 l 415 962 l 415 813 l 267 813 m -27 813 l -27 962 l 118 962 l 118 813 l -27 813 "},">":{"x_min":58.3125,"x_max":754.71875,"ha":811,"o":"m 58 85 l 58 238 l 622 459 l 58 679 l 58 834 l 754 568 l 754 350 l 58 85 "},"v":{"x_min":5.421875,"x_max":766.890625,"ha":773,"o":"m 496 0 l 268 0 l 5 734 l 206 734 l 335 323 q 383 153 345 289 q 411 251 390 181 q 567 734 432 321 l 766 734 l 496 0 "},"û":{"x_min":86.09375,"x_max":756.484375,"ha":848,"o":"m 276 734 l 276 321 q 406 128 276 128 q 518 187 475 128 q 560 340 560 247 l 560 734 l 751 734 l 751 164 q 756 0 751 70 l 574 0 q 566 145 566 97 l 563 145 q 466 23 525 61 q 327 -14 408 -14 q 148 57 210 -14 q 86 267 86 129 l 86 734 l 276 734 m 670 821 l 670 802 l 563 802 l 425 932 l 422 932 l 279 802 l 171 802 l 171 821 l 345 1037 l 501 1037 l 670 821 "},"Ò":{"x_min":56.953125,"x_max":1021.6875,"ha":1080,"o":"m 1021 482 q 962 219 1021 332 q 793 46 903 106 q 537 -14 684 -14 q 184 118 312 -14 q 56 482 56 251 q 184 841 56 712 q 538 970 311 970 q 893 839 766 970 q 1021 482 1021 709 m 817 482 q 744 724 817 636 q 538 812 671 812 q 331 725 404 812 q 258 482 258 638 q 333 233 258 324 q 537 143 408 143 q 744 231 671 143 q 817 482 817 319 m 601 1038 l 371 1201 l 371 1231 l 545 1231 l 716 1059 l 716 1038 l 601 1038 "},"&":{"x_min":61.03125,"x_max":959.59375,"ha":1003,"o":"m 61 260 q 115 423 61 352 q 290 551 170 495 q 240 740 240 652 q 306 903 240 846 q 495 961 372 961 q 675 906 609 961 q 741 759 741 852 q 715 665 741 707 q 640 587 689 623 q 476 496 592 551 q 641 268 543 378 q 748 515 712 375 l 890 467 q 759 182 844 309 q 880 133 817 133 q 959 144 924 133 l 959 6 q 870 -8 922 -8 q 753 12 812 -8 q 646 73 695 33 q 389 -14 531 -14 q 147 58 233 -14 q 61 260 61 130 m 589 758 q 564 821 589 796 q 494 845 538 845 q 414 816 442 845 q 387 739 387 787 q 423 608 387 680 q 525 659 495 638 q 573 704 556 680 q 589 758 589 728 m 534 166 q 349 422 421 291 q 233 263 233 367 q 277 155 233 196 q 397 114 321 114 q 477 131 441 114 q 534 166 512 147 "},"Ð":{"x_min":5.40625,"x_max":944.671875,"ha":1003,"o":"m 944 485 q 886 226 944 337 q 722 58 828 116 q 479 0 616 0 l 92 0 l 92 403 l 5 403 l 5 552 l 92 552 l 92 956 l 438 956 q 812 834 680 956 q 944 485 944 712 m 743 485 q 663 718 743 637 q 434 799 584 799 l 292 799 l 292 552 l 534 552 l 534 403 l 292 403 l 292 156 l 462 156 q 667 244 592 156 q 743 485 743 332 "},"I":{"x_min":92.9375,"x_max":293.015625,"ha":386,"o":"m 92 0 l 92 956 l 293 956 l 293 0 l 92 0 "},"G":{"x_min":56.953125,"x_max":993.890625,"ha":1080,"o":"m 546 142 q 697 165 624 142 q 810 223 770 188 l 810 356 l 577 356 l 577 504 l 993 504 l 993 152 q 796 30 917 74 q 541 -14 674 -14 q 182 115 307 -14 q 56 482 56 244 q 183 844 56 718 q 545 970 309 970 q 973 720 882 970 l 789 665 q 695 775 759 737 q 545 812 631 812 q 331 727 404 812 q 258 482 258 641 q 333 231 258 319 q 546 142 409 142 "},"`":{"x_min":44.8125,"x_max":390.359375,"ha":463,"o":"m 275 802 l 44 988 l 44 1018 l 219 1018 l 390 822 l 390 802 l 275 802 "},"·":{"x_min":95.71875,"x_max":291.046875,"ha":463,"o":"m 95 360 l 95 566 l 291 566 l 291 360 l 95 360 "},"r":{"x_min":91.640625,"x_max":519.953125,"ha":541,"o":"m 97 0 l 97 561 q 95 662 97 622 q 91 734 93 702 l 273 734 q 278 659 275 721 q 282 577 282 597 l 284 577 q 334 685 312 654 q 386 732 356 717 q 460 748 416 748 q 519 737 497 748 l 519 578 q 438 588 473 588 q 327 530 367 588 q 287 360 287 473 l 287 0 l 97 0 "},"¿":{"x_min":77.28125,"x_max":781.5625,"ha":848,"o":"m 77 38 q 106 156 77 103 q 216 265 136 208 l 269 303 q 337 370 314 336 q 361 445 359 404 l 543 445 q 503 321 538 375 q 401 220 468 266 q 299 131 328 169 q 269 46 269 93 q 308 -48 269 -13 q 418 -82 347 -82 q 533 -42 487 -82 q 588 63 580 -2 l 781 54 q 668 -159 763 -82 q 421 -236 573 -236 q 169 -163 260 -236 q 77 38 77 -90 m 548 734 l 548 551 l 352 551 l 352 734 l 548 734 "},"ý":{"x_min":10.859375,"x_max":765.53125,"ha":773,"o":"m 192 -288 q 71 -279 123 -288 l 71 -143 q 137 -148 107 -148 q 205 -136 178 -148 q 253 -93 232 -123 q 301 7 274 -63 l 10 734 l 212 734 l 327 389 q 396 163 354 315 l 413 227 l 457 387 l 566 734 l 765 734 l 475 -39 q 353 -233 416 -179 q 192 -288 291 -288 m 281 802 l 281 822 l 451 1018 l 626 1018 l 626 988 l 396 802 l 281 802 "},"x":{"x_min":9.5,"x_max":762.8125,"ha":773,"o":"m 555 0 l 384 265 l 212 0 l 9 0 l 278 379 l 22 734 l 228 734 l 384 493 l 540 734 l 747 734 l 492 381 l 762 0 l 555 0 "},"è":{"x_min":54.296875,"x_max":725.5,"ha":773,"o":"m 397 -14 q 143 84 232 -14 q 54 369 54 182 q 144 649 54 551 q 400 747 234 747 q 642 642 558 747 q 725 335 725 537 l 725 329 l 254 329 q 294 168 254 222 q 407 113 333 113 q 534 201 508 113 l 714 185 q 397 -14 636 -14 m 397 626 q 294 580 330 626 q 255 449 257 533 l 541 449 q 498 582 535 537 q 397 626 460 626 m 425 802 l 194 988 l 194 1018 l 369 1018 l 540 822 l 540 802 l 425 802 "},"º":{"x_min":30.5,"x_max":483.28125,"ha":507,"o":"m 483 727 q 422 554 483 617 q 254 492 361 492 q 90 554 151 492 q 30 727 30 616 q 90 899 30 837 q 256 962 149 962 q 424 901 365 962 q 483 727 483 841 m 347 727 q 327 832 347 799 q 258 865 307 865 q 186 831 208 865 q 164 727 164 798 q 186 621 164 655 q 253 586 208 586 q 325 621 304 586 q 347 727 347 655 "},"Ø":{"x_min":56.953125,"x_max":1022.375,"ha":1080,"o":"m 99 -49 l 204 97 q 56 482 56 231 q 184 841 56 712 q 538 970 311 970 q 778 919 673 970 l 834 999 l 965 999 l 869 861 q 983 700 945 797 q 1022 482 1022 604 q 963 219 1022 332 q 794 46 904 106 q 537 -14 685 -14 q 293 38 393 -14 l 231 -49 l 99 -49 m 818 482 q 759 704 818 619 l 393 180 q 537 142 454 142 q 745 231 672 142 q 818 482 818 319 m 258 482 q 315 256 258 342 l 680 778 q 538 812 618 812 q 331 725 404 812 q 258 482 258 638 "},"÷":{"x_min":33.09375,"x_max":729.625,"ha":762,"o":"m 299 651 l 299 810 l 461 810 l 461 651 l 299 651 m 33 386 l 33 538 l 729 538 l 729 386 l 33 386 m 299 115 l 299 273 l 461 273 l 461 115 l 299 115 "},"h":{"x_min":96.9375,"x_max":761.90625,"ha":848,"o":"m 284 586 q 381 709 323 671 q 520 747 440 747 q 699 675 637 747 q 761 465 761 603 l 761 0 l 572 0 l 572 410 q 441 603 572 603 q 329 544 372 603 q 287 392 287 485 l 287 0 l 96 0 l 96 1006 l 287 1006 l 287 731 q 282 586 287 657 l 284 586 "},".":{"x_min":94.296875,"x_max":290.3125,"ha":386,"o":"m 94 0 l 94 207 l 290 207 l 290 0 l 94 0 "},"f":{"x_min":23.875,"x_max":465.40625,"ha":463,"o":"m 320 605 l 320 0 l 131 0 l 131 605 l 23 605 l 23 734 l 131 734 l 131 810 q 183 957 131 909 q 344 1006 236 1006 q 465 995 398 1006 l 465 872 q 409 878 437 878 q 340 859 360 878 q 320 791 320 840 l 320 734 l 465 734 l 465 605 l 320 605 "},"“":{"x_min":102.484375,"x_max":591.6875,"ha":695,"o":"m 392 564 l 392 696 q 411 842 392 780 q 468 956 429 903 l 591 956 q 526 846 549 903 q 502 741 502 789 l 588 741 l 588 564 l 392 564 m 102 564 l 102 696 q 120 841 102 778 q 175 956 137 903 l 299 956 q 234 846 257 903 q 211 741 211 789 l 297 741 l 297 564 l 102 564 "},"6":{"x_min":50.90625,"x_max":722.78125,"ha":773,"o":"m 722 312 q 637 72 722 159 q 401 -14 551 -14 q 141 104 232 -14 q 50 455 50 222 q 142 840 50 711 q 405 970 234 970 q 597 916 527 970 q 696 750 667 862 l 517 725 q 401 819 491 819 q 281 742 325 819 q 237 509 237 666 q 322 587 267 560 q 445 615 376 615 q 648 533 573 615 q 722 312 722 452 m 531 306 q 493 431 531 388 q 390 474 456 474 q 289 434 327 474 q 250 327 250 393 q 290 189 250 243 q 394 134 330 134 q 495 180 459 134 q 531 306 531 226 "},"A":{"x_min":34.59375,"x_max":966.375,"ha":1003,"o":"m 768 0 l 683 244 l 319 244 l 234 0 l 34 0 l 383 956 l 619 956 l 966 0 l 768 0 m 501 808 l 497 793 q 480 738 490 769 q 364 395 471 707 l 638 395 l 544 669 l 515 761 l 501 808 "},"‘":{"x_min":94.296875,"x_max":291.671875,"ha":386,"o":"m 94 564 l 94 696 q 111 841 94 778 q 167 956 129 903 l 291 956 q 226 846 249 903 q 202 741 202 789 l 288 741 l 288 564 l 94 564 "},"O":{"x_min":56.953125,"x_max":1021.6875,"ha":1080,"o":"m 1021 482 q 962 219 1021 332 q 793 46 903 106 q 537 -14 684 -14 q 184 118 312 -14 q 56 482 56 251 q 184 841 56 712 q 538 970 311 970 q 893 839 766 970 q 1021 482 1021 709 m 817 482 q 744 724 817 636 q 538 812 671 812 q 331 725 404 812 q 258 482 258 638 q 333 233 258 324 q 537 143 408 143 q 744 231 671 143 q 817 482 817 319 "},"n":{"x_min":91.515625,"x_max":761.90625,"ha":848,"o":"m 572 0 l 572 411 q 441 604 572 604 q 329 545 372 604 q 287 393 287 486 l 287 0 l 96 0 l 96 569 q 95 666 96 628 q 91 734 93 704 l 273 734 q 278 665 275 721 q 282 587 282 609 l 284 587 q 381 710 323 672 q 520 748 440 748 q 699 676 637 748 q 761 465 761 604 l 761 0 l 572 0 "},"3":{"x_min":31.890625,"x_max":722.78125,"ha":773,"o":"m 722 264 q 634 57 722 130 q 383 -16 546 -16 q 138 54 229 -16 q 31 259 47 125 l 225 276 q 382 138 244 138 q 489 172 451 138 q 527 276 527 206 q 481 374 527 340 q 344 408 435 408 l 277 408 l 277 562 l 340 562 q 463 595 422 562 q 505 691 505 629 q 472 784 505 750 q 375 818 439 818 q 280 785 316 818 q 238 693 244 752 l 48 706 q 150 900 63 830 q 379 970 238 970 q 613 902 529 970 q 698 715 698 834 q 645 568 698 625 q 494 491 593 510 l 494 488 q 663 416 604 475 q 722 264 722 357 "},"9":{"x_min":48.1875,"x_max":721.421875,"ha":773,"o":"m 721 492 q 628 112 721 238 q 364 -14 535 -14 q 166 40 238 -14 q 65 210 95 94 l 244 236 q 366 135 270 135 q 489 212 446 135 q 534 439 532 289 q 449 359 508 388 q 323 331 391 331 q 122 416 196 331 q 48 649 48 502 q 135 885 48 800 q 382 970 222 970 q 637 850 553 970 q 721 492 721 731 m 519 626 q 480 768 519 715 q 377 820 441 820 q 277 774 314 820 q 241 648 241 729 q 277 520 241 568 q 378 472 313 472 q 479 514 439 472 q 519 626 519 556 "},"l":{"x_min":97.015625,"x_max":287.59375,"ha":386,"o":"m 97 0 l 97 1006 l 287 1006 l 287 0 l 97 0 "},"¤":{"x_min":38.78125,"x_max":733.65625,"ha":773,"o":"m 91 464 q 131 614 91 545 l 41 704 l 148 810 l 236 719 q 386 760 305 760 q 534 719 468 760 l 626 811 l 733 704 l 641 612 q 682 464 682 545 q 642 317 682 384 l 733 227 l 626 118 l 536 210 q 386 170 468 170 q 236 208 303 170 l 145 116 l 38 223 l 130 315 q 91 464 91 383 m 244 465 q 285 365 244 407 q 386 323 327 323 q 485 366 443 323 q 527 465 527 408 q 486 565 527 524 q 386 607 444 607 q 286 566 327 607 q 244 465 244 524 "},"4":{"x_min":21.03125,"x_max":765.453125,"ha":773,"o":"m 637 195 l 637 0 l 456 0 l 456 195 l 21 195 l 21 338 l 424 956 l 637 956 l 637 337 l 765 337 l 765 195 l 637 195 m 456 649 q 458 728 456 686 q 462 783 460 771 q 398 673 444 745 l 176 337 l 456 337 l 456 649 "},"p":{"x_min":91.515625,"x_max":791.0625,"ha":848,"o":"m 791 369 q 717 86 791 186 q 509 -14 644 -14 q 375 19 432 -14 q 287 116 318 53 l 283 116 q 287 -7 287 95 l 287 -288 l 96 -288 l 96 565 q 91 734 96 668 l 276 734 q 282 685 280 721 q 284 614 284 649 l 287 614 q 522 749 351 749 q 720 650 650 749 q 791 369 791 551 m 592 369 q 441 616 592 616 q 325 550 365 616 q 284 364 284 483 q 325 180 284 245 q 439 116 365 116 q 592 369 592 116 "},"à":{"x_min":35.71875,"x_max":776.75,"ha":773,"o":"m 261 -14 q 95 44 155 -14 q 35 207 35 102 q 110 380 35 321 q 325 442 184 440 l 483 444 l 483 481 q 458 588 483 553 q 376 623 433 623 q 298 599 323 623 q 267 519 273 575 l 68 529 q 167 691 87 636 q 384 747 246 747 q 599 678 523 747 q 674 483 674 609 l 674 216 q 688 131 674 154 q 734 108 702 108 q 776 112 756 108 l 776 9 q 746 1 759 4 q 719 -3 732 -1 q 690 -7 705 -5 q 654 -8 675 -8 q 548 26 582 -8 q 507 130 514 61 l 503 130 q 261 -14 423 -14 m 483 339 l 385 338 q 291 323 319 335 q 249 287 263 311 q 234 222 234 262 q 258 144 234 169 q 322 118 282 118 q 404 143 367 118 q 462 210 441 167 q 483 302 483 254 l 483 339 m 394 802 l 163 988 l 163 1018 l 338 1018 l 509 822 l 509 802 l 394 802 "},"Ü":{"x_min":83.40625,"x_max":918.234375,"ha":1003,"o":"m 490 -14 q 188 82 292 -14 q 83 357 83 178 l 83 956 l 283 956 l 283 373 q 337 201 283 260 q 495 142 391 142 q 660 204 602 142 q 718 380 718 265 l 718 956 l 918 956 l 918 368 q 806 86 918 186 q 490 -14 693 -14 m 588 1038 l 588 1187 l 722 1187 l 722 1038 l 588 1038 m 280 1038 l 280 1187 l 411 1187 l 411 1038 l 280 1038 "},"ó":{"x_min":54.234375,"x_max":793.765625,"ha":848,"o":"m 793 367 q 694 87 793 188 q 420 -14 595 -14 q 151 87 249 -14 q 54 367 54 189 q 151 645 54 544 q 425 747 249 747 q 699 648 604 747 q 793 367 793 550 m 594 367 q 551 557 594 498 q 427 616 509 616 q 254 367 254 616 q 296 180 254 244 q 418 116 338 116 q 594 367 594 116 m 315 802 l 315 822 l 485 1018 l 660 1018 l 660 988 l 430 802 l 315 802 "},"⁴":{"x_min":24,"x_max":451.265625,"ha":463,"o":"m 381 566 l 381 471 l 257 471 l 257 566 l 24 566 l 24 666 l 238 959 l 381 959 l 381 661 l 451 661 l 451 566 l 381 566 m 260 865 l 252 852 q 215 792 234 820 l 120 661 l 257 661 l 257 792 l 260 865 "}},"cssFontWeight":"bold","ascender":1067,"underlinePosition":-217,"cssFontStyle":"normal","boundingBox":{"yMin":-309,"xMin":-57,"yMax":1245,"xMax":1389},"resolution":1000,"original_font_information":{"postscript_name":"Arimo-Bold","version_string":"Version 1.10","vendor_url":"http://www.ascendercorp.com/","full_font_name":"Arimo Bold","font_family_name":"Arimo","copyright":"Digitized data copyright (c) 2010 Google Corporation. ","description":"Arimo was designed by Steve Matteson as an innovative, refreshing sans serif design that is metrically compatible with Arial™. Arimo offers improved on-screen readability characteristics and the pan-European WGL character set and solves the needs of developers looking for width-compatible fonts to address document portability across platforms.","trademark":"Arimo is a trademark of Google and may be registered in certain jurisdictions.","designer":"Steve Matteson","designer_url":"http://www.ascendercorp.com/typedesigners.html","unique_font_identifier":"Ascender - Arimo Bold","license_url":"http://scripts.sil.org/OFL","license_description":"Licensed under the SIL Open Font License, Version 1.1","manufacturer_name":"Ascender Corporation","font_sub_family_name":"Bold"},"descender":-81,"familyName":"Arimo","lineHeight":1192,"underlineThickness":215});