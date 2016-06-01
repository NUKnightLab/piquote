/*!
	KL
*/

(function (root) {
	root.KL = {
		VERSION: '0.1',
		_originalL: root.KL
	};
}(this));

/*	KL
	Debug mode
================================================== */
KL.debug = true;



/*	KL.Bind
================================================== */
KL.Bind = function (/*Function*/ fn, /*Object*/ obj) /*-> Object*/ {
	return function () {
		return fn.apply(obj, arguments);
	};
};



/* Trace (console.log)
================================================== */
trace = function( msg ) {
	if (KL.debug) {
		if (window.console) {
			console.log(msg);
		} else if ( typeof( jsTrace ) != 'undefined' ) {
			jsTrace.send( msg );
		} else {
			//alert(msg);
		}
	}
}

/*	KL.Util
	Class of utilities
================================================== */

KL.Util = {
	
	extend: function (/*Object*/ dest) /*-> Object*/ {	// merge src properties into dest
		var sources = Array.prototype.slice.call(arguments, 1);
		for (var j = 0, len = sources.length, src; j < len; j++) {
			src = sources[j] || {};
			for (var i in src) {
				if (src.hasOwnProperty(i)) {
					dest[i] = src[i];
				}
			}
		}
		return dest;
	},
	
	setOptions: function (obj, options) {
		obj.options = KL.Util.extend({}, obj.options, options);
		if (obj.options.uniqueid === "") {
			obj.options.uniqueid = KL.Util.unique_ID(6);
		}
	},
	
	isEven: function(n) {
	  return n == parseFloat(n)? !(n%2) : void 0;
	},
	
	findArrayNumberByUniqueID: function(id, array, prop, defaultVal) {
		var _n = defaultVal || 0;
		
		for (var i = 0; i < array.length; i++) {
			if (array[i].data[prop] == id) {
				_n = i;
			}
		};
		
		return _n;
	},
	
	convertUnixTime: function(str) {
		var _date, _months, _year, _month, _day, _time, _date_array = [],
			_date_str = {
				ymd:"",
				time:"",
				time_array:[],
				date_array:[],
				full_array:[]
			};
			
		_date_str.ymd = str.split(" ")[0];
		_date_str.time = str.split(" ")[1];
		_date_str.date_array = _date_str.ymd.split("-");
		_date_str.time_array = _date_str.time.split(":");
		_date_str.full_array = _date_str.date_array.concat(_date_str.time_array)
		
		for(var i = 0; i < _date_str.full_array.length; i++) {
			_date_array.push( parseInt(_date_str.full_array[i]) )
		}

		_date = new Date(_date_array[0], _date_array[1], _date_array[2], _date_array[3], _date_array[4], _date_array[5]);
		_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		_year = _date.getFullYear();
		_month = _months[_date.getMonth()];
		_day = _date.getDate();
		_time = _month + ', ' + _day + ' ' + _year;
		
		return _time;
	},
	
	setData: function (obj, data) {
		obj.data = KL.Util.extend({}, obj.data, data);
		if (obj.data.uniqueid === "") {
			obj.data.uniqueid = KL.Util.unique_ID(6);
		}
	},
	
	mergeData: function(data_main, data_to_merge) {
		var x;
		for (x in data_to_merge) {
			if (Object.prototype.hasOwnProperty.call(data_to_merge, x)) {
				data_main[x] = data_to_merge[x];
			}
		}
		return data_main;
	},
	
	stamp: (function () {
		var lastId = 0, key = '_vco_id';
		

		return function (/*Object*/ obj) {
			obj[key] = obj[key] || ++lastId;
			return obj[key];
		};
	}()),
	
	isArray: (function () {
	    // Use compiler's own isArray when available
	    if (Array.isArray) {
	        return Array.isArray;
	    }
 
	    // Retain references to variables for performance
	    // optimization
	    var objectToStringFn = Object.prototype.toString,
	        arrayToStringResult = objectToStringFn.call([]);
 
	    return function (subject) {
	        return objectToStringFn.call(subject) === arrayToStringResult;
	    };
	}()),
	
    getRandomNumber: function(range) {
   		return Math.floor(Math.random() * range);
   	},
		
	unique_ID: function(size, prefix) {
		
		var getRandomNumber = function(range) {
			return Math.floor(Math.random() * range);
		};

		var getRandomChar = function() {
			var chars = "abcdefghijklmnopqurstuvwxyz";
			return chars.substr( getRandomNumber(32), 1 );
		};

		var randomID = function(size) {
			var str = "";
			for(var i = 0; i < size; i++) {
				str += getRandomChar();
			}
			return str;
		};
		
		if (prefix) {
			return prefix + "-" + randomID(size);
		} else {
			return "vco-" + randomID(size);
		}
	},
	
	htmlify: function(str) {
		//if (str.match(/<\s*p[^>]*>([^<]*)<\s*\/\s*p\s*>/)) {
		if (str.match(/<p>[\s\S]*?<\/p>/)) {
			
			return str;
		} else {
			return "<p>" + str + "</p>";
		}
	},
	
	/*	* Turns plain text links into real links
	================================================== */
	linkify: function(text,targets,is_touch) {
		
        var make_link = function(url, link_text, prefix) {
            if (!prefix) {
                prefix = "";
            }
            var MAX_LINK_TEXT_LENGTH = 30;
            if (link_text && link_text.length > MAX_LINK_TEXT_LENGTH) {
                link_text = link_text.substring(0,MAX_LINK_TEXT_LENGTH) + "\u2026"; // unicode ellipsis
            }
            return prefix + "<a class='vco-makelink' target='_blank' href='" + url + "' onclick='void(0)'>" + link_text + "</a>";
        }
		// http://, https://, ftp://
		var urlPattern = /\b(?:https?|ftp):\/\/([a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim;

		// www. sans http:// or https://
		var pseudoUrlPattern = /(^|[^\/>])(www\.[\S]+(\b|$))/gim;

		// Email addresses
		var emailAddressPattern = /([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/gim;
		

		return text
			.replace(urlPattern, function(match, url_sans_protocol, offset, string) {
                return make_link(match, url_sans_protocol);
            })
			.replace(pseudoUrlPattern, function(match, beforePseudo, pseudoUrl, offset, string) {
                return make_link('http://' + pseudoUrl, pseudoUrl, beforePseudo);
            })
			.replace(emailAddressPattern, function(match, email, offset, string) {
                return make_link('mailto:' + email, email);
            });
	},
	
	unlinkify: function(text) {
		if(!text) return text;
		text = text.replace(/<a\b[^>]*>/i,"");
		text = text.replace(/<\/a>/i, "");
		return text;
	},
	
	getParamString: function (obj) {
		var params = [];
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				params.push(i + '=' + obj[i]);
			}
		}
		return '?' + params.join('&');
	},
	
	formatNum: function (num, digits) {
		var pow = Math.pow(10, digits || 5);
		return Math.round(num * pow) / pow;
	},
	
	falseFn: function () {
		return false;
	},
	
	requestAnimFrame: (function () {
		function timeoutDefer(callback) {
			window.setTimeout(callback, 1000 / 60);
		}

		var requestFn = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			timeoutDefer;

		return function (callback, context, immediate, contextEl) {
			callback = context ? KL.Util.bind(callback, context) : callback;
			if (immediate && requestFn === timeoutDefer) {
				callback();
			} else {
				requestFn(callback, contextEl);
			}
		};
	}()),
	
	bind: function (/*Function*/ fn, /*Object*/ obj) /*-> Object*/ {
		return function () {
			return fn.apply(obj, arguments);
		};
	},
	
	template: function (str, data) {
		return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
			var value = data[key];
			if (!data.hasOwnProperty(key)) {
				throw new Error('No value provided for variable ' + str);
			}
			return value;
		});
	},
	
	hexToRgb: function(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        if (KL.Util.css_named_colors[hex.toLowerCase()]) {
            hex = KL.Util.css_named_colors[hex.toLowerCase()];
        }
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	},
    css_named_colors: {
        "aliceblue": "#f0f8ff",
        "antiquewhite": "#faebd7",
        "aqua": "#00ffff",
        "aquamarine": "#7fffd4",
        "azure": "#f0ffff",
        "beige": "#f5f5dc",
        "bisque": "#ffe4c4",
        "black": "#000000",
        "blanchedalmond": "#ffebcd",
        "blue": "#0000ff",
        "blueviolet": "#8a2be2",
        "brown": "#a52a2a",
        "burlywood": "#deb887",
        "cadetblue": "#5f9ea0",
        "chartreuse": "#7fff00",
        "chocolate": "#d2691e",
        "coral": "#ff7f50",
        "cornflowerblue": "#6495ed",
        "cornsilk": "#fff8dc",
        "crimson": "#dc143c",
        "cyan": "#00ffff",
        "darkblue": "#00008b",
        "darkcyan": "#008b8b",
        "darkgoldenrod": "#b8860b",
        "darkgray": "#a9a9a9",
        "darkgreen": "#006400",
        "darkkhaki": "#bdb76b",
        "darkmagenta": "#8b008b",
        "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00",
        "darkorchid": "#9932cc",
        "darkred": "#8b0000",
        "darksalmon": "#e9967a",
        "darkseagreen": "#8fbc8f",
        "darkslateblue": "#483d8b",
        "darkslategray": "#2f4f4f",
        "darkturquoise": "#00ced1",
        "darkviolet": "#9400d3",
        "deeppink": "#ff1493",
        "deepskyblue": "#00bfff",
        "dimgray": "#696969",
        "dodgerblue": "#1e90ff",
        "firebrick": "#b22222",
        "floralwhite": "#fffaf0",
        "forestgreen": "#228b22",
        "fuchsia": "#ff00ff",
        "gainsboro": "#dcdcdc",
        "ghostwhite": "#f8f8ff",
        "gold": "#ffd700",
        "goldenrod": "#daa520",
        "gray": "#808080",
        "green": "#008000",
        "greenyellow": "#adff2f",
        "honeydew": "#f0fff0",
        "hotpink": "#ff69b4",
        "indianred": "#cd5c5c",
        "indigo": "#4b0082",
        "ivory": "#fffff0",
        "khaki": "#f0e68c",
        "lavender": "#e6e6fa",
        "lavenderblush": "#fff0f5",
        "lawngreen": "#7cfc00",
        "lemonchiffon": "#fffacd",
        "lightblue": "#add8e6",
        "lightcoral": "#f08080",
        "lightcyan": "#e0ffff",
        "lightgoldenrodyellow": "#fafad2",
        "lightgray": "#d3d3d3",
        "lightgreen": "#90ee90",
        "lightpink": "#ffb6c1",
        "lightsalmon": "#ffa07a",
        "lightseagreen": "#20b2aa",
        "lightskyblue": "#87cefa",
        "lightslategray": "#778899",
        "lightsteelblue": "#b0c4de",
        "lightyellow": "#ffffe0",
        "lime": "#00ff00",
        "limegreen": "#32cd32",
        "linen": "#faf0e6",
        "magenta": "#ff00ff",
        "maroon": "#800000",
        "mediumaquamarine": "#66cdaa",
        "mediumblue": "#0000cd",
        "mediumorchid": "#ba55d3",
        "mediumpurple": "#9370db",
        "mediumseagreen": "#3cb371",
        "mediumslateblue": "#7b68ee",
        "mediumspringgreen": "#00fa9a",
        "mediumturquoise": "#48d1cc",
        "mediumvioletred": "#c71585",
        "midnightblue": "#191970",
        "mintcream": "#f5fffa",
        "mistyrose": "#ffe4e1",
        "moccasin": "#ffe4b5",
        "navajowhite": "#ffdead",
        "navy": "#000080",
        "oldlace": "#fdf5e6",
        "olive": "#808000",
        "olivedrab": "#6b8e23",
        "orange": "#ffa500",
        "orangered": "#ff4500",
        "orchid": "#da70d6",
        "palegoldenrod": "#eee8aa",
        "palegreen": "#98fb98",
        "paleturquoise": "#afeeee",
        "palevioletred": "#db7093",
        "papayawhip": "#ffefd5",
        "peachpuff": "#ffdab9",
        "peru": "#cd853f",
        "pink": "#ffc0cb",
        "plum": "#dda0dd",
        "powderblue": "#b0e0e6",
        "purple": "#800080",
        "rebeccapurple": "#663399",
        "red": "#ff0000",
        "rosybrown": "#bc8f8f",
        "royalblue": "#4169e1",
        "saddlebrown": "#8b4513",
        "salmon": "#fa8072",
        "sandybrown": "#f4a460",
        "seagreen": "#2e8b57",
        "seashell": "#fff5ee",
        "sienna": "#a0522d",
        "silver": "#c0c0c0",
        "skyblue": "#87ceeb",
        "slateblue": "#6a5acd",
        "slategray": "#708090",
        "snow": "#fffafa",
        "springgreen": "#00ff7f",
        "steelblue": "#4682b4",
        "tan": "#d2b48c",
        "teal": "#008080",
        "thistle": "#d8bfd8",
        "tomato": "#ff6347",
        "turquoise": "#40e0d0",
        "violet": "#ee82ee",
        "wheat": "#f5deb3",
        "white": "#ffffff",
        "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00",
        "yellowgreen": "#9acd32"
    },
	ratio: {
		square: function(size) {
			var s = {
				w: 0,
				h: 0
			}
			if (size.w > size.h && size.h > 0) {
				s.h = size.h;
				s.w = size.h;
			} else {
				s.w = size.w;
				s.h = size.w;
			}
			return s;
		},
		
		r16_9: function(size) {
			if (size.w !== null && size.w !== "") {
				return Math.round((size.w / 16) * 9);
			} else if (size.h !== null && size.h !== "") {
				return Math.round((size.h / 9) * 16);
			} else {
				return 0;
			}
		},
		r4_3: function(size) {
			if (size.w !== null && size.w !== "") {
				return Math.round((size.w / 4) * 3);
			} else if (size.h !== null && size.h !== "") {
				return Math.round((size.h / 3) * 4);
			}
		}
	},
	getObjectAttributeByIndex: function(obj, index) {
		if(typeof obj != 'undefined') {
			var i = 0;
			for (var attr in obj){
				if (index === i){
					return obj[attr];
				}
				i++;
			}
			return "";
		} else {
			return "";
		}
		
	},
	getUrlVars: function(string) {
		var str,
			vars = [],
			hash,
			hashes;
		
		str = string.toString();
		
		if (str.match('&#038;')) { 
			str = str.replace("&#038;", "&");
		} else if (str.match('&#38;')) {
			str = str.replace("&#38;", "&");
		} else if (str.match('&amp;')) {
			str = str.replace("&amp;", "&");
		}
		
		hashes = str.slice(str.indexOf('?') + 1).split('&');
		
		for(var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		
		
		return vars;
	},

	trim: function(str) {
		return str.replace(/^\s+|\s+$/g, '');
	},

	slugify: function(str) {
		// borrowed from http://stackoverflow.com/a/5782563/102476
		str = KL.Util.trim(str);
		str = str.toLowerCase();

		// remove accents, swap ñ for n, etc
		var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
		var to   = "aaaaaeeeeeiiiiooooouuuunc------";
		for (var i=0, l=from.length ; i<l ; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
		}

		str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-'); // collapse dashes

		str = str.replace(/^([0-9])/,'_$1');
		return str;
	},
	maxDepth: function(ary) {
		// given a sorted array of 2-tuples of numbers, count how many "deep" the items are.
		// that is, what is the maximum number of tuples that occupy any one moment
		// each tuple should also be sorted
		var stack = [];
		var max_depth = 0;
		for (var i = 0; i < ary.length; i++) {

			stack.push(ary[i]);
			if (stack.length > 1) {
				var top = stack[stack.length - 1]
				var bottom_idx = -1;
				for (var j = 0; j < stack.length - 1; j++) {
					if (stack[j][1] < top[0]) {
						bottom_idx = j;
					}
				};
				if (bottom_idx >= 0) {
					stack = stack.slice(bottom_idx + 1);
				}

			}

			if (stack.length > max_depth) {
				max_depth = stack.length;
			}
		};
		return max_depth;
	},

	pad: function (val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) val = "0" + val;
		return val;
	},

    findNextGreater: function(list, current, default_value) {
        // given a sorted list and a current value which *might* be in the list, 
        // return the next greatest value if the current value is >= the last item in the list, return default, 
        // or if default is undefined, return input value
        for (var i = 0; i < list.length; i++) {
            if (current < list[i]) {
                return list[i];
            }
        }

        return (default_value) ? default_value : current;
    },

    findNextLesser: function(list, current, default_value) {
        // given a sorted list and a current value which *might* be in the list, 
        // return the next lesser value if the current value is <= the last item in the list, return default, 
        // or if default is undefined, return input value
        for (var i = list.length - 1; i >= 0; i--) {
            if (current > list[i]) {
                return list[i];
            }
        }

        return (default_value) ? default_value : current;
    }
};


