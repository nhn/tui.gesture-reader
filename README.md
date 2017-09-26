# GestureReader
Distinguish gesture with event object and position points

## Feature
* Create reader to distinguish each event
* Flick : Distinguish flick or not
	* N/E/S/W
	* NE/ES/SW/WN
	* isFlick
* LongTab : Distinguish logTab or not
* DoubleClick : Distinguish double click or not

## Documentation
* **API** : [https://nhnent.github.io/tui.gesture-reader/latest](https://nhnent.github.io/tui.gesture-reader/latest)
* **Tutorial** : [https://github.com/nhnent/tui.gesture-reader/wiki](https://github.com/nhnent/tui.gesture-reader/wiki)
* **Example** :
[https://nhnent.github.io/tui.gesture-reader/latest/tutorial-example01-basic.html](https://nhnent.github.io/tui.gesture-reader/latest/tutorial-example01-basic.html)

## Dependency
* [tui-code-snippet](https://github.com/nhnent/tui.code-snippet) >=1.2.5

## Test Environment
### PC
* IE8~11
* Edge
* Chrome
* Firefox
* Safari

## Usage
### Use `npm`

Install the latest version using `npm` command:

```
$ npm install tui-gesture-reader --save
```

or want to install the each version:

```
$ npm install tui-gesture-reader@<version> --save
```

To access as module format in your code:

```javascript
var GestureReader = require('tui-gesture-reader');
var instance = new GestureReader(...);
```

### Use `bower`
Install the latest version using `bower` command:

```
$ bower install tui-gesture-reader
```

or want to install the each version:

```
$ bower install tui-gesture-reader#<tag>
```

To access as namespace format in your code:

```javascript
var instance = new tui.GestureReader(...);
```

### Download
* [Download bundle files from `dist` folder](https://github.com/nhnent/tui.gesture-reader/tree/production/dist)
* [Download all sources for each version](https://github.com/nhnent/tui.gesture-reader/releases)

## License
[MIT LICENSE](https://github.com/nhnent/tui.gesture-reader/blob/master/LICENSE)
