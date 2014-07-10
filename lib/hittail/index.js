
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');
var load = require('load-script');
var is = require('is');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(HitTail);
};

/**
 * Expose `HitTail` integration.
 */

var HitTail = exports.Integration = integration('HitTail')
  .assumesPageview()
  .global('htk')
  .option('siteId', '')
  .tag('<script src="//{{ siteId }}.hittail.com/mlt.js">');

/**
 * Initialize.
 *
 * @param {Object} page
 */

HitTail.prototype.initialize = function(page){
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

HitTail.prototype.loaded = function(){
  return is.fn(window.htk);
};