
var assert = require('assert');
var Integrations = require('../index.js');
var object = require('object');

/**
 * Assert we have the right number of integrations.
 */

describe('integrations', function () {
  it('should export our integrations', function () {
    assert(object.length(Integrations) === 74);
  });
});
