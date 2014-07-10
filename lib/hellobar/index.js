
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');
var load = require('load-script');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Hellobar);
};

/**
 * Expose `hellobar.com` integration.
 */

var Hellobar = exports.Integration = integration('Hello Bar')
  .assumesPageview()
  .global('_hbq')
  .option('apiKey', '')
  .tag('<script src="//s3.amazonaws.com/scripts.hellobar.com/{{ apiKey }}.js">');

/**
 * Initialize.
 *
 * https://s3.amazonaws.com/scripts.hellobar.com/bb900665a3090a79ee1db98c3af21ea174bbc09f.js
 *
 * @param {Object} page
 */

Hellobar.prototype.initialize = function(page){
  window._hbq = window._hbq || [];
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Hellobar.prototype.loaded = function(){
  return !! (window._hbq && window._hbq.push !== Array.prototype.push);
};
