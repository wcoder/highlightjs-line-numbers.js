# highlightjs-line-numbers.js

Highlight.js line numbers plugin.

## Usage

Download plugin and include file after highlight.js:
```
<script src="highlight.min.js"></script>

<script src="highlightjs-line-numbers.js"></script>
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
```
hljs.initHighlightingOnLoad();

hljs.initLineNumbersOnLoad();
```

&copy; 2015 Pakalo Evgeniy | MIT License