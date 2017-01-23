'use strict';

var waterfall = require('../dist/waterfall.umd.js');

describe('waterfall', function() {
  it('should take steps and return a result using an object literal', function(done) {
    waterfall({}, (err, state) => {
      assert.ifError(err);
      expect(state).toBeAn(Object);
      expect(Object.keys(state).length).toEqual(0);
      done();
    });
  });
  it('should take steps and return a result using an array', function(done) {
    waterfall([], (err, state) => {
      assert.ifError(err);
      expect(state).toBeAn(Object);
      expect(Object.keys(state).length).toEqual(0);
      done();
    });
  });
  it('should assign result to associated key for hash', function(done) {
    waterfall({
      test: (state, next) => next(null, 'hello'),
    }, (err, state) => {
      assert.ifError(err);
      expect(state.test).toEqual('hello');
      done();
    });
  });
  it('should assign result to associated key for array', function(done) {
    waterfall([
      (state, next) => next(null, 'hello'),
    ], (err, state) => {
      assert.ifError(err);
      expect(state['0']).toEqual('hello');
      done();
    });
  });
  it('should take an optional starting state', function(done) {
    waterfall({
      test: (state, next) => expect(state.hello).toEqual('world') && next(null),
    }, { hello: 'world' }, done);
  });
  it('should appropriately catch thrown errors', function(done) {
    waterfall({
      test: (state, next) => {
        throw new Error('good');
      },
    }, { hello: 'world' }, (err) => {
      expect(err).toBeAn(Error);
      expect(err.message).toEqual('good');
      done();
    });
  });
  it('should appropriately handle error responses', function(done) {
    waterfall({
      test: (state, next) => next(new Error('good')),
    }, { hello: 'world' }, (err) => {
      expect(err).toBeAn(Error);
      expect(err.message).toEqual('good');
      done();
    });
  });
});
