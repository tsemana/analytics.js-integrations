
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
 * The context for this integration.
 */

var integration = {
  name: 'userlike',
  version: '1.0.0'
};

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
 *
 * TODO: As of 4/17/2015, Userlike doesn't give access to the message body in events.
 * Revisit this/send it when they do.
 *
 */

Userlike.prototype.attachListeners = function(){
  var self = this;
  window.userlikeTrackingEvent = function(eventName, globalCtx, sessionCtx){
    if (eventName === 'chat_started') {
      self.analytics.track(
        'Live Chat Conversation Started',
        { agentId: sessionCtx.operator_id, agentName: sessionCtx.operator_name },
        { context: { integration: integration }
      });
    }
    if (eventName === 'message_operator_terminating') {
      self.analytics.track(
        'Live Chat Message Sent',
        { agentId: sessionCtx.operator_id, agentName: sessionCtx.operator_name },
        { context: { integration: integration }
      });
    }
    if (eventName === 'message_client_terminating') {
      self.analytics.track(
        'Live Chat Message Received',
        { agentId: sessionCtx.operator_id, agentName: sessionCtx.operator_name },
        { context: { integration: integration }
      });
    }
    if (eventName === 'chat_quit') {
      self.analytics.track(
        'Live Chat Conversation Ended',
        { agentId: sessionCtx.operator_id, agentName: sessionCtx.operator_name },
        { context: { integration: integration }
      });
    }
  };
};
