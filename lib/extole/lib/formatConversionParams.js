'use strict';
/**
 * Module dependencies.
 */

var extend = require('extend');

/**
 * formatConversionParams. Formats details from a Segment track event into a
 * data format Extole can accept.
 *
 * @param {string} event
 * @param {string} email
 * @param {string|number} userId
 * @param {Object} properties The result of calling `track.properties()`.
 * @return {Object}
 */
var formatConversionParams = function(event, email, userId, properties){
  var total;

  if (properties.total) {
    total = properties.total;
    delete properties.total;
    properties['tag:cart_value'] = total;
  }

  return extend({
    'tag:segment_event': event,
    e: email,
    partner_conversion_id: userId
  }, properties);
};

/**
 * Exports.
 */

module.exports = formatConversionParams;
