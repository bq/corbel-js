'use strict';
/* jshint camelcase:false */

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect;

describe('In utils module we', function() {

    describe(' have array utils that', function(){
        it('Copy an Array', function() {
            var arrayOrigin = [1, 2, 3];

            var copiedArray = corbel.utils.copyArray(arrayOrigin);

            expect(copiedArray.length).to.equals(3);

            for(var i = 0; i < copiedArray.length; i++){
                expect(copiedArray[i]).to.equals(arrayOrigin[i]);
            }
        });

        it('Does not mantain array references', function() {
            var arrayOrigin = [1, 2, 3];

            var copiedArray = corbel.utils.copyArray(arrayOrigin);

            copiedArray.pop();

            expect(arrayOrigin.length).to.equals(3);
            expect(copiedArray.length).to.equals(2);
        });
    });
});
