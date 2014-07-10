
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');
var push = require('global-queue')('_veroq');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Vero);
};

/**
 * Expose `Vero` integration.
 */

var Vero = exports.Integration = integration('Vero')
  .global('_veroq')
  .option('apiKey', '')
  .tag('<script src="//d3qxef4rp70elm.cloudfront.net/m.js">');

/**
 * Initialize.
 *
 * https://github.com/getvero/vero-api/blob/master/sections/js.md
 *
 * @param {Object} page
 */

Vero.prototype.initialize = function(page){
  push('init', { api_key: this.options.apiKey });
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Vero.prototype.loaded = function(){
  return !! (window._veroq && window._veroq.push !== Array.prototype.push);
};

/**
 * Page.
 *
 * https://www.getvero.com/knowledge-base#/questions/71768-Does-Vero-track-pageviews
 *
 * @param {Page} page
 */

Vero.prototype.page = function(page){
  push('trackPageview');
};

/**
 * Identify.
 *
 * https://github.com/getvero/vero-api/blob/master/sections/js.md#user-identification
 *
 * @param {Identify} identify
 */

Vero.prototype.identify = function(identify){
  var traits = identify.traits();
  var email = identify.email();
  var id = identify.userId();
  if (!id || !email) return; // both required
  push('user', traits);
};

/**
 * Track.
 *
 * https://github.com/getvero/vero-api/blob/master/sections/js.md#tracking-events
 *
 * @param {Track} track
 */

Vero.prototype.track = function(track){
  push('track', track.event(), track.properties());
};
