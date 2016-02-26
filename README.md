# highlightjs-line-numbers.js [![version](http://img.shields.io/badge/release-v1.1.0-brightgreen.svg?style=flat)](https://github.com/wcoder/highlightjs-line-numbers.js/archive/master.zip)

Highlight.js line numbers plugin.

[DEMO](http://wcoder.github.io/highlightjs-line-numbers.js/) | [SСREENSHOTS](https://github.com/wcoder/highlightjs-line-numbers.js/issues/5)

## Install

#### Bower
```
bower install highlightjs-line-numbers.js
```

#### Npm
```
npm install highlightjs-line-numbers.js
```

## Usage

Download plugin and include file after highlight.js:
```html
<script src="path/to/highlight.min.js"></script>

<script src="path/to/highlightjs-line-numbers.min.js"></script>
```

Adding styles:
```css
.hljs-line-numbers {
	text-align: right;
	border-right: 1px solid #ccc;
	color: #999;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
```

Initialize plugin after highlight.js:
```js
hljs.initHighlightingOnLoad();

hljs.initLineNumbersOnLoad();
```

Here’s an equivalent way to calling `initLineNumbersOnLoad` using jQuery:
```js
$(document).ready(function() {
	$('code.hljs').each(function(i, block) {
		hljs.lineNumbersBlock(block);
	});
});
```

---
&copy; 2015 Yauheni Pakala | MIT License
