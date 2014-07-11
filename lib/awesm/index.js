
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');

/**
 * Expose `Awesm` integration.
 */

var Awesm = module.exports = integration('awe.sm')
  .assumesPageview()
  .global('AWESM')
  .option('apiKey', '')
  .option('events', {})
  .tag('<script src="//widgets.awe.sm/v3/widgets.js?key={{ apiKey }}&async=true">');

/**
 * Initialize.
 *
 * http://developers.awe.sm/guides/javascript/
 *
 * @param {Object} page
 */

Awesm.prototype.initialize = function(page){
  window.AWESM = { api_key: this.options.apiKey };
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Awesm.prototype.loaded = function(){
  return !! (window.AWESM && window.AWESM._exists);
};

/**
 * Track.
 *
 * @param {Track} track
 */

Awesm.prototype.track = function(track){
  var event = track.event();
  var goal = this.options.events[event];
  if (!goal) return;
  var user = this.analytics.user();
  window.AWESM.convert(goal, track.cents(), null, user.id());
};
