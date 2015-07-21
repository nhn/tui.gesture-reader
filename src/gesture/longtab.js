/**
 * @fileoverview discriminate longtab event
 */

ne.util.defineNamespace('ne.component.Gesture.Reader.LongTab');

/**
 * Modules of Discrimination longtab
 * @namespace ne.component.Gesture.Reader.LongTab
 */
ne.component.Gesture.Reader.LongTab = /** @lends ne.component.Gesture.Reader.LongTab */{
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
     *      @param {number} [option.flickTime] time to check flick
     *      @param {number} [option.flickRange] range to check flick
     *      @param {number} [option.clickTime] time to check click
     *      @param {number} [option.minDist] distance to check movement
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
     * @param {object} pos position to end
     * @param {function} callback
     * @return
     * @example
     * reader.isLongTab({
     *      x: 10,
     *      y: 10
     * }, function() {
     *      showMenu();
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