
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');
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
  .global('_kiq')
  .option('customerId', '')
  .option('siteToken', '')
  .option('track', false)
  .tag('<script src="//s3.amazonaws.com/ki.js/{{ customerId }}/{{ siteToken }}.js">');

/**
 * Initialize.
 *
 * @param {Object} page
 */

Qualaroo.prototype.initialize = function(page){
  window._kiq = window._kiq || [];
  var loaded = bind(this, this.loaded);
  var ready = this.ready;
  this.load(function(){
    when(loaded, ready);
  });
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
