
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var utm = require('utm-params');
var top = require('top-domain');

/**
 * UMD ?
 */

var umd = 'function' == typeof define && define.amd;

/**
 * Source.
 */

var src = '//d24n15hnbwhuhn.cloudfront.net/libs/amplitude-2.1.0-min.js';

/**
 * Expose `Amplitude` integration.
 */

var Amplitude = module.exports = integration('Amplitude')
  .global('amplitude')
  .option('apiKey', '')
  .option('trackAllPages', false)
  .option('trackNamedPages', true)
  .option('trackCategorizedPages', true)
  .option('trackUtmProperties', true)
  .tag('<script src="' + src + '">');

/**
 * Initialize.
 *
 * https://github.com/amplitude/Amplitude-Javascript
 *
 * @param {Object} page
 */

Amplitude.prototype.initialize = function(page){
  // jscs:disable
  (function(e,t){var r=e.amplitude||{};r._q=[];function a(e){r[e]=function(){r._q.push([e].concat(Array.prototype.slice.call(arguments,0)))}}var i=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","setGlobalUserProperties"];for(var o=0;o<i.length;o++){a(i[o])}e.amplitude=r})(window,document);
  // jscs:enable

  this.setDomain(window.location.href);
  window.amplitude.init(this.options.apiKey, null, {
    includeUtm: this.options.trackUtmProperties
  });

  var self = this;
  if (umd) {
    window.require([src], function(amplitude){
      window.amplitude = amplitude;
      self.ready();
    });
    return;
  }

  this.load(function(){
    self.ready();
  });
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Amplitude.prototype.loaded = function(){
  return !! (window.amplitude && window.amplitude.options);
};

/**
 * Page.
 *
 * @param {Page} page
 */

Amplitude.prototype.page = function(page){
  var properties = page.properties();
  var category = page.category();
  var name = page.fullName();
  var opts = this.options;

  // all pages
  if (opts.trackAllPages) {
    this.track(page.track());
  }

  // categorized pages
  if (category && opts.trackCategorizedPages) {
    this.track(page.track(category));
  }

  // named pages
  if (name && opts.trackNamedPages) {
    this.track(page.track(name));
  }
};

/**
 * Identify.
 *
 * @param {Facade} identify
 */

Amplitude.prototype.identify = function(identify){
  var id = identify.userId();
  var traits = identify.traits();
  if (id) window.amplitude.setUserId(id);
  if (traits) window.amplitude.setUserProperties(traits);
};

/**
 * Track.
 *
 * @param {Track} event
 */

Amplitude.prototype.track = function(track){
  var props = track.properties();
  var event = track.event();
  var revenue = track.revenue();

  // track the event
  window.amplitude.logEvent(event, props);

  // also track revenue
  if (revenue) {
    window.amplitude.logRevenue(revenue, props.quantity, props.productId);
  }
};

/**
 * Set domain name to root domain
 *
 * @param {String} href
 */

Amplitude.prototype.setDomain = function(href){
  var domain = top(href);
  window.amplitude.setDomain(domain);
};

/**
 * Override device ID
 *
 * @param {String} deviceId
 */

Amplitude.prototype.setDeviceId = function(deviceId){
  if (deviceId) window.amplitude.setDeviceId(deviceId);
};
