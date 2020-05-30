# highlightjs-line-numbers.js [![npm](https://img.shields.io/npm/v/highlightjs-line-numbers.js.svg)](https://www.npmjs.com/package/highlightjs-line-numbers.js) ![npm](https://img.shields.io/npm/dw/highlightjs-line-numbers.js.svg)

Highlight.js line numbers plugin.

[DEMO](http://wcoder.github.io/highlightjs-line-numbers.js/) | [SСREENSHOTS](https://github.com/wcoder/highlightjs-line-numbers.js/issues/5)

## Install

### Bower

```
bower install highlightjs-line-numbers.js
```

### Npm

```
npm install highlightjs-line-numbers.js
```

#### Getting the library from CDN

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/2.8.0/highlightjs-line-numbers.min.js"></script>
```

```html
<script src="//cdn.jsdelivr.net/npm/highlightjs-line-numbers.js@2.8.0/dist/highlightjs-line-numbers.min.js"></script>
```

## Usage

Download plugin and include file after highlight.js:

```html
<script src="path/to/highlight.min.js"></script>

<script src="path/to/highlightjs-line-numbers.min.js"></script>
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

If your needs cool style, add styles by taste:

```css
/* for block of numbers */
.hljs-ln-numbers {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    text-align: center;
    color: #ccc;
    border-right: 1px solid #CCC;
    vertical-align: top;
    padding-right: 5px;

    /* your custom style here */
}

/* for block of code */
.hljs-ln-code {
    padding-left: 10px;
}
```

## Options

After version 2.1 plugin has optional parameter `options` - for custom setup.

version | name       | type    | default value | description
--------|------------|---------|---------------|-----------------------
v2.1    | singleLine | boolean | false         | enable plugin for code block with one line
v2.8    | startFrom  | int     | 1             | [Start numbering from a custom value](startFrom)

### Examples of using

```js
hljs.initLineNumbersOnLoad({
    singleLine: true
});
```

```js
hljs.lineNumbersBlock(myCodeBlock, myOptions);
```

```js
hljs.lineNumbersValue(myCodeBlock, myOptions);
```

### startFrom

If you want numbering to start from some other value than `1`, you can specify a _numbering offset_, in one of the following ways:

- Specifying desired offset in `hljs.lineNumbersBlock()` call, as in:

```js
hljs.lineNumbersBlock(myCodeBlock, {
    startFrom: 10
});
```

- Specifying the desired offset in `data-ln-start-from` attribute of `code` element, as in:

```html
<pre>
    <code data-ln-start-from="10">
    ...
    </code>
</pre>
```

In both cases numbering offset will be `10`, meaning that the numbering will start from `10`.

## Skipping some blocks

(Applies to `hljs.initLineNumbersOnLoad()` initialization only.)

If you want to skip some of your `code` blocks (to leave them unnumbered), you can mark them with `.nohljsln` class.

## CSS selectors

You may need to select some lines of code after rendering. For instance, you may want
to highlight a range of lines, selected by users, by changing their background color.
The CSS selectors below can be used to perform these selection operations.

CSS selector                             |  description
-----------------------------------------|-----------------------
`.hljs-ln-line`                          | Select all lines, including line numbers
`.hljs-ln-numbers`                       | Select all line numbers, excluding lines of code
`.hljs-ln-code`                          | Select all lines of code, excluding line numbers
`.hljs-ln-line[data-line-number="i"]`    | Select the ith line, including line number
`.hljs-ln-numbers[data-line-number="i"]` | Select the ith line number, excluding the line of code
`.hljs-ln-code[data-line-number="i"]`    | Select the ith line of code, excluding the line number
---
&copy; 2020 Yauheni Pakala and [Community](https://github.com/wcoder/highlightjs-line-numbers.js/graphs/contributors) | MIT License
