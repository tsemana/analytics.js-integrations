
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var Identify = require('facade').Identify;
var clone = require('clone');

/**
 * Expose Userlike integration.
 */

var Userlike = module.exports = integration('Userlike')
  .assumesPageview()
  .global('userlikeConfig')
  .global('userlikeData')
  .option('secretKey', '')
  .option('listen', false)
  .tag('<script src="//userlike-cdn-widgets.s3-eu-west-1.amazonaws.com/{{ secretKey }}.js">');

/**
 * Initialize.
 *
 * @param {Object} page
 */
Userlike.prototype.initialize = function(page){
  var self = this;
  var user = this.analytics.user();
  var identify = new Identify({
    userId: user.id(),
    traits: user.traits()
  });

  segment_base_info = clone(this.options);

  segment_base_info.visitor = {
    name: identify.name(),
    email: identify.email()
  };

  if (!window.userlikeData) window.userlikeData = { custom: {} };
  window.userlikeData.custom.segmentio = segment_base_info;

  this.load(function(){
    if (self.options.listen) self.attachListeners();
    self.ready();
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */
Userlike.prototype.loaded = function(){
  return !! (window.userlikeConfig && window.userlikeData);
};

/**
 * Listen for chat events.
 */

Userlike.prototype.attachListeners = function(){
  window.userlikeTrackingEvent = function(event_name, global_ctx, session_ctx){
    if (event_name === 'chat_started') {
      window.analytics.track('Live Chat Started');
    } else if (event_name === 'message_operator_terminating') {
      window.analytics.track('Live Chat Message Sent'); // message not available
    } else if (event_name === 'message_client_terminating') {
      window.analytics.track('Live Chat Message Received'); // message not available
    }
  };
};
