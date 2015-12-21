(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
tui.util.defineNamespace('tui.component.Gesture.Reader', require('./src/js/reader'));
},{"./src/js/reader":5}],2:[function(require,module,exports){
/**
 * @fileoverview discriminate doubleclick event
 * @author NHN entertainment FE dev team. Jein Yi<jein.yi@nhnent.com>
 */

/**
 * Modules of Discrimination double click
 * @namespace DoubleClick
 */
var DoubleClick = /**@lends DoubleClick */{
    /**
     * Timer for check click twice in time
     */
    clickTimer: null,
    /**
     * The type of reader
     */
    type: 'dbclick',
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
     * @param {object} option
     *  @param {number} [option.clickTerm] Available time distance between first and second click event.
     *  @param {number} [option.maxDist] Available movement distance
     */
    initialize: function(option) {
        this.clickTerm = option.clickTerm || this.clickTerm;
        this.maxDist = option.maxDist || this.maxDist;
    },

    /**
     * Check click or double click
     * @api
     * @param {object} pos distance from mousedown/touchstart to mouseup/touchend
     * @private
     * @returns {*}
     * @example
     * gestureReader.isDoubleClick({
     *      x: 10,
     *      y: 10
     * });
     */
    isDoubleClick: function(pos) {
        var time = new Date(),
            start = this.startTime,
            isDoubleClick;
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
     * @api
     * @param {object} pos Position to compare with saved position
     * @example
     * gestureReader.isAvailableZone({
     *      x: 10,
     *      y: 10
     * });
     * => true
     */
    isAvailableZone: function(pos) {
        var isAvailX = Math.abs(this.pos.x - pos.x) < this.maxDist,
            isAvailY = Math.abs(this.pos.y - pos.y) < this.maxDist;

        return isAvailX && isAvailY;
    },

    /**
     * Set timer to check click term
     */
    setTimer: function() {
        this.clickTimer = window.setTimeout(tui.util.bind(function() {
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

},{}],3:[function(require,module,exports){
/**
 * @fileoverview discriminate flick event
 * @author NHN entertainment FE dev team. Jein Yi<jein.yi@nhnent.com>
 */

/**
 * Modules of Discrimination flick
 * @namespace Flick
 */
var Flick = /** @lends Flick */{
    /**
     * time is considered flick.
     */
    flickTime: 100,
    /**
     * width is considered flick.
     */
    flickRange: 300,
    /**
     * width is considered moving.
     */
    minDist: 10,
    /**
     * Reader type
     */
    type: 'flick',

    /**
     * Initialize Flicking
     * @param {object} option Flick options
     *  @param {number} [option.flickTime] Flick time, if in this time, do not check move distance
     *  @param {number} [option.flickRange] Flick range, if not in time, compare move distance with flick ragne.
     *  @param {number} [option.minDist] Minimum distance for check available movement.
     */
    initialize: function(option) {
        this.flickTime = option.flickTime || this.flickTime;
        this.flickRange = option.flickRange || this.flickRange;
        this.minDist = option.minDist || this.minDist;
    },

    /**
     * pick event type from eventData
     * @api
     * @param {object} eventData event Data
     * @return {object}
     * @example gestureReader.figure({
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
            direction : this.getDirection(eventData.list),
            isFlick: this.isFlick(eventData)
        }
    },

    /**
     * return direction figured out
     * @api
     * @param {array} list eventPoint List
     * @returns {string}
     * @example gestureReader.getDirection([{x: 0, y: 0}, {x: 100, y: 100}]);
     * => 'SE';
     */
    getDirection: function(list) {
        var first = list[0],
            final = list[list.length-1],
            cardinalPoint = this.getCardinalPoints(first, final),
            res = this.getCloseCardinal(first, final, cardinalPoint);

        return res;
    },
    /**
     * return cardinal points figured out
     * @api
     * @param {object} first start point
     * @param {object} last end point
     * @example gestureReader.getDirection({x: 0, y: 0}, {x: 100, y: 100});
     * => 'SE';
     */
    getCardinalPoints: function(first, last) {
        var verticalDist = first.y - last.y,
            horizonDist = first.x - last.x,
            NS = '',
            WE = '';

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

        return NS+WE;
    },

    /**
     * return nearest four cardinal points
     * @api
     * @param {object} first start point
     * @param {object} last end point
     * @param {string} cardinalPoint cardinalPoint from getCardinalPoints
     * @returns {string}
     * @example gestureReader.getDirection({x: 0, y: 50}, {x: 100, y: 100});
     * => 'W';
     */
    getCloseCardinal: function(first, last, cardinalPoint) {
        var slop = (last.y - first.y) / (last.x - first.x),
            direction;
        if (slop < 0) {
            direction = slop < -1 ? 'NS' : 'WE';
        } else {
            direction = slop > 1 ? 'NS' : 'WE';
        }

        direction = tui.util.getDuplicatedChar(direction, cardinalPoint);
        return direction;
    },

    /**
     * extract type of event
     * @api
     * @param {object} eventData event data
     * @returns {string}
     * @example
     * reader.isFlick({
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
        var start = eventData.start,
            end = eventData.end,
            list = eventData.list,
            first = list[0],
            final = list[list.length - 1],
            timeDist = end - start,
            xDist = Math.abs(first.x - final.x),
            yDist = Math.abs(first.y - final.y),
            isFlick;

        if (timeDist < this.flickTime || xDist > this.flickRange || yDist > this.flickRange) {
            isFlick = true;
        } else {
            isFlick = false;
        }

        return isFlick;
    }
};

module.exports = Flick;

},{}],4:[function(require,module,exports){
/**
 * @fileoverview discriminate long tab event
 * @author NHN entertainment FE dev team. Jein Yi<jein.yi@nhnent.com>
 */

/**
 * Modules of Discrimination longtab
 * @namespace LongTab
 */
var LongTab = /** @lends LongTab */{
    /**
     * width is considered moving.
     */
    minDist: 10,
    /**
     * tab timer for check double click
     */
    tabTimer: null,
    /**
     * extracted event type
     */
    type: 'longtab',
    /**
     * long tab term
     */
    longTabTerm: 600,
    /**
     * set options
     * @param {object} option
     *      @param {number} [option.minDist] distance to check movement
     *      @param {number} [option.longTabTerm] Term for checking longtab
     */
    initialize: function(option) {
        this.minDist = option.flickTime || this.minDist;
        this.longTabTerm = option.longTabTerm || this.longTabTerm;
    },

    /**
     * Start detect longtab roop, If touchstop event does not fire and position are same, run callback
     * @param {object} pos position to start
     */
    startTab: function(pos) {
        this.isLongtabed = false;
        this.longTabPos = pos;
        this.tabTimer = window.setTimeout(tui.util.bind(function() {
            this.isLongtabed = true;
        }, this), this.longTabTerm);
    },

    /**
     * Stop detect longtab roop.
     * @api
     * @param {object} pos A position to end
     * @param {function} callback A callback function
     * @example
     * gestureReader.isLongTab({
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
     * clear clickTimer
     */
    resetTimer: function() {
        window.clearTimeout(this.tabTimer);
        this.tabTimer = null;
    }
};

module.exports = LongTab;

},{}],5:[function(require,module,exports){
/**
 * @fileoverview discriminate type of touch event
 * @author NHN entertainment FE dev team. Jein Yi<jein.yi@nhnent.com>
 */


var Flick = require('./flick');
var LongTab = require('./longtab');
var DoubleClick = require('./doubleClick');

/**
 * To find out it's flick or click or nothing from event datas.
 * @namespace Reader
 * @example
 * var reader = new tui.component.Gesture.Reader({
 *      type : 'flick' || 'longtab' || 'doubleclick'
 * });
 */
var Reader = tui.util.defineClass(/** @lends Reader.prototype */{
    /**
     * set options
     * @param {object} option
     */
    init: function(option) {
        if (option.type === 'flick') {
            tui.util.extend(this, Flick);
        } else if (option.type === 'longtab') {
            tui.util.extend(this, LongTab);
        } else if (option.type === 'dbclick') {
            tui.util.extend(this, DoubleClick);
        }
        this.initialize(option);
    }
});

module.exports = Reader;

},{"./doubleClick":2,"./flick":3,"./longtab":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9qcy9kb3VibGVDbGljay5qcyIsInNyYy9qcy9mbGljay5qcyIsInNyYy9qcy9sb25ndGFiLmpzIiwic3JjL2pzL3JlYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInR1aS51dGlsLmRlZmluZU5hbWVzcGFjZSgndHVpLmNvbXBvbmVudC5HZXN0dXJlLlJlYWRlcicsIHJlcXVpcmUoJy4vc3JjL2pzL3JlYWRlcicpKTsiLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgZGlzY3JpbWluYXRlIGRvdWJsZWNsaWNrIGV2ZW50XG4gKiBAYXV0aG9yIE5ITiBlbnRlcnRhaW5tZW50IEZFIGRldiB0ZWFtLiBKZWluIFlpPGplaW4ueWlAbmhuZW50LmNvbT5cbiAqL1xuXG4vKipcbiAqIE1vZHVsZXMgb2YgRGlzY3JpbWluYXRpb24gZG91YmxlIGNsaWNrXG4gKiBAbmFtZXNwYWNlIERvdWJsZUNsaWNrXG4gKi9cbnZhciBEb3VibGVDbGljayA9IC8qKkBsZW5kcyBEb3VibGVDbGljayAqL3tcbiAgICAvKipcbiAgICAgKiBUaW1lciBmb3IgY2hlY2sgY2xpY2sgdHdpY2UgaW4gdGltZVxuICAgICAqL1xuICAgIGNsaWNrVGltZXI6IG51bGwsXG4gICAgLyoqXG4gICAgICogVGhlIHR5cGUgb2YgcmVhZGVyXG4gICAgICovXG4gICAgdHlwZTogJ2RiY2xpY2snLFxuICAgIC8qKlxuICAgICAqIE1heGltdW0gc2FmZSBkaXN0YW5jZVxuICAgICAqL1xuICAgIG1heERpc3Q6IDEwLFxuICAgIC8qKlxuICAgICAqIEF2YWlsYWJsZSBkb3VibGUgY2xpY2sgdGVybVxuICAgICAqL1xuICAgIGNsaWNrVGVybTogMjAwLFxuICAgIC8qKlxuICAgICAqIEZpcnN0IGNsaWNrIHRpbWVzdGFtcFxuICAgICAqL1xuICAgIHN0YXJ0VGltZTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIEluaXRhaWxpemUgRG91YmxlQ2xpY2sgUmVhZGVyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvblxuICAgICAqICBAcGFyYW0ge251bWJlcn0gW29wdGlvbi5jbGlja1Rlcm1dIEF2YWlsYWJsZSB0aW1lIGRpc3RhbmNlIGJldHdlZW4gZmlyc3QgYW5kIHNlY29uZCBjbGljayBldmVudC5cbiAgICAgKiAgQHBhcmFtIHtudW1iZXJ9IFtvcHRpb24ubWF4RGlzdF0gQXZhaWxhYmxlIG1vdmVtZW50IGRpc3RhbmNlXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHRoaXMuY2xpY2tUZXJtID0gb3B0aW9uLmNsaWNrVGVybSB8fCB0aGlzLmNsaWNrVGVybTtcbiAgICAgICAgdGhpcy5tYXhEaXN0ID0gb3B0aW9uLm1heERpc3QgfHwgdGhpcy5tYXhEaXN0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBjbGljayBvciBkb3VibGUgY2xpY2tcbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBvcyBkaXN0YW5jZSBmcm9tIG1vdXNlZG93bi90b3VjaHN0YXJ0IHRvIG1vdXNldXAvdG91Y2hlbmRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogZ2VzdHVyZVJlYWRlci5pc0RvdWJsZUNsaWNrKHtcbiAgICAgKiAgICAgIHg6IDEwLFxuICAgICAqICAgICAgeTogMTBcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICBpc0RvdWJsZUNsaWNrOiBmdW5jdGlvbihwb3MpIHtcbiAgICAgICAgdmFyIHRpbWUgPSBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLnN0YXJ0VGltZSxcbiAgICAgICAgICAgIGlzRG91YmxlQ2xpY2s7XG4gICAgICAgIGlmIChzdGFydCAmJiB0aGlzLmlzQXZhaWxhYmxlWm9uZShwb3MpKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbnVsbDtcbiAgICAgICAgICAgIGlzRG91YmxlQ2xpY2sgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRUaW1lcigpO1xuICAgICAgICAgICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHRpbWU7XG4gICAgICAgICAgICBpc0RvdWJsZUNsaWNrID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzRG91YmxlQ2xpY2s7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvbXBhcmUgd2l0aCBzYXZlZCBwb3NpdGlvbiB0byBzYWZlIHpvbmVcbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBvcyBQb3NpdGlvbiB0byBjb21wYXJlIHdpdGggc2F2ZWQgcG9zaXRpb25cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGdlc3R1cmVSZWFkZXIuaXNBdmFpbGFibGVab25lKHtcbiAgICAgKiAgICAgIHg6IDEwLFxuICAgICAqICAgICAgeTogMTBcbiAgICAgKiB9KTtcbiAgICAgKiA9PiB0cnVlXG4gICAgICovXG4gICAgaXNBdmFpbGFibGVab25lOiBmdW5jdGlvbihwb3MpIHtcbiAgICAgICAgdmFyIGlzQXZhaWxYID0gTWF0aC5hYnModGhpcy5wb3MueCAtIHBvcy54KSA8IHRoaXMubWF4RGlzdCxcbiAgICAgICAgICAgIGlzQXZhaWxZID0gTWF0aC5hYnModGhpcy5wb3MueSAtIHBvcy55KSA8IHRoaXMubWF4RGlzdDtcblxuICAgICAgICByZXR1cm4gaXNBdmFpbFggJiYgaXNBdmFpbFk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCB0aW1lciB0byBjaGVjayBjbGljayB0ZXJtXG4gICAgICovXG4gICAgc2V0VGltZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNsaWNrVGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCh0dWkudXRpbC5iaW5kKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBudWxsO1xuICAgICAgICB9LCB0aGlzKSwgdGhpcy5jbGlja1Rlcm0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDbGVhciB0aW1lclxuICAgICAqL1xuICAgIGNsZWFyVGltZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuY2xpY2tUaW1lcik7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEb3VibGVDbGljaztcbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBkaXNjcmltaW5hdGUgZmxpY2sgZXZlbnRcbiAqIEBhdXRob3IgTkhOIGVudGVydGFpbm1lbnQgRkUgZGV2IHRlYW0uIEplaW4gWWk8amVpbi55aUBuaG5lbnQuY29tPlxuICovXG5cbi8qKlxuICogTW9kdWxlcyBvZiBEaXNjcmltaW5hdGlvbiBmbGlja1xuICogQG5hbWVzcGFjZSBGbGlja1xuICovXG52YXIgRmxpY2sgPSAvKiogQGxlbmRzIEZsaWNrICove1xuICAgIC8qKlxuICAgICAqIHRpbWUgaXMgY29uc2lkZXJlZCBmbGljay5cbiAgICAgKi9cbiAgICBmbGlja1RpbWU6IDEwMCxcbiAgICAvKipcbiAgICAgKiB3aWR0aCBpcyBjb25zaWRlcmVkIGZsaWNrLlxuICAgICAqL1xuICAgIGZsaWNrUmFuZ2U6IDMwMCxcbiAgICAvKipcbiAgICAgKiB3aWR0aCBpcyBjb25zaWRlcmVkIG1vdmluZy5cbiAgICAgKi9cbiAgICBtaW5EaXN0OiAxMCxcbiAgICAvKipcbiAgICAgKiBSZWFkZXIgdHlwZVxuICAgICAqL1xuICAgIHR5cGU6ICdmbGljaycsXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIEZsaWNraW5nXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbiBGbGljayBvcHRpb25zXG4gICAgICogIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9uLmZsaWNrVGltZV0gRmxpY2sgdGltZSwgaWYgaW4gdGhpcyB0aW1lLCBkbyBub3QgY2hlY2sgbW92ZSBkaXN0YW5jZVxuICAgICAqICBAcGFyYW0ge251bWJlcn0gW29wdGlvbi5mbGlja1JhbmdlXSBGbGljayByYW5nZSwgaWYgbm90IGluIHRpbWUsIGNvbXBhcmUgbW92ZSBkaXN0YW5jZSB3aXRoIGZsaWNrIHJhZ25lLlxuICAgICAqICBAcGFyYW0ge251bWJlcn0gW29wdGlvbi5taW5EaXN0XSBNaW5pbXVtIGRpc3RhbmNlIGZvciBjaGVjayBhdmFpbGFibGUgbW92ZW1lbnQuXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHRoaXMuZmxpY2tUaW1lID0gb3B0aW9uLmZsaWNrVGltZSB8fCB0aGlzLmZsaWNrVGltZTtcbiAgICAgICAgdGhpcy5mbGlja1JhbmdlID0gb3B0aW9uLmZsaWNrUmFuZ2UgfHwgdGhpcy5mbGlja1JhbmdlO1xuICAgICAgICB0aGlzLm1pbkRpc3QgPSBvcHRpb24ubWluRGlzdCB8fCB0aGlzLm1pbkRpc3Q7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHBpY2sgZXZlbnQgdHlwZSBmcm9tIGV2ZW50RGF0YVxuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnREYXRhIGV2ZW50IERhdGFcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICogQGV4YW1wbGUgZ2VzdHVyZVJlYWRlci5maWd1cmUoe1xuICAgICAqICAgICAgbGlzdCA6IFt7eDogMCwgeTogMH0sIHt4OiAxMDAsIHk6IDEwMH1dLFxuICAgICAqICAgICAgc3RhcnQ6IDAsXG4gICAgICogICAgICBlbmQ6IDUwXG4gICAgICogfSk7XG4gICAgICogPT4ge1xuICAgICAqICAgICAgZGlyZWN0aW9uOiAnU0UnLFxuICAgICAqICAgICAgaXNGbGljazogZmFsc2VcbiAgICAgKiB9XG4gICAgICovXG4gICAgZmlndXJlOiBmdW5jdGlvbihldmVudERhdGEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA6IHRoaXMuZ2V0RGlyZWN0aW9uKGV2ZW50RGF0YS5saXN0KSxcbiAgICAgICAgICAgIGlzRmxpY2s6IHRoaXMuaXNGbGljayhldmVudERhdGEpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGRpcmVjdGlvbiBmaWd1cmVkIG91dFxuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBsaXN0IGV2ZW50UG9pbnQgTGlzdFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQGV4YW1wbGUgZ2VzdHVyZVJlYWRlci5nZXREaXJlY3Rpb24oW3t4OiAwLCB5OiAwfSwge3g6IDEwMCwgeTogMTAwfV0pO1xuICAgICAqID0+ICdTRSc7XG4gICAgICovXG4gICAgZ2V0RGlyZWN0aW9uOiBmdW5jdGlvbihsaXN0KSB7XG4gICAgICAgIHZhciBmaXJzdCA9IGxpc3RbMF0sXG4gICAgICAgICAgICBmaW5hbCA9IGxpc3RbbGlzdC5sZW5ndGgtMV0sXG4gICAgICAgICAgICBjYXJkaW5hbFBvaW50ID0gdGhpcy5nZXRDYXJkaW5hbFBvaW50cyhmaXJzdCwgZmluYWwpLFxuICAgICAgICAgICAgcmVzID0gdGhpcy5nZXRDbG9zZUNhcmRpbmFsKGZpcnN0LCBmaW5hbCwgY2FyZGluYWxQb2ludCk7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIHJldHVybiBjYXJkaW5hbCBwb2ludHMgZmlndXJlZCBvdXRcbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGZpcnN0IHN0YXJ0IHBvaW50XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGxhc3QgZW5kIHBvaW50XG4gICAgICogQGV4YW1wbGUgZ2VzdHVyZVJlYWRlci5nZXREaXJlY3Rpb24oe3g6IDAsIHk6IDB9LCB7eDogMTAwLCB5OiAxMDB9KTtcbiAgICAgKiA9PiAnU0UnO1xuICAgICAqL1xuICAgIGdldENhcmRpbmFsUG9pbnRzOiBmdW5jdGlvbihmaXJzdCwgbGFzdCkge1xuICAgICAgICB2YXIgdmVydGljYWxEaXN0ID0gZmlyc3QueSAtIGxhc3QueSxcbiAgICAgICAgICAgIGhvcml6b25EaXN0ID0gZmlyc3QueCAtIGxhc3QueCxcbiAgICAgICAgICAgIE5TID0gJycsXG4gICAgICAgICAgICBXRSA9ICcnO1xuXG4gICAgICAgIGlmICh2ZXJ0aWNhbERpc3QgPCAwKSB7XG4gICAgICAgICAgICBOUyA9ICdTJztcbiAgICAgICAgfSBlbHNlIGlmICh2ZXJ0aWNhbERpc3QgPiAwKSB7XG4gICAgICAgICAgICBOUyA9ICdOJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChob3Jpem9uRGlzdCA8IDApIHtcbiAgICAgICAgICAgIFdFID0gJ0UnO1xuICAgICAgICB9IGVsc2UgaWYgKGhvcml6b25EaXN0ID4gMCkge1xuICAgICAgICAgICAgV0UgPSAnVyc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gTlMrV0U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJldHVybiBuZWFyZXN0IGZvdXIgY2FyZGluYWwgcG9pbnRzXG4gICAgICogQGFwaVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmaXJzdCBzdGFydCBwb2ludFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsYXN0IGVuZCBwb2ludFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjYXJkaW5hbFBvaW50IGNhcmRpbmFsUG9pbnQgZnJvbSBnZXRDYXJkaW5hbFBvaW50c1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQGV4YW1wbGUgZ2VzdHVyZVJlYWRlci5nZXREaXJlY3Rpb24oe3g6IDAsIHk6IDUwfSwge3g6IDEwMCwgeTogMTAwfSk7XG4gICAgICogPT4gJ1cnO1xuICAgICAqL1xuICAgIGdldENsb3NlQ2FyZGluYWw6IGZ1bmN0aW9uKGZpcnN0LCBsYXN0LCBjYXJkaW5hbFBvaW50KSB7XG4gICAgICAgIHZhciBzbG9wID0gKGxhc3QueSAtIGZpcnN0LnkpIC8gKGxhc3QueCAtIGZpcnN0LngpLFxuICAgICAgICAgICAgZGlyZWN0aW9uO1xuICAgICAgICBpZiAoc2xvcCA8IDApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IHNsb3AgPCAtMSA/ICdOUycgOiAnV0UnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gc2xvcCA+IDEgPyAnTlMnIDogJ1dFJztcbiAgICAgICAgfVxuXG4gICAgICAgIGRpcmVjdGlvbiA9IHR1aS51dGlsLmdldER1cGxpY2F0ZWRDaGFyKGRpcmVjdGlvbiwgY2FyZGluYWxQb2ludCk7XG4gICAgICAgIHJldHVybiBkaXJlY3Rpb247XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGV4dHJhY3QgdHlwZSBvZiBldmVudFxuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnREYXRhIGV2ZW50IGRhdGFcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogcmVhZGVyLmlzRmxpY2soe1xuICAgICAqICAgICAgc3RhcnQ6IDEwMDAsXG4gICAgICogICAgICBlbmQ6IDExMDAsXG4gICAgICogICAgICBsaXN0OiBbXG4gICAgICogICAgICAgICAgICB7XG4gICAgICogICAgICAgICAgICAgICAgeDogMTAsXG4gICAgICogICAgICAgICAgICAgICAgeTogMTBcbiAgICAgKiAgICAgICAgICAgIH0sXG4gICAgICogICAgICAgICAgICB7XG4gICAgICogICAgICAgICAgICAgICAgeDogMTEsXG4gICAgICogICAgICAgICAgICAgICAgeTogMTFcbiAgICAgKiAgICAgICAgICAgIH1cbiAgICAgKiAgICAgIF1cbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICBpc0ZsaWNrOiBmdW5jdGlvbihldmVudERhdGEpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gZXZlbnREYXRhLnN0YXJ0LFxuICAgICAgICAgICAgZW5kID0gZXZlbnREYXRhLmVuZCxcbiAgICAgICAgICAgIGxpc3QgPSBldmVudERhdGEubGlzdCxcbiAgICAgICAgICAgIGZpcnN0ID0gbGlzdFswXSxcbiAgICAgICAgICAgIGZpbmFsID0gbGlzdFtsaXN0Lmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgdGltZURpc3QgPSBlbmQgLSBzdGFydCxcbiAgICAgICAgICAgIHhEaXN0ID0gTWF0aC5hYnMoZmlyc3QueCAtIGZpbmFsLngpLFxuICAgICAgICAgICAgeURpc3QgPSBNYXRoLmFicyhmaXJzdC55IC0gZmluYWwueSksXG4gICAgICAgICAgICBpc0ZsaWNrO1xuXG4gICAgICAgIGlmICh0aW1lRGlzdCA8IHRoaXMuZmxpY2tUaW1lIHx8IHhEaXN0ID4gdGhpcy5mbGlja1JhbmdlIHx8IHlEaXN0ID4gdGhpcy5mbGlja1JhbmdlKSB7XG4gICAgICAgICAgICBpc0ZsaWNrID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlzRmxpY2sgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc0ZsaWNrO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmxpY2s7XG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgZGlzY3JpbWluYXRlIGxvbmcgdGFiIGV2ZW50XG4gKiBAYXV0aG9yIE5ITiBlbnRlcnRhaW5tZW50IEZFIGRldiB0ZWFtLiBKZWluIFlpPGplaW4ueWlAbmhuZW50LmNvbT5cbiAqL1xuXG4vKipcbiAqIE1vZHVsZXMgb2YgRGlzY3JpbWluYXRpb24gbG9uZ3RhYlxuICogQG5hbWVzcGFjZSBMb25nVGFiXG4gKi9cbnZhciBMb25nVGFiID0gLyoqIEBsZW5kcyBMb25nVGFiICove1xuICAgIC8qKlxuICAgICAqIHdpZHRoIGlzIGNvbnNpZGVyZWQgbW92aW5nLlxuICAgICAqL1xuICAgIG1pbkRpc3Q6IDEwLFxuICAgIC8qKlxuICAgICAqIHRhYiB0aW1lciBmb3IgY2hlY2sgZG91YmxlIGNsaWNrXG4gICAgICovXG4gICAgdGFiVGltZXI6IG51bGwsXG4gICAgLyoqXG4gICAgICogZXh0cmFjdGVkIGV2ZW50IHR5cGVcbiAgICAgKi9cbiAgICB0eXBlOiAnbG9uZ3RhYicsXG4gICAgLyoqXG4gICAgICogbG9uZyB0YWIgdGVybVxuICAgICAqL1xuICAgIGxvbmdUYWJUZXJtOiA2MDAsXG4gICAgLyoqXG4gICAgICogc2V0IG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uXG4gICAgICogICAgICBAcGFyYW0ge251bWJlcn0gW29wdGlvbi5taW5EaXN0XSBkaXN0YW5jZSB0byBjaGVjayBtb3ZlbWVudFxuICAgICAqICAgICAgQHBhcmFtIHtudW1iZXJ9IFtvcHRpb24ubG9uZ1RhYlRlcm1dIFRlcm0gZm9yIGNoZWNraW5nIGxvbmd0YWJcbiAgICAgKi9cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgdGhpcy5taW5EaXN0ID0gb3B0aW9uLmZsaWNrVGltZSB8fCB0aGlzLm1pbkRpc3Q7XG4gICAgICAgIHRoaXMubG9uZ1RhYlRlcm0gPSBvcHRpb24ubG9uZ1RhYlRlcm0gfHwgdGhpcy5sb25nVGFiVGVybTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgZGV0ZWN0IGxvbmd0YWIgcm9vcCwgSWYgdG91Y2hzdG9wIGV2ZW50IGRvZXMgbm90IGZpcmUgYW5kIHBvc2l0aW9uIGFyZSBzYW1lLCBydW4gY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcG9zIHBvc2l0aW9uIHRvIHN0YXJ0XG4gICAgICovXG4gICAgc3RhcnRUYWI6IGZ1bmN0aW9uKHBvcykge1xuICAgICAgICB0aGlzLmlzTG9uZ3RhYmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMubG9uZ1RhYlBvcyA9IHBvcztcbiAgICAgICAgdGhpcy50YWJUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KHR1aS51dGlsLmJpbmQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmlzTG9uZ3RhYmVkID0gdHJ1ZTtcbiAgICAgICAgfSwgdGhpcyksIHRoaXMubG9uZ1RhYlRlcm0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wIGRldGVjdCBsb25ndGFiIHJvb3AuXG4gICAgICogQGFwaVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwb3MgQSBwb3NpdGlvbiB0byBlbmRcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBBIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBnZXN0dXJlUmVhZGVyLmlzTG9uZ1RhYih7XG4gICAgICogICAgICB4OiAxMDAsXG4gICAgICogICAgICB5OiAxNTBcbiAgICAgKiB9LCBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgIGNvbnNvbGUubG9nKCdhc2RmJyk7XG4gICAgICogfSk7XG4gICAgICovXG4gICAgaXNMb25nVGFiOiBmdW5jdGlvbihwb3MsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBpc1NhZmVYLFxuICAgICAgICAgICAgaXNTYWZlWSxcbiAgICAgICAgICAgIGlzTG9uZ3RhYiA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5pc0xvbmd0YWJlZCkge1xuICAgICAgICAgICAgaXNTYWZlWCA9IE1hdGguYWJzKHRoaXMubG9uZ1RhYlBvcy54IC0gcG9zLngpIDwgdGhpcy5taW5EaXN0O1xuICAgICAgICAgICAgaXNTYWZlWSA9IE1hdGguYWJzKHRoaXMubG9uZ1RhYlBvcy55IC0gcG9zLnkpIDwgdGhpcy5taW5EaXN0O1xuICAgICAgICAgICAgaWYgKGlzU2FmZVggJiYgaXNTYWZlWSkge1xuICAgICAgICAgICAgICAgIGlzTG9uZ3RhYiA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcFRhYigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc0xvbmd0YWI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0b3AgbG9uZyB0YWIgY2hlY2tcbiAgICAgKi9cbiAgICBzdG9wVGFiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pc0xvbmd0YWJlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlc2V0VGltZXIoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogY2xlYXIgY2xpY2tUaW1lclxuICAgICAqL1xuICAgIHJlc2V0VGltZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGFiVGltZXIpO1xuICAgICAgICB0aGlzLnRhYlRpbWVyID0gbnVsbDtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvbmdUYWI7XG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgZGlzY3JpbWluYXRlIHR5cGUgb2YgdG91Y2ggZXZlbnRcbiAqIEBhdXRob3IgTkhOIGVudGVydGFpbm1lbnQgRkUgZGV2IHRlYW0uIEplaW4gWWk8amVpbi55aUBuaG5lbnQuY29tPlxuICovXG5cblxudmFyIEZsaWNrID0gcmVxdWlyZSgnLi9mbGljaycpO1xudmFyIExvbmdUYWIgPSByZXF1aXJlKCcuL2xvbmd0YWInKTtcbnZhciBEb3VibGVDbGljayA9IHJlcXVpcmUoJy4vZG91YmxlQ2xpY2snKTtcblxuLyoqXG4gKiBUbyBmaW5kIG91dCBpdCdzIGZsaWNrIG9yIGNsaWNrIG9yIG5vdGhpbmcgZnJvbSBldmVudCBkYXRhcy5cbiAqIEBuYW1lc3BhY2UgUmVhZGVyXG4gKiBAZXhhbXBsZVxuICogdmFyIHJlYWRlciA9IG5ldyB0dWkuY29tcG9uZW50Lkdlc3R1cmUuUmVhZGVyKHtcbiAqICAgICAgdHlwZSA6ICdmbGljaycgfHwgJ2xvbmd0YWInIHx8ICdkb3VibGVjbGljaydcbiAqIH0pO1xuICovXG52YXIgUmVhZGVyID0gdHVpLnV0aWwuZGVmaW5lQ2xhc3MoLyoqIEBsZW5kcyBSZWFkZXIucHJvdG90eXBlICove1xuICAgIC8qKlxuICAgICAqIHNldCBvcHRpb25zXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvblxuICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICBpZiAob3B0aW9uLnR5cGUgPT09ICdmbGljaycpIHtcbiAgICAgICAgICAgIHR1aS51dGlsLmV4dGVuZCh0aGlzLCBGbGljayk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9uLnR5cGUgPT09ICdsb25ndGFiJykge1xuICAgICAgICAgICAgdHVpLnV0aWwuZXh0ZW5kKHRoaXMsIExvbmdUYWIpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbi50eXBlID09PSAnZGJjbGljaycpIHtcbiAgICAgICAgICAgIHR1aS51dGlsLmV4dGVuZCh0aGlzLCBEb3VibGVDbGljayk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplKG9wdGlvbik7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhZGVyO1xuIl19
