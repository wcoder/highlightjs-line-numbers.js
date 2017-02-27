(function (w) {
	'use strict';

	if (typeof w.hljs === 'undefined') {
		console.error('highlight.js not detected!');
	} else {
		w.hljs.initLineNumbersOnLoad = initLineNumbersOnLoad;
		w.hljs.lineNumbersBlock = lineNumbersBlock;
	}

	function initLineNumbersOnLoad () {
		if (document.readyState === 'complete') {
			documentReady();
		} else {
			w.addEventListener('DOMContentLoaded', documentReady);
		}
	}

	function documentReady () {
		try {
			var blocks = document.querySelectorAll('code.hljs');

			for (var i in blocks) {
				if (blocks.hasOwnProperty(i)) {
					lineNumbersBlock(blocks[i], true);
				}
			}
      
		$( window ).resize(function() {
			for (var i in blocks) {
				if (blocks.hasOwnProperty(i)) {
					lineNumbersBlock(blocks[i], false);
				}
			}
		});
		} catch (e) {
			console.error('LineNumbers error: ', e);
		}
	}

	//Add a second parameter to know if triggered by resizing
	function lineNumbersBlock (element, resize) {
		if (typeof element !== 'object') return;

		var parent = element.parentNode;
		var lines = getCountLines(element, resize);
		if (lines > 1) {
			var l = '';
			$('.hljs-line').each(function(i) {
			  l += (i + 1) + '\n';
			  //add a empty line if word wrap is detected (if div's height if > than the line-height)
			  var height = Math.round(parseInt($(this).height())/parseInt($(this).css('line-height')));
			  if( height > 1){
				l += '\n'.repeat(height-1);
			  }
			});
			$('.hljs-line-numbers').remove();
			var linesPanel = document.createElement('code');
			linesPanel.className = 'hljs hljs-line-numbers';
			linesPanel.style.float = 'left';
			linesPanel.textContent = l;

			parent.insertBefore(linesPanel, element);
		}
	}

	function getCountLines(el, resize) {
  	var text = el.innerHTML;
		if (text.length === 0) return 0;

		var regExp = /\r\n|\r|\n/g;
		var lines = text.match(regExp);
		lines = lines ? lines.length : 0;
		if (!text[text.length - 1].match(regExp)) {
			lines += 1;
		}
		// Don't wrap in div if resize, we have already it
		if(resize === true){
			//wrap each line in a div
			var textLines = text.split(regExp);
			var textResult = "";
			textLines.forEach(function(element) {
				textResult += "<div class='hljs-line'>"+element+"</div>\n";
			});
			el.innerHTML = textResult;
		}
		return lines;
	}
}(window));