/*	KL.Class
	Class powers the OOP facilities of the library.
================================================== */
KL.Class = function () {};

KL.Class.extend = function (/*Object*/ props) /*-> Class*/ {
 
	// extended class with the new prototype
	var NewClass = function () {
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}
	};

	// instantiate class without calling constructor
	var F = function () {};
	F.prototype = this.prototype;
	var proto = new F();

	proto.constructor = NewClass;
	NewClass.prototype = proto;

	// add superclass access
	NewClass.superclass = this.prototype;

	// add class name
	//proto.className = props;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype' && i !== 'superclass') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		KL.Util.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		KL.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (props.options && proto.options) {
		props.options = KL.Util.extend({}, proto.options, props.options);
	}

	// mix given properties into the prototype
	KL.Util.extend(proto, props);

	// allow inheriting further
	NewClass.extend = KL.Class.extend;

	// method for adding properties to prototype
	NewClass.include = function (props) {
		KL.Util.extend(this.prototype, props);
	};

	return NewClass;
};


/*	KL.Events
	adds custom events functionality to VCO classes
================================================== */
KL.Events = {
	addEventListener: function (/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		var events = this._vco_events = this._vco_events || {};
		events[type] = events[type] || [];
		events[type].push({
			action: fn,
			context: context || this
		});
		return this;
	},

	hasEventListeners: function (/*String*/ type) /*-> Boolean*/ {
		var k = '_vco_events';
		return (k in this) && (type in this[k]) && (this[k][type].length > 0);
	},

	removeEventListener: function (/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		if (!this.hasEventListeners(type)) {
			return this;
		}

		for (var i = 0, events = this._vco_events, len = events[type].length; i < len; i++) {
			if (
				(events[type][i].action === fn) &&
				(!context || (events[type][i].context === context))
			) {
				events[type].splice(i, 1);
				return this;
			}
		}
		return this;
	},

	fireEvent: function (/*String*/ type, /*(optional) Object*/ data) {
		if (!this.hasEventListeners(type)) {
			return this;
		}

		var event = KL.Util.extend({
			type: type,
			target: this
		}, data);

		var listeners = this._vco_events[type].slice();

		for (var i = 0, len = listeners.length; i < len; i++) {
			listeners[i].action.call(listeners[i].context || this, event);
		}

		return this;
	}
};

KL.Events.on	= KL.Events.addEventListener;
KL.Events.off	= KL.Events.removeEventListener;
KL.Events.fire = KL.Events.fireEvent;

/*
	Based on Leaflet Browser
	KL.Browser handles different browser and feature detections for internal  use.
*/


(function() {

	var ua = navigator.userAgent.toLowerCase(),
		doc = document.documentElement,

		ie = 'ActiveXObject' in window,

		webkit = ua.indexOf('webkit') !== -1,
		phantomjs = ua.indexOf('phantom') !== -1,
		android23 = ua.search('android [23]') !== -1,

		mobile = typeof orientation !== 'undefined',
		msPointer = navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent,
		pointer = (window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints) || msPointer,

		ie3d = ie && ('transition' in doc.style),
		webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
		gecko3d = 'MozPerspective' in doc.style,
		opera3d = 'OTransition' in doc.style,
		opera = window.opera;


	var retina = 'devicePixelRatio' in window && window.devicePixelRatio > 1;

	if (!retina && 'matchMedia' in window) {
		var matches = window.matchMedia('(min-resolution:144dpi)');
		retina = matches && matches.matches;
	}

	var touch = !window.L_NO_TOUCH && !phantomjs && (pointer || 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch));

	KL.Browser = {
		ie: ie,
		ielt9: ie && !document.addEventListener,
		webkit: webkit,
		//gecko: (ua.indexOf('gecko') !== -1) && !webkit && !window.opera && !ie,
		firefox: (ua.indexOf('gecko') !== -1) && !webkit && !window.opera && !ie,
		android: ua.indexOf('android') !== -1,
		android23: android23,
		chrome: ua.indexOf('chrome') !== -1,

		ie3d: ie3d,
		webkit3d: webkit3d,
		gecko3d: gecko3d,
		opera3d: opera3d,
		any3d: !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs,

		mobile: mobile,
		mobileWebkit: mobile && webkit,
		mobileWebkit3d: mobile && webkit3d,
		mobileOpera: mobile && window.opera,

		touch: !! touch,
		msPointer: !! msPointer,
		pointer: !! pointer,

		retina: !! retina,
		orientation: function() {
			var w = window.innerWidth,
				h = window.innerHeight,
				_orientation = "portrait";
			
			if (w > h) {
				_orientation = "landscape";
			}
			if (Math.abs(window.orientation) == 90) {
				//_orientation = "landscape";
			}
			trace(_orientation);
			return _orientation;
		}
	};

}()); 

/*	KL.Load
	Loads External Javascript and CSS
================================================== */

KL.Load = (function (doc) {
	var loaded	= [];
	
	function isLoaded(url) {
		
		var i			= 0,
			has_loaded	= false;
		
		for (i = 0; i < loaded.length; i++) {
			if (loaded[i] == url) {
				has_loaded = true;
			}
		}
		
		if (has_loaded) {
			return true;
		} else {
			loaded.push(url);
			return false;
		}
		
	}
	
	return {
		
		css: function (urls, callback, obj, context) {
			if (!isLoaded(urls)) {
				KL.LoadIt.css(urls, callback, obj, context);
			} else {
				callback();
			}
		},

		js: function (urls, callback, obj, context) {
			if (!isLoaded(urls)) {
				KL.LoadIt.js(urls, callback, obj, context);
			} else {
				callback();
			}
		}
    };
	
})(this.document);


/*jslint browser: true, eqeqeq: true, bitwise: true, newcap: true, immed: true, regexp: false */

/*
LazyLoad makes it easy and painless to lazily load one or more external
JavaScript or CSS files on demand either during or after the rendering of a web
page.

Supported browsers include Firefox 2+, IE6+, Safari 3+ (including Mobile
Safari), Google Chrome, and Opera 9+. Other browsers may or may not work and
are not officially supported.

Visit https://github.com/rgrove/lazyload/ for more info.

Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@module lazyload
@class LazyLoad
@static
@version 2.0.3 (git)
*/

