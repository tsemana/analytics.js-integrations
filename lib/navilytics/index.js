
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');
var push = require('global-queue')('__nls');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Navilytics);
};

/**
 * Expose `Navilytics` integration.
 */

var Navilytics = exports.Integration = integration('Navilytics')
  .assumesPageview()
  .global('__nls')
  .option('memberId', '')
  .option('projectId', '')
  .tag('<script src="//www.navilytics.com/nls.js?mid={{ memberId }}&pid={{ projectId }}">');

/**
 * Initialize.
 *
 * https://www.navilytics.com/member/code_settings
 *
 * @param {Object} page
 */

Navilytics.prototype.initialize = function(page){
  window.__nls = window.__nls || [];
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Navilytics.prototype.loaded = function(){
  return !! (window.__nls && [].push != window.__nls.push);
};

/**
 * Track.
 *
 * https://www.navilytics.com/docs#tags
 *
 * @param {Track} track
 */

Navilytics.prototype.track = function(track){
  push('tagRecording', track.event());
};
