/*!
 * conkitty-app v0.0.1, https://github.com/hoho/conkitty-app
 * (c) 2014 Yandex LLC, MIT license
 */
var $CA = (function() {
    var ready = [],
        themeNodes = {},
        curTheme,
        documentLoaded,
        themeLoaded,
        cb,
        $CA = function() {
            documentLoaded = true;
            if (themeLoaded) {
                while ((cb = ready.shift())) {
                    cb();
                }
            }
        };

    $CA.ready = function(callback) { ready.push(callback); };
    $CA.theme = function(theme) {
        var node = themeNodes[theme];
        curTheme = theme;
        if (node) {
            node.onload();
        } else {
            node = themeNodes[theme] = document.createElement('link');
            node.rel = 'stylesheet';
            node.href = $CA_styles[theme];
            node.onload = node.onerror = function(/**/t, e) {
                for (t in themeNodes) {
                    if ((e = themeNodes[t])) { e.disabled = t !== curTheme; }
                }
                if (!themeLoaded) {
                    themeLoaded = true;
                    if (documentLoaded) { $CA(); }
                }
            };
            document.head.appendChild(node);
        }
    };

    if (typeof $CA_styles !== 'undefined') {
        $CA.theme('light');
    }

    return $CA;
})();
