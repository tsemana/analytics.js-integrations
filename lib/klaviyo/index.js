
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var push = require('global-queue')('_learnq');
var callback = require('callback');
var load = require('load-script');
var tick = require('next-tick');
var alias = require('alias');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Klaviyo);
};

/**
 * Trait aliases.
 */

var aliases = {
  id: '$id',
  email: '$email',
  firstName: '$first_name',
  lastName: '$last_name',
  phone: '$phone_number',
  title: '$title'
};

/**
 * Expose `Klaviyo` integration.
 */

var Klaviyo = exports.Integration = integration('Klaviyo')
  .assumesPageview()
  .readyOnLoad()
  .global('_learnq')
  .option('apiKey', '');

/**
 * Initialize.
 *
 * https://www.klaviyo.com/docs/getting-started
 *
 * @param {Object} page
 */

Klaviyo.prototype.initialize = function(page){
  push('account', this.options.apiKey);
  this.load();
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Klaviyo.prototype.loaded = function(){
  return !! (window._learnq && window._learnq.push !== Array.prototype.push);
};

/**
 * Load.
 *
 * @param {Function} fn
 */

Klaviyo.prototype.load = function(fn){
  load('//a.klaviyo.com/media/js/learnmarklet.js', function(){
    tick(fn);
  });
};

/**
 * Identify.
 *
 * @param {Identify} identify
 */

Klaviyo.prototype.identify = function(identify){
  var traits = identify.traits(aliases);
  if (!traits.$id && !traits.$email) return;
  push('identify', traits);
};

/**
 * Group.
 *
 * @param {Group} group
 */

Klaviyo.prototype.group = function(group){
  var props = group.properties();
  if (!props.name) return;
  push('identify', { $organization: props.name });
};

/**
 * Track.
 *
 * @param {Track} track
 */

Klaviyo.prototype.track = function(track){
  push('track', track.event(), track.properties({
    revenue: '$value'
  }));
};
