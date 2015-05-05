describe('Test MoveDetector by touch event information.', function() {
    var movedetector;
    var pointList,
        event,
        i;

    beforeEach(function() {
        movedetector = new ne.component.MoveDetector({});
        // event mock (10, 0) -> (408, 199)
        pointList = [],
        event = {},
        i = 0;
        event.start = new Date() - 1000;
        event.end = new Date() - 1;
        for (; i < 200; i++) {
            pointList.push({ x: 10 + (i+i), y: i });
        }
        event.list = pointList;
    });

    it('movedetector is defined', function() {
        expect(movedetector).toBeDefined();
    });

    describe('test cardinal Points', function() {
        it('figure out cardinal points, SE', function() {
            var first = { x: 10, y: 10 },
                final = { x: 60, y: 30 },
                cardinalPoints;
            cardinalPoints = movedetector.getCardinalPoints(first, final);
            expect(cardinalPoints).toBe('SE');
        });

        it('figure out cardinal points, NW', function() {
            var first = { x: 60, y: 100 },
                final = { x: 10, y: 30 },
                cardinalPoints;
            cardinalPoints = movedetector.getCardinalPoints(first, final);
            expect(cardinalPoints).toBe('NW');
        });

        it('figure out cardinal points, N', function() {
            var first = { x: 60, y: 100 },
                final = { x: 60, y: 30 },
                cardinalPoints;
            cardinalPoints = movedetector.getCardinalPoints(first, final);
            expect(cardinalPoints).toBe('N');
        });

        it('figure out cardinal points, E', function() {
            var first = { x: 30, y: 100 },
                final = { x: 100, y: 100 },
                cardinalPoints;
            cardinalPoints = movedetector.getCardinalPoints(first, final);
            expect(cardinalPoints).toBe('E');
        });

        it('get duplicated charaters, between strings', function() {
            var str1 = 'asdf',
                str2 = 'kbga',
                dupl = movedetector._getDuplicatedString(str1, str2);

            expect(dupl).toBe('a');
        });

        it('figure out nearest four points(W,E,S,N)', function() {
            var first = { x: 30, y: 100 },
                final = { x: 100, y : 250 },
                cardinalPoint = movedetector.getCardinalPoints(first, final),
                nearestPoint = movedetector.getNearestPoint(first, final, cardinalPoint);

            expect(nearestPoint).toBe('S');

        });

        it('figure out nearest four points(W,E,S,N)', function() {
            var first = { x: 250, y: 0 },
                final = { x: 10, y : 150 },
                cardinalPoint = movedetector.getCardinalPoints(first, final),
                nearestPoint = movedetector.getNearestPoint(first, final, cardinalPoint);

            expect(nearestPoint).toBe('W');

        });

        it('figure out nearest four points(W,E,S,N)', function() {
            var first = { x: 10, y: 250 },
                final = { x: 100, y : 100 },
                cardinalPoint = movedetector.getCardinalPoints(first, final),
                nearestPoint = movedetector.getNearestPoint(first, final, cardinalPoint);

            expect(nearestPoint).toBe('N');

        });

        it('figure out nearest four point(W,E,S,N), use get direction.', function() {
            var result = movedetector.getDirection(pointList);
            expect(result).toBe('E');
        });
    });


    describe('test event type', function() {
        it('flick event uprise.', function() {
            movedetector.extractType(event);
            expect(movedetector.type).toBe('flick');
        });

        it('flick event uprise.', function() {
            event.start = 1000;
            event.end = 1005;
            movedetector.extractType(event);
            expect(movedetector.type).toBe('flick');
        });

        it('click event uprise.', function(done) {
            event.start = 1000;
            event.end = 1100;
            event.list.push({
                x: 11,
                y: 5
            });
            movedetector.extractType(event);
            setTimeout(function() {
                expect(movedetector.type).toBe('click');
                done();
            }, 1000);
        });

        it('double click event uprise.', function(done) {
            event.start = 1000;
            event.end = 1100;
            event.list.push({
                x: 11,
                y: 5
            });
            movedetector.extractType(event);
            movedetector.extractType(event);
            setTimeout(function() {
                expect(movedetector.type).toBe('dbclick');
                done();
            }, 1000);
        });

        it('ignore event(return none)', function() {
            event.start = 10000;
            event.end = 11000;
            event.list.push({
                x: 11,
                y: 5
            });
            movedetector.extractType(event);
            expect(movedetector.type).toBe('none');
        });

        it('ignore event(return none)', function() {
            event.start = 10000;
            event.end = 11000;
            event.list.push({
                x: 100,
                y: 100
            });
            movedetector.extractType(event);
            expect(movedetector.type).toBe('none');
        });
    });

    it('get Event type and direction', function() {
        var result = movedetector.figure(event);
        expect(result.direction).toBe('E');
        expect(result.type).toBe('flick');
    });

});