KL.LoadIt = (function (doc) {
  // -- Private Variables ------------------------------------------------------

  // User agent and feature test information.
  var env,

  // Reference to the <head> element (populated lazily).
  head,

  // Requests currently in progress, if any.
  pending = {},

  // Number of times we've polled to check whether a pending stylesheet has
  // finished loading. If this gets too high, we're probably stalled.
  pollCount = 0,

  // Queued requests.
  queue = {css: [], js: []},

  // Reference to the browser's list of stylesheets.
  styleSheets = doc.styleSheets;

  // -- Private Methods --------------------------------------------------------

  /**
  Creates and returns an HTML element with the specified name and attributes.

  @method createNode
  @param {String} name element name
  @param {Object} attrs name/value mapping of element attributes
  @return {HTMLElement}
  @private
  */
  function createNode(name, attrs) {
    var node = doc.createElement(name), attr;

    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        node.setAttribute(attr, attrs[attr]);
      }
    }

    return node;
  }

  /**
  Called when the current pending resource of the specified type has finished
  loading. Executes the associated callback (if any) and loads the next
  resource in the queue.

  @method finish
  @param {String} type resource type ('css' or 'js')
  @private
  */
  function finish(type) {
    var p = pending[type],
        callback,
        urls;

    if (p) {
      callback = p.callback;
      urls     = p.urls;

      urls.shift();
      pollCount = 0;

      // If this is the last of the pending URLs, execute the callback and
      // start the next request in the queue (if any).
      if (!urls.length) {
        callback && callback.call(p.context, p.obj);
        pending[type] = null;
        queue[type].length && load(type);
      }
    }
  }

  /**
  Populates the <code>env</code> variable with user agent and feature test
  information.

  @method getEnv
  @private
  */
  function getEnv() {
    var ua = navigator.userAgent;

    env = {
      // True if this browser supports disabling async mode on dynamically
      // created script nodes. See
      // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
      async: doc.createElement('script').async === true
    };

    (env.webkit = /AppleWebKit\//.test(ua))
      || (env.ie = /MSIE/.test(ua))
      || (env.opera = /Opera/.test(ua))
      || (env.gecko = /Gecko\//.test(ua))
      || (env.unknown = true);
  }

  /**
  Loads the specified resources, or the next resource of the specified type
  in the queue if no resources are specified. If a resource of the specified
  type is already being loaded, the new request will be queued until the
  first request has been finished.

  When an array of resource URLs is specified, those URLs will be loaded in
  parallel if it is possible to do so while preserving execution order. All
  browsers support parallel loading of CSS, but only Firefox and Opera
  support parallel loading of scripts. In other browsers, scripts will be
  queued and loaded one at a time to ensure correct execution order.

  @method load
  @param {String} type resource type ('css' or 'js')
  @param {String|Array} urls (optional) URL or array of URLs to load
  @param {Function} callback (optional) callback function to execute when the
    resource is loaded
  @param {Object} obj (optional) object to pass to the callback function
  @param {Object} context (optional) if provided, the callback function will
    be executed in this object's context
  @private
  */
  function load(type, urls, callback, obj, context) {
    var _finish = function () { finish(type); },
        isCSS   = type === 'css',
        nodes   = [],
        i, len, node, p, pendingUrls, url;

    env || getEnv();

    if (urls) {
      // If urls is a string, wrap it in an array. Otherwise assume it's an
      // array and create a copy of it so modifications won't be made to the
      // original.
      urls = typeof urls === 'string' ? [urls] : urls.concat();

      // Create a request object for each URL. If multiple URLs are specified,
      // the callback will only be executed after all URLs have been loaded.
      //
      // Sadly, Firefox and Opera are the only browsers capable of loading
      // scripts in parallel while preserving execution order. In all other
      // browsers, scripts must be loaded sequentially.
      //
      // All browsers respect CSS specificity based on the order of the link
      // elements in the DOM, regardless of the order in which the stylesheets
      // are actually downloaded.
      if (isCSS || env.async || env.gecko || env.opera) {
        // Load in parallel.
        queue[type].push({
          urls    : urls,
          callback: callback,
          obj     : obj,
          context : context
        });
      } else {
        // Load sequentially.
        for (i = 0, len = urls.length; i < len; ++i) {
          queue[type].push({
            urls    : [urls[i]],
            callback: i === len - 1 ? callback : null, // callback is only added to the last URL
            obj     : obj,
            context : context
          });
        }
      }
    }

    // If a previous load request of this type is currently in progress, we'll
    // wait our turn. Otherwise, grab the next item in the queue.
    if (pending[type] || !(p = pending[type] = queue[type].shift())) {
      return;
    }

    head || (head = doc.head || doc.getElementsByTagName('head')[0]);
    pendingUrls = p.urls;

    for (i = 0, len = pendingUrls.length; i < len; ++i) {
      url = pendingUrls[i];

      if (isCSS) {
          node = env.gecko ? createNode('style') : createNode('link', {
            href: url,
            rel : 'stylesheet'
          });
      } else {
        node = createNode('script', {src: url});
        node.async = false;
      }

      node.className = 'lazyload';
      node.setAttribute('charset', 'utf-8');

      if (env.ie && !isCSS) {
        node.onreadystatechange = function () {
          if (/loaded|complete/.test(node.readyState)) {
            node.onreadystatechange = null;
            _finish();
          }
        };
      } else if (isCSS && (env.gecko || env.webkit)) {
        // Gecko and WebKit don't support the onload event on link nodes.
        if (env.webkit) {
          // In WebKit, we can poll for changes to document.styleSheets to
          // figure out when stylesheets have loaded.
          p.urls[i] = node.href; // resolve relative URLs (or polling won't work)
          pollWebKit();
        } else {
          // In Gecko, we can import the requested URL into a <style> node and
          // poll for the existence of node.sheet.cssRules. Props to Zach
          // Leatherman for calling my attention to this technique.
          node.innerHTML = '@import "' + url + '";';
          pollGecko(node);
        }
      } else {
        node.onload = node.onerror = _finish;
      }

      nodes.push(node);
    }

    for (i = 0, len = nodes.length; i < len; ++i) {
      head.appendChild(nodes[i]);
    }
  }

  /**
  Begins polling to determine when the specified stylesheet has finished loading
  in Gecko. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  Thanks to Zach Leatherman for calling my attention to the @import-based
  cross-domain technique used here, and to Oleg Slobodskoi for an earlier
  same-domain implementation. See Zach's blog for more details:
  http://www.zachleat.com/web/2010/07/29/load-css-dynamically/

  @method pollGecko
  @param {HTMLElement} node Style node to poll.
  @private
  */
  function pollGecko(node) {
    var hasRules;

    try {
      // We don't really need to store this value or ever refer to it again, but
      // if we don't store it, Closure Compiler assumes the code is useless and
      // removes it.
      hasRules = !!node.sheet.cssRules;
    } catch (ex) {
      // An exception means the stylesheet is still loading.
      pollCount += 1;

      if (pollCount < 200) {
        setTimeout(function () { pollGecko(node); }, 50);
      } else {
        // We've been polling for 10 seconds and nothing's happened. Stop
        // polling and finish the pending requests to avoid blocking further
        // requests.
        hasRules && finish('css');
      }

      return;
    }

    // If we get here, the stylesheet has loaded.
    finish('css');
  }

  /**
  Begins polling to determine when pending stylesheets have finished loading
  in WebKit. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  @method pollWebKit
  @private
  */
  function pollWebKit() {
    var css = pending.css, i;

    if (css) {
      i = styleSheets.length;

      // Look for a stylesheet matching the pending URL.
      while (--i >= 0) {
        if (styleSheets[i].href === css.urls[0]) {
          finish('css');
          break;
        }
      }

      pollCount += 1;

      if (css) {
        if (pollCount < 200) {
          setTimeout(pollWebKit, 50);
        } else {
          // We've been polling for 10 seconds and nothing's happened, which may
          // indicate that the stylesheet has been removed from the document
          // before it had a chance to load. Stop polling and finish the pending
          // request to prevent blocking further requests.
          finish('css');
        }
      }
    }
  }

  return {

    /**
    Requests the specified CSS URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified, the stylesheets will be loaded in parallel and the callback
    will be executed after all stylesheets have finished loading.

    @method css
    @param {String|Array} urls CSS URL or array of CSS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified stylesheets are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    css: function (urls, callback, obj, context) {
      load('css', urls, callback, obj, context);
    },

    /**
    Requests the specified JavaScript URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified and the browser supports it, the scripts will be loaded in
    parallel and the callback will be executed after all scripts have
    finished loading.

    Currently, only Firefox and Opera support parallel loading of scripts while
    preserving execution order. In other browsers, scripts will be
    queued and loaded one at a time to ensure correct execution order.

    @method js
    @param {String|Array} urls JS URL or array of JS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified scripts are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    js: function (urls, callback, obj, context) {
      load('js', urls, callback, obj, context);
    }

  };
})(this.document);


// Expects KL to be visible in scope

;(function(KL){
    /* Zepto v1.1.2-15-g59d3fe5 - zepto event ajax form ie - zeptojs.com/license */

    var Zepto = (function() {
      var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
        document = window.document,
        elementDisplay = {}, classCache = {},
        cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rootNodeRE = /^(?:body|html)$/i,
        capitalRE = /([A-Z])/g,

        // special attributes that should be get/set via method calls
        methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

        adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
        table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
          'tr': document.createElement('tbody'),
          'tbody': table, 'thead': table, 'tfoot': table,
          'td': tableRow, 'th': tableRow,
          '*': document.createElement('div')
        },
        readyRE = /complete|loaded|interactive/,
        classSelectorRE = /^\.([\w-]+)$/,
        idSelectorRE = /^#([\w-]*)$/,
        simpleSelectorRE = /^[\w-]*$/,
        class2type = {},
        toString = class2type.toString,
        zepto = {},
        camelize, uniq,
        tempParent = document.createElement('div'),
        propMap = {
          'tabindex': 'tabIndex',
          'readonly': 'readOnly',
          'for': 'htmlFor',
          'class': 'className',
          'maxlength': 'maxLength',
          'cellspacing': 'cellSpacing',
          'cellpadding': 'cellPadding',
          'rowspan': 'rowSpan',
          'colspan': 'colSpan',
          'usemap': 'useMap',
          'frameborder': 'frameBorder',
          'contenteditable': 'contentEditable'
        },
        isArray = Array.isArray ||
          function(object){ return object instanceof Array }

      zepto.matches = function(element, selector) {
        if (!selector || !element || element.nodeType !== 1) return false
        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                              element.oMatchesSelector || element.matchesSelector
        if (matchesSelector) return matchesSelector.call(element, selector)
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent
        if (temp) (parent = tempParent).appendChild(element)
        match = ~zepto.qsa(parent, selector).indexOf(element)
        temp && tempParent.removeChild(element)
        return match
      }

      function type(obj) {
        return obj == null ? String(obj) :
          class2type[toString.call(obj)] || "object"
      }

      function isFunction(value) { return type(value) == "function" }
      function isWindow(obj)     { return obj != null && obj == obj.window }
      function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
      function isObject(obj)     { return type(obj) == "object" }
      function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
      }
      function likeArray(obj) { return typeof obj.length == 'number' }

      function compact(array) { return filter.call(array, function(item){ return item != null }) }
      function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
      camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
      function dasherize(str) {
        return str.replace(/::/g, '/')
               .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
               .replace(/([a-z\d])([A-Z])/g, '$1_$2')
               .replace(/_/g, '-')
               .toLowerCase()
      }
      uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

      function classRE(name) {
        return name in classCache ?
          classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
      }

      function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
      }

      function defaultDisplay(nodeName) {
        var element, display
        if (!elementDisplay[nodeName]) {
          element = document.createElement(nodeName)
          document.body.appendChild(element)
          display = getComputedStyle(element, '').getPropertyValue("display")
          element.parentNode.removeChild(element)
          display == "none" && (display = "block")
          elementDisplay[nodeName] = display
        }
        return elementDisplay[nodeName]
      }

      function children(element) {
        return 'children' in element ?
          slice.call(element.children) :
          $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
      }

      // `$.zepto.fragment` takes a html string and an optional tag name
      // to generate DOM nodes nodes from the given html string.
      // The generated DOM nodes are returned as an array.
      // This function can be overriden in plugins for example to make
      // it compatible with browsers that don't support the DOM fully.
      zepto.fragment = function(html, name, properties) {
        var dom, nodes, container

        // A special case optimization for a single tag
        if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

        if (!dom) {
          if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
          if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
          if (!(name in containers)) name = '*'

          container = containers[name]
          container.innerHTML = '' + html
          dom = $.each(slice.call(container.childNodes), function(){
            container.removeChild(this)
          })
        }

        if (isPlainObject(properties)) {
          nodes = $(dom)
          $.each(properties, function(key, value) {
            if (methodAttributes.indexOf(key) > -1) nodes[key](value)
            else nodes.attr(key, value)
          })
        }

        return dom
      }

      // `$.zepto.Z` swaps out the prototype of the given `dom` array
      // of nodes with `$.fn` and thus supplying all the Zepto functions
      // to the array. Note that `__proto__` is not supported on Internet
      // Explorer. This method can be overriden in plugins.
      zepto.Z = function(dom, selector) {
        dom = dom || []
        dom.__proto__ = $.fn
        dom.selector = selector || ''
        return dom
      }

      // `$.zepto.isZ` should return `true` if the given object is a Zepto
      // collection. This method can be overriden in plugins.
      zepto.isZ = function(object) {
        return object instanceof zepto.Z
      }

      // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
      // takes a CSS selector and an optional context (and handles various
      // special cases).
      // This method can be overriden in plugins.
      zepto.init = function(selector, context) {
        var dom
        // If nothing given, return an empty Zepto collection
        if (!selector) return zepto.Z()
        // Optimize for string selectors
        else if (typeof selector == 'string') {
          selector = selector.trim()
          // If it's a html fragment, create nodes from it
          // Note: In both Chrome 21 and Firefox 15, DOM error 12
          // is thrown if the fragment doesn't begin with <
          if (selector[0] == '<' && fragmentRE.test(selector))
            dom = zepto.fragment(selector, RegExp.$1, context), selector = null
          // If there's a context, create a collection on that context first, and select
          // nodes from there
          else if (context !== undefined) return $(context).find(selector)
          // If it's a CSS selector, use it to select nodes.
          else dom = zepto.qsa(document, selector)
        }
        // If a function is given, call it when the DOM is ready
        else if (isFunction(selector)) return $(document).ready(selector)
        // If a Zepto collection is given, just return it
        else if (zepto.isZ(selector)) return selector
        else {
          // normalize array if an array of nodes is given
          if (isArray(selector)) dom = compact(selector)
          // Wrap DOM nodes.
          else if (isObject(selector))
            dom = [selector], selector = null
          // If it's a html fragment, create nodes from it
          else if (fragmentRE.test(selector))
            dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
          // If there's a context, create a collection on that context first, and select
          // nodes from there
          else if (context !== undefined) return $(context).find(selector)
          // And last but no least, if it's a CSS selector, use it to select nodes.
          else dom = zepto.qsa(document, selector)
        }
        // create a new Zepto collection from the nodes found
        return zepto.Z(dom, selector)
      }

      // `$` will be the base `Zepto` object. When calling this
      // function just call `$.zepto.init, which makes the implementation
      // details of selecting nodes and creating Zepto collections
      // patchable in plugins.
      $ = function(selector, context){
        return zepto.init(selector, context)
      }

      function extend(target, source, deep) {
        for (key in source)
          if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key]))
              target[key] = {}
            if (isArray(source[key]) && !isArray(target[key]))
              target[key] = []
            extend(target[key], source[key], deep)
          }
          else if (source[key] !== undefined) target[key] = source[key]
      }

      // Copy all but undefined properties from one or more
      // objects to the `target` object.
      $.extend = function(target){
        var deep, args = slice.call(arguments, 1)
        if (typeof target == 'boolean') {
          deep = target
          target = args.shift()
        }
        args.forEach(function(arg){ extend(target, arg, deep) })
        return target
      }

      // `$.zepto.qsa` is Zepto's CSS selector implementation which
      // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
      // This method can be overriden in plugins.
      zepto.qsa = function(element, selector){
        var found,
            maybeID = selector[0] == '#',
            maybeClass = !maybeID && selector[0] == '.',
            nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
            isSimple = simpleSelectorRE.test(nameOnly)
        return (isDocument(element) && isSimple && maybeID) ?
          ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
          (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
          slice.call(
            isSimple && !maybeID ?
              maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
              element.getElementsByTagName(selector) : // Or a tag
              element.querySelectorAll(selector) // Or it's not simple, and we need to query all
          )
      }

      function filtered(nodes, selector) {
        return selector == null ? $(nodes) : $(nodes).filter(selector)
      }

      $.contains = function(parent, node) {
        return parent !== node && parent.contains(node)
      }

      function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg
      }

      function setAttribute(node, name, value) {
        value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
      }

      // access className property while respecting SVGAnimatedString
      function className(node, value){
        var klass = node.className,
            svg   = klass && klass.baseVal !== undefined

        if (value === undefined) return svg ? klass.baseVal : klass
        svg ? (klass.baseVal = value) : (node.className = value)
      }

      // "true"  => true
      // "false" => false
      // "null"  => null
      // "42"    => 42
      // "42.5"  => 42.5
      // "08"    => "08"
      // JSON    => parse if valid
      // String  => self
      function deserializeValue(value) {
        var num
        try {
          return value ?
            value == "true" ||
            ( value == "false" ? false :
              value == "null" ? null :
              !/^0/.test(value) && !isNaN(num = Number(value)) ? num :
              /^[\[\{]/.test(value) ? $.parseJSON(value) :
              value )
            : value
        } catch(e) {
          return value
        }
      }

      $.type = type
      $.isFunction = isFunction
      $.isWindow = isWindow
      $.isArray = isArray
      $.isPlainObject = isPlainObject

      $.isEmptyObject = function(obj) {
        var name
        for (name in obj) return false
        return true
      }

      $.inArray = function(elem, array, i){
        return emptyArray.indexOf.call(array, elem, i)
      }

      $.camelCase = camelize
      $.trim = function(str) {
        return str == null ? "" : String.prototype.trim.call(str)
      }

      // plugin compatibility
      $.uuid = 0
      $.support = { }
      $.expr = { }

      $.map = function(elements, callback){
        var value, values = [], i, key
        if (likeArray(elements))
          for (i = 0; i < elements.length; i++) {
            value = callback(elements[i], i)
            if (value != null) values.push(value)
          }
        else
          for (key in elements) {
            value = callback(elements[key], key)
            if (value != null) values.push(value)
          }
        return flatten(values)
      }

      $.each = function(elements, callback){
        var i, key
        if (likeArray(elements)) {
          for (i = 0; i < elements.length; i++)
            if (callback.call(elements[i], i, elements[i]) === false) return elements
        } else {
          for (key in elements)
            if (callback.call(elements[key], key, elements[key]) === false) return elements
        }

        return elements
      }

      $.grep = function(elements, callback){
        return filter.call(elements, callback)
      }

      if (window.JSON) $.parseJSON = JSON.parse

      // Populate the class2type map
      $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase()
      })

      // Define methods that will be available on all
      // Zepto collections
      $.fn = {
        // Because a collection acts like an array
        // copy over these useful array functions.
        forEach: emptyArray.forEach,
        reduce: emptyArray.reduce,
        push: emptyArray.push,
        sort: emptyArray.sort,
        indexOf: emptyArray.indexOf,
        concat: emptyArray.concat,

        // `map` and `slice` in the jQuery API work differently
        // from their array counterparts
        map: function(fn){
          return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
        },
        slice: function(){
          return $(slice.apply(this, arguments))
        },

        ready: function(callback){
          // need to check if document.body exists for IE as that browser reports
          // document ready when it hasn't yet created the body element
          if (readyRE.test(document.readyState) && document.body) callback($)
          else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
          return this
        },
        get: function(idx){
          return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
        },
        toArray: function(){ return this.get() },
        size: function(){
          return this.length
        },
        remove: function(){
          return this.each(function(){
            if (this.parentNode != null)
              this.parentNode.removeChild(this)
          })
        },
        each: function(callback){
          emptyArray.every.call(this, function(el, idx){
            return callback.call(el, idx, el) !== false
          })
          return this
        },
        filter: function(selector){
          if (isFunction(selector)) return this.not(this.not(selector))
          return $(filter.call(this, function(element){
            return zepto.matches(element, selector)
          }))
        },
        add: function(selector,context){
          return $(uniq(this.concat($(selector,context))))
        },
        is: function(selector){
          return this.length > 0 && zepto.matches(this[0], selector)
        },
        not: function(selector){
          var nodes=[]
          if (isFunction(selector) && selector.call !== undefined)
            this.each(function(idx){
              if (!selector.call(this,idx)) nodes.push(this)
            })
          else {
            var excludes = typeof selector == 'string' ? this.filter(selector) :
              (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
            this.forEach(function(el){
              if (excludes.indexOf(el) < 0) nodes.push(el)
            })
          }
          return $(nodes)
        },
        has: function(selector){
          return this.filter(function(){
            return isObject(selector) ?
              $.contains(this, selector) :
              $(this).find(selector).size()
          })
        },
        eq: function(idx){
          return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
        },
        first: function(){
          var el = this[0]
          return el && !isObject(el) ? el : $(el)
        },
        last: function(){
          var el = this[this.length - 1]
          return el && !isObject(el) ? el : $(el)
        },
        find: function(selector){
          var result, $this = this
          if (typeof selector == 'object')
            result = $(selector).filter(function(){
              var node = this
              return emptyArray.some.call($this, function(parent){
                return $.contains(parent, node)
              })
            })
          else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
          else result = this.map(function(){ return zepto.qsa(this, selector) })
          return result
        },
        closest: function(selector, context){
          var node = this[0], collection = false
          if (typeof selector == 'object') collection = $(selector)
          while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
            node = node !== context && !isDocument(node) && node.parentNode
          return $(node)
        },
        parents: function(selector){
          var ancestors = [], nodes = this
          while (nodes.length > 0)
            nodes = $.map(nodes, function(node){
              if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                ancestors.push(node)
                return node
              }
            })
          return filtered(ancestors, selector)
        },
        parent: function(selector){
          return filtered(uniq(this.pluck('parentNode')), selector)
        },
        children: function(selector){
          return filtered(this.map(function(){ return children(this) }), selector)
        },
        contents: function() {
          return this.map(function() { return slice.call(this.childNodes) })
        },
        siblings: function(selector){
          return filtered(this.map(function(i, el){
            return filter.call(children(el.parentNode), function(child){ return child!==el })
          }), selector)
        },
        empty: function(){
          return this.each(function(){ this.innerHTML = '' })
        },
        // `pluck` is borrowed from Prototype.js
        pluck: function(property){
          return $.map(this, function(el){ return el[property] })
        },
        show: function(){
          return this.each(function(){
            this.style.display == "none" && (this.style.display = '')
            if (getComputedStyle(this, '').getPropertyValue("display") == "none")
              this.style.display = defaultDisplay(this.nodeName)
          })
        },
        replaceWith: function(newContent){
          return this.before(newContent).remove()
        },
        wrap: function(structure){
          var func = isFunction(structure)
          if (this[0] && !func)
            var dom   = $(structure).get(0),
                clone = dom.parentNode || this.length > 1

          return this.each(function(index){
            $(this).wrapAll(
              func ? structure.call(this, index) :
                clone ? dom.cloneNode(true) : dom
            )
          })
        },
        wrapAll: function(structure){
          if (this[0]) {
            $(this[0]).before(structure = $(structure))
            var children
            // drill down to the inmost element
            while ((children = structure.children()).length) structure = children.first()
            $(structure).append(this)
          }
          return this
        },
        wrapInner: function(structure){
          var func = isFunction(structure)
          return this.each(function(index){
            var self = $(this), contents = self.contents(),
                dom  = func ? structure.call(this, index) : structure
            contents.length ? contents.wrapAll(dom) : self.append(dom)
          })
        },
        unwrap: function(){
          this.parent().each(function(){
            $(this).replaceWith($(this).children())
          })
          return this
        },
        clone: function(){
          return this.map(function(){ return this.cloneNode(true) })
        },
        hide: function(){
          return this.css("display", "none")
        },
        toggle: function(setting){
          return this.each(function(){
            var el = $(this)
            ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
          })
        },
        prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
        next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
        html: function(html){
          return arguments.length === 0 ?
            (this.length > 0 ? this[0].innerHTML : null) :
            this.each(function(idx){
              var originHtml = this.innerHTML
              $(this).empty().append( funcArg(this, html, idx, originHtml) )
            })
        },
        text: function(text){
          return arguments.length === 0 ?
            (this.length > 0 ? this[0].textContent : null) :
            this.each(function(){ this.textContent = (text === undefined) ? '' : ''+text })
        },
        attr: function(name, value){
          var result
          return (typeof name == 'string' && value === undefined) ?
            (this.length == 0 || this[0].nodeType !== 1 ? undefined :
              (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
              (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
            ) :
            this.each(function(idx){
              if (this.nodeType !== 1) return
              if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
              else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
            })
        },
        removeAttr: function(name){
          return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
        },
        prop: function(name, value){
          name = propMap[name] || name
          return (value === undefined) ?
            (this[0] && this[0][name]) :
            this.each(function(idx){
              this[name] = funcArg(this, value, idx, this[name])
            })
        },
        data: function(name, value){
          var data = this.attr('data-' + name.replace(capitalRE, '-$1').toLowerCase(), value)
          return data !== null ? deserializeValue(data) : undefined
        },
        val: function(value){
          return arguments.length === 0 ?
            (this[0] && (this[0].multiple ?
               $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
               this[0].value)
            ) :
            this.each(function(idx){
              this.value = funcArg(this, value, idx, this.value)
            })
        },
        offset: function(coordinates){
          if (coordinates) return this.each(function(index){
            var $this = $(this),
                coords = funcArg(this, coordinates, index, $this.offset()),
                parentOffset = $this.offsetParent().offset(),
                props = {
                  top:  coords.top  - parentOffset.top,
                  left: coords.left - parentOffset.left
                }

            if ($this.css('position') == 'static') props['position'] = 'relative'
            $this.css(props)
          })
          if (this.length==0) return null
          var obj = this[0].getBoundingClientRect()
          return {
            left: obj.left + window.pageXOffset,
            top: obj.top + window.pageYOffset,
            width: Math.round(obj.width),
            height: Math.round(obj.height)
          }
        },
        css: function(property, value){
          if (arguments.length < 2) {
            var element = this[0], computedStyle = getComputedStyle(element, '')
            if(!element) return
            if (typeof property == 'string')
              return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
            else if (isArray(property)) {
              var props = {}
              $.each(isArray(property) ? property: [property], function(_, prop){
                props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
              })
              return props
            }
          }

          var css = ''
          if (type(property) == 'string') {
            if (!value && value !== 0)
              this.each(function(){ this.style.removeProperty(dasherize(property)) })
            else
              css = dasherize(property) + ":" + maybeAddPx(property, value)
          } else {
            for (key in property)
              if (!property[key] && property[key] !== 0)
                this.each(function(){ this.style.removeProperty(dasherize(key)) })
              else
                css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
          }

          return this.each(function(){ this.style.cssText += ';' + css })
        },
        index: function(element){
          return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
        },
        hasClass: function(name){
          if (!name) return false
          return emptyArray.some.call(this, function(el){
            return this.test(className(el))
          }, classRE(name))
        },
        addClass: function(name){
          if (!name) return this
          return this.each(function(idx){
            classList = []
            var cls = className(this), newName = funcArg(this, name, idx, cls)
            newName.split(/\s+/g).forEach(function(klass){
              if (!$(this).hasClass(klass)) classList.push(klass)
            }, this)
            classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
          })
        },
        removeClass: function(name){
          return this.each(function(idx){
            if (name === undefined) return className(this, '')
            classList = className(this)
            funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
              classList = classList.replace(classRE(klass), " ")
            })
            className(this, classList.trim())
          })
        },
        toggleClass: function(name, when){
          if (!name) return this
          return this.each(function(idx){
            var $this = $(this), names = funcArg(this, name, idx, className(this))
            names.split(/\s+/g).forEach(function(klass){
              (when === undefined ? !$this.hasClass(klass) : when) ?
                $this.addClass(klass) : $this.removeClass(klass)
            })
          })
        },
        scrollTop: function(value){
          if (!this.length) return
          var hasScrollTop = 'scrollTop' in this[0]
          if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
          return this.each(hasScrollTop ?
            function(){ this.scrollTop = value } :
            function(){ this.scrollTo(this.scrollX, value) })
        },
        scrollLeft: function(value){
          if (!this.length) return
          var hasScrollLeft = 'scrollLeft' in this[0]
          if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
          return this.each(hasScrollLeft ?
            function(){ this.scrollLeft = value } :
            function(){ this.scrollTo(value, this.scrollY) })
        },
        position: function() {
          if (!this.length) return

          var elem = this[0],
            // Get *real* offsetParent
            offsetParent = this.offsetParent(),
            // Get correct offsets
            offset       = this.offset(),
            parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

          // Subtract element margins
          // note: when an element has margin: auto the offsetLeft and marginLeft
          // are the same in Safari causing offset.left to incorrectly be 0
          offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
          offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

          // Add offsetParent borders
          parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
          parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

          // Subtract the two offsets
          return {
            top:  offset.top  - parentOffset.top,
            left: offset.left - parentOffset.left
          }
        },
        offsetParent: function() {
          return this.map(function(){
            var parent = this.offsetParent || document.body
            while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
              parent = parent.offsetParent
            return parent
          })
        }
      }

      // for now
      $.fn.detach = $.fn.remove

      // Generate the `width` and `height` functions
      ;['width', 'height'].forEach(function(dimension){
        var dimensionProperty =
          dimension.replace(/./, function(m){ return m[0].toUpperCase() })

        $.fn[dimension] = function(value){
          var offset, el = this[0]
          if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
            isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
            (offset = this.offset()) && offset[dimension]
          else return this.each(function(idx){
            el = $(this)
            el.css(dimension, funcArg(this, value, idx, el[dimension]()))
          })
        }
      })

      function traverseNode(node, fun) {
        fun(node)
        for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
      }

      // Generate the `after`, `prepend`, `before`, `append`,
      // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
      adjacencyOperators.forEach(function(operator, operatorIndex) {
        var inside = operatorIndex % 2 //=> prepend, append

        $.fn[operator] = function(){
          // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
          var argType, nodes = $.map(arguments, function(arg) {
                argType = type(arg)
                return argType == "object" || argType == "array" || arg == null ?
                  arg : zepto.fragment(arg)
              }),
              parent, copyByClone = this.length > 1
          if (nodes.length < 1) return this

          return this.each(function(_, target){
            parent = inside ? target : target.parentNode

            // convert all methods to a "before" operation
            target = operatorIndex == 0 ? target.nextSibling :
                     operatorIndex == 1 ? target.firstChild :
                     operatorIndex == 2 ? target :
                     null

            nodes.forEach(function(node){
              if (copyByClone) node = node.cloneNode(true)
              else if (!parent) return $(node).remove()

              traverseNode(parent.insertBefore(node, target), function(el){
                if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                   (!el.type || el.type === 'text/javascript') && !el.src)
                  window['eval'].call(window, el.innerHTML)
              })
            })
          })
        }

        // after    => insertAfter
        // prepend  => prependTo
        // before   => insertBefore
        // append   => appendTo
        $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
          $(html)[operator](this)
          return this
        }
      })

      zepto.Z.prototype = $.fn

      // Export internal API functions in the `$.zepto` namespace
      zepto.uniq = uniq
      zepto.deserializeValue = deserializeValue
      $.zepto = zepto

      return $
    })()

    window.Zepto = Zepto
    window.$ === undefined && (window.$ = Zepto)

    ;(function($){
      var $$ = $.zepto.qsa, _zid = 1, undefined,
          slice = Array.prototype.slice,
          isFunction = $.isFunction,
          isString = function(obj){ return typeof obj == 'string' },
          handlers = {},
          specialEvents={},
          focusinSupported = 'onfocusin' in window,
          focus = { focus: 'focusin', blur: 'focusout' },
          hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

      specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

      function zid(element) {
        return element._zid || (element._zid = _zid++)
      }
      function findHandlers(element, event, fn, selector) {
        event = parse(event)
        if (event.ns) var matcher = matcherFor(event.ns)
        return (handlers[zid(element)] || []).filter(function(handler) {
          return handler
            && (!event.e  || handler.e == event.e)
            && (!event.ns || matcher.test(handler.ns))
            && (!fn       || zid(handler.fn) === zid(fn))
            && (!selector || handler.sel == selector)
        })
      }
      function parse(event) {
        var parts = ('' + event).split('.')
        return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
      }
      function matcherFor(ns) {
        return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
      }

      function eventCapture(handler, captureSetting) {
        return handler.del &&
          (!focusinSupported && (handler.e in focus)) ||
          !!captureSetting
      }

      function realEvent(type) {
        return hover[type] || (focusinSupported && focus[type]) || type
      }

      function add(element, events, fn, data, selector, delegator, capture){
        var id = zid(element), set = (handlers[id] || (handlers[id] = []))
        events.split(/\s/).forEach(function(event){
          if (event == 'ready') return $(document).ready(fn)
          var handler   = parse(event)
          handler.fn    = fn
          handler.sel   = selector
          // emulate mouseenter, mouseleave
          if (handler.e in hover) fn = function(e){
            var related = e.relatedTarget
            if (!related || (related !== this && !$.contains(this, related)))
              return handler.fn.apply(this, arguments)
          }
          handler.del   = delegator
          var callback  = delegator || fn
          handler.proxy = function(e){
            e = compatible(e)
            if (e.isImmediatePropagationStopped()) return
            e.data = data
            var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
            if (result === false) e.preventDefault(), e.stopPropagation()
            return result
          }
          handler.i = set.length
          set.push(handler)
          if ('addEventListener' in element)
            element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
        })
      }
      function remove(element, events, fn, selector, capture){
        var id = zid(element)
        ;(events || '').split(/\s/).forEach(function(event){
          findHandlers(element, event, fn, selector).forEach(function(handler){
            delete handlers[id][handler.i]
          if ('removeEventListener' in element)
            element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
          })
        })
      }

      $.event = { add: add, remove: remove }

      $.proxy = function(fn, context) {
        if (isFunction(fn)) {
          var proxyFn = function(){ return fn.apply(context, arguments) }
          proxyFn._zid = zid(fn)
          return proxyFn
        } else if (isString(context)) {
          return $.proxy(fn[context], fn)
        } else {
          throw new TypeError("expected function")
        }
      }

      $.fn.bind = function(event, data, callback){
        return this.on(event, data, callback)
      }
      $.fn.unbind = function(event, callback){
        return this.off(event, callback)
      }
      $.fn.one = function(event, selector, data, callback){
        return this.on(event, selector, data, callback, 1)
      }

      var returnTrue = function(){return true},
          returnFalse = function(){return false},
          ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
          eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
          }

      function compatible(event, source) {
        if (source || !event.isDefaultPrevented) {
          source || (source = event)

          $.each(eventMethods, function(name, predicate) {
            var sourceMethod = source[name]
            event[name] = function(){
              this[predicate] = returnTrue
              return sourceMethod && sourceMethod.apply(source, arguments)
            }
            event[predicate] = returnFalse
          })

          if (source.defaultPrevented !== undefined ? source.defaultPrevented :
              'returnValue' in source ? source.returnValue === false :
              source.getPreventDefault && source.getPreventDefault())
            event.isDefaultPrevented = returnTrue
        }
        return event
      }

      function createProxy(event) {
        var key, proxy = { originalEvent: event }
        for (key in event)
          if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

        return compatible(proxy, event)
      }

      $.fn.delegate = function(selector, event, callback){
        return this.on(event, selector, callback)
      }
      $.fn.undelegate = function(selector, event, callback){
        return this.off(event, selector, callback)
      }

      $.fn.live = function(event, callback){
        $(document.body).delegate(this.selector, event, callback)
        return this
      }
      $.fn.die = function(event, callback){
        $(document.body).undelegate(this.selector, event, callback)
        return this
      }

      $.fn.on = function(event, selector, data, callback, one){
        var autoRemove, delegator, $this = this
        if (event && !isString(event)) {
          $.each(event, function(type, fn){
            $this.on(type, selector, data, fn, one)
          })
          return $this
        }

        if (!isString(selector) && !isFunction(callback) && callback !== false)
          callback = data, data = selector, selector = undefined
        if (isFunction(data) || data === false)
          callback = data, data = undefined

        if (callback === false) callback = returnFalse

        return $this.each(function(_, element){
          if (one) autoRemove = function(e){
            remove(element, e.type, callback)
            return callback.apply(this, arguments)
          }

          if (selector) delegator = function(e){
            var evt, match = $(e.target).closest(selector, element).get(0)
            if (match && match !== element) {
              evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
              return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
            }
          }

          add(element, event, callback, data, selector, delegator || autoRemove)
        })
      }
      $.fn.off = function(event, selector, callback){
        var $this = this
        if (event && !isString(event)) {
          $.each(event, function(type, fn){
            $this.off(type, selector, fn)
          })
          return $this
        }

        if (!isString(selector) && !isFunction(callback) && callback !== false)
          callback = selector, selector = undefined

        if (callback === false) callback = returnFalse

        return $this.each(function(){
          remove(this, event, callback, selector)
        })
      }

      $.fn.trigger = function(event, args){
        event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
        event._args = args
        return this.each(function(){
          // items in the collection might not be DOM elements
          if('dispatchEvent' in this) this.dispatchEvent(event)
          else $(this).triggerHandler(event, args)
        })
      }

      // triggers event handlers on current element just as if an event occurred,
      // doesn't trigger an actual event, doesn't bubble
      $.fn.triggerHandler = function(event, args){
        var e, result
        this.each(function(i, element){
          e = createProxy(isString(event) ? $.Event(event) : event)
          e._args = args
          e.target = element
          $.each(findHandlers(element, event.type || event), function(i, handler){
            result = handler.proxy(e)
            if (e.isImmediatePropagationStopped()) return false
          })
        })
        return result
      }

      // shortcut methods for `.bind(event, fn)` for each event type
      ;('focusin focusout load resize scroll unload click dblclick '+
      'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
      'change select keydown keypress keyup error').split(' ').forEach(function(event) {
        $.fn[event] = function(callback) {
          return callback ?
            this.bind(event, callback) :
            this.trigger(event)
        }
      })

      ;['focus', 'blur'].forEach(function(name) {
        $.fn[name] = function(callback) {
          if (callback) this.bind(name, callback)
          else this.each(function(){
            try { this[name]() }
            catch(e) {}
          })
          return this
        }
      })

      $.Event = function(type, props) {
        if (!isString(type)) props = type, type = props.type
        var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(type, bubbles, true)
        return compatible(event)
      }

    })(Zepto)

    ;(function($){
      var jsonpID = 0,
          document = window.document,
          key,
          name,
          rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          scriptTypeRE = /^(?:text|application)\/javascript/i,
          xmlTypeRE = /^(?:text|application)\/xml/i,
          jsonType = 'application/json',
          htmlType = 'text/html',
          blankRE = /^\s*$/

      // trigger a custom event and return false if it was cancelled
      function triggerAndReturn(context, eventName, data) {
        var event = $.Event(eventName)
        $(context).trigger(event, data)
        return !event.isDefaultPrevented()
      }

      // trigger an Ajax "global" event
      function triggerGlobal(settings, context, eventName, data) {
        if (settings.global) return triggerAndReturn(context || document, eventName, data)
      }

      // Number of active Ajax requests
      $.active = 0

      function ajaxStart(settings) {
        if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
      }
      function ajaxStop(settings) {
        if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
      }

      // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
      function ajaxBeforeSend(xhr, settings) {
        var context = settings.context
        if (settings.beforeSend.call(context, xhr, settings) === false ||
            triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
          return false

        triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
      }
      function ajaxSuccess(data, xhr, settings, deferred) {
        var context = settings.context, status = 'success'
        settings.success.call(context, data, status, xhr)
        if (deferred) deferred.resolveWith(context, [data, status, xhr])
        triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
        ajaxComplete(status, xhr, settings)
      }
      // type: "timeout", "error", "abort", "parsererror"
      function ajaxError(error, type, xhr, settings, deferred) {
        var context = settings.context
        settings.error.call(context, xhr, type, error)
        if (deferred) deferred.rejectWith(context, [xhr, type, error])
        triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
        ajaxComplete(type, xhr, settings)
      }
      // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
      function ajaxComplete(status, xhr, settings) {
        var context = settings.context
        settings.complete.call(context, xhr, status)
        triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
        ajaxStop(settings)
      }

      // Empty function, used as default callback
      function empty() {}

      $.ajaxJSONP = function(options, deferred){
        if (!('type' in options)) return $.ajax(options)

        var _callbackName = options.jsonpCallback,
          callbackName = ($.isFunction(_callbackName) ?
            _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
          script = document.createElement('script'),
          originalCallback = window[callbackName],
          responseData,
          abort = function(errorType) {
            $(script).triggerHandler('error', errorType || 'abort')
          },
          xhr = { abort: abort }, abortTimeout

        if (deferred) deferred.promise(xhr)

        $(script).on('load error', function(e, errorType){
          clearTimeout(abortTimeout)
          $(script).off().remove()

          if (e.type == 'error' || !responseData) {
            ajaxError(null, errorType || 'error', xhr, options, deferred)
          } else {
            ajaxSuccess(responseData[0], xhr, options, deferred)
          }

          window[callbackName] = originalCallback
          if (responseData && $.isFunction(originalCallback))
            originalCallback(responseData[0])

          originalCallback = responseData = undefined
        })

        if (ajaxBeforeSend(xhr, options) === false) {
          abort('abort')
          return xhr
        }

        window[callbackName] = function(){
          responseData = arguments
        }

        script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
        document.head.appendChild(script)

        if (options.timeout > 0) abortTimeout = setTimeout(function(){
          abort('timeout')
        }, options.timeout)

        return xhr
      }

      $.ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport
        xhr: function () {
          return new window.XMLHttpRequest()
        },
        // MIME types mapping
        // IIS returns Javascript as "application/x-javascript"
        accepts: {
          script: 'text/javascript, application/javascript, application/x-javascript',
          json:   jsonType,
          xml:    'application/xml, text/xml',
          html:   htmlType,
          text:   'text/plain'
        },
        // Whether the request is to another domain
        crossDomain: false,
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true
      }

      function mimeToDataType(mime) {
        if (mime) mime = mime.split(';', 2)[0]
        return mime && ( mime == htmlType ? 'html' :
          mime == jsonType ? 'json' :
          scriptTypeRE.test(mime) ? 'script' :
          xmlTypeRE.test(mime) && 'xml' ) || 'text'
      }

      function appendQuery(url, query) {
        if (query == '') return url
        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
      }

      // serialize payload and append it to the URL for GET requests
      function serializeData(options) {
        if (options.processData && options.data && $.type(options.data) != "string")
          options.data = $.param(options.data, options.traditional)
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
          options.url = appendQuery(options.url, options.data), options.data = undefined
      }

      $.ajax = function(options){
        var settings = $.extend({}, options || {}),
            deferred = $.Deferred && $.Deferred()
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

        ajaxStart(settings)

        if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
          RegExp.$2 != window.location.host

        if (!settings.url) settings.url = window.location.toString()
        serializeData(settings)
        if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

        var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
        if (dataType == 'jsonp' || hasPlaceholder) {
          if (!hasPlaceholder)
            settings.url = appendQuery(settings.url,
              settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
          return $.ajaxJSONP(settings, deferred)
        }

        var mime = settings.accepts[dataType],
            headers = { },
            setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = settings.xhr(),
            nativeSetHeader = xhr.setRequestHeader,
            abortTimeout

        if (deferred) deferred.promise(xhr)

        if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
        setHeader('Accept', mime || '*/*')
        if (mime = settings.mimeType || mime) {
          if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
          xhr.overrideMimeType && xhr.overrideMimeType(mime)
        }
        if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
          setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

        if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
        xhr.setRequestHeader = setHeader

        xhr.onreadystatechange = function(){
          if (xhr.readyState == 4) {
            xhr.onreadystatechange = empty
            clearTimeout(abortTimeout)
            var result, error = false
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
              dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
              result = xhr.responseText

              try {
                // http://perfectionkills.com/global-eval-what-are-the-options/
                if (dataType == 'script')    (1,eval)(result)
                else if (dataType == 'xml')  result = xhr.responseXML
                else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
              } catch (e) { error = e }

              if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
              else ajaxSuccess(result, xhr, settings, deferred)
            } else {
              ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
            }
          }
        }

        if (ajaxBeforeSend(xhr, settings) === false) {
          xhr.abort()
          ajaxError(null, 'abort', xhr, settings, deferred)
          return xhr
        }

        if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

        var async = 'async' in settings ? settings.async : true
        xhr.open(settings.type, settings.url, async, settings.username, settings.password)

        for (name in headers) nativeSetHeader.apply(xhr, headers[name])

        if (settings.timeout > 0) abortTimeout = setTimeout(function(){
            xhr.onreadystatechange = empty
            xhr.abort()
            ajaxError(null, 'timeout', xhr, settings, deferred)
          }, settings.timeout)

        // avoid sending empty string (#319)
        xhr.send(settings.data ? settings.data : null)
        return xhr
      }

      // handle optional data/success arguments
      function parseArguments(url, data, success, dataType) {
        var hasData = !$.isFunction(data)
        return {
          url:      url,
          data:     hasData  ? data : undefined,
          success:  !hasData ? data : $.isFunction(success) ? success : undefined,
          dataType: hasData  ? dataType || success : success
        }
      }

      $.get = function(url, data, success, dataType){
        return $.ajax(parseArguments.apply(null, arguments))
      }

      $.post = function(url, data, success, dataType){
        var options = parseArguments.apply(null, arguments)
        options.type = 'POST'
        return $.ajax(options)
      }

      $.getJSON = function(url, data, success){
        var options = parseArguments.apply(null, arguments)
        options.dataType = 'json'
        return $.ajax(options)
      }

      $.fn.load = function(url, data, success){
        if (!this.length) return this
        var self = this, parts = url.split(/\s/), selector,
            options = parseArguments(url, data, success),
            callback = options.success
        if (parts.length > 1) options.url = parts[0], selector = parts[1]
        options.success = function(response){
          self.html(selector ?
            $('<div>').html(response.replace(rscript, "")).find(selector)
            : response)
          callback && callback.apply(self, arguments)
        }
        $.ajax(options)
        return this
      }

      var escape = encodeURIComponent

      function serialize(params, obj, traditional, scope){
        var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
        $.each(obj, function(key, value) {
          type = $.type(value)
          if (scope) key = traditional ? scope :
            scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
          // handle data in serializeArray() format
          if (!scope && array) params.add(value.name, value.value)
          // recurse into nested objects
          else if (type == "array" || (!traditional && type == "object"))
            serialize(params, value, traditional, key)
          else params.add(key, value)
        })
      }

      $.param = function(obj, traditional){
        var params = []
        params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
        serialize(params, obj, traditional)
        return params.join('&').replace(/%20/g, '+')
      }
    })(Zepto)

    ;(function($){
      $.fn.serializeArray = function() {
        var result = [], el
        $([].slice.call(this.get(0).elements)).each(function(){
          el = $(this)
          var type = el.attr('type')
          if (this.nodeName.toLowerCase() != 'fieldset' &&
            !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
            ((type != 'radio' && type != 'checkbox') || this.checked))
            result.push({
              name: el.attr('name'),
              value: el.val()
            })
        })
        return result
      }

      $.fn.serialize = function(){
        var result = []
        this.serializeArray().forEach(function(elm){
          result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
        })
        return result.join('&')
      }

      $.fn.submit = function(callback) {
        if (callback) this.bind('submit', callback)
        else if (this.length) {
          var event = $.Event('submit')
          this.eq(0).trigger(event)
          if (!event.isDefaultPrevented()) this.get(0).submit()
        }
        return this
      }

    })(Zepto)

    ;(function($){
      // __proto__ doesn't exist on IE<11, so redefine
      // the Z function to use object extension instead
      if (!('__proto__' in {})) {
        $.extend($.zepto, {
          Z: function(dom, selector){
            dom = dom || []
            $.extend(dom, $.fn)
            dom.selector = selector || ''
            dom.__Z = true
            return dom
          },
          // this is a kludge but works
          isZ: function(object){
            return $.type(object) === 'array' && '__Z' in object
          }
        })
      }

      // getComputedStyle shouldn't freak out when called
      // without a valid element as argument
      try {
        getComputedStyle(undefined)
      } catch(e) {
        var nativeGetComputedStyle = getComputedStyle;
        window.getComputedStyle = function(element){
          try {
            return nativeGetComputedStyle(element)
          } catch(e) {
            return null
          }
        }
      }
    })(Zepto)


  KL.getJSON = Zepto.getJSON;
	KL.ajax = Zepto.ajax;
})(KL)

