'use strict'
/* jshint camelcase:false */
/* globals describe it */

var corbel = require('../../../dist/corbel.js')
var chai = require('chai')
var expect = chai.expect

describe('In utils module', function () {
  it('an Array can be copied', function () {
    var arrayOrigin = [1, 2, 3]

    var copiedArray = corbel.utils.copyArray(arrayOrigin)

    expect(copiedArray.length).to.equals(3)

    for (var i = 0; i < copiedArray.length; i++) {
      expect(copiedArray[i]).to.equals(arrayOrigin[i])
    }
  })

  it('array references are not maintained', function () {
    var arrayOrigin = [1, 2, 3]

    var copiedArray = corbel.utils.copyArray(arrayOrigin)

    copiedArray.pop()

    expect(arrayOrigin.length).to.equals(3)
    expect(copiedArray.length).to.equals(2)
  })

  it('is JSON evaluation (true)', function () {
    var testJson = '{"a": 1, "b": 2}'

    expect(corbel.utils.isJSON(testJson)).to.be.equal(true)
  })

  it('is JSON evaluation (false)', function () {
    var notJson = 'notJson'

    expect(corbel.utils.isJSON(notJson)).to.be.equal(false)
  })

  it('is stream evaluation (true)', function () {
    var Stream = require('stream')
    var stream = new Stream()

    expect(corbel.utils.isStream(stream)).to.be.equal(true)
  })

  it('is stream evaluation (false)', function () {
    var notStream = 'notStream'

    expect(corbel.utils.isStream(notStream)).to.be.equal(false)
  })

  it('an array is converted to object', function () {
    var arr = ['a', 'b']
    var obj = {0: 'a', 1: 'b'}

    expect(corbel.utils.arrayToObject(arr)).to.deep.equal(obj)
  })

  it('keys are converted to lowercase', function () {
    var upperObj = {A: 'a', B: 'b'}
    var lowerObj = {a: 'a', b: 'b'}

    expect(corbel.utils.keysToLowerCase(upperObj)).to.deep.equal(lowerObj)
  })
})
