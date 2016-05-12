! function(t) {
    t.KL = {
        VERSION: "0.1",
        _originalL: t.KL
    }
}(this), KL.debug = !0, KL.Bind = function(t, e) {
        return function() {
            return t.apply(e, arguments)
        }
    }, trace = function(t) {
        KL.debug && (window.console ? console.log(t) : "undefined" != typeof jsTrace && jsTrace.send(t))
    }, KL.Util = {
        extend: function(t) {
            for (var e = Array.prototype.slice.call(arguments, 1), n = 0, i = e.length, r; i > n; n++) {
                r = e[n] || {};
                for (var o in r) r.hasOwnProperty(o) && (t[o] = r[o])
            }
            return t
        },
        setOptions: function(t, e) {
            t.options = KL.Util.extend({}, t.options, e), "" === t.options.uniqueid && (t.options.uniqueid = KL.Util.unique_ID(6))
        },
        isEven: function(t) {
            return t == parseFloat(t) ? !(t % 2) : void 0
        },
        findArrayNumberByUniqueID: function(t, e, n, i) {
            for (var r = i || 0, o = 0; o < e.length; o++) e[o].data[n] == t && (r = o);
            return r
        },
        convertUnixTime: function(t) {
            var e, n, i, r, o, a, s = [],
                u = {
                    ymd: "",
                    time: "",
                    time_array: [],
                    date_array: [],
                    full_array: []
                };
            u.ymd = t.split(" ")[0], u.time = t.split(" ")[1], u.date_array = u.ymd.split("-"), u.time_array = u.time.split(":"), u.full_array = u.date_array.concat(u.time_array);
            for (var c = 0; c < u.full_array.length; c++) s.push(parseInt(u.full_array[c]));
            return e = new Date(s[0], s[1], s[2], s[3], s[4], s[5]), n = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], i = e.getFullYear(), r = n[e.getMonth()], o = e.getDate(), a = r + ", " + o + " " + i
        },
        setData: function(t, e) {
            t.data = KL.Util.extend({}, t.data, e), "" === t.data.uniqueid && (t.data.uniqueid = KL.Util.unique_ID(6))
        },
        mergeData: function(t, e) {
            var n;
            for (n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
            return t
        },
        stamp: function() {
            var t = 0,
                e = "_vco_id";
            return function(n) {
                return n[e] = n[e] || ++t, n[e]
            }
        }(),
        isArray: function() {
            if (Array.isArray) return Array.isArray;
            var t = Object.prototype.toString,
                e = t.call([]);
            return function(n) {
                return t.call(n) === e
            }
        }(),
        getRandomNumber: function(t) {
            return Math.floor(Math.random() * t)
        },
        unique_ID: function(t, e) {
            var n = function(t) {
                    return Math.floor(Math.random() * t)
                },
                i = function() {
                    var t = "abcdefghijklmnopqurstuvwxyz";
                    return t.substr(n(32), 1)
                },
                r = function(t) {
                    for (var e = "", n = 0; t > n; n++) e += i();
                    return e
                };
            return e ? e + "-" + r(t) : "vco-" + r(t)
        },
        htmlify: function(t) {
            return t.match(/<p>[\s\S]*?<\/p>/) ? t : "<p>" + t + "</p>"
        },
        linkify: function(t, e, n) {
            var i = function(t, e, n) {
                    n || (n = "");
                    var i = 30;
                    return e && e.length > i && (e = e.substring(0, i) + "…"), n + "<a class='vco-makelink' target='_blank' href='" + t + "' onclick='void(0)'>" + e + "</a>"
                },
                r = /\b(?:https?|ftp):\/\/([a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim,
                o = /(^|[^\/>])(www\.[\S]+(\b|$))/gim,
                a = /([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/gim;
            return t.replace(r, function(t, e, n, r) {
                return i(t, e)
            }).replace(o, function(t, e, n, r, o) {
                return i("http://" + n, n, e)
            }).replace(a, function(t, e, n, r) {
                return i("mailto:" + e, e)
            })
        },
        unlinkify: function(t) {
            return t ? (t = t.replace(/<a\b[^>]*>/i, ""), t = t.replace(/<\/a>/i, "")) : t
        },
        getParamString: function(t) {
            var e = [];
            for (var n in t) t.hasOwnProperty(n) && e.push(n + "=" + t[n]);
            return "?" + e.join("&")
        },
        formatNum: function(t, e) {
            var n = Math.pow(10, e || 5);
            return Math.round(t * n) / n
        },
        falseFn: function() {
            return !1
        },
        requestAnimFrame: function() {
            function t(t) {
                window.setTimeout(t, 1e3 / 60)
            }
            var e = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || t;
            return function(n, i, r, o) {
                n = i ? KL.Util.bind(n, i) : n, r && e === t ? n() : e(n, o)
            }
        }(),
        bind: function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        },
        template: function(t, e) {
            return t.replace(/\{ *([\w_]+) *\}/g, function(t, n) {
                var i = e[n];
                if (!e.hasOwnProperty(n)) throw new Error("No value provided for variable " + t);
                return i
            })
        },
        hexToRgb: function(t) {
            KL.Util.css_named_colors[t.toLowerCase()] && (t = KL.Util.css_named_colors[t.toLowerCase()]);
            var e = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            t = t.replace(e, function(t, e, n, i) {
                return e + e + n + n + i + i
            });
            var n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
            return n ? {
                r: parseInt(n[1], 16),
                g: parseInt(n[2], 16),
                b: parseInt(n[3], 16)
            } : null
        },
        css_named_colors: {
            aliceblue: "#f0f8ff",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedalmond: "#ffebcd",
            blue: "#0000ff",
            blueviolet: "#8a2be2",
            brown: "#a52a2a",
            burlywood: "#deb887",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerblue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkgray: "#a9a9a9",
            darkgreen: "#006400",
            darkkhaki: "#bdb76b",
            darkmagenta: "#8b008b",
            darkolivegreen: "#556b2f",
            darkorange: "#ff8c00",
            darkorchid: "#9932cc",
            darkred: "#8b0000",
            darksalmon: "#e9967a",
            darkseagreen: "#8fbc8f",
            darkslateblue: "#483d8b",
            darkslategray: "#2f4f4f",
            darkturquoise: "#00ced1",
            darkviolet: "#9400d3",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            dimgray: "#696969",
            dodgerblue: "#1e90ff",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            forestgreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#dcdcdc",
            ghostwhite: "#f8f8ff",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gray: "#808080",
            green: "#008000",
            greenyellow: "#adff2f",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            indianred: "#cd5c5c",
            indigo: "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderblush: "#fff0f5",
            lawngreen: "#7cfc00",
            lemonchiffon: "#fffacd",
            lightblue: "#add8e6",
            lightcoral: "#f08080",
            lightcyan: "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgray: "#d3d3d3",
            lightgreen: "#90ee90",
            lightpink: "#ffb6c1",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            lightskyblue: "#87cefa",
            lightslategray: "#778899",
            lightsteelblue: "#b0c4de",
            lightyellow: "#ffffe0",
            lime: "#00ff00",
            limegreen: "#32cd32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumaquamarine: "#66cdaa",
            mediumblue: "#0000cd",
            mediumorchid: "#ba55d3",
            mediumpurple: "#9370db",
            mediumseagreen: "#3cb371",
            mediumslateblue: "#7b68ee",
            mediumspringgreen: "#00fa9a",
            mediumturquoise: "#48d1cc",
            mediumvioletred: "#c71585",
            midnightblue: "#191970",
            mintcream: "#f5fffa",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajowhite: "#ffdead",
            navy: "#000080",
            oldlace: "#fdf5e6",
            olive: "#808000",
            olivedrab: "#6b8e23",
            orange: "#ffa500",
            orangered: "#ff4500",
            orchid: "#da70d6",
            palegoldenrod: "#eee8aa",
            palegreen: "#98fb98",
            paleturquoise: "#afeeee",
            palevioletred: "#db7093",
            papayawhip: "#ffefd5",
            peachpuff: "#ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderblue: "#b0e0e6",
            purple: "#800080",
            rebeccapurple: "#663399",
            red: "#ff0000",
            rosybrown: "#bc8f8f",
            royalblue: "#4169e1",
            saddlebrown: "#8b4513",
            salmon: "#fa8072",
            sandybrown: "#f4a460",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            skyblue: "#87ceeb",
            slateblue: "#6a5acd",
            slategray: "#708090",
            snow: "#fffafa",
            springgreen: "#00ff7f",
            steelblue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            wheat: "#f5deb3",
            white: "#ffffff",
            whitesmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowgreen: "#9acd32"
        },
        ratio: {
            square: function(t) {
                var e = {
                    w: 0,
                    h: 0
                };
                return t.w > t.h && t.h > 0 ? (e.h = t.h, e.w = t.h) : (e.w = t.w, e.h = t.w), e
            },
            r16_9: function(t) {
                return null !== t.w && "" !== t.w ? Math.round(t.w / 16 * 9) : null !== t.h && "" !== t.h ? Math.round(t.h / 9 * 16) : 0
            },
            r4_3: function(t) {
                return null !== t.w && "" !== t.w ? Math.round(t.w / 4 * 3) : null !== t.h && "" !== t.h ? Math.round(t.h / 3 * 4) : void 0
            }
        },
        getObjectAttributeByIndex: function(t, e) {
            if ("undefined" != typeof t) {
                var n = 0;
                for (var i in t) {
                    if (e === n) return t[i];
                    n++
                }
                return ""
            }
            return ""
        },
        getUrlVars: function(t) {
            var e, n = [],
                i, r;
            e = t.toString(), e.match("&#038;") ? e = e.replace("&#038;", "&") : e.match("&#38;") ? e = e.replace("&#38;", "&") : e.match("&amp;") && (e = e.replace("&amp;", "&")), r = e.slice(e.indexOf("?") + 1).split("&");
            for (var o = 0; o < r.length; o++) i = r[o].split("="), n.push(i[0]), n[i[0]] = i[1];
            return n
        },
        trim: function(t) {
            return t.replace(/^\s+|\s+$/g, "")
        },
        slugify: function(t) {
            t = KL.Util.trim(t), t = t.toLowerCase();
            for (var e = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;", n = "aaaaaeeeeeiiiiooooouuuunc------", i = 0, r = e.length; r > i; i++) t = t.replace(new RegExp(e.charAt(i), "g"), n.charAt(i));
            return t = t.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"), t = t.replace(/^([0-9])/, "_$1")
        },
        maxDepth: function(t) {
            for (var e = [], n = 0, i = 0; i < t.length; i++) {
                if (e.push(t[i]), e.length > 1) {
                    for (var r = e[e.length - 1], o = -1, a = 0; a < e.length - 1; a++) e[a][1] < r[0] && (o = a);
                    o >= 0 && (e = e.slice(o + 1))
                }
                e.length > n && (n = e.length)
            }
            return n
        },
        pad: function(t, e) {
            for (t = String(t), e = e || 2; t.length < e;) t = "0" + t;
            return t
        },
        findNextGreater: function(t, e, n) {
            for (var i = 0; i < t.length; i++)
                if (e < t[i]) return t[i];
            return n ? n : e
        },
        findNextLesser: function(t, e, n) {
            for (var i = t.length - 1; i >= 0; i--)
                if (e > t[i]) return t[i];
            return n ? n : e
        }
    }, KL.Class = function() {}, KL.Class.extend = function(t) {
        var e = function() {
                this.initialize && this.initialize.apply(this, arguments)
            },
            n = function() {};
        n.prototype = this.prototype;
        var i = new n;
        i.constructor = e, e.prototype = i, e.superclass = this.prototype;
        for (var r in this) this.hasOwnProperty(r) && "prototype" !== r && "superclass" !== r && (e[r] = this[r]);
        return t.statics && (KL.Util.extend(e, t.statics), delete t.statics), t.includes && (KL.Util.extend.apply(null, [i].concat(t.includes)), delete t.includes), t.options && i.options && (t.options = KL.Util.extend({}, i.options, t.options)), KL.Util.extend(i, t), e.extend = KL.Class.extend, e.include = function(t) {
            KL.Util.extend(this.prototype, t)
        }, e
    }, KL.Events = {
        addEventListener: function(t, e, n) {
            var i = this._vco_events = this._vco_events || {};
            return i[t] = i[t] || [], i[t].push({
                action: e,
                context: n || this
            }), this
        },
        hasEventListeners: function(t) {
            var e = "_vco_events";
            return e in this && t in this[e] && this[e][t].length > 0
        },
        removeEventListener: function(t, e, n) {
            if (!this.hasEventListeners(t)) return this;
            for (var i = 0, r = this._vco_events, o = r[t].length; o > i; i++)
                if (r[t][i].action === e && (!n || r[t][i].context === n)) return r[t].splice(i, 1), this;
            return this
        },
        fireEvent: function(t, e) {
            if (!this.hasEventListeners(t)) return this;
            for (var n = KL.Util.extend({
                    type: t,
                    target: this
                }, e), i = this._vco_events[t].slice(), r = 0, o = i.length; o > r; r++) i[r].action.call(i[r].context || this, n);
            return this
        }
    }, KL.Events.on = KL.Events.addEventListener, KL.Events.off = KL.Events.removeEventListener, KL.Events.fire = KL.Events.fireEvent,
    function() {
        var t = navigator.userAgent.toLowerCase(),
            e = document.documentElement,
            n = "ActiveXObject" in window,
            i = -1 !== t.indexOf("webkit"),
            r = -1 !== t.indexOf("phantom"),
            o = -1 !== t.search("android [23]"),
            a = "undefined" != typeof orientation,
            s = navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent,
            u = window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints || s,
            c = n && "transition" in e.style,
            l = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix && !o,
            f = "MozPerspective" in e.style,
            h = "OTransition" in e.style,
            d = window.opera,
            p = "devicePixelRatio" in window && window.devicePixelRatio > 1;
        if (!p && "matchMedia" in window) {
            var m = window.matchMedia("(min-resolution:144dpi)");
            p = m && m.matches
        }
        var g = !window.L_NO_TOUCH && !r && (u || "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch);
        KL.Browser = {
            ie: n,
            ielt9: n && !document.addEventListener,
            webkit: i,
            firefox: -1 !== t.indexOf("gecko") && !i && !window.opera && !n,
            android: -1 !== t.indexOf("android"),
            android23: o,
            chrome: -1 !== t.indexOf("chrome"),
            ie3d: c,
            webkit3d: l,
            gecko3d: f,
            opera3d: h,
            any3d: !window.L_DISABLE_3D && (c || l || f || h) && !r,
            mobile: a,
            mobileWebkit: a && i,
            mobileWebkit3d: a && l,
            mobileOpera: a && window.opera,
            touch: !!g,
            msPointer: !!s,
            pointer: !!u,
            retina: !!p,
            orientation: function() {
                var t = window.innerWidth,
                    e = window.innerHeight,
                    n = "portrait";
                return t > e && (n = "landscape"), 90 == Math.abs(window.orientation), trace(n), n
            }
        }
    }(), KL.Load = function(t) {
        function e(t) {
            var e = 0,
                i = !1;
            for (e = 0; e < n.length; e++) n[e] == t && (i = !0);
            return i ? !0 : (n.push(t), !1)
        }
        var n = [];
        return {
            css: function(t, n, i, r) {
                e(t) ? n() : KL.LoadIt.css(t, n, i, r)
            },
            js: function(t, n, i, r) {
                e(t) ? n() : KL.LoadIt.js(t, n, i, r)
            }
        }
    }(this.document), KL.LoadIt = function(t) {
        function e(e, n) {
            var i = t.createElement(e),
                r;
            for (r in n) n.hasOwnProperty(r) && i.setAttribute(r, n[r]);
            return i
        }

        function n(t) {
            var e = c[t],
                n, i;
            e && (n = e.callback, i = e.urls, i.shift(), l = 0, i.length || (n && n.call(e.context, e.obj), c[t] = null, f[t].length && r(t)))
        }

        function i() {
            var e = navigator.userAgent;
            s = {
                async: t.createElement("script").async === !0
            }, (s.webkit = /AppleWebKit\//.test(e)) || (s.ie = /MSIE/.test(e)) || (s.opera = /Opera/.test(e)) || (s.gecko = /Gecko\//.test(e)) || (s.unknown = !0)
        }

        function r(r, l, h, d, p) {
            var m = function() {
                    n(r)
                },
                g = "css" === r,
                v = [],
                y, b, _, w, L, x;
            if (s || i(), l)
                if (l = "string" == typeof l ? [l] : l.concat(), g || s.async || s.gecko || s.opera) f[r].push({
                    urls: l,
                    callback: h,
                    obj: d,
                    context: p
                });
                else
                    for (y = 0, b = l.length; b > y; ++y) f[r].push({
                        urls: [l[y]],
                        callback: y === b - 1 ? h : null,
                        obj: d,
                        context: p
                    });
            if (!c[r] && (w = c[r] = f[r].shift())) {
                for (u || (u = t.head || t.getElementsByTagName("head")[0]), L = w.urls, y = 0, b = L.length; b > y; ++y) x = L[y], g ? _ = s.gecko ? e("style") : e("link", {
                    href: x,
                    rel: "stylesheet"
                }) : (_ = e("script", {
                    src: x
                }), _.async = !1), _.className = "lazyload", _.setAttribute("charset", "utf-8"), s.ie && !g ? _.onreadystatechange = function() {
                    /loaded|complete/.test(_.readyState) && (_.onreadystatechange = null, m())
                } : g && (s.gecko || s.webkit) ? s.webkit ? (w.urls[y] = _.href, a()) : (_.innerHTML = '@import "' + x + '";', o(_)) : _.onload = _.onerror = m, v.push(_);
                for (y = 0, b = v.length; b > y; ++y) u.appendChild(v[y])
            }
        }

        function o(t) {
            var e;
            try {
                e = !!t.sheet.cssRules
            } catch (i) {
                return l += 1, void(200 > l ? setTimeout(function() {
                    o(t)
                }, 50) : e && n("css"))
            }
            n("css")
        }

        function a() {
            var t = c.css,
                e;
            if (t) {
                for (e = h.length; --e >= 0;)
                    if (h[e].href === t.urls[0]) {
                        n("css");
                        break
                    }
                l += 1, t && (200 > l ? setTimeout(a, 50) : n("css"))
            }
        }
        var s, u, c = {},
            l = 0,
            f = {
                css: [],
                js: []
            },
            h = t.styleSheets;
        return {
            css: function(t, e, n, i) {
                r("css", t, e, n, i)
            },
            js: function(t, e, n, i) {
                r("js", t, e, n, i)
            }
        }
    }(this.document),
    function(t) {
        var e = function() {
            function t(t) {
                return null == t ? String(t) : V[Z.call(t)] || "object"
            }

            function e(e) {
                return "function" == t(e)
            }

            function n(t) {
                return null != t && t == t.window
            }

            function i(t) {
                return null != t && t.nodeType == t.DOCUMENT_NODE
            }

            function r(e) {
                return "object" == t(e)
            }

            function o(t) {
                return r(t) && !n(t) && Object.getPrototypeOf(t) == Object.prototype
            }

            function a(t) {
                return "number" == typeof t.length
            }

            function s(t) {
                return K.call(t, function(t) {
                    return null != t
                })
            }

            function u(t) {
                return t.length > 0 ? $.fn.concat.apply([], t) : t
            }

            function c(t) {
                return t.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
            }

            function l(t) {
                return t in D ? D[t] : D[t] = new RegExp("(^|\\s)" + t + "(\\s|$)")
            }

            function f(t, e) {
                return "number" != typeof e || N[c(t)] ? e : e + "px"
            }

            function h(t) {
                var e, n;
                return S[t] || (e = T.createElement(t), T.body.appendChild(e), n = getComputedStyle(e, "").getPropertyValue("display"), e.parentNode.removeChild(e), "none" == n && (n = "block"), S[t] = n), S[t]
            }

            function d(t) {
                return "children" in t ? k.call(t.children) : $.map(t.childNodes, function(t) {
                    return 1 == t.nodeType ? t : void 0
                })
            }

            function p(t, e, n) {
                for (L in e) n && (o(e[L]) || Y(e[L])) ? (o(e[L]) && !o(t[L]) && (t[L] = {}), Y(e[L]) && !Y(t[L]) && (t[L] = []), p(t[L], e[L], n)) : e[L] !== w && (t[L] = e[L])
            }

            function m(t, e) {
                return null == e ? $(t) : $(t).filter(e)
            }

            function g(t, n, i, r) {
                return e(n) ? n.call(t, i, r) : n
            }

            function v(t, e, n) {
                null == n ? t.removeAttribute(e) : t.setAttribute(e, n)
            }

            function y(t, e) {
                var n = t.className,
                    i = n && n.baseVal !== w;
                return e === w ? i ? n.baseVal : n : void(i ? n.baseVal = e : t.className = e)
            }

            function b(t) {
                var e;
                try {
                    return t ? "true" == t || ("false" == t ? !1 : "null" == t ? null : /^0/.test(t) || isNaN(e = Number(t)) ? /^[\[\{]/.test(t) ? $.parseJSON(t) : t : e) : t
                } catch (n) {
                    return t
                }
            }

            function _(t, e) {
                e(t);
                for (var n in t.childNodes) _(t.childNodes[n], e)
            }
            var w, L, $, x, E = [],
                k = E.slice,
                K = E.filter,
                T = window.document,
                S = {},
                D = {},
                N = {
                    "column-count": 1,
                    columns: 1,
                    "font-weight": 1,
                    "line-height": 1,
                    opacity: 1,
                    "z-index": 1,
                    zoom: 1
                },
                C = /^\s*<(\w+|!)[^>]*>/,
                M = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
                O = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
                A = /^(?:body|html)$/i,
                P = /([A-Z])/g,
                j = ["val", "css", "html", "text", "data", "width", "height", "offset"],
                q = ["after", "prepend", "before", "append"],
                I = T.createElement("table"),
                R = T.createElement("tr"),
                U = {
                    tr: T.createElement("tbody"),
                    tbody: I,
                    thead: I,
                    tfoot: I,
                    td: R,
                    th: R,
                    "*": T.createElement("div")
                },
                F = /complete|loaded|interactive/,
                z = /^\.([\w-]+)$/,
                B = /^#([\w-]*)$/,
                H = /^[\w-]*$/,
                V = {},
                Z = V.toString,
                W = {},
                J, Q, X = T.createElement("div"),
                G = {
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
                Y = Array.isArray || function(t) {
                    return t instanceof Array
                };
            return W.matches = function(t, e) {
                if (!e || !t || 1 !== t.nodeType) return !1;
                var n = t.webkitMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.matchesSelector;
                if (n) return n.call(t, e);
                var i, r = t.parentNode,
                    o = !r;
                return o && (r = X).appendChild(t), i = ~W.qsa(r, e).indexOf(t), o && X.removeChild(t), i
            }, J = function(t) {
                return t.replace(/-+(.)?/g, function(t, e) {
                    return e ? e.toUpperCase() : ""
                })
            }, Q = function(t) {
                return K.call(t, function(e, n) {
                    return t.indexOf(e) == n
                })
            }, W.fragment = function(t, e, n) {
                var i, r, a;
                return M.test(t) && (i = $(T.createElement(RegExp.$1))), i || (t.replace && (t = t.replace(O, "<$1></$2>")), e === w && (e = C.test(t) && RegExp.$1), e in U || (e = "*"), a = U[e], a.innerHTML = "" + t, i = $.each(k.call(a.childNodes), function() {
                    a.removeChild(this)
                })), o(n) && (r = $(i), $.each(n, function(t, e) {
                    j.indexOf(t) > -1 ? r[t](e) : r.attr(t, e)
                })), i
            }, W.Z = function(t, e) {
                return t = t || [], t.__proto__ = $.fn, t.selector = e || "", t
            }, W.isZ = function(t) {
                return t instanceof W.Z
            }, W.init = function(t, n) {
                var i;
                if (!t) return W.Z();
                if ("string" == typeof t)
                    if (t = t.trim(), "<" == t[0] && C.test(t)) i = W.fragment(t, RegExp.$1, n), t = null;
                    else {
                        if (n !== w) return $(n).find(t);
                        i = W.qsa(T, t)
                    }
                else {
                    if (e(t)) return $(T).ready(t);
                    if (W.isZ(t)) return t;
                    if (Y(t)) i = s(t);
                    else if (r(t)) i = [t], t = null;
                    else if (C.test(t)) i = W.fragment(t.trim(), RegExp.$1, n), t = null;
                    else {
                        if (n !== w) return $(n).find(t);
                        i = W.qsa(T, t)
                    }
                }
                return W.Z(i, t)
            }, $ = function(t, e) {
                return W.init(t, e)
            }, $.extend = function(t) {
                var e, n = k.call(arguments, 1);
                return "boolean" == typeof t && (e = t, t = n.shift()), n.forEach(function(n) {
                    p(t, n, e)
                }), t
            }, W.qsa = function(t, e) {
                var n, r = "#" == e[0],
                    o = !r && "." == e[0],
                    a = r || o ? e.slice(1) : e,
                    s = H.test(a);
                return i(t) && s && r ? (n = t.getElementById(a)) ? [n] : [] : 1 !== t.nodeType && 9 !== t.nodeType ? [] : k.call(s && !r ? o ? t.getElementsByClassName(a) : t.getElementsByTagName(e) : t.querySelectorAll(e))
            }, $.contains = function(t, e) {
                return t !== e && t.contains(e)
            }, $.type = t, $.isFunction = e, $.isWindow = n, $.isArray = Y, $.isPlainObject = o, $.isEmptyObject = function(t) {
                var e;
                for (e in t) return !1;
                return !0
            }, $.inArray = function(t, e, n) {
                return E.indexOf.call(e, t, n)
            }, $.camelCase = J, $.trim = function(t) {
                return null == t ? "" : String.prototype.trim.call(t)
            }, $.uuid = 0, $.support = {}, $.expr = {}, $.map = function(t, e) {
                var n, i = [],
                    r, o;
                if (a(t))
                    for (r = 0; r < t.length; r++) n = e(t[r], r), null != n && i.push(n);
                else
                    for (o in t) n = e(t[o], o), null != n && i.push(n);
                return u(i)
            }, $.each = function(t, e) {
                var n, i;
                if (a(t)) {
                    for (n = 0; n < t.length; n++)
                        if (e.call(t[n], n, t[n]) === !1) return t
                } else
                    for (i in t)
                        if (e.call(t[i], i, t[i]) === !1) return t; return t
            }, $.grep = function(t, e) {
                return K.call(t, e)
            }, window.JSON && ($.parseJSON = JSON.parse), $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(t, e) {
                V["[object " + e + "]"] = e.toLowerCase()
            }), $.fn = {
                forEach: E.forEach,
                reduce: E.reduce,
                push: E.push,
                sort: E.sort,
                indexOf: E.indexOf,
                concat: E.concat,
                map: function(t) {
                    return $($.map(this, function(e, n) {
                        return t.call(e, n, e)
                    }))
                },
                slice: function() {
                    return $(k.apply(this, arguments))
                },
                ready: function(t) {
                    return F.test(T.readyState) && T.body ? t($) : T.addEventListener("DOMContentLoaded", function() {
                        t($)
                    }, !1), this
                },
                get: function(t) {
                    return t === w ? k.call(this) : this[t >= 0 ? t : t + this.length]
                },
                toArray: function() {
                    return this.get()
                },
                size: function() {
                    return this.length
                },
                remove: function() {
                    return this.each(function() {
                        null != this.parentNode && this.parentNode.removeChild(this)
                    })
                },
                each: function(t) {
                    return E.every.call(this, function(e, n) {
                        return t.call(e, n, e) !== !1
                    }), this
                },
                filter: function(t) {
                    return e(t) ? this.not(this.not(t)) : $(K.call(this, function(e) {
                        return W.matches(e, t)
                    }))
                },
                add: function(t, e) {
                    return $(Q(this.concat($(t, e))))
                },
                is: function(t) {
                    return this.length > 0 && W.matches(this[0], t)
                },
                not: function(t) {
                    var n = [];
                    if (e(t) && t.call !== w) this.each(function(e) {
                        t.call(this, e) || n.push(this)
                    });
                    else {
                        var i = "string" == typeof t ? this.filter(t) : a(t) && e(t.item) ? k.call(t) : $(t);
                        this.forEach(function(t) {
                            i.indexOf(t) < 0 && n.push(t)
                        })
                    }
                    return $(n)
                },
                has: function(t) {
                    return this.filter(function() {
                        return r(t) ? $.contains(this, t) : $(this).find(t).size()
                    })
                },
                eq: function(t) {
                    return -1 === t ? this.slice(t) : this.slice(t, +t + 1)
                },
                first: function() {
                    var t = this[0];
                    return t && !r(t) ? t : $(t)
                },
                last: function() {
                    var t = this[this.length - 1];
                    return t && !r(t) ? t : $(t)
                },
                find: function(t) {
                    var e, n = this;
                    return e = "object" == typeof t ? $(t).filter(function() {
                        var t = this;
                        return E.some.call(n, function(e) {
                            return $.contains(e, t)
                        })
                    }) : 1 == this.length ? $(W.qsa(this[0], t)) : this.map(function() {
                        return W.qsa(this, t)
                    })
                },
                closest: function(t, e) {
                    var n = this[0],
                        r = !1;
                    for ("object" == typeof t && (r = $(t)); n && !(r ? r.indexOf(n) >= 0 : W.matches(n, t));) n = n !== e && !i(n) && n.parentNode;
                    return $(n)
                },
                parents: function(t) {
                    for (var e = [], n = this; n.length > 0;) n = $.map(n, function(t) {
                        return (t = t.parentNode) && !i(t) && e.indexOf(t) < 0 ? (e.push(t), t) : void 0
                    });
                    return m(e, t)
                },
                parent: function(t) {
                    return m(Q(this.pluck("parentNode")), t)
                },
                children: function(t) {
                    return m(this.map(function() {
                        return d(this)
                    }), t)
                },
                contents: function() {
                    return this.map(function() {
                        return k.call(this.childNodes)
                    })
                },
                siblings: function(t) {
                    return m(this.map(function(t, e) {
                        return K.call(d(e.parentNode), function(t) {
                            return t !== e
                        })
                    }), t)
                },
                empty: function() {
                    return this.each(function() {
                        this.innerHTML = ""
                    })
                },
                pluck: function(t) {
                    return $.map(this, function(e) {
                        return e[t]
                    })
                },
                show: function() {
                    return this.each(function() {
                        "none" == this.style.display && (this.style.display = ""), "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = h(this.nodeName))
                    })
                },
                replaceWith: function(t) {
                    return this.before(t).remove()
                },
                wrap: function(t) {
                    var n = e(t);
                    if (this[0] && !n) var i = $(t).get(0),
                        r = i.parentNode || this.length > 1;
                    return this.each(function(e) {
                        $(this).wrapAll(n ? t.call(this, e) : r ? i.cloneNode(!0) : i)
                    })
                },
                wrapAll: function(t) {
                    if (this[0]) {
                        $(this[0]).before(t = $(t));
                        for (var e;
                            (e = t.children()).length;) t = e.first();
                        $(t).append(this)
                    }
                    return this
                },
                wrapInner: function(t) {
                    var n = e(t);
                    return this.each(function(e) {
                        var i = $(this),
                            r = i.contents(),
                            o = n ? t.call(this, e) : t;
                        r.length ? r.wrapAll(o) : i.append(o)
                    })
                },
                unwrap: function() {
                    return this.parent().each(function() {
                        $(this).replaceWith($(this).children())
                    }), this
                },
                clone: function() {
                    return this.map(function() {
                        return this.cloneNode(!0)
                    })
                },
                hide: function() {
                    return this.css("display", "none")
                },
                toggle: function(t) {
                    return this.each(function() {
                        var e = $(this);
                        (t === w ? "none" == e.css("display") : t) ? e.show(): e.hide()
                    })
                },
                prev: function(t) {
                    return $(this.pluck("previousElementSibling")).filter(t || "*")
                },
                next: function(t) {
                    return $(this.pluck("nextElementSibling")).filter(t || "*")
                },
                html: function(t) {
                    return 0 === arguments.length ? this.length > 0 ? this[0].innerHTML : null : this.each(function(e) {
                        var n = this.innerHTML;
                        $(this).empty().append(g(this, t, e, n))
                    })
                },
                text: function(t) {
                    return 0 === arguments.length ? this.length > 0 ? this[0].textContent : null : this.each(function() {
                        this.textContent = t === w ? "" : "" + t
                    })
                },
                attr: function(t, e) {
                    var n;
                    return "string" == typeof t && e === w ? 0 == this.length || 1 !== this[0].nodeType ? w : "value" == t && "INPUT" == this[0].nodeName ? this.val() : !(n = this[0].getAttribute(t)) && t in this[0] ? this[0][t] : n : this.each(function(n) {
                        if (1 === this.nodeType)
                            if (r(t))
                                for (L in t) v(this, L, t[L]);
                            else v(this, t, g(this, e, n, this.getAttribute(t)))
                    })
                },
                removeAttr: function(t) {
                    return this.each(function() {
                        1 === this.nodeType && v(this, t)
                    })
                },
                prop: function(t, e) {
                    return t = G[t] || t, e === w ? this[0] && this[0][t] : this.each(function(n) {
                        this[t] = g(this, e, n, this[t])
                    })
                },
                data: function(t, e) {
                    var n = this.attr("data-" + t.replace(P, "-$1").toLowerCase(), e);
                    return null !== n ? b(n) : w
                },
                val: function(t) {
                    return 0 === arguments.length ? this[0] && (this[0].multiple ? $(this[0]).find("option").filter(function() {
                        return this.selected
                    }).pluck("value") : this[0].value) : this.each(function(e) {
                        this.value = g(this, t, e, this.value)
                    })
                },
                offset: function(t) {
                    if (t) return this.each(function(e) {
                        var n = $(this),
                            i = g(this, t, e, n.offset()),
                            r = n.offsetParent().offset(),
                            o = {
                                top: i.top - r.top,
                                left: i.left - r.left
                            };
                        "static" == n.css("position") && (o.position = "relative"), n.css(o)
                    });
                    if (0 == this.length) return null;
                    var e = this[0].getBoundingClientRect();
                    return {
                        left: e.left + window.pageXOffset,
                        top: e.top + window.pageYOffset,
                        width: Math.round(e.width),
                        height: Math.round(e.height)
                    }
                },
                css: function(e, n) {
                    if (arguments.length < 2) {
                        var i = this[0],
                            r = getComputedStyle(i, "");
                        if (!i) return;
                        if ("string" == typeof e) return i.style[J(e)] || r.getPropertyValue(e);
                        if (Y(e)) {
                            var o = {};
                            return $.each(Y(e) ? e : [e], function(t, e) {
                                o[e] = i.style[J(e)] || r.getPropertyValue(e)
                            }), o
                        }
                    }
                    var a = "";
                    if ("string" == t(e)) n || 0 === n ? a = c(e) + ":" + f(e, n) : this.each(function() {
                        this.style.removeProperty(c(e))
                    });
                    else
                        for (L in e) e[L] || 0 === e[L] ? a += c(L) + ":" + f(L, e[L]) + ";" : this.each(function() {
                            this.style.removeProperty(c(L))
                        });
                    return this.each(function() {
                        this.style.cssText += ";" + a
                    })
                },
                index: function(t) {
                    return t ? this.indexOf($(t)[0]) : this.parent().children().indexOf(this[0])
                },
                hasClass: function(t) {
                    return t ? E.some.call(this, function(t) {
                        return this.test(y(t))
                    }, l(t)) : !1
                },
                addClass: function(t) {
                    return t ? this.each(function(e) {
                        x = [];
                        var n = y(this),
                            i = g(this, t, e, n);
                        i.split(/\s+/g).forEach(function(t) {
                            $(this).hasClass(t) || x.push(t)
                        }, this), x.length && y(this, n + (n ? " " : "") + x.join(" "))
                    }) : this
                },
                removeClass: function(t) {
                    return this.each(function(e) {
                        return t === w ? y(this, "") : (x = y(this), g(this, t, e, x).split(/\s+/g).forEach(function(t) {
                            x = x.replace(l(t), " ")
                        }), void y(this, x.trim()))
                    })
                },
                toggleClass: function(t, e) {
                    return t ? this.each(function(n) {
                        var i = $(this),
                            r = g(this, t, n, y(this));
                        r.split(/\s+/g).forEach(function(t) {
                            (e === w ? !i.hasClass(t) : e) ? i.addClass(t): i.removeClass(t)
                        })
                    }) : this
                },
                scrollTop: function(t) {
                    if (this.length) {
                        var e = "scrollTop" in this[0];
                        return t === w ? e ? this[0].scrollTop : this[0].pageYOffset : this.each(e ? function() {
                            this.scrollTop = t
                        } : function() {
                            this.scrollTo(this.scrollX, t)
                        })
                    }
                },
                scrollLeft: function(t) {
                    if (this.length) {
                        var e = "scrollLeft" in this[0];
                        return t === w ? e ? this[0].scrollLeft : this[0].pageXOffset : this.each(e ? function() {
                            this.scrollLeft = t
                        } : function() {
                            this.scrollTo(t, this.scrollY)
                        })
                    }
                },
                position: function() {
                    if (this.length) {
                        var t = this[0],
                            e = this.offsetParent(),
                            n = this.offset(),
                            i = A.test(e[0].nodeName) ? {
                                top: 0,
                                left: 0
                            } : e.offset();
                        return n.top -= parseFloat($(t).css("margin-top")) || 0, n.left -= parseFloat($(t).css("margin-left")) || 0, i.top += parseFloat($(e[0]).css("border-top-width")) || 0, i.left += parseFloat($(e[0]).css("border-left-width")) || 0, {
                            top: n.top - i.top,
                            left: n.left - i.left
                        }
                    }
                },
                offsetParent: function() {
                    return this.map(function() {
                        for (var t = this.offsetParent || T.body; t && !A.test(t.nodeName) && "static" == $(t).css("position");) t = t.offsetParent;
                        return t
                    })
                }
            }, $.fn.detach = $.fn.remove, ["width", "height"].forEach(function(t) {
                var e = t.replace(/./, function(t) {
                    return t[0].toUpperCase()
                });
                $.fn[t] = function(r) {
                    var o, a = this[0];
                    return r === w ? n(a) ? a["inner" + e] : i(a) ? a.documentElement["scroll" + e] : (o = this.offset()) && o[t] : this.each(function(e) {
                        a = $(this), a.css(t, g(this, r, e, a[t]()))
                    })
                }
            }), q.forEach(function(e, n) {
                var i = n % 2;
                $.fn[e] = function() {
                    var e, r = $.map(arguments, function(n) {
                            return e = t(n), "object" == e || "array" == e || null == n ? n : W.fragment(n)
                        }),
                        o, a = this.length > 1;
                    return r.length < 1 ? this : this.each(function(t, e) {
                        o = i ? e : e.parentNode, e = 0 == n ? e.nextSibling : 1 == n ? e.firstChild : 2 == n ? e : null, r.forEach(function(t) {
                            if (a) t = t.cloneNode(!0);
                            else if (!o) return $(t).remove();
                            _(o.insertBefore(t, e), function(t) {
                                null == t.nodeName || "SCRIPT" !== t.nodeName.toUpperCase() || t.type && "text/javascript" !== t.type || t.src || window.eval.call(window, t.innerHTML)
                            })
                        })
                    })
                }, $.fn[i ? e + "To" : "insert" + (n ? "Before" : "After")] = function(t) {
                    return $(t)[e](this), this
                }
            }), W.Z.prototype = $.fn, W.uniq = Q, W.deserializeValue = b, $.zepto = W, $
        }();
        window.Zepto = e, void 0 === window.$ && (window.$ = e),
            function($) {
                function t(t) {
                    return t._zid || (t._zid = f++)
                }

                function e(e, r, o, a) {
                    if (r = n(r), r.ns) var s = i(r.ns);
                    return (g[t(e)] || []).filter(function(e) {
                        return !(!e || r.e && e.e != r.e || r.ns && !s.test(e.ns) || o && t(e.fn) !== t(o) || a && e.sel != a)
                    })
                }

                function n(t) {
                    var e = ("" + t).split(".");
                    return {
                        e: e[0],
                        ns: e.slice(1).sort().join(" ")
                    }
                }

                function i(t) {
                    return new RegExp("(?:^| )" + t.replace(" ", " .* ?") + "(?: |$)")
                }

                function r(t, e) {
                    return t.del && !y && t.e in b || !!e
                }

                function o(t) {
                    return _[t] || y && b[t] || t
                }

                function a(e, i, a, s, c, l, f) {
                    var d = t(e),
                        p = g[d] || (g[d] = []);
                    i.split(/\s/).forEach(function(t) {
                        if ("ready" == t) return $(document).ready(a);
                        var i = n(t);
                        i.fn = a, i.sel = c, i.e in _ && (a = function(t) {
                            var e = t.relatedTarget;
                            return !e || e !== this && !$.contains(this, e) ? i.fn.apply(this, arguments) : void 0
                        }), i.del = l;
                        var d = l || a;
                        i.proxy = function(t) {
                            if (t = u(t), !t.isImmediatePropagationStopped()) {
                                t.data = s;
                                var n = d.apply(e, t._args == h ? [t] : [t].concat(t._args));
                                return n === !1 && (t.preventDefault(), t.stopPropagation()), n
                            }
                        }, i.i = p.length, p.push(i), "addEventListener" in e && e.addEventListener(o(i.e), i.proxy, r(i, f))
                    })
                }

                function s(n, i, a, s, u) {
                    var c = t(n);
                    (i || "").split(/\s/).forEach(function(t) {
                        e(n, t, a, s).forEach(function(t) {
                            delete g[c][t.i], "removeEventListener" in n && n.removeEventListener(o(t.e), t.proxy, r(t, u))
                        })
                    })
                }

                function u(t, e) {
                    return (e || !t.isDefaultPrevented) && (e || (e = t), $.each(E, function(n, i) {
                        var r = e[n];
                        t[n] = function() {
                            return this[i] = w, r && r.apply(e, arguments)
                        }, t[i] = L
                    }), (e.defaultPrevented !== h ? e.defaultPrevented : "returnValue" in e ? e.returnValue === !1 : e.getPreventDefault && e.getPreventDefault()) && (t.isDefaultPrevented = w)), t
                }

                function c(t) {
                    var e, n = {
                        originalEvent: t
                    };
                    for (e in t) x.test(e) || t[e] === h || (n[e] = t[e]);
                    return u(n, t)
                }
                var l = $.zepto.qsa,
                    f = 1,
                    h, d = Array.prototype.slice,
                    p = $.isFunction,
                    m = function(t) {
                        return "string" == typeof t
                    },
                    g = {},
                    v = {},
                    y = "onfocusin" in window,
                    b = {
                        focus: "focusin",
                        blur: "focusout"
                    },
                    _ = {
                        mouseenter: "mouseover",
                        mouseleave: "mouseout"
                    };
                v.click = v.mousedown = v.mouseup = v.mousemove = "MouseEvents", $.event = {
                    add: a,
                    remove: s
                }, $.proxy = function(e, n) {
                    if (p(e)) {
                        var i = function() {
                            return e.apply(n, arguments)
                        };
                        return i._zid = t(e), i
                    }
                    if (m(n)) return $.proxy(e[n], e);
                    throw new TypeError("expected function")
                }, $.fn.bind = function(t, e, n) {
                    return this.on(t, e, n)
                }, $.fn.unbind = function(t, e) {
                    return this.off(t, e)
                }, $.fn.one = function(t, e, n, i) {
                    return this.on(t, e, n, i, 1)
                };
                var w = function() {
                        return !0
                    },
                    L = function() {
                        return !1
                    },
                    x = /^([A-Z]|returnValue$|layer[XY]$)/,
                    E = {
                        preventDefault: "isDefaultPrevented",
                        stopImmediatePropagation: "isImmediatePropagationStopped",
                        stopPropagation: "isPropagationStopped"
                    };
                $.fn.delegate = function(t, e, n) {
                    return this.on(e, t, n)
                }, $.fn.undelegate = function(t, e, n) {
                    return this.off(e, t, n)
                }, $.fn.live = function(t, e) {
                    return $(document.body).delegate(this.selector, t, e), this
                }, $.fn.die = function(t, e) {
                    return $(document.body).undelegate(this.selector, t, e), this
                }, $.fn.on = function(t, e, n, i, r) {
                    var o, u, l = this;
                    return t && !m(t) ? ($.each(t, function(t, i) {
                        l.on(t, e, n, i, r)
                    }), l) : (m(e) || p(i) || i === !1 || (i = n, n = e, e = h), (p(n) || n === !1) && (i = n, n = h), i === !1 && (i = L), l.each(function(l, f) {
                        r && (o = function(t) {
                            return s(f, t.type, i), i.apply(this, arguments)
                        }), e && (u = function(t) {
                            var n, r = $(t.target).closest(e, f).get(0);
                            return r && r !== f ? (n = $.extend(c(t), {
                                currentTarget: r,
                                liveFired: f
                            }), (o || i).apply(r, [n].concat(d.call(arguments, 1)))) : void 0
                        }), a(f, t, i, n, e, u || o)
                    }))
                }, $.fn.off = function(t, e, n) {
                    var i = this;
                    return t && !m(t) ? ($.each(t, function(t, n) {
                        i.off(t, e, n)
                    }), i) : (m(e) || p(n) || n === !1 || (n = e, e = h), n === !1 && (n = L), i.each(function() {
                        s(this, t, n, e)
                    }))
                }, $.fn.trigger = function(t, e) {
                    return t = m(t) || $.isPlainObject(t) ? $.Event(t) : u(t), t._args = e, this.each(function() {
                        "dispatchEvent" in this ? this.dispatchEvent(t) : $(this).triggerHandler(t, e)
                    })
                }, $.fn.triggerHandler = function(t, n) {
                    var i, r;
                    return this.each(function(o, a) {
                        i = c(m(t) ? $.Event(t) : t), i._args = n, i.target = a, $.each(e(a, t.type || t), function(t, e) {
                            return r = e.proxy(i), i.isImmediatePropagationStopped() ? !1 : void 0
                        })
                    }), r
                }, "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(t) {
                    $.fn[t] = function(e) {
                        return e ? this.bind(t, e) : this.trigger(t)
                    }
                }), ["focus", "blur"].forEach(function(t) {
                    $.fn[t] = function(e) {
                        return e ? this.bind(t, e) : this.each(function() {
                            try {
                                this[t]()
                            } catch (e) {}
                        }), this
                    }
                }), $.Event = function(t, e) {
                    m(t) || (e = t, t = e.type);
                    var n = document.createEvent(v[t] || "Events"),
                        i = !0;
                    if (e)
                        for (var r in e) "bubbles" == r ? i = !!e[r] : n[r] = e[r];
                    return n.initEvent(t, i, !0), u(n)
                }
            }(e),
            function($) {
                function t(t, e, n) {
                    var i = $.Event(e);
                    return $(t).trigger(i, n), !i.isDefaultPrevented()
                }

                function e(e, n, i, r) {
                    return e.global ? t(n || m, i, r) : void 0
                }

                function n(t) {
                    t.global && 0 === $.active++ && e(t, null, "ajaxStart")
                }

                function i(t) {
                    t.global && !--$.active && e(t, null, "ajaxStop")
                }

                function r(t, n) {
                    var i = n.context;
                    return n.beforeSend.call(i, t, n) === !1 || e(n, i, "ajaxBeforeSend", [t, n]) === !1 ? !1 : void e(n, i, "ajaxSend", [t, n])
                }

                function o(t, n, i, r) {
                    var o = i.context,
                        a = "success";
                    i.success.call(o, t, a, n),
                        r && r.resolveWith(o, [t, a, n]), e(i, o, "ajaxSuccess", [n, i, t]), s(a, n, i)
                }

                function a(t, n, i, r, o) {
                    var a = r.context;
                    r.error.call(a, i, n, t), o && o.rejectWith(a, [i, n, t]), e(r, a, "ajaxError", [i, r, t || n]), s(n, i, r)
                }

                function s(t, n, r) {
                    var o = r.context;
                    r.complete.call(o, n, t), e(r, o, "ajaxComplete", [n, r]), i(r)
                }

                function u() {}

                function c(t) {
                    return t && (t = t.split(";", 2)[0]), t && (t == L ? "html" : t == w ? "json" : b.test(t) ? "script" : _.test(t) && "xml") || "text"
                }

                function l(t, e) {
                    return "" == e ? t : (t + "&" + e).replace(/[&?]{1,2}/, "?")
                }

                function f(t) {
                    t.processData && t.data && "string" != $.type(t.data) && (t.data = $.param(t.data, t.traditional)), !t.data || t.type && "GET" != t.type.toUpperCase() || (t.url = l(t.url, t.data), t.data = void 0)
                }

                function h(t, e, n, i) {
                    var r = !$.isFunction(e);
                    return {
                        url: t,
                        data: r ? e : void 0,
                        success: r ? $.isFunction(n) ? n : void 0 : e,
                        dataType: r ? i || n : n
                    }
                }

                function d(t, e, n, i) {
                    var r, o = $.isArray(e),
                        a = $.isPlainObject(e);
                    $.each(e, function(e, s) {
                        r = $.type(s), i && (e = n ? i : i + "[" + (a || "object" == r || "array" == r ? e : "") + "]"), !i && o ? t.add(s.name, s.value) : "array" == r || !n && "object" == r ? d(t, s, n, e) : t.add(e, s)
                    })
                }
                var p = 0,
                    m = window.document,
                    g, v, y = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                    b = /^(?:text|application)\/javascript/i,
                    _ = /^(?:text|application)\/xml/i,
                    w = "application/json",
                    L = "text/html",
                    x = /^\s*$/;
                $.active = 0, $.ajaxJSONP = function(t, e) {
                    if (!("type" in t)) return $.ajax(t);
                    var n = t.jsonpCallback,
                        i = ($.isFunction(n) ? n() : n) || "jsonp" + ++p,
                        s = m.createElement("script"),
                        u = window[i],
                        c, l = function(t) {
                            $(s).triggerHandler("error", t || "abort")
                        },
                        f = {
                            abort: l
                        },
                        h;
                    return e && e.promise(f), $(s).on("load error", function(n, r) {
                        clearTimeout(h), $(s).off().remove(), "error" != n.type && c ? o(c[0], f, t, e) : a(null, r || "error", f, t, e), window[i] = u, c && $.isFunction(u) && u(c[0]), u = c = void 0
                    }), r(f, t) === !1 ? (l("abort"), f) : (window[i] = function() {
                        c = arguments
                    }, s.src = t.url.replace(/\?(.+)=\?/, "?$1=" + i), m.head.appendChild(s), t.timeout > 0 && (h = setTimeout(function() {
                        l("timeout")
                    }, t.timeout)), f)
                }, $.ajaxSettings = {
                    type: "GET",
                    beforeSend: u,
                    success: u,
                    error: u,
                    complete: u,
                    context: null,
                    global: !0,
                    xhr: function() {
                        return new window.XMLHttpRequest
                    },
                    accepts: {
                        script: "text/javascript, application/javascript, application/x-javascript",
                        json: w,
                        xml: "application/xml, text/xml",
                        html: L,
                        text: "text/plain"
                    },
                    crossDomain: !1,
                    timeout: 0,
                    processData: !0,
                    cache: !0
                }, $.ajax = function(t) {
                    var e = $.extend({}, t || {}),
                        i = $.Deferred && $.Deferred();
                    for (g in $.ajaxSettings) void 0 === e[g] && (e[g] = $.ajaxSettings[g]);
                    n(e), e.crossDomain || (e.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(e.url) && RegExp.$2 != window.location.host), e.url || (e.url = window.location.toString()), f(e), e.cache === !1 && (e.url = l(e.url, "_=" + Date.now()));
                    var s = e.dataType,
                        h = /\?.+=\?/.test(e.url);
                    if ("jsonp" == s || h) return h || (e.url = l(e.url, e.jsonp ? e.jsonp + "=?" : e.jsonp === !1 ? "" : "callback=?")), $.ajaxJSONP(e, i);
                    var d = e.accepts[s],
                        p = {},
                        m = function(t, e) {
                            p[t.toLowerCase()] = [t, e]
                        },
                        y = /^([\w-]+:)\/\//.test(e.url) ? RegExp.$1 : window.location.protocol,
                        b = e.xhr(),
                        _ = b.setRequestHeader,
                        w;
                    if (i && i.promise(b), e.crossDomain || m("X-Requested-With", "XMLHttpRequest"), m("Accept", d || "*/*"), (d = e.mimeType || d) && (d.indexOf(",") > -1 && (d = d.split(",", 2)[0]), b.overrideMimeType && b.overrideMimeType(d)), (e.contentType || e.contentType !== !1 && e.data && "GET" != e.type.toUpperCase()) && m("Content-Type", e.contentType || "application/x-www-form-urlencoded"), e.headers)
                        for (v in e.headers) m(v, e.headers[v]);
                    if (b.setRequestHeader = m, b.onreadystatechange = function() {
                            if (4 == b.readyState) {
                                b.onreadystatechange = u, clearTimeout(w);
                                var t, n = !1;
                                if (b.status >= 200 && b.status < 300 || 304 == b.status || 0 == b.status && "file:" == y) {
                                    s = s || c(e.mimeType || b.getResponseHeader("content-type")), t = b.responseText;
                                    try {
                                        "script" == s ? (1, eval)(t) : "xml" == s ? t = b.responseXML : "json" == s && (t = x.test(t) ? null : $.parseJSON(t))
                                    } catch (r) {
                                        n = r
                                    }
                                    n ? a(n, "parsererror", b, e, i) : o(t, b, e, i)
                                } else a(b.statusText || null, b.status ? "error" : "abort", b, e, i)
                            }
                        }, r(b, e) === !1) return b.abort(), a(null, "abort", b, e, i), b;
                    if (e.xhrFields)
                        for (v in e.xhrFields) b[v] = e.xhrFields[v];
                    var L = "async" in e ? e.async : !0;
                    b.open(e.type, e.url, L, e.username, e.password);
                    for (v in p) _.apply(b, p[v]);
                    return e.timeout > 0 && (w = setTimeout(function() {
                        b.onreadystatechange = u, b.abort(), a(null, "timeout", b, e, i)
                    }, e.timeout)), b.send(e.data ? e.data : null), b
                }, $.get = function(t, e, n, i) {
                    return $.ajax(h.apply(null, arguments))
                }, $.post = function(t, e, n, i) {
                    var r = h.apply(null, arguments);
                    return r.type = "POST", $.ajax(r)
                }, $.getJSON = function(t, e, n) {
                    var i = h.apply(null, arguments);
                    return i.dataType = "json", $.ajax(i)
                }, $.fn.load = function(t, e, n) {
                    if (!this.length) return this;
                    var i = this,
                        r = t.split(/\s/),
                        o, a = h(t, e, n),
                        s = a.success;
                    return r.length > 1 && (a.url = r[0], o = r[1]), a.success = function(t) {
                        i.html(o ? $("<div>").html(t.replace(y, "")).find(o) : t), s && s.apply(i, arguments)
                    }, $.ajax(a), this
                };
                var E = encodeURIComponent;
                $.param = function(t, e) {
                    var n = [];
                    return n.add = function(t, e) {
                        this.push(E(t) + "=" + E(e))
                    }, d(n, t, e), n.join("&").replace(/%20/g, "+")
                }
            }(e),
            function($) {
                $.fn.serializeArray = function() {
                    var t = [],
                        e;
                    return $([].slice.call(this.get(0).elements)).each(function() {
                        e = $(this);
                        var n = e.attr("type");
                        "fieldset" != this.nodeName.toLowerCase() && !this.disabled && "submit" != n && "reset" != n && "button" != n && ("radio" != n && "checkbox" != n || this.checked) && t.push({
                            name: e.attr("name"),
                            value: e.val()
                        })
                    }), t
                }, $.fn.serialize = function() {
                    var t = [];
                    return this.serializeArray().forEach(function(e) {
                        t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value))
                    }), t.join("&")
                }, $.fn.submit = function(t) {
                    if (t) this.bind("submit", t);
                    else if (this.length) {
                        var e = $.Event("submit");
                        this.eq(0).trigger(e), e.isDefaultPrevented() || this.get(0).submit()
                    }
                    return this
                }
            }(e),
            function($) {
                "__proto__" in {} || $.extend($.zepto, {
                    Z: function(t, e) {
                        return t = t || [], $.extend(t, $.fn), t.selector = e || "", t.__Z = !0, t
                    },
                    isZ: function(t) {
                        return "array" === $.type(t) && "__Z" in t
                    }
                });
                try {
                    getComputedStyle(void 0)
                } catch (t) {
                    var e = getComputedStyle;
                    window.getComputedStyle = function(t) {
                        try {
                            return e(t)
                        } catch (n) {
                            return null
                        }
                    }
                }
            }(e), t.getJSON = e.getJSON, t.ajax = e.ajax
    }(KL), KL.Easings = {
        ease: [.25, .1, .25, 1],
        linear: [0, 0, 1, 1],
        easein: [.42, 0, 1, 1],
        easeout: [0, 0, .58, 1],
        easeinout: [.42, 0, .58, 1]
    }, KL.Ease = {
        KeySpline: function(t) {
            function e(t, e) {
                return 1 - 3 * e + 3 * t
            }

            function n(t, e) {
                return 3 * e - 6 * t
            }

            function i(t) {
                return 3 * t
            }

            function r(t, r, o) {
                return ((e(r, o) * t + n(r, o)) * t + i(r)) * t
            }

            function o(t, r, o) {
                return 3 * e(r, o) * t * t + 2 * n(r, o) * t + i(r)
            }

            function a(e) {
                for (var n = e, i = 0; 4 > i; ++i) {
                    var a = o(n, t[0], t[2]);
                    if (0 == a) return n;
                    var s = r(n, t[0], t[2]) - e;
                    n -= s / a
                }
                return n
            }
            this.get = function(e) {
                return t[0] == t[1] && t[2] == t[3] ? e : r(a(e), t[1], t[3])
            }
        },
        easeInSpline: function(t) {
            var e = new KL.Ease.KeySpline(KL.Easings.easein);
            return e.get(t)
        },
        easeInOutExpo: function(t) {
            var e = new KL.Ease.KeySpline(KL.Easings.easein);
            return e.get(t)
        },
        easeOut: function(t) {
            return Math.sin(t * Math.PI / 2)
        },
        easeOutStrong: function(t) {
            return 1 == t ? 1 : 1 - Math.pow(2, -10 * t)
        },
        easeIn: function(t) {
            return t * t
        },
        easeInStrong: function(t) {
            return 0 == t ? 0 : Math.pow(2, 10 * (t - 1))
        },
        easeOutBounce: function(t) {
            return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
        },
        easeInBack: function(t) {
            var e = 1.70158;
            return t * t * ((e + 1) * t - e)
        },
        easeOutBack: function(t) {
            var e = 1.70158;
            return (t -= 1) * t * ((e + 1) * t + e) + 1
        },
        bounce: function(t) {
            return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
        },
        bouncePast: function(t) {
            return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 2 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : 2.5 / 2.75 > t ? 2 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 2 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375)
        },
        swingTo: function(t) {
            var e = 1.70158;
            return (t -= 1) * t * ((e + 1) * t + e) + 1
        },
        swingFrom: function(t) {
            var e = 1.70158;
            return t * t * ((e + 1) * t - e)
        },
        elastic: function(t) {
            return -1 * Math.pow(4, -8 * t) * Math.sin(2 * (6 * t - 1) * Math.PI / 2) + 1
        },
        spring: function(t) {
            return 1 - Math.cos(4.5 * t * Math.PI) * Math.exp(6 * -t)
        },
        blink: function(t, e) {
            return Math.round(t * (e || 5)) % 2
        },
        pulse: function(t, e) {
            return -Math.cos(t * ((e || 5) - .5) * 2 * Math.PI) / 2 + .5
        },
        wobble: function(t) {
            return -Math.cos(t * Math.PI * 9 * t) / 2 + .5
        },
        sinusoidal: function(t) {
            return -Math.cos(t * Math.PI) / 2 + .5
        },
        flicker: function(t) {
            var t = t + (Math.random() - .5) / 5;
            return easings.sinusoidal(0 > t ? 0 : t > 1 ? 1 : t)
        },
        mirror: function(t) {
            return .5 > t ? easings.sinusoidal(2 * t) : easings.sinusoidal(1 - 2 * (t - .5))
        },
        easeInQuad: function(t) {
            return t * t
        },
        easeOutQuad: function(t) {
            return t * (2 - t)
        },
        easeInOutQuad: function(t) {
            return .5 > t ? 2 * t * t : -1 + (4 - 2 * t) * t
        },
        easeInCubic: function(t) {
            return t * t * t
        },
        easeOutCubic: function(t) {
            return --t * t * t + 1
        },
        easeInOutCubic: function(t) {
            return .5 > t ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        },
        easeInQuart: function(t) {
            return t * t * t * t
        },
        easeOutQuart: function(t) {
            return 1 - --t * t * t * t
        },
        easeInOutQuart: function(t) {
            return .5 > t ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
        },
        easeInQuint: function(t) {
            return t * t * t * t * t
        },
        easeOutQuint: function(t) {
            return 1 + --t * t * t * t * t
        },
        easeInOutQuint: function(t) {
            return .5 > t ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
        }
    }, KL.Animate = function(t, e) {
        var n = new vcoanimate(t, e),
            i;
        return n
    }, window.vcoanimate = function() {
        function t(t, e, n) {
            if (Array.prototype.indexOf) return t.indexOf(e);
            for (n = 0; n < t.length; ++n)
                if (t[n] === e) return n
        }

        function e(t) {
            var n, i = q.length;
            for (_ && t > 1e12 && (t = w()), x && (t = w()), n = i; n--;) q[n](t);
            q.length && j(e)
        }

        function n(t) {
            1 === q.push(t) && j(e)
        }

        function i(e) {
            var n, i = t(q, e);
            i >= 0 && (n = q.slice(i + 1), q.length = i, q = q.concat(n))
        }

        function r(t, e) {
            var n = {},
                i;
            return (i = t.match(S)) && (n.rotate = m(i[1], e ? e.rotate : null)), (i = t.match(D)) && (n.scale = m(i[1], e ? e.scale : null)), (i = t.match(N)) && (n.skewx = m(i[1], e ? e.skewx : null), n.skewy = m(i[3], e ? e.skewy : null)), (i = t.match(C)) && (n.translatex = m(i[1], e ? e.translatex : null), n.translatey = m(i[3], e ? e.translatey : null)), n
        }

        function o(t) {
            var e = "";
            return "rotate" in t && (e += "rotate(" + t.rotate + "deg) "), "scale" in t && (e += "scale(" + t.scale + ") "), "translatex" in t && (e += "translate(" + t.translatex + "px," + t.translatey + "px) "), "skewx" in t && (e += "skew(" + t.skewx + "deg," + t.skewy + "deg)"), e
        }

        function a(t, e, n) {
            return "#" + (1 << 24 | t << 16 | e << 8 | n).toString(16).slice(1)
        }

        function s(t) {
            var e = t.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            return (e ? a(e[1], e[2], e[3]) : t).replace(/#(\w)(\w)(\w)$/, "#$1$1$2$2$3$3")
        }

        function u(t) {
            return t.replace(/-(.)/g, function(t, e) {
                return e.toUpperCase()
            })
        }

        function c(t) {
            return "function" == typeof t
        }

        function l(t) {
            return Math.sin(t * Math.PI / 2)
        }

        function f(t, e, r, o, a, s) {
            function u(t) {
                var n = t - p;
                return n > f || m ? (s = isFinite(s) ? s : 1, m ? v && e(s) : e(s), i(u), r && r.apply(h)) : void e(isFinite(s) ? d * o(n / f) + a : o(n / f))
            }
            o = c(o) ? o : g.easings[o] || l;
            var f = t || E,
                h = this,
                d = s - a,
                p = w(),
                m = 0,
                v = 0;
            return n(u), {
                stop: function(t) {
                    m = 1, v = t, t || (r = null)
                }
            }
        }

        function h(t, e) {
            var n = t.length,
                i = [],
                r, o;
            for (r = 0; n > r; ++r) i[r] = [t[r][0], t[r][1]];
            for (o = 1; n > o; ++o)
                for (r = 0; n - o > r; ++r) i[r][0] = (1 - e) * i[r][0] + e * i[parseInt(r + 1, 10)][0], i[r][1] = (1 - e) * i[r][1] + e * i[parseInt(r + 1, 10)][1];
            return [i[0][0], i[0][1]]
        }

        function d(t, e, n) {
            var i = [],
                r, o, a, s;
            for (r = 0; 6 > r; r++) a = Math.min(15, parseInt(e.charAt(r), 16)), s = Math.min(15, parseInt(n.charAt(r), 16)), o = Math.floor((s - a) * t + a), o = o > 15 ? 15 : 0 > o ? 0 : o, i[r] = o.toString(16);
            return "#" + i.join("")
        }

        function p(t, e, n, i, r, o, a) {
            if ("transform" == r) {
                a = {};
                for (var s in n[o][r]) a[s] = s in i[o][r] ? Math.round(((i[o][r][s] - n[o][r][s]) * t + n[o][r][s]) * E) / E : n[o][r][s];
                return a
            }
            return "string" == typeof n[o][r] ? d(t, n[o][r], i[o][r]) : (a = Math.round(((i[o][r] - n[o][r]) * t + n[o][r]) * E) / E, r in M || (a += e[o][r] || "px"), a)
        }

        function m(t, e, n, i, r) {
            return (n = K.exec(t)) ? (r = parseFloat(n[2])) && e + ("+" == n[1] ? 1 : -1) * r : parseFloat(t)
        }

        function g(t, e) {
            var n = t ? n = isFinite(t.length) ? t : [t] : [],
                i, a = e.complete,
                l = e.duration,
                d = e.easing,
                g = e.bezier,
                v = [],
                y = [],
                b = [],
                _ = [],
                w, L;
            for (g && (w = e.left, L = e.top, delete e.right, delete e.bottom, delete e.left, delete e.top), i = n.length; i--;) {
                if (v[i] = {}, y[i] = {}, b[i] = {}, g) {
                    var x = P(n[i], "left"),
                        E = P(n[i], "top"),
                        K = [m(c(w) ? w(n[i]) : w || 0, parseFloat(x)), m(c(L) ? L(n[i]) : L || 0, parseFloat(E))];
                    _[i] = c(g) ? g(n[i], K) : g, _[i].push(K), _[i].unshift([parseInt(x, 10), parseInt(E, 10)])
                }
                for (var S in e) {
                    switch (S) {
                        case "complete":
                        case "duration":
                        case "easing":
                        case "bezier":
                            continue
                    }
                    var D = P(n[i], S),
                        N, C = c(e[S]) ? e[S](n[i]) : e[S];
                    "string" != typeof C || !k.test(C) || k.test(D) ? (v[i][S] = "transform" == S ? r(D) : "string" == typeof C && k.test(C) ? s(D).slice(1) : parseFloat(D), y[i][S] = "transform" == S ? r(C, v[i][S]) : "string" == typeof C && "#" == C.charAt(0) ? s(C).slice(1) : m(C, parseFloat(D)), "string" == typeof C && (N = C.match(T)) && (b[i][S] = N[1])) : delete e[S]
                }
            }
            return f.apply(n, [l, function(t, r, a) {
                for (i = n.length; i--;) {
                    g && (a = h(_[i], t), n[i].style.left = a[0] + "px", n[i].style.top = a[1] + "px");
                    for (var s in e) r = p(t, b, v, y, s, i), "transform" == s ? n[i].style[O] = o(r) : "opacity" != s || A ? n[i].style[u(s)] = r : n[i].style.filter = "alpha(opacity=" + 100 * r + ")"
                }
            }, a, d])
        }
        var v = document,
            y = window,
            b = y.performance,
            _ = b && (b.now || b.webkitNow || b.msNow || b.mozNow),
            w = _ ? function() {
                return _.call(b)
            } : function() {
                return +new Date
            },
            L = v.documentElement,
            x = !1,
            E = 1e3,
            k = /^rgb\(|#/,
            K = /^([+\-])=([\d\.]+)/,
            T = /^(?:[\+\-]=?)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/,
            S = /rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/,
            D = /scale\(((?:[+\-]=)?([\d\.]+))\)/,
            N = /skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/,
            C = /translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/,
            M = {
                lineHeight: 1,
                zoom: 1,
                zIndex: 1,
                opacity: 1,
                transform: 1
            },
            O = function() {
                var t = v.createElement("a").style,
                    e = ["webkitTransform", "MozTransform", "OTransform", "msTransform", "Transform"],
                    n;
                for (n = 0; n < e.length; n++)
                    if (e[n] in t) return e[n]
            }(),
            A = function() {
                return "undefined" != typeof v.createElement("a").style.opacity
            }(),
            P = v.defaultView && v.defaultView.getComputedStyle ? function(t, e) {
                e = "transform" == e ? O : e, e = u(e);
                var n = null,
                    i = v.defaultView.getComputedStyle(t, "");
                return i && (n = i[e]), t.style[e] || n
            } : L.currentStyle ? function(t, e) {
                if (e = u(e), "opacity" == e) {
                    var n = 100;
                    try {
                        n = t.filters["DXImageTransform.Microsoft.Alpha"].opacity
                    } catch (i) {
                        try {
                            n = t.filters("alpha").opacity
                        } catch (r) {}
                    }
                    return n / 100
                }
                var o = t.currentStyle ? t.currentStyle[e] : null;
                return t.style[e] || o
            } : function(t, e) {
                return t.style[u(e)]
            },
            j = function() {
                return y.requestAnimationFrame || y.webkitRequestAnimationFrame || y.mozRequestAnimationFrame || y.msRequestAnimationFrame || y.oRequestAnimationFrame || function(t) {
                    y.setTimeout(function() {
                        t(+new Date)
                    }, 17)
                }
            }(),
            q = [];
        return j(function(t) {
            x = t > 1e12 != w() > 1e12
        }), g.tween = f, g.getStyle = P, g.bezier = h, g.transform = O, g.parseTransform = r, g.formatTransform = o, g.easings = {}, g
    }(), KL.DomMixins = {
        show: function(t) {
            t || (this._el.container.style.display = "block")
        },
        hide: function(t) {
            this._el.container.style.display = "none"
        },
        addTo: function(t) {
            t.appendChild(this._el.container), this.onAdd()
        },
        removeFrom: function(t) {
            t.removeChild(this._el.container), this.onRemove()
        },
        animatePosition: function(t, e) {
            var n = {
                duration: this.options.duration,
                easing: this.options.ease
            };
            for (var i in t) t.hasOwnProperty(i) && (n[i] = t[i] + "px");
            this.animator && this.animator.stop(), this.animator = KL.Animate(e, n)
        },
        onLoaded: function() {
            this.fire("loaded", this.data)
        },
        onAdd: function() {
            this.fire("added", this.data)
        },
        onRemove: function() {
            this.fire("removed", this.data)
        },
        setPosition: function(t, e) {
            for (var n in t) t.hasOwnProperty(n) && (e ? e.style[n] = t[n] + "px" : this._el.container.style[n] = t[n] + "px")
        },
        getPosition: function() {
            return KL.Dom.getPosition(this._el.container)
        }
    }, KL.Dom = {
        get: function(t) {
            return "string" == typeof t ? document.getElementById(t) : t
        },
        getByClass: function(t) {
            return t ? document.getElementsByClassName(t) : void 0
        },
        create: function(t, e, n) {
            var i = document.createElement(t);
            return i.className = e, n && n.appendChild(i), i
        },
        createText: function(t, e) {
            var n = document.createTextNode(t);
            return e && e.appendChild(n), n
        },
        getTranslateString: function(t) {
            return KL.Dom.TRANSLATE_OPEN + t.x + "px," + t.y + "px" + KL.Dom.TRANSLATE_CLOSE
        },
        setPosition: function(t, e) {
            t._vco_pos = e, KL.Browser.webkit3d ? (t.style[KL.Dom.TRANSFORM] = KL.Dom.getTranslateString(e), KL.Browser.android && (t.style["-webkit-perspective"] = "1000", t.style["-webkit-backface-visibility"] = "hidden")) : (t.style.left = e.x + "px", t.style.top = e.y + "px")
        },
        getPosition: function(t) {
            for (var e = {
                    x: 0,
                    y: 0
                }; t && !isNaN(t.offsetLeft) && !isNaN(t.offsetTop);) e.x += t.offsetLeft, e.y += t.offsetTop, t = t.offsetParent;
            return e
        },
        testProp: function(t) {
            for (var e = document.documentElement.style, n = 0; n < t.length; n++)
                if (t[n] in e) return t[n];
            return !1
        }
    }, KL.Util.extend(KL.Dom, {
        TRANSITION: KL.Dom.testProp(["transition", "webkitTransition", "OTransition", "MozTransition", "msTransition"]),
        TRANSFORM: KL.Dom.testProp(["transformProperty", "WebkitTransform", "OTransform", "MozTransform", "msTransform"]),
        TRANSLATE_OPEN: "translate" + (KL.Browser.webkit3d ? "3d(" : "("),
        TRANSLATE_CLOSE: KL.Browser.webkit3d ? ",0)" : ")"
    }), KL.DomUtil = {
        get: function(t) {
            return "string" == typeof t ? document.getElementById(t) : t
        },
        getStyle: function(t, e) {
            var n = t.style[e];
            if (!n && t.currentStyle && (n = t.currentStyle[e]), !n || "auto" === n) {
                var i = document.defaultView.getComputedStyle(t, null);
                n = i ? i[e] : null
            }
            return "auto" === n ? null : n
        },
        getViewportOffset: function(t) {
            var e = 0,
                n = 0,
                i = t,
                r = document.body;
            do {
                if (e += i.offsetTop || 0, n += i.offsetLeft || 0, i.offsetParent === r && "absolute" === KL.DomUtil.getStyle(i, "position")) break;
                i = i.offsetParent
            } while (i);
            i = t;
            do {
                if (i === r) break;
                e -= i.scrollTop || 0, n -= i.scrollLeft || 0, i = i.parentNode
            } while (i);
            return new KL.Point(n, e)
        },
        create: function(t, e, n) {
            var i = document.createElement(t);
            return i.className = e, n && n.appendChild(i), i
        },
        disableTextSelection: function() {
            document.selection && document.selection.empty && document.selection.empty(), this._onselectstart || (this._onselectstart = document.onselectstart, document.onselectstart = KL.Util.falseFn)
        },
        enableTextSelection: function() {
            document.onselectstart = this._onselectstart, this._onselectstart = null
        },
        hasClass: function(t, e) {
            return t.className.length > 0 && new RegExp("(^|\\s)" + e + "(\\s|$)").test(t.className)
        },
        addClass: function(t, e) {
            KL.DomUtil.hasClass(t, e) || (t.className += (t.className ? " " : "") + e)
        },
        removeClass: function(t, e) {
            t.className = t.className.replace(/(\S+)\s*/g, function(t, n) {
                return n === e ? "" : t
            }).replace(/^\s+/, "")
        },
        setOpacity: function(t, e) {
            KL.Browser.ie ? t.style.filter = "alpha(opacity=" + Math.round(100 * e) + ")" : t.style.opacity = e
        },
        testProp: function(t) {
            for (var e = document.documentElement.style, n = 0; n < t.length; n++)
                if (t[n] in e) return t[n];
            return !1
        },
        getTranslateString: function(t) {
            return KL.DomUtil.TRANSLATE_OPEN + t.x + "px," + t.y + "px" + KL.DomUtil.TRANSLATE_CLOSE
        },
        getScaleString: function(t, e) {
            var n = KL.DomUtil.getTranslateString(e),
                i = " scale(" + t + ") ",
                r = KL.DomUtil.getTranslateString(e.multiplyBy(-1));
            return n + i + r
        },
        setPosition: function(t, e) {
            t._vco_pos = e, KL.Browser.webkit3d ? (t.style[KL.DomUtil.TRANSFORM] = KL.DomUtil.getTranslateString(e), KL.Browser.android && (t.style["-webkit-perspective"] = "1000", t.style["-webkit-backface-visibility"] = "hidden")) : (t.style.left = e.x + "px", t.style.top = e.y + "px")
        },
        getPosition: function(t) {
            return t._vco_pos
        }
    }, KL.DomEvent = {
        addListener: function(t, e, n, i) {
            var r = KL.Util.stamp(n),
                o = "_vco_" + e + r;
            if (!t[o]) {
                var a = function(e) {
                    return n.call(i || t, e || KL.DomEvent._getEvent())
                };
                if (KL.Browser.touch && "dblclick" === e && this.addDoubleTapListener) this.addDoubleTapListener(t, a, r);
                else if ("addEventListener" in t)
                    if ("mousewheel" === e) t.addEventListener("DOMMouseScroll", a, !1), t.addEventListener(e, a, !1);
                    else if ("mouseenter" === e || "mouseleave" === e) {
                    var s = a,
                        u = "mouseenter" === e ? "mouseover" : "mouseout";
                    a = function(e) {
                        return KL.DomEvent._checkMouse(t, e) ? s(e) : void 0
                    }, t.addEventListener(u, a, !1)
                } else t.addEventListener(e, a, !1);
                else "attachEvent" in t && t.attachEvent("on" + e, a);
                t[o] = a
            }
        },
        removeListener: function(t, e, n) {
            var i = KL.Util.stamp(n),
                r = "_vco_" + e + i,
                o = t[r];
            o && (KL.Browser.touch && "dblclick" === e && this.removeDoubleTapListener ? this.removeDoubleTapListener(t, i) : "removeEventListener" in t ? "mousewheel" === e ? (t.removeEventListener("DOMMouseScroll", o, !1), t.removeEventListener(e, o, !1)) : "mouseenter" === e || "mouseleave" === e ? t.removeEventListener("mouseenter" === e ? "mouseover" : "mouseout", o, !1) : t.removeEventListener(e, o, !1) : "detachEvent" in t && t.detachEvent("on" + e, o), t[r] = null)
        },
        _checkMouse: function(t, e) {
            var n = e.relatedTarget;
            if (!n) return !0;
            try {
                for (; n && n !== t;) n = n.parentNode
            } catch (i) {
                return !1
            }
            return n !== t
        },
        _getEvent: function() {
            var t = window.event;
            if (!t)
                for (var e = arguments.callee.caller; e && (t = e.arguments[0], !t || window.Event !== t.constructor);) e = e.caller;
            return t
        },
        stopPropagation: function(t) {
            t.stopPropagation ? t.stopPropagation() : t.cancelBubble = !0
        },
        disableClickPropagation: function(t) {
            KL.DomEvent.addListener(t, KL.Draggable.START, KL.DomEvent.stopPropagation), KL.DomEvent.addListener(t, "click", KL.DomEvent.stopPropagation), KL.DomEvent.addListener(t, "dblclick", KL.DomEvent.stopPropagation)
        },
        preventDefault: function(t) {
            t.preventDefault ? t.preventDefault() : t.returnValue = !1
        },
        stop: function(t) {
            KL.DomEvent.preventDefault(t), KL.DomEvent.stopPropagation(t)
        },
        getWheelDelta: function(t) {
            var e = 0;
            return t.wheelDelta && (e = t.wheelDelta / 120), t.detail && (e = -t.detail / 3), e
        }
    }, KL.StyleSheet = KL.Class.extend({
        includes: [KL.Events],
        _el: {},
        initialize: function() {
            this.style = document.createElement("style"), this.style.appendChild(document.createTextNode("")), document.head.appendChild(this.style), this.sheet = this.style.sheet
        },
        addRule: function(t, e, n) {
            var i = 0;
            n && (i = n), "insertRule" in this.sheet ? this.sheet.insertRule(t + "{" + e + "}", i) : "addRule" in this.sheet && this.sheet.addRule(t, e, i)
        },
        onLoaded: function(t) {
            this._state.loaded = !0, this.fire("loaded", this.data)
        }
    }), KL.QuoteComposition = KL.Class.extend({
        includes: [KL.Events, KL.DomMixins],
        _el: {},
        initialize: function(t, e, n) {
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
            }, this.data = {
                quote: "Quote goes here, gonna make it longer to see",
                cite: "Citation",
                image: "Description",
                credit: ""
            }, this.options = {
                editable: !0,
                anchor: !1,
                classname: "",
                base_classname: "kl-quotecomposition"
            }, this.animator = null, KL.Util.mergeData(this.options, e), KL.Util.mergeData(this.data, t), this._el.container = KL.Dom.create("div", this.options.base_classname), this._updateClassName(), this._initLayout(), this._initEvents(), n && n.appendChild(this._el.container)
        },
        update: function() {
            this._update()
        },
        _onMouseClick: function() {
            this.fire("clicked", this.options)
        },
        _onAnchorLeft: function(t) {
            this.options.anchor = "left", this._updateClassName(), this._updateAlignButtons(this._el.button_anchor_left)
        },
        _onAnchorRight: function(t) {
            this.options.anchor = "right", this._updateClassName(), this._updateAlignButtons(this._el.button_anchor_right)
        },
        _onAnchorCenter: function(t) {
            this.options.anchor = !1, this._updateClassName(), this._updateAlignButtons(this._el.button_anchor_center)
        },
        _onMake: function(t) {
            var e = "?";
            e += "anchor=" + this.options.anchor, e += "&quote=" + this._el.blockquote_p.innerHTML, e += "&cite=" + this._el.citation.innerHTML, e += "&image=" + this.data.image, e += "&credit=" + this.data.credit, window.location.origin || (window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : ""));
            var n = window.open(window.location.origin + "/composition.html" + e, "_blank");
            n.focus()
        },
        _onLoaded: function() {
            this.fire("loaded", this.options)
        },
        _updateAlignButtons: function(t) {
            this._el.button_anchor_left.className = "btn btn-default", this._el.button_anchor_center.className = "btn btn-default", this._el.button_anchor_right.className = "btn btn-default", t.className = "btn btn-default active"
        },
        _update: function() {
            this._el.blockquote_p.innerHTML = this.data.quote, this._el.citation.innerHTML = this.data.cite, this._el.image.style.backgroundImage = "url('" + this.data.image + "')", this._el.blockquote_p.contentEditable = this.options.editable, this._el.citation.contentEditable = this.options.editable
        },
        _updateClassName: function() {
            this.options.classname = this.options.base_classname, this.options.anchor && (this.options.classname += " kl-anchor-" + this.options.anchor), this.options.editable && (this.options.classname += " kl-editable"), this._el.container.className = this.options.classname
        },
        _initLayout: function() {
            this._el.composition_container = KL.Dom.create("div", "kl-quotecomposition-container", this._el.container), this._el.composition_text = KL.Dom.create("div", "kl-quotecomposition-text", this._el.composition_container), this._el.blockquote = KL.Dom.create("blockquote", "", this._el.composition_text), this._el.blockquote_p = KL.Dom.create("p", "", this._el.blockquote), this._el.citation = KL.Dom.create("cite", "", this._el.blockquote), this._el.background = KL.Dom.create("div", "kl-quotecomposition-background", this._el.composition_container), this._el.image = KL.Dom.create("div", "kl-quotecomposition-image", this._el.composition_container), this._el.button_group = KL.Dom.create("div", "btn-group", this._el.container), this._el.button_anchor_left = KL.Dom.create("div", "btn btn-default", this._el.button_group), this._el.button_anchor_center = KL.Dom.create("div", "btn btn-default", this._el.button_group), this._el.button_anchor_right = KL.Dom.create("div", "btn btn-default", this._el.button_group), this._el.button_make = KL.Dom.create("div", "btn btn-primary btn-right", this._el.button_group), this._el.button_anchor_left.innerHTML = "<span class='glyphicon glyphicon-align-left'></span>", this._el.button_anchor_center.innerHTML = "<span class='glyphicon glyphicon-align-center'></span>", this._el.button_anchor_right.innerHTML = "<span class='glyphicon glyphicon-align-right'></span>", this._el.button_make.innerHTML = "<span class='glyphicon glyphicon-circle-arrow-down'></span> Save", KL.DomEvent.addListener(this._el.button_anchor_left, "click", this._onAnchorLeft, this), KL.DomEvent.addListener(this._el.button_anchor_right, "click", this._onAnchorRight, this), KL.DomEvent.addListener(this._el.button_anchor_center, "click", this._onAnchorCenter, this), KL.DomEvent.addListener(this._el.button_make, "click", this._onMake, this), this.options.anchor ? "left" == this.options.anchor ? this._el.button_anchor_left.className = "btn btn-default active" : this._el.button_anchor_right.className = "btn btn-default active" : this._el.button_anchor_center.className = "btn btn-default active", this._update()
        },
        _initEvents: function() {
            KL.DomEvent.addListener(this._el.container, "click", this._onMouseClick, this)
        }
    }), KL.Slide = KL.Class.extend({
        includes: [KL.Events, KL.DomMixins],
        _el: {},
        initialize: function(t, e, n) {
            this._el = {
                container: {}
            }, this.data = {}, this.options = {}, this._slides = [], this.animator = null, KL.Util.mergeData(this.options, n), KL.Util.mergeData(this.data, t), this._el.container = KL.Dom.create("div", "kl-slide"), this._initLayout(), this._initEvents(), e && e.appendChild(this._el.container)
        },
        _initLayout: function() {
            this._el.container.appendChild(this.data._el.container)
        },
        _initEvents: function() {}
    }), KL.Slider = KL.Class.extend({
        includes: [KL.Events, KL.DomMixins],
        _el: {},
        initialize: function(t, e, n) {
            this._el = {
                container: {},
                slider_item_container: {}
            }, this.data = {
                slides: []
            }, this.options = {
                width: 100,
                height: 100,
                duration: 1e3,
                ease: KL.Ease.easeInOutQuint
            }, this._slides = [], this.slide_spacing, this.animator = null, KL.Util.mergeData(this.options, n), this.data = t, this._el.container = KL.Dom.create("div", "kl-slider"), this._initLayout(), this._initEvents(), e && e.appendChild(this._el.container)
        },
        loadSlides: function() {
            this._createSlides(this.data), this._updateDisplay(), this._onLoaded()
        },
        _onLoaded: function() {
            this.fire("loaded", this.data)
        },
        _updateDisplay: function(t, e, n, i) {
            this.options.width = this._el.container.offsetWidth, this.options.width = this._slides[0]._el.container.offsetWidth, this.options.height = this._el.container.offsetHeight, this.slide_spacing = this.options.width;
            for (var r = 0; r < this._slides.length; r++) this._slides[r].setPosition({
                left: this.slide_spacing * r,
                top: 0
            });
            this.animator = KL.Animate(this._el.slider_container, {
                left: -(1 * this.slide_spacing) + "px",
                duration: this.options.duration,
                easing: this.options.ease
            })
        },
        _createSlides: function(t) {
            for (var e = 0; e < t.length; e++) this._createSlide(t[e])
        },
        _createSlide: function(t, e, n) {
            var i = new KL.Slide(t);
            this._addSlide(i), 0 > n ? this._slides.push(i) : this._slides.splice(n, 0, i)
        },
        _addSlide: function(t) {
            t.addTo(this._el.slider_item_container)
        },
        _initLayout: function() {
            this._el.slider_container_mask = KL.Dom.create("div", "kl-slider-container-mask", this._el.container), this._el.slider_container = KL.Dom.create("div", "kl-slider-container vcoanimate", this._el.slider_container_mask), this._el.slider_item_container = KL.Dom.create("div", "kl-slider-item-container", this._el.slider_container)
        },
        _initEvents: function() {}
    }), KL.PiquoteComposition = function() {
        this.el = {
            composition: KL.Dom.get("kl-quote-comp"),
            quote_text: KL.Dom.get("kl-quote-text"),
            cite: KL.Dom.get("kl-quote-cite"),
            image: KL.Dom.get("kl-quote-image")
        }, this.options = {
            width: window.innerWidth,
            height: window.innerHeight
        }, this.vars = KL.Util.getUrlVars(window.location.href), this.el.quote_text.innerHTML = decodeURIComponent(this.vars.quote), this.el.cite.innerHTML = decodeURIComponent(this.vars.cite), this.el.image.style.backgroundImage = "url(" + this.vars.image + ")", this.el.composition.className = "kl-quotecomposition kl-anchor-" + this.vars.anchor
    }();