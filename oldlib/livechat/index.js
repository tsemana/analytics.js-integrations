
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var clone = require('clone');
var each = require('each');
var Identify = require('facade').Identify;
var when = require('when');
var tick = require('next-tick');

/**
 * Expose `LiveChat` integration.
 */

var LiveChat = module.exports = integration('LiveChat')
  .assumesPageview()
  .global('__lc')
  .global('__lc_inited')
  .global('LC_API')
  .global('LC_Invite')
  .option('group', 0)
  .option('license', '')
  .option('listen', false)
  .tag('<script src="//cdn.livechatinc.com/tracking.js">');

/**
 * The context for this integration.
 */

var integration = {
  name: 'livechat',
  version: '1.0.0'
};

/**
 * Initialize.
 *
 * http://www.livechatinc.com/api/javascript-api
 *
 * @param {Object} page
 */

LiveChat.prototype.initialize = function(page){
  var self = this;
  var user = this.analytics.user();
  var identify = new Identify({
    userId: user.id(),
    traits: user.traits()
  });

  window.__lc = clone(this.options);
  window.__lc.visitor = {
    name: identify.name(),
    email: identify.email()
  };
  // listen is not an option we need from clone
  delete window.__lc.listen;

  this.load(function(){
    when(function(){
      return self.loaded();
    }, function(){
      if (self.options.listen) self.attachListeners();
      tick(self.ready);
    });
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

LiveChat.prototype.loaded = function(){
  return !!(window.LC_API && window.LC_Invite);
};

/**
 * Listen for chat events.
 */

LiveChat.prototype.attachListeners = function(){
  var self = this;
  window.LC_API = window.LC_API || {};
  window.LC_API.on_chat_started = function(data){
    self.analytics.track(
      'Live Chat Conversation Started',
      { agentName: data.agent_name },
      { context: { integration: integration }
    });
  };
  window.LC_API.on_message = function(data){
    if (data.user_type === 'visitor') {
      self.analytics.track(
        'Live Chat Message Sent',
        {},
        { context: { integration: integration }
      });
    } else {
      self.analytics.track(
        'Live Chat Message Received',
        { agentName: data.agent_name, agentUsername: data.agent_login },
        { context: { integration: integration }
      });
    }
  };
  window.LC_API.on_chat_ended = function(){
    self.analytics.track('Live Chat Conversation Ended');
  };
};

/**
 * Identify.
 *
 * @param {Identify} identify
 */

LiveChat.prototype.identify = function(identify){
  var traits = identify.traits({ userId: 'User ID' });
  window.LC_API.set_custom_variables(convert(traits));
};

/**
 * Convert a traits object into the format LiveChat requires.
 *
 * @param {Object} traits
 * @return {Array}
 */

function convert(traits){
  var arr = [];
  each(traits, function(key, value){
    arr.push({ name: key, value: value });
  });
  return arr;
}