//     Based on https://github.com/madrobby/zepto/blob/5585fe00f1828711c04208372265a5d71e3238d1/src/ajax.js
//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
/*
Copyright (c) 2010-2012 Thomas Fuchs
http://zeptojs.com

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal 
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.
*/


/* The equations defined here are open source under BSD License.
 * http://www.robertpenner.com/easing_terms_of_use.html (c) 2003 Robert Penner
 * Adapted to single time-based by
 * Brian Crescimanno <brian.crescimanno@gmail.com>
 * Ken Snyder <kendsnyder@gmail.com>
 */

/** MIT License
 *
 * KeySpline - use bezier curve for transition easing function
 * Copyright (c) 2012 Gaetan Renaudeau <renaudeau.gaetan@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * KeySpline - use bezier curve for transition easing function
 * is inspired from Firefox's nsSMILKeySpline.cpp
 * Usage:
 * var spline = new KeySpline(0.25, 0.1, 0.25, 1.0)
 * spline.get(x) => returns the easing value | x must be in [0, 1] range
 */

KL.Easings = {
    ease:        [0.25, 0.1, 0.25, 1.0], 
    linear:      [0.00, 0.0, 1.00, 1.0],
    easein:     [0.42, 0.0, 1.00, 1.0],
    easeout:    [0.00, 0.0, 0.58, 1.0],
    easeinout: [0.42, 0.0, 0.58, 1.0]
};

