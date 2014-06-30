
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var push = require('global-queue')('_kiq');
var callback = require('callback');
var load = require('load-script');
var Facade = require('facade');
var Identify = Facade.Identify;
var bind = require('bind');
var when = require('when');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Qualaroo);
};

/**
 * Expose `Qualaroo` integration.
 */

var Qualaroo = exports.Integration = integration('Qualaroo')
  .assumesPageview()
  .readyOnLoad()
  .global('_kiq')
  .option('customerId', '')
  .option('siteToken', '')
  .option('track', false);

/**
 * Initialize.
 *
 * @param {Object} page
 */

Qualaroo.prototype.initialize = function(page){
  window._kiq = window._kiq || [];
  this.load();
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Qualaroo.prototype.loaded = function(){
  return !! (window._kiq && window._kiq.push !== Array.prototype.push);
};

/**
 * Load.
 *
 * @param {Function} fn
 */

Qualaroo.prototype.load = function(fn){
  var token = this.options.siteToken;
  var id = this.options.customerId;
  var loaded = bind(this, this.loaded);
  load('//s3.amazonaws.com/ki.js/' + id + '/' + token + '.js', function(){
    when(loaded, fn);
  });
};

/**
 * Identify.
 *
 * http://help.qualaroo.com/customer/portal/articles/731085-identify-survey-nudge-takers
 * http://help.qualaroo.com/customer/portal/articles/731091-set-additional-user-properties
 *
 * @param {Identify} identify
 */

Qualaroo.prototype.identify = function(identify){
  var traits = identify.traits();
  var id = identify.userId();
  var email = identify.email();
  if (email) id = email;
  if (id) push('identify', id);
  if (traits) push('set', traits);
};

/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Qualaroo.prototype.track = function(track){
  if (!this.options.track) return;
  var event = track.event();
  var traits = {};
  traits['Triggered: ' + event] = true;
  this.identify(new Identify({ traits: traits }));
};
