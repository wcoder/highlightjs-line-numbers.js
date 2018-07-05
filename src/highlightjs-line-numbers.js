// jshint multistr:true

(function (w, d) {
    'use strict';

    var TABLE_NAME = 'hljs-ln',
        LINE_NAME = 'hljs-ln-line',
        CODE_BLOCK_NAME = 'hljs-ln-code',
        NUMBERS_BLOCK_NAME = 'hljs-ln-numbers',
        NUMBER_LINE_NAME = 'hljs-ln-n',
        DATA_ATTR_NAME = 'data-line-number',
        BREAK_LINE_REGEXP = /\r\n|\r|\n/g;

    if (w.hljs) {
        w.hljs.initLineNumbersOnLoad = initLineNumbersOnLoad;
        w.hljs.lineNumbersBlock = lineNumbersBlock;
        w.hljs.initLineNumScroll = initLineNumScroll;

        addStyles();
    } else {
        w.console.error('highlight.js not detected!');
    }

    function addStyles () {
        var css = d.createElement('style');
        css.type = 'text/css';
        css.innerHTML = format(
            '.{0}{border-collapse:collapse}\
            .{0} td{padding:0}\
            .{1}:before{content:attr({2})}{3}',
            [
                TABLE_NAME,
                NUMBER_LINE_NAME,
                DATA_ATTR_NAME,
            ]);
        d.getElementsByTagName('head')[0].appendChild(css);
    }

    function initLineNumbersOnLoad (options) {
        var css = d.createElement('style');

        css.innerHTML = '\
        pre>code{white-space:nowrap;}\
            .hljs-ln-line{white-space:pre;}\
            .hljs-ln-code .hljs-ln-line{padding-left:10px;}\
            .hljs-ln-numbers{width:1px;}\
            .hljs-ln-n{text-align:right;padding-right:10px;\
                border-right:1px solid;white-space:nowrap;\
                padding-left:5px;}\
            .hljs-ln-code:hover{background-color:rgba(0,0,0,.25)}\
            .hljs-ln-code *::selection{background-color:rgba(0,0,0,.45);}\
            .hljs-ln-code *::-moz-selection{background-color:rgba(0,0,0,.45);}\
            .selectedText{background-color:rgba(0,0,0,.25);\
                border-left:1px solid;border-right:1px solid;}\
            .selectedTextBoth{background-color:rgba(0,0,0,.25);border:1px solid;}\
            .selectedTextFirst{background-color:rgba(0,0,0,.25);\
                border-top:1px solid;border-left:1px solid;border-right:1px solid;}\
            .selectedTextLast{background-color:rgba(0,0,0,.25);\
                border-bottom:1px solid;border-left:1px solid;border-right:1px solid;}'
        d.getElementsByTagName('head')[0].appendChild(css);
        if (d.readyState === 'complete') {
            documentReady(options);
        } else {
            w.addEventListener('DOMContentLoaded', function () {
                documentReady(options);
            });
        }
    }

    function documentReady (options) {
        try {
            var blocks = d.querySelectorAll('code.hljs');

            for (var i in blocks) {
                if (blocks.hasOwnProperty(i)) {
                    lineNumbersBlock(blocks[i], options);
                }
            }
        } catch (e) {
            w.console.error('LineNumbers error: ', e);
        }
    }

    function lineNumbersBlock (element, options) {
        if (typeof element !== 'object') return;

        // define options or set default
        options = options || {
            singleLine: false
        };

        // convert options
        var firstLineIndex = !!options.singleLine ? 0 : 1;

        async(function () {

            duplicateMultilineNodes(element);

            element.innerHTML =
                addLineNumbersBlockFor(element.innerHTML, firstLineIndex);
        });
    }

    function addLineNumbersBlockFor (inputHtml, firstLineIndex) {
        var lines = getLines(inputHtml);

        // if last line contains only carriage return remove it
        if (lines[lines.length-1].trim() === '') {
            lines.pop();
        }

        if (lines.length > firstLineIndex) {
            var html = '';

            // setup for linking lines
            var currLoc = new URL(window.location.href);
            currLoc.hash = "";
            var uri = currLoc.href.endsWith('#') ? currLoc.href : currLoc.href + '#';

            // get our line ranges
            var lnRanges = splitLineParam(getLineParam());

            // our current lnRanges index, and something to tell us
            // if we should increment it
            var currIdx = 0;

            // do we highlight this line?
            var hl = false;
            var tmp;

            for (var i = 0, l = lines.length; i < l; i++) {
                tmp = doHighlight(i, lnRanges[currIdx]);
                hl = tmp[0];
                currIdx += tmp[1] && currIdx + 1 <= lnRanges.length ? 1 : 0;
                html += format(
                    '<tr class="{8}">\
                    <td class="{0}" id="#L{5}">\
                    <a href="{7}L{5}">\
                    <div class="{1} {2}" {3}="{5}">\
                    </div>\
                    </a>\
                    </td>\
                    <td class="{4}">\
                    <div class="{1}">{6}</div>\
                    </td>\
                    </tr>',
                    [
                        NUMBERS_BLOCK_NAME,
                        LINE_NAME,
                        NUMBER_LINE_NAME,
                        DATA_ATTR_NAME,
                        CODE_BLOCK_NAME,
                        i + 1,
                        lines[i].length > 0 ? lines[i] : ' ',
                        uri,
                        hl ? whichSelectedText(tmp) : " "
                    ]);
                hl = false;
            }

            return format('<table class="{0}">{1}</table>', [ TABLE_NAME, html ]);
        }
    }

    function whichSelectedText(check) {
        if (check[2] && check[3]) {
            return "selectedTextBoth";
        } else if (check[2]) {
            return "selectedTextFirst";
        } else if (check[3]) {
            return "selectedTextLast";
        } else {
            return "selectedText";
        }
    }

    function getLineParam() {
        var idx1 = window.location.href.indexOf("&ln=") + 3;
        var idx2 = window.location.href.indexOf("&", idx1);
        idx2 = idx2 == -1 ? window.location.href.length : idx2 -1;
        var len = idx2 - idx1;
        return window.location.href.substr(idx1+1, len) + window.location.hash;
    }

    function splitLineParam(param) {
        // split into $NUM-$NUM ranges or $NUM singulars, then split
        // each into arrays of numbers
        var ps = param.match(/\d+(-\d+)?/g);
        return ps !== null ? ps.map(x => (x.match(/\d+/g)).map (x => parseInt(x))) :
            [];
    }

    function doHighlight(idx, range) {
        var nextRange = false;
        var first = false;
        var last = false;
        try {
            if (range.length == 1) {
                nextRange = idx+1 == range[0];
                return [nextRange, nextRange, nextRange, nextRange];
            } else if (range.length == 2) {
                nextRange = idx+1 == range[1];
                first = idx+1 == range[0];
                last = idx+1 == range[1];
                return [idx+1 >= range[0] && idx+1 <= range[1], nextRange, first, last];
            }
        } catch (e) {
            return [false, false, false, false];
        }
    }

    /**
     * Recursive method for fix multi-line elements implementation in highlight.js
     * Doing deep passage on child nodes.
     * @param {HTMLElement} element
     */
    function duplicateMultilineNodes (element) {
        var nodes = element.childNodes;
        for (var node in nodes) {
            if (nodes.hasOwnProperty(node)) {
                var child = nodes[node];
                if (getLinesCount(child.textContent) > 0) {
                    if (child.childNodes.length > 0) {
                        duplicateMultilineNodes(child);
                    } else {
                        duplicateMultilineNode(child.parentNode);
                    }
                }
            }
        }
    }

    /**
     * Method for fix multi-line elements implementation in highlight.js
     * @param {HTMLElement} element
     */
    function duplicateMultilineNode (element) {
        var className = element.className;

        if ( ! /hljs-/.test(className)) return;

        var lines = getLines(element.innerHTML);

        var line_to_fmt = '<span class="{0}">';
        for (var i = 0, result = ''; i < lines.length; i++) {
            line_to_fmt = '<span class="{0}">' + lines[i] +'</span>\n';
            result += format(line_to_fmt, [ className ]);
        }

        element.innerHTML = result.trim();
    }

    function getLines (text) {
        if (text.length === 0) return [];
        return text.split(BREAK_LINE_REGEXP);
    }

    function getLinesCount (text) {
        return (text.trim().match(BREAK_LINE_REGEXP) || []).length;
    }

    function async (func) {
        w.setTimeout(func, 0);
    }

    /**
     * {@link https://wcoder.github.io/notes/string-format-for-string-formating-in-javascript}
     * @param {string} format
     * @param {array} args
     */
    function format (format, args) {
        return format.replace(/\{(\d+)\}/g, function(m, n){
            return args[n] ? args[n] : m;
        });
    }

    function rafAsync() {
        return new Promise(resolve => {
            requestAnimationFrame(resolve);
        });
    }

    function checkEl(id) {
        if (document.getElementById(id) === null) {
            return rafAsync().then(() => checkEl(id));
        } else {
            return Promise.resolve(true);
        }
    }

    function initLineNumScroll (options) {
        if (d.readyState === 'complete') {
            documentReady(options);
        } else {
            var el = '#L' + splitLineParam(getLineParam())[0][0].toString();
            w.addEventListener('DOMContentLoaded', function () {
                checkEl(el).then((element) => {
                    try {
                        document.getElementById(el).scrollIntoView();
                    } catch (e) {

                    }
                })
            });
        }
    }

}(window, document));