KL.Ease = {
	KeySpline: function(a) {
	//KeySpline: function(mX1, mY1, mX2, mY2) {
		this.get = function(aX) {
			if (a[0] == a[1] && a[2] == a[3]) return aX; // linear
			return CalcBezier(GetTForX(aX), a[1], a[3]);
		}

		function A(aA1, aA2) {
			return 1.0 - 3.0 * aA2 + 3.0 * aA1;
		}

		function B(aA1, aA2) {
			return 3.0 * aA2 - 6.0 * aA1;
		}

		function C(aA1) {
			return 3.0 * aA1;
		}

		// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.

		function CalcBezier(aT, aA1, aA2) {
			return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
		}

		// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.

		function GetSlope(aT, aA1, aA2) {
			return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
		}

		function GetTForX(aX) {
			// Newton raphson iteration
			var aGuessT = aX;
			for (var i = 0; i < 4; ++i) {
				var currentSlope = GetSlope(aGuessT, a[0], a[2]);
				if (currentSlope == 0.0) return aGuessT;
				var currentX = CalcBezier(aGuessT, a[0], a[2]) - aX;
				aGuessT -= currentX / currentSlope;
			}
			return aGuessT;
		}
	},
	
	easeInSpline: function(t) {
		var spline = new KL.Ease.KeySpline(KL.Easings.easein);
		return spline.get(t);
	},
	
	easeInOutExpo: function(t) {
		var spline = new KL.Ease.KeySpline(KL.Easings.easein);
		return spline.get(t);
	},
	
	easeOut: function(t) {
		return Math.sin(t * Math.PI / 2);
	},
	easeOutStrong: function(t) {
		return (t == 1) ? 1 : 1 - Math.pow(2, - 10 * t);
	},
	easeIn: function(t) {
		return t * t;
	},
	easeInStrong: function(t) {
		return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
	},
	easeOutBounce: function(pos) {
		if ((pos) < (1 / 2.75)) {
			return (7.5625 * pos * pos);
		} else if (pos < (2 / 2.75)) {
			return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
		} else if (pos < (2.5 / 2.75)) {
			return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
		} else {
			return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
		}
	},
	easeInBack: function(pos) {
		var s = 1.70158;
		return (pos) * pos * ((s + 1) * pos - s);
	},
	easeOutBack: function(pos) {
		var s = 1.70158;
		return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
	},
	bounce: function(t) {
		if (t < (1 / 2.75)) {
			return 7.5625 * t * t;
		}
		if (t < (2 / 2.75)) {
			return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
		}
		if (t < (2.5 / 2.75)) {
			return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
		}
		return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
	},
	bouncePast: function(pos) {
		if (pos < (1 / 2.75)) {
			return (7.5625 * pos * pos);
		} else if (pos < (2 / 2.75)) {
			return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
		} else if (pos < (2.5 / 2.75)) {
			return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
		} else {
			return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
		}
	},
	swingTo: function(pos) {
		var s = 1.70158;
		return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
	},
	swingFrom: function(pos) {
		var s = 1.70158;
		return pos * pos * ((s + 1) * pos - s);
	},
	elastic: function(pos) {
		return -1 * Math.pow(4, - 8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
	},
	spring: function(pos) {
		return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
	},
	blink: function(pos, blinks) {
		return Math.round(pos * (blinks || 5)) % 2;
	},
	pulse: function(pos, pulses) {
		return (-Math.cos((pos * ((pulses || 5) - .5) * 2) * Math.PI) / 2) + .5;
	},
	wobble: function(pos) {
		return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + 0.5;
	},
	sinusoidal: function(pos) {
		return (-Math.cos(pos * Math.PI) / 2) + 0.5;
	},
	flicker: function(pos) {
		var pos = pos + (Math.random() - 0.5) / 5;
		return easings.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
	},
	mirror: function(pos) {
		if (pos < 0.5) return easings.sinusoidal(pos * 2);
		else return easings.sinusoidal(1 - (pos - 0.5) * 2);
	},
	// accelerating from zero velocity
	easeInQuad: function (t) { return t*t },
	// decelerating to zero velocity
	easeOutQuad: function (t) { return t*(2-t) },
	// acceleration until halfway, then deceleration
	easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
	// accelerating from zero velocity 
	easeInCubic: function (t) { return t*t*t },
	// decelerating to zero velocity 
	easeOutCubic: function (t) { return (--t)*t*t+1 },
	// acceleration until halfway, then deceleration 
	easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
	// accelerating from zero velocity 
	easeInQuart: function (t) { return t*t*t*t },
	// decelerating to zero velocity 
	easeOutQuart: function (t) { return 1-(--t)*t*t*t },
	// acceleration until halfway, then deceleration
	easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
	// accelerating from zero velocity
	easeInQuint: function (t) { return t*t*t*t*t },
	// decelerating to zero velocity
	easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
	// acceleration until halfway, then deceleration 
	easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
};

/*
Math.easeInExpo = function (t, b, c, d) {
	return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
};

		

// exponential easing out - decelerating to zero velocity


Math.easeOutExpo = function (t, b, c, d) {
	return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
};

		

// exponential easing in/out - accelerating until halfway, then decelerating


Math.easeInOutExpo = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
	t--;
	return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
};
*/

/*	KL.Animate
	Basic animation
================================================== */

KL.Animate = function(el, options) {
	var animation = new vcoanimate(el, options),
		webkit_timeout;
		/*
		// POSSIBLE ISSUE WITH WEBKIT FUTURE BUILDS
	var onWebKitTimeout = function() {

		animation.stop(true);
	}
	if (KL.Browser.webkit) {
		webkit_timeout = setTimeout(function(){onWebKitTimeout()}, options.duration);
	}
	*/
	return animation;
};


/*	Based on: Morpheus
	https://github.com/ded/morpheus - (c) Dustin Diaz 2011
	License MIT
================================================== */
window.vcoanimate = (function() {

	var doc = document,
		win = window,
		perf = win.performance,
		perfNow = perf && (perf.now || perf.webkitNow || perf.msNow || perf.mozNow),
		now = perfNow ? function () { return perfNow.call(perf) } : function () { return +new Date() },
		html = doc.documentElement,
		fixTs = false, // feature detected below
		thousand = 1000,
		rgbOhex = /^rgb\(|#/,
		relVal = /^([+\-])=([\d\.]+)/,
		numUnit = /^(?:[\+\-]=?)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/,
		rotate = /rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/,
		scale = /scale\(((?:[+\-]=)?([\d\.]+))\)/,
		skew = /skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/,
		translate = /translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/,
		// these elements do not require 'px'
		unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, transform: 1};

  // which property name does this browser use for transform
	var transform = function () {
		var styles = doc.createElement('a').style,
			props = ['webkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'Transform'],
			i;

		for (i = 0; i < props.length; i++) {
			if (props[i] in styles) return props[i]
		};
	}();

	// does this browser support the opacity property?
	var opacity = function () {
		return typeof doc.createElement('a').style.opacity !== 'undefined'
	}();

	// initial style is determined by the elements themselves
	var getStyle = doc.defaultView && doc.defaultView.getComputedStyle ?
	function (el, property) {
		property = property == 'transform' ? transform : property
		property = camelize(property)
		var value = null,
			computed = doc.defaultView.getComputedStyle(el, '');

		computed && (value = computed[property]);
		return el.style[property] || value;
	} : html.currentStyle ?

    function (el, property) {
		property = camelize(property)

		if (property == 'opacity') {
			var val = 100
			try {
				val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity
			} catch (e1) {
				try {
					val = el.filters('alpha').opacity
				} catch (e2) {

				}
			}
			return val / 100
		}
		var value = el.currentStyle ? el.currentStyle[property] : null
		return el.style[property] || value
	} :

    function (el, property) {
		return el.style[camelize(property)]
    }

  var frame = function () {
    // native animation frames
    // http://webstuff.nfshost.com/anim-timing/Overview.html
    // http://dev.chromium.org/developers/design-documents/requestanimationframe-implementation
    return win.requestAnimationFrame  ||
      win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame    ||
      win.msRequestAnimationFrame     ||
      win.oRequestAnimationFrame      ||
      function (callback) {
        win.setTimeout(function () {
          callback(+new Date())
        }, 17) // when I was 17..
      }
  }()

  var children = []

	frame(function(timestamp) {
	  	// feature-detect if rAF and now() are of the same scale (epoch or high-res),
		// if not, we have to do a timestamp fix on each frame
		fixTs = timestamp > 1e12 != now() > 1e12
	})

  function has(array, elem, i) {
    if (Array.prototype.indexOf) return array.indexOf(elem)
    for (i = 0; i < array.length; ++i) {
      if (array[i] === elem) return i
    }
  }

  function render(timestamp) {
    var i, count = children.length
    // if we're using a high res timer, make sure timestamp is not the old epoch-based value.
    // http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
    if (perfNow && timestamp > 1e12) timestamp = now()
	if (fixTs) timestamp = now()
    for (i = count; i--;) {
      children[i](timestamp)
    }
    children.length && frame(render)
  }

  function live(f) {
    if (children.push(f) === 1) frame(render)
  }

  function die(f) {
    var rest, index = has(children, f)
    if (index >= 0) {
      rest = children.slice(index + 1)
      children.length = index
      children = children.concat(rest)
    }
  }

  function parseTransform(style, base) {
    var values = {}, m
    if (m = style.match(rotate)) values.rotate = by(m[1], base ? base.rotate : null)
    if (m = style.match(scale)) values.scale = by(m[1], base ? base.scale : null)
    if (m = style.match(skew)) {values.skewx = by(m[1], base ? base.skewx : null); values.skewy = by(m[3], base ? base.skewy : null)}
    if (m = style.match(translate)) {values.translatex = by(m[1], base ? base.translatex : null); values.translatey = by(m[3], base ? base.translatey : null)}
    return values
  }

  function formatTransform(v) {
    var s = ''
    if ('rotate' in v) s += 'rotate(' + v.rotate + 'deg) '
    if ('scale' in v) s += 'scale(' + v.scale + ') '
    if ('translatex' in v) s += 'translate(' + v.translatex + 'px,' + v.translatey + 'px) '
    if ('skewx' in v) s += 'skew(' + v.skewx + 'deg,' + v.skewy + 'deg)'
    return s
  }

  function rgb(r, g, b) {
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
  }

  // convert rgb and short hex to long hex
  function toHex(c) {
    var m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    return (m ? rgb(m[1], m[2], m[3]) : c)
      .replace(/#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3') // short skirt to long jacket
  }

  // change font-size => fontSize etc.
  function camelize(s) {
    return s.replace(/-(.)/g, function (m, m1) {
      return m1.toUpperCase()
    })
  }

  // aren't we having it?
  function fun(f) {
    return typeof f == 'function'
  }

  function nativeTween(t) {
    // default to a pleasant-to-the-eye easeOut (like native animations)
    return Math.sin(t * Math.PI / 2)
  }

  /**
    * Core tween method that requests each frame
    * @param duration: time in milliseconds. defaults to 1000
    * @param fn: tween frame callback function receiving 'position'
    * @param done {optional}: complete callback function
    * @param ease {optional}: easing method. defaults to easeOut
    * @param from {optional}: integer to start from
    * @param to {optional}: integer to end at
    * @returns method to stop the animation
    */
  function tween(duration, fn, done, ease, from, to) {
    ease = fun(ease) ? ease : morpheus.easings[ease] || nativeTween
    var time = duration || thousand
      , self = this
      , diff = to - from
      , start = now()
      , stop = 0
      , end = 0

    function run(t) {
      var delta = t - start
      if (delta > time || stop) {
        to = isFinite(to) ? to : 1
        stop ? end && fn(to) : fn(to)
        die(run)
        return done && done.apply(self)
      }
      // if you don't specify a 'to' you can use tween as a generic delta tweener
      // cool, eh?
      isFinite(to) ?
        fn((diff * ease(delta / time)) + from) :
        fn(ease(delta / time))
    }

    live(run)

    return {
      stop: function (jump) {
        stop = 1
        end = jump // jump to end of animation?
        if (!jump) done = null // remove callback if not jumping to end
      }
    }
  }

  /**
    * generic bezier method for animating x|y coordinates
    * minimum of 2 points required (start and end).
    * first point start, last point end
    * additional control points are optional (but why else would you use this anyway ;)
    * @param points: array containing control points
       [[0, 0], [100, 200], [200, 100]]
    * @param pos: current be(tween) position represented as float  0 - 1
    * @return [x, y]
    */
  function bezier(points, pos) {
    var n = points.length, r = [], i, j
    for (i = 0; i < n; ++i) {
      r[i] = [points[i][0], points[i][1]]
    }
    for (j = 1; j < n; ++j) {
      for (i = 0; i < n - j; ++i) {
        r[i][0] = (1 - pos) * r[i][0] + pos * r[parseInt(i + 1, 10)][0]
        r[i][1] = (1 - pos) * r[i][1] + pos * r[parseInt(i + 1, 10)][1]
      }
    }
    return [r[0][0], r[0][1]]
  }

  // this gets you the next hex in line according to a 'position'
  function nextColor(pos, start, finish) {
    var r = [], i, e, from, to
    for (i = 0; i < 6; i++) {
      from = Math.min(15, parseInt(start.charAt(i),  16))
      to   = Math.min(15, parseInt(finish.charAt(i), 16))
      e = Math.floor((to - from) * pos + from)
      e = e > 15 ? 15 : e < 0 ? 0 : e
      r[i] = e.toString(16)
    }
    return '#' + r.join('')
  }

  // this retreives the frame value within a sequence
  function getTweenVal(pos, units, begin, end, k, i, v) {
    if (k == 'transform') {
      v = {}
      for (var t in begin[i][k]) {
        v[t] = (t in end[i][k]) ? Math.round(((end[i][k][t] - begin[i][k][t]) * pos + begin[i][k][t]) * thousand) / thousand : begin[i][k][t]
      }
      return v
    } else if (typeof begin[i][k] == 'string') {
      return nextColor(pos, begin[i][k], end[i][k])
    } else {
      // round so we don't get crazy long floats
      v = Math.round(((end[i][k] - begin[i][k]) * pos + begin[i][k]) * thousand) / thousand
      // some css properties don't require a unit (like zIndex, lineHeight, opacity)
      if (!(k in unitless)) v += units[i][k] || 'px'
      return v
    }
  }

  // support for relative movement via '+=n' or '-=n'
  function by(val, start, m, r, i) {
    return (m = relVal.exec(val)) ?
      (i = parseFloat(m[2])) && (start + (m[1] == '+' ? 1 : -1) * i) :
      parseFloat(val)
  }

  /**
    * morpheus:
    * @param element(s): HTMLElement(s)
    * @param options: mixed bag between CSS Style properties & animation options
    *  - {n} CSS properties|values
    *     - value can be strings, integers,
    *     - or callback function that receives element to be animated. method must return value to be tweened
    *     - relative animations start with += or -= followed by integer
    *  - duration: time in ms - defaults to 1000(ms)
    *  - easing: a transition method - defaults to an 'easeOut' algorithm
    *  - complete: a callback method for when all elements have finished
    *  - bezier: array of arrays containing x|y coordinates that define the bezier points. defaults to none
    *     - this may also be a function that receives element to be animated. it must return a value
    */
  function morpheus(elements, options) {
    var els = elements ? (els = isFinite(elements.length) ? elements : [elements]) : [], i
      , complete = options.complete
      , duration = options.duration
      , ease = options.easing
      , points = options.bezier
      , begin = []
      , end = []
      , units = []
      , bez = []
      , originalLeft
      , originalTop

    if (points) {
      // remember the original values for top|left
      originalLeft = options.left;
      originalTop = options.top;
      delete options.right;
      delete options.bottom;
      delete options.left;
      delete options.top;
    }

    for (i = els.length; i--;) {

      // record beginning and end states to calculate positions
      begin[i] = {}
      end[i] = {}
      units[i] = {}

      // are we 'moving'?
      if (points) {

        var left = getStyle(els[i], 'left')
          , top = getStyle(els[i], 'top')
          , xy = [by(fun(originalLeft) ? originalLeft(els[i]) : originalLeft || 0, parseFloat(left)),
                  by(fun(originalTop) ? originalTop(els[i]) : originalTop || 0, parseFloat(top))]

        bez[i] = fun(points) ? points(els[i], xy) : points
        bez[i].push(xy)
        bez[i].unshift([
          parseInt(left, 10),
          parseInt(top, 10)
        ])
      }

      for (var k in options) {
        switch (k) {
        case 'complete':
        case 'duration':
        case 'easing':
        case 'bezier':
          continue
        }
        var v = getStyle(els[i], k), unit
          , tmp = fun(options[k]) ? options[k](els[i]) : options[k]
        if (typeof tmp == 'string' &&
            rgbOhex.test(tmp) &&
            !rgbOhex.test(v)) {
          delete options[k]; // remove key :(
          continue; // cannot animate colors like 'orange' or 'transparent'
                    // only #xxx, #xxxxxx, rgb(n,n,n)
        }

        begin[i][k] = k == 'transform' ? parseTransform(v) :
          typeof tmp == 'string' && rgbOhex.test(tmp) ?
            toHex(v).slice(1) :
            parseFloat(v)
        end[i][k] = k == 'transform' ? parseTransform(tmp, begin[i][k]) :
          typeof tmp == 'string' && tmp.charAt(0) == '#' ?
            toHex(tmp).slice(1) :
            by(tmp, parseFloat(v));
        // record original unit
        (typeof tmp == 'string') && (unit = tmp.match(numUnit)) && (units[i][k] = unit[1])
      }
    }
    // ONE TWEEN TO RULE THEM ALL
    return tween.apply(els, [duration, function (pos, v, xy) {
      // normally not a fan of optimizing for() loops, but we want something
      // fast for animating
      for (i = els.length; i--;) {
        if (points) {
          xy = bezier(bez[i], pos)
          els[i].style.left = xy[0] + 'px'
          els[i].style.top = xy[1] + 'px'
        }
        for (var k in options) {
          v = getTweenVal(pos, units, begin, end, k, i)
          k == 'transform' ?
            els[i].style[transform] = formatTransform(v) :
            k == 'opacity' && !opacity ?
              (els[i].style.filter = 'alpha(opacity=' + (v * 100) + ')') :
              (els[i].style[camelize(k)] = v)
        }
      }
    }, complete, ease])
  }

  // expose useful methods
  morpheus.tween = tween
  morpheus.getStyle = getStyle
  morpheus.bezier = bezier
  morpheus.transform = transform
  morpheus.parseTransform = parseTransform
  morpheus.formatTransform = formatTransform
  morpheus.easings = {}

  return morpheus
})();


/*	KL.DomMixins
	DOM methods used regularly
	Assumes there is a _el.container and animator
================================================== */
KL.DomMixins = {
	
	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function(animate) {
		if (animate) {
			/*
			this.animator = KL.Animate(this._el.container, {
				left: 		-(this._el.container.offsetWidth * n) + "px",
				duration: 	this.options.duration,
				easing: 	this.options.ease
			});
			*/
		} else {
			this._el.container.style.display = "block";
		}
	},
	
	hide: function(animate) {
		this._el.container.style.display = "none";
	},
	
	addTo: function(container) {
		container.appendChild(this._el.container);
		this.onAdd();
	},
	
	removeFrom: function(container) {
		container.removeChild(this._el.container);
		this.onRemove();
	},
	
	/*	Animate to Position
	================================================== */
	animatePosition: function(pos, el) {
		var ani = {
			duration: 	this.options.duration,
			easing: 	this.options.ease
		};
		for (var name in pos) {
			if (pos.hasOwnProperty(name)) {
				ani[name] = pos[name] + "px";
			}
		}
		
		if (this.animator) {
			this.animator.stop();
		}
		this.animator = KL.Animate(el, ani);
	},
	
	/*	Events
	================================================== */
	
	onLoaded: function() {
		this.fire("loaded", this.data);
	},
	
	onAdd: function() {
		this.fire("added", this.data);
	},

	onRemove: function() {
		this.fire("removed", this.data);
	},
	
	/*	Set the Position
	================================================== */
	setPosition: function(pos, el) {
		for (var name in pos) {
			if (pos.hasOwnProperty(name)) {
				if (el) {
					el.style[name] = pos[name] + "px";
				} else {
					this._el.container.style[name] = pos[name] + "px";
				};
			}
		}
	},
	
	getPosition: function() {
		return KL.Dom.getPosition(this._el.container);
	}
	
};


/*	KL.Dom
	Utilities for working with the DOM
================================================== */

KL.Dom = {

	get: function(id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},
	
	getByClass: function(id) {
		if (id) {
			return document.getElementsByClassName(id);
		}
	},
	
	create: function(tagName, className, container) {
		var el = document.createElement(tagName);
		el.className = className;
		if (container) {
			container.appendChild(el);
		}
		return el;
	},
	
	createText: function(content, container) {
		var el = document.createTextNode(content);
		if (container) {
			container.appendChild(el);
		}
		return el;
	},
	
	getTranslateString: function (point) {
		return KL.Dom.TRANSLATE_OPEN +
				point.x + 'px,' + point.y + 'px' +
				KL.Dom.TRANSLATE_CLOSE;
	},
	
	setPosition: function (el, point) {
		el._vco_pos = point;
		if (KL.Browser.webkit3d) {
			el.style[KL.Dom.TRANSFORM] =  KL.Dom.getTranslateString(point);

			if (KL.Browser.android) {
				el.style['-webkit-perspective'] = '1000';
				el.style['-webkit-backface-visibility'] = 'hidden';
			}
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	},
	
	getPosition: function(el){
	    var pos = {
	    	x: 0,
			y: 0
	    }
	    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
	        pos.x += el.offsetLeft// - el.scrollLeft;
	        pos.y += el.offsetTop// - el.scrollTop;
	        el = el.offsetParent;
	    }
	    return pos;
	},

	testProp: function(props) {
		var style = document.documentElement.style;

		for (var i = 0; i < props.length; i++) {
			if (props[i] in style) {
				return props[i];
			}
		}
		return false;
	}
	
};

KL.Util.extend(KL.Dom, {
	TRANSITION: KL.Dom.testProp(['transition', 'webkitTransition', 'OTransition', 'MozTransition', 'msTransition']),
	TRANSFORM: KL.Dom.testProp(['transformProperty', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']),

	TRANSLATE_OPEN: 'translate' + (KL.Browser.webkit3d ? '3d(' : '('),
	TRANSLATE_CLOSE: KL.Browser.webkit3d ? ',0)' : ')'
});


/*	KL.DomUtil
	Inspired by Leaflet
	KL.DomUtil contains various utility functions for working with DOM
================================================== */


KL.DomUtil = {
	get: function (id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},

	getStyle: function (el, style) {
		var value = el.style[style];
		if (!value && el.currentStyle) {
			value = el.currentStyle[style];
		}
		if (!value || value === 'auto') {
			var css = document.defaultView.getComputedStyle(el, null);
			value = css ? css[style] : null;
		}
		return (value === 'auto' ? null : value);
	},

	getViewportOffset: function (element) {
		var top = 0,
			left = 0,
			el = element,
			docBody = document.body;

		do {
			top += el.offsetTop || 0;
			left += el.offsetLeft || 0;

			if (el.offsetParent === docBody &&
					KL.DomUtil.getStyle(el, 'position') === 'absolute') {
				break;
			}
			el = el.offsetParent;
		} while (el);

		el = element;

		do {
			if (el === docBody) {
				break;
			}

			top -= el.scrollTop || 0;
			left -= el.scrollLeft || 0;

			el = el.parentNode;
		} while (el);

		return new KL.Point(left, top);
	},

	create: function (tagName, className, container) {
		var el = document.createElement(tagName);
		el.className = className;
		if (container) {
			container.appendChild(el);
		}
		return el;
	},

	disableTextSelection: function () {
		if (document.selection && document.selection.empty) {
			document.selection.empty();
		}
		if (!this._onselectstart) {
			this._onselectstart = document.onselectstart;
			document.onselectstart = KL.Util.falseFn;
		}
	},

	enableTextSelection: function () {
		document.onselectstart = this._onselectstart;
		this._onselectstart = null;
	},

	hasClass: function (el, name) {
		return (el.className.length > 0) &&
				new RegExp("(^|\\s)" + name + "(\\s|$)").test(el.className);
	},

	addClass: function (el, name) {
		if (!KL.DomUtil.hasClass(el, name)) {
			el.className += (el.className ? ' ' : '') + name;
		}
	},

	removeClass: function (el, name) {
		el.className = el.className.replace(/(\S+)\s*/g, function (w, match) {
			if (match === name) {
				return '';
			}
			return w;
		}).replace(/^\s+/, '');
	},

	setOpacity: function (el, value) {
		if (KL.Browser.ie) {
			el.style.filter = 'alpha(opacity=' + Math.round(value * 100) + ')';
		} else {
			el.style.opacity = value;
		}
	},


	testProp: function (props) {
		var style = document.documentElement.style;

		for (var i = 0; i < props.length; i++) {
			if (props[i] in style) {
				return props[i];
			}
		}
		return false;
	},

	getTranslateString: function (point) {

		return KL.DomUtil.TRANSLATE_OPEN +
				point.x + 'px,' + point.y + 'px' +
				KL.DomUtil.TRANSLATE_CLOSE;
	},

	getScaleString: function (scale, origin) {
		var preTranslateStr = KL.DomUtil.getTranslateString(origin),
			scaleStr = ' scale(' + scale + ') ',
			postTranslateStr = KL.DomUtil.getTranslateString(origin.multiplyBy(-1));

		return preTranslateStr + scaleStr + postTranslateStr;
	},

	setPosition: function (el, point) {
		el._vco_pos = point;
		if (KL.Browser.webkit3d) {
			el.style[KL.DomUtil.TRANSFORM] =  KL.DomUtil.getTranslateString(point);

			if (KL.Browser.android) {
				el.style['-webkit-perspective'] = '1000';
				el.style['-webkit-backface-visibility'] = 'hidden';
			}
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	},

	getPosition: function (el) {
		return el._vco_pos;
	}
};

/*	KL.DomEvent
	Inspired by Leaflet 
	DomEvent contains functions for working with DOM events.
================================================== */
// TODO stamp

KL.DomEvent = {
	/* inpired by John Resig, Dean Edwards and YUI addEvent implementations */
	addListener: function (/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn, /*Object*/ context) {
		var id = KL.Util.stamp(fn),
			key = '_vco_' + type + id;

		if (obj[key]) {
			return;
		}

		var handler = function (e) {
			return fn.call(context || obj, e || KL.DomEvent._getEvent());
		};

		if (KL.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
			this.addDoubleTapListener(obj, handler, id);
		} else if ('addEventListener' in obj) {
			if (type === 'mousewheel') {
				obj.addEventListener('DOMMouseScroll', handler, false);
				obj.addEventListener(type, handler, false);
			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				var originalHandler = handler,
					newType = (type === 'mouseenter' ? 'mouseover' : 'mouseout');
				handler = function (e) {
					if (!KL.DomEvent._checkMouse(obj, e)) {
						return;
					}
					return originalHandler(e);
				};
				obj.addEventListener(newType, handler, false);
			} else {
				obj.addEventListener(type, handler, false);
			}
		} else if ('attachEvent' in obj) {
			obj.attachEvent("on" + type, handler);
		}

		obj[key] = handler;
	},

	removeListener: function (/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn) {
		var id = KL.Util.stamp(fn),
			key = '_vco_' + type + id,
			handler = obj[key];

		if (!handler) {
			return;
		}

		if (KL.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
			this.removeDoubleTapListener(obj, id);
		} else if ('removeEventListener' in obj) {
			if (type === 'mousewheel') {
				obj.removeEventListener('DOMMouseScroll', handler, false);
				obj.removeEventListener(type, handler, false);
			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
			} else {
				obj.removeEventListener(type, handler, false);
			}
		} else if ('detachEvent' in obj) {
			obj.detachEvent("on" + type, handler);
		}
		obj[key] = null;
	},

	_checkMouse: function (el, e) {
		var related = e.relatedTarget;

		if (!related) {
			return true;
		}

		try {
			while (related && (related !== el)) {
				related = related.parentNode;
			}
		} catch (err) {
			return false;
		}

		return (related !== el);
	},

	/*jshint noarg:false */ // evil magic for IE
	_getEvent: function () {
		var e = window.event;
		if (!e) {
			var caller = arguments.callee.caller;
			while (caller) {
				e = caller['arguments'][0];
				if (e && window.Event === e.constructor) {
					break;
				}
				caller = caller.caller;
			}
		}
		return e;
	},
	/*jshint noarg:false */

	stopPropagation: function (/*Event*/ e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	},
	
	// TODO KL.Draggable.START
	disableClickPropagation: function (/*HTMLElement*/ el) {
		KL.DomEvent.addListener(el, KL.Draggable.START, KL.DomEvent.stopPropagation);
		KL.DomEvent.addListener(el, 'click', KL.DomEvent.stopPropagation);
		KL.DomEvent.addListener(el, 'dblclick', KL.DomEvent.stopPropagation);
	},

	preventDefault: function (/*Event*/ e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	},

	stop: function (e) {
		KL.DomEvent.preventDefault(e);
		KL.DomEvent.stopPropagation(e);
	},


	getWheelDelta: function (e) {
		var delta = 0;
		if (e.wheelDelta) {
			delta = e.wheelDelta / 120;
		}
		if (e.detail) {
			delta = -e.detail / 3;
		}
		return delta;
	}
};




/*	KL.StyleSheet
	Style Sheet Object
================================================== */

KL.StyleSheet = KL.Class.extend({
	
	includes: [KL.Events],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function() {
		// Borrowed from: http://davidwalsh.name/add-rules-stylesheets
		this.style = document.createElement("style");
		
		// WebKit hack :(
		this.style.appendChild(document.createTextNode(""));
		
		// Add the <style> element to the page
		document.head.appendChild(this.style);
		
		this.sheet = this.style.sheet;
		
	},
	
	addRule: function(selector, rules, index) {
		var _index = 0;
		
		if (index) {
			_index = index;
		}
		
		if("insertRule" in this.sheet) {
			this.sheet.insertRule(selector + "{" + rules + "}", _index);
		}
		else if("addRule" in this.sheet) {
			this.sheet.addRule(selector, rules, _index);
		}
	},
	

	/*	Events
	================================================== */
	onLoaded: function(error) {
		this._state.loaded = true;
		this.fire("loaded", this.data);
	}
	
});

/*	KL.QuoteComposition
================================================== */
// TODO: Animate into existince


KL.QuoteComposition = KL.Class.extend({
	
	includes: [KL.Events, KL.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options, add_to_container) {
		// DOM ELEMENTS
		this._el = {
			container: {},
			background: {},
			composition_container: {},
			composition_text: {},
			blockquote: {},
			blockquote_p: {},
			citation: {},
			image: {},
			button_group: {},
			button_tweet: {},
			button_download: {},
			button_anchor_left: {},
			button_anchor_right: {},
			button_anchor_center: {},
			button_make: {}
		};
		
		// Data
		this.data = {
			quote: "Quote goes here, gonna make it longer to see",
			cite: "Citation",
			image: "Description",
			credit: "",
			headline: "Article Title",
			url: ""
		};
	
		//Options
		this.options = {
			editable: true,
			anchor: false,
			classname: "",
			base_classname: "kl-quotecomposition"
		};
	
		this.animator = null;
		
		// Merge Data and Options
		KL.Util.mergeData(this.options, options);
		KL.Util.mergeData(this.data, data);
		//console.log(this.data.headline)
		

		
		
		this._el.container = KL.Dom.create("div", this.options.base_classname);

		this._updateClassName();
		
		this._initLayout();
		this._initEvents();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
		};
		
	},
	
	update: function() {
		this._update();
	},

	/*	Events
	================================================== */
	_onMouseClick: function() {
		this.fire("clicked", this.options);
	},

	_onAnchorLeft: function(e) {
		this.options.anchor = "left";
		this._updateClassName();
		this._updateAlignButtons(this._el.button_anchor_left);
	},

	_onAnchorRight: function(e) {
		this.options.anchor = "right";
		this._updateClassName();
		this._updateAlignButtons(this._el.button_anchor_right);
	},

	_onAnchorCenter: function(e) {
		this.options.anchor = false;
		this._updateClassName();
		this._updateAlignButtons(this._el.button_anchor_center);
	},

	_onMake: function(e) {
		var url_vars = "?";
		url_vars += "anchor=" + this.options.anchor;
		url_vars += "&quote=" + this._el.blockquote_p.innerHTML;
		url_vars += "&cite=" + this._el.citation.innerHTML;
		url_vars += "&image=" + this.data.image;
		url_vars += "&credit=" + this.data.credit;
		
		if (!window.location.origin) {
  			window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
		}
		var win = window.open(window.location.origin + "/composition.html" + url_vars, '_blank');
  		win.focus();
	},

	_onLoaded: function() {
		this.fire("loaded", this.options);
	},
	
	/*	Private Methods
	================================================== */
	_updateAlignButtons: function(elem) {
		this._el.button_anchor_left.className = "btn btn-default";
		this._el.button_anchor_center.className = "btn btn-default";
		this._el.button_anchor_right.className = "btn btn-default";

		elem.className = "btn btn-default active";
	},

	_update: function() {
		this._el.blockquote_p.innerHTML = this.data.quote;
		this._el.citation.innerHTML = this.data.cite;
		this._el.image.style.backgroundImage = "url('" + this.data.image + "')"

		/*this._el.blockquote_p.contentEditable = this.options.editable;
		this._el.citation.contentEditable = this.options.editable;*/
		
	},

	_updateClassName: function() {
		this.options.classname = this.options.base_classname;

		if (this.options.anchor) {
			this.options.classname += " kl-anchor-" + this.options.anchor;
		}

		if (this.options.editable) {
			this.options.classname += " kl-editable";
		}

		this._el.container.className = this.options.classname;
	},

	formatedText: function (){
		var text = "";
		var headline = this.data.headline;
		var url = this.data.url;
		function decToHex(i){
			var t="";
			while (i>0){
				t= hexLet(i%16)+t;
				i=Math.floor(i/16);
			}
			return t;
		}
		function hexLet(i){
			switch(i){
				case 10:
					return "A";
				case 11:
					return "B";
				case 12:
					return "C";
				case 13:
					return "D";
				case 14:
					return "E";
				case 15:
					return "F";
				default:
					return i.toString();
			}
		}
		for(var i=0; i<headline.length; i++){
			var chara = headline[i];
			var c = headline.charCodeAt(i);
			if((c>47&&c<58)||(c>64&&c<91)||(c>96&&c<123)){
				text+=chara;
				
			}
			else{
				var hex = decToHex(c);
				if(hex=="201C"||hex=="201D"){
					hex = "22";
				}
				else if(hex=="0027"||hex=="2018"||hex=="2019"){
					hex = "27";
				}
				if (hex.length>2){
					hex= hex.substring(0,2)+"%"+hex.substring(2,4);
				}
				text+= "%"+ hex;
			}
		}
		text+= "%20"
		text+= url;
		return text;
	},

	_initLayout: function () {
		
		// Create Layout
		this._el.composition_container 	= KL.Dom.create("div", "kl-quotecomposition-container", this._el.container);
		this._el.composition_text		= KL.Dom.create("div", "kl-quotecomposition-text", this._el.composition_container);
		this._el.blockquote				= KL.Dom.create("blockquote", "", this._el.composition_text);
		this._el.blockquote_p			= KL.Dom.create("p", "", this._el.blockquote);
		this._el.citation 				= KL.Dom.create("cite", "", this._el.blockquote);
		this._el.background				= KL.Dom.create("div", "kl-quotecomposition-background", this._el.composition_container);
		this._el.image					= KL.Dom.create("div", "kl-quotecomposition-image", this._el.composition_container);

		// Create Buttons
		this._el.button_group 			= KL.Dom.create("div", "btn-group", this._el.container);
		this._el.button_tweet 			= KL.Dom.create("div", "btn btn-default", this._el.button_group);
		//this._el.button_download 		= KL.Dom.create("div", "btn btn-default", this._el.button_group);

		//this._el.button_anchor_left 	= KL.Dom.create("div", "btn btn-default", this._el.button_group);
		//this._el.button_anchor_center 	= KL.Dom.create("div", "btn btn-default", this._el.button_group);
		//this._el.button_anchor_right 	= KL.Dom.create("div", "btn btn-default", this._el.button_group);
		this._el.button_make 			= KL.Dom.create("div", "btn btn-primary btn-right", this._el.button_group);

		var text = this.formatedText();
		this._el.button_tweet.innerHTML = "<a class=\"twitter-share-button\" href=\"https://twitter.com/intent/tweet?text=" + text+"\">Tweet</a>"
		//this._el.button_download.innerHTML = "Download";

		this._el.button_anchor_left.innerHTML = "<span class='glyphicon glyphicon-align-left'></span>";
		this._el.button_anchor_center.innerHTML = "<span class='glyphicon glyphicon-align-center'></span>";
		this._el.button_anchor_right.innerHTML = "<span class='glyphicon glyphicon-align-right'></span>";
		this._el.button_make.innerHTML = "<span class='glyphicon glyphicon-circle-arrow-down'></span> Save";

		KL.DomEvent.addListener(this._el.button_anchor_left, 'click', this._onAnchorLeft, this);
		KL.DomEvent.addListener(this._el.button_anchor_right, 'click', this._onAnchorRight, this);
		KL.DomEvent.addListener(this._el.button_anchor_center, 'click', this._onAnchorCenter, this);
		KL.DomEvent.addListener(this._el.button_make, 'click', this._onMake, this);

		if (this.options.anchor) {
			//this._el.composition_container.className = "kl-quotecomposition-container kl-anchor-" + this.options.anchor;
			if (this.options.anchor == "left") {
				this._el.button_anchor_left.className = "btn btn-default active";
			} else {
				this._el.button_anchor_right.className = "btn btn-default active";
			}
		} else {
			this._el.button_anchor_center.className = "btn btn-default active";
		}
		
		this._update();
	},
	
	_initEvents: function () {
		KL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	}
	
	
});

/*	KL.QuoteComposition
================================================== */

KL.Slide = KL.Class.extend({
	
	includes: [KL.Events, KL.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, add_to_container, options) {
		// DOM ELEMENTS
		this._el = {
			container: {}
		};
		
		// Data
		this.data = {};
		
		//Options
		this.options = {};
		
		// SLIDES
		this._slides = [];

		// ANIMATION OBJECT
		this.animator = null;
		
		// Merge Data and Options
		KL.Util.mergeData(this.options, options);
		KL.Util.mergeData(this.data, data);
		
		
		this._el.container = KL.Dom.create("div", "kl-slide");
		
		this._initLayout();
		this._initEvents();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
		};
		
	},

	/*	Events
	================================================== */
	
	/*	Private Methods
	================================================== */

	_initLayout: function() {
		
		// Create Layout
		this._el.container.appendChild(this.data._el.container);
		//trace(this.data);
		//this.data.addTo(this._el.container);
		//trace(this._el.container);

	},
	
	_initEvents: function () {
		//KL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	}
	
	
});

/*	KL.QuoteComposition
================================================== */

KL.Slider = KL.Class.extend({
	
	includes: [KL.Events, KL.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, add_to_container, options) {
		// DOM ELEMENTS
		this._el = {
			container: {},
			slider_item_container: {}
		};
		
		// Data
		this.data = {
			slides: []
		};
		
		//Options
		this.options = {
			width: 		100,
			height: 	100,
			duration: 	1000,
			ease: 		KL.Ease.easeInOutQuint,
		};
		
		// SLIDES
		this._slides = [];
		this.slide_spacing;

		// ANIMATION OBJECT
		this.animator = null;
		
		// Merge Data and Options
		KL.Util.mergeData(this.options, options);
		//KL.Util.mergeData(this.data, data);
		this.data = data;
		
		this._el.container = KL.Dom.create("div", "kl-slider");
		
		this._initLayout();
		this._initEvents();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
		};
	},

	loadSlides: function() {
		this._createSlides(this.data);
		this._updateDisplay();

		// Ready
		this._onLoaded();
	},

	/*	Events
	================================================== */
	_onLoaded: function() {
		this.fire("loaded", this.data);
	},

	/*	Private Methods
	================================================== */
	// Update Display
	_updateDisplay: function(width, height, animate, layout) {
		// Update width and height
		this.options.width = this._el.container.offsetWidth;
		this.options.width = this._slides[0]._el.container.offsetWidth;
		this.options.height = this._el.container.offsetHeight;

		this.slide_spacing = this.options.width;

		// Position slides
		for (var i = 0; i < this._slides.length; i++) {
			//this._slides[i].updateDisplay(this.options.width, this.options.height, _layout);
			this._slides[i].setPosition({left:(this.slide_spacing * i), top:0});
			
		};
		
		this.animator = KL.Animate(this._el.slider_container, {
			left: 		-(this.slide_spacing * 1) + "px",
			duration: 	this.options.duration,
			easing: 	this.options.ease
			//complete: 	this._onSlideChange(displayupdate)
		});	
	},
	
	_createSlides: function(array) {
		for (var i = 0; i < array.length; i++) {
            this._createSlide(array[i]);
		}
	},

	_createSlide: function(d, title_slide, n) {
		var slide = new KL.Slide(d);
		this._addSlide(slide);
		if(n < 0) { 
		    this._slides.push(slide);
		} else {
		    this._slides.splice(n, 0, slide);
		}
	},

	_addSlide:function(slide) {
		slide.addTo(this._el.slider_item_container);
	},

	_initLayout: function () {
		
		// Create Layout
		this._el.slider_container_mask		= KL.Dom.create('div', 'kl-slider-container-mask', this._el.container);
		this._el.slider_container			= KL.Dom.create('div', 'kl-slider-container vcoanimate', this._el.slider_container_mask);
		this._el.slider_item_container		= KL.Dom.create('div', 'kl-slider-item-container', this._el.slider_container);


	},
	
	_initEvents: function () {
		//KL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	}
	
	
});

/**
	Piquote
	Designed and built by Zach Wise at Knight Lab
*/   

/*	Required Files
	CodeKit Import
	http://incident57.com/codekit/
================================================== */
// CORE
	// @codekit-prepend "core/KL.js";
	// @codekit-prepend "core/KL.Util.js";
	// @codekit-prepend "core/KL.Class.js";
	// @codekit-prepend "core/KL.Events.js";
	// @codekit-prepend "core/KL.Browser.js";
	// @codekit-prepend "core/KL.Load.js";
	// @codekit-prepend "data/KL.Data.js";

// ANIMATION
	// @codekit-prepend "animation/KL.Ease.js";
	// @codekit-prepend "animation/KL.Animate.js";

// DOM
	// @codekit-prepend "dom/KL.DomMixins.js";
	// @codekit-prepend "dom/KL.Dom.js";
	// @codekit-prepend "dom/KL.DomUtil.js";
	// @codekit-prepend "dom/KL.DomEvent.js";
	// @codekit-prepend "dom/KL.StyleSheet.js";

// QUOTE
	// @codekit-prepend "quote/KL.QuoteComposition.js";

// SLIDER
	// @codekit-prepend "slider/KL.Slide.js";
	// @codekit-prepend "slider/KL.Slider.js";

 

KL.Piquote = (function() {

	// DOM ELEMENTS
	this.el = {
		cover_content: 		KL.Dom.get("cover-content"),
		btn_quote_create: 	KL.Dom.get("btn-quote-create"),
		layout_editor: 		KL.Dom.get("layout-editor"),
		editor_content: 	{},
		url_input: 			KL.Dom.get("quote-url"),
		background_grid: 	KL.Dom.get("background-grid")

	};

	// OPTIONS
	this.options = {
		width: 				window.innerWidth,
		height: 			window.innerHeight,
		grid_item_width: 	window.innerWidth/4,
		grid_item_height: 	window.innerHeight/4
	};

	// GRID ITEMS
	this.grid_items = [];
	
	// SLIDER
	this.slider = {};

	// Quote Objects
	this.quotes = [];

	// Quote Compositions
	this.quote_compositions = [];

	//this._el.menubar			= VCO.Dom.create('div', 'vco-menubar', this._el.container);
	
	// API URL
	this.api_url = "/getResults";

	// GRID URL
	this.grid_url = "grid.json";

	// extra url requirements

	this.short_url= "";

	makeTinyUrl();
	
	function makeTinyUrl()
	{
		console.log('making');
		//xhr = new XMLHttpRequest();
		//xhr.onload = function(data){
	   // 		this.short_url= data.tinyurl;
		//		console.log(this.short_url);

		//	};
		//xhr.open('GET', "http://tinyurl.com/api-create.php?url=" + url);

		
	    var gapiS = document.createElement("script");
		gapiS.src="https://apis.google.com/js/client.js";
		//gapiS.onload= loadShortener;
		document.head.appendChild(gapiS);
	    
	}

	function auth(){
		console.log('authorize');
		var config = {
          'client_id': '857473126747-6gdfmkuqf7jfgfi1okp1ms05jlfd2rvu.apps.googleusercontent.com',
          'scope': 'https://www.googleapis.com/auth/urlshortener',
          //'immediate': 'true'
        };
        var i=0;
        while (!gapi){
        	i++;
        	console.log(i);
        }
        console.log(gapi);
		gapi.auth.authorize(config,loadShortener);
	}
	function loadShortener(){
		console.log('loading');
		var apiKey = 'AIzaSyCCbF1_pdsrIHcjI5I1VNw-cUKfye4YibY';
		var i=0;
  		//console.log(gapi);
  		
  		

        gapi.client.setApiKey(apiKey);
        console.log('loading2');
        gapi.client.load('urlshortener', 'v1', shortReq);
        //gapi.client.load('urlshortener', 'v1');
        
      
	}

	
	function shortReq(){
		console.log('requesting');
		var request = gapi.client.urlshortener.url.insert({
			'resource':{
	          'longUrl': this.el.url_input.value
	      }
        });
        request.execute(setShort);
	}
	function setShort(resp){
		this.short_url= resp.id;
		console.log(resp.id);
		this.scrape_url();
	}

	

	// SCRAPE URL
	this.scrape_url = function() {
		var api_call = api_url + "?a=" + this.el.url_input.value;



		

		KL.getJSON(api_call ,function(d) {
			this.createQuoteObjects(d);
			this.createCompositions(d);
		});
		
		//makeTinyUrl();
		
	};

	// CREATE COMPOSITIONS
	this.createCompositions = function(d) {

		this.quote_compositions = [];
		
		// LAYOUT
		this.el.layout_editor.innerHTML = "";
		this.el.editor_content = KL.Dom.create('div', 'editor-content', this.el.layout_editor);


		for (i=0; i < this.quotes.length; i++) {
			// var composition = new KL.QuoteComposition(this.quotes[i], {anchor:false});
			
			// composition.addTo(this.el.editor_content);
			// this.quote_compositions.push(composition);
			if (i%2==0)
				this.createComposition(this.quotes[i], "right");
			else
				this.createComposition(this.quotes[i], false);
			//console.log(i);

		}

		//this.quote = new KL.QuoteComposition(d, {anchor:"left"});

		//this.quote.addTo(this.el.editor_content);

		// SLIDER POSSIBILITY
		//this.slider = new KL.Slider([this.another_quote, this.quote, this.other_quote], this.el.editor_content);
		//this.slider.on('loaded', this._onSliderLoaded, this);
		//this.slider.loadSlides();
		//this.quote = new KL.QuoteComposition(d, {}, this.el.editor_content);

	};

	this.createComposition = function(d, anchor) { 
		var composition = new KL.QuoteComposition(d, {anchor:anchor});
		composition.addTo(this.el.editor_content);
		this.quote_compositions.push(composition);
	};

	this.createQuoteObjects = function(d) {
		this.quotes = [];

		for (i=0; i < d.quote.length; i++) {
			var quote = {
				quote: "",
				cite: "",
				credit: "",
				image: "",
				headline: "",
				url: this.short_url
			};

			quote.quote = d.quote[i];
			quote.headline = d.headline;
			if (i%2==1){
				quote.image = "/img/piquotebackground.jpg"
			}
			else if (d.image[i]) {
				quote.image = d.image[i];
			} else {
				quote.image = d.image[0];
			}

			this.quotes.push(quote);

		}
	};

	/*	BACKGROUND GRID
	================================================== */
	this.createBackgroundGrid = function() {
		var number_columns = Math.floor(this.options.width/this.options.grid_item_width),
			number_rows = Math.ceil((this.options.height - this.el.cover_content.offsetHeight)/this.options.grid_item_height),
			limit = (number_columns * number_rows);

		KL.getJSON(this.grid_url ,function(d) {
			var grid_items = d.grid_items,
				i = 0,
				more_needed = 0;

			for (i=0; i < grid_items.length; i++) {
				if (i < limit) {
					this.createGridItem(grid_items[i]);
				}
			}

			if (i < limit) {
				more_needed = limit - i;

				for (i=0; i < more_needed; i++) {
					this.createGridItem(grid_items[i]);
				}
			}

			this.resizeGrid();
		});

		
	};

	this.createGridItem = function(d) {
		var g_item = 		KL.Dom.create('div', 'grid-item', this.el.background_grid);
		var g_item_image = 	KL.Dom.create('img', '', g_item);
		g_item_image.src = d;

		this.grid_items.push(g_item)
	};

	this.resizeGrid = function() {
		var new_width = 100/Math.floor(this.options.width/this.options.grid_item_width);

		this.el.background_grid.style.top = this.el.cover_content.offsetHeight + "px";

		for (i=0; i < this.grid_items.length; i++) {
			this.grid_items[i].style.width = new_width + "%";
		}
	};

	/*	EVENTS
	================================================== */
	this._onQuoteCreate = function(e) {
		loadShortener();
		//this.scrape_url();
	};

	this._onSliderLoaded = function(e) {
		var added_height = 0;
		if (this.el.layout_editor.offsetHeight < 350) {
			added_height = 350
		}
		this.el.background_grid.style.top = this.el.cover_content.offsetHeight + added_height + "px";
		//this.el.layout_editor.style.display = "block";
		//this.el.layout_editor.style.height = "350px";
		
	};

	window.onresize = function(event) {

		this.options.width = window.innerWidth;
		this.options.height = window.innerHeight;

		this.resizeGrid();
	}

	/*	LISTENERS
	================================================== */
	KL.DomEvent.addListener(this.el.btn_quote_create, 'click', this._onQuoteCreate, this);

	/*	INIT
	================================================== */
	this.createBackgroundGrid();
	

})();






