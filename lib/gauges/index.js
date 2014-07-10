
/**
 * Module dependencies.
 */

var callback = require('callback');
var integration = require('segmentio/analytics.js-integration@add/tags');
var load = require('load-script');
var push = require('global-queue')('_gauges');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Gauges);
};

/**
 * Expose `Gauges` integration.
 */

var Gauges = exports.Integration = integration('Gauges')
  .assumesPageview()
  .global('_gauges')
  .option('siteId', '')
  .tag('<script id="gauges-tracker" src="//secure.gaug.es/track.js" data-site-id="{{ siteId }}">');

/**
 * Initialize Gauges.
 *
 * http://get.gaug.es/documentation/tracking/
 *
 * @param {Object} page
 */

Gauges.prototype.initialize = function(page){
  window._gauges = window._gauges || [];
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Gauges.prototype.loaded = function(){
  return !! (window._gauges && window._gauges.push !== Array.prototype.push);
};

/**
 * Page.
 *
 * @param {Page} page
 */

Gauges.prototype.page = function(page){
  push('track');
};
