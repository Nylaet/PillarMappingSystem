/*
 Copyright 2011-2016 Adobe Systems Incorporated. All Rights Reserved.
 */
(function (a) {
    a.fn.museMenu = function () {
        return this.each(function () {
            var b = this.id,
                    c = a(this),
                    d = c.closest(".breakpoint"), g = "absolute", f, j, h, i, k, l;
            if (!c.data("initialized")) {
                c.data("initialized", !0);
                var m = function () {
                    if (c.css("position") == "fixed") {
                        g = "fixed";
                        l = c;
                        var a = Muse.Utils.getStyleSheetRulesById(Muse.Utils.getPageStyleSheets(), b);
                        f = a ? Muse.Utils.getRuleProperty(a, "top") : c.css("top");
                        j = a ? Muse.Utils.getRuleProperty(a, "left") : c.css("left");
                        h = a ? Muse.Utils.getRuleProperty(a, "right") : c.css("right");
                        i = a ? Muse.Utils.getRuleProperty(a,
                                "bottom") : c.css("bottom");
                        k = parseInt(c.css("margin-left"))
                    } else
                        for (a = c.parent(); !a.is(document) && a.length > 0 && a.attr("id") != "page"; ) {
                            if (a.css("position") == "fixed") {
                                g = "fixed";
                                l = a;
                                var d = a.offset(), m = c.offset(), n = Muse.Utils.getStyleSheetRulesById(Muse.Utils.getPageStyleSheets(), a.attr("id")), o = n ? Muse.Utils.getRuleProperty(n, "top") : a.css("top"), p = n ? Muse.Utils.getRuleProperty(n, "left") : a.css("left"), r = n ? Muse.Utils.getRuleProperty(n, "right") : a.css("right"), n = n ? Muse.Utils.getRuleProperty(n, "bottom") : a.css("bottom");
                                f = o && o != "auto" ? parseInt(o) + (m.top - d.top) : o;
                                j = p && p != "auto" && p.indexOf("%") == -1 ? parseInt(p) + (m.left - d.left) : p;
                                h = r && r != "auto" && r.indexOf("%") == -1 ? parseInt(r) + (d.left + a.width()) - (m.left + c.width()) : r;
                                i = n && n != "auto" ? parseInt(n) + (d.top + a.height()) - (m.top + c.height()) : n;
                                k = parseInt(a.css("margin-left")) + (p && p.indexOf("%") != -1 ? m.left - d.left : 0);
                                break
                            }
                            a = a.parent()
                        }
                }, o = function (b, c) {
                    d.is(b) && t.each(function () {
                        var b = a(this).data("offsetContainerRaw");
                        b && (c.swapPlaceholderNodesRecursively(b), c.activateIDs(b))
                    })
                };
                a("body").on("muse_bp_activate", function (a, b, c, f) {
                    o(c, f);
                    m()
                });
                m();
                var r = a(), p = !1, n = c.find(".MenuItemContainer"), t = c.find(".MenuItem"), q = c.find(".SubMenu").add(t), y;
                q.on("mouseover", function () {
                    p = !0
                });
                q.on("mouseleave", function () {
                    p = !1;
                    setTimeout(function () {
                        p === !1 && (n.each(function () {
                            a(this).data("hideSubmenu")()
                        }), r = a())
                    }, 300)
                });
                n.on("mouseleave", function (b) {
                    var c = a(b.target), f = c.closest(".SubMenu");
                    y && clearTimeout(y);
                    f.length > 0 && (y = setTimeout(function () {
                        f.find(".MenuItemContainer").each(function () {
                            a(this).data("hideSubmenu")()
                        });
                        r = c.closest(".MenuItemContainer").data("$parentMenuItemContainer")
                    }, 300))
                });
                n.on("mouseenter", function () {
                    clearTimeout(y)
                });
                t.each(function () {
                    var b = a(this), d = b.siblings(".SubMenu"), m = b.closest(".MenuItemContainer"), n = m.parentsUntil(".MenuBar").filter(".MenuItemContainer").length === 0, o;
                    if (n && d.length > 0)
                        b.data("offsetContainerRaw", a("<div style='position:" + g + "' class='MenuBar popup_element'></div>").hide().appendTo("body")), d.show(), o = d.position().top, d.hide();
                    m.data("$parentMenuItemContainer", m.parent().closest(".MenuItemContainer")).data("showSubmenuOnly",
                            function () {
                                if (n && d.length > 0) {
                                    var a = b.data("offsetContainer"), a = a || b.data("offsetContainerRaw");
                                    if (g != "fixed") {
                                        var p = m.offset();
                                        a.css({left: p.left, top: p.top, width: b.width()})
                                    } else {
                                        var p = m.position(), r = 0, s = 0;
                                        h && h != "auto" && (r = c.outerWidth() - p.left - b.width());
                                        i && i != "auto" && (s = o);
                                        k = parseInt(l.css("margin-left"));
                                        if (l != c) {
                                            var q = Muse.Utils.getStyleSheetRulesById(Muse.Utils.getPageStyleSheets(), l.attr("id"));
                                            (q = q ? Muse.Utils.getRuleProperty(q, "left") : l.css("left")) && q.indexOf("%") != -1 && (k += c.offset().left -
                                                    l.offset().left)
                                        }
                                        a.css({left: j, top: f, right: h, bottom: i, marginLeft: k + p.left, marginRight: r, marginTop: p.top, marginBottom: s, width: b.width()})
                                    }
                                    a.append(d).show();
                                    b.data("offsetContainer", a);
                                    l && a && l.data("hasScrollEffect") === !0 && a.cloneScrollEffectsFrom(l)
                                }
                                d.show();
                                d.find(".SubMenu").hide()
                            }).data("hideSubmenu", function () {
                        var a = b.data("offsetContainer");
                        a && a.data("hasScrollEffect") === !0 && a.clearScrollEffects();
                        d.hide()
                    }).data("isDescendentOf", function (a) {
                        for (var b = m.data("$parentMenuItemContainer"); b.length >
                                0; ) {
                            if (a.index(b) >= 0)
                                return!0;
                            b = b.data("$parentMenuItemContainer")
                        }
                        return!1
                    });
                    var p = function () {
                        var b = r;
                        b.length == 0 ? m.data("showSubmenuOnly")() : m.data("$parentMenuItemContainer").index(b) >= 0 ? m.data("showSubmenuOnly")() : m.siblings().index(b) >= 0 ? (b.data("hideSubmenu")(), m.data("showSubmenuOnly")()) : b.data("isDescendentOf")(m) ? m.data("showSubmenuOnly")() : b.data("isDescendentOf")(m.siblings(".MenuItemContainer")) ? (m.siblings(".MenuItemContainer").each(function () {
                            a(this).data("hideSubmenu")()
                        }), m.data("showSubmenuOnly")()) :
                                b.get(0) == m.get(0) && m.data("showSubmenuOnly")();
                        r = m
                    }, q = null;
                    b.on("mouseenter", function () {
                        b.data("mouseEntered", !0);
                        q = setTimeout(function () {
                            p()
                        }, 200);
                        b.one("mouseleave", function () {
                            clearTimeout(q);
                            b.data("mouseEntered", !1)
                        })
                    });
                    d.length && (b.attr("aria-haspopup", !0), Muse.Browser.Features.Touch && (b.click(function () {
                        return d.is(":visible")
                    }), a(document.documentElement).on(Muse.Browser.Features.Touch.End, Muse.Browser.Features.Touch.Listener(function (c) {
                        !d.is(":visible") && a(c.target).closest(m).length > 0 ?
                                (c.stopPropagation(), Muse.Utils.redirectCancelled = !0, setTimeout(function () {
                                    Muse.Utils.redirectCancelled = !1
                                }, 16), b.data("mouseEntered") && setTimeout(function () {
                                    m.data("showSubmenuOnly")()
                                }, 200)) : d.is(":visible") && a(c.target).closest(d).length == 0 && a(c.target).closest(m).length == 0 && m.data("hideSubmenu")()
                    }))))
                });
                t.filter(".MuseMenuActive").each(function () {
                    for (var b = a(this).closest(".MenuItemContainer").data("$parentMenuItemContainer"); b && b.length > 0; )
                        b.children(".MenuItem").addClass("MuseMenuActive"),
                                b = b.data("$parentMenuItemContainer")
                })
            }
        })
    }
})(jQuery);
;
(function () {
    if (!("undefined" == typeof Muse || "undefined" == typeof Muse.assets)) {
        var a = function (a, b) {
            for (var c = 0, d = a.length; c < d; c++)
                if (a[c] == b)
                    return c;
            return -1
        }(Muse.assets.required, "jquery.musemenu.js");
        if (-1 != a) {
            Muse.assets.required.splice(a, 1);
            for (var a = document.getElementsByTagName("meta"), b = 0, c = a.length; b < c; b++) {
                var d = a[b];
                if ("generator" == d.getAttribute("name")) {
                    "2015.1.0.342" != d.getAttribute("content") && Muse.assets.outOfDate.push("jquery.musemenu.js");
                    break
                }
            }
        }
    }
})();
