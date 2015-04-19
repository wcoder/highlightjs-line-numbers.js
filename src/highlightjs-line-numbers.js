(function (w) {
	'use strict';

	if (typeof w.hljs === 'undefined') {
		console.error('highlight.js not detected!');
	} else {
		w.hljs.initLineNumbersOnLoad = initLineNumbersOnLoad;
		w.hljs.lineNumbersBlock = lineNumbersBlock;
	}

	function initLineNumbersOnLoad () {
		w.addEventListener('load', function () {
			try {
				var blocks = document.querySelectorAll('code.hljs');

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

		// fix for IE
		if (isIE()) lines += 1;

		if (lines > 1) {
			var l = '';
			for (var i = 0; i < lines; i++) {
				l += (i + 1) + '\n';
			}

			var linesPanel = document.createElement('code');
			linesPanel.className = 'hljs hljs-line-numbers';
			linesPanel.style.float = 'left';
			linesPanel.innerText = l;

			parent.insertBefore(linesPanel, element);
		}
	}

	function isIE(userAgent) {
		userAgent = userAgent || w.navigator.userAgent;
		return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;
	}
}(window));