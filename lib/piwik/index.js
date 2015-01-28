
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var push = require('global-queue')('_paq');
var each = require('each');
var is = require('is');
var reduce = require('ianstormtaylor/reduce');

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
  var customVariableLimit = this.options.customVariableLimit || 5;
  var customVariables = options.customVars || options.cvar;

  if (!is.object(customVariables) && !is.array(customVariables)) {
    customVariables = [];
  }

  if (is.object(customVariables)) {
    customVariables = this._formatToArray(customVariables);
  }

  for (var i = 0; i < customVariableLimit; i += 1){
    if (customVariables[i]) {
      var varIndex = (i + 1).toString();
      push('setCustomVariable', varIndex, customVariables[i][0], customVariables[i][1], 'page');
    }
  }

  each(goals, function(goal){
    push('trackGoal', goal, revenue);
  });

  push('trackEvent', category, action, name, value);
};

/**
 * Helper method to format the custom variables.
 *
 * @param {Object} object
 */

Piwik.prototype._formatToArray = function(object){
  return reduce(object, [], function(result, key, value){
    key = parseInt(key, 10);
    result.push(value);
    return result;
  });
};