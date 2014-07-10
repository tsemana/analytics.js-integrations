
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');
var push = require('global-queue')('__insp');
var load = require('load-script');
var alias = require('alias');
var clone = require('clone');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Inspectlet);
};

/**
 * Expose `Inspectlet` integration.
 */

var Inspectlet = exports.Integration = integration('Inspectlet')
  .assumesPageview()
  .global('__insp')
  .global('__insp_')
  .option('wid', '')
  .tag('<script src="//www.inspectlet.com/inspectlet.js">');

/**
 * Initialize.
 *
 * https://www.inspectlet.com/dashboard/embedcode/1492461759/initial
 *
 * @param {Object} page
 */

Inspectlet.prototype.initialize = function(page){
  push('wid', this.options.wid);
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Inspectlet.prototype.loaded = function(){
  return !! window.__insp_;
};

/**
 * Identify.
 *
 * http://www.inspectlet.com/docs#tagging
 *
 * @param {Identify} identify
 */

Inspectlet.prototype.identify = function (identify) {
  var traits = identify.traits({ id: 'userid' });
  push('tagSession', traits);
};

/**
 * Track.
 *
 * http://www.inspectlet.com/docs/tags
 *
 * @param {Track} track
 */

Inspectlet.prototype.track = function(track){
  push('tagSession', track.event());
};
