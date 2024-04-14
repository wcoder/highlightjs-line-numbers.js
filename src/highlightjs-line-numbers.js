// jshint multistr:true

import { install } from './core.js';

(function (w, d) {
    'use strict';

    if(hljs) {
        install(w,h,hljs);
    } else {
        w.console.error('highlight.js not detected!');        
    }
    
}(window, document));
