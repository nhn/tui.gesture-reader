/**
 * @fileoverview discriminate flick event
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