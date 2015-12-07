'use strict';

var corbel = require('../../../dist/corbel.js'),
  chai = require('chai'),
  expect = chai.expect;

describe('JWT module', function() {

  var CLIENT_ID = 'CLIENT_ID';
  var SCOPES = 'scope1 scope2';

  it('exists and is an object', function() {
    expect(corbel.jwt).to.be.an('object');
  });

  it('has all namespace properties', function() {
    expect(corbel.jwt).to.include.keys(
      'generate'
    );
  });

  it.only('generates a valid JWT', function() {
    var secret = 'secret',
      claims = {
        'iss': CLIENT_ID,
        'aud': 'http://iam.bqws.io',
        'exp': 1391535,
        'scope': SCOPES,
        'version': '1.0.0'
      };
    var EXPECTED_ASSERTION = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDTElFTlRfSUQiLCJhdWQiOiJodHRwOi8vaWFtLmJxd3MuaW8iLCJleHAiOjEzOTE1MzUsInNjb3BlIjoic2NvcGUxIHNjb3BlMiIsInZlcnNpb24iOiIxLjAuMCJ9._TCKYb3gbsuznfwA1gopY4mSYr7VHmvFQGxW1CJJjHQ';

    // without alg
    var assertion = corbel.jwt.generate(claims, secret);
    expect(assertion).to.be.equal(EXPECTED_ASSERTION);

    // with alg
    assertion = corbel.jwt.generate(claims, secret, 'HS256');
    expect(assertion).to.be.equal(EXPECTED_ASSERTION);

    // with array scopes
    claims.scope = ['scope1', 'scope2'];
    assertion = corbel.jwt.generate(claims, secret);
    expect(assertion).to.be.equal(EXPECTED_ASSERTION);
  });

  it('decodes expected values', function() {
    var secret = 'secret',
      claims = {
        iss: 'clientId',
        aud: 'http://iam.bqws.io',
        exp: 12345,
        scope: 'scope:example1 scope:example2'
      };

    var EXPECTED = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjbGllbnRJZCIsImF1ZCI6Imh0dHA6Ly9pYW0uYnF3cy5pbyIsImV4cCI6MTIzNDUsInNjb3BlIjoic2NvcGU6ZXhhbXBsZTEgc2NvcGU6ZXhhbXBsZTIifQ.18g9YO_KgWtW1s7HSo87mIjG02u8Pe880tdLbg_JxC4';

    var assertion = corbel.jwt.generate(claims, secret);
    expect(assertion).to.be.equal(EXPECTED);

    // with array scopes
    claims.scope = ['scope:example1', 'scope:example2'];
    assertion = corbel.jwt.generate(claims, secret);
    var jwtDecoded = corbel.jwt.decode(assertion);
    expect(jwtDecoded).to.be.an('object');

    expect(jwtDecoded.typ).to.be.equal('JWT');
    expect(jwtDecoded.alg).to.be.equal('HS256');

    expect(jwtDecoded.iss).to.be.equal('clientId');
    expect(jwtDecoded.aud).to.be.equal('http://iam.bqws.io');
    expect(jwtDecoded.exp).to.be.equal(12345);
    expect(jwtDecoded.scope).to.be.equal('scope:example1 scope:example2');
  });

  it('throws exception with invalid assertion', function() {
    expect(function() {
      corbel.jwt.decode('invalid_assertion');
    }).to.throw('corbel:jwt:decode:invalid_assertion');
  });

  describe('when generating claims', function() {

    it('iss are required', function() {

      expect(function() {
        corbel.jwt.generate();
      }).to.throw('jwt:undefined:iss');

    });

    it('aud are required', function() {

      expect(function() {
        corbel.jwt.generate({
          iss: 'myiss'
        });
      }).to.throw('jwt:undefined:aud');

    });

    it('scope are required', function() {

      expect(function() {
        corbel.jwt.generate({
          iss: 'myiss',
          aud: 'aud'
        });
      }).to.throw('jwt:undefined:scope');

    });

    it('generates a valid JWT without validations', function() {
    var secret = 'secret',
      claims = {
        'iss': CLIENT_ID,
        'aud': 'http://iam.bqws.io',
        'exp': 1391535,
        'scope': SCOPES,
        'version': '1.0.0'
      };
    var EXPECTED_ASSERTION = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDTElFTlRfSUQiLCJhdWQiOiJodHRwOi8vaWFtLmJxd3MuaW8iLCJleHAiOjEzOTE1MzUsInNjb3BlIjoic2NvcGUxIHNjb3BlMiIsInZlcnNpb24iOiIxLjAuMCJ9._TCKYb3gbsuznfwA1gopY4mSYr7VHmvFQGxW1CJJjHQ';

    // without alg
    var assertion = corbel.jwt._generate(claims, secret);
    expect(assertion).to.be.equal(EXPECTED_ASSERTION);

    // with alg
    assertion = corbel.jwt._generate(claims, secret, 'HS256');
    expect(assertion).to.be.equal(EXPECTED_ASSERTION);

    // with array scopes
    claims.scope = ['scope1', 'scope2'];
    assertion = corbel.jwt._generate(claims, secret);
    expect(assertion).to.be.equal(EXPECTED_ASSERTION);
  });

  });

});
