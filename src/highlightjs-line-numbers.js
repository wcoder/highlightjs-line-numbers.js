// jshint multistr:true

import { decorateHljs } from './core.js';

(function (w, d) {
    'use strict';

    if(hljs) {
        decorateHljs(w,d,hljs);
    } else {
        w.console.error('highlight.js not detected!');
    }
    
}(window, document));
