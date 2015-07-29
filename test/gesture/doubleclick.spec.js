describe('Test gesture reader - doubleclick case', function() {
    var reader,
        pos1,
        pos2,
        pos3;

    beforeEach(function() {
        reader = new ne.component.Gesture.Reader({
            type: 'dbclick'
        });
        pos1 = {
            x: 10,
            y: 10
        };
        pos2 = {
            x: 11,
            y: 11
        };
        pos3 = {
            x: 25,
            y: 25
        }
    });

    it('reader.dbclick is created', function() {
        expect(reader.type).toBe('dbclick');
    });

    it('isAvailableZone', function() {
        reader.pos = pos1;
        expect(reader.isAvailableZone(pos2)).toBe(true);
    });

    it('isAvailableZone overarea', function() {
        reader.pos = pos1;
        expect(reader.isAvailableZone(pos3)).toBe(false);
    });

    it('isDoubleClick', function() {
        expect(reader.isDoubleClick(pos1)).toBe(false);
        expect(reader.isDoubleClick(pos2)).toBe(true);
    });

    it('isDoubleClick overarea', function() {
        expect(reader.isDoubleClick(pos1)).toBe(false);
        expect(reader.isDoubleClick(pos3)).toBe(false);
    });

    it('isDoubleClick - time over', function(done) {
        expect(reader.isDoubleClick(pos1)).toBe(false);
        setTimeout(function() {
            expect(reader.isDoubleClick(pos2)).toBe(false);
            done();
        }, 1000);
    });
});