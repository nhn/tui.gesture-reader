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
