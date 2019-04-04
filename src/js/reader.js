/**
 * @fileoverview Discriminate type of touch event
 * @author NHN. FE dev Lab. <dl_javascript@nhn.com>
 */

'use strict';

var snippet = require('tui-code-snippet');

var Flick = require('./flick');
var LongTab = require('./longtab');
var DoubleClick = require('./doubleClick');

var hostnameSent = false;

/**
 * To find out it's flick or click or nothing from event datas.
 * @class Reader
 * @param {object} options
 *     @param {string} options.type - 'flick', 'longtab', 'dblclick'
 *     @param {number} [options.clickTerm] - (DoubleClick) Available time distance between first and second click event.
 *     @param {number} [options.maxDist] - (DoubleClick) Available movement distance
 *     @param {number} [options.flickTime] - (Flick) If in this time, do not check move distance
 *     @param {number} [options.flickRange] - (Flick) If not in time, compare move distance with flick ragne.
 *     @param {number} [options.longTabTerm] - (LongTab) Term for checking longtab
 *     @param {number} [options.minDist] - (Flick, LongTab) Minimum distance for check available movement.
 *     @param {boolean} [options.usageStatistics=true] - Let us know the hostname. If you don't want to send the hostname, please set to false.
 * @example
 * var GestureReader = tui.GestureReader; // or require('tui-gesture-reader');
 * var instance = new GestureReader({
 *      type: 'flick'
 * });
 */
var Reader = snippet.defineClass(/** @lends Reader.prototype */{
    init: function(options) {
        options = snippet.extend({
            usageStatistics: true
        }, options);

        if (options.type === 'flick') {
            snippet.extend(this, Flick);
        } else if (options.type === 'longtab') {
            snippet.extend(this, LongTab);
        } else if (options.type === 'dblclick') {
            snippet.extend(this, DoubleClick);
        }
        this.initialize(options);

        if (options.usageStatistics) {
            sendHostname();
        }
    }
});

/**
 * send hostname
 * @ignore
 */
function sendHostname() {
    if (hostnameSent) {
        return;
    }
    hostnameSent = true;

    snippet.sendHostname('gesture-reader', 'UA-129987462-1');
}

module.exports = Reader;
