(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
ne.util.defineNamespace('ne.component.Gesture.Reader', require('./src/js/reader'));

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
     * @param {number} timeDist distance from mousedown/touchstart to mouseup/touchend
     * @private
     * @returns {*}
     * @example
     * reader.isDoubleClick({
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
     * @param {object} pos Position to compare with saved position
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
     * @param {object} eventData event Data
     * @return {object}
     */
    figure: function(eventData) {
        return {
            direction : this.getDirection(eventData.list),
            isFlick: this.isFlick(eventData)
        }
    },

    /**
     * return direction figured out
     * @param {array} list eventPoint List
     * @returns {string}
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
     * @param {object} first start point
     * @param {object} last end point
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
     * @param {object} first start point
     * @param {object} last end point
     * @param {string} cardinalPoint cardinalPoint from getCardinalPoints
     * @returns {string}
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
     * @param {function} callback
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
     * @param {object} pos A position to end
     * @param {function} callback A callback function
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9qcy9kb3VibGVDbGljay5qcyIsInNyYy9qcy9mbGljay5qcyIsInNyYy9qcy9sb25ndGFiLmpzIiwic3JjL2pzL3JlYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJuZS51dGlsLmRlZmluZU5hbWVzcGFjZSgnbmUuY29tcG9uZW50Lkdlc3R1cmUuUmVhZGVyJywgcmVxdWlyZSgnLi9zcmMvanMvcmVhZGVyJykpO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IGRpc2NyaW1pbmF0ZSBkb3VibGVjbGljayBldmVudFxuICogQGF1dGhvciBOSE4gZW50ZXJ0YWlubWVudCBGRSBkZXYgdGVhbS4gSmVpbiBZaTxqZWluLnlpQG5obmVudC5jb20+XG4gKi9cblxuLyoqXG4gKiBNb2R1bGVzIG9mIERpc2NyaW1pbmF0aW9uIGRvdWJsZSBjbGlja1xuICogQG5hbWVzcGFjZSBEb3VibGVDbGlja1xuICovXG52YXIgRG91YmxlQ2xpY2sgPSAvKipAbGVuZHMgRG91YmxlQ2xpY2sgKi97XG4gICAgLyoqXG4gICAgICogVGltZXIgZm9yIGNoZWNrIGNsaWNrIHR3aWNlIGluIHRpbWVcbiAgICAgKi9cbiAgICBjbGlja1RpbWVyOiBudWxsLFxuICAgIC8qKlxuICAgICAqIFRoZSB0eXBlIG9mIHJlYWRlclxuICAgICAqL1xuICAgIHR5cGU6ICdkYmNsaWNrJyxcbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIHNhZmUgZGlzdGFuY2VcbiAgICAgKi9cbiAgICBtYXhEaXN0OiAxMCxcbiAgICAvKipcbiAgICAgKiBBdmFpbGFibGUgZG91YmxlIGNsaWNrIHRlcm1cbiAgICAgKi9cbiAgICBjbGlja1Rlcm06IDIwMCxcbiAgICAvKipcbiAgICAgKiBGaXJzdCBjbGljayB0aW1lc3RhbXBcbiAgICAgKi9cbiAgICBzdGFydFRpbWU6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBJbml0YWlsaXplIERvdWJsZUNsaWNrIFJlYWRlclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25cbiAgICAgKiAgQHBhcmFtIHtudW1iZXJ9IFtvcHRpb24uY2xpY2tUZXJtXSBBdmFpbGFibGUgdGltZSBkaXN0YW5jZSBiZXR3ZWVuIGZpcnN0IGFuZCBzZWNvbmQgY2xpY2sgZXZlbnQuXG4gICAgICogIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9uLm1heERpc3RdIEF2YWlsYWJsZSBtb3ZlbWVudCBkaXN0YW5jZVxuICAgICAqL1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB0aGlzLmNsaWNrVGVybSA9IG9wdGlvbi5jbGlja1Rlcm0gfHwgdGhpcy5jbGlja1Rlcm07XG4gICAgICAgIHRoaXMubWF4RGlzdCA9IG9wdGlvbi5tYXhEaXN0IHx8IHRoaXMubWF4RGlzdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgY2xpY2sgb3IgZG91YmxlIGNsaWNrXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVEaXN0IGRpc3RhbmNlIGZyb20gbW91c2Vkb3duL3RvdWNoc3RhcnQgdG8gbW91c2V1cC90b3VjaGVuZFxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByZWFkZXIuaXNEb3VibGVDbGljayh7XG4gICAgICogICAgICB4OiAxMCxcbiAgICAgKiAgICAgIHk6IDEwXG4gICAgICogfSk7XG4gICAgICovXG4gICAgaXNEb3VibGVDbGljazogZnVuY3Rpb24ocG9zKSB7XG4gICAgICAgIHZhciB0aW1lID0gbmV3IERhdGUoKSxcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5zdGFydFRpbWUsXG4gICAgICAgICAgICBpc0RvdWJsZUNsaWNrO1xuICAgICAgICBpZiAoc3RhcnQgJiYgdGhpcy5pc0F2YWlsYWJsZVpvbmUocG9zKSkge1xuICAgICAgICAgICAgdGhpcy5jbGVhclRpbWVyKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG51bGw7XG4gICAgICAgICAgICBpc0RvdWJsZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGltZXIoKTtcbiAgICAgICAgICAgIHRoaXMucG9zID0gcG9zO1xuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSB0aW1lO1xuICAgICAgICAgICAgaXNEb3VibGVDbGljayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc0RvdWJsZUNsaWNrO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb21wYXJlIHdpdGggc2F2ZWQgcG9zaXRpb24gdG8gc2FmZSB6b25lXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBvcyBQb3NpdGlvbiB0byBjb21wYXJlIHdpdGggc2F2ZWQgcG9zaXRpb25cbiAgICAgKi9cbiAgICBpc0F2YWlsYWJsZVpvbmU6IGZ1bmN0aW9uKHBvcykge1xuICAgICAgICB2YXIgaXNBdmFpbFggPSBNYXRoLmFicyh0aGlzLnBvcy54IC0gcG9zLngpIDwgdGhpcy5tYXhEaXN0LFxuICAgICAgICAgICAgaXNBdmFpbFkgPSBNYXRoLmFicyh0aGlzLnBvcy55IC0gcG9zLnkpIDwgdGhpcy5tYXhEaXN0O1xuXG4gICAgICAgIHJldHVybiBpc0F2YWlsWCAmJiBpc0F2YWlsWTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHRpbWVyIHRvIGNoZWNrIGNsaWNrIHRlcm1cbiAgICAgKi9cbiAgICBzZXRUaW1lcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY2xpY2tUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KHR1aS51dGlsLmJpbmQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG51bGw7XG4gICAgICAgIH0sIHRoaXMpLCB0aGlzLmNsaWNrVGVybSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENsZWFyIHRpbWVyXG4gICAgICovXG4gICAgY2xlYXJUaW1lcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5jbGlja1RpbWVyKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERvdWJsZUNsaWNrO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IGRpc2NyaW1pbmF0ZSBmbGljayBldmVudFxuICogQGF1dGhvciBOSE4gZW50ZXJ0YWlubWVudCBGRSBkZXYgdGVhbS4gSmVpbiBZaTxqZWluLnlpQG5obmVudC5jb20+XG4gKi9cblxuLyoqXG4gKiBNb2R1bGVzIG9mIERpc2NyaW1pbmF0aW9uIGZsaWNrXG4gKiBAbmFtZXNwYWNlIEZsaWNrXG4gKi9cbnZhciBGbGljayA9IC8qKiBAbGVuZHMgRmxpY2sgKi97XG4gICAgLyoqXG4gICAgICogdGltZSBpcyBjb25zaWRlcmVkIGZsaWNrLlxuICAgICAqL1xuICAgIGZsaWNrVGltZTogMTAwLFxuICAgIC8qKlxuICAgICAqIHdpZHRoIGlzIGNvbnNpZGVyZWQgZmxpY2suXG4gICAgICovXG4gICAgZmxpY2tSYW5nZTogMzAwLFxuICAgIC8qKlxuICAgICAqIHdpZHRoIGlzIGNvbnNpZGVyZWQgbW92aW5nLlxuICAgICAqL1xuICAgIG1pbkRpc3Q6IDEwLFxuICAgIC8qKlxuICAgICAqIFJlYWRlciB0eXBlXG4gICAgICovXG4gICAgdHlwZTogJ2ZsaWNrJyxcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgRmxpY2tpbmdcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uIEZsaWNrIG9wdGlvbnNcbiAgICAgKiAgQHBhcmFtIHtudW1iZXJ9IFtvcHRpb24uZmxpY2tUaW1lXSBGbGljayB0aW1lLCBpZiBpbiB0aGlzIHRpbWUsIGRvIG5vdCBjaGVjayBtb3ZlIGRpc3RhbmNlXG4gICAgICogIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9uLmZsaWNrUmFuZ2VdIEZsaWNrIHJhbmdlLCBpZiBub3QgaW4gdGltZSwgY29tcGFyZSBtb3ZlIGRpc3RhbmNlIHdpdGggZmxpY2sgcmFnbmUuXG4gICAgICogIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9uLm1pbkRpc3RdIE1pbmltdW0gZGlzdGFuY2UgZm9yIGNoZWNrIGF2YWlsYWJsZSBtb3ZlbWVudC5cbiAgICAgKi9cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgdGhpcy5mbGlja1RpbWUgPSBvcHRpb24uZmxpY2tUaW1lIHx8IHRoaXMuZmxpY2tUaW1lO1xuICAgICAgICB0aGlzLmZsaWNrUmFuZ2UgPSBvcHRpb24uZmxpY2tSYW5nZSB8fCB0aGlzLmZsaWNrUmFuZ2U7XG4gICAgICAgIHRoaXMubWluRGlzdCA9IG9wdGlvbi5taW5EaXN0IHx8IHRoaXMubWluRGlzdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcGljayBldmVudCB0eXBlIGZyb20gZXZlbnREYXRhXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50RGF0YSBldmVudCBEYXRhXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxuICAgICAqL1xuICAgIGZpZ3VyZTogZnVuY3Rpb24oZXZlbnREYXRhKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkaXJlY3Rpb24gOiB0aGlzLmdldERpcmVjdGlvbihldmVudERhdGEubGlzdCksXG4gICAgICAgICAgICBpc0ZsaWNrOiB0aGlzLmlzRmxpY2soZXZlbnREYXRhKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJldHVybiBkaXJlY3Rpb24gZmlndXJlZCBvdXRcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBsaXN0IGV2ZW50UG9pbnQgTGlzdFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0RGlyZWN0aW9uOiBmdW5jdGlvbihsaXN0KSB7XG4gICAgICAgIHZhciBmaXJzdCA9IGxpc3RbMF0sXG4gICAgICAgICAgICBmaW5hbCA9IGxpc3RbbGlzdC5sZW5ndGgtMV0sXG4gICAgICAgICAgICBjYXJkaW5hbFBvaW50ID0gdGhpcy5nZXRDYXJkaW5hbFBvaW50cyhmaXJzdCwgZmluYWwpLFxuICAgICAgICAgICAgcmVzID0gdGhpcy5nZXRDbG9zZUNhcmRpbmFsKGZpcnN0LCBmaW5hbCwgY2FyZGluYWxQb2ludCk7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIHJldHVybiBjYXJkaW5hbCBwb2ludHMgZmlndXJlZCBvdXRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZmlyc3Qgc3RhcnQgcG9pbnRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFzdCBlbmQgcG9pbnRcbiAgICAgKi9cbiAgICBnZXRDYXJkaW5hbFBvaW50czogZnVuY3Rpb24oZmlyc3QsIGxhc3QpIHtcbiAgICAgICAgdmFyIHZlcnRpY2FsRGlzdCA9IGZpcnN0LnkgLSBsYXN0LnksXG4gICAgICAgICAgICBob3Jpem9uRGlzdCA9IGZpcnN0LnggLSBsYXN0LngsXG4gICAgICAgICAgICBOUyA9ICcnLFxuICAgICAgICAgICAgV0UgPSAnJztcblxuICAgICAgICBpZiAodmVydGljYWxEaXN0IDwgMCkge1xuICAgICAgICAgICAgTlMgPSAnUyc7XG4gICAgICAgIH0gZWxzZSBpZiAodmVydGljYWxEaXN0ID4gMCkge1xuICAgICAgICAgICAgTlMgPSAnTic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaG9yaXpvbkRpc3QgPCAwKSB7XG4gICAgICAgICAgICBXRSA9ICdFJztcbiAgICAgICAgfSBlbHNlIGlmIChob3Jpem9uRGlzdCA+IDApIHtcbiAgICAgICAgICAgIFdFID0gJ1cnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE5TK1dFO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gbmVhcmVzdCBmb3VyIGNhcmRpbmFsIHBvaW50c1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmaXJzdCBzdGFydCBwb2ludFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsYXN0IGVuZCBwb2ludFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjYXJkaW5hbFBvaW50IGNhcmRpbmFsUG9pbnQgZnJvbSBnZXRDYXJkaW5hbFBvaW50c1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0Q2xvc2VDYXJkaW5hbDogZnVuY3Rpb24oZmlyc3QsIGxhc3QsIGNhcmRpbmFsUG9pbnQpIHtcbiAgICAgICAgdmFyIHNsb3AgPSAobGFzdC55IC0gZmlyc3QueSkgLyAobGFzdC54IC0gZmlyc3QueCksXG4gICAgICAgICAgICBkaXJlY3Rpb247XG4gICAgICAgIGlmIChzbG9wIDwgMCkge1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gc2xvcCA8IC0xID8gJ05TJyA6ICdXRSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBzbG9wID4gMSA/ICdOUycgOiAnV0UnO1xuICAgICAgICB9XG5cbiAgICAgICAgZGlyZWN0aW9uID0gdHVpLnV0aWwuZ2V0RHVwbGljYXRlZENoYXIoZGlyZWN0aW9uLCBjYXJkaW5hbFBvaW50KTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGlvbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZXh0cmFjdCB0eXBlIG9mIGV2ZW50XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50RGF0YSBldmVudCBkYXRhXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJlYWRlci5pc0ZsaWNrKHtcbiAgICAgKiAgICAgIHN0YXJ0OiAxMDAwLFxuICAgICAqICAgICAgZW5kOiAxMTAwLFxuICAgICAqICAgICAgbGlzdDogW1xuICAgICAqICAgICAgICAgICAge1xuICAgICAqICAgICAgICAgICAgICAgIHg6IDEwLFxuICAgICAqICAgICAgICAgICAgICAgIHk6IDEwXG4gICAgICogICAgICAgICAgICB9LFxuICAgICAqICAgICAgICAgICAge1xuICAgICAqICAgICAgICAgICAgICAgIHg6IDExLFxuICAgICAqICAgICAgICAgICAgICAgIHk6IDExXG4gICAgICogICAgICAgICAgICB9XG4gICAgICogICAgICBdXG4gICAgICogfSk7XG4gICAgICovXG4gICAgaXNGbGljazogZnVuY3Rpb24oZXZlbnREYXRhKSB7XG4gICAgICAgIHZhciBzdGFydCA9IGV2ZW50RGF0YS5zdGFydCxcbiAgICAgICAgICAgIGVuZCA9IGV2ZW50RGF0YS5lbmQsXG4gICAgICAgICAgICBsaXN0ID0gZXZlbnREYXRhLmxpc3QsXG4gICAgICAgICAgICBmaXJzdCA9IGxpc3RbMF0sXG4gICAgICAgICAgICBmaW5hbCA9IGxpc3RbbGlzdC5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgIHRpbWVEaXN0ID0gZW5kIC0gc3RhcnQsXG4gICAgICAgICAgICB4RGlzdCA9IE1hdGguYWJzKGZpcnN0LnggLSBmaW5hbC54KSxcbiAgICAgICAgICAgIHlEaXN0ID0gTWF0aC5hYnMoZmlyc3QueSAtIGZpbmFsLnkpLFxuICAgICAgICAgICAgaXNGbGljaztcblxuICAgICAgICBpZiAodGltZURpc3QgPCB0aGlzLmZsaWNrVGltZSB8fCB4RGlzdCA+IHRoaXMuZmxpY2tSYW5nZSB8fCB5RGlzdCA+IHRoaXMuZmxpY2tSYW5nZSkge1xuICAgICAgICAgICAgaXNGbGljayA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc0ZsaWNrID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNGbGljaztcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZsaWNrO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IGRpc2NyaW1pbmF0ZSBsb25nIHRhYiBldmVudFxuICogQGF1dGhvciBOSE4gZW50ZXJ0YWlubWVudCBGRSBkZXYgdGVhbS4gSmVpbiBZaTxqZWluLnlpQG5obmVudC5jb20+XG4gKi9cblxuLyoqXG4gKiBNb2R1bGVzIG9mIERpc2NyaW1pbmF0aW9uIGxvbmd0YWJcbiAqIEBuYW1lc3BhY2UgTG9uZ1RhYlxuICovXG52YXIgTG9uZ1RhYiA9IC8qKiBAbGVuZHMgTG9uZ1RhYiAqL3tcbiAgICAvKipcbiAgICAgKiB3aWR0aCBpcyBjb25zaWRlcmVkIG1vdmluZy5cbiAgICAgKi9cbiAgICBtaW5EaXN0OiAxMCxcbiAgICAvKipcbiAgICAgKiB0YWIgdGltZXIgZm9yIGNoZWNrIGRvdWJsZSBjbGlja1xuICAgICAqL1xuICAgIHRhYlRpbWVyOiBudWxsLFxuICAgIC8qKlxuICAgICAqIGV4dHJhY3RlZCBldmVudCB0eXBlXG4gICAgICovXG4gICAgdHlwZTogJ2xvbmd0YWInLFxuICAgIC8qKlxuICAgICAqIGxvbmcgdGFiIHRlcm1cbiAgICAgKi9cbiAgICBsb25nVGFiVGVybTogNjAwLFxuICAgIC8qKlxuICAgICAqIHNldCBvcHRpb25zXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvblxuICAgICAqICAgICAgQHBhcmFtIHtudW1iZXJ9IFtvcHRpb24ubWluRGlzdF0gZGlzdGFuY2UgdG8gY2hlY2sgbW92ZW1lbnRcbiAgICAgKiAgICAgIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9uLmxvbmdUYWJUZXJtXSBUZXJtIGZvciBjaGVja2luZyBsb25ndGFiXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHRoaXMubWluRGlzdCA9IG9wdGlvbi5mbGlja1RpbWUgfHwgdGhpcy5taW5EaXN0O1xuICAgICAgICB0aGlzLmxvbmdUYWJUZXJtID0gb3B0aW9uLmxvbmdUYWJUZXJtIHx8IHRoaXMubG9uZ1RhYlRlcm07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IGRldGVjdCBsb25ndGFiIHJvb3AsIElmIHRvdWNoc3RvcCBldmVudCBkb2VzIG5vdCBmaXJlIGFuZCBwb3NpdGlvbiBhcmUgc2FtZSwgcnVuIGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBvcyBwb3NpdGlvbiB0byBzdGFydFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICovXG4gICAgc3RhcnRUYWI6IGZ1bmN0aW9uKHBvcykge1xuICAgICAgICB0aGlzLmlzTG9uZ3RhYmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMubG9uZ1RhYlBvcyA9IHBvcztcbiAgICAgICAgdGhpcy50YWJUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KHR1aS51dGlsLmJpbmQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmlzTG9uZ3RhYmVkID0gdHJ1ZTtcbiAgICAgICAgfSwgdGhpcyksIHRoaXMubG9uZ1RhYlRlcm0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wIGRldGVjdCBsb25ndGFiIHJvb3AuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBvcyBBIHBvc2l0aW9uIHRvIGVuZFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIEEgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBpc0xvbmdUYWI6IGZ1bmN0aW9uKHBvcywgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGlzU2FmZVgsXG4gICAgICAgICAgICBpc1NhZmVZLFxuICAgICAgICAgICAgaXNMb25ndGFiID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmlzTG9uZ3RhYmVkKSB7XG4gICAgICAgICAgICBpc1NhZmVYID0gTWF0aC5hYnModGhpcy5sb25nVGFiUG9zLnggLSBwb3MueCkgPCB0aGlzLm1pbkRpc3Q7XG4gICAgICAgICAgICBpc1NhZmVZID0gTWF0aC5hYnModGhpcy5sb25nVGFiUG9zLnkgLSBwb3MueSkgPCB0aGlzLm1pbkRpc3Q7XG4gICAgICAgICAgICBpZiAoaXNTYWZlWCAmJiBpc1NhZmVZKSB7XG4gICAgICAgICAgICAgICAgaXNMb25ndGFiID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wVGFiKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzTG9uZ3RhYjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RvcCBsb25nIHRhYiBjaGVja1xuICAgICAqL1xuICAgIHN0b3BUYWI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmlzTG9uZ3RhYmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVzZXRUaW1lcigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBjbGVhciBjbGlja1RpbWVyXG4gICAgICovXG4gICAgcmVzZXRUaW1lcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50YWJUaW1lcik7XG4gICAgICAgIHRoaXMudGFiVGltZXIgPSBudWxsO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTG9uZ1RhYjtcbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBkaXNjcmltaW5hdGUgdHlwZSBvZiB0b3VjaCBldmVudFxuICogQGF1dGhvciBOSE4gZW50ZXJ0YWlubWVudCBGRSBkZXYgdGVhbS4gSmVpbiBZaTxqZWluLnlpQG5obmVudC5jb20+XG4gKi9cblxuXG52YXIgRmxpY2sgPSByZXF1aXJlKCcuL2ZsaWNrJyk7XG52YXIgTG9uZ1RhYiA9IHJlcXVpcmUoJy4vbG9uZ3RhYicpO1xudmFyIERvdWJsZUNsaWNrID0gcmVxdWlyZSgnLi9kb3VibGVDbGljaycpO1xuXG4vKipcbiAqIFRvIGZpbmQgb3V0IGl0J3MgZmxpY2sgb3IgY2xpY2sgb3Igbm90aGluZyBmcm9tIGV2ZW50IGRhdGFzLlxuICogQG5hbWVzcGFjZSBSZWFkZXJcbiAqIEBleGFtcGxlXG4gKiB2YXIgcmVhZGVyID0gbmV3IHR1aS5jb21wb25lbnQuR2VzdHVyZS5SZWFkZXIoe1xuICogICAgICB0eXBlIDogJ2ZsaWNrJyB8fCAnbG9uZ3RhYicgfHwgJ2RvdWJsZWNsaWNrJ1xuICogfSk7XG4gKi9cbnZhciBSZWFkZXIgPSB0dWkudXRpbC5kZWZpbmVDbGFzcygvKiogQGxlbmRzIFJlYWRlci5wcm90b3R5cGUgKi97XG4gICAgLyoqXG4gICAgICogc2V0IG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uXG4gICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIGlmIChvcHRpb24udHlwZSA9PT0gJ2ZsaWNrJykge1xuICAgICAgICAgICAgdHVpLnV0aWwuZXh0ZW5kKHRoaXMsIEZsaWNrKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb24udHlwZSA9PT0gJ2xvbmd0YWInKSB7XG4gICAgICAgICAgICB0dWkudXRpbC5leHRlbmQodGhpcywgTG9uZ1RhYik7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9uLnR5cGUgPT09ICdkYmNsaWNrJykge1xuICAgICAgICAgICAgdHVpLnV0aWwuZXh0ZW5kKHRoaXMsIERvdWJsZUNsaWNrKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRpYWxpemUob3B0aW9uKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFkZXI7XG4iXX0=
