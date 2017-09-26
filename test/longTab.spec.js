'use strict';

var Reader = require('../src/js/reader');

describe('Test gesture reader - longtab case', function() {
    var reader;

    beforeEach(function() {
        reader = new Reader({
            type: 'longtab',
            longTabTerm: 400
        });
    });

    it('reader.longtab is created', function() {
        expect(reader.type).toBe('longtab');
    });

    describe('reader.longtab check', function() {
        it('isLongTab - longtab case false', function() {
            var pos = {
                x: 10,
                y: 10
            };
            var pos2 = {
                x: 15,
                y: 15
            };
            reader.startTab(pos);
            expect(reader.isLongTab(pos2)).toBe(false);
        });

        it('isLongTab - longtab case true', function(done) {
            var pos = {
                x: 10,
                y: 10
            };
            var pos2 = {
                x: 15,
                y: 15
            };
            var callback = function() {
                expect(reader.isLongTab(pos2)).toBe(true);
                done();
            };
            reader.startTab(pos);
            setTimeout(callback, 1000);
        });

        it('isLongTab - stop longtab case', function(done) {
            var pos = {
                x: 10,
                y: 10
            };
            var pos2 = {
                x: 15,
                y: 15
            };
            var callback = function() {
                expect(reader.isLongTab(pos2)).toBe(false);
                done();
            };
            reader.startTab(pos);
            reader.stopTab();
            setTimeout(callback, 1000);
        });

        it('isLongTab - longtab case with callback', function(done) {
            var pos = {
                x: 10,
                y: 10
            };
            var pos2 = {
                x: 15,
                y: 15
            };
            var executed;

            reader.startTab(pos);

            setTimeout(function() {
                expect(reader.isLongTab(pos2, function() {
                    executed = true;
                })).toBe(true);
                expect(executed).toBe(true);
                done();
            }, 1000);
        });
    });
});
