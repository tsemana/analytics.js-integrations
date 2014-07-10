
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');
var clone = require('clone');
var each = require('each');
var when = require('when');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(LiveChat);
};

/**
 * Expose `LiveChat` integration.
 */

var LiveChat = exports.Integration = integration('LiveChat')
  .assumesPageview()
  .global('__lc')
  .global('__lc_inited')
  .global('LC_API')
  .global('LC_Invite')
  .option('group', 0)
  .option('license', '')
  .tag('<script src="//cdn.livechatinc.com/tracking.js">');

/**
 * Initialize.
 *
 * http://www.livechatinc.com/api/javascript-api
 *
 * @param {Object} page
 */

LiveChat.prototype.initialize = function(page){
  var self = this;
  window.__lc = clone(this.options);
  this.load(function(){
    when(function(){ return self.loaded(); }, self.ready);
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
