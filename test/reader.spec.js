'use strict';

var Reader = require('../src/js/reader');
var snippet = require('tui-code-snippet');

describe('GestureReader Option', function() {
    // hostnameSent module scope variable can not be reset.
    // maintain cases with xit as it always fail, if you want to test these cases, change xit to fit one by one
    describe('usageStatistics', function() {
        var reader; // eslint-disable-line no-unused-vars

        beforeEach(function() {
            spyOn(snippet, 'sendHostname');
        });

        xit('should send hostname by default', function() {
            reader = new Reader({
                type: 'dblclick'
            });

            expect(snippet.sendHostname).toHaveBeenCalled();
        });

        xit('should not send hostname on usageStatistics option false', function() {
            reader = new Reader({
                type: 'dblclick',
                usageStatistics: false
            });

            expect(snippet.sendHostname).not.toHaveBeenCalled();
        });
    });
});
