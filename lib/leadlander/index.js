
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(LeadLander);
};

/**
 * Expose `LeadLander` integration.
 */

var LeadLander = exports.Integration = integration('LeadLander')
  .assumesPageview()
  .global('llactid')
  .global('trackalyzer')
  .option('accountId', null)
  .tag('<script src="http://t6.trackalyzer.com/trackalyze-nodoc.js">');

/**
 * Initialize.
 *
 * @param {Object} page
 */

LeadLander.prototype.initialize = function(page){
  window.llactid = this.options.accountId;
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

LeadLander.prototype.loaded = function(){
  return !! window.trackalyzer;
};