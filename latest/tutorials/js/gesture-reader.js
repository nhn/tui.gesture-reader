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
        this.clickTimer = window.setTimeout(ne.util.bind(function() {
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

        direction = ne.util.getDuplicatedChar(direction, cardinalPoint);
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
        this.tabTimer = window.setTimeout(ne.util.bind(function() {
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
 * var reader = new ne.component.Gesture.Reader({
 *      type : 'flick' || 'longtab' || 'doubleclick'
 * });
 */
var Reader = ne.util.defineClass(/** @lends Reader.prototype */{
    /**
     * set options
     * @param {object} option
     */
    init: function(option) {
        if (option.type === 'flick') {
            ne.util.extend(this, Flick);
        } else if (option.type === 'longtab') {
            ne.util.extend(this, LongTab);
        } else if (option.type === 'dbclick') {
            ne.util.extend(this, DoubleClick);
        }
        this.initialize(option);
    }
});

module.exports = Reader;

},{"./doubleClick":2,"./flick":3,"./longtab":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9qcy9kb3VibGVDbGljay5qcyIsInNyYy9qcy9mbGljay5qcyIsInNyYy9qcy9sb25ndGFiLmpzIiwic3JjL2pzL3JlYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJuZS51dGlsLmRlZmluZU5hbWVzcGFjZSgnbmUuY29tcG9uZW50Lkdlc3R1cmUuUmVhZGVyJywgcmVxdWlyZSgnLi9zcmMvanMvcmVhZGVyJykpO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IGRpc2NyaW1pbmF0ZSBkb3VibGVjbGljayBldmVudFxuICogQGF1dGhvciBOSE4gZW50ZXJ0YWlubWVudCBGRSBkZXYgdGVhbS4gSmVpbiBZaTxqZWluLnlpQG5obmVudC5jb20+XG4gKi9cblxuLyoqXG4gKiBNb2R1bGVzIG9mIERpc2NyaW1pbmF0aW9uIGRvdWJsZSBjbGlja1xuICogQG5hbWVzcGFjZSBEb3VibGVDbGlja1xuICovXG52YXIgRG91YmxlQ2xpY2sgPSAvKipAbGVuZHMgRG91YmxlQ2xpY2sgKi97XG4gICAgLyoqXG4gICAgICogVGltZXIgZm9yIGNoZWNrIGNsaWNrIHR3aWNlIGluIHRpbWVcbiAgICAgKi9cbiAgICBjbGlja1RpbWVyOiBudWxsLFxuICAgIC8qKlxuICAgICAqIFRoZSB0eXBlIG9mIHJlYWRlclxuICAgICAqL1xuICAgIHR5cGU6ICdkYmNsaWNrJyxcbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIHNhZmUgZGlzdGFuY2VcbiAgICAgKi9cbiAgICBtYXhEaXN0OiAxMCxcbiAgICAvKipcbiAgICAgKiBBdmFpbGFibGUgZG91YmxlIGNsaWNrIHRlcm1cbiAgICAgKi9cbiAgICBjbGlja1Rlcm06IDIwMCxcbiAgICAvKipcbiAgICAgKiBGaXJzdCBjbGljayB0aW1lc3RhbXBcbiAgICAgKi9cbiAgICBzdGFydFRpbWU6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBJbml0YWlsaXplIERvdWJsZUNsaWNrIFJlYWRlclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25cbiAgICAgKiAgQHBhcmFtIHtudW1iZXJ9IFtvcHRpb24uY2xpY2tUZXJtXSBBdmFpbGFibGUgdGltZSBkaXN0YW5jZSBiZXR3ZWVuIGZpcnN0IGFuZCBzZWNvbmQgY2xpY2sgZXZlbnQuXG4gICAgICogIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9uLm1heERpc3RdIEF2YWlsYWJsZSBtb3ZlbWVudCBkaXN0YW5jZVxuICAgICAqL1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB0aGlzLmNsaWNrVGVybSA9IG9wdGlvbi5jbGlja1Rlcm0gfHwgdGhpcy5jbGlja1Rlcm07XG4gICAgICAgIHRoaXMubWF4RGlzdCA9IG9wdGlvbi5tYXhEaXN0IHx8IHRoaXMubWF4RGlzdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgY2xpY2sgb3IgZG91YmxlIGNsaWNrXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVEaXN0IGRpc3RhbmNlIGZyb20gbW91c2Vkb3duL3RvdWNoc3RhcnQgdG8gbW91c2V1cC90b3VjaGVuZFxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByZWFkZXIuaXNEb3VibGVDbGljayh7XG4gICAgICogICAgICB4OiAxMCxcbiAgICAgKiAgICAgIHk6IDEwXG4gICAgICogfSk7XG4gICAgICovXG4gICAgaXNEb3VibGVDbGljazogZnVuY3Rpb24ocG9zKSB7XG4gICAgICAgIHZhciB0aW1lID0gbmV3IERhdGUoKSxcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5zdGFydFRpbWUsXG4gICAgICAgICAgICBpc0RvdWJsZUNsaWNrO1xuICAgICAgICBpZiAoc3RhcnQgJiYgdGhpcy5pc0F2YWlsYWJsZVpvbmUocG9zKSkge1xuICAgICAgICAgICAgdGhpcy5jbGVhclRpbWVyKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG51bGw7XG4gICAgICAgICAgICBpc0RvdWJsZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGltZXIoKTtcbiAgICAgICAgICAgIHRoaXMucG9zID0gcG9zO1xuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSB0aW1lO1xuICAgICAgICAgICAgaXNEb3VibGVDbGljayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc0RvdWJsZUNsaWNrO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb21wYXJlIHdpdGggc2F2ZWQgcG9zaXRpb24gdG8gc2FmZSB6b25lXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBvcyBQb3NpdGlvbiB0byBjb21wYXJlIHdpdGggc2F2ZWQgcG9zaXRpb25cbiAgICAgKi9cbiAgICBpc0F2YWlsYWJsZVpvbmU6IGZ1bmN0aW9uKHBvcykge1xuICAgICAgICB2YXIgaXNBdmFpbFggPSBNYXRoLmFicyh0aGlzLnBvcy54IC0gcG9zLngpIDwgdGhpcy5tYXhEaXN0LFxuICAgICAgICAgICAgaXNBdmFpbFkgPSBNYXRoLmFicyh0aGlzLnBvcy55IC0gcG9zLnkpIDwgdGhpcy5tYXhEaXN0O1xuXG4gICAgICAgIHJldHVybiBpc0F2YWlsWCAmJiBpc0F2YWlsWTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHRpbWVyIHRvIGNoZWNrIGNsaWNrIHRlcm1cbiAgICAgKi9cbiAgICBzZXRUaW1lcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY2xpY2tUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KG5lLnV0aWwuYmluZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbnVsbDtcbiAgICAgICAgfSwgdGhpcyksIHRoaXMuY2xpY2tUZXJtKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2xlYXIgdGltZXJcbiAgICAgKi9cbiAgICBjbGVhclRpbWVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmNsaWNrVGltZXIpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRG91YmxlQ2xpY2s7XG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgZGlzY3JpbWluYXRlIGZsaWNrIGV2ZW50XG4gKiBAYXV0aG9yIE5ITiBlbnRlcnRhaW5tZW50IEZFIGRldiB0ZWFtLiBKZWluIFlpPGplaW4ueWlAbmhuZW50LmNvbT5cbiAqL1xuXG4vKipcbiAqIE1vZHVsZXMgb2YgRGlzY3JpbWluYXRpb24gZmxpY2tcbiAqIEBuYW1lc3BhY2UgRmxpY2tcbiAqL1xudmFyIEZsaWNrID0gLyoqIEBsZW5kcyBGbGljayAqL3tcbiAgICAvKipcbiAgICAgKiB0aW1lIGlzIGNvbnNpZGVyZWQgZmxpY2suXG4gICAgICovXG4gICAgZmxpY2tUaW1lOiAxMDAsXG4gICAgLyoqXG4gICAgICogd2lkdGggaXMgY29uc2lkZXJlZCBmbGljay5cbiAgICAgKi9cbiAgICBmbGlja1JhbmdlOiAzMDAsXG4gICAgLyoqXG4gICAgICogd2lkdGggaXMgY29uc2lkZXJlZCBtb3ZpbmcuXG4gICAgICovXG4gICAgbWluRGlzdDogMTAsXG4gICAgLyoqXG4gICAgICogUmVhZGVyIHR5cGVcbiAgICAgKi9cbiAgICB0eXBlOiAnZmxpY2snLFxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBGbGlja2luZ1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb24gRmxpY2sgb3B0aW9uc1xuICAgICAqICBAcGFyYW0ge251bWJlcn0gW29wdGlvbi5mbGlja1RpbWVdIEZsaWNrIHRpbWUsIGlmIGluIHRoaXMgdGltZSwgZG8gbm90IGNoZWNrIG1vdmUgZGlzdGFuY2VcbiAgICAgKiAgQHBhcmFtIHtudW1iZXJ9IFtvcHRpb24uZmxpY2tSYW5nZV0gRmxpY2sgcmFuZ2UsIGlmIG5vdCBpbiB0aW1lLCBjb21wYXJlIG1vdmUgZGlzdGFuY2Ugd2l0aCBmbGljayByYWduZS5cbiAgICAgKiAgQHBhcmFtIHtudW1iZXJ9IFtvcHRpb24ubWluRGlzdF0gTWluaW11bSBkaXN0YW5jZSBmb3IgY2hlY2sgYXZhaWxhYmxlIG1vdmVtZW50LlxuICAgICAqL1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB0aGlzLmZsaWNrVGltZSA9IG9wdGlvbi5mbGlja1RpbWUgfHwgdGhpcy5mbGlja1RpbWU7XG4gICAgICAgIHRoaXMuZmxpY2tSYW5nZSA9IG9wdGlvbi5mbGlja1JhbmdlIHx8IHRoaXMuZmxpY2tSYW5nZTtcbiAgICAgICAgdGhpcy5taW5EaXN0ID0gb3B0aW9uLm1pbkRpc3QgfHwgdGhpcy5taW5EaXN0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwaWNrIGV2ZW50IHR5cGUgZnJvbSBldmVudERhdGFcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnREYXRhIGV2ZW50IERhdGFcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICovXG4gICAgZmlndXJlOiBmdW5jdGlvbihldmVudERhdGEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA6IHRoaXMuZ2V0RGlyZWN0aW9uKGV2ZW50RGF0YS5saXN0KSxcbiAgICAgICAgICAgIGlzRmxpY2s6IHRoaXMuaXNGbGljayhldmVudERhdGEpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGRpcmVjdGlvbiBmaWd1cmVkIG91dFxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGxpc3QgZXZlbnRQb2ludCBMaXN0XG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXREaXJlY3Rpb246IGZ1bmN0aW9uKGxpc3QpIHtcbiAgICAgICAgdmFyIGZpcnN0ID0gbGlzdFswXSxcbiAgICAgICAgICAgIGZpbmFsID0gbGlzdFtsaXN0Lmxlbmd0aC0xXSxcbiAgICAgICAgICAgIGNhcmRpbmFsUG9pbnQgPSB0aGlzLmdldENhcmRpbmFsUG9pbnRzKGZpcnN0LCBmaW5hbCksXG4gICAgICAgICAgICByZXMgPSB0aGlzLmdldENsb3NlQ2FyZGluYWwoZmlyc3QsIGZpbmFsLCBjYXJkaW5hbFBvaW50KTtcblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGNhcmRpbmFsIHBvaW50cyBmaWd1cmVkIG91dFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmaXJzdCBzdGFydCBwb2ludFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsYXN0IGVuZCBwb2ludFxuICAgICAqL1xuICAgIGdldENhcmRpbmFsUG9pbnRzOiBmdW5jdGlvbihmaXJzdCwgbGFzdCkge1xuICAgICAgICB2YXIgdmVydGljYWxEaXN0ID0gZmlyc3QueSAtIGxhc3QueSxcbiAgICAgICAgICAgIGhvcml6b25EaXN0ID0gZmlyc3QueCAtIGxhc3QueCxcbiAgICAgICAgICAgIE5TID0gJycsXG4gICAgICAgICAgICBXRSA9ICcnO1xuXG4gICAgICAgIGlmICh2ZXJ0aWNhbERpc3QgPCAwKSB7XG4gICAgICAgICAgICBOUyA9ICdTJztcbiAgICAgICAgfSBlbHNlIGlmICh2ZXJ0aWNhbERpc3QgPiAwKSB7XG4gICAgICAgICAgICBOUyA9ICdOJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChob3Jpem9uRGlzdCA8IDApIHtcbiAgICAgICAgICAgIFdFID0gJ0UnO1xuICAgICAgICB9IGVsc2UgaWYgKGhvcml6b25EaXN0ID4gMCkge1xuICAgICAgICAgICAgV0UgPSAnVyc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gTlMrV0U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJldHVybiBuZWFyZXN0IGZvdXIgY2FyZGluYWwgcG9pbnRzXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGZpcnN0IHN0YXJ0IHBvaW50XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGxhc3QgZW5kIHBvaW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNhcmRpbmFsUG9pbnQgY2FyZGluYWxQb2ludCBmcm9tIGdldENhcmRpbmFsUG9pbnRzXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRDbG9zZUNhcmRpbmFsOiBmdW5jdGlvbihmaXJzdCwgbGFzdCwgY2FyZGluYWxQb2ludCkge1xuICAgICAgICB2YXIgc2xvcCA9IChsYXN0LnkgLSBmaXJzdC55KSAvIChsYXN0LnggLSBmaXJzdC54KSxcbiAgICAgICAgICAgIGRpcmVjdGlvbjtcbiAgICAgICAgaWYgKHNsb3AgPCAwKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBzbG9wIDwgLTEgPyAnTlMnIDogJ1dFJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IHNsb3AgPiAxID8gJ05TJyA6ICdXRSc7XG4gICAgICAgIH1cblxuICAgICAgICBkaXJlY3Rpb24gPSBuZS51dGlsLmdldER1cGxpY2F0ZWRDaGFyKGRpcmVjdGlvbiwgY2FyZGluYWxQb2ludCk7XG4gICAgICAgIHJldHVybiBkaXJlY3Rpb247XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGV4dHJhY3QgdHlwZSBvZiBldmVudFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudERhdGEgZXZlbnQgZGF0YVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByZWFkZXIuaXNGbGljayh7XG4gICAgICogICAgICBzdGFydDogMTAwMCxcbiAgICAgKiAgICAgIGVuZDogMTEwMCxcbiAgICAgKiAgICAgIGxpc3Q6IFtcbiAgICAgKiAgICAgICAgICAgIHtcbiAgICAgKiAgICAgICAgICAgICAgICB4OiAxMCxcbiAgICAgKiAgICAgICAgICAgICAgICB5OiAxMFxuICAgICAqICAgICAgICAgICAgfSxcbiAgICAgKiAgICAgICAgICAgIHtcbiAgICAgKiAgICAgICAgICAgICAgICB4OiAxMSxcbiAgICAgKiAgICAgICAgICAgICAgICB5OiAxMVxuICAgICAqICAgICAgICAgICAgfVxuICAgICAqICAgICAgXVxuICAgICAqIH0pO1xuICAgICAqL1xuICAgIGlzRmxpY2s6IGZ1bmN0aW9uKGV2ZW50RGF0YSkge1xuICAgICAgICB2YXIgc3RhcnQgPSBldmVudERhdGEuc3RhcnQsXG4gICAgICAgICAgICBlbmQgPSBldmVudERhdGEuZW5kLFxuICAgICAgICAgICAgbGlzdCA9IGV2ZW50RGF0YS5saXN0LFxuICAgICAgICAgICAgZmlyc3QgPSBsaXN0WzBdLFxuICAgICAgICAgICAgZmluYWwgPSBsaXN0W2xpc3QubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICB0aW1lRGlzdCA9IGVuZCAtIHN0YXJ0LFxuICAgICAgICAgICAgeERpc3QgPSBNYXRoLmFicyhmaXJzdC54IC0gZmluYWwueCksXG4gICAgICAgICAgICB5RGlzdCA9IE1hdGguYWJzKGZpcnN0LnkgLSBmaW5hbC55KSxcbiAgICAgICAgICAgIGlzRmxpY2s7XG5cbiAgICAgICAgaWYgKHRpbWVEaXN0IDwgdGhpcy5mbGlja1RpbWUgfHwgeERpc3QgPiB0aGlzLmZsaWNrUmFuZ2UgfHwgeURpc3QgPiB0aGlzLmZsaWNrUmFuZ2UpIHtcbiAgICAgICAgICAgIGlzRmxpY2sgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXNGbGljayA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzRmxpY2s7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGbGljaztcbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBkaXNjcmltaW5hdGUgbG9uZyB0YWIgZXZlbnRcbiAqIEBhdXRob3IgTkhOIGVudGVydGFpbm1lbnQgRkUgZGV2IHRlYW0uIEplaW4gWWk8amVpbi55aUBuaG5lbnQuY29tPlxuICovXG5cbi8qKlxuICogTW9kdWxlcyBvZiBEaXNjcmltaW5hdGlvbiBsb25ndGFiXG4gKiBAbmFtZXNwYWNlIExvbmdUYWJcbiAqL1xudmFyIExvbmdUYWIgPSAvKiogQGxlbmRzIExvbmdUYWIgKi97XG4gICAgLyoqXG4gICAgICogd2lkdGggaXMgY29uc2lkZXJlZCBtb3ZpbmcuXG4gICAgICovXG4gICAgbWluRGlzdDogMTAsXG4gICAgLyoqXG4gICAgICogdGFiIHRpbWVyIGZvciBjaGVjayBkb3VibGUgY2xpY2tcbiAgICAgKi9cbiAgICB0YWJUaW1lcjogbnVsbCxcbiAgICAvKipcbiAgICAgKiBleHRyYWN0ZWQgZXZlbnQgdHlwZVxuICAgICAqL1xuICAgIHR5cGU6ICdsb25ndGFiJyxcbiAgICAvKipcbiAgICAgKiBsb25nIHRhYiB0ZXJtXG4gICAgICovXG4gICAgbG9uZ1RhYlRlcm06IDYwMCxcbiAgICAvKipcbiAgICAgKiBzZXQgb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25cbiAgICAgKiAgICAgIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9uLm1pbkRpc3RdIGRpc3RhbmNlIHRvIGNoZWNrIG1vdmVtZW50XG4gICAgICogICAgICBAcGFyYW0ge251bWJlcn0gW29wdGlvbi5sb25nVGFiVGVybV0gVGVybSBmb3IgY2hlY2tpbmcgbG9uZ3RhYlxuICAgICAqL1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB0aGlzLm1pbkRpc3QgPSBvcHRpb24uZmxpY2tUaW1lIHx8IHRoaXMubWluRGlzdDtcbiAgICAgICAgdGhpcy5sb25nVGFiVGVybSA9IG9wdGlvbi5sb25nVGFiVGVybSB8fCB0aGlzLmxvbmdUYWJUZXJtO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdGFydCBkZXRlY3QgbG9uZ3RhYiByb29wLCBJZiB0b3VjaHN0b3AgZXZlbnQgZG9lcyBub3QgZmlyZSBhbmQgcG9zaXRpb24gYXJlIHNhbWUsIHJ1biBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwb3MgcG9zaXRpb24gdG8gc3RhcnRcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqL1xuICAgIHN0YXJ0VGFiOiBmdW5jdGlvbihwb3MpIHtcbiAgICAgICAgdGhpcy5pc0xvbmd0YWJlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxvbmdUYWJQb3MgPSBwb3M7XG4gICAgICAgIHRoaXMudGFiVGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChuZS51dGlsLmJpbmQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmlzTG9uZ3RhYmVkID0gdHJ1ZTtcbiAgICAgICAgfSwgdGhpcyksIHRoaXMubG9uZ1RhYlRlcm0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wIGRldGVjdCBsb25ndGFiIHJvb3AuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBvcyBBIHBvc2l0aW9uIHRvIGVuZFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIEEgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBpc0xvbmdUYWI6IGZ1bmN0aW9uKHBvcywgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGlzU2FmZVgsXG4gICAgICAgICAgICBpc1NhZmVZLFxuICAgICAgICAgICAgaXNMb25ndGFiID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmlzTG9uZ3RhYmVkKSB7XG4gICAgICAgICAgICBpc1NhZmVYID0gTWF0aC5hYnModGhpcy5sb25nVGFiUG9zLnggLSBwb3MueCkgPCB0aGlzLm1pbkRpc3Q7XG4gICAgICAgICAgICBpc1NhZmVZID0gTWF0aC5hYnModGhpcy5sb25nVGFiUG9zLnkgLSBwb3MueSkgPCB0aGlzLm1pbkRpc3Q7XG4gICAgICAgICAgICBpZiAoaXNTYWZlWCAmJiBpc1NhZmVZKSB7XG4gICAgICAgICAgICAgICAgaXNMb25ndGFiID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wVGFiKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzTG9uZ3RhYjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RvcCBsb25nIHRhYiBjaGVja1xuICAgICAqL1xuICAgIHN0b3BUYWI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmlzTG9uZ3RhYmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVzZXRUaW1lcigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBjbGVhciBjbGlja1RpbWVyXG4gICAgICovXG4gICAgcmVzZXRUaW1lcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50YWJUaW1lcik7XG4gICAgICAgIHRoaXMudGFiVGltZXIgPSBudWxsO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTG9uZ1RhYjtcbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBkaXNjcmltaW5hdGUgdHlwZSBvZiB0b3VjaCBldmVudFxuICogQGF1dGhvciBOSE4gZW50ZXJ0YWlubWVudCBGRSBkZXYgdGVhbS4gSmVpbiBZaTxqZWluLnlpQG5obmVudC5jb20+XG4gKi9cblxuXG52YXIgRmxpY2sgPSByZXF1aXJlKCcuL2ZsaWNrJyk7XG52YXIgTG9uZ1RhYiA9IHJlcXVpcmUoJy4vbG9uZ3RhYicpO1xudmFyIERvdWJsZUNsaWNrID0gcmVxdWlyZSgnLi9kb3VibGVDbGljaycpO1xuXG4vKipcbiAqIFRvIGZpbmQgb3V0IGl0J3MgZmxpY2sgb3IgY2xpY2sgb3Igbm90aGluZyBmcm9tIGV2ZW50IGRhdGFzLlxuICogQG5hbWVzcGFjZSBSZWFkZXJcbiAqIEBleGFtcGxlXG4gKiB2YXIgcmVhZGVyID0gbmV3IG5lLmNvbXBvbmVudC5HZXN0dXJlLlJlYWRlcih7XG4gKiAgICAgIHR5cGUgOiAnZmxpY2snIHx8ICdsb25ndGFiJyB8fCAnZG91YmxlY2xpY2snXG4gKiB9KTtcbiAqL1xudmFyIFJlYWRlciA9IG5lLnV0aWwuZGVmaW5lQ2xhc3MoLyoqIEBsZW5kcyBSZWFkZXIucHJvdG90eXBlICove1xuICAgIC8qKlxuICAgICAqIHNldCBvcHRpb25zXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvblxuICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICBpZiAob3B0aW9uLnR5cGUgPT09ICdmbGljaycpIHtcbiAgICAgICAgICAgIG5lLnV0aWwuZXh0ZW5kKHRoaXMsIEZsaWNrKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb24udHlwZSA9PT0gJ2xvbmd0YWInKSB7XG4gICAgICAgICAgICBuZS51dGlsLmV4dGVuZCh0aGlzLCBMb25nVGFiKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb24udHlwZSA9PT0gJ2RiY2xpY2snKSB7XG4gICAgICAgICAgICBuZS51dGlsLmV4dGVuZCh0aGlzLCBEb3VibGVDbGljayk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplKG9wdGlvbik7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhZGVyO1xuIl19
