'use strict';

var waterfall = require('../dist/waterfall.umd.js');

describe('regression tests', function() {
  it('https://github.com/cmawhorter/waterfall/issues/1', function() {
    assert.throws(function() {
      waterfall({}, function() {
        throw new Error('test123');
      });
    }, 'test123');
  });

});
