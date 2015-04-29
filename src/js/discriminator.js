/**
 * @fileoverview discriminate type of touch event
 */

if (!ne.component) {
    ne.component = {};
}

(function(exports) {

    /**
     * To find out it's flick or click or nothing from event datas.
     * @namespace ne.component.Discriminator
     */
    exports.Discriminator = ne.util.defineClass(/** @lends ne.component.Discriminator.prototype */{
        /**
         * time is considered flick.
         */
        flickTime: 100,
        /**
         * width is considered flick.
         */
        flickRange: 300,
        /**
         * time is considered click
         */
        clickTime: 200,
        /**
         * width is considered moving.
         */
        minDist: 10,
        /**
         * click timer for check double click
         */
        clickTimer: null,
        /**
         * extracted event type
         */
        type: null,
        /**
         * set options
         * @param option
         */
        init: function(option) {
            this.flickTime = option.flickTime || this.flickTime;
            this.flickRange = option.flickRange || this.flickRange;
            this.clickTime = option.clickTime || this.clickTime;
            this.minDist = option.minDist || this.minDist;
        },
        static: {

        },
        /**
         * pick event type from eventData
         * @param {object} eventData event Data
         * @return {object}
         */
        figure: function(eventData) {
            var direction = this.getDirection(eventData.list);
            this.extractType(eventData);
            return {
                direction : direction,
                type: this.type
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
                res = this.getNearestPoint(first, final, cardinalPoint);

            return res;
        },
        /**
         * return cardinal points figured out
         * @param {object} p1 start point
         * @param {object} p2 end point
         */
        getCardinalPoints: function(p1, p2) {
            var verticalDist = p1.y - p2.y,
                horizonDist = p1.x - p2.x,
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
         * @param {object} p1 start point
         * @param {object} p2 end point
         * @param {string} cardinalPoint cardinalPoint from getCardinalPoints
         * @returns {string}
         */
        getNearestPoint: function(p1, p2, cardinalPoint) {
            var slop = (p2.y - p1.y) / (p2.x - p1.x),
                direction;
            if (slop < 0) {
                direction = slop < -1 ? 'NS' : 'WE';
            } else {
                direction = slop > 1 ? 'NS' : 'WE';
            }

            direction = this.getDuplicate(direction, cardinalPoint);
            return direction;
        },
        /**
         * return duplicate charters
         * @param {string} str1 compared charters
         * @param {string} str2 compared charters
         * @returns {string}
         */
        getDuplicate: function(str1, str2) {
            var dupl,
                key,
                i = 0,
                len = str1.length,
                pool = {};

            // save opered charaters
            for (; i < len; i++) {
                key = str1.charAt(i);
                pool[key] = 1;
            }

            // change saved flag if charater exist in pool
            for (i = 0, len = str2.length; i < len; i++) {
                key = str2.charAt(i);
                pool[key] = pool[key] ? 2 : 1;
            }

            pool = ne.util.filter(pool, function(item) {
                return item === 2;
            });
            dupl = ne.util.keys(pool).join('');

            return dupl;
        },
        /**
         * extract type of event
         * @param {object} eventData event data
         * @returns {string}
         * @example
         * discriminator.extractType({
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
        extractType: function(eventData) {
            var start = eventData.start,
                end = eventData.end,
                list = eventData.list,
                first = list[0],
                final = list[list.length - 1],
                timeDist = end - start,
                xDist = Math.abs(first.x - final.x),
                yDist = Math.abs(first.y - final.y);

            // compare dist with minDist
            if (xDist < this.minDist && yDist < this.minDist) {
                this.checkClick(timeDist);
                return;
            }

            // speed check and dist with flickRange
            if (timeDist < this.flickTime || xDist > this.flickRange || yDist > this.flickRange) {
                this.type = 'flick';
                return;
            }

            this.type = 'none';
        },
        /**
         * check click or double click
         * @param {number} timeDist distance from mousedown/touchstart to mouseup/touchend
         * @returns {*}
         */
        checkClick: function(timeDist) {
            var self = this;
            if (timeDist < this.clickTime) {
                if (this.clickTimer) {
                    this.resetTimer();
                    this.type = 'dbclick';
                } else {
                    this.type = 'click';
                    this.clickTimer = window.setTimeout(function () {
                        self.resetTimer();
                    }, this.clickTime);
                }
            } else {
                this.type = 'none';
            }
        },
        /**
         * clear clickTimer
         */
        resetTimer: function() {
            window.clearTimeout(this.clickTimer);
            this.clickTimer = null;
        }
    });

})(ne.component);