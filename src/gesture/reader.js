/**
 * @fileoverview discriminate type of touch event
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