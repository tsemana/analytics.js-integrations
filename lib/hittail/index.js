
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');
var is = require('is');

/**
 * Expose `HitTail` integration.
 */

var HitTail = module.exports = integration('HitTail')
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