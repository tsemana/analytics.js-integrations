var integration = require('integration');
var is = require('is');
var extend = require('extend');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics) {
  analytics.addIntegration(RollbarIntegration);
};


/**
 * Expose `Rollbar` integration.
 */

var RollbarIntegration = exports.Integration = integration('Rollbar')
  .readyOnInitialize()
  .global('Rollbar')
  .option('identify', true)
  .option('accessToken', '')
  .option('environment', 'unknown')
  .option('captureUncaught', true);


/**
 * Initialize.
 *
 * @param {Object} page
 */
RollbarIntegration.prototype.initialize = function(page) {
  this.load();
};


/**
 * Loaded?
 *
 * @return {Boolean}
 */

RollbarIntegration.prototype.loaded = function() {
  // The notifier is loaded right away as far as Segment.io is concerned
  return is.object(window.Rollbar);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

RollbarIntegration.prototype.load = function(callback) {
  var options = this.options;

  var _rollbarConfig = {
    globalAlias: options.globalAlias,
    accessToken: options.accessToken,
    captureUncaught: options.captureUncaught,
    payload: {
      environment: options.environment
    }
  };

  //
  // NOTE(cory): loadFull() is called with immediate == 1 in this snippet
  // since the callback will be called asynchronously below.
  //

  !function(a,b){function c(b){this.shimId=++f,this.notifier=null,this.parentShim=b,this.logger=function(){},a.console&&void 0===a.console.shimId&&(this.logger=a.console.log)}function d(b){var d=c;return e(function(){if(this.notifier)return this.notifier[b].apply(this.notifier,arguments);var c=this,e="scope"===b;e&&(c=new d(this));var f=Array.prototype.slice.call(arguments,0),g={shim:c,method:b,args:f,ts:new Date};return a._rollbarShimQueue.push(g),e?c:void 0})}function e(a,b){return b=b||this.logger,function(){try{return a.apply(this,arguments)}catch(c){b("Rollbar internal error:",c)}}}var f=0;c.init=function(a,b){var d=b.globalAlias||"Rollbar";if("object"==typeof a[d])return a[d];a._rollbarShimQueue=[],b=b||{};var f=new c;return e(function(){if(f.configure(b),b.captureUncaught){var c=a.onerror;a.onerror=function(){f.uncaughtError.apply(f,arguments),c&&c.apply(a,arguments)}}return a[d]=f,f},f.logger)()},c.prototype.loadFull=function(a,b,c,d){var f=e(function(){var a=b.createElement("script"),e=b.getElementsByTagName("script")[0];a.src=d.rollbarJsUrl,a.async=!c,a.onload=g,e.parentNode.insertBefore(a,e)},this.logger),g=e(function(){if(void 0===a._rollbarPayloadQueue)for(var b,c,d,e,f=new Error("rollbar.js did not load");b=a._rollbarShimQueue.shift();)for(d=b.args,e=0;e<d.length;++e)if(c=d[e],"function"==typeof c){c(f);break}},this.logger);e(function(){c?f():a.addEventListener?a.addEventListener("load",f,!1):a.attachEvent("onload",f)},this.logger)()};for(var g="log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError".split(","),h=0;h<g.length;++h)c.prototype[g[h]]=d(g[h]);var i="//d37gvrvc0wt4s1.cloudfront.net/js/v1.0/rollbar.min.js";_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||i;var j=c.init(a,_rollbarConfig);j.loadFull(a,b,1,_rollbarConfig)}(window,document);

  // Rollbar is available for use right away, before the full notifier is loaded.
  return callback();
};


/**
 * Identify.
 * 
 * @param {Identify} identify
 */
RollbarIntegration.prototype.identify = function(identify) {
  // do stuff with `id` or `traits`
  if (!this.options.identify) return;

  var globalAlias = this.options.globalAlias || 'Rollbar';
  var rollbar = window[globalAlias];
  var person = {id: identify.userId()};
  extend(person, identify.traits());
  rollbar.configure({payload: {person: person}});
};
