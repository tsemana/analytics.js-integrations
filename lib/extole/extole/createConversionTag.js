'use strict';

/**
 * Module dependencies.
 */

var domify = require('domify');
var json = require('json');

/**
 * Create an Extole conversion tag.
 *
 * @param {Object} conversion An Extole conversion object.
 * @return {HTMLElement}
 */
var createConversionTag = function(conversion){
  return domify('<script type="extole/conversion">' + json.stringify(conversion) + '</script>');
};

/**
 * Exports.
 */

module.exports = createConversionTag;
