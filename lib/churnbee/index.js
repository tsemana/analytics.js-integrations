
/**
 * Module dependencies.
 */

var push = require('global-queue')('_cbq');
var integration = require('segmentio/analytics.js-integration@add/tags');
var load = require('load-script');

/**
 * HOP
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Supported events
 */

var supported = {
  activation: true,
  changePlan: true,
  register: true,
  refund: true,
  charge: true,
  cancel: true,
  login: true
};

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(ChurnBee);
};

/**
 * Expose `ChurnBee` integration.
 */

var ChurnBee = exports.Integration = integration('ChurnBee')
  .global('_cbq')
  .global('ChurnBee')
  .option('events', {})
  .option('apiKey', '')
  .tag('<script src="//api.churnbee.com/cb.js">');

/**
 * Initialize.
 *
 * https://churnbee.com/docs
 *
 * @param {Object} page
 */

ChurnBee.prototype.initialize = function(page){
  push('_setApiKey', this.options.apiKey);
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

ChurnBee.prototype.loaded = function(){
  return !! window.ChurnBee;
};

/**
 * Track.
 *
 * @param {Track} event
 */

ChurnBee.prototype.track = function(track){
  var events = this.options.events;
  var event = track.event();
  if (has.call(events, event)) event = events[event];
  if (true != supported[event]) return;
  push(event, track.properties({ revenue: 'amount' }));
};
