(function() {
/**
 * @fileoverview discriminate type of touch event
 * @author NHN entertainment FE dev team. Jein Yi<jein.yi@nhnent.com>
 */

ne.util.defineNamespace('ne.component.Gesture');

/**
 * To find out it's flick or click or nothing from event datas.
 * @namespace ne.component.Gesture.Reader
 * @example
 * var reader = new ne.component.Gesture.Reader({
 *      type : 'flick' || 'longtab' || 'doubleclick'
 * });
 */
ne.component.Gesture.Reader = ne.util.defineClass(/** @lends ne.component.Gesture.Reader.prototype */{
    /**
     * set options
     * @param {object} option
     */
    init: function(option) {
        if (option.type === 'flick') {
            ne.util.extend(this, ne.component.Gesture.Reader.Flick);
        } else if (option.type === 'longtab') {
            ne.util.extend(this, ne.component.Gesture.Reader.LongTab);
        } else if (option.type === 'dbclick') {
            ne.util.extend(this, ne.component.Gesture.Reader.DoubleClick);
        }
        this.initialize(option);
    }
});
/**
 * @fileoverview discriminate doubleclick event
 * @author NHN entertainment FE dev team. Jein Yi<jein.yi@nhnent.com>
 */

ne.util.defineNamespace('ne.component.Gesture.Reader.DoubleClick');

/**
 * Modules of Discrimination double click
 * @namespace ne.component.Gesture.Reader.DoubleClick
 */
ne.component.Gesture.Reader.DoubleClick = /**@lends ne.component.Gesture.Reader.DoubleClick */{
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
/**
 * @fileoverview discriminate flick event
 * @author NHN entertainment FE dev team. Jein Yi<jein.yi@nhnent.com>
 */

ne.util.defineNamespace('ne.component.Gesture.Reader.Flick');

/**
 * Modules of Discrimination flick
 * @namespace ne.component.Gesture.Reader.Flick
 */
ne.component.Gesture.Reader.Flick = /** @lends ne.component.Gesture.Reader.Flick */{
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
/**
 * @fileoverview discriminate long tab event
 * @author NHN entertainment FE dev team. Jein Yi<jein.yi@nhnent.com>
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
})();