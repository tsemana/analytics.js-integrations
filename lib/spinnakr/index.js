
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');
var bind = require('bind');
var when = require('when');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Spinnakr);
};

/**
 * Expose `Spinnakr` integration.
 */

var Spinnakr = exports.Integration = integration('Spinnakr')
  .assumesPageview()
  .global('_spinnakr_site_id')
  .global('_spinnakr')
  .option('siteId', '')
  .tag('<script src="//d3ojzyhbolvoi5.cloudfront.net/js/so.js">');

/**
 * Initialize.
 *
 * @param {Object} page
 */

Spinnakr.prototype.initialize = function(page){
  window._spinnakr_site_id = this.options.siteId;
  var loaded = bind(this, this.loaded);
  var ready = this.ready;
  this.load(function(){
    when(loaded, ready);
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Spinnakr.prototype.loaded = function(){
  return !! window._spinnakr;
};