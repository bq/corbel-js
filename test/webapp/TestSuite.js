// var mocha = require("mocha");
// var sinon = require("sinon");
// var chai = require("chai");
(function() {
    console.log('pepe');
    describe('Array', function() {
        describe('#indexOf()', function() {
            it('should return -1 when the value is not present', function() {
                expect([1, 2, 3].indexOf(-1)).to.be.equal([1, 2, 3].indexOf(5));
                //expect.equal(-1, [1, 2, 3].indexOf(0));
            });
        });
    });
    describe('Array', function() {
        describe('pepe', function() {
            it('should return -1 when the value is not present', function() {
                expect(-1).to.be.equal([1, 2, 3].indexOf(0));
            });
        });
    });
})();