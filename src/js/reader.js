/**
 * @fileoverview discriminate type of touch event
 * @author NHN entertainment FE dev team. Jein Yi<jein.yi@nhnent.com>
 */


var Flick = require('./flick');
var LongTab = require('./longtab');
var DoubleClick = require('./doubleClick');

/**
 * To find out it's flick or click or nothing from event datas.
 * @class Reader
 * @param {object} option
 *  @param {string} option.type - 'flick', 'longtab', 'dbclick'
 *  @param {number} [option.clickTerm] (DoubleClick) Available time distance between first and second click event.
 *  @param {number} [option.maxDist] (DoubleClick) Available movement distance
 *  @param {number} [option.flickTime] (Flick) If in this time, do not check move distance
 *  @param {number} [option.flickRange] (Flick) If not in time, compare move distance with flick ragne.
 *  @param {number} [option.longTabTerm] (LongTab) Term for checking longtab
 *  @param {number} [option.minDist] (Flick, LongTab) Minimum distance for check available movement.
 * @example
 * var reader = new tui.component.Gesture.Reader({
 *      type : 'flick'
 * });
 * @tutorial sample1
 * @tutorial sample1_1
 * @tutorial sample2
 * @tutorial sample3
 * @tutorial sample4
 */
var Reader = tui.util.defineClass(/** @lends Reader.prototype */{
    /**
     * set options
     * @ignore
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
