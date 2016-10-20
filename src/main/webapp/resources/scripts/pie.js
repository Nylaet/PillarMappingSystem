/*
 PIE: CSS3 rendering for IE
 Version 1.0beta5
 http://css3pie.com
 Dual-licensed for use under the Apache License Version 2.0 or the General Public License (GPL) Version 2.
 
 2013.04.17 change made to PIE.BackgroundRenderer (hideBackground() and destroy()) to fix a bug related to fill images not loading on objects with rounded corners. Copyright (c) 2013 Adobe Systems Incorporated All Rights Reserved.
 */
(function () {
    var a = document, b = window.PIE;
    if (!b) {
        b = window.PIE = {
            CSS_PREFIX: "-pie-", STYLE_PREFIX: "Pie", CLASS_PREFIX: "pie_", tableCellTags: {TD: 1, TH: 1},
            childlessElements: {TABLE: 1, THEAD: 1, TBODY: 1, TFOOT: 1, TR: 1, INPUT: 1, TEXTAREA: 1, SELECT: 1, OPTION: 1, IMG: 1, HR: 1}, focusableElements: {A: 1, INPUT: 1, TEXTAREA: 1, SELECT: 1, BUTTON: 1}, inputButtonTypes: {submit: 1, button: 1, reset: 1}, emptyFn: function () {}};
        try {
            a.execCommand("BackgroundImageCache", !1, !0)
        } catch (d) {
        }
        (function () {
            for (var c = 4, f = a.createElement("div"), d = f.getElementsByTagName("i"); f.innerHTML =
                    "<\!--[if gt IE " + ++c + "]><i></i><![endif]--\>", d[0]; )
                ;
            b.ieVersion = c;
            if (c === 6)
                b.CSS_PREFIX = b.CSS_PREFIX.replace(/^-/, "");
            b.ieDocMode = a.documentMode || b.ieVersion;
            f.innerHTML = '<v:shape adj="1"/>';
            c = f.firstChild;
            c.style.behavior = "url(#default#VML)";
            b.supportsVML = typeof c.adj === "object"
        })();
        (function () {
            var c, f = 0, d = {};
            b.Util = {createVmlElement: function (b) {
                    c || (c = a.createDocumentFragment(), c.namespaces.add("css3vml", "urn:schemas-microsoft-com:vml"));
                    return c.createElement("css3vml:" + b)
                }, getUID: function (c) {
                    return c &&
                            c._pieId || (c._pieId = "_" + ++f)
                }, merge: function (c) {
                    var b, a, f, d, g = arguments;
                    b = 1;
                    for (a = g.length; b < a; b++)
                        for (f in d = g[b], d)
                            d.hasOwnProperty(f) && (c[f] = d[f]);
                    return c
                }, withImageSize: function (c, b, a) {
                    var f = d[c], l, m;
                    f ? Object.prototype.toString.call(f) === "[object Array]" ? f.push([b, a]) : b.call(a, f) : (m = d[c] = [[b, a]], l = new Image, l.onload = function () {
                        f = d[c] = {w: l.width, h: l.height};
                        for (var b = 0, a = m.length; b < a; b++)
                            m[b][0].call(m[b][1], f);
                        l.onload = null
                    }, l.src = c)
                }}
        })();
        b.GradientUtil = {getGradientMetrics: function (c, a, d, i) {
                function h() {
                    n =
                            k >= 90 && k < 270 ? a : 0;
                    p = k < 180 ? d : 0;
                    o = a - n;
                    q = d - p
                }
                function j() {
                    for (; k < 0; )
                        k += 360;
                    k %= 360
                }
                var k = i.angle, i = i.gradientStart, l, m, n, p, o, q, r, s;
                if (i)
                    i = i.coords(c, a, d), l = i.x, m = i.y;
                k ? (k = k.degrees(), j(), h(), i || (l = n, m = p), i = b.GradientUtil.perpendicularIntersect(l, m, k, o, q), c = i[0], i = i[1]) : i ? (c = a - l, i = d - m) : (l = m = c = 0, i = d);
                r = c - l;
                s = i - m;
                k === void 0 && (k = !r ? s < 0 ? 90 : 270 : !s ? r < 0 ? 180 : 0 : -Math.atan2(s, r) / Math.PI * 180, j(), h());
                return{angle: k, startX: l, startY: m, endX: c, endY: i, startCornerX: n, startCornerY: p, endCornerX: o, endCornerY: q, deltaX: r, deltaY: s,
                    lineLength: b.GradientUtil.distance(l, m, c, i)}
            }, perpendicularIntersect: function (c, b, a, d, h) {
                return a === 0 || a === 180 ? [d, b] : a === 90 || a === 270 ? [c, h] : (a = Math.tan(-a * Math.PI / 180), c = a * c - b, b = -1 / a, d = b * d - h, h = b - a, [(d - c) / h, (a * d - b * c) / h])
            }, distance: function (c, b, a, d) {
                c = a - c;
                b = d - b;
                return Math.abs(c === 0 ? b : b === 0 ? c : Math.sqrt(c * c + b * b))
            }};
        b.Observable = function () {
            this.observers = [];
            this.indexes = {}
        };
        b.Observable.prototype = {observe: function (c) {
                var a = b.Util.getUID(c), d = this.indexes, i = this.observers;
                if (!(a in d))
                    d[a] = i.length, i.push(c)
            },
            unobserve: function (c) {
                var c = b.Util.getUID(c), a = this.indexes;
                c && c in a && (delete this.observers[a[c]], delete a[c])
            }, fire: function () {
                for (var c = this.observers, b = c.length; b--; )
                    c[b] && c[b]()
            }};
        b.Heartbeat = new b.Observable;
        b.Heartbeat.run = function () {
            var c = this;
            if (!c.running)
                setInterval(function () {
                    c.fire()
                }, 250), c.running = 1
        };
        (function () {
            function c() {
                b.OnUnload.fire();
                window.detachEvent("onunload", c);
                window.PIE = null
            }
            b.OnUnload = new b.Observable;
            window.attachEvent("onunload", c);
            b.OnUnload.attachManagedEvent =
                    function (c, b, a) {
                        c.attachEvent(b, a);
                        this.observe(function () {
                            c.detachEvent(b, a)
                        })
                    }
        })();
        b.OnResize = new b.Observable;
        b.OnUnload.attachManagedEvent(window, "onresize", function () {
            b.OnResize.fire()
        });
        (function () {
            function c() {
                b.OnScroll.fire()
            }
            b.OnScroll = new b.Observable;
            b.OnUnload.attachManagedEvent(window, "onscroll", c);
            b.OnResize.observe(c)
        })();
        (function () {
            var c;
            b.OnUnload.attachManagedEvent(window, "onbeforeprint", function () {
                c = b.Element.destroyAll()
            });
            b.OnUnload.attachManagedEvent(window, "onafterprint",
                    function () {
                        if (c) {
                            for (var a = 0, d = c.length; a < d; a++)
                                b.attach(c[a]);
                            c = 0
                        }
                    })
        })();
        b.OnMouseup = new b.Observable;
        b.OnUnload.attachManagedEvent(a, "onmouseup", function () {
            b.OnMouseup.fire()
        });
        b.Length = function () {
            function c(c) {
                this.val = c
            }
            var d = a.createElement("length-calc"), g = a.documentElement, i = d.style, h = {}, j = ["mm", "cm", "in", "pt", "pc"], k = j.length, l = {};
            i.position = "absolute";
            i.top = i.left = "-9999px";
            for (g.appendChild(d); k--; )
                d.style.width = "100" + j[k], h[j[k]] = d.offsetWidth / 100;
            g.removeChild(d);
            d.style.width = "1em";
            c.prototype =
                    {unitRE: /(px|em|ex|mm|cm|in|pt|pc|%)$/, getNumber: function () {
                            var c = this.num;
                            if (c === void 0)
                                c = this.num = parseFloat(this.val);
                            return c
                        }, getUnit: function () {
                            var f;
                            var c = this.unit;
                            if (!c)
                                f = this.unit = (c = this.val.match(this.unitRE)) && c[0] || "px", c = f;
                            return c
                        }, isPercentage: function () {
                            return this.getUnit() === "%"
                        }, pixels: function (c, b) {
                            var a = this.getNumber(), d = this.getUnit();
                            switch (d) {
                                case "px":
                                    return a;
                                case "%":
                                    return a * (typeof b === "function" ? b() : b) / 100;
                                case "em":
                                    return a * this.getEmPixels(c);
                                case "ex":
                                    return a *
                                            this.getEmPixels(c) / 2;
                                default:
                                    return a * h[d]
                                }
                        }, getEmPixels: function (c) {
                            var a = c.currentStyle.fontSize, g, i;
                            return a.indexOf("px") > 0 ? parseFloat(a) : c.tagName in b.childlessElements ? (i = this, g = c.parentNode, b.getLength(a).pixels(g, function () {
                                return i.getEmPixels(g)
                            })) : (c.appendChild(d), a = d.offsetWidth, d.parentNode === c && c.removeChild(d), a)
                        }};
            b.getLength = function (b) {
                return l[b] || (l[b] = new c(b))
            };
            return c
        }();
        b.BgPosition = function () {
            function c(c) {
                this.tokens = c
            }
            var a = b.getLength("50%"), d = {top: 1, center: 1, bottom: 1},
            i = {left: 1, center: 1, right: 1};
            c.prototype = {getValues: function () {
                    if (!this._values) {
                        var c = this.tokens, j = c.length, k = b.Tokenizer, l = k.Type, m = b.getLength("0"), l = l.IDENT, m = ["left", m, "top", m];
                        j === 1 && (c.push(new k.Token(l, "center")), j++);
                        if (j === 2)
                            l & (c[0].tokenType | c[1].tokenType) && c[0].tokenValue in d && c[1].tokenValue in i && c.push(c.shift()), c[0].tokenType & l ? c[0].tokenValue === "center" ? m[1] = a : m[0] = c[0].tokenValue : c[0].isLengthOrPercent() && (m[1] = b.getLength(c[0].tokenValue)), c[1].tokenType & l ? c[1].tokenValue ===
                                    "center" ? m[3] = a : m[2] = c[1].tokenValue : c[1].isLengthOrPercent() && (m[3] = b.getLength(c[1].tokenValue));
                        this._values = m
                    }
                    return this._values
                }, coords: function (c, b, a) {
                    var d = this.getValues(), f = d[1].pixels(c, b), c = d[3].pixels(c, a);
                    return{x: d[0] === "right" ? b - f : f, y: d[2] === "bottom" ? a - c : c}
                }};
            return c
        }();
        b.BgSize = function () {
            function c(c, b) {
                this.w = c;
                this.h = b
            }
            c.prototype = {pixels: function (c, b, a, d, j) {
                    var k = this.w, l = this.h, m = b / a;
                    d /= j;
                    k === "contain" ? (k = d > m ? b : a * d, l = d > m ? b / d : a) : k === "cover" ? (k = d < m ? b : a * d, l = d < m ? b / d : a) : k === "auto" ?
                            (l = l === "auto" ? j : l.pixels(c, a), k = l * d) : (k = k.pixels(c, b), l = l === "auto" ? k / d : l.pixels(c, a));
                    return{w: k, h: l}
                }};
            c.DEFAULT = new c("auto", "auto");
            return c
        }();
        b.Angle = function () {
            function c(c) {
                this.val = c
            }
            c.prototype = {unitRE: /[a-z]+$/i, getUnit: function () {
                    return this._unit || (this._unit = this.val.match(this.unitRE)[0].toLowerCase())
                }, degrees: function () {
                    var c = this._deg, b;
                    if (c === void 0)
                        c = this.getUnit(), b = parseFloat(this.val, 10), c = this._deg = c === "deg" ? b : c === "rad" ? b / Math.PI * 180 : c === "grad" ? b / 400 * 360 : c === "turn" ? b * 360 : 0;
                    return c
                }};
            return c
        }();
        b.Color = function () {
            function c(c) {
                this.val = c
            }
            var a = {};
            c.rgbaRE = /\s*rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d+|\d*\.\d+)\s*\)\s*/;
            c.names = {aliceblue: "F0F8FF", antiquewhite: "FAEBD7", aqua: "0FF", aquamarine: "7FFFD4", azure: "F0FFFF", beige: "F5F5DC", bisque: "FFE4C4", black: "000", blanchedalmond: "FFEBCD", blue: "00F", blueviolet: "8A2BE2", brown: "A52A2A", burlywood: "DEB887", cadetblue: "5F9EA0", chartreuse: "7FFF00", chocolate: "D2691E", coral: "FF7F50", cornflowerblue: "6495ED", cornsilk: "FFF8DC",
                crimson: "DC143C", cyan: "0FF", darkblue: "00008B", darkcyan: "008B8B", darkgoldenrod: "B8860B", darkgray: "A9A9A9", darkgreen: "006400", darkkhaki: "BDB76B", darkmagenta: "8B008B", darkolivegreen: "556B2F", darkorange: "FF8C00", darkorchid: "9932CC", darkred: "8B0000", darksalmon: "E9967A", darkseagreen: "8FBC8F", darkslateblue: "483D8B", darkslategray: "2F4F4F", darkturquoise: "00CED1", darkviolet: "9400D3", deeppink: "FF1493", deepskyblue: "00BFFF", dimgray: "696969", dodgerblue: "1E90FF", firebrick: "B22222", floralwhite: "FFFAF0", forestgreen: "228B22",
                fuchsia: "F0F", gainsboro: "DCDCDC", ghostwhite: "F8F8FF", gold: "FFD700", goldenrod: "DAA520", gray: "808080", green: "008000", greenyellow: "ADFF2F", honeydew: "F0FFF0", hotpink: "FF69B4", indianred: "CD5C5C", indigo: "4B0082", ivory: "FFFFF0", khaki: "F0E68C", lavender: "E6E6FA", lavenderblush: "FFF0F5", lawngreen: "7CFC00", lemonchiffon: "FFFACD", lightblue: "ADD8E6", lightcoral: "F08080", lightcyan: "E0FFFF", lightgoldenrodyellow: "FAFAD2", lightgreen: "90EE90", lightgrey: "D3D3D3", lightpink: "FFB6C1", lightsalmon: "FFA07A", lightseagreen: "20B2AA",
                lightskyblue: "87CEFA", lightslategray: "789", lightsteelblue: "B0C4DE", lightyellow: "FFFFE0", lime: "0F0", limegreen: "32CD32", linen: "FAF0E6", magenta: "F0F", maroon: "800000", mediumauqamarine: "66CDAA", mediumblue: "0000CD", mediumorchid: "BA55D3", mediumpurple: "9370D8", mediumseagreen: "3CB371", mediumslateblue: "7B68EE", mediumspringgreen: "00FA9A", mediumturquoise: "48D1CC", mediumvioletred: "C71585", midnightblue: "191970", mintcream: "F5FFFA", mistyrose: "FFE4E1", moccasin: "FFE4B5", navajowhite: "FFDEAD", navy: "000080", oldlace: "FDF5E6",
                olive: "808000", olivedrab: "688E23", orange: "FFA500", orangered: "FF4500", orchid: "DA70D6", palegoldenrod: "EEE8AA", palegreen: "98FB98", paleturquoise: "AFEEEE", palevioletred: "D87093", papayawhip: "FFEFD5", peachpuff: "FFDAB9", peru: "CD853F", pink: "FFC0CB", plum: "DDA0DD", powderblue: "B0E0E6", purple: "800080", red: "F00", rosybrown: "BC8F8F", royalblue: "4169E1", saddlebrown: "8B4513", salmon: "FA8072", sandybrown: "F4A460", seagreen: "2E8B57", seashell: "FFF5EE", sienna: "A0522D", silver: "C0C0C0", skyblue: "87CEEB", slateblue: "6A5ACD", slategray: "708090",
                snow: "FFFAFA", springgreen: "00FF7F", steelblue: "4682B4", tan: "D2B48C", teal: "008080", thistle: "D8BFD8", tomato: "FF6347", turquoise: "40E0D0", violet: "EE82EE", wheat: "F5DEB3", white: "FFF", whitesmoke: "F5F5F5", yellow: "FF0", yellowgreen: "9ACD32"};
            c.prototype = {parse: function () {
                    if (!this._color) {
                        var b = this.val, a;
                        if (a = b.match(c.rgbaRE))
                            this._color = "rgb(" + a[1] + "," + a[2] + "," + a[3] + ")", this._alpha = parseFloat(a[4]);
                        else {
                            if ((a = b.toLowerCase())in c.names)
                                b = "#" + c.names[a];
                            this._color = b;
                            this._alpha = b === "transparent" ? 0 : 1
                        }
                    }
                }, colorValue: function (c) {
                    this.parse();
                    return this._color === "currentColor" ? c.currentStyle.color : this._color
                }, alpha: function () {
                    this.parse();
                    return this._alpha
                }};
            b.getColor = function (b) {
                return a[b] || (a[b] = new c(b))
            };
            return c
        }();
        b.Tokenizer = function () {
            function c(c) {
                this.css = c;
                this.ch = 0;
                this.tokens = [];
                this.tokenIndex = 0
            }
            var a = c.Type = {ANGLE: 1, CHARACTER: 2, COLOR: 4, DIMEN: 8, FUNCTION: 16, IDENT: 32, LENGTH: 64, NUMBER: 128, OPERATOR: 256, PERCENT: 512, STRING: 1024, URL: 2048};
            c.Token = function (c, b) {
                this.tokenType = c;
                this.tokenValue = b
            };
            c.Token.prototype = {isLength: function () {
                    return this.tokenType &
                            a.LENGTH || this.tokenType & a.NUMBER && this.tokenValue === "0"
                }, isLengthOrPercent: function () {
                    return this.isLength() || this.tokenType & a.PERCENT
                }};
            c.prototype = {whitespace: /\s/, number: /^[\+\-]?(\d*\.)?\d+/, url: /^url\(\s*("([^"]*)"|'([^']*)'|([!#$%&*-~]*))\s*\)/i, ident: /^\-?[_a-z][\w-]*/i, string: /^("([^"]*)"|'([^']*)')/, operator: /^[\/,]/, hash: /^#[\w]+/, hashColor: /^#([\da-f]{6}|[\da-f]{3})/i, unitTypes: {px: a.LENGTH, em: a.LENGTH, ex: a.LENGTH, mm: a.LENGTH, cm: a.LENGTH, "in": a.LENGTH, pt: a.LENGTH, pc: a.LENGTH, deg: a.ANGLE,
                    rad: a.ANGLE, grad: a.ANGLE}, colorFunctions: {rgb: 1, rgba: 1, hsl: 1, hsla: 1}, next: function (d) {
                    function i(b, a) {
                        var f = new c.Token(b, a);
                        d || (n.tokens.push(f), n.tokenIndex++);
                        return f
                    }
                    function h() {
                        n.tokenIndex++;
                        return null
                    }
                    var j, k, l, m, n = this;
                    if (this.tokenIndex < this.tokens.length)
                        return this.tokens[this.tokenIndex++];
                    for (; this.whitespace.test(this.css.charAt(this.ch)); )
                        this.ch++;
                    if (this.ch >= this.css.length)
                        return h();
                    k = this.ch;
                    j = this.css.substring(this.ch);
                    l = j.charAt(0);
                    switch (l) {
                        case "#":
                            if (m = j.match(this.hashColor))
                                return this.ch +=
                                m[0].length, i(a.COLOR, m[0]);
                            break;
                        case '"':
                        case "'":
                            if (m = j.match(this.string))
                                return this.ch += m[0].length, i(a.STRING, m[2] || m[3] || "");
                            break;
                        case "/":
                        case ",":
                            return this.ch++, i(a.OPERATOR, l);
                        case "u":
                            if (m = j.match(this.url))
                                return this.ch += m[0].length, i(a.URL, m[2] || m[3] || m[4] || "")
                    }
                    if (m = j.match(this.number)) {
                        l = m[0];
                        this.ch += l.length;
                        if (j.charAt(l.length) === "%")
                            return this.ch++, i(a.PERCENT, l + "%");
                        if (m = j.substring(l.length).match(this.ident))
                            return l += m[0], this.ch += m[0].length, i(this.unitTypes[m[0].toLowerCase()] ||
                                    a.DIMEN, l);
                        return i(a.NUMBER, l)
                    }
                    if (m = j.match(this.ident)) {
                        l = m[0];
                        this.ch += l.length;
                        if (l.toLowerCase()in b.Color.names || l === "currentColor" || l === "transparent")
                            return i(a.COLOR, l);
                        if (j.charAt(l.length) === "(") {
                            this.ch++;
                            if (l.toLowerCase()in this.colorFunctions) {
                                j = function (c) {
                                    return c && c.tokenType & a.NUMBER
                                };
                                m = function (c) {
                                    return c && c.tokenType & (a.NUMBER | a.PERCENT)
                                };
                                var p = function (c, b) {
                                    return c && c.tokenValue === b
                                }, o = function () {
                                    return n.next(1)
                                };
                                if ((l.charAt(0) === "r" ? m(o()) : j(o())) && p(o(), ",") && m(o()) && p(o(),
                                        ",") && m(o()) && (l === "rgb" || l === "hsa" || p(o(), ",") && j(o())) && p(o(), ")"))
                                    return i(a.COLOR, this.css.substring(k, this.ch));
                                return h()
                            }
                            return i(a.FUNCTION, l)
                        }
                        return i(a.IDENT, l)
                    }
                    this.ch++;
                    return i(a.CHARACTER, l)
                }, hasNext: function () {
                    var c = this.next();
                    this.prev();
                    return!!c
                }, prev: function () {
                    return this.tokens[this.tokenIndex-- - 2]
                }, all: function () {
                    for (; this.next(); )
                        ;
                    return this.tokens
                }, until: function (c, b) {
                    for (var a = [], d, f; d = this.next(); ) {
                        if (c(d)) {
                            f = !0;
                            this.prev();
                            break
                        }
                        a.push(d)
                    }
                    return b && !f ? null : a
                }};
            return c
        }();
        b.BoundsInfo = function (c) {
            this.targetElement = c
        };
        b.BoundsInfo.prototype = {_locked: 0, positionChanged: function () {
                var c = this._lastBounds, b;
                return!c || (b = this.getBounds()) && (c.x !== b.x || c.y !== b.y)
            }, sizeChanged: function () {
                var c = this._lastBounds, b;
                return!c || (b = this.getBounds()) && (c.w !== b.w || c.h !== b.h)
            }, getLiveBounds: function () {
                var c = this.targetElement, a = c.getBoundingClientRect(), d = b.ieDocMode === 9;
                return{x: a.left, y: a.top, w: d ? c.offsetWidth : a.right - a.left, h: d ? c.offsetHeight : a.bottom - a.top}
            }, getBounds: function () {
                return this._locked ?
                        this._lockedBounds || (this._lockedBounds = this.getLiveBounds()) : this.getLiveBounds()
            }, hasBeenQueried: function () {
                return!!this._lastBounds
            }, lock: function () {
                ++this._locked
            }, unlock: function () {
                if (!--this._locked) {
                    if (this._lockedBounds)
                        this._lastBounds = this._lockedBounds;
                    this._lockedBounds = null
                }
            }};
        (function () {
            function c(c) {
                var a = b.Util.getUID(c);
                return function () {
                    if (this._locked) {
                        var b = this._lockedValues || (this._lockedValues = {});
                        return a in b ? b[a] : b[a] = c.call(this)
                    } else
                        return c.call(this)
                }
            }
            b.StyleInfoBase =
                    {_locked: 0, newStyleInfo: function (c) {
                            function a(c) {
                                this.targetElement = c;
                                this._lastCss = this.getCss()
                            }
                            b.Util.merge(a.prototype, b.StyleInfoBase, c);
                            a._propsCache = {};
                            return a
                        }, getProps: function () {
                            var c = this.getCss(), b = this.constructor._propsCache;
                            return c ? c in b ? b[c] : b[c] = this.parseCss(c) : null
                        }, getCss: c(function () {
                            var c = this.targetElement, a = this.constructor, d = c.style, c = c.currentStyle, h = this.cssProperty, j = this.styleProperty, k = a._prefixedCssProp || (a._prefixedCssProp = b.CSS_PREFIX + h), a = a._prefixedStyleProp ||
                                    (a._prefixedStyleProp = b.STYLE_PREFIX + j.charAt(0).toUpperCase() + j.substring(1));
                            return d[a] || c.getAttribute(k) || d[j] || c.getAttribute(h)
                        }), isActive: c(function () {
                            return!!this.getProps()
                        }), changed: c(function () {
                            var c = this.getCss(), b = c !== this._lastCss;
                            this._lastCss = c;
                            return b
                        }), cacheWhenLocked: c, lock: function () {
                            ++this._locked
                        }, unlock: function () {
                            --this._locked || delete this._lockedValues
                        }}
        })();
        b.BackgroundStyleInfo = b.StyleInfoBase.newStyleInfo({cssProperty: b.CSS_PREFIX + "background", styleProperty: b.STYLE_PREFIX +
                    "Background", attachIdents: {scroll: 1, fixed: 1, local: 1}, repeatIdents: {"repeat-x": 1, "repeat-y": 1, repeat: 1, "no-repeat": 1}, originAndClipIdents: {"padding-box": 1, "border-box": 1, "content-box": 1}, positionIdents: {top: 1, right: 1, bottom: 1, left: 1, center: 1}, sizeIdents: {contain: 1, cover: 1}, propertyNames: {CLIP: "backgroundClip", COLOR: "backgroundColor", IMAGE: "backgroundImage", ORIGIN: "backgroundOrigin", POSITION: "backgroundPosition", REPEAT: "backgroundRepeat", SIZE: "backgroundSize"}, parseCss: function (c) {
                function a(c) {
                    return c &&
                            c.isLengthOrPercent() || c.tokenType & n && c.tokenValue in s
                }
                function d(c) {
                    return c && (c.isLengthOrPercent() && b.getLength(c.tokenValue) || c.tokenValue === "auto" && "auto")
                }
                var i = this.targetElement.currentStyle, h, j, k, l = b.Tokenizer.Type, m = l.OPERATOR, n = l.IDENT, p = l.COLOR, o, q, r = 0, s = this.positionIdents, w, u, v = {bgImages: []};
                if (this.getCss3()) {
                    h = new b.Tokenizer(c);
                    for (k = {}; j = h.next(); )
                        if (o = j.tokenType, q = j.tokenValue, !k.imgType && o & l.FUNCTION && q === "linear-gradient") {
                            w = {stops: [], imgType: q};
                            for (u = {}; j = h.next(); ) {
                                o = j.tokenType;
                                q = j.tokenValue;
                                if (o & l.CHARACTER && q === ")") {
                                    u.color && w.stops.push(u);
                                    w.stops.length > 1 && b.Util.merge(k, w);
                                    break
                                }
                                if (o & p) {
                                    if (w.angle || w.gradientStart) {
                                        j = h.prev();
                                        if (j.tokenType !== m)
                                            break;
                                        h.next()
                                    }
                                    u = {color: b.getColor(q)};
                                    j = h.next();
                                    j.isLengthOrPercent() ? u.offset = b.getLength(j.tokenValue) : h.prev()
                                } else if (o & l.ANGLE && !w.angle && !u.color && !w.stops.length)
                                    w.angle = new b.Angle(j.tokenValue);
                                else if (a(j) && !w.gradientStart && !u.color && !w.stops.length)
                                    h.prev(), w.gradientStart = new b.BgPosition(h.until(function (c) {
                                        return!a(c)
                                    },
                                            !1));
                                else if (o & m && q === ",")
                                    u.color && (w.stops.push(u), u = {});
                                else
                                    break
                            }
                        } else if (!k.imgType && o & l.URL)
                            k.imgUrl = q, k.imgType = "image";
                        else if (a(j) && !k.bgPosition)
                            h.prev(), k.bgPosition = new b.BgPosition(h.until(function (c) {
                                return!a(c)
                            }, !1));
                        else if (o & n)
                            if (q in this.repeatIdents && !k.imgRepeat)
                                k.imgRepeat = q;
                            else if (q in this.originAndClipIdents && !k.bgOrigin)
                                k.bgOrigin = q, (j = h.next()) && j.tokenType & n && j.tokenValue in this.originAndClipIdents ? k.bgClip = j.tokenValue : (k.bgClip = q, h.prev());
                            else if (q in this.attachIdents &&
                                    !k.bgAttachment)
                                k.bgAttachment = q;
                            else
                                return null;
                        else if (o & p && !v.color)
                            v.color = b.getColor(q);
                        else if (o & m && q === "/" && !k.bgSize && k.bgPosition)
                            if (j = h.next(), j.tokenType & n && j.tokenValue in this.sizeIdents)
                                k.bgSize = new b.BgSize(j.tokenValue);
                            else if (j = d(j))
                                o = d(h.next()), o || (o = j, h.prev()), k.bgSize = new b.BgSize(j, o);
                            else
                                return null;
                        else if (o & m && q === "," && k.imgType)
                            k.origString = c.substring(r, h.ch - 1), r = h.ch, v.bgImages.push(k), k = {};
                        else
                            return null;
                    if (k.imgType)
                        k.origString = c.substring(r), v.bgImages.push(k)
                } else
                    this.withActualBg(b.ieDocMode <
                            9 ? function () {
                                var c = this.propertyNames, a = i[c.POSITION + "X"], d = i[c.POSITION + "Y"], f = i[c.IMAGE], g = i[c.COLOR];
                                if (g !== "transparent")
                                    v.color = b.getColor(g);
                                if (f !== "none")
                                    v.bgImages = [{imgType: "image", imgUrl: (new b.Tokenizer(f)).next().tokenValue, imgRepeat: i[c.REPEAT], bgPosition: new b.BgPosition((new b.Tokenizer(a + " " + d)).all())}]
                            } : function () {
                        var c = this.propertyNames, a = /\s*,\s*/, d = i[c.IMAGE].split(a), f = i[c.COLOR], g, h, j, k, l, m;
                        if (f !== "transparent")
                            v.color = b.getColor(f);
                        if ((k = d.length) && d[0] !== "none") {
                            f = i[c.REPEAT].split(a);
                            g = i[c.POSITION].split(a);
                            h = i[c.ORIGIN].split(a);
                            j = i[c.CLIP].split(a);
                            c = i[c.SIZE].split(a);
                            v.bgImages = [];
                            for (a = 0; a < k; a++)
                                if ((l = d[a]) && l !== "none")
                                    m = c[a].split(" "), v.bgImages.push({origString: l + " " + f[a] + " " + g[a] + " / " + c[a] + " " + h[a] + " " + j[a], imgType: "image", imgUrl: (new b.Tokenizer(l)).next().tokenValue, imgRepeat: f[a], bgPosition: new b.BgPosition((new b.Tokenizer(g[a])).all()), bgOrigin: h[a], bgClip: j[a], bgSize: new b.BgSize(m[0], m[1])})
                        }
                    });
                return v.color || v.bgImages[0] ? v : null
            }, withActualBg: function (c) {
                var a =
                        b.ieDocMode > 8, d = this.propertyNames, i = this.targetElement.runtimeStyle, h = i[d.IMAGE], j = i[d.COLOR], k = i[d.REPEAT], l, m, n, p;
                h && (i[d.IMAGE] = "");
                j && (i[d.COLOR] = "");
                k && (i[d.REPEAT] = "");
                a && (l = i[d.CLIP], m = i[d.ORIGIN], p = i[d.POSITION], n = i[d.SIZE], l && (i[d.CLIP] = ""), m && (i[d.ORIGIN] = ""), p && (i[d.POSITION] = ""), n && (i[d.SIZE] = ""));
                c = c.call(this);
                h && (i[d.IMAGE] = h);
                j && (i[d.COLOR] = j);
                k && (i[d.REPEAT] = k);
                a && (l && (i[d.CLIP] = l), m && (i[d.ORIGIN] = m), p && (i[d.POSITION] = p), n && (i[d.SIZE] = n));
                return c
            }, getCss: b.StyleInfoBase.cacheWhenLocked(function () {
                return this.getCss3() ||
                        this.withActualBg(function () {
                            var c = this.targetElement.currentStyle, b = this.propertyNames;
                            return c[b.COLOR] + " " + c[b.IMAGE] + " " + c[b.REPEAT] + " " + c[b.POSITION + "X"] + " " + c[b.POSITION + "Y"]
                        })
            }), getCss3: b.StyleInfoBase.cacheWhenLocked(function () {
                var c = this.targetElement;
                return c.style[this.styleProperty] || c.currentStyle.getAttribute(this.cssProperty)
            }), isPngFix: function () {
                var c = 0;
                if (b.ieVersion < 7)
                    c = this.targetElement, c = "" + (c.style[b.STYLE_PREFIX + "PngFix"] || c.currentStyle.getAttribute(b.CSS_PREFIX + "png-fix")) ===
                            "true";
                return c
            }, isActive: b.StyleInfoBase.cacheWhenLocked(function () {
                return(this.getCss3() || this.isPngFix()) && !!this.getProps()
            })});
        b.BorderStyleInfo = b.StyleInfoBase.newStyleInfo({sides: ["Top", "Right", "Bottom", "Left"], namedWidths: {thin: "1px", medium: "3px", thick: "5px"}, parseCss: function () {
                var c = {}, a = {}, d = {}, i = !1, h = !0, j = !0, k = !0;
                this.withActualBorder(function () {
                    var f;
                    for (var l = this.targetElement.currentStyle, m = 0, n, p, o, q, r, s, w; m < 4; m++)
                        o = this.sides[m], w = o.charAt(0).toLowerCase(), n = a[w] = l["border" + o + "Style"],
                                p = l["border" + o + "Color"], o = l["border" + o + "Width"], m > 0 && (n !== q && (j = !1), p !== r && (h = !1), o !== s && (k = !1)), q = n, r = p, s = o, d[w] = b.getColor(p), f = c[w] = b.getLength(a[w] === "none" ? "0" : this.namedWidths[o] || o), o = f, o.pixels(this.targetElement) > 0 && (i = !0)
                });
                return i ? {widths: c, styles: a, colors: d, widthsSame: k, colorsSame: h, stylesSame: j} : null
            }, getCss: b.StyleInfoBase.cacheWhenLocked(function () {
                var c = this.targetElement, a = c.currentStyle, d;
                c.tagName in b.tableCellTags && c.offsetParent.currentStyle.borderCollapse === "collapse" || this.withActualBorder(function () {
                    d =
                            a.borderWidth + "|" + a.borderStyle + "|" + a.borderColor
                });
                return d
            }), withActualBorder: function (c) {
                var b = this.targetElement.runtimeStyle, a = b.borderWidth, d = b.borderColor;
                if (a)
                    b.borderWidth = "";
                if (d)
                    b.borderColor = "";
                c = c.call(this);
                if (a)
                    b.borderWidth = a;
                if (d)
                    b.borderColor = d;
                return c
            }});
        (function () {
            b.BorderRadiusStyleInfo = b.StyleInfoBase.newStyleInfo({cssProperty: "border-radius", styleProperty: "borderRadius", parseCss: function (c) {
                    var a = null, d, h, j, k, l = !1;
                    if (c) {
                        h = new b.Tokenizer(c);
                        var m = function () {
                            for (var c = [], a; (j =
                                    h.next()) && j.isLengthOrPercent(); ) {
                                k = b.getLength(j.tokenValue);
                                a = k.getNumber();
                                if (a < 0)
                                    return null;
                                a > 0 && (l = !0);
                                c.push(k)
                            }
                            return c.length > 0 && c.length < 5 ? {tl: c[0], tr: c[1] || c[0], br: c[2] || c[0], bl: c[3] || c[1] || c[0]} : null
                        };
                        if (c = m())
                            j ? j.tokenType & b.Tokenizer.Type.OPERATOR && j.tokenValue === "/" && (d = m()) : d = c, l && c && d && (a = {x: c, y: d})
                    }
                    return a
                }});
            var c = b.getLength("0"), c = {tl: c, tr: c, br: c, bl: c};
            b.BorderRadiusStyleInfo.ALL_ZERO = {x: c, y: c}
        })();
        b.BorderImageStyleInfo = b.StyleInfoBase.newStyleInfo({cssProperty: "border-image",
            styleProperty: "borderImage", repeatIdents: {stretch: 1, round: 1, repeat: 1, space: 1}, parseCss: function (c) {
                var a = null, d, i, h, j, k, l, m = 0, n = b.Tokenizer.Type, p = n.IDENT, o = n.NUMBER, q = n.PERCENT;
                if (c) {
                    d = new b.Tokenizer(c);
                    for (var a = {}, r = function (c) {
                        return c && c.tokenType & n.OPERATOR && c.tokenValue === "/"
                    }, s = function (c) {
                        return c && c.tokenType & p && c.tokenValue === "fill"
                    }, w = function () {
                        j = d.until(function (c) {
                            return!(c.tokenType & (o | q))
                        });
                        s(d.next()) && !a.fill ? a.fill = !0 : d.prev();
                        r(d.next()) ? (m++, k = d.until(function (c) {
                            return!c.isLengthOrPercent() &&
                                    !(c.tokenType & p && c.tokenValue === "auto")
                        }), r(d.next()) && (m++, l = d.until(function (c) {
                            return!c.isLength()
                        }))) : d.prev()
                    }; c = d.next(); )
                        if (i = c.tokenType, h = c.tokenValue, i & (o | q) && !j)
                            d.prev(), w();
                        else if (s(c) && !a.fill)
                            a.fill = !0, w();
                        else if (i & p && this.repeatIdents[h] && !a.repeat) {
                            if (a.repeat = {h: h}, c = d.next())
                                c.tokenType & p && this.repeatIdents[c.tokenValue] ? a.repeat.v = c.tokenValue : d.prev()
                        } else if (i & n.URL && !a.src)
                            a.src = h;
                        else
                            return null;
                    if (!a.src || !j || j.length < 1 || j.length > 4 || k && k.length > 4 || m === 1 && k.length < 1 || l &&
                            l.length > 4 || m === 2 && l.length < 1)
                        return null;
                    if (!a.repeat)
                        a.repeat = {h: "stretch"};
                    if (!a.repeat.v)
                        a.repeat.v = a.repeat.h;
                    c = function (c, a) {
                        return{t: a(c[0]), r: a(c[1] || c[0]), b: a(c[2] || c[0]), l: a(c[3] || c[1] || c[0])}
                    };
                    a.slice = c(j, function (c) {
                        return b.getLength(c.tokenType & o ? c.tokenValue + "px" : c.tokenValue)
                    });
                    if (k && k[0])
                        a.widths = c(k, function (c) {
                            return c.isLengthOrPercent() ? b.getLength(c.tokenValue) : c.tokenValue
                        });
                    if (l && l[0])
                        a.outset = c(l, function (c) {
                            return c.isLength() ? b.getLength(c.tokenValue) : c.tokenValue
                        })
                }
                return a
            }});
        b.BoxShadowStyleInfo = b.StyleInfoBase.newStyleInfo({cssProperty: "box-shadow", styleProperty: "boxShadow", parseCss: function (c) {
                var a, d = b.getLength, i = b.Tokenizer.Type, h;
                if (c) {
                    h = new b.Tokenizer(c);
                    a = {outset: [], inset: []};
                    for (c = function () {
                        for (var c, k, l, m, n, p; c = h.next(); )
                            if (l = c.tokenValue, k = c.tokenType, k & i.OPERATOR && l === ",")
                                break;
                            else if (c.isLength() && !n)
                                h.prev(), n = h.until(function (c) {
                                    return!c.isLength()
                                });
                            else if (k & i.COLOR && !m)
                                m = l;
                            else if (k & i.IDENT && l === "inset" && !p)
                                p = !0;
                            else
                                return!1;
                        c = n && n.length;
                        if (c > 1 &&
                                c < 5)
                            return(p ? a.inset : a.outset).push({xOffset: d(n[0].tokenValue), yOffset: d(n[1].tokenValue), blur: d(n[2] ? n[2].tokenValue : "0"), spread: d(n[3] ? n[3].tokenValue : "0"), color: b.getColor(m || "currentColor")}), !0;
                        return!1
                    }; c(); )
                        ;
                }
                return a && (a.inset.length || a.outset.length) ? a : null
            }});
        b.VisibilityStyleInfo = b.StyleInfoBase.newStyleInfo({getCss: b.StyleInfoBase.cacheWhenLocked(function () {
                var c = this.targetElement.currentStyle;
                return c.visibility + "|" + c.display
            }), parseCss: function () {
                var c = this.targetElement, a = c.runtimeStyle,
                        c = c.currentStyle, b = a.visibility, d;
                a.visibility = "";
                d = c.visibility;
                a.visibility = b;
                return{visible: d !== "hidden", displayed: c.display !== "none"}
            }, isActive: function () {
                return!1
            }});
        b.RendererBase = {newRenderer: function (c) {
                function a(c, b, d, f) {
                    this.targetElement = c;
                    this.boundsInfo = b;
                    this.styleInfos = d;
                    this.parent = f
                }
                b.Util.merge(a.prototype, b.RendererBase, c);
                return a
            }, isPositioned: !1, needsUpdate: function () {
                return!1
            }, prepareUpdate: b.emptyFn, updateProps: function () {
                this.destroy();
                this.isActive() && this.draw()
            }, updatePos: function () {
                this.isPositioned =
                        !0
            }, updateSize: function () {
                this.isActive() ? this.draw() : this.destroy()
            }, addLayer: function (c, a) {
                this.removeLayer(c);
                for (var b = this._layers || (this._layers = []), d = c + 1, h = b.length, j; d < h; d++)
                    if (j = b[d])
                        break;
                b[c] = a;
                this.getBox().insertBefore(a, j || null)
            }, getLayer: function (c) {
                var a = this._layers;
                return a && a[c] || null
            }, removeLayer: function (c) {
                var a = this.getLayer(c), b = this._box;
                a && b && (b.removeChild(a), this._layers[c] = null)
            }, getShape: function (c, d, g, i) {
                var h = this._shapes || (this._shapes = {}), j = h[c];
                if (!j)
                    j = h[c] = b.Util.createVmlElement("shape"),
                            d && j.appendChild(j[d] = b.Util.createVmlElement(d)), i && (g = this.getLayer(i), g || (this.addLayer(i, a.createElement("group" + i)), g = this.getLayer(i))), g.appendChild(j), c = j.style, c.position = "absolute", c.left = c.top = 0, c.behavior = "url(#default#VML)";
                return j
            }, deleteShape: function (c) {
                var a = this._shapes, b = a && a[c];
                b && (b.parentNode.removeChild(b), delete a[c]);
                return!!b
            }, getRadiiPixels: function (c) {
                var a = this.targetElement, b = this.boundsInfo.getBounds(), d = b.w, h = b.h, j, k, l, m, n, p, b = c.x.tl.pixels(a, d);
                j = c.y.tl.pixels(a,
                        h);
                k = c.x.tr.pixels(a, d);
                l = c.y.tr.pixels(a, h);
                m = c.x.br.pixels(a, d);
                n = c.y.br.pixels(a, h);
                p = c.x.bl.pixels(a, d);
                c = c.y.bl.pixels(a, h);
                d = Math.min(d / (b + k), h / (l + n), d / (p + m), h / (j + c));
                d < 1 && (b *= d, j *= d, k *= d, l *= d, m *= d, n *= d, p *= d, c *= d);
                return{x: {tl: b, tr: k, br: m, bl: p}, y: {tl: j, tr: l, br: n, bl: c}}
            }, getBoxPath: function (c, a, b) {
                var a = a || 1, d, h, j = this.boundsInfo.getBounds();
                h = j.w * a;
                var j = j.h * a, k = this.styleInfos.borderRadiusInfo, l = Math.floor, m = Math.ceil, n = c ? c.t * a : 0, p = c ? c.r * a : 0, o = c ? c.b * a : 0, c = c ? c.l * a : 0, q, r, s, w, u;
                b || k.isActive() ?
                        (d = this.getRadiiPixels(b || k.getProps()), b = d.x.tl * a, k = d.y.tl * a, q = d.x.tr * a, r = d.y.tr * a, s = d.x.br * a, w = d.y.br * a, u = d.x.bl * a, a *= d.y.bl, h = "m" + l(c) + "," + l(k) + "qy" + l(b) + "," + l(n) + "l" + m(h - q) + "," + l(n) + "qx" + m(h - p) + "," + l(r) + "l" + m(h - p) + "," + m(j - w) + "qy" + m(h - s) + "," + m(j - o) + "l" + l(u) + "," + m(j - o) + "qx" + l(c) + "," + m(j - a) + " x e") : h = "m" + l(c) + "," + l(n) + "l" + m(h - p) + "," + l(n) + "l" + m(h - p) + "," + m(j - o) + "l" + l(c) + "," + m(j - o) + "xe";
                return h
            }, getBox: function () {
                var c = this.parent.getLayer(this.boxZIndex), b;
                if (!c)
                    c = a.createElement(this.boxName), b =
                            c.style, b.position = "absolute", b.top = b.left = 0, this.parent.addLayer(this.boxZIndex, c);
                return c
            }, hideBorder: function () {
                var c = this.targetElement, d = c.currentStyle, g = c.runtimeStyle, i = c.tagName, h = b.ieVersion === 6, j;
                if (h && (i in b.childlessElements || i === "FIELDSET") || i === "BUTTON" || i === "INPUT" && c.type in b.inputButtonTypes) {
                    g.borderWidth = "";
                    i = this.styleInfos.borderInfo.sides;
                    for (j = i.length; j--; )
                        h = i[j], g["padding" + h] = "", g["padding" + h] = b.getLength(d["padding" + h]).pixels(c) + b.getLength(d["border" + h + "Width"]).pixels(c) +
                                (b.ieVersion !== 8 && j % 2 ? 1 : 0);
                    g.borderWidth = 0
                } else if (h) {
                    if (c.childNodes.length !== 1 || c.firstChild.tagName !== "ie6-mask") {
                        d = a.createElement("ie6-mask");
                        i = d.style;
                        i.visibility = "visible";
                        for (i.zoom = 1; i = c.firstChild; )
                            d.appendChild(i);
                        c.appendChild(d);
                        g.visibility = "hidden"
                    }
                } else
                    g.borderColor = "transparent"
            }, unhideBorder: function () {}, destroy: function () {
                this.parent.removeLayer(this.boxZIndex);
                delete this._shapes;
                delete this._layers
            }};
        b.RootRenderer = b.RendererBase.newRenderer({isActive: function () {
                var c = this.childRenderers,
                        a;
                for (a in c)
                    if (c.hasOwnProperty(a) && c[a].isActive())
                        return!0;
                return!1
            }, needsUpdate: function () {
                return this.styleInfos.visibilityInfo.changed()
            }, updatePos: function () {
                if (this.isActive()) {
                    var c = this.getPositioningElement(), d = c, g, c = c.currentStyle, i = c.position, h = this.getBox().style, j = 0, k = 0, k = this.boundsInfo.getBounds();
                    if (i === "fixed" && b.ieVersion > 6)
                        j = k.x, k = k.y, d = i;
                    else {
                        do
                            d = d.offsetParent;
                        while (d && d.currentStyle.position === "static");
                        d ? (g = d.getBoundingClientRect(), d = d.currentStyle, j = k.x - g.left - (parseFloat(d.borderLeftWidth) ||
                                0), k = k.y - g.top - (parseFloat(d.borderTopWidth) || 0)) : (d = a.documentElement, j = k.x + d.scrollLeft - d.clientLeft, k = k.y + d.scrollTop - d.clientTop);
                        d = "absolute"
                    }
                    h.position = d;
                    h.left = j;
                    h.top = k;
                    h.zIndex = i === "static" ? -1 : c.zIndex;
                    this.isPositioned = !0
                }
            }, updateSize: b.emptyFn, updateVisibility: function () {
                var c = this.styleInfos.visibilityInfo.getProps();
                this.getBox().style.display = c.visible && c.displayed ? "" : "none"
            }, updateProps: function () {
                this.isActive() ? this.updateVisibility() : this.destroy()
            }, getPositioningElement: function () {
                var c =
                        this.targetElement;
                return c.tagName in b.tableCellTags ? c.offsetParent : c
            }, getBox: function () {
                var c = this._box, b;
                if (!c)
                    b = this.getPositioningElement(), c = this._box = a.createElement("css3-container"), c.style.direction = "ltr", this.updateVisibility(), b.parentNode.insertBefore(c, b);
                return c
            }, finishUpdate: b.emptyFn, destroy: function () {
                var c = this._box, a;
                c && (a = c.parentNode) && a.removeChild(c);
                delete this._box;
                delete this._layers
            }});
        b.BackgroundRenderer = b.RendererBase.newRenderer({boxZIndex: 2, boxName: "background",
            needsUpdate: function () {
                var c = this.styleInfos;
                return c.backgroundInfo.changed() || c.borderRadiusInfo.changed()
            }, isActive: function () {
                var c = this.styleInfos;
                return c.borderImageInfo.isActive() || c.borderRadiusInfo.isActive() || c.backgroundInfo.isActive() || c.boxShadowInfo.isActive() && c.boxShadowInfo.getProps().inset
            }, draw: function () {
                var c = this.boundsInfo.getBounds();
                c.w && c.h && (this.drawBgColor(), this.drawBgImages())
            }, drawBgColor: function () {
                var c = this.styleInfos.backgroundInfo.getProps(), a = this.boundsInfo.getBounds(),
                        b = this.targetElement, d = c && c.color, h, j;
                if (d && d.alpha() > 0) {
                    if (this.hideBackground(), c = this.getShape("bgColor", "fill", this.getBox(), 1), h = a.w, a = a.h, c.stroked = !1, c.coordsize = h * 2 + "," + a * 2, c.coordorigin = "1,1", c.path = this.getBoxPath(null, 2), j = c.style, j.width = h, j.height = a, c.fill.color = d.colorValue(b), b = d.alpha(), b < 1)
                        c.fill.opacity = b
                } else
                    this.deleteShape("bgColor")
            }, drawBgImages: function () {
                var c = this.styleInfos.backgroundInfo.getProps(), a = this.boundsInfo.getBounds(), c = c && c.bgImages, b, d, h, j, k;
                if (c) {
                    this.hideBackground();
                    d = a.w;
                    h = a.h;
                    for (k = c.length; k--; )
                        a = c[k], b = this.getShape("bgImage" + k, "fill", this.getBox(), 2), b.stroked = !1, b.fill.type = "tile", b.fillcolor = "none", b.coordsize = d * 2 + "," + h * 2, b.coordorigin = "1,1", b.path = this.getBoxPath(0, 2), j = b.style, j.width = d, j.height = h, a.imgType === "linear-gradient" ? this.addLinearGradient(b, a) : (b.fill.src = a.imgUrl, this.positionBgImage(b, k))
                }
                for (k = c?c.length:0; this.deleteShape("bgImage" + k++); )
                    ;
            }, positionBgImage: function (c, a) {
                var d = this;
                b.Util.withImageSize(c.fill.src, function (i) {
                    var h = d.targetElement,
                            j = d.boundsInfo.getBounds(), k = j.w, j = j.h;
                    if (k && j) {
                        var l = c.fill, m = d.styleInfos, n = m.borderInfo.getProps(), p = n && n.widths, n = p ? p.t.pixels(h) : 0, o = p ? p.r.pixels(h) : 0, q = p ? p.b.pixels(h) : 0, p = p ? p.l.pixels(h) : 0, m = m.backgroundInfo.getProps().bgImages[a], h = m.bgPosition ? m.bgPosition.coords(h, k - i.w - p - o, j - i.h - n - q) : {x: 0, y: 0}, m = m.imgRepeat, q = o = 0, r = k + 1, s = j + 1, w = b.ieVersion === 8 ? 0 : 1, p = Math.round(h.x) + p + 0.5, n = Math.round(h.y) + n + 0.5;
                        l.position = p / k + "," + n / j;
                        if (m && m !== "repeat") {
                            if (m === "repeat-x" || m === "no-repeat")
                                o = n + 1, s = n + i.h + w;
                            if (m === "repeat-y" || m === "no-repeat")
                                q = p + 1, r = p + i.w + w;
                            c.style.clip = "rect(" + o + "px," + r + "px," + s + "px," + q + "px)"
                        }
                    }
                })
            }, addLinearGradient: function (c, a) {
                var d = this.targetElement, i = this.boundsInfo.getBounds(), h = i.w, j = i.h, i = c.fill, k = a.stops, l = k.length, m = Math.PI, n = b.GradientUtil, p = n.perpendicularIntersect, o = n.distance, n = n.getGradientMetrics(d, h, j, a), q = n.angle, r = n.startX, s = n.startY, w = n.startCornerX, u = n.startCornerY, v = n.endCornerX, C = n.endCornerY, t = n.deltaX, y = n.deltaY, n = n.lineLength, h = q % 90 ? Math.atan2(t * h / j, y) / m * 180 :
                        q + 90;
                h += 180;
                h %= 360;
                v = p(w, u, q, v, C);
                j = o(w, u, v[0], v[1]);
                m = [];
                v = p(r, s, q, w, u);
                o = o(r, s, v[0], v[1]) / j * 100;
                p = [];
                for (q = 0; q < l; q++)
                    p.push(k[q].offset ? k[q].offset.pixels(d, n) : q === 0 ? 0 : q === l - 1 ? n : null);
                for (q = 1; q < l; q++) {
                    if (p[q] === null) {
                        r = p[q - 1];
                        n = q;
                        do
                            s = p[++n];
                        while (s === null);
                        p[q] = r + (s - r) / (n - q + 1)
                    }
                    p[q] = Math.max(p[q], p[q - 1])
                }
                for (q = 0; q < l; q++)
                    m.push(o + p[q] / j * 100 + "% " + k[q].color.colorValue(d));
                i.angle = h;
                i.type = "gradient";
                i.method = "sigma";
                i.color = k[0].color.colorValue(d);
                i.color2 = k[l - 1].color.colorValue(d);
                i.colors ? i.colors.value =
                        m.join(",") : i.colors = m.join(",")
            }, hideBackground: function () {
                var c = this.targetElement.runtimeStyle;
                if (!this.isMuseBGPolyfill())
                    c.backgroundImage = "url(about:blank)";
                c.backgroundColor = "transparent"
            }, destroy: function () {
                b.RendererBase.destroy.call(this);
                var c = this.targetElement.runtimeStyle;
                if (!this.isMuseBGPolyfill())
                    c.backgroundImage = "";
                c.backgroundColor = ""
            }, isMuseBGPolyfill: function () {
                return $(this.targetElement.children[0]).hasClass("museBgSizePolyfill")
            }});
        b.BorderRenderer = b.RendererBase.newRenderer({boxZIndex: 4,
            boxName: "border", needsUpdate: function () {
                var c = this.styleInfos;
                return c.borderInfo.changed() || c.borderRadiusInfo.changed()
            }, isActive: function () {
                var c = this.styleInfos;
                return(c.borderRadiusInfo.isActive() || c.backgroundInfo.isActive()) && !c.borderImageInfo.isActive() && c.borderInfo.isActive()
            }, draw: function () {
                var c = this.targetElement, a = this.styleInfos.borderInfo.getProps(), b = this.boundsInfo.getBounds(), d = b.w, b = b.h, h, j, k, l, m;
                if (a) {
                    this.hideBorder();
                    a = this.getBorderSegments(2);
                    l = 0;
                    for (m = a.length; l < m; l++)
                        k =
                        a[l], h = this.getShape("borderPiece" + l, k.stroke ? "stroke" : "fill", this.getBox()), h.coordsize = d * 2 + "," + b * 2, h.coordorigin = "1,1", h.path = k.path, j = h.style, j.width = d, j.height = b, h.filled = !!k.fill, h.stroked = !!k.stroke, k.stroke ? (h = h.stroke, h.weight = k.weight + "px", h.color = k.color.colorValue(c), h.dashstyle = k.stroke === "dashed" ? "2 2" : k.stroke === "dotted" ? "1 1" : "solid", h.linestyle = k.stroke === "double" && k.weight > 2 ? "ThinThin" : "Single") : h.fill.color = k.fill.colorValue(c);
                    for (; this.deleteShape("borderPiece" + l++); )
                        ;
                }
            }, getBorderSegments: function (c) {
                var a =
                        this.targetElement, b, d, h, j = this.styleInfos.borderInfo, k = [], l, m, n, p, o = Math.round, q, r, s;
                if (j.isActive())
                    if (b = j.getProps(), j = b.widths, r = b.styles, s = b.colors, b.widthsSame && b.stylesSame && b.colorsSame)
                        s.t.alpha() > 0 && (b = j.t.pixels(a), n = b / 2, k.push({path: this.getBoxPath({t: n, r: n, b: n, l: n}, c), stroke: r.t, color: s.t, weight: b}));
                    else {
                        c = c || 1;
                        b = this.boundsInfo.getBounds();
                        d = b.w;
                        h = b.h;
                        b = o(j.t.pixels(a));
                        n = o(j.r.pixels(a));
                        p = o(j.b.pixels(a));
                        var a = o(j.l.pixels(a)), w = {t: b, r: n, b: p, l: a}, a = this.styleInfos.borderRadiusInfo;
                        a.isActive() && (q = this.getRadiiPixels(a.getProps()));
                        l = Math.floor;
                        m = Math.ceil;
                        var u = function (c, a) {
                            return q ? q[c][a] : 0
                        }, v = function (a, b, f, g, j, k) {
                            var n = u("x", a), o = u("y", a), q = a.charAt(1) === "r", a = a.charAt(0) === "b";
                            return n > 0 && o > 0 ? (k ? "al" : "ae") + (q ? m(d - n) : l(n)) * c + "," + (a ? m(h - o) : l(o)) * c + "," + (l(n) - b) * c + "," + (l(o) - f) * c + "," + g * 65535 + "," + 2949075 * (j ? 1 : -1) : (k ? "m" : "l") + (q ? d - b : b) * c + "," + (a ? h - f : f) * c
                        }, C = function (a, b, f, g) {
                            var j = a === "t" ? l(u("x", "tl")) * c + "," + m(b) * c : a === "r" ? m(d - b) * c + "," + l(u("y", "tr")) * c : a === "b" ? m(d - u("x", "br")) *
                                    c + "," + l(h - b) * c : l(b) * c + "," + m(h - u("y", "bl")) * c, a = a === "t" ? m(d - u("x", "tr")) * c + "," + m(b) * c : a === "r" ? m(d - b) * c + "," + m(h - u("y", "br")) * c : a === "b" ? l(u("x", "bl")) * c + "," + l(h - b) * c : l(b) * c + "," + l(u("y", "tl")) * c;
                            return f ? (g ? "m" + a : "") + "l" + j : (g ? "m" + j : "") + "l" + a
                        }, a = function (c, a, b, d, f, g) {
                            var i = c === "l" || c === "r", h = w[c], j, n;
                            h > 0 && r[c] !== "none" && s[c].alpha() > 0 && (j = w[i ? c : a], a = w[i ? a : c], n = w[i ? c : b], b = w[i ? b : c], r[c] === "dashed" || r[c] === "dotted" ? (k.push({path: v(d, j, a, g + 45, 0, 1) + v(d, 0, 0, g, 1, 0), fill: s[c]}), k.push({path: C(c, h / 2, 0, 1), stroke: r[c],
                                weight: h, color: s[c]}), k.push({path: v(f, n, b, g, 0, 1) + v(f, 0, 0, g - 45, 1, 0), fill: s[c]})) : k.push({path: v(d, j, a, g + 45, 0, 1) + C(c, h, 0, 0) + v(f, n, b, g, 0, 0) + (r[c] === "double" && h > 2 ? v(f, n - l(n / 3), b - l(b / 3), g - 45, 1, 0) + C(c, m(h / 3 * 2), 1, 0) + v(d, j - l(j / 3), a - l(a / 3), g, 1, 0) + "x " + v(d, l(j / 3), l(a / 3), g + 45, 0, 1) + C(c, l(h / 3), 1, 0) + v(f, l(n / 3), l(b / 3), g, 0, 0) : "") + v(f, 0, 0, g - 45, 1, 0) + C(c, 0, 1, 0) + v(d, 0, 0, g, 1, 0), fill: s[c]}))
                        };
                        a("t", "l", "r", "tl", "tr", 90);
                        a("r", "t", "b", "tr", "br", 0);
                        a("b", "r", "l", "br", "bl", -90);
                        a("l", "b", "t", "bl", "tl", -180)
                    }
                return k
            }, destroy: function () {
                if (this.finalized ||
                        !this.styleInfos.borderImageInfo.isActive())
                    this.targetElement.runtimeStyle.borderColor = "";
                b.RendererBase.destroy.call(this)
            }});
        b.BorderImageRenderer = b.RendererBase.newRenderer({boxZIndex: 5, pieceNames: ["t", "tr", "r", "br", "b", "bl", "l", "tl", "c"], needsUpdate: function () {
                return this.styleInfos.borderImageInfo.changed()
            }, isActive: function () {
                return this.styleInfos.borderImageInfo.isActive()
            }, draw: function () {
                this.getBox();
                var c = this.styleInfos.borderImageInfo.getProps(), a = this.styleInfos.borderInfo.getProps(),
                        d = this.boundsInfo.getBounds(), i = this.targetElement, h = this.pieces;
                b.Util.withImageSize(c.src, function (j) {
                    function k(c, a, b, d, f) {
                        var c = h[c].style, g = Math.max;
                        c.width = g(a, 0);
                        c.height = g(b, 0);
                        c.left = d;
                        c.top = f
                    }
                    function l(c, a, b) {
                        for (var d = 0, f = c.length; d < f; d++)
                            h[c[d]].imagedata[a] = b
                    }
                    var m = d.w, n = d.h, p = b.getLength("0"), o = c.widths || (a ? a.widths : {t: p, r: p, b: p, l: p}), p = o.t.pixels(i), q = o.r.pixels(i), r = o.b.pixels(i), o = o.l.pixels(i), s = c.slice, w = s.t.pixels(i), u = s.r.pixels(i), v = s.b.pixels(i), s = s.l.pixels(i);
                    k("tl", o, p,
                            0, 0);
                    k("t", m - o - q, p, o, 0);
                    k("tr", q, p, m - q, 0);
                    k("r", q, n - p - r, m - q, p);
                    k("br", q, r, m - q, n - r);
                    k("b", m - o - q, r, o, n - r);
                    k("bl", o, r, 0, n - r);
                    k("l", o, n - p - r, 0, p);
                    k("c", m - o - q, n - p - r, o, p);
                    l(["tl", "t", "tr"], "cropBottom", (j.h - w) / j.h);
                    l(["tl", "l", "bl"], "cropRight", (j.w - s) / j.w);
                    l(["bl", "b", "br"], "cropTop", (j.h - v) / j.h);
                    l(["tr", "r", "br"], "cropLeft", (j.w - u) / j.w);
                    l(["l", "r", "c"], "cropTop", w / j.h);
                    l(["l", "r", "c"], "cropBottom", v / j.h);
                    l(["t", "b", "c"], "cropLeft", s / j.w);
                    l(["t", "b", "c"], "cropRight", u / j.w);
                    h.c.style.display = c.fill ? "" : "none"
                },
                        this)
            }, getBox: function () {
                var c = this.parent.getLayer(this.boxZIndex), d, g, i, h = this.pieceNames, j = h.length;
                if (!c) {
                    c = a.createElement("border-image");
                    d = c.style;
                    d.position = "absolute";
                    this.pieces = {};
                    for (i = 0; i < j; i++)
                        g = this.pieces[h[i]] = b.Util.createVmlElement("rect"), g.appendChild(b.Util.createVmlElement("imagedata")), d = g.style, d.behavior = "url(#default#VML)", d.position = "absolute", d.top = d.left = 0, g.imagedata.src = this.styleInfos.borderImageInfo.getProps().src, g.stroked = !1, g.filled = !1, c.appendChild(g);
                    this.parent.addLayer(this.boxZIndex,
                            c)
                }
                return c
            }, prepareUpdate: function () {
                if (this.isActive()) {
                    var c = this.targetElement, a = c.runtimeStyle, b = this.styleInfos.borderImageInfo.getProps().widths;
                    a.borderStyle = "solid";
                    if (b)
                        a.borderTopWidth = b.t.pixels(c) + "px", a.borderRightWidth = b.r.pixels(c) + "px", a.borderBottomWidth = b.b.pixels(c) + "px", a.borderLeftWidth = b.l.pixels(c) + "px";
                    this.hideBorder()
                }
            }, destroy: function () {
                var c = this.targetElement.runtimeStyle;
                c.borderStyle = "";
                if (this.finalized || !this.styleInfos.borderInfo.isActive())
                    c.borderColor = c.borderWidth =
                            "";
                b.RendererBase.destroy.call(this)
            }});
        b.BoxShadowOutsetRenderer = b.RendererBase.newRenderer({boxZIndex: 1, boxName: "outset-box-shadow", needsUpdate: function () {
                var c = this.styleInfos;
                return c.boxShadowInfo.changed() || c.borderRadiusInfo.changed()
            }, isActive: function () {
                var c = this.styleInfos.boxShadowInfo;
                return c.isActive() && c.getProps().outset[0]
            }, draw: function () {
                function c(c, b, h, j, l, m, n) {
                    c = a.getShape("shadow" + c + b, "fill", i, k - c);
                    b = c.fill;
                    c.coordsize = p * 2 + "," + o * 2;
                    c.coordorigin = "1,1";
                    c.stroked = !1;
                    c.filled =
                            !0;
                    b.color = l.colorValue(d);
                    if (m)
                        b.type = "gradienttitle", b.color2 = b.color, b.opacity = 0;
                    c.path = n;
                    u = c.style;
                    u.left = h;
                    u.top = j;
                    u.width = p;
                    u.height = o;
                    return c
                }
                for (var a = this, d = this.targetElement, i = this.getBox(), h = this.styleInfos, j = h.boxShadowInfo.getProps().outset, h = h.borderRadiusInfo.getProps(), k = j.length, l = k, m, n = this.boundsInfo.getBounds(), p = n.w, o = n.h, n = b.ieVersion === 8 ? 1 : 0, q = ["tl", "tr", "br", "bl"], r, s, w, u, v, C, t, y, H, I, F, E, J, K; l--; ) {
                    s = j[l];
                    v = s.xOffset.pixels(d);
                    C = s.yOffset.pixels(d);
                    m = s.spread.pixels(d);
                    t =
                            s.blur.pixels(d);
                    s = s.color;
                    y = -m - t;
                    if (!h && t)
                        h = b.BorderRadiusStyleInfo.ALL_ZERO;
                    y = this.getBoxPath({t: y, r: y, b: y, l: y}, 2, h);
                    if (t)
                        if (H = (m + t) * 2 + p, I = (m + t) * 2 + o, F = t * 2 / H, E = t * 2 / I, t - m > p / 2 || t - m > o / 2)
                            for (m = 4; m--; )
                                r = q[m], J = r.charAt(0) === "b", K = r.charAt(1) === "r", r = c(l, r, v, C, s, t, y), w = r.fill, w.focusposition = (K ? 1 - F : F) + "," + (J ? 1 - E : E), w.focussize = "0,0", r.style.clip = "rect(" + ((J ? I / 2 : 0) + n) + "px," + (K ? H : H / 2) + "px," + (J ? I : I / 2) + "px," + ((K ? H / 2 : 0) + n) + "px)";
                        else
                            r = c(l, "", v, C, s, t, y), w = r.fill, w.focusposition = F + "," + E, w.focussize = 1 - F * 2 + "," +
                                    (1 - E * 2);
                    else if (r = c(l, "", v, C, s, t, y), v = s.alpha(), v < 1)
                        r.fill.opacity = v
                }
            }});
        b.ImgRenderer = b.RendererBase.newRenderer({boxZIndex: 6, boxName: "imgEl", needsUpdate: function () {
                var c = this.styleInfos;
                return this.targetElement.src !== this._lastSrc || c.borderRadiusInfo.changed()
            }, isActive: function () {
                var c = this.styleInfos;
                return c.borderRadiusInfo.isActive() || c.backgroundInfo.isPngFix()
            }, draw: function () {
                this._lastSrc = k;
                this.hideActualImg();
                var c = this.getShape("img", "fill", this.getBox()), a = c.fill, d = this.boundsInfo.getBounds(),
                        i = d.w, d = d.h, h = this.styleInfos.borderInfo.getProps(), j = h && h.widths, h = this.targetElement, k = h.src, l = Math.round, m = h.currentStyle, n = b.getLength;
                if (!j || b.ieVersion < 7)
                    j = b.getLength("0"), j = {t: j, r: j, b: j, l: j};
                c.stroked = !1;
                a.type = "frame";
                a.src = k;
                a.position = (i ? 0.5 / i : 0) + "," + (d ? 0.5 / d : 0);
                c.coordsize = i * 2 + "," + d * 2;
                c.coordorigin = "1,1";
                c.path = this.getBoxPath({t: l(j.t.pixels(h) + n(m.paddingTop).pixels(h)), r: l(j.r.pixels(h) + n(m.paddingRight).pixels(h)), b: l(j.b.pixels(h) + n(m.paddingBottom).pixels(h)), l: l(j.l.pixels(h) + n(m.paddingLeft).pixels(h))},
                        2);
                c = c.style;
                c.width = i;
                c.height = d
            }, hideActualImg: function () {
                this.targetElement.runtimeStyle.filter = "alpha(opacity=0)"
            }, destroy: function () {
                b.RendererBase.destroy.call(this);
                this.targetElement.runtimeStyle.filter = ""
            }});
        b.IE9RootRenderer = b.RendererBase.newRenderer({updatePos: b.emptyFn, updateSize: b.emptyFn, updateVisibility: b.emptyFn, updateProps: b.emptyFn, outerCommasRE: /^,+|,+$/g, innerCommasRE: /,+/g, setBackgroundLayer: function (c, a) {
                (this._bgLayers || (this._bgLayers = []))[c] = a || void 0
            }, finishUpdate: function () {
                var c =
                        this._bgLayers, a;
                if (c && (a = c.join(",").replace(this.outerCommasRE, "").replace(this.innerCommasRE, ",")) !== this._lastBg)
                    this._lastBg = this.targetElement.runtimeStyle.background = a
            }, destroy: function () {
                this.targetElement.runtimeStyle.background = "";
                delete this._bgLayers
            }});
        b.IE9BackgroundRenderer = b.RendererBase.newRenderer({bgLayerZIndex: 1, needsUpdate: function () {
                return this.styleInfos.backgroundInfo.changed()
            }, isActive: function () {
                var c = this.styleInfos;
                return c.backgroundInfo.isActive() || c.borderImageInfo.isActive()
            },
            draw: function () {
                var c = this.styleInfos.backgroundInfo.getProps(), a, d, i = 0, h, j;
                if (c) {
                    a = [];
                    if (d = c.bgImages)
                        for (; h = d[i++]; )
                            h.imgType === "linear-gradient" ? (j = this.getBgAreaSize(h.bgOrigin), j = (h.bgSize || b.BgSize.DEFAULT).pixels(this.targetElement, j.w, j.h, j.w, j.h), a.push("url(data:image/svg+xml," + escape(this.getGradientSvg(h, j.w, j.h)) + ") " + this.bgPositionToString(h.bgPosition) + " / " + j.w + "px " + j.h + "px " + (h.bgAttachment || "") + " " + (h.bgOrigin || "") + " " + (h.bgClip || ""))) : a.push(h.origString);
                    c.color && a.push(c.color.val);
                    this.parent.setBackgroundLayer(this.bgLayerZIndex, a.join(","))
                }
            }, bgPositionToString: function (c) {
                return c ? c.tokens.map(function (c) {
                    return c.tokenValue
                }).join(" ") : "0 0"
            }, getBgAreaSize: function (c) {
                var a = this.targetElement, d = this.boundsInfo.getBounds(), i = d.w, d = d.h, h;
                if (c !== "border-box" && (h = this.styleInfos.borderInfo.getProps()) && (h = h.widths))
                    i -= h.l.pixels(a) + h.l.pixels(a), d -= h.t.pixels(a) + h.b.pixels(a);
                if (c === "content-box")
                    c = b.getLength, h = a.currentStyle, i -= c(h.paddingLeft).pixels(a) + c(h.paddingRight).pixels(a),
                            d -= c(h.paddingTop).pixels(a) + c(h.paddingBottom).pixels(a);
                return{w: i, h: d}
            }, getGradientSvg: function (c, a, d) {
                var i = this.targetElement, h = c.stops, j = h.length, k = b.GradientUtil.getGradientMetrics(i, a, d, c), c = k.startX, l = k.startY, m = k.endX, n = k.endY, k = k.lineLength, p, o, q, r, s;
                p = [];
                for (o = 0; o < j; o++)
                    p.push(h[o].offset ? h[o].offset.pixels(i, k) : o === 0 ? 0 : o === j - 1 ? k : null);
                for (o = 1; o < j; o++)
                    if (p[o] === null) {
                        r = p[o - 1];
                        q = o;
                        do
                            s = p[++q];
                        while (s === null);
                        p[o] = r + (s - r) / (q - o + 1)
                    }
                a = ['<svg width="' + a + '" height="' + d + '" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="' +
                            c / a * 100 + '%" y1="' + l / d * 100 + '%" x2="' + m / a * 100 + '%" y2="' + n / d * 100 + '%">'];
                for (o = 0; o < j; o++)
                    a.push('<stop offset="' + p[o] / k + '" stop-color="' + h[o].color.colorValue(i) + '" stop-opacity="' + h[o].color.alpha() + '"/>');
                a.push('</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>');
                return a.join("")
            }, destroy: function () {
                this.parent.setBackgroundLayer(this.bgLayerZIndex)
            }});
        b.IE9BorderImageRenderer = b.RendererBase.newRenderer({REPEAT: "repeat", STRETCH: "stretch", ROUND: "round", bgLayerZIndex: 0,
            needsUpdate: function () {
                return this.styleInfos.borderImageInfo.changed()
            }, isActive: function () {
                return this.styleInfos.borderImageInfo.isActive()
            }, draw: function () {
                var c = this, a = c.styleInfos.borderImageInfo.getProps(), d = c.styleInfos.borderInfo.getProps(), i = c.boundsInfo.getBounds(), h = a.repeat, j = h.h, k = h.v, l = c.targetElement, m = 0;
                b.Util.withImageSize(a.src, function (h) {
                    function p(c, a, b, d, f, g, i, h, l, m) {
                        N.push('<pattern patternUnits="userSpaceOnUse" id="pattern' + L + '" x="' + (j === u ? c + b / 2 - l / 2 : c) + '" y="' + (k === u ? a + d /
                                2 - m / 2 : a) + '" width="' + l + '" height="' + m + '"><svg width="' + l + '" height="' + m + '" viewBox="' + f + " " + g + " " + i + " " + h + '" preserveAspectRatio="none"><image xlink:href="' + w + '" x="0" y="0" width="' + r + '" height="' + s + '" /></svg></pattern>');
                        O.push('<rect x="' + c + '" y="' + a + '" width="' + b + '" height="' + d + '" fill="url(#pattern' + L + ')" />');
                        L++
                    }
                    var o = i.w, q = i.h, r = h.w, s = h.h, w = c.imageToDataURI(a.src, r, s), u = c.REPEAT, v = c.STRETCH, h = c.ROUND, C = Math.ceil, t = b.getLength("0"), y = a.widths || (d ? d.widths : {t: t, r: t, b: t, l: t}), t = y.t.pixels(l),
                            H = y.r.pixels(l), I = y.b.pixels(l), y = y.l.pixels(l), F = a.slice, E = F.t.pixels(l), J = F.r.pixels(l), K = F.b.pixels(l), F = F.l.pixels(l), G = o - y - H, M = q - t - I, B = r - F - J, x = s - E - K, A = j === v ? G : B * t / E, z = k === v ? M : x * H / J, D = j === v ? G : B * I / K, v = k === v ? M : x * y / F, N = [], O = [], L = 0;
                    j === h && (A -= (A - (G % A || A)) / C(G / A), D -= (D - (G % D || D)) / C(G / D));
                    k === h && (z -= (z - (M % z || z)) / C(M / z), v -= (v - (M % v || v)) / C(M / v));
                    h = ['<svg width="' + o + '" height="' + q + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'];
                    p(0, 0, y, t, 0, 0, F, E, y, t);
                    p(y, 0, G, t, F, 0, B, E,
                            A, t);
                    p(o - H, 0, H, t, r - J, 0, J, E, H, t);
                    p(0, t, y, M, 0, E, F, x, y, v);
                    a.fill && p(y, t, G, M, F, E, B, x, A || D || B, v || z || x);
                    p(o - H, t, H, M, r - J, E, J, x, H, z);
                    p(0, q - I, y, I, 0, s - K, F, K, y, I);
                    p(y, q - I, G, I, F, s - K, B, K, D, I);
                    p(o - H, q - I, H, I, r - J, s - K, J, K, H, I);
                    h.push("<defs>" + N.join("\n") + "</defs>" + O.join("\n") + "</svg>");
                    c.parent.setBackgroundLayer(c.bgLayerZIndex, "url(data:image/svg+xml," + escape(h.join("")) + ") no-repeat border-box border-box");
                    m && c.parent.finishUpdate()
                }, c);
                m = 1
            }, imageToDataURI: function () {
                var c = {};
                return function (b, d, i) {
                    var h = c[b],
                            j;
                    if (!h)
                        h = new Image, j = a.createElement("canvas"), h.src = b, j.width = d, j.height = i, j.getContext("2d").drawImage(h, 0, 0), h = c[b] = j.toDataURL();
                    return h
                }
            }(), prepareUpdate: b.BorderImageRenderer.prototype.prepareUpdate, destroy: function () {
                var c = this.targetElement.runtimeStyle;
                this.parent.setBackgroundLayer(this.bgLayerZIndex);
                c.borderColor = c.borderStyle = c.borderWidth = ""
            }});
        b.Element = function () {
            function c(c) {
                var a = q.slice.call(arguments, 1), b = a.length;
                setTimeout(function () {
                    for (; b--; )
                        c.className += " " + a[b]
                }, 0)
            }
            function d(c) {
                var a =
                        q.slice.call(arguments, 1), b = a.length;
                setTimeout(function () {
                    for (; b--; ) {
                        var d = c, f = a[b], f = o[f] || (o[f] = RegExp("\\b" + f + "\\b", "g"));
                        d.className = d.className.replace(f, "")
                    }
                }, 0)
            }
            function g(g) {
                function i() {
                    if (!O) {
                        var c, d, f = b.ieDocMode, k = g.currentStyle, l = k.getAttribute(h) === "true";
                        S = k.getAttribute(j);
                        S = f > 7 ? S !== "false" : S === "true";
                        if (!N) {
                            N = 1;
                            g.runtimeStyle.zoom = 1;
                            for (var k = g, m = 1; k = k.previousSibling; )
                                if (k.nodeType === 1) {
                                    m = 0;
                                    break
                                }
                            m && (g.className += " " + n)
                        }
                        A.lock();
                        if (l && (d = A.getBounds()) && (c = a.documentElement || a.body) &&
                                (d.y > c.clientHeight || d.x > c.clientWidth || d.y + d.h < 0 || d.x + d.w < 0))
                            R || (R = 1, b.OnScroll.observe(i));
                        else {
                            O = 1;
                            R = N = 0;
                            b.OnScroll.unobserve(i);
                            f === 9 ? (z = {backgroundInfo: new b.BackgroundStyleInfo(g), borderImageInfo: new b.BorderImageStyleInfo(g), borderInfo: new b.BorderStyleInfo(g)}, D = [z.backgroundInfo, z.borderImageInfo], x = new b.IE9RootRenderer(g, A, z), c = [new b.IE9BackgroundRenderer(g, A, z, x), new b.IE9BorderImageRenderer(g, A, z, x)]) : (z = {backgroundInfo: new b.BackgroundStyleInfo(g), borderInfo: new b.BorderStyleInfo(g),
                                borderImageInfo: new b.BorderImageStyleInfo(g), borderRadiusInfo: new b.BorderRadiusStyleInfo(g), boxShadowInfo: new b.BoxShadowStyleInfo(g), visibilityInfo: new b.VisibilityStyleInfo(g)}, D = [z.backgroundInfo, z.borderInfo, z.borderImageInfo, z.borderRadiusInfo, z.boxShadowInfo, z.visibilityInfo], x = new b.RootRenderer(g, A, z), c = [new b.BoxShadowOutsetRenderer(g, A, z, x), new b.BackgroundRenderer(g, A, z, x), new b.BorderRenderer(g, A, z, x), new b.BorderImageRenderer(g, A, z, x)], g.tagName === "IMG" && c.push(new b.ImgRenderer(g,
                                    A, z, x)), x.childRenderers = c);
                            B = [x].concat(c);
                            if (c = g.currentStyle.getAttribute(b.CSS_PREFIX + "watch-ancestors")) {
                                c = parseInt(c, 10);
                                d = 0;
                                for (l = g.parentNode; l && (c === "NaN" || d++ < c); )
                                    G(l, "onpropertychange", E), G(l, "onmouseenter", C), G(l, "onmouseleave", t), G(l, "onmousedown", y), l.tagName in b.focusableElements && (G(l, "onfocus", I), G(l, "onblur", F)), l = l.parentNode
                            }
                            S && (b.Heartbeat.observe(q), b.Heartbeat.run());
                            q(1)
                        }
                        L || (L = 1, f < 9 && G(g, "onmove", o), G(g, "onresize", o), G(g, "onpropertychange", v), G(g, "onmouseenter", C), G(g, "onmouseleave",
                                t), G(g, "onmousedown", y), g.tagName in b.focusableElements && (G(g, "onfocus", I), G(g, "onblur", F)), b.OnResize.observe(o), b.OnUnload.observe(M));
                        A.unlock()
                    }
                }
                function o() {
                    A && A.hasBeenQueried() && q()
                }
                function q(c) {
                    if (!Q)
                        if (O) {
                            var a, b = B.length;
                            J();
                            for (a = 0; a < b; a++)
                                B[a].prepareUpdate();
                            if (c || A.positionChanged())
                                for (a = 0; a < b; a++)
                                    B[a].updatePos();
                            if (c || A.sizeChanged())
                                for (a = 0; a < b; a++)
                                    B[a].updateSize();
                            x.finishUpdate();
                            K()
                        } else
                            N || i()
                }
                function v() {
                    var c, a = B.length, b;
                    c = event;
                    if (!Q && !(c && c.propertyName in p))
                        if (O) {
                            J();
                            for (c = 0; c < a; c++)
                                B[c].prepareUpdate();
                            for (c = 0; c < a; c++)
                                b = B[c], b.isPositioned || b.updatePos(), b.needsUpdate() && b.updateProps();
                            x.finishUpdate();
                            K()
                        } else
                            N || i()
                }
                function C() {
                    c(g, k)
                }
                function t() {
                    d(g, k, l)
                }
                function y() {
                    c(g, l);
                    b.OnMouseup.observe(H)
                }
                function H() {
                    d(g, l);
                    b.OnMouseup.unobserve(H)
                }
                function I() {
                    c(g, m)
                }
                function F() {
                    d(g, m)
                }
                function E() {
                    var c = event.propertyName;
                    (c === "className" || c === "id") && v()
                }
                function J() {
                    A.lock();
                    for (var c = D.length; c--; )
                        D[c].lock()
                }
                function K() {
                    for (var c = D.length; c--; )
                        D[c].unlock();
                    A.unlock()
                }
                function G(c, a, b) {
                    c.attachEvent(a, b);
                    P.push([c, a, b])
                }
                function M() {
                    if (L) {
                        for (var c = P.length, a; c--; )
                            a = P[c], a[0].detachEvent(a[1], a[2]);
                        b.OnUnload.unobserve(M);
                        L = 0;
                        P = []
                    }
                }
                var B, x, A = new b.BoundsInfo(g), z, D, N, O, L, P = [], R, Q, S;
                this.init = i;
                this.update = q;
                this.destroy = function () {
                    if (!Q) {
                        var c, a;
                        M();
                        Q = 1;
                        if (B) {
                            c = 0;
                            for (a = B.length; c < a; c++)
                                B[c].finalized = 1, B[c].destroy()
                        }
                        S && b.Heartbeat.unobserve(q);
                        b.OnResize.unobserve(q);
                        B = A = z = D = g = null
                    }
                };
                this.el = g
            }
            var i = {}, h = b.CSS_PREFIX + "lazy-init", j = b.CSS_PREFIX + "poll",
                    k = b.CLASS_PREFIX + "hover", l = b.CLASS_PREFIX + "active", m = b.CLASS_PREFIX + "focus", n = b.CLASS_PREFIX + "first-child", p = {background: 1, bgColor: 1, display: 1}, o = {}, q = [];
            g.getInstance = function (c) {
                var a = b.Util.getUID(c);
                return i[a] || (i[a] = new g(c))
            };
            g.destroy = function (c) {
                var c = b.Util.getUID(c), a = i[c];
                a && (a.destroy(), delete i[c])
            };
            g.destroyAll = function () {
                var c = [], a;
                if (i) {
                    for (var b in i)
                        i.hasOwnProperty(b) && (a = i[b], c.push(a.el), a.destroy());
                    i = {}
                }
                return c
            };
            return g
        }();
        b.supportsVML = b.supportsVML;
        b.attach = function (c) {
            b.ieDocMode <
                    10 && b.supportsVML && b.Element.getInstance(c).init()
        };
        b.detach = function (c) {
            b.Element.destroy(c)
        }
    }
})();
