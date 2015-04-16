
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var is = require('is');
var tick = require('next-tick');

/**
 * Expose `SnapEngage` integration.
 */

var SnapEngage = module.exports = integration('SnapEngage')
  .assumesPageview()
  .global('SnapABug')
  .global('SnapEngage')
  .option('apiKey', '')
  .option('listen', false)
  .tag('<script src="//www.snapengage.com/cdn/js/{{ apiKey }}.js">');

/**
 * Integration object for root events.
 */

var integration = {
  name: 'snapengage',
  version: '1.0.0'
};

/**
 * Initialize.
 *
 * http://help.snapengage.com/installation-guide-getting-started-in-a-snap/
 *
 * @param {Object} page
 */

SnapEngage.prototype.initialize = function(page){
  var self = this;
  this.load(function(){
    if (self.options.listen) self.attachListeners();
    tick(self.ready);
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

SnapEngage.prototype.loaded = function(){
  return is.object(window.SnapABug) && is.object(window.SnapEngage);
};

/**
 * Listen for events.
 */

SnapEngage.prototype.attachListeners = function(){
  var self = this;
  window.SnapEngage.setCallback('StartChat', function(email, message, type){
    self.analytics.track('Live Chat Started', {}, { context: { integration: integration }});
  });
  window.SnapEngage.setCallback('ChatMessageReceived', function(agent, message){
    self.analytics.track('Live Chat Message Received', {
      messageBody: message
    }, { context: { integration: integration }});
  });
  window.SnapEngage.setCallback('ChatMessageSent', function(message){
    self.analytics.track('Live Chat Message Sent', {
      messageBody: message
    }, { context: { integration: integration }});
  });
};

/**
 * Identify.
 *
 * @param {Identify} identify
 */

SnapEngage.prototype.identify = function(identify){
  var email = identify.email();
  if (!email) return;
  window.SnapABug.setUserEmail(email);
};
