
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Alexa);
};

/**
 * Expose Alexa integration.
 */

var Alexa = exports.Integration = integration('Alexa')
  .assumesPageview()
  .global('_atrk_opts')
  .option('account', null)
  .option('domain', '')
  .option('dynamic', true)
  .tag('<script src="//d31qbv1cthcecs.cloudfront.net/atrk.js">');

/**
 * Initialize.
 *
 * @param {Object} page
 */

Alexa.prototype.initialize = function(page){
  var self = this;
  window._atrk_opts = {
    atrk_acct: this.options.account,
    domain: this.options.domain,
    dynamic: this.options.dynamic
  };
  this.load(function(){
    window.atrk();
    self.ready();
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Alexa.prototype.loaded = function(){
  return !! window.atrk;
};