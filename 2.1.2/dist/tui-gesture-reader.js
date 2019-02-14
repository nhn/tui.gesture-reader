/*!
 * tui-gesture-reader.js
 * @version 2.1.2
 * @author NHNEnt FE Development Lab <dl_javascript@nhnent.com>
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("tui-code-snippet"));
	else if(typeof define === 'function' && define.amd)
		define(["tui-code-snippet"], factory);
	else if(typeof exports === 'object')
		exports["GestureReader"] = factory(require("tui-code-snippet"));
	else
		root["tui"] = root["tui"] || {}, root["tui"]["GestureReader"] = factory((root["tui"] && root["tui"]["util"]));
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Discriminate type of touch event
	 * @author NHN Ent. FE dev Lab. <dl_javascript@nhnent.com>
	 */

	'use strict';

	var snippet = __webpack_require__(1);

	var Flick = __webpack_require__(2);
	var LongTab = __webpack_require__(3);
	var DoubleClick = __webpack_require__(4);

	var hostnameSent = false;

	/**
	 * To find out it's flick or click or nothing from event datas.
	 * @class Reader
	 * @param {object} options
	 *     @param {string} options.type - 'flick', 'longtab', 'dblclick'
	 *     @param {number} [options.clickTerm] - (DoubleClick) Available time distance between first and second click event.
	 *     @param {number} [options.maxDist] - (DoubleClick) Available movement distance
	 *     @param {number} [options.flickTime] - (Flick) If in this time, do not check move distance
	 *     @param {number} [options.flickRange] - (Flick) If not in time, compare move distance with flick ragne.
	 *     @param {number} [options.longTabTerm] - (LongTab) Term for checking longtab
	 *     @param {number} [options.minDist] - (Flick, LongTab) Minimum distance for check available movement.
	 *     @param {boolean} [options.usageStatistics=true] - Let us know the hostname. If you don't want to send the hostname, please set to false.
	 * @example
	 * var GestureReader = tui.GestureReader; // or require('tui-gesture-reader');
	 * var instance = new GestureReader({
	 *      type: 'flick'
	 * });
	 */
	var Reader = snippet.defineClass(/** @lends Reader.prototype */{
	    init: function(options) {
	        options = snippet.extend({
	            usageStatistics: true
	        }, options);

	        if (options.type === 'flick') {
	            snippet.extend(this, Flick);
	        } else if (options.type === 'longtab') {
	            snippet.extend(this, LongTab);
	        } else if (options.type === 'dblclick') {
	            snippet.extend(this, DoubleClick);
	        }
	        this.initialize(options);

	        if (options.usageStatistics) {
	            sendHostname();
	        }
	    }
	});

	/**
	 * send hostname
	 * @ignore
	 */
	function sendHostname() {
	    if (hostnameSent) {
	        return;
	    }
	    hostnameSent = true;

	    snippet.sendHostname('gesture-reader', 'UA-129987462-1');
	}

	module.exports = Reader;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Discriminate flick event
	 * @author NHN Ent. FE dev Lab. <dl_javascript@nhnent.com>
	 */

	'use strict';

	var snippet = __webpack_require__(1);

	/**
	 * Modules of discrimination flick
	 * @ignore
	 */
	var Flick = /** @lends Flick */{
	    /**
	     * Time is considered flick.
	     */
	    flickTime: 100,

	    /**
	     * Width is considered flick.
	     */
	    flickRange: 300,

	    /**
	     * Width is considered moving.
	     */
	    minDist: 10,

	    /**
	     * Reader type
	     */
	    type: 'flick',

	    /**
	     * Initialize Flicking
	     * @param {object} options - Flick options
	     *     @param {number} [options.flickTime] - Flick time, if in this time, do not check move distance
	     *     @param {number} [options.flickRange] - Flick range, if not in time, compare move distance with flick ragne.
	     *     @param {number} [options.minDist] - Minimum distance for check available movement.
	     */
	    initialize: function(options) {
	        this.flickTime = options.flickTime || this.flickTime;
	        this.flickRange = options.flickRange || this.flickRange;
	        this.minDist = options.minDist || this.minDist;
	    },

	    /**
	     * Pick event type from eventData
	     * @memberof Reader#
	     * @param {object} eventData - Event data
	     * @returns {object} Info of direction and flicking state
	     * @example
	     * instance.figure({
	     *      list : [{x: 0, y: 0}, {x: 100, y: 100}],
	     *      start: 0,
	     *      end: 50
	     * });
	     * => {
	     *      direction: 'SE',
	     *      isFlick: false
	     * }
	     */
	    figure: function(eventData) {
	        return {
	            direction: this.getDirection(eventData.list),
	            isFlick: this.isFlick(eventData)
	        };
	    },

	    /**
	     * Return direction figured out
	     * @memberof Reader#
	     * @param {array} list - eventPoint list
	     * @returns {string}
	     * @example
	     * instance.getDirection([{x: 0, y: 0}, {x: 100, y: 100}]);
	     * => 'SE';
	     */
	    getDirection: function(list) {
	        var first = list[0];
	        var final = list[list.length - 1];
	        var cardinalPoint = this.getCardinalPoints(first, final);
	        var res = this.getCloseCardinal(first, final, cardinalPoint);

	        return res;
	    },

	    /**
	     * Return cardinal points figured out
	     * @memberof Reader#
	     * @param {object} first - Start point
	     * @param {object} last - End point
	     * @returns {string} Direction info
	     * @example
	     * instance.getDirection({x: 0, y: 0}, {x: 100, y: 100});
	     * => 'SE';
	     */
	    getCardinalPoints: function(first, last) {
	        var verticalDist = first.y - last.y;
	        var horizonDist = first.x - last.x;
	        var NS = '';
	        var WE = '';

	        if (verticalDist < 0) {
	            NS = 'S';
	        } else if (verticalDist > 0) {
	            NS = 'N';
	        }

	        if (horizonDist < 0) {
	            WE = 'E';
	        } else if (horizonDist > 0) {
	            WE = 'W';
	        }

	        return NS + WE;
	    },

	    /**
	     * Return nearest four cardinal points
	     * @memberof Reader#
	     * @param {object} first - Start point
	     * @param {object} last - End point
	     * @param {string} cardinalPoint - CardinalPoint from getCardinalPoints
	     * @returns {string}
	     * @example
	     * instance.getDirection({x: 0, y: 50}, {x: 100, y: 100});
	     * => 'W';
	     */
	    getCloseCardinal: function(first, last, cardinalPoint) {
	        var slop = (last.y - first.y) / (last.x - first.x);
	        var direction;

	        if (slop < 0) {
	            direction = slop < -1 ? 'NS' : 'WE';
	        } else {
	            direction = slop > 1 ? 'NS' : 'WE';
	        }

	        direction = snippet.getDuplicatedChar(direction, cardinalPoint);

	        return direction;
	    },

	    /**
	     * Extract type of event
	     * @memberof Reader#
	     * @param {object} eventData - Event data
	     * @returns {string}
	     * @example
	     * instance.isFlick({
	     *      start: 1000,
	     *      end: 1100,
	     *      list: [
	     *            {
	     *                x: 10,
	     *                y: 10
	     *            },
	     *            {
	     *                x: 11,
	     *                y: 11
	     *            }
	     *      ]
	     * });
	     */
	    isFlick: function(eventData) {
	        var start = eventData.start;
	        var end = eventData.end;
	        var list = eventData.list;
	        var first = list[0];
	        var final = list[list.length - 1];
	        var timeDist = end - start;
	        var xDist = Math.abs(first.x - final.x);
	        var yDist = Math.abs(first.y - final.y);
	        var isFlick;

	        if (timeDist < this.flickTime || xDist > this.flickRange || yDist > this.flickRange) {
	            isFlick = true;
	        } else {
	            isFlick = false;
	        }

	        return isFlick;
	    }
	};

	module.exports = Flick;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Discriminate long tab event
	 * @author NHN Ent. FE dev Lab. <dl_javascript@nhnent.com>
	 */

	'use strict';

	var snippet = __webpack_require__(1);

	/**
	 * Modules of discrimination longtab
	 * @ignore
	 */
	var LongTab = /** @lends LongTab */{
	    /**
	     * Width is considered moving.
	     */
	    minDist: 10,

	    /**
	     * Tab timer for check double click
	     */
	    tabTimer: null,

	    /**
	     * Extracted event type
	     */
	    type: 'longtab',

	    /**
	     * Long tab term
	     */
	    longTabTerm: 600,

	    /**
	     * Set optionss
	     * @param {object} options - Longtab optionss
	     *      @param {number} [options.minDist] - Distance to check movement
	     *      @param {number} [options.longTabTerm] - Term for checking longtab
	     */
	    initialize: function(options) {
	        this.minDist = options.flickTime || this.minDist;
	        this.longTabTerm = options.longTabTerm || this.longTabTerm;
	    },

	    /**
	     * Start detect longtab roop, if touchstop event does not fire and position are same, run callback
	     * @param {object} pos - Position to start
	     */
	    startTab: function(pos) {
	        this.isLongtabed = false;
	        this.longTabPos = pos;
	        this.tabTimer = window.setTimeout(snippet.bind(function() {
	            this.isLongtabed = true;
	        }, this), this.longTabTerm);
	    },

	    /**
	     * Stop detect longtab roop.
	     * @memberof Reader#
	     * @param {object} pos - A position to end
	     * @param {function} callback - A callback function
	     * @returns {boolean} State of longtab
	     * @example
	     * instance.isLongTab({
	     *      x: 100,
	     *      y: 150
	     * }, function() {
	     *      console.log('asdf');
	     * });
	     */
	    isLongTab: function(pos, callback) {
	        var isSafeX,
	            isSafeY,
	            isLongtab = false;
	        if (this.isLongtabed) {
	            isSafeX = Math.abs(this.longTabPos.x - pos.x) < this.minDist;
	            isSafeY = Math.abs(this.longTabPos.y - pos.y) < this.minDist;
	            if (isSafeX && isSafeY) {
	                isLongtab = true;
	                if (callback) {
	                    callback();
	                }
	                this.stopTab();
	            }
	        }

	        return isLongtab;
	    },

	    /**
	     * Stop long tab check
	     */
	    stopTab: function() {
	        this.isLongtabed = false;
	        this.resetTimer();
	    },

	    /**
	     * Clear clickTimer
	     */
	    resetTimer: function() {
	        window.clearTimeout(this.tabTimer);
	        this.tabTimer = null;
	    }
	};

	module.exports = LongTab;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Discriminate doubleclick event
	 * @author NHN Ent. FE dev Lab. <dl_javascript@nhnent.com>
	 */

	'use strict';

	var snippet = __webpack_require__(1);

	/**
	 * Modules of discrimination double click
	 * @ignore
	 */
	var DoubleClick = {
	    /**
	     * Timer for check click twice in time
	     */
	    clickTimer: null,

	    /**
	     * The type of reader
	     */
	    type: 'dblclick',

	    /**
	     * Maximum safe distance
	     */
	    maxDist: 10,

	    /**
	     * Available double click term
	     */
	    clickTerm: 200,

	    /**
	     * First click timestamp
	     */
	    startTime: null,

	    /**
	     * Initailize DoubleClick Reader
	     * @param {object} options - Click options
	     *     @param {number} [options.clickTerm] - Available time distance between first and second click event.
	     *     @param {number} [options.maxDist] - Available movement distance
	     */
	    initialize: function(options) {
	        this.clickTerm = options.clickTerm || this.clickTerm;
	        this.maxDist = options.maxDist || this.maxDist;
	    },

	    /**
	     * Check click or double click
	     * @memberof Reader#
	     * @param {object} pos - Distance from mousedown/touchstart to mouseup/touchend
	     * @returns {*}
	     * @example
	     * instance.isDoubleClick({
	     *      x: 10,
	     *      y: 10
	     * });
	     */
	    isDoubleClick: function(pos) {
	        var time = new Date();
	        var start = this.startTime;
	        var isDoubleClick;

	        if (start && this.isAvailableZone(pos)) {
	            this.clearTimer();
	            this.startTime = null;
	            isDoubleClick = true;
	        } else {
	            this.setTimer();
	            this.pos = pos;
	            this.startTime = time;
	            isDoubleClick = false;
	        }

	        return isDoubleClick;
	    },

	    /**
	     * Compare with saved position to safe zone
	     * @memberof Reader#
	     * @param {object} pos - Position to compare with saved position
	     * @returns {boolean} State of available zone
	     * @example
	     * instance.isAvailableZone({
	     *      x: 10,
	     *      y: 10
	     * });
	     */
	    isAvailableZone: function(pos) {
	        var isAvailX = Math.abs(this.pos.x - pos.x) < this.maxDist;
	        var isAvailY = Math.abs(this.pos.y - pos.y) < this.maxDist;

	        return isAvailX && isAvailY;
	    },

	    /**
	     * Set timer to check click term
	     */
	    setTimer: function() {
	        this.clickTimer = window.setTimeout(snippet.bind(function() {
	            this.startTime = null;
	        }, this), this.clickTerm);
	    },

	    /**
	     * Clear timer
	     */
	    clearTimer: function() {
	        window.clearTimeout(this.clickTimer);
	    }
	};

	module.exports = DoubleClick;


/***/ })
/******/ ])
});
;