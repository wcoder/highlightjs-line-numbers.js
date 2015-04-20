# highlightjs-line-numbers.js

Highlight.js line numbers plugin.

## Usage

Download plugin and include file after highlight.js:
```html
<script src="highlight.min.js"></script>

<script src="dist/highlightjs-line-numbers.min.js"></script>
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

&copy; 2015 Yauheni Pakala | MIT License