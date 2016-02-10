(function (w) {
	'use strict';

	if (typeof w.hljs === 'undefined') {
		console.error('highlight.js not detected!');
	} else {
		w.hljs.initLineNumbersOnLoad = initLineNumbersOnLoad;
		w.hljs.lineNumbersBlock = lineNumbersBlock;
	}

	var defaultOptions = {
		withLinks: false
	};

	function initLineNumbersOnLoad (options) {
		options = options || defaultOptions;

		w.addEventListener('load', function () {
			try {
				var blocks = document.querySelectorAll('code.hljs');

				for (var i in blocks) {
					if (blocks.hasOwnProperty(i)) {
						lineNumbersBlock(blocks[i], {
							blockName: 'c' + i,
							withLinks: options.withLinks
						});
					}
				}
			} catch (e) {
				console.error('LineNumbers error: ', e);
			}
		});
	}

	function lineNumbersBlock (element, options) {
		if (typeof element !== 'object') return;
		if (!!options) {
			options.withLinks = options.withLinks || false;
			options.blockName = options.blockName || false;
		} else {
			options = defaultOptions;
			options.blockName = '';
		}

		var parent = element.parentNode;
		var lines = getCountLines(parent.textContent);

		if (lines > 1) {
			var l = '';
			for (var i = 0; i < lines; i++) {
				l +=  options.withLinks
					? getLineWithLink(i + 1, options.blockName)
					: (i + 1) + '\n';
			}

			var linesPanel = document.createElement('code');
			linesPanel.className = 'hljs hljs-line-numbers';
			linesPanel.style.float = 'left';
			linesPanel.innerHTML = l;

			parent.insertBefore(linesPanel, element);
		}
	}

	function getCountLines (text) {
		if (text.length === 0) return 0;

		var regExp = /\r\n|\r|\n/g;
		var lines = text.match(regExp);
		lines = lines ? lines.length : 0;

		if (!text[text.length - 1].match(regExp)) {
			lines += 1;
		}

		return lines;
	}

	function getLineWithLink (i, blockName) {
		var id = blockName + '_l' + i;
		return '<a href="#' + id + '" id="' + id + '">' + i + '</span>\n'
	}
}(window));