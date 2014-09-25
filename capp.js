/*!
 * conkitty-app v0.0.1, https://github.com/hoho/conkitty-app
 * (c) 2014 Yandex LLC, MIT license
 */
var $CA = (function() {
    var ready = [],
        themeNodes = {},
        curTheme,
        defaultTheme,
        documentLoaded,
        themeFilesInProgress = 0,
        $CAthemes,
        themeRing;

    function $CA() {
        documentLoaded = true;
        readyCallback();
    }

    $CA.ready = function(callback) {
        ready.push(callback);
        readyCallback();
    };

    $CA.themes = function(themes) {
        var t,
            prev;

        $CAthemes = themes;
        themeRing = {};

        for (t in themes) {
            if (!defaultTheme) { defaultTheme = t; }
            if (prev) { themeRing[prev] = t; }
            prev = t;
        }
        themeRing[prev] = defaultTheme;
        $CA.theme();
    };

    $CA.theme = function(theme) {
        var cookieTheme = document.cookie.replace(/^(?:.*\$CAtheme=([^;]+).*|.*)$/, '$1'),
            nodes,
            files,
            i,
            node;

        if (!theme) { theme = curTheme === undefined ? cookieTheme || defaultTheme : themeRing[curTheme]; }
        if (cookieTheme || theme !== defaultTheme) { document.cookie = ('$CAtheme=' + theme); }

        nodes = themeNodes[theme];
        curTheme = theme;

        if (nodes) {
            readyCallback();
        } else {
            nodes = themeNodes[theme] = [];
            files = $CAthemes[theme];
            themeFilesInProgress += files.length;
            for (i = 0; i < files.length; i++) {
                node = document.createElement('link');
                node.rel = 'stylesheet';
                node.href = files[i];
                node.onload = node.onerror = function() {
                    themeFilesInProgress--;
                    readyCallback();
                };
                document.head.appendChild(node);
                nodes.push(node);
            }
        }
    };

    return $CA;


    function readyCallback(/**/cb, theme, nodes, i) {
        if (documentLoaded && themeFilesInProgress === 0) {
            while ((cb = ready.shift())) {
                cb();
            }

            for (theme in themeNodes) {
                nodes = themeNodes[theme];
                for (i = nodes.length; i--;) {
                    nodes[i].disabled = theme !== curTheme;
                }
            }
        }
    }
})();
