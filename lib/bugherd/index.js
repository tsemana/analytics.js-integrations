
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(BugHerd);
};

/**
 * Expose `BugHerd` integration.
 */

var BugHerd = exports.Integration = integration('BugHerd')
  .assumesPageview()
  .global('BugHerdConfig')
  .global('_bugHerd')
  .option('apiKey', '')
  .option('showFeedbackTab', true)
  .tag('<script src="//www.bugherd.com/sidebarv2.js?apikey={{ apiKey }}">');

/**
 * Initialize.
 *
 * http://support.bugherd.com/home
 *
 * @param {Object} page
 */

BugHerd.prototype.initialize = function(page){
  window.BugHerdConfig = { feedback: { hide: !this.options.showFeedbackTab }};
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

BugHerd.prototype.loaded = function(){
  return !! window._bugHerd;
};