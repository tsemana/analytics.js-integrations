
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var push = require('global-queue')('_paq');
var each = require('each');
var is = require('is');
var reduce = require('reduce');

/**
 * Expose `Piwik` integration.
 */

var Piwik = module.exports = integration('Piwik')
  .global('_paq')
  .option('url', null)
  .option('siteId', '')
  .option('customVariableLimit', '')
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
  var revenue = track.revenue();
  var category = track.category() || 'All';
  var action = track.event();
  var name = track.proxy('properties.name') || track.proxy('properties.label');
  var value = track.value() || track.revenue();

  var options = track.options('Piwik');

  // Add this if we enable setting your own customVariableLimit
  //var customVariableLimit = this.options.customVariableLimit;

  // Not currently enabling setting your own variable limit, setting this to the default
  var customVariableLimit = 5;

  var customVariables = options.customVars || options.cvar;
  var formattedVars = {};

  if (is.array(customVariables)) {
    formattedVars = reduce(customVariables, function(formattedVars, value, i){
      if (i <= customVariableLimit) formattedVars[i] = value;
      return formattedVars;
    }, {});
  }

  if (is.object(customVariables)) formattedVars = customVariables;

  if (!is.null(formattedVars) && !is.undefined(formattedVars)) {
    each(formattedVars, function(key, valuePair){
      if (parseInt(key) <= customVariableLimit) push('setCustomVariable', key, valuePair[0], valuePair[1], 'page');
    });
  }

  each(goals, function(goal){
    push('trackGoal', goal, revenue);
  });

  push('trackEvent', category, action, name, value);
};
