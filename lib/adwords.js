
var integration = require('integration');

/**
 * Expose plugin
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(AdWords);
};

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
  var id = events[event];
  exports.load(id, track.revenue() || 0, event);
};

/**
 * Load conversion.
 *
 * @param {Mixed} id
 * @param {Number} revenue
 * @param {String} event
 * @return {Image}
 * @api private
 */

exports.load = function(id, revenue, event){
  var img = new Image;
  img.src = '//www.googleadservices.com/pagead'
    + '/conversion/' + id
    + '?value=' + revenue
    + '&label=' + event
    + '&script=0';
  img.width = 1;
  img.height = 1;
  return img;
};
