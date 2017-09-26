/**
 * @fileoverview Discriminate long tab event
 * @author NHN Ent. FE dev Lab. <dl_javascript@nhnent.com>
 */

'use strict';

var snippet = require('tui-code-snippet');

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
