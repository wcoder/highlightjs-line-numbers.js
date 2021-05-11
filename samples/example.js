$(function() {

    function scrollToLineNumber(lineNumber) {
        var selector = ".hljs-ln-line[data-line-number='" + lineNumber +  "']";
        var element_to_scroll_to = document.querySelector(selector);
        element_to_scroll_to.scrollIntoView();
    }


    function extractLineNumbersFromHash(){
        var str = location.hash.substring(1);
        var matches = str.match(/L\d+/g);              // Regex match multiple events (/g) of the regex "L" + number
        if (matches.length == 0){
            return {
                first: null,
                second: null,
            };
        }
        else if(matches.length == 1){
            return {
                first: parseInt(matches[0].substring(1)),
                second: null,
            };
        }
        else{
            return {
                first: parseInt(matches[0].substring(1)),
                second: parseInt(matches[1].substring(1)),
            };
        }
    }


    function colorLineNumbers(lineNumberBegin, lineNumberEnd){
        // clean current highlighted lines first
        var highlightedList = document.querySelectorAll(".hljs-ln-highlight");
        var idx;
        for (idx = 0; idx < highlightedList.length ; idx++) {
            highlightedList[idx].classList.remove("hljs-ln-highlight");
        }

        if (!lineNumberBegin) return;
        if (!lineNumberEnd) lineNumberEnd=lineNumberBegin;

        var lineNumber;
        for (lineNumber = lineNumberBegin; lineNumber < lineNumberEnd+1 ; lineNumber++) {
            var selector = ".hljs-ln-code[data-line-number='" + lineNumber +  "']";
            var element = document.querySelector(selector);
            if (element){
                element.classList.add('hljs-ln-highlight');
            }
        }
    }


    if (typeof hljs != "undefined")
    {
        /////////////////////////////
        // classic highlight js
        /////////////////////////////
        hljs.configure({
          languages: []
        })
        $('pre code').each(function(i, e) {hljs.highlightBlock(e)});




        /////////////////////////////
        // line numbers highlight js - activate only on class "do-hljs-ln"
        /////////////////////////////
        $('pre.do-hljs-ln code.hljs').each(function(i, block) {
            hljs.lineNumbersBlock(block);
        });


        // Add multi line coloring, click, and hashchange,
        // Assumes hash is similar to github format. Can be a range (#L35-L68) or single line(#L128).
        var preList = document.querySelectorAll("pre.do-hljs-ln code.hljs");
        var idx;
        for (idx = 0; idx < preList.length ; idx++) {
          preList[idx].addEventListener('ready', function(e) {

            // scroll to hash
            if (location.hash){
                var res = extractLineNumbersFromHash();
                scrollToLineNumber(res.first);
                colorLineNumbers(res.first, res.second);
                e.preventDefault();
            }

            // add event listener scroll to hash change
            $(window).on('hashchange', function() {
                var res = extractLineNumbersFromHash();
                scrollToLineNumber(res.first);
                colorLineNumbers(res.first, res.second);
                e.preventDefault();
            });

            // add event listener scroll to click
            $(".hljs-ln-n").click(function(){
                var lineNumber = parseInt( $(this).attr('data-line-number'));
                var new_path = window.location.pathname + window.location.search + '#L' + lineNumber;
                history.replaceState(null, null, new_path);             // change hash without triggering hashchange event
                colorLineNumbers(lineNumber, lineNumber)
                e.preventDefault();
            });
          }, false);
        };
    }
});
