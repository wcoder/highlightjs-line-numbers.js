(function (w) {
	'use strict';

	if (typeof w.hljs == undefined) {
		console.error('highlight.js not detected!');
	} else {
		w.hljs.initLineNumbersOnLoad = initLineNumbersOnLoad;
		w.hljs.lineNumbersBlock = lineNumbersBlock;
	}


	function initLineNumbersOnLoad () {
		w.addEventListener('load', function () {
			try {
				var blocks = document.getElementsByClassName('hljs');

				for (var i in blocks) {
					if (blocks.hasOwnProperty(i)) {
						lineNumbersBlock(blocks[i]);
					}
				}
			} catch (e) {
				console.error('LineNumbers error: ', e);
			}
		});
	}

	function lineNumbersBlock (element) {
		if (typeof element !== 'object') return;

		var parent = element.parentNode;
		var lines = parent.outerText.match(/\n/g);

		lines = lines ? lines.length : 0;
		if (lines > 1) {
			var l = '';
			for (var i = 0; i < lines; i++) {
				l += (i+1) + '\n';
			}

			var linesPanel = document.createElement('code');
			linesPanel.className = 'hljs-line-numbers';
			linesPanel.innerText = l;

			parent.insertBefore(linesPanel, element);
		}
	}
}(window));