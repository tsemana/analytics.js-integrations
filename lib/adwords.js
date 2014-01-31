
var load = require('load-pixel')('//www.googleadservices.com/pagead/conversion/:id');
var integration = require('integration');

/**
 * Expose plugin
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(AdWords);
};

/**
 * Expose `load`.
 */

exports.load = load;

/**
 * HOP
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Expose `AdWords`
 */

var AdWords = exports.Integration = integration('AdWords')
  .readyOnInitialize()
  .option('events', {});

/**
 * Track.
 *
 * @param {Track}
 */

AdWords.prototype.track = function(track){
  var events = this.options.events;
  var event = track.event();
  if (!has.call(events, event)) return;
  return exports.load({
    value: track.revenue() || 0,
    label: event,
    script: 0
  }, { id: events[event] });
};
