
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var is = require('is');

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
 * Initialize.
 *
 * http://help.snapengage.com/installation-guide-getting-started-in-a-snap/
 *
 * @param {Object} page
 */

SnapEngage.prototype.initialize = function(page){
  var self = this;
  this.load(function(){
    if (self.options.listen) self.listen();
    tick(self.ready);
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

SnapEngage.prototype.loaded = function(){
  return is.object(window.SnapABug);
};

/**
 * Listen for events.
 */

SnapEngage.prototype.listen = function() {
  window.SnapEngage.setCallback('StartChat', function (email, message, type) {
    window.analytics.track('Live Chat Started');
  });
  window.SnapEngage.setCallback('ChatMessageReceived', function (agent, message) {
    window.analytics.track('Live Chat Message Received', {
      messageBody: message
    });
  });
  window.SnapEngage.setCallback('ChatMessageSent', function (message) {
    window.analytics.track('Live Chat Message Sent', {
      messageBody: message
    });
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
