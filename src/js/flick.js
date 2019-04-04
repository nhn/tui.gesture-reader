/**
 * @fileoverview Discriminate flick event
 * @author NHN. FE dev Lab. <dl_javascript@nhn.com>
 */

'use strict';

var snippet = require('tui-code-snippet');

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
