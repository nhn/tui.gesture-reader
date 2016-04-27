(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Gesture = tui.util.defineNamespace('tui.component.Gesture');
Gesture.Reader = require('./src/js/reader');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9qcy9kb3VibGVDbGljay5qcyIsInNyYy9qcy9mbGljay5qcyIsInNyYy9qcy9sb25ndGFiLmpzIiwic3JjL2pzL3JlYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgR2VzdHVyZSA9IHR1aS51dGlsLmRlZmluZU5hbWVzcGFjZSgndHVpLmNvbXBvbmVudC5HZXN0dXJlJyk7XG5HZXN0dXJlLlJlYWRlciA9IHJlcXVpcmUoJy4vc3JjL2pzL3JlYWRlcicpO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IGRpc2NyaW1pbmF0ZSBkb3VibGVjbGljayBldmVudFxuICogQGF1dGhvciBOSE4gZW50ZXJ0YWlubWVudCBGRSBkZXYgdGVhbS4gSmVpbiBZaTxqZWluLnlpQG5obmVudC5jb20+XG4gKi9cblxuLyoqXG4gKiBNb2R1bGVzIG9mIERpc2NyaW1pbmF0aW9uIGRvdWJsZSBjbGlja1xuICogQG5hbWVzcGFjZSBEb3VibGVDbGlja1xuICovXG52YXIgRG91YmxlQ2xpY2sgPSAvKipAbGVuZHMgRG91YmxlQ2xpY2sgKi97XG4gICAgLyoqXG4gICAgICogVGltZXIgZm9yIGNoZWNrIGNsaWNrIHR3aWNlIGluIHRpbWVcbiAgICAgKi9cbiAgICBjbGlja1RpbWVyOiBudWxsLFxuICAgIC8qKlxuICAgICAqIFRoZSB0eXBlIG9mIHJlYWRlclxuICAgICAqL1xuICAgIHR5cGU6ICdkYmNsaWNrJyxcbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIHNhZmUgZGlzdGFuY2VcbiAgICAgKi9cbiAgICBtYXhEaXN0OiAxMCxcbiAgICAvKipcbiAgICAgKiBBdmFpbGFibGUgZG91YmxlIGNsaWNrIHRlcm1cbiAgICAgKi9cbiAgICBjbGlja1Rlcm06IDIwMCxcbiAgICAvKipcbiAgICAgKiBGaXJzdCBjbGljayB0aW1lc3RhbXBcbiAgICAgKi9cbiAgICBzdGFydFRpbWU6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBJbml0YWlsaXplIERvdWJsZUNsaWNrIFJlYWRlclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25cbiAgICAgKiAgQHBhcmFtIHtudW1iZXJ9IFtvcHRpb24uY2xpY2tUZXJtXSBBdmFpbGFibGUgdGltZSBkaXN0YW5jZSBiZXR3ZWVuIGZpcnN0IGFuZCBzZWNvbmQgY2xpY2sgZXZlbnQuXG4gICAgICogIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9uLm1heERpc3RdIEF2YWlsYWJsZSBtb3ZlbWVudCBkaXN0YW5jZVxuICAgICAqL1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB0aGlzLmNsaWNrVGVybSA9IG9wdGlvbi5jbGlja1Rlcm0gfHwgdGhpcy5jbGlja1Rlcm07XG4gICAgICAgIHRoaXMubWF4RGlzdCA9IG9wdGlvbi5tYXhEaXN0IHx8IHRoaXMubWF4RGlzdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgY2xpY2sgb3IgZG91YmxlIGNsaWNrXG4gICAgICogQGFwaVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwb3MgZGlzdGFuY2UgZnJvbSBtb3VzZWRvd24vdG91Y2hzdGFydCB0byBtb3VzZXVwL3RvdWNoZW5kXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGdlc3R1cmVSZWFkZXIuaXNEb3VibGVDbGljayh7XG4gICAgICogICAgICB4OiAxMCxcbiAgICAgKiAgICAgIHk6IDEwXG4gICAgICogfSk7XG4gICAgICovXG4gICAgaXNEb3VibGVDbGljazogZnVuY3Rpb24ocG9zKSB7XG4gICAgICAgIHZhciB0aW1lID0gbmV3IERhdGUoKSxcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5zdGFydFRpbWUsXG4gICAgICAgICAgICBpc0RvdWJsZUNsaWNrO1xuICAgICAgICBpZiAoc3RhcnQgJiYgdGhpcy5pc0F2YWlsYWJsZVpvbmUocG9zKSkge1xuICAgICAgICAgICAgdGhpcy5jbGVhclRpbWVyKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG51bGw7XG4gICAgICAgICAgICBpc0RvdWJsZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGltZXIoKTtcbiAgICAgICAgICAgIHRoaXMucG9zID0gcG9zO1xuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSB0aW1lO1xuICAgICAgICAgICAgaXNEb3VibGVDbGljayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc0RvdWJsZUNsaWNrO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb21wYXJlIHdpdGggc2F2ZWQgcG9zaXRpb24gdG8gc2FmZSB6b25lXG4gICAgICogQGFwaVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwb3MgUG9zaXRpb24gdG8gY29tcGFyZSB3aXRoIHNhdmVkIHBvc2l0aW9uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBnZXN0dXJlUmVhZGVyLmlzQXZhaWxhYmxlWm9uZSh7XG4gICAgICogICAgICB4OiAxMCxcbiAgICAgKiAgICAgIHk6IDEwXG4gICAgICogfSk7XG4gICAgICogPT4gdHJ1ZVxuICAgICAqL1xuICAgIGlzQXZhaWxhYmxlWm9uZTogZnVuY3Rpb24ocG9zKSB7XG4gICAgICAgIHZhciBpc0F2YWlsWCA9IE1hdGguYWJzKHRoaXMucG9zLnggLSBwb3MueCkgPCB0aGlzLm1heERpc3QsXG4gICAgICAgICAgICBpc0F2YWlsWSA9IE1hdGguYWJzKHRoaXMucG9zLnkgLSBwb3MueSkgPCB0aGlzLm1heERpc3Q7XG5cbiAgICAgICAgcmV0dXJuIGlzQXZhaWxYICYmIGlzQXZhaWxZO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGltZXIgdG8gY2hlY2sgY2xpY2sgdGVybVxuICAgICAqL1xuICAgIHNldFRpbWVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jbGlja1RpbWVyID0gd2luZG93LnNldFRpbWVvdXQodHVpLnV0aWwuYmluZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbnVsbDtcbiAgICAgICAgfSwgdGhpcyksIHRoaXMuY2xpY2tUZXJtKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2xlYXIgdGltZXJcbiAgICAgKi9cbiAgICBjbGVhclRpbWVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmNsaWNrVGltZXIpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRG91YmxlQ2xpY2s7XG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgZGlzY3JpbWluYXRlIGZsaWNrIGV2ZW50XG4gKiBAYXV0aG9yIE5ITiBlbnRlcnRhaW5tZW50IEZFIGRldiB0ZWFtLiBKZWluIFlpPGplaW4ueWlAbmhuZW50LmNvbT5cbiAqL1xuXG4vKipcbiAqIE1vZHVsZXMgb2YgRGlzY3JpbWluYXRpb24gZmxpY2tcbiAqIEBuYW1lc3BhY2UgRmxpY2tcbiAqL1xudmFyIEZsaWNrID0gLyoqIEBsZW5kcyBGbGljayAqL3tcbiAgICAvKipcbiAgICAgKiB0aW1lIGlzIGNvbnNpZGVyZWQgZmxpY2suXG4gICAgICovXG4gICAgZmxpY2tUaW1lOiAxMDAsXG4gICAgLyoqXG4gICAgICogd2lkdGggaXMgY29uc2lkZXJlZCBmbGljay5cbiAgICAgKi9cbiAgICBmbGlja1JhbmdlOiAzMDAsXG4gICAgLyoqXG4gICAgICogd2lkdGggaXMgY29uc2lkZXJlZCBtb3ZpbmcuXG4gICAgICovXG4gICAgbWluRGlzdDogMTAsXG4gICAgLyoqXG4gICAgICogUmVhZGVyIHR5cGVcbiAgICAgKi9cbiAgICB0eXBlOiAnZmxpY2snLFxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBGbGlja2luZ1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb24gRmxpY2sgb3B0aW9uc1xuICAgICAqICBAcGFyYW0ge251bWJlcn0gW29wdGlvbi5mbGlja1RpbWVdIEZsaWNrIHRpbWUsIGlmIGluIHRoaXMgdGltZSwgZG8gbm90IGNoZWNrIG1vdmUgZGlzdGFuY2VcbiAgICAgKiAgQHBhcmFtIHtudW1iZXJ9IFtvcHRpb24uZmxpY2tSYW5nZV0gRmxpY2sgcmFuZ2UsIGlmIG5vdCBpbiB0aW1lLCBjb21wYXJlIG1vdmUgZGlzdGFuY2Ugd2l0aCBmbGljayByYWduZS5cbiAgICAgKiAgQHBhcmFtIHtudW1iZXJ9IFtvcHRpb24ubWluRGlzdF0gTWluaW11bSBkaXN0YW5jZSBmb3IgY2hlY2sgYXZhaWxhYmxlIG1vdmVtZW50LlxuICAgICAqL1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB0aGlzLmZsaWNrVGltZSA9IG9wdGlvbi5mbGlja1RpbWUgfHwgdGhpcy5mbGlja1RpbWU7XG4gICAgICAgIHRoaXMuZmxpY2tSYW5nZSA9IG9wdGlvbi5mbGlja1JhbmdlIHx8IHRoaXMuZmxpY2tSYW5nZTtcbiAgICAgICAgdGhpcy5taW5EaXN0ID0gb3B0aW9uLm1pbkRpc3QgfHwgdGhpcy5taW5EaXN0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwaWNrIGV2ZW50IHR5cGUgZnJvbSBldmVudERhdGFcbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50RGF0YSBldmVudCBEYXRhXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxuICAgICAqIEBleGFtcGxlIGdlc3R1cmVSZWFkZXIuZmlndXJlKHtcbiAgICAgKiAgICAgIGxpc3QgOiBbe3g6IDAsIHk6IDB9LCB7eDogMTAwLCB5OiAxMDB9XSxcbiAgICAgKiAgICAgIHN0YXJ0OiAwLFxuICAgICAqICAgICAgZW5kOiA1MFxuICAgICAqIH0pO1xuICAgICAqID0+IHtcbiAgICAgKiAgICAgIGRpcmVjdGlvbjogJ1NFJyxcbiAgICAgKiAgICAgIGlzRmxpY2s6IGZhbHNlXG4gICAgICogfVxuICAgICAqL1xuICAgIGZpZ3VyZTogZnVuY3Rpb24oZXZlbnREYXRhKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkaXJlY3Rpb24gOiB0aGlzLmdldERpcmVjdGlvbihldmVudERhdGEubGlzdCksXG4gICAgICAgICAgICBpc0ZsaWNrOiB0aGlzLmlzRmxpY2soZXZlbnREYXRhKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJldHVybiBkaXJlY3Rpb24gZmlndXJlZCBvdXRcbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHthcnJheX0gbGlzdCBldmVudFBvaW50IExpc3RcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqIEBleGFtcGxlIGdlc3R1cmVSZWFkZXIuZ2V0RGlyZWN0aW9uKFt7eDogMCwgeTogMH0sIHt4OiAxMDAsIHk6IDEwMH1dKTtcbiAgICAgKiA9PiAnU0UnO1xuICAgICAqL1xuICAgIGdldERpcmVjdGlvbjogZnVuY3Rpb24obGlzdCkge1xuICAgICAgICB2YXIgZmlyc3QgPSBsaXN0WzBdLFxuICAgICAgICAgICAgZmluYWwgPSBsaXN0W2xpc3QubGVuZ3RoLTFdLFxuICAgICAgICAgICAgY2FyZGluYWxQb2ludCA9IHRoaXMuZ2V0Q2FyZGluYWxQb2ludHMoZmlyc3QsIGZpbmFsKSxcbiAgICAgICAgICAgIHJlcyA9IHRoaXMuZ2V0Q2xvc2VDYXJkaW5hbChmaXJzdCwgZmluYWwsIGNhcmRpbmFsUG9pbnQpO1xuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiByZXR1cm4gY2FyZGluYWwgcG9pbnRzIGZpZ3VyZWQgb3V0XG4gICAgICogQGFwaVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmaXJzdCBzdGFydCBwb2ludFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsYXN0IGVuZCBwb2ludFxuICAgICAqIEBleGFtcGxlIGdlc3R1cmVSZWFkZXIuZ2V0RGlyZWN0aW9uKHt4OiAwLCB5OiAwfSwge3g6IDEwMCwgeTogMTAwfSk7XG4gICAgICogPT4gJ1NFJztcbiAgICAgKi9cbiAgICBnZXRDYXJkaW5hbFBvaW50czogZnVuY3Rpb24oZmlyc3QsIGxhc3QpIHtcbiAgICAgICAgdmFyIHZlcnRpY2FsRGlzdCA9IGZpcnN0LnkgLSBsYXN0LnksXG4gICAgICAgICAgICBob3Jpem9uRGlzdCA9IGZpcnN0LnggLSBsYXN0LngsXG4gICAgICAgICAgICBOUyA9ICcnLFxuICAgICAgICAgICAgV0UgPSAnJztcblxuICAgICAgICBpZiAodmVydGljYWxEaXN0IDwgMCkge1xuICAgICAgICAgICAgTlMgPSAnUyc7XG4gICAgICAgIH0gZWxzZSBpZiAodmVydGljYWxEaXN0ID4gMCkge1xuICAgICAgICAgICAgTlMgPSAnTic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaG9yaXpvbkRpc3QgPCAwKSB7XG4gICAgICAgICAgICBXRSA9ICdFJztcbiAgICAgICAgfSBlbHNlIGlmIChob3Jpem9uRGlzdCA+IDApIHtcbiAgICAgICAgICAgIFdFID0gJ1cnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE5TK1dFO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gbmVhcmVzdCBmb3VyIGNhcmRpbmFsIHBvaW50c1xuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZmlyc3Qgc3RhcnQgcG9pbnRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFzdCBlbmQgcG9pbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2FyZGluYWxQb2ludCBjYXJkaW5hbFBvaW50IGZyb20gZ2V0Q2FyZGluYWxQb2ludHNcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqIEBleGFtcGxlIGdlc3R1cmVSZWFkZXIuZ2V0RGlyZWN0aW9uKHt4OiAwLCB5OiA1MH0sIHt4OiAxMDAsIHk6IDEwMH0pO1xuICAgICAqID0+ICdXJztcbiAgICAgKi9cbiAgICBnZXRDbG9zZUNhcmRpbmFsOiBmdW5jdGlvbihmaXJzdCwgbGFzdCwgY2FyZGluYWxQb2ludCkge1xuICAgICAgICB2YXIgc2xvcCA9IChsYXN0LnkgLSBmaXJzdC55KSAvIChsYXN0LnggLSBmaXJzdC54KSxcbiAgICAgICAgICAgIGRpcmVjdGlvbjtcbiAgICAgICAgaWYgKHNsb3AgPCAwKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBzbG9wIDwgLTEgPyAnTlMnIDogJ1dFJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IHNsb3AgPiAxID8gJ05TJyA6ICdXRSc7XG4gICAgICAgIH1cblxuICAgICAgICBkaXJlY3Rpb24gPSB0dWkudXRpbC5nZXREdXBsaWNhdGVkQ2hhcihkaXJlY3Rpb24sIGNhcmRpbmFsUG9pbnQpO1xuICAgICAgICByZXR1cm4gZGlyZWN0aW9uO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBleHRyYWN0IHR5cGUgb2YgZXZlbnRcbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50RGF0YSBldmVudCBkYXRhXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJlYWRlci5pc0ZsaWNrKHtcbiAgICAgKiAgICAgIHN0YXJ0OiAxMDAwLFxuICAgICAqICAgICAgZW5kOiAxMTAwLFxuICAgICAqICAgICAgbGlzdDogW1xuICAgICAqICAgICAgICAgICAge1xuICAgICAqICAgICAgICAgICAgICAgIHg6IDEwLFxuICAgICAqICAgICAgICAgICAgICAgIHk6IDEwXG4gICAgICogICAgICAgICAgICB9LFxuICAgICAqICAgICAgICAgICAge1xuICAgICAqICAgICAgICAgICAgICAgIHg6IDExLFxuICAgICAqICAgICAgICAgICAgICAgIHk6IDExXG4gICAgICogICAgICAgICAgICB9XG4gICAgICogICAgICBdXG4gICAgICogfSk7XG4gICAgICovXG4gICAgaXNGbGljazogZnVuY3Rpb24oZXZlbnREYXRhKSB7XG4gICAgICAgIHZhciBzdGFydCA9IGV2ZW50RGF0YS5zdGFydCxcbiAgICAgICAgICAgIGVuZCA9IGV2ZW50RGF0YS5lbmQsXG4gICAgICAgICAgICBsaXN0ID0gZXZlbnREYXRhLmxpc3QsXG4gICAgICAgICAgICBmaXJzdCA9IGxpc3RbMF0sXG4gICAgICAgICAgICBmaW5hbCA9IGxpc3RbbGlzdC5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgIHRpbWVEaXN0ID0gZW5kIC0gc3RhcnQsXG4gICAgICAgICAgICB4RGlzdCA9IE1hdGguYWJzKGZpcnN0LnggLSBmaW5hbC54KSxcbiAgICAgICAgICAgIHlEaXN0ID0gTWF0aC5hYnMoZmlyc3QueSAtIGZpbmFsLnkpLFxuICAgICAgICAgICAgaXNGbGljaztcblxuICAgICAgICBpZiAodGltZURpc3QgPCB0aGlzLmZsaWNrVGltZSB8fCB4RGlzdCA+IHRoaXMuZmxpY2tSYW5nZSB8fCB5RGlzdCA+IHRoaXMuZmxpY2tSYW5nZSkge1xuICAgICAgICAgICAgaXNGbGljayA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc0ZsaWNrID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNGbGljaztcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZsaWNrO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IGRpc2NyaW1pbmF0ZSBsb25nIHRhYiBldmVudFxuICogQGF1dGhvciBOSE4gZW50ZXJ0YWlubWVudCBGRSBkZXYgdGVhbS4gSmVpbiBZaTxqZWluLnlpQG5obmVudC5jb20+XG4gKi9cblxuLyoqXG4gKiBNb2R1bGVzIG9mIERpc2NyaW1pbmF0aW9uIGxvbmd0YWJcbiAqIEBuYW1lc3BhY2UgTG9uZ1RhYlxuICovXG52YXIgTG9uZ1RhYiA9IC8qKiBAbGVuZHMgTG9uZ1RhYiAqL3tcbiAgICAvKipcbiAgICAgKiB3aWR0aCBpcyBjb25zaWRlcmVkIG1vdmluZy5cbiAgICAgKi9cbiAgICBtaW5EaXN0OiAxMCxcbiAgICAvKipcbiAgICAgKiB0YWIgdGltZXIgZm9yIGNoZWNrIGRvdWJsZSBjbGlja1xuICAgICAqL1xuICAgIHRhYlRpbWVyOiBudWxsLFxuICAgIC8qKlxuICAgICAqIGV4dHJhY3RlZCBldmVudCB0eXBlXG4gICAgICovXG4gICAgdHlwZTogJ2xvbmd0YWInLFxuICAgIC8qKlxuICAgICAqIGxvbmcgdGFiIHRlcm1cbiAgICAgKi9cbiAgICBsb25nVGFiVGVybTogNjAwLFxuICAgIC8qKlxuICAgICAqIHNldCBvcHRpb25zXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvblxuICAgICAqICAgICAgQHBhcmFtIHtudW1iZXJ9IFtvcHRpb24ubWluRGlzdF0gZGlzdGFuY2UgdG8gY2hlY2sgbW92ZW1lbnRcbiAgICAgKiAgICAgIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9uLmxvbmdUYWJUZXJtXSBUZXJtIGZvciBjaGVja2luZyBsb25ndGFiXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHRoaXMubWluRGlzdCA9IG9wdGlvbi5mbGlja1RpbWUgfHwgdGhpcy5taW5EaXN0O1xuICAgICAgICB0aGlzLmxvbmdUYWJUZXJtID0gb3B0aW9uLmxvbmdUYWJUZXJtIHx8IHRoaXMubG9uZ1RhYlRlcm07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IGRldGVjdCBsb25ndGFiIHJvb3AsIElmIHRvdWNoc3RvcCBldmVudCBkb2VzIG5vdCBmaXJlIGFuZCBwb3NpdGlvbiBhcmUgc2FtZSwgcnVuIGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBvcyBwb3NpdGlvbiB0byBzdGFydFxuICAgICAqL1xuICAgIHN0YXJ0VGFiOiBmdW5jdGlvbihwb3MpIHtcbiAgICAgICAgdGhpcy5pc0xvbmd0YWJlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxvbmdUYWJQb3MgPSBwb3M7XG4gICAgICAgIHRoaXMudGFiVGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCh0dWkudXRpbC5iaW5kKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5pc0xvbmd0YWJlZCA9IHRydWU7XG4gICAgICAgIH0sIHRoaXMpLCB0aGlzLmxvbmdUYWJUZXJtKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RvcCBkZXRlY3QgbG9uZ3RhYiByb29wLlxuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcG9zIEEgcG9zaXRpb24gdG8gZW5kXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgQSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEBleGFtcGxlXG4gICAgICogZ2VzdHVyZVJlYWRlci5pc0xvbmdUYWIoe1xuICAgICAqICAgICAgeDogMTAwLFxuICAgICAqICAgICAgeTogMTUwXG4gICAgICogfSwgZnVuY3Rpb24oKSB7XG4gICAgICogICAgICBjb25zb2xlLmxvZygnYXNkZicpO1xuICAgICAqIH0pO1xuICAgICAqL1xuICAgIGlzTG9uZ1RhYjogZnVuY3Rpb24ocG9zLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgaXNTYWZlWCxcbiAgICAgICAgICAgIGlzU2FmZVksXG4gICAgICAgICAgICBpc0xvbmd0YWIgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuaXNMb25ndGFiZWQpIHtcbiAgICAgICAgICAgIGlzU2FmZVggPSBNYXRoLmFicyh0aGlzLmxvbmdUYWJQb3MueCAtIHBvcy54KSA8IHRoaXMubWluRGlzdDtcbiAgICAgICAgICAgIGlzU2FmZVkgPSBNYXRoLmFicyh0aGlzLmxvbmdUYWJQb3MueSAtIHBvcy55KSA8IHRoaXMubWluRGlzdDtcbiAgICAgICAgICAgIGlmIChpc1NhZmVYICYmIGlzU2FmZVkpIHtcbiAgICAgICAgICAgICAgICBpc0xvbmd0YWIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BUYWIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNMb25ndGFiO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wIGxvbmcgdGFiIGNoZWNrXG4gICAgICovXG4gICAgc3RvcFRhYjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaXNMb25ndGFiZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yZXNldFRpbWVyKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGNsZWFyIGNsaWNrVGltZXJcbiAgICAgKi9cbiAgICByZXNldFRpbWVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRhYlRpbWVyKTtcbiAgICAgICAgdGhpcy50YWJUaW1lciA9IG51bGw7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb25nVGFiO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IGRpc2NyaW1pbmF0ZSB0eXBlIG9mIHRvdWNoIGV2ZW50XG4gKiBAYXV0aG9yIE5ITiBlbnRlcnRhaW5tZW50IEZFIGRldiB0ZWFtLiBKZWluIFlpPGplaW4ueWlAbmhuZW50LmNvbT5cbiAqL1xuXG5cbnZhciBGbGljayA9IHJlcXVpcmUoJy4vZmxpY2snKTtcbnZhciBMb25nVGFiID0gcmVxdWlyZSgnLi9sb25ndGFiJyk7XG52YXIgRG91YmxlQ2xpY2sgPSByZXF1aXJlKCcuL2RvdWJsZUNsaWNrJyk7XG5cbi8qKlxuICogVG8gZmluZCBvdXQgaXQncyBmbGljayBvciBjbGljayBvciBub3RoaW5nIGZyb20gZXZlbnQgZGF0YXMuXG4gKiBAbmFtZXNwYWNlIFJlYWRlclxuICogQGV4YW1wbGVcbiAqIHZhciByZWFkZXIgPSBuZXcgdHVpLmNvbXBvbmVudC5HZXN0dXJlLlJlYWRlcih7XG4gKiAgICAgIHR5cGUgOiAnZmxpY2snIHx8ICdsb25ndGFiJyB8fCAnZG91YmxlY2xpY2snXG4gKiB9KTtcbiAqL1xudmFyIFJlYWRlciA9IHR1aS51dGlsLmRlZmluZUNsYXNzKC8qKiBAbGVuZHMgUmVhZGVyLnByb3RvdHlwZSAqL3tcbiAgICAvKipcbiAgICAgKiBzZXQgb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25cbiAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgaWYgKG9wdGlvbi50eXBlID09PSAnZmxpY2snKSB7XG4gICAgICAgICAgICB0dWkudXRpbC5leHRlbmQodGhpcywgRmxpY2spO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbi50eXBlID09PSAnbG9uZ3RhYicpIHtcbiAgICAgICAgICAgIHR1aS51dGlsLmV4dGVuZCh0aGlzLCBMb25nVGFiKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb24udHlwZSA9PT0gJ2RiY2xpY2snKSB7XG4gICAgICAgICAgICB0dWkudXRpbC5leHRlbmQodGhpcywgRG91YmxlQ2xpY2spO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShvcHRpb24pO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWRlcjtcbiJdfQ==
