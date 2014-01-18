
var integration = require('integration');

/**
 * Expose plugin
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Facebook);
};

/**
 * HOP
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Expose `Facebook`
 */

var Facebook = exports.Integration = integration('Facebook Ads')
  .readyOnInitialize()
  .option('currency', 'USD')
  .option('events', {});

/**
 * Track.
 *
 * @param {Track} track
 */

Facebook.prototype.track = function(track){
  var events = this.options.events;
  var traits = track.traits();
  var event = track.event();
  if (!has.call(events, event)) return;
  var currency = this.options.currency;
  var pixel = events[event];
  return exports.load(pixel, track.revenue() || 0, currency);
};

/**
 * Load conversion.
 *
 * @param {Mixed} id
 * @param {Number} revenue
 * @param {String} currency
 * @return {Image}
 * @api private
 */

exports.load = function(id, revenue, currency){
  var img = new Image;
  img.src = '//www.facebook.com/offsite_event.php'
    + '?currency=' + currency
    + '&value=' + revenue
    + '&id=' + id;
  img.width = 1;
  img.height = 1;
  return img;
};
