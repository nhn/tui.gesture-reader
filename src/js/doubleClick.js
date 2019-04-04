/**
 * @fileoverview Discriminate doubleclick event
 * @author NHN. FE dev Lab. <dl_javascript@nhn.com>
 */

'use strict';

var snippet = require('tui-code-snippet');

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
