
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration@add/tags');
var onbody = require('on-body');
var domify = require('domify');
var extend = require('extend');
var bind = require('bind');
var when = require('when');

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Bing);
};

/**
 * HOP.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * 
 */

var noop = function(){};

/**
 * Expose `Bing`.
 *
 * https://bingads.microsoft.com/campaign/signup
 */

var Bing = exports.Integration = integration('Bing Ads')
  .option('siteId', '')
  .option('domainId', '')
  .option('events', {})
  .tag('<script id="mstag_tops" src="//flex.msn.com/mstag/site/{{ siteId }}/mstag.js">');

/**
 * Initialize.
 *
 * http://msdn.microsoft.com/en-us/library/bing-ads-campaign-management-campaign-analytics-scripts.aspx
 *
 * @param {Object} page
 */

Bing.prototype.initialize = function(page){
  if (!window.mstag) {
    window.mstag = {
      loadTag: noop,
      time: (new Date()).getTime(),
      // they use document.write, which doesn't work when loaded async.
      // they provide a way to override it.
      // the first time it is called, load the script,
      // and only when that script is done, is "loading" done.
      _write: writeToAppend
    };
  };
  var self = this;
  onbody(function(){
    self.load(function(){
      var loaded = bind(self, self.loaded);

      // poll until this.loaded() is true.
      // have to do a weird hack like this because
      // the first script loads a second script,
      // and only after the second script is it actually loaded.
      when(loaded, self.ready);
    });
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Bing.prototype.loaded = function(){
  return !! (window.mstag && window.mstag.loadTag !== noop);
};

/**
 * Track.
 *
 * @param {Track} track
 */

Bing.prototype.track = function(track){
  var events = this.options.events;
  var traits = track.traits();
  var event = track.event();
  if (!has.call(events, event)) return;
  var goal = events[event];
  var revenue = track.revenue() || 0;
  window.mstag.loadTag('analytics', {
    domainId: this.options.domainId,
    revenue: revenue,
    dedup: '1',
    type: '1',
    actionid: goal
  });
};

/**
 * Convert `document.write` to `document.appendChild`.
 *
 * TODO: make into a component.
 *
 * @param {String} str
 */

function writeToAppend(str) {
  var first = document.getElementsByTagName('script')[0];
  var el = domify(str);
  // https://github.com/component/domify/issues/14
  if ('script' == el.tagName.toLowerCase() && el.getAttribute('src')) {
    var tmp = document.createElement('script');
    tmp.src = el.getAttribute('src'); 
    tmp.async = true;
    el = tmp;
  }
  document.body.appendChild(el);
}