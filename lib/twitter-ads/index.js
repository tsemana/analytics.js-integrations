
/**
 * Module dependencies.
 */

var pixel = require('load-pixel')('//analytics.twitter.com/i/adsct');
var integration = require('analytics.js-integration');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(TwitterAds);
};

/**
 * HOP.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Expose `TwitterAds`.
 */

var TwitterAds = exports.Integration = integration('Twitter Ads')
  .readyOnLoad()
  .option('events', {});

/**
 * Track.
 *
 * @param {Track} track
 */

TwitterAds.prototype.track = function(track){
  var events = this.options.events;
  var event = track.event();
  if (!has.call(events, event)) return;
  var img = new Image();
  img.src = '//analytics.twitter.com/i/adsct'
    + '?txn_id=' + events[event]
    + '&p_id=Twitter';
  img.width = 1;
  img.height = 1;
  return img;
};
