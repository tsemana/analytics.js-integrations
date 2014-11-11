
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var onbody = require('on-body');
var domify = require('domify');
var extend = require('extend');
var bind = require('bind');
var when = require('when');
var each = require('each');

/**
 * HOP.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Noop.
 */

var noop = function(){};

/**
 * Expose `Bing`.
 *
 * https://bingads.microsoft.com/campaign/signup
 */

var Bing = module.exports = integration('Bing Ads')
  .global('uetq')
  .option('tagId', '')
  .option('siteId', '')
  .option('domainId', '')
  .tag('universal','<script src="//bat.bing.com/bat.js">')
  .tag('campaign','<script id="mstag_tops" src="//flex.msn.com/mstag/site/{{ siteId }}/mstag.js">')
  .mapping('events');

/**
 * On `construct` swap any config-based methods to the proper implementation.
 */

Bing.on('construct', function(integration){
  if (integration.options.universal) {
    integration.initialize = integration.initializeUniversal;
    integration.loaded = integration.loadedUniversal;
    integration.track = integration.trackUniversal;
    integration.page = integration.pageUniversal;
  }
});

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
    self.load('campaign', function(){
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
  var events = this.events(track.event());
  var revenue = track.revenue() || 0;
  var self = this;
  each(events, function(goal){
    window.mstag.loadTag('analytics', {
      domainId: self.options.domainId,
      revenue: revenue,
      dedup: '1',
      type: '1',
      actionid: goal
    });
  });
};

/**
 * Initialize (Universal)
 *
 * inferred from their snippet
 * https://gist.github.com/sperand-io/8bef4207e9c66e1aa83b
 */

Bing.prototype.initializeUniversal = function(){
  var self = this;
  window.uetq = window.uetq || [];
  self.load('universal', function(){
    var setup = {
      ti: self.options.tagId,
      q: window.uetq
    };
    window.uetq = new UET(setup);
    self.ready();
  });
};

/**
 * Loaded? (Universal)
 *
 * Check for custom `push` method bestowed by UET constructor
 *
 * @return {Boolean}
 */

Bing.prototype.loadedUniversal = function(){
  return !! (window.uetq && window.uetq.push !== Array.prototype.push);
};

/**
 * Page (Universal)
 */

Bing.prototype.pageUniversal = function(){
  window.uetq.push("pageLoad");
};

/**
 * Track (Universal)
 *
 * Doesn't take a mapping - send all events then set goals based
 * on them retroactively: http://advertise.bingads.microsoft.com/en-us/uahelp-topic?market=en&project=Bing_Ads&querytype=topic&query=HLP_BA_PROC_UET.htm
 *
 * @param {Track} track
 */

Bing.prototype.trackUniversal = function(track){
  var event = {
    ea : 'track',
    el : track.event()
  };

  if (track.category()) event.ec = track.category();
  if (track.revenue()) event.ev = track.revenue();

  window.uetq.push(event);
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
