
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration');

/**
 * HOP.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Expose `TwitterAds`.
 */

var TwitterAds = module.exports = integration('Twitter Ads')
  .option('events', {})
  .tag('pixel', '<img src="//analytics.twitter.com/i/adsct?txn_id={{ event }}&p_id=Twitter"/>');

/**
 * Initialize.
 *
 * @param {Object} page
 */

TwitterAds.prototype.initialize = function(){
  this.ready();
};

/**
 * Track.
 *
 * @param {Track} track
 */

TwitterAds.prototype.track = function(track){
  var events = this.options.events;
  var event = track.event();
  if (!has.call(events, event)) return;
  return this.load('pixel', {
    event: events[event]
  });
};
