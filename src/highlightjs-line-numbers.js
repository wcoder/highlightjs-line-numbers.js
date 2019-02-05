// jshint multistr:true

(function (w, d) {
    'use strict';

    var TABLE_NAME = 'hljs-ln',
        LINE_NAME = 'hljs-ln-line',
        NUMBERS_CONTAINER_NAME = 'hljs-ln-numbers-container',
        CODE_CONTAINER_NAME = 'hljs-ln-code-container',
        CODE_BLOCK_NAME = 'hljs-ln-code',
        NUMBERS_BLOCK_NAME = 'hljs-ln-numbers',
        NUMBER_LINE_NAME = 'hljs-ln-n',
        DATA_ATTR_NAME = 'data-line-number',
        BREAK_LINE_REGEXP = /\r\n|\r|\n/g;

    var resizeHandlerSet = false;

    if (w.hljs) {
        w.hljs.initLineNumbersOnLoad = initLineNumbersOnLoad;
        w.hljs.lineNumbersBlock = lineNumbersBlock;
        w.hljs.lineNumbersValue = lineNumbersValue;

        addStyles();
    } else {
        w.console.error('highlight.js not detected!');
    }

    function addStyles () {
        var css = d.createElement('style');
        css.type = 'text/css';
        css.innerHTML = format(
            '.{0} table {float: left; border-collapse: collapse}' +
            '.{0} table td {padding: 0}' +
            '.{1}::before {content: attr({2})}' +
            // force display of empty lines of code
            '.{3}::before {content: "\\200B"}' +
            // ensure consistent line heights in dom elements for numbers and code
            '.{3},.{4} {line-height: 16px; line-height: 1rem}',
        [
            TABLE_NAME,
            NUMBER_LINE_NAME,
            DATA_ATTR_NAME,
            CODE_BLOCK_NAME,
            NUMBERS_BLOCK_NAME
        ]);
        d.getElementsByTagName('head')[0].appendChild(css);
    }

    function initLineNumbersOnLoad (options) {
        if (d.readyState === 'interactive' || d.readyState === 'complete') {
            documentReady(options);
        } else {
            w.addEventListener('DOMContentLoaded', function () {
                documentReady(options);
            });
        }
    }

    function documentReady (options) {
        try {
            var blocks = d.querySelectorAll('code.hljs,code.nohighlight');

            for (var i in blocks) {
                if (blocks.hasOwnProperty(i)) {
                    lineNumbersBlock(blocks[i], options);
                }
            }
        } catch (e) {
            w.console.error('LineNumbers error: ', e);
        }
    }

    function adjustLineNumbersHeights(element) {
        var lnNumbers = element.querySelectorAll('.' + NUMBERS_BLOCK_NAME);
        var lnCode = element.querySelectorAll('.' + CODE_BLOCK_NAME);

        for (var i = 0 ; i < lnNumbers.length; ++i) {
            lnNumbers[i].style.height = lnCode[i].offsetHeight + 'px';
        }
    }

    function lineNumbersBlock (element, options) {
        if (typeof element !== 'object') return;
        async(function () {
            element.innerHTML = lineNumbersInternal(element, options);
            // adjust left margin of code div as line numbers is a float left dom element
            var lineNumbersContainer = element.querySelector('.' + NUMBERS_CONTAINER_NAME);
            if (lineNumbersContainer) {
                var codeMargin = lineNumbersContainer.offsetWidth;
                var codeContainerStyle = 'margin-left:' + codeMargin + 'px';
                var codeContainer = element.querySelector('.' + CODE_CONTAINER_NAME);
                codeContainer.style.cssText = codeContainerStyle;

                // adjust each line number cell height to the one of the div containing
                // the wrapped line of code and set a handler to execute this
                // operation when the browser window gets resized.
                // execute this operation asynchronously once the code has been rendered
                async(adjustLineNumbersHeights(element));
                if (!resizeHandlerSet) {
                    window.addEventListener('resize', function() {
                        async(function() {
                            var hljsLnElts = document.querySelectorAll('.' + TABLE_NAME);
                            for (var i = 0 ; i < hljsLnElts.length; ++i) {
                                adjustLineNumbersHeights(hljsLnElts[i]);
                            }
                        });
                    });
                    resizeHandlerSet = true;
                }
            }
        });
    }

    function lineNumbersValue (value, options) {
        if (typeof value !== 'string') return;

        var element = document.createElement('code')
        element.innerHTML = value

        return lineNumbersInternal(element, options);
    }

    function lineNumbersInternal (element, options) {
        // define options or set default
        options = options || {
            singleLine: false
        };

        // convert options
        var firstLineIndex = !!options.singleLine ? 0 : 1;

        duplicateMultilineNodes(element);

        return addLineNumbersBlockFor(element.innerHTML, firstLineIndex);
    }

    function addLineNumbersBlockFor (inputHtml, firstLineIndex) {

        var lines = getLines(inputHtml);

        // if last line contains only carriage return remove it
        if (lines[lines.length-1].trim() === '') {
            lines.pop();
        }

        if (lines.length > firstLineIndex) {
            // Previous implementation was using a single table element
            // to render the line numbers and the lines of code.
            // But to overcome an annoying copy/paste behavior when using Firefox or Edge
            // (see https://github.com/wcoder/highlightjs-line-numbers.js/issues/51)
            // the following workaround is used while obtaining the exact same rendering
            // as before:
            //    1. render the lines number in a table with single column
            //    2. render the lines of code in a div
            //    3. wrap these in a div and make the table float left
            //    4. adjust the left margin of the code div once inserted in the dom
            var htmlLinesNumber = '';
            var htmlCode = '';

            for (var i = 0, l = lines.length; i < l; i++) {
                htmlLinesNumber += format(
                    '<tr class="{0} {1}" {3}="{4}">' +
                        '<td>' +
                            '<div class="{2}" {3}="{4}"></div>' +
                        '</td>' +
                    '</tr>',
                [
                    LINE_NAME,
                    NUMBERS_BLOCK_NAME,
                    NUMBER_LINE_NAME,
                    DATA_ATTR_NAME,
                    i + 1
                ]);

                htmlCode += format(
                    '<div class="{0} {1}" {2}="{3}">{4}</div>',
                [
                    LINE_NAME,
                    CODE_BLOCK_NAME,
                    DATA_ATTR_NAME,
                    i + 1,
                    lines[i].length > 0 ? lines[i] : ' '
                ]);
            }

            return format(
              '<div class="{0}">' +
                  '<table class="{1}">{2}</table>' +
                  '<div class="{3}">{4}</div>' +
              '</div>',
            [
                TABLE_NAME,
                NUMBERS_CONTAINER_NAME,
                htmlLinesNumber,
                CODE_CONTAINER_NAME,
                htmlCode
            ]);
        }

        return inputHtml;
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

        for (var i = 0, result = ''; i < lines.length; i++) {
            var lineText = lines[i].length > 0 ? lines[i] : ' ';
            result += format('<span class="{0}">{1}</span>\n', [ className,  lineText ]);
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

}(window, document));
