describe('Test gesture reader - longtab case', function() {
    var reader;

    beforeEach(function() {
        reader = new ne.component.Gesture.Reader({
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
            }, pos2 = {
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
            }, pos2 = {
                x: 15,
                y: 15
            };
            reader.startTab(pos);
            setTimeout(function() {
                expect(reader.isLongTab(pos2)).toBe(true);
                done();
            }, 1000);
        });

        it('isLongTab - stop longtab case', function(done) {
            var pos = {
                x: 10,
                y: 10
            }, pos2 = {
                x: 15,
                y: 15
            };
            reader.startTab(pos);
            reader.stopTab();
            setTimeout(function() {
                expect(reader.isLongTab(pos2)).toBe(false);
                done();
            }, 1000);
        });

        it('isLongTab - longtab case with callback', function(done) {
            var pos = {
                x: 10,
                y: 10
            }, pos2 = {
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