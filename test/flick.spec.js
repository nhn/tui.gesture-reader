'use strict';

var Reader = require('../src/js/reader');

describe('Test gesture reader - flick case', function() {
    var reader, event, pointList;

    beforeEach(function() {
        var i = 0;

        pointList = [];
        reader = new Reader({
            type: 'flick'
        });
        event = {};
        event.start = new Date() - 1000;
        event.end = new Date() - 1;

        for (; i < 200; i += 1) {
            pointList.push({
                x: 10 + (i + i),
                y: i
            });
        }
        event.list = pointList;
    });

    it('reader.flick is created', function() {
        expect(reader.type).toBe('flick');
    });

    describe('test cardinal Points', function() {
        it('figure out cardinal points, SE', function() {
            var first = {
                x: 10,
                y: 10
            };
            var final = {
                x: 60,
                y: 30
            };
            var cardinalPoints = reader.getCardinalPoints(first, final);

            expect(cardinalPoints).toBe('SE');
        });

        it('figure out cardinal points, NW', function() {
            var first = {
                x: 60,
                y: 100
            };
            var final = {
                x: 10,
                y: 30
            };
            var cardinalPoints = reader.getCardinalPoints(first, final);

            expect(cardinalPoints).toBe('NW');
        });

        it('figure out cardinal points, N', function() {
            var first = {
                x: 60,
                y: 100
            };
            var final = {
                x: 60,
                y: 30
            };
            var cardinalPoints = reader.getCardinalPoints(first, final);

            expect(cardinalPoints).toBe('N');
        });

        it('figure out cardinal points, E', function() {
            var first = {
                x: 30,
                y: 100
            };
            var final = {
                x: 100,
                y: 100
            };
            var cardinalPoints = reader.getCardinalPoints(first, final);

            expect(cardinalPoints).toBe('E');
        });

        it('figure out nearest four points(W,E,S,N)', function() {
            var first = {
                x: 30,
                y: 100
            };
            var final = {
                x: 100,
                y: 250
            };
            var cardinalPoint = reader.getCardinalPoints(first, final);
            var nearestPoint = reader.getCloseCardinal(first, final, cardinalPoint);

            expect(nearestPoint).toBe('S');
        });

        it('figure out nearest four points(W,E,S,N)', function() {
            var first = {
                x: 250,
                y: 0
            };
            var final = {
                x: 10,
                y: 150
            };
            var cardinalPoint = reader.getCardinalPoints(first, final);
            var nearestPoint = reader.getCloseCardinal(first, final, cardinalPoint);

            expect(nearestPoint).toBe('W');
        });

        it('figure out nearest four points(W,E,S,N)', function() {
            var first = {
                x: 10,
                y: 250
            };
            var final = {
                x: 100,
                y: 100
            };
            var cardinalPoint = reader.getCardinalPoints(first, final);
            var nearestPoint = reader.getCloseCardinal(first, final, cardinalPoint);

            expect(nearestPoint).toBe('N');
        });

        it('figure out nearest four point(W,E,S,N), use get direction.', function() {
            var result = reader.getDirection(pointList);
            expect(result).toBe('E');
        });
    });

    describe('test event type', function() {
        it('flick event uprise.', function() {
            expect(reader.isFlick(event)).toBe(true);
        });

        it('flick event uprise.', function() {
            event.start = 1000;
            event.end = 1005;
            expect(reader.isFlick(event)).toBe(true);
        });

        it('ignore event(return none)', function() {
            event.start = 10000;
            event.end = 11000;
            event.list.push({
                x: 11,
                y: 5
            });
            expect(reader.isFlick(event)).toBe(false);
        });

        it('ignore event(return none)', function() {
            event.start = 10000;
            event.end = 11000;
            event.list.push({
                x: 100,
                y: 100
            });
            expect(reader.isFlick(event)).toBe(false);
        });
    });
});
