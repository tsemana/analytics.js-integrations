
var push = require('global-queue')('_curebitq');
var integration = require('integration');
var load = require('load-script');
var clone = require('clone');

/**
 * Expose plugin
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Curebit);
};

/**
 * Expose `Curebit` integration
 */

var Curebit = exports.Integration = integration('Curebit')
  .readyOnInitialize()
  .global('_curebitq')
  .global('curebit')
  .option('siteId', '')
  .option('server', '');

/**
 * Initialize
 *
 * @param {Object} page
 */

Curebit.prototype.initialize = function(){
  push('init', {
    site_id: this.options.siteId,
    server: this.options.server
  });
  this.load();
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Curebit.prototype.loaded = function(){
  return !! window.curebit;
};

/**
 * Load
 *
 * @param {Function} fn
 * @api private
 */

Curebit.prototype.load = function(fn){
  load('//d2jjzw81hqbuqv.cloudfront.net/assets/api/all-0.6.js', fn);
};
