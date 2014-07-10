
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');
var push = require('global-queue')('_paq');
var load = require('load-script');
var each = require('each');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Piwik);
};

/**
 * Expose `Piwik` integration.
 */

var Piwik = exports.Integration = integration('Piwik')
  .global('_paq')
  .option('url', null)
  .option('siteId', '')
  .mapping('goals')
  .tag('<script src="{{ url }}/piwik.js">');

/**
 * Initialize.
 *
 * http://piwik.org/docs/javascript-tracking/#toc-asynchronous-tracking
 */

Piwik.prototype.initialize = function(){
  window._paq = window._paq || [];
  push('setSiteId', this.options.siteId);
  push('setTrackerUrl', this.options.url + '/piwik.php');
  push('enableLinkTracking');
  this.load(this.ready);
};

/**
 * Check if Piwik is loaded
 */

Piwik.prototype.loaded = function(){
  return !! (window._paq && window._paq.push != [].push);
};

/**
 * Page
 *
 * @param {Page} page
 */

Piwik.prototype.page = function(page){
  push('trackPageView');
};

/**
 * Track.
 * 
 * @param {Track} track
 */

Piwik.prototype.track = function(track){
  var goals = this.goals(track.event());
  var revenue = track.revenue() || 0;
  each(goals, function(goal){
    push('trackGoal', goal, revenue);
  });
};